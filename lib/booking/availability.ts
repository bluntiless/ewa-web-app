// Slot-generation engine.
//
// Produces the list of bookable 30-min slots for a given day by taking the
// configured weekly hours and subtracting every known busy interval:
//   - confirmed bookings made through this site
//   - Microsoft 365 busy times
//   - Apple/iCloud busy times
// A clash in ANY source removes the slot, which is what prevents double-booking.

import { fromZonedTime, toZonedTime } from "date-fns-tz"
import type { BookingSettings } from "./config"
import type { BusyInterval } from "./microsoft"

export interface Slot {
  // ISO UTC instants.
  start: string
  end: string
  // Local "HH:mm" label for display, in the settings timezone.
  label: string
}

function overlaps(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date): boolean {
  return aStart < bEnd && bStart < aEnd
}

// dateStr is "YYYY-MM-DD" representing a calendar day in the settings timezone.
export function generateSlotsForDate(
  dateStr: string,
  settings: BookingSettings,
  busy: BusyInterval[],
  now: Date = new Date(),
): Slot[] {
  const [year, month, day] = dateStr.split("-").map(Number)
  if (!year || !month || !day) return []

  // Determine the day-of-week in the target timezone.
  const noonUtcGuess = fromZonedTime(`${dateStr}T12:00:00`, settings.timezone)
  const zonedNoon = toZonedTime(noonUtcGuess, settings.timezone)
  const dayOfWeek = zonedNoon.getDay()

  const ranges = settings.weekly[dayOfWeek] ?? []
  if (!ranges.length) return []

  const slots: Slot[] = []
  const minBookable = new Date(now.getTime() + settings.minNoticeMinutes * 60_000)
  const maxBookable = new Date(now.getTime() + settings.maxAdvanceDays * 24 * 60 * 60_000)

  for (const range of ranges) {
    const [sh, sm] = range.start.split(":").map(Number)
    const [eh, em] = range.end.split(":").map(Number)

    // Walk the window in slotMinutes increments, building each slot from its
    // local wall-clock time converted to a UTC instant.
    let cursorMinutes = sh * 60 + sm
    const endMinutes = eh * 60 + em

    while (cursorMinutes + settings.slotMinutes <= endMinutes) {
      const startH = Math.floor(cursorMinutes / 60)
      const startM = cursorMinutes % 60
      const endTotal = cursorMinutes + settings.slotMinutes
      const endH = Math.floor(endTotal / 60)
      const endM = endTotal % 60

      const pad = (n: number) => String(n).padStart(2, "0")
      const startLocal = `${dateStr}T${pad(startH)}:${pad(startM)}:00`
      const endLocal = `${dateStr}T${pad(endH)}:${pad(endM)}:00`

      const startUtc = fromZonedTime(startLocal, settings.timezone)
      const endUtc = fromZonedTime(endLocal, settings.timezone)

      const withinNotice = startUtc >= minBookable
      const withinAdvance = startUtc <= maxBookable
      const isBusy = busy.some((b) => overlaps(startUtc, endUtc, b.start, b.end))

      if (withinNotice && withinAdvance && !isBusy) {
        slots.push({
          start: startUtc.toISOString(),
          end: endUtc.toISOString(),
          label: `${pad(startH)}:${pad(startM)}`,
        })
      }

      cursorMinutes += settings.slotMinutes
    }
  }

  return slots
}
