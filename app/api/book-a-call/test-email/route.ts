import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

// TEMPORARY diagnostic endpoint. Visit /api/book-a-call/test-email in the browser
// to see whether Resend is configured and to trigger a real test send to ADMIN_EMAIL.
// It reports the actual Resend response/error so we can pinpoint delivery issues.
// Remove this route once email is confirmed working.
export async function GET() {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM_EMAIL || "EWA Tracker <bookings@ewatracker.co.uk>"
  const adminEmail = process.env.ADMIN_EMAIL || "admin@ewatracker.co.uk"

  const diagnostics = {
    resendApiKeyPresent: Boolean(apiKey),
    resendApiKeyPrefix: apiKey ? `${apiKey.slice(0, 3)}...` : null,
    fromEmail: from,
    adminEmail,
    sendResult: null as unknown,
    sendError: null as string | null,
  }

  if (!apiKey) {
    return NextResponse.json(
      { ok: false, message: "RESEND_API_KEY is NOT set in this environment.", diagnostics },
      { status: 200 },
    )
  }

  try {
    const { Resend } = await import("resend")
    const resend = new Resend(apiKey)
    const result = await resend.emails.send({
      from,
      to: [adminEmail],
      subject: "EWA Tracker — booking email test",
      html: `<p>This is a test send from your booking system.</p>
             <p>If you received this, Resend is working and booking confirmations will send.</p>
             <p>From: ${from}<br/>To: ${adminEmail}</p>`,
    })

    diagnostics.sendResult = result
    // The Resend SDK returns { data, error } rather than throwing on API errors.
    const errorField = (result as { error?: { message?: string } | null })?.error
    if (errorField) {
      diagnostics.sendError = errorField.message || JSON.stringify(errorField)
      return NextResponse.json(
        { ok: false, message: "Resend rejected the plain send. See sendError.", diagnostics },
        { status: 200 },
      )
    }

    // Second send: identical to the real booking path, WITH the .ics attachment.
    // This is what actually fires on a booking, so it reveals attachment-specific
    // rejections that the plain send above would not surface.
    const { buildIcs } = await import("@/lib/booking/ics")
    const now = new Date()
    const ics = buildIcs({
      uid: `test-${now.getTime()}@ewatracker.co.uk`,
      start: new Date(now.getTime() + 3600_000),
      end: new Date(now.getTime() + 5400_000),
      summary: "EWA Tracker — test invite",
      description: "Test calendar invite from the booking system.",
      location: "Phone call",
      organizerName: "EWA Tracker Ltd",
      organizerEmail: from.match(/<(.+)>/)?.[1] || from,
      attendeeName: "Test",
      attendeeEmail: adminEmail,
      method: "REQUEST",
      sequence: 0,
    })
    const attachmentResult = await resend.emails.send({
      from,
      to: [adminEmail],
      subject: "EWA Tracker — booking email test (with calendar invite)",
      html: `<p>This test includes the .ics calendar attachment, exactly like a real booking.</p>`,
      attachments: [
        {
          filename: "invite.ics",
          content: Buffer.from(ics, "utf-8").toString("base64"),
          contentType: "text/calendar; method=REQUEST",
        },
      ],
    })
    ;(diagnostics as Record<string, unknown>).attachmentSendResult = attachmentResult
    const attachErr = (attachmentResult as { error?: { message?: string } | null })?.error
    if (attachErr) {
      diagnostics.sendError = attachErr.message || JSON.stringify(attachErr)
      return NextResponse.json(
        {
          ok: false,
          message: "Plain send worked but the ATTACHMENT send was rejected. See sendError.",
          diagnostics,
        },
        { status: 200 },
      )
    }

    return NextResponse.json(
      {
        ok: true,
        message: `Two test emails sent to ${adminEmail} (one plain, one with calendar invite). Check that inbox and spam.`,
        diagnostics,
      },
      { status: 200 },
    )
  } catch (err) {
    diagnostics.sendError = err instanceof Error ? err.message : String(err)
    return NextResponse.json(
      { ok: false, message: "Sending threw an exception. See sendError.", diagnostics },
      { status: 200 },
    )
  }
}
