import { put } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"
import { sendEligibilityAutoResponse } from "@/lib/eligibility/auto-response"

// Allow time for AI generation + email send in the auto-response step.
export const maxDuration = 30

// Public endpoint. Called by the eligibility checker every time a candidate
// clicks "Evaluate Candidate". Saves a lightweight metadata.json to Blob so the
// check appears in the admin Eligibility Checks dashboard. This does NOT touch
// SharePoint — the separate "Save to SharePoint" action still handles the full
// HTML record. It also sends the candidate an automated, personalised
// eligibility email when they provided an email address.
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

    const metadata = {
      id,
      candidateName: (data.candidateName || "").trim() || "Unnamed candidate",
      email: (data.email || "").trim(),
      phone: (data.phone || "").trim(),
      experience: data.experience || "",
      level2Qualification: data.level2Qualification || "",
      level3Qualification: data.level3Qualification || "",
      bs7671Status: data.bs7671Status || "",
      itStatus: data.itStatus || "",
      workType: data.workType || "",
      pathway: data.pathway || "",
      eligibilityResult: data.eligibilityResult || "",
      recommendations: data.recommendations || "",
      // Which flow produced this check. Defaults to the website form for older
      // records / callers that don't specify a source.
      source: (data.source || "").trim() || "Website Form",
      submittedAt: new Date().toISOString(),
      status: "pending" as const,
    }

    await put(`eligibility-checks/${id}/metadata.json`, JSON.stringify(metadata, null, 2), {
      access: "public",
      contentType: "application/json",
    })

    // Send the automated personalised email. Awaited so it runs before the
    // serverless function returns, but wrapped so a failure never breaks the
    // check itself — the dashboard/SharePoint record is already saved above.
    try {
      await sendEligibilityAutoResponse(metadata)
    } catch (emailError) {
      console.error("[v0] eligibility auto-response email failed:", emailError)
    }

    return NextResponse.json({ success: true, id })
  } catch (error) {
    console.error("Failed to log eligibility check:", error)
    return NextResponse.json({ error: "Failed to log eligibility check" }, { status: 500 })
  }
}
