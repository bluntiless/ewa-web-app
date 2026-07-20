import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getBooking, saveBooking, getSettings } from "@/lib/booking/store"
import { cancelMicrosoftEvent } from "@/lib/booking/microsoft"
import { sendCancellationEmails } from "@/lib/booking/email"

// Reads the per-request session; must run per-request, never prerendered.
export const dynamic = "force-dynamic"

// Cancel a booking: frees the slot, removes the Microsoft event, and emails a
// cancellation (with a CANCEL .ics) to you and the booker.
export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params
    const booking = await getBooking(id)
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    if (booking.status === "cancelled") {
      return NextResponse.json({ success: true, alreadyCancelled: true })
    }

    if (booking.microsoftEventId) {
      await cancelMicrosoftEvent(booking.microsoftEventId)
    }

    booking.status = "cancelled"
    booking.cancelledAt = new Date().toISOString()
    await saveBooking(booking)

    try {
      const settings = await getSettings()
      await sendCancellationEmails(booking, settings.timezone)
    } catch (err) {
      console.error("[v0] sendCancellationEmails failed (booking still cancelled):", err)
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[v0] cancel booking error:", err)
    return NextResponse.json({ error: "Failed to cancel booking" }, { status: 500 })
  }
}
