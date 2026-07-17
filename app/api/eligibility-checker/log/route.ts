import { put } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"

// Public endpoint. Called by the eligibility checker every time a candidate
// clicks "Evaluate Candidate". Saves a lightweight metadata.json to Blob so the
// check appears in the admin Eligibility Checks dashboard. This does NOT touch
// SharePoint — the separate "Save to SharePoint" action still handles the full
// HTML record.
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
      submittedAt: new Date().toISOString(),
      status: "pending" as const,
    }

    await put(`eligibility-checks/${id}/metadata.json`, JSON.stringify(metadata, null, 2), {
      access: "public",
      contentType: "application/json",
    })

    return NextResponse.json({ success: true, id })
  } catch (error) {
    console.error("Failed to log eligibility check:", error)
    return NextResponse.json({ error: "Failed to log eligibility check" }, { status: 500 })
  }
}
