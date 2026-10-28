"use client"

import { useState } from "react"
import Link from "next/link"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertCircle, CheckCircle2, ChevronLeft, RefreshCw, ShieldCheck } from "lucide-react"

const CONFIRM_PHRASE = "DELETE VERIFIED PUBLIC COPIES"

interface TypeStatus {
  key: string
  label: string
  publicCount: number
  privateCount: number
  pendingCopy: number
}

interface ItemResult {
  pathname: string
  outcome: string
  detail?: string
}

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || "Request failed")
  return res.json()
}

const GOOD = new Set(["copied", "verified", "deleted"])

export default function DataSecurityDashboard() {
  const { data, error, isLoading, mutate } = useSWR<{ privateStoreConfigured: boolean; types: TypeStatus[] }>(
    "/api/admin/data-security/migration",
    fetcher,
  )
  const [running, setRunning] = useState<string | null>(null)
  const [results, setResults] = useState<{ action: string; items: ItemResult[] } | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [confirm, setConfirm] = useState("")

  async function run(action: string) {
    setRunning(action)
    setActionError(null)
    try {
      const res = await fetch("/api/admin/data-security/migration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, confirm: action === "delete-public" ? confirm : undefined }),
      })
      const body = await res.json()
      if (!res.ok) throw new Error(body.error || "Action failed")
      setResults({ action, items: body.results })
      if (action === "delete-public") setConfirm("")
      await mutate()
    } catch (err) {
      setActionError((err as Error).message)
    } finally {
      setRunning(null)
    }
  }

  const totalPublic = data?.types.reduce((n, t) => n + t.publicCount, 0) ?? 0
  const totalPending = data?.types.reduce((n, t) => n + t.pendingCopy, 0) ?? 0
  const issues = results?.items.filter((i) => !GOOD.has(i.outcome)) ?? []

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Data Security</h1>
            <p className="text-sm text-gray-500">Move candidate records to private storage</p>
          </div>
          <Link href="/admin/eligibility-checks">
            <Button variant="ghost" size="sm">
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back to dashboard
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 flex flex-col gap-6">
        {data && !data.privateStoreConfigured && (
          <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 flex gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" aria-hidden="true" />
            <p>
              The private Blob store is not connected yet. Create a <strong>private</strong> Blob store in Vercel,
              connect it to this project with the environment variable prefix <code>PRIVATE</code> (so it provides{" "}
              <code>PRIVATE_READ_WRITE_TOKEN</code>), then redeploy. Until then, new submissions continue to be
              saved exactly as before.
            </p>
          </div>
        )}

        <section className="bg-white rounded-lg border border-gray-200">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">Current storage</h2>
            <Button variant="outline" size="sm" onClick={() => mutate()} disabled={isLoading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} aria-hidden="true" />
              Refresh
            </Button>
          </div>
          {error && <p className="p-4 text-sm text-red-600">{error.message}</p>}
          {data && (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="text-left font-medium px-4 py-2">Record type</th>
                  <th className="text-right font-medium px-4 py-2">Public copies</th>
                  <th className="text-right font-medium px-4 py-2">Private copies</th>
                  <th className="text-right font-medium px-4 py-2">Awaiting copy</th>
                </tr>
              </thead>
              <tbody>
                {data.types.map((t) => (
                  <tr key={t.key} className="border-t border-gray-100">
                    <td className="px-4 py-2 text-gray-900">{t.label}</td>
                    <td className="px-4 py-2 text-right tabular-nums">{t.publicCount}</td>
                    <td className="px-4 py-2 text-right tabular-nums">{t.privateCount}</td>
                    <td className="px-4 py-2 text-right tabular-nums">{t.pendingCopy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {data && totalPublic === 0 && (
            <p className="p-4 text-sm text-green-700 flex items-center gap-2 border-t border-gray-100">
              <ShieldCheck className="w-4 h-4" aria-hidden="true" />
              No plaintext candidate records remain in public storage.
            </p>
          )}
        </section>

        <section className="bg-white rounded-lg border border-gray-200 p-4 flex flex-col gap-4">
          <h2 className="font-semibold text-gray-900">Migration steps</h2>

          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium text-gray-900">1. Copy to private storage</p>
            <p className="text-sm text-gray-600">
              Copies each record and checks the copy is byte-for-byte identical. Public copies are not touched.
              Processes up to 50 records per run — repeat until nothing is awaiting copy ({totalPending} remaining).
            </p>
            <div>
              <Button
                size="sm"
                onClick={() => run("copy")}
                disabled={!!running || !data?.privateStoreConfigured || totalPending === 0}
              >
                {running === "copy" ? "Copying…" : "Copy records"}
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium text-gray-900">2. Verify</p>
            <p className="text-sm text-gray-600">Re-checks every public record against its private copy. Read-only.</p>
            <div>
              <Button size="sm" variant="outline" onClick={() => run("verify")} disabled={!!running}>
                {running === "verify" ? "Verifying…" : "Verify copies"}
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-gray-900">3. Remove public copies</p>
            <p className="text-sm text-gray-600">
              Deletes a public copy <strong>only</strong> if its private copy is verified identical at that moment,
              then checks the old public link no longer works. Anything not verified is kept. Type{" "}
              <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">{CONFIRM_PHRASE}</code> to enable.
            </p>
            <label htmlFor="confirm-phrase" className="sr-only">
              Confirmation phrase
            </label>
            <Input
              id="confirm-phrase"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder={CONFIRM_PHRASE}
              className="max-w-sm"
              autoComplete="off"
            />
            <div>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => run("delete-public")}
                disabled={!!running || confirm !== CONFIRM_PHRASE || !data?.privateStoreConfigured}
              >
                {running === "delete-public" ? "Removing…" : "Remove verified public copies"}
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium text-gray-900">4. Confirm old links are dead</p>
            <p className="text-sm text-gray-600">Requests every remaining public URL to confirm none still serve data.</p>
            <div>
              <Button size="sm" variant="outline" onClick={() => run("check-urls")} disabled={!!running}>
                {running === "check-urls" ? "Checking…" : "Check old URLs"}
              </Button>
            </div>
          </div>

          {actionError && (
            <p role="alert" className="text-sm text-red-600">
              {actionError}
            </p>
          )}
        </section>

        {results && (
          <section className="bg-white rounded-lg border border-gray-200" aria-live="polite">
            <div className="p-4 border-b border-gray-200 flex items-center gap-2">
              {issues.length === 0 ? (
                <CheckCircle2 className="w-5 h-5 text-green-600" aria-hidden="true" />
              ) : (
                <AlertCircle className="w-5 h-5 text-amber-600" aria-hidden="true" />
              )}
              <h2 className="font-semibold text-gray-900">
                {results.items.length} record(s) processed, {issues.length} need attention
              </h2>
            </div>
            <ul className="divide-y divide-gray-100 max-h-96 overflow-y-auto text-sm">
              {results.items.map((item) => (
                <li key={item.pathname} className="px-4 py-2 flex items-start justify-between gap-4">
                  <span className="font-mono text-xs text-gray-700 break-all">{item.pathname}</span>
                  <span className={`shrink-0 text-right ${GOOD.has(item.outcome) ? "text-green-700" : "text-amber-700"}`}>
                    {item.outcome}
                    {item.detail && <span className="block text-xs text-gray-500">{item.detail}</span>}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </div>
  )
}
