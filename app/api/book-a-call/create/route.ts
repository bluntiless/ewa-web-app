import { NextResponse } from "next/server"
import { formatInTimeZone } from "date-fns-tz"
import { getSettings, saveBooking, type CallBooking } from "@/lib/booking/store"
import { getAllBusy } from "@/lib/booking/busy"
import { generateSlotsForDate } from "@/lib/booking/availability"
import { createMicrosoftEvent } from "@/lib/booking/microsoft"
import { sendBookingEmails } from "@/lib/booking/email"
import { MEETING } from "@/lib/booking/config"

export const dynamic = "force-dynamic"

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const name = String(body.name ?? "").trim()
    const email = String(body.email ?? "").trim()
    const phone = String(body.phone ?? "").trim()
    const notes = String(body.notes ?? "").trim()
    const start = String(body.start ?? "").trim()

    // Basic validation.
    if (!name || !email || !phone || !start) {
      return NextResponse.json({ error: "Please complete all required fields." }, { status: 400 })
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 })
    }

    const startDate = new Date(start)
    if (isNaN(startDate.getTime())) {
      return NextResponse.json({ error: "Invalid time slot." }, { status: 400 })
    }

    const settings = await getSettings()
    const now = new Date()

    // Re-validate the requested slot against a FRESH busy read. This closes the
    // race where two people load the page and pick the same slot: whoever's
    // request lands second will no longer find it in the generated free slots.
    const dateStr = formatInTimeZone(startDate, settings.timezone, "yyyy-MM-dd")
    const rangeStart = new Date(startDate.getTime() - 60 * 60_000)
    const rangeEnd = new Date(startDate.getTime() + settings.slotMinutes * 60_000 + 60 * 60_000)
    const busy = await getAllBusy(rangeStart, rangeEnd)
    const freeSlots = generateSlotsForDate(dateStr, settings, busy, now)

    const match = freeSlots.find((s) => s.start === startDate.toISOString())
    if (!match) {
      return NextResponse.json(
        { error: "Sorry, that time has just been taken. Please pick another slot." },
        { status: 409 },
      )
    }

    const endDate = new Date(match.end)
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

    // Write to Microsoft 365 first so we can store the event id for later
    // cancellation. Non-fatal if it fails (e.g. not yet configured).
    const microsoftEventId = await createMicrosoftEvent({
      subject: MEETING.title,
      body: `${MEETING.description}<br/><br/>Caller: ${name}<br/>Phone: ${phone}${
        notes ? `<br/>Notes: ${notes}` : ""
      }`,
      start: startDate,
      end: endDate,
      attendeeName: name,
      attendeeEmail: email,
      location: MEETING.location,
    })

    const booking: CallBooking = {
      id,
      name,
      email,
      phone,
      notes: notes || undefined,
      start: startDate.toISOString(),
      end: endDate.toISOString(),
      status: "confirmed",
      createdAt: new Date().toISOString(),
      microsoftEventId: microsoftEventId || undefined,
    }

    await saveBooking(booking)

    console.log(
      `[v0] booking saved id=${id} | microsoftEvent=${microsoftEventId ? "created" : "SKIPPED"} | resendConfigured=${Boolean(
        process.env.RESEND_API_KEY,
      )}`,
    )

    // Emails carry the .ics invite; failure here shouldn't lose the booking.
    try {
      await sendBookingEmails(booking, settings.timezone)
      console.log(`[v0] booking emails sent for id=${id}`)
    } catch (err) {
      console.error("[v0] sendBookingEmails failed (booking still saved):", err)
    }

    return NextResponse.json({
      success: true,
      booking: {
        id: booking.id,
        start: booking.start,
        end: booking.end,
      },
    })
  } catch (err) {
    console.error("[v0] create booking error:", err)
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 })
  }
}
