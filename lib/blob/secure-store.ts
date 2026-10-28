// Storage for records that contain readable (unencrypted) personal information.
//
// These records are written to a PRIVATE Vercel Blob store, which has no
// publicly reachable URLs: every read must go through this server code with
// the private store's token. Encrypted records (*.enc for bookings, invoices,
// legacy Skills Scan questionnaires, entry tests) are intentionally NOT handled
// here — they stay exactly where and how they are today.
//
// Transition behaviour:
// - Writes go to the private store when PRIVATE_BLOB_READ_WRITE_TOKEN is set.
//   Until then they fall back to the existing public store, so public forms
//   keep working while the private store is being set up.
// - Reads/lists merge both stores (private wins on the same pathname), so
//   records not yet migrated stay visible in the admin dashboard.

import { del, get, list, put } from "@vercel/blob"
import { createHash } from "node:crypto"

export type StoreKind = "private" | "public"

export interface StoredBlob {
  pathname: string
  url: string
  uploadedAt: Date
  size: number
  store: StoreKind
}

/** Records that contain plaintext personal information and must be private. */
export const SENSITIVE_RECORD_TYPES = [
  {
    key: "eligibility",
    label: "Eligibility checks",
    prefix: "eligibility-checks/",
    matches: (p: string) => p.endsWith("/metadata.json"),
  },
  {
    key: "candidate-background",
    label: "Candidate background forms",
    prefix: "candidate-background-submissions/",
    matches: (p: string) => p.endsWith("/metadata.json") || p.endsWith("/completed.pdf"),
  },
  {
    key: "skills-scan",
    label: "Skills Scan PDF submissions",
    prefix: "skills-scan-submissions/",
    matches: (p: string) => p.endsWith("/metadata.json") || p.endsWith("/completed.pdf"),
  },
  {
    key: "call-bookings",
    label: "Call bookings",
    prefix: "call-bookings/",
    matches: (p: string) => p.endsWith(".json"),
  },
  {
    key: "invoice-pdfs",
    label: "Invoice PDFs",
    prefix: "invoices/",
    matches: (p: string) => p.endsWith("/invoice.pdf"),
  },
] as const

export function isSensitivePathname(pathname: string): boolean {
  return SENSITIVE_RECORD_TYPES.some((t) => pathname.startsWith(t.prefix) && t.matches(pathname))
}

function privateToken(): string | undefined {
  return process.env.PRIVATE_BLOB_READ_WRITE_TOKEN || undefined
}

export function isPrivateStoreConfigured(): boolean {
  return Boolean(privateToken())
}

let warnedFallback = false

/** Write a sensitive record. Private store when configured, otherwise legacy public store. */
export async function putSensitive(
  pathname: string,
  body: string | Buffer,
  options: { contentType: string; allowOverwrite?: boolean },
): Promise<{ pathname: string; store: StoreKind }> {
  const token = privateToken()
  if (token) {
    await put(pathname, body, {
      access: "private",
      token,
      contentType: options.contentType,
      addRandomSuffix: false,
      allowOverwrite: options.allowOverwrite ?? false,
    })
    return { pathname, store: "private" }
  }

  if (!warnedFallback) {
    warnedFallback = true
    console.warn(
      "[secure-store] PRIVATE_BLOB_READ_WRITE_TOKEN is not set — sensitive records are still being written to the PUBLIC store.",
    )
  }
  await put(pathname, body, {
    access: "public",
    contentType: options.contentType,
    addRandomSuffix: false,
    allowOverwrite: options.allowOverwrite ?? false,
  })
  return { pathname, store: "public" }
}

async function listAll(prefix: string, store: StoreKind): Promise<StoredBlob[]> {
  const token = store === "private" ? privateToken() : undefined
  if (store === "private" && !token) return []

  const results: StoredBlob[] = []
  let cursor: string | undefined
  do {
    const page = await list({ prefix, cursor, limit: 1000, ...(token ? { token } : {}) })
    for (const b of page.blobs) {
      results.push({ pathname: b.pathname, url: b.url, uploadedAt: b.uploadedAt, size: b.size, store })
    }
    cursor = page.hasMore ? page.cursor : undefined
  } while (cursor)
  return results
}

/** List blobs in a single store (used by the migration tool). */
export async function listStore(prefix: string, store: StoreKind): Promise<StoredBlob[]> {
  return listAll(prefix, store)
}

/** List blobs under a prefix across both stores. Private copy wins on the same pathname. */
export async function listMerged(prefix: string): Promise<StoredBlob[]> {
  const [priv, pub] = await Promise.all([listAll(prefix, "private"), listAll(prefix, "public")])
  const byPath = new Map<string, StoredBlob>()
  for (const b of pub) byPath.set(b.pathname, b)
  for (const b of priv) byPath.set(b.pathname, b)
  return Array.from(byPath.values())
}

/** Find a single blob by exact pathname across both stores. */
export async function findBlob(pathname: string): Promise<StoredBlob | null> {
  const blobs = await listMerged(pathname)
  return blobs.find((b) => b.pathname === pathname) ?? null
}

/** Read a blob's bytes from whichever store holds it. */
export async function readBlobBuffer(blob: StoredBlob): Promise<Buffer | null> {
  if (blob.store === "private") {
    const result = await get(blob.pathname, { access: "private", token: privateToken(), useCache: false })
    if (!result || result.statusCode !== 200) return null
    return Buffer.from(await new Response(result.stream).arrayBuffer())
  }
  const res = await fetch(blob.url, { cache: "no-store" })
  if (!res.ok) return null
  return Buffer.from(await res.arrayBuffer())
}

export async function readBlobText(blob: StoredBlob): Promise<string | null> {
  const buf = await readBlobBuffer(blob)
  return buf ? buf.toString("utf8") : null
}

export async function readBlobJSON<T>(blob: StoredBlob): Promise<T | null> {
  const text = await readBlobText(blob)
  return text ? (JSON.parse(text) as T) : null
}

/** Delete blobs from whichever store each one lives in. */
export async function deleteBlobs(blobs: StoredBlob[]): Promise<void> {
  const priv = blobs.filter((b) => b.store === "private").map((b) => b.url)
  const pub = blobs.filter((b) => b.store === "public").map((b) => b.url)
  if (priv.length) await del(priv, { token: privateToken() })
  if (pub.length) await del(pub)
}

export function sha256(buf: Buffer): string {
  return createHash("sha256").update(buf).digest("hex")
}

/**
 * Admin-only download link for a stored file. The admin dashboard uses this
 * instead of a raw Blob URL, so files are always streamed through an
 * authenticated server route.
 */
export function adminFileUrl(pathname: string): string {
  return `/api/admin/files?pathname=${encodeURIComponent(pathname)}`
}
