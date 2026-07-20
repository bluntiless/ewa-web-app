// Central configuration for the in-house call-booking system.
//
// These defaults can be overridden at runtime via a settings record stored in
// Blob (see lib/booking/store.ts -> getSettings). Editing here changes the
// fallback defaults used when no settings record exists yet.

export type WeeklyAvailability = {
  // 0 = Sunday ... 6 = Saturday. Each day maps to bookable time ranges in
  // 24h "HH:mm" local time. An empty array means "not bookable that day".
  [dayOfWeek: number]: { start: string; end: string }[]
}

export interface BookingSettings {
  // IANA timezone the availability hours are expressed in.
  timezone: string
  // Length of each bookable slot, in minutes.
  slotMinutes: number
  // Minimum notice before a slot can be booked, in minutes (e.g. no bookings
  // in the next 2 hours).
  minNoticeMinutes: number
  // How many days into the future bookings are allowed.
  maxAdvanceDays: number
  // Weekly recurring bookable hours.
  weekly: WeeklyAvailability
}

// Electricians typically work during the day, so the bookable window runs from
// lunchtime (1pm) through to the early evening (7pm), Monday to Friday.
export const DEFAULT_SETTINGS: BookingSettings = {
  timezone: "Europe/London",
  slotMinutes: 30,
  minNoticeMinutes: 120,
  maxAdvanceDays: 30,
  weekly: {
    0: [], // Sunday - closed
    1: [{ start: "13:00", end: "19:00" }], // Monday
    2: [{ start: "13:00", end: "19:00" }], // Tuesday
    3: [{ start: "13:00", end: "19:00" }], // Wednesday
    4: [{ start: "13:00", end: "19:00" }], // Thursday
    5: [{ start: "13:00", end: "19:00" }], // Friday
    6: [], // Saturday - closed
  },
}

// The meeting details attached to every booking.
export const MEETING = {
  title: "EWA Tracker — Phone Consultation",
  durationLabel: "30 minutes",
  description:
    "A 30-minute phone call with EWA Tracker Ltd to discuss your Experienced Worker Assessment route and eligibility. We will call you on the number you provided.",
  location: "Phone call",
}
