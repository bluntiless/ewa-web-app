import { list } from "@vercel/blob"
import { getServerSession } from "next-auth"
import { type NextRequest, NextResponse } from "next/server"
import { authOptions } from "@/lib/auth"
import type { SkillsScanSubmissionData } from "@/lib/skills-scan-submission"
import { decryptJSON } from "@/lib/encryption"
import { createTespStylePdf, type TespPdfFormData } from "@/lib/tesp-pdf-filler"

// Helper to find blob URL by pathname
async function getBlobUrl(pathname: string): Promise<string | null> {
  const { blobs } = await list({ prefix: pathname.split("/").slice(0, -1).join("/") + "/" })
  const blob = blobs.find((b) => b.pathname === pathname)
  return blob?.url || null
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  try {
    // Get blob URL for the encrypted response file
    const blobUrl = await getBlobUrl(`skills-scan-submissions/${id}/response.enc`)

    if (!blobUrl) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 })
    }

    const response = await fetch(blobUrl)
    if (!response.ok) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 })
    }

    const encryptedText = await response.text()
    const data = decryptJSON<SkillsScanSubmissionData>(encryptedText)

    // Convert to TESP PDF format
    const tespFormData: TespPdfFormData = {
      candidateName: data.formData.fullName || "",
      skills: data.formData.skills as TespPdfFormData["skills"],
      selectedQualifications: data.formData.selectedQualifications || { tableA: {}, tableB: {}, tableC: {} },
      furtherKnowledgeRequired: data.formData.furtherKnowledgeRequired,
      furtherExperienceRequired: data.formData.furtherExperienceRequired,
    }

    // Generate the TESP-style PDF with suitability result if available
    const pdfBytes = await createTespStylePdf(tespFormData, data.formData.suitabilityResult)

    // Return the PDF
    const candidateName = data.metadata?.candidateName || data.formData.fullName || "Candidate"
    const filename = `TESP_Skills_Scan_${candidateName.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.pdf`

    return new NextResponse(pdfBytes, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error("Failed to generate PDF:", error)
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 })
  }
}
