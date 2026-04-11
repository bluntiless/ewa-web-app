import { put } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"
import {
  generateSubmissionId,
  formatSubmissionDate,
  getSubmissionFileName,
  type SkillsScanSubmission,
  type SkillsScanSubmissionData,
} from "@/lib/skills-scan-submission"
import { encryptJSON } from "@/lib/encryption"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json()

    if (!formData.fullName || !formData.email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 })
    }

    const submissionId = generateSubmissionId()
    const submittedAt = new Date().toISOString()
    const dateStr = formatSubmissionDate(new Date())

    // Create metadata
    const metadata: SkillsScanSubmission = {
      id: submissionId,
      candidateName: formData.fullName,
      email: formData.email,
      phone: formData.phone || "",
      yearsExperience: formData.yearsExperience || "",
      submittedAt,
      status: "pending",
    }

    // Create full submission data
    const submissionData: SkillsScanSubmissionData = {
      metadata,
      formData,
    }

    // Encrypt data before storing (files are public but contents are encrypted)
    const encryptedMetadata = encryptJSON(metadata)
    const encryptedResponse = encryptJSON(submissionData)

    // Store encrypted metadata
    await put(
      `skills-scan-submissions/${submissionId}/metadata.enc`,
      encryptedMetadata,
      { access: "public", contentType: "text/plain" }
    )

    // Store encrypted response
    await put(
      `skills-scan-submissions/${submissionId}/response.enc`,
      encryptedResponse,
      { access: "public", contentType: "text/plain" }
    )

    // Generate candidate response PDF filename for reference
    const pdfFileName = getSubmissionFileName(formData.fullName, dateStr, "pdf")

    return NextResponse.json({
      success: true,
      submissionId,
      message: "Skills Scan submitted successfully",
      pdfFileName,
    })
  } catch (error) {
    console.error("Skills Scan submission error:", error)
    return NextResponse.json({ error: "Failed to submit Skills Scan" }, { status: 500 })
  }
}
