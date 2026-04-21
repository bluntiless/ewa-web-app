
import { put } from "@vercel/blob"
import { NextResponse } from "next/server"
import { Resend } from "resend"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
    const candidateEmail = String(body?.candidate?.email || "").trim()
    const candidateName = String(body?.candidate?.fullName || "Candidate").trim()
    const emailPart = candidateEmail
      .toLowerCase()
      .replace(/[^a-z0-9@._-]/g, "")
      .replace("@", "_at_")

    const filename = `ewa-entry-test-results/${timestamp}-${emailPart}.json`

    // Save to Blob storage
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      await put(filename, JSON.stringify(body, null, 2), {
        access: "public",
        contentType: "application/json",
      })
    } else {
      console.log("EWA entry test result received", body)
    }

    // Send email with results
    if (process.env.RESEND_API_KEY && candidateEmail) {
      const resend = new Resend(process.env.RESEND_API_KEY)
      
      const categoryBreakdownHtml = Object.entries(body.categoryBreakdown || {})
        .map(([category, values]: [string, { correct: number; total: number }]) => {
          const pct = Math.round((values.correct / values.total) * 100)
          return `<tr><td style="padding:8px;border-bottom:1px solid #e5e7eb;">${category}</td><td style="padding:8px;border-bottom:1px solid #e5e7eb;text-align:right;">${values.correct}/${values.total} (${pct}%)</td></tr>`
        })
        .join("")

      const passed = body.passed
      const resultColor = passed ? "#059669" : "#dc2626"
      const resultText = passed ? "PASS" : "FAIL"

      await resend.emails.send({
        from: "EWA Tracker <noreply@ewatracker.co.uk>",
        to: candidateEmail,
        subject: `Your EWA Entry Test Mock Result: ${resultText} (${body.percent}%)`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
            <div style="text-align:center;margin-bottom:24px;">
              <img src="https://ewatracker.co.uk/ewa_logo_eal_recognised.png" alt="EWA Tracker" style="height:60px;" />
            </div>
            
            <h1 style="color:#1e3a5f;margin-bottom:8px;">EWA Entry Test Mock Result</h1>
            <p style="color:#64748b;margin-bottom:24px;">Thank you for completing the mock assessment, ${candidateName}.</p>
            
            <div style="background:${passed ? "#ecfdf5" : "#fef2f2"};border:1px solid ${passed ? "#a7f3d0" : "#fecaca"};border-radius:12px;padding:24px;margin-bottom:24px;text-align:center;">
              <h2 style="color:${resultColor};font-size:32px;margin:0 0 8px 0;">${resultText}</h2>
              <p style="color:#374151;font-size:18px;margin:0;">Score: <strong>${body.score}/${body.totalQuestions}</strong> (${body.percent}%)</p>
              <p style="color:#6b7280;font-size:14px;margin:8px 0 0 0;">Pass mark: 60%</p>
            </div>
            
            <h3 style="color:#1e3a5f;margin-bottom:12px;">Category Breakdown</h3>
            <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
              <thead>
                <tr style="background:#f1f5f9;">
                  <th style="padding:8px;text-align:left;border-bottom:2px solid #e5e7eb;">Category</th>
                  <th style="padding:8px;text-align:right;border-bottom:2px solid #e5e7eb;">Score</th>
                </tr>
              </thead>
              <tbody>
                ${categoryBreakdownHtml}
              </tbody>
            </table>
            
            <div style="background:#f8fafc;border-radius:8px;padding:16px;margin-bottom:24px;">
              <p style="color:#475569;font-size:14px;margin:0;">
                <strong>Note:</strong> This is an unofficial practice assessment. It does not reproduce official EAL questions and is intended for revision purposes only.
              </p>
            </div>
            
            <div style="text-align:center;margin-top:32px;">
              <a href="https://ewatracker.co.uk/ewa-entry-test" style="background:#2563eb;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">Try Another Attempt</a>
            </div>
            
            <hr style="border:none;border-top:1px solid #e5e7eb;margin:32px 0;" />
            
            <p style="color:#9ca3af;font-size:12px;text-align:center;">
              EWA Tracker Ltd | <a href="https://ewatracker.co.uk" style="color:#2563eb;">ewatracker.co.uk</a><br />
              EAL Approved Centre for Electrotechnical Qualifications
            </p>
          </div>
        `,
      })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("EWA entry test error:", error)
    return NextResponse.json({ ok: false, error: "Unable to save result" }, { status: 500 })
  }
}
