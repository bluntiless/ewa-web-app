// Safe, admin-triggered migration of plaintext candidate records from the
// legacy PUBLIC Blob store to the PRIVATE store.
//
// Stages (each must be run deliberately from the admin Data Security page):
//   1. status  — read-only inventory, nothing changes.
//   2. copy    — copy each public record into the private store, then read the
//                private copy back and compare SHA-256 hashes. Public copies
//                are NOT touched.
//   3. delete  — re-verify each private copy byte-for-byte, and only then
//                delete the matching public copy. Requires an explicit
//                confirmation phrase. Afterwards the old public URL is fetched
//                to confirm it no longer serves the record.
//
// Encrypted *.enc records are never in scope.

import {
  SENSITIVE_RECORD_TYPES,
  deleteBlobs,
  isPrivateStoreConfigured,
  listStore,
  putSensitive,
  readBlobBuffer,
  sha256,
  type StoredBlob,
} from "./secure-store"

export const DELETE_CONFIRMATION_PHRASE = "DELETE VERIFIED PUBLIC COPIES"

export interface TypeStatus {
  key: string
  label: string
  publicCount: number
  privateCount: number
  pendingCopy: number
}

export interface ItemResult {
  pathname: string
  outcome: "copied" | "verified" | "mismatch" | "missing-private" | "read-failed" | "deleted" | "still-public" | "error"
  detail?: string
}

async function inventory() {
  return Promise.all(
    SENSITIVE_RECORD_TYPES.map(async (type) => {
      const [pub, priv] = await Promise.all([listStore(type.prefix, "public"), listStore(type.prefix, "private")])
      const publicSensitive = pub.filter((b) => type.matches(b.pathname))
      const privateByPath = new Map(priv.filter((b) => type.matches(b.pathname)).map((b) => [b.pathname, b]))
      return { type, publicSensitive, privateByPath }
    }),
  )
}

export async function getMigrationStatus(): Promise<{ privateStoreConfigured: boolean; types: TypeStatus[] }> {
  const inv = await inventory()
  return {
    privateStoreConfigured: isPrivateStoreConfigured(),
    types: inv.map(({ type, publicSensitive, privateByPath }) => ({
      key: type.key,
      label: type.label,
      publicCount: publicSensitive.length,
      privateCount: privateByPath.size,
      pendingCopy: publicSensitive.filter((b) => !privateByPath.has(b.pathname)).length,
    })),
  }
}

function contentTypeFor(pathname: string) {
  return pathname.endsWith(".pdf") ? "application/pdf" : "application/json"
}

async function verifyPair(pub: StoredBlob, priv: StoredBlob | undefined): Promise<ItemResult & { publicBlob: StoredBlob }> {
  if (!priv) return { pathname: pub.pathname, outcome: "missing-private", publicBlob: pub }
  const [a, b] = await Promise.all([readBlobBuffer(pub), readBlobBuffer(priv)])
  if (!a || !b) return { pathname: pub.pathname, outcome: "read-failed", publicBlob: pub }
  return sha256(a) === sha256(b)
    ? { pathname: pub.pathname, outcome: "verified", publicBlob: pub }
    : { pathname: pub.pathname, outcome: "mismatch", publicBlob: pub }
}

/** Copy public → private and verify by hash. Never deletes anything. */
export async function copyToPrivate(limit = 50): Promise<ItemResult[]> {
  if (!isPrivateStoreConfigured()) throw new Error("Private Blob store is not configured")
  const results: ItemResult[] = []
  for (const { publicSensitive, privateByPath } of await inventory()) {
    for (const pub of publicSensitive) {
      if (results.length >= limit) return results
      if (privateByPath.has(pub.pathname)) continue
      try {
        const data = await readBlobBuffer(pub)
        if (!data) {
          results.push({ pathname: pub.pathname, outcome: "read-failed" })
          continue
        }
        await putSensitive(pub.pathname, data, { contentType: contentTypeFor(pub.pathname), allowOverwrite: true })
        const [priv] = (await listStore(pub.pathname, "private")).filter((b) => b.pathname === pub.pathname)
        const check = await verifyPair(pub, priv)
        results.push({ pathname: pub.pathname, outcome: check.outcome === "verified" ? "copied" : check.outcome })
      } catch (error) {
        results.push({ pathname: pub.pathname, outcome: "error", detail: (error as Error).message })
      }
    }
  }
  return results
}

/** Re-verify every public record against its private copy. Read-only. */
export async function verifyAll(): Promise<ItemResult[]> {
  const results: ItemResult[] = []
  for (const { publicSensitive, privateByPath } of await inventory()) {
    for (const pub of publicSensitive) {
      const { publicBlob: _p, ...r } = await verifyPair(pub, privateByPath.get(pub.pathname))
      results.push(r)
    }
  }
  return results
}

/**
 * Delete public copies whose private copy is verified identical in THIS call.
 * Anything not verified is skipped and left in place.
 */
export async function deleteVerifiedPublicCopies(limit = 50): Promise<ItemResult[]> {
  if (!isPrivateStoreConfigured()) throw new Error("Private Blob store is not configured")
  const results: ItemResult[] = []
  for (const { publicSensitive, privateByPath } of await inventory()) {
    for (const pub of publicSensitive) {
      if (results.length >= limit) return results
      const check = await verifyPair(pub, privateByPath.get(pub.pathname))
      if (check.outcome !== "verified") {
        results.push({ pathname: pub.pathname, outcome: check.outcome, detail: "Skipped — public copy kept" })
        continue
      }
      try {
        await deleteBlobs([pub])
        const res = await fetch(pub.url, { cache: "no-store" }).catch(() => null)
        results.push(
          res && res.ok
            ? { pathname: pub.pathname, outcome: "still-public", detail: `Old URL returned ${res.status} (CDN cache may take a few minutes to clear)` }
            : { pathname: pub.pathname, outcome: "deleted", detail: `Old URL now returns ${res?.status ?? "no response"}` },
        )
      } catch (error) {
        results.push({ pathname: pub.pathname, outcome: "error", detail: (error as Error).message })
      }
    }
  }
  return results
}

/** Confirm that no plaintext candidate record is still reachable by public URL. */
export async function checkOldUrls(): Promise<ItemResult[]> {
  const results: ItemResult[] = []
  for (const { publicSensitive } of await inventory()) {
    for (const pub of publicSensitive) {
      const res = await fetch(pub.url, { cache: "no-store" }).catch(() => null)
      results.push({
        pathname: pub.pathname,
        outcome: res && res.ok ? "still-public" : "deleted",
        detail: `HTTP ${res?.status ?? "no response"}`,
      })
    }
  }
  return results
}
