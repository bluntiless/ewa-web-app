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
        { ok: false, message: "Resend rejected the send. See sendError.", diagnostics },
        { status: 200 },
      )
    }

    return NextResponse.json(
      { ok: true, message: `Test email sent to ${adminEmail}. Check that inbox (and spam).`, diagnostics },
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
