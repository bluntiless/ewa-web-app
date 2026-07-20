// Booking confirmation + cancellation emails, sent via Resend.
//
// Reuses the same Resend setup as the invoice emails (RESEND_API_KEY +
// RESEND_FROM_EMAIL) and sends notifications to ADMIN_EMAIL — the same address
// used for the rest of the site's notifications.
//
// Every message carries an .ics attachment so opening it on iPhone / MacBook
// (Apple Mail), Gmail, or Outlook drops the call straight into the calendar.

import { formatInTimeZone } from "date-fns-tz"
import { buildIcs, type IcsEvent } from "./ics"
import { MEETING } from "./config"
import type { CallBooking } from "./store"

const FROM = process.env.RESEND_FROM_EMAIL || "EWA Tracker <bookings@ewatracker.co.uk>"
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@ewatracker.co.uk"
const ORGANIZER_EMAIL = (FROM.match(/<(.+)>/)?.[1] || FROM).trim()

async function getResend() {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) throw new Error("RESEND_API_KEY environment variable is not set")
  const { Resend } = await import("resend")
  return new Resend(apiKey)
}

function humanDate(iso: string, tz: string): string {
  return formatInTimeZone(new Date(iso), tz, "EEEE d MMMM yyyy 'at' HH:mm")
}

// Base64-encode a UTF-8 string for Resend attachment content.
function toBase64(text: string): string {
  return Buffer.from(text, "utf-8").toString("base64")
}

export async function sendBookingEmails(booking: CallBooking, tz: string): Promise<void> {
  const resend = await getResend()
  const when = humanDate(booking.start, tz)

  const icsEvent: IcsEvent = {
    uid: `${booking.id}@ewatracker.co.uk`,
    start: new Date(booking.start),
    end: new Date(booking.end),
    summary: MEETING.title,
    description:
      `${MEETING.description}\n\n` +
      `Caller: ${booking.name}\n` +
      `Phone: ${booking.phone}\n` +
      `Email: ${booking.email}\n\n` +
      `Electrical experience: ${booking.experience ?? "-"}\n` +
      `Holds 18th Edition (BS 7671): ${booking.has18thEdition ?? "-"}\n` +
      `Holds Inspection & Testing: ${booking.hasInspectionTesting ?? "-"}` +
      (booking.notes ? `\n\nNotes: ${booking.notes}` : ""),
    location: MEETING.location,
    organizerName: "EWA Tracker Ltd",
    organizerEmail: ORGANIZER_EMAIL,
    attendeeName: booking.name,
    attendeeEmail: booking.email,
    method: "REQUEST",
    sequence: 0,
  }
  const ics = buildIcs(icsEvent)
  const attachments = [
    {
      // A .ics with a filename + calendar content type is what triggers the
      // "add to calendar" behaviour across mail clients.
      filename: "invite.ics",
      content: toBase64(ics),
      contentType: "text/calendar; method=REQUEST",
    },
  ]

  // Notification to you (the business).
  const adminRes = await resend.emails.send({
    from: FROM,
    to: [ADMIN_EMAIL],
    subject: `New call booking: ${booking.name} — ${when}`,
    html: `
      <h2>New phone consultation booked</h2>
      <p><strong>When:</strong> ${when} (${tz})</p>
      <p><strong>Name:</strong> ${booking.name}</p>
      <p><strong>Phone:</strong> ${booking.phone}</p>
      <p><strong>Email:</strong> ${booking.email}</p>
      ${booking.experience ? `<p><strong>Electrical experience:</strong> ${booking.experience}</p>` : ""}
      ${booking.has18thEdition ? `<p><strong>Holds 18th Edition (BS 7671):</strong> ${booking.has18thEdition}</p>` : ""}
      ${
        booking.hasInspectionTesting
          ? `<p><strong>Holds Inspection &amp; Testing:</strong> ${booking.hasInspectionTesting}</p>`
          : ""
      }
      ${booking.notes ? `<p><strong>Notes:</strong> ${booking.notes}</p>` : ""}
      <p>The calendar invite is attached. Opening it on your iPhone or Mac will add it to your calendar.</p>
    `,
    attachments,
  })
  if (adminRes.error) {
    throw new Error(`Resend rejected admin notification: ${JSON.stringify(adminRes.error)}`)
  }

  // Confirmation to the person who booked.
  const bookerRes = await resend.emails.send({
    from: FROM,
    to: [booking.email],
    subject: `Your call with EWA Tracker is booked — ${when}`,
    html: `
      <h2>Your phone consultation is confirmed</h2>
      <p>Hi ${booking.name},</p>
      <p>Thanks for booking a call with EWA Tracker Ltd. Here are the details:</p>
      <p><strong>When:</strong> ${when}<br/>
      <strong>Duration:</strong> ${MEETING.durationLabel}<br/>
      <strong>Format:</strong> We will call you on ${booking.phone}.</p>
      <p>A calendar invite is attached so you can add it to your calendar. If you need to
      rearrange, just reply to this email.</p>
      <p>Speak soon,<br/>EWA Tracker Ltd</p>
    `,
    attachments,
  })
  if (bookerRes.error) {
    throw new Error(`Resend rejected booker confirmation: ${JSON.stringify(bookerRes.error)}`)
  }
}

export async function sendCancellationEmails(booking: CallBooking, tz: string): Promise<void> {
  const resend = await getResend()
  const when = humanDate(booking.start, tz)

  const icsEvent: IcsEvent = {
    uid: `${booking.id}@ewatracker.co.uk`,
    start: new Date(booking.start),
    end: new Date(booking.end),
    summary: MEETING.title,
    description: MEETING.description,
    location: MEETING.location,
    organizerName: "EWA Tracker Ltd",
    organizerEmail: ORGANIZER_EMAIL,
    attendeeName: booking.name,
    attendeeEmail: booking.email,
    method: "CANCEL",
    // Must exceed the original invite's sequence so clients honour the cancel.
    sequence: 1,
  }
  const ics = buildIcs(icsEvent)
  const attachments = [
    {
      filename: "cancel.ics",
      content: toBase64(ics),
      contentType: "text/calendar; method=CANCEL",
    },
  ]

  await resend.emails.send({
    from: FROM,
    to: [ADMIN_EMAIL, booking.email],
    subject: `Cancelled: call on ${when}`,
    html: `
      <h2>This phone consultation has been cancelled</h2>
      <p>The call originally scheduled for <strong>${when}</strong> has been cancelled.</p>
      <p>If this was a mistake, please book again at your convenience.</p>
    `,
    attachments,
  })
}
