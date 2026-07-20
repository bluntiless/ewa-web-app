// Aggregates busy intervals from every source we honour when generating slots:
//   - confirmed site bookings
//   - Microsoft 365 calendar
//   - Apple / iCloud calendar
// External calendar failures degrade to [] so the booking page stays up.

import { getMicrosoftBusy, type BusyInterval } from "./microsoft"
import { getAppleBusy } from "./apple"
import { listActiveBookings } from "./store"

export async function getAllBusy(rangeStart: Date, rangeEnd: Date): Promise<BusyInterval[]> {
  const [siteBookings, microsoft, apple] = await Promise.all([
    listActiveBookings(),
    getMicrosoftBusy(rangeStart, rangeEnd),
    getAppleBusy(rangeStart, rangeEnd),
  ])

  const siteBusy: BusyInterval[] = siteBookings.map((b) => ({
    start: new Date(b.start),
    end: new Date(b.end),
  }))

  return [...siteBusy, ...microsoft, ...apple]
}
