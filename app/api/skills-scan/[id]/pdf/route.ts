import { list } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"
import { decryptJSON } from "@/lib/encryption"
import { fillOfficialTespPdf, type TespPdfFormData } from "@/lib/tesp-pdf-filler"
import type { SkillsScanSubmissionData } from "@/lib/skills-scan-submission"
import fs from "fs"
import path from "path"

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

    // Load the official TESP PDF template
    const templatePath = path.join(process.cwd(), "public", "templates", "ewa-skills-scan-template.pdf")
    let templateBytes: ArrayBuffer

    try {
      const fileBuffer = fs.readFileSync(templatePath)
      templateBytes = fileBuffer.buffer.slice(
        fileBuffer.byteOffset,
        fileBuffer.byteOffset + fileBuffer.byteLength
      )
    } catch (err) {
      console.error("Failed to read TESP template:", err)
      return NextResponse.json({ error: "TESP PDF template not found" }, { status: 500 })
    }

    // Convert to TESP PDF format
    const tespFormData: TespPdfFormData = {
      candidateName: data.fullName || "",
      skills: data.skills as TespPdfFormData["skills"],
      selectedQualifications: data.selectedQualifications,
      furtherKnowledgeRequired: data.furtherKnowledgeRequired,
      furtherExperienceRequired: data.furtherExperienceRequired,
      suitabilityResult: data.suitabilityResult,
    }

    // Fill the official TESP PDF template with candidate responses
    const pdfBytes = await fillOfficialTespPdf(templateBytes, tespFormData)

    // Return the PDF
    const filename = `TESP_Skills_Scan_${data.fullName?.replace(/\s+/g, "_") || "Candidate"}_${new Date().toISOString().split("T")[0]}.pdf`
    
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
