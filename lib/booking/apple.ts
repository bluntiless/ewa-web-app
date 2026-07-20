// Apple / iCloud calendar integration (read-only, for busy-time detection).
//
// Uses CalDAV via tsdav with an Apple ID + app-specific password (generate at
// appleid.apple.com > Sign-In and Security > App-Specific Passwords). We only
// READ busy times here; new bookings are written to Microsoft 365 and also sent
// to you as an .ics invite, which adds them to Apple Calendar on accept.
//
// Env vars:
//   APPLE_ID           - your iCloud email
//   APPLE_APP_PASSWORD - an app-specific password (NOT your main password)
//
// Degrades gracefully: any failure returns [] so a CalDAV outage never blocks
// bookings or takes the page down.

import { DAVClient } from "tsdav"
import type { BusyInterval } from "./microsoft"

export function appleConfigured(): boolean {
  return Boolean(process.env.APPLE_ID && process.env.APPLE_APP_PASSWORD)
}

// Parse an iCalendar date value into a JS Date.
// Handles: "20260101T130000Z" (UTC), "20260101T130000" (floating/local-ish),
// and "20260101" (all-day). All-day and floating values are treated as UTC,
// which is a safe over-approximation for busy detection.
function parseIcsDate(value: string): Date | null {
  const clean = value.trim()
  const utcMatch = clean.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z?$/)
  if (utcMatch) {
    const [, y, mo, d, h, mi, s] = utcMatch
    return new Date(Date.UTC(+y, +mo - 1, +d, +h, +mi, +s))
  }
  const dateMatch = clean.match(/^(\d{4})(\d{2})(\d{2})$/)
  if (dateMatch) {
    const [, y, mo, d] = dateMatch
    return new Date(Date.UTC(+y, +mo - 1, +d, 0, 0, 0))
  }
  return null
}

// Pull the value of a property line like "DTSTART;TZID=...:20260101T130000".
function extractProp(ics: string, prop: string): string | null {
  const regex = new RegExp(`^${prop}(?:;[^:]*)?:(.+)$`, "im")
  const match = ics.match(regex)
  return match ? match[1] : null
}

export async function getAppleBusy(rangeStart: Date, rangeEnd: Date): Promise<BusyInterval[]> {
  if (!appleConfigured()) return []

  try {
    const client = new DAVClient({
      serverUrl: "https://caldav.icloud.com",
      credentials: {
        username: process.env.APPLE_ID!,
        password: process.env.APPLE_APP_PASSWORD!,
      },
      authMethod: "Basic",
      defaultAccountType: "caldav",
    })

    await client.login()
    const calendars = await client.fetchCalendars()
    const busy: BusyInterval[] = []

    for (const calendar of calendars) {
      // Only consider calendars that support VEVENT.
      const comps = (calendar.components as string[] | undefined) ?? []
      if (comps.length && !comps.includes("VEVENT")) continue

      let objects: { data?: string }[] = []
      try {
        objects = await client.fetchCalendarObjects({
          calendar,
          timeRange: {
            start: rangeStart.toISOString(),
            end: rangeEnd.toISOString(),
          },
        })
      } catch (err) {
        console.error("[v0] Apple fetchCalendarObjects error for calendar:", calendar.displayName, err)
        continue
      }

      for (const obj of objects) {
        if (!obj.data) continue
        // A single object can contain multiple VEVENTs; handle each.
        const blocks = obj.data.split("BEGIN:VEVENT").slice(1)
        for (const block of blocks) {
          const startRaw = extractProp("BEGIN:VEVENT" + block, "DTSTART")
          const endRaw = extractProp("BEGIN:VEVENT" + block, "DTEND")
          if (!startRaw || !endRaw) continue
          const start = parseIcsDate(startRaw)
          const end = parseIcsDate(endRaw)
          if (!start || !end) continue
          busy.push({ start, end })
        }
      }
    }

    return busy
  } catch (err) {
    console.error("[v0] Apple CalDAV connection error:", err)
    return []
  }
}
