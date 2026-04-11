import { list } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"
import { decryptJSON } from "@/lib/encryption"
import type { SkillsScanSubmissionData } from "@/lib/skills-scan-submission"
import { createTespPdf, type TespPdfFormData } from "@/lib/tesp-pdf-generator"

async function getBlobUrl(pathname: string): Promise<string | null> {
  const { blobs } = await list({ prefix: pathname.split("/").slice(0, -1).join("/") + "/" })
  const blob = blobs.find((b) => b.pathname === pathname)
  return blob?.url || null
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  try {
    // Get the encrypted submission data
    const blobUrl = await getBlobUrl(`skills-scan-submissions/${id}/response.enc`)

    if (!blobUrl) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 })
    }

    const response = await fetch(blobUrl)
    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch submission data" }, { status: 500 })
    }

    const encryptedText = await response.text()
    const data = decryptJSON<SkillsScanSubmissionData>(encryptedText)
    const formData = data.formData

    // Prepare data for TESP PDF generation
    const tespFormData: TespPdfFormData = {
      candidateName: formData.fullName || "",
      skills: formData.skills as TespPdfFormData["skills"],
      selectedQualifications: formData.selectedQualifications,
      otherQualifications: formData.otherQualifications,
      furtherKnowledgeRequired: formData.furtherKnowledgeRequired,
      furtherExperienceRequired: formData.furtherExperienceRequired,
      suitabilityResult: formData.suitabilityResult,
    }

    // Generate the TESP-style PDF
    const pdfBytes = await createTespPdf(tespFormData)

    // Return the PDF
    const filename = `TESP_Skills_Scan_${formData.fullName?.replace(/\s+/g, "_") || "Candidate"}_${new Date().toISOString().split("T")[0]}.pdf`
    
    return new NextResponse(pdfBytes, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error("Error generating PDF:", error)
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 })
  }
}
