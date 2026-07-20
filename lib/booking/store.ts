// Persistence for call bookings and settings, backed by Vercel Blob.
//
// Mirrors the existing pattern used for eligibility checks / candidate
// background forms: each record is a JSON blob under a stable prefix, listed
// and read back on demand.

import { list, put, del } from "@vercel/blob"
import { DEFAULT_SETTINGS, type BookingSettings } from "./config"

const BOOKINGS_PREFIX = "call-bookings/"
const SETTINGS_PATH = "call-booking-settings/settings.json"

export type BookingStatus = "confirmed" | "cancelled"

export interface CallBooking {
  id: string
  name: string
  email: string
  phone: string
  notes?: string
  // ISO instants (UTC) for the slot.
  start: string
  end: string
  status: BookingStatus
  createdAt: string
  cancelledAt?: string
  // Microsoft Graph event id, so we can cancel it later.
  microsoftEventId?: string
}

export async function saveBooking(booking: CallBooking): Promise<void> {
  await put(`${BOOKINGS_PREFIX}${booking.id}.json`, JSON.stringify(booking), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  })
}

export async function getBooking(id: string): Promise<CallBooking | null> {
  try {
    const { blobs } = await list({ prefix: `${BOOKINGS_PREFIX}${id}.json` })
    if (!blobs.length) return null
    const res = await fetch(blobs[0].url, { cache: "no-store" })
    if (!res.ok) return null
    return (await res.json()) as CallBooking
  } catch (err) {
    console.error("[v0] getBooking error:", err)
    return null
  }
}

export async function listBookings(): Promise<CallBooking[]> {
  try {
    const { blobs } = await list({ prefix: BOOKINGS_PREFIX })
    const records = await Promise.all(
      blobs.map(async (b) => {
        try {
          const res = await fetch(b.url, { cache: "no-store" })
          if (!res.ok) return null
          return (await res.json()) as CallBooking
        } catch {
          return null
        }
      }),
    )
    return records
      .filter((r): r is CallBooking => r !== null)
      .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
  } catch (err) {
    console.error("[v0] listBookings error:", err)
    return []
  }
}

// Only confirmed bookings block out slots.
export async function listActiveBookings(): Promise<CallBooking[]> {
  return (await listBookings()).filter((b) => b.status === "confirmed")
}

export async function getSettings(): Promise<BookingSettings> {
  try {
    const { blobs } = await list({ prefix: SETTINGS_PATH })
    if (!blobs.length) return DEFAULT_SETTINGS
    const res = await fetch(blobs[0].url, { cache: "no-store" })
    if (!res.ok) return DEFAULT_SETTINGS
    const stored = (await res.json()) as Partial<BookingSettings>
    return { ...DEFAULT_SETTINGS, ...stored }
  } catch (err) {
    console.error("[v0] getSettings error:", err)
    return DEFAULT_SETTINGS
  }
}

export async function saveSettings(settings: BookingSettings): Promise<void> {
  await put(SETTINGS_PATH, JSON.stringify(settings), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  })
}

export async function deleteBookingRecord(id: string): Promise<void> {
  try {
    const { blobs } = await list({ prefix: `${BOOKINGS_PREFIX}${id}.json` })
    if (blobs.length) await del(blobs[0].url)
  } catch (err) {
    console.error("[v0] deleteBookingRecord error:", err)
  }
}
