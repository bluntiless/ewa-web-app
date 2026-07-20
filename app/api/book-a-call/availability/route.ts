import { NextResponse } from "next/server"
import { addDays } from "date-fns"
import { formatInTimeZone } from "date-fns-tz"
import { getSettings } from "@/lib/booking/store"
import { getAllBusy } from "@/lib/booking/busy"
import { generateSlotsForDate, type Slot } from "@/lib/booking/availability"

// Availability depends on live calendar state, so never prerender/cache.
export const dynamic = "force-dynamic"

// Returns, for the whole bookable window, each date that has at least one free
// 30-min slot (accounting for site bookings + Microsoft + Apple busy times).
// The client renders a date picker from `days` and the slot list per date.
export async function GET() {
  try {
    const settings = await getSettings()
    const now = new Date()

    // Range covers from now to the max advance horizon.
    const rangeStart = now
    const rangeEnd = new Date(now.getTime() + settings.maxAdvanceDays * 24 * 60 * 60_000)

    // One busy fetch for the whole window, reused across all days.
    const busy = await getAllBusy(rangeStart, rangeEnd)

    const days: { date: string; slots: Slot[] }[] = []
    for (let i = 0; i <= settings.maxAdvanceDays; i++) {
      const dayDate = addDays(now, i)
      const dateStr = formatInTimeZone(dayDate, settings.timezone, "yyyy-MM-dd")
      const slots = generateSlotsForDate(dateStr, settings, busy, now)
      if (slots.length > 0) {
        days.push({ date: dateStr, slots })
      }
    }

    return NextResponse.json({
      timezone: settings.timezone,
      slotMinutes: settings.slotMinutes,
      days,
    })
  } catch (err) {
    console.error("[v0] availability route error:", err)
    return NextResponse.json({ error: "Failed to load availability" }, { status: 500 })
  }
}
