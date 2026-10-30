"use client"

import { useEffect, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"

function useMsRemaining(endDate: string): number | null {
  const [msLeft, setMsLeft] = useState<number | null>(null)

  useEffect(() => {
    const end = new Date(endDate).getTime()
    const tick = () => setMsLeft(Math.max(0, end - Date.now()))
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [endDate])

  return msLeft
}

// Hides its children once the promotion ends and asks the server for fresh
// (regular-price) content, so an open page never keeps showing the offer.
export function PromoExpiryGate({ endDate, children }: { endDate: string; children: ReactNode }) {
  const msLeft = useMsRemaining(endDate)
  const router = useRouter()
  const expired = msLeft === 0

  useEffect(() => {
    if (expired) router.refresh()
  }, [expired, router])

  if (expired) return null
  return <>{children}</>
}

const units = [
  { key: "days", label: "Days", ms: 86_400_000 },
  { key: "hours", label: "Hrs", ms: 3_600_000 },
  { key: "minutes", label: "Min", ms: 60_000 },
  { key: "seconds", label: "Sec", ms: 1_000 },
] as const

export function PromoCountdown({ endDate }: { endDate: string }) {
  const msLeft = useMsRemaining(endDate)

  let remaining = msLeft ?? 0
  const parts = units.map((unit) => {
    const value = Math.floor(remaining / unit.ms)
    remaining -= value * unit.ms
    return { ...unit, value }
  })

  const summary =
    msLeft === null
      ? "Offer ends soon"
      : `Offer ends in ${parts[0].value} days, ${parts[1].value} hours and ${parts[2].value} minutes`

  return (
    <div role="timer" aria-label={summary} className="flex items-center gap-1.5">
      {parts.map((part, i) => (
        <div key={part.key} className="flex items-center gap-1.5" aria-hidden="true">
          <div className="flex min-w-11 flex-col items-center rounded-md bg-blue-900 px-1.5 py-1 text-white">
            <span className="font-mono text-base font-extrabold leading-none tabular-nums">
              {msLeft === null ? "--" : String(part.value).padStart(2, "0")}
            </span>
            <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-300">
              {part.label}
            </span>
          </div>
          {i < parts.length - 1 && <span className="font-extrabold text-blue-900">:</span>}
        </div>
      ))}
    </div>
  )
}
