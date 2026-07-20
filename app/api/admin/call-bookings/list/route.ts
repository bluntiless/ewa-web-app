import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { listBookings } from "@/lib/booking/store"
import { getSettings } from "@/lib/booking/store"

// Reads the per-request session; must run per-request, never prerendered.
export const dynamic = "force-dynamic"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const [bookings, settings] = await Promise.all([listBookings(), getSettings()])
    return NextResponse.json({ bookings, timezone: settings.timezone })
  } catch (err) {
    console.error("[v0] call-bookings list error:", err)
    return NextResponse.json({ error: "Failed to load bookings" }, { status: 500 })
  }
}
