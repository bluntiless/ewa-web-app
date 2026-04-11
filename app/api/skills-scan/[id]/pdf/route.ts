import { list } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"
import { decryptJSON } from "@/lib/encryption"
import { createTespStylePdf, type TespPdfFormData } from "@/lib/tesp-pdf-filler"

interface SkillAssessment {
  knowledge: string
  experience: string
}

interface SuitabilityResult {
  result: string
  title: string
  summary: string
  knowledgeScore: number
  experienceScore: number
  guidance: string[]
}

interface SkillsScanSubmissionData {
  fullName: string
  email: string
  phone: string
  yearsExperience: string
  otherQualifications: string
  criminalConvictions: string
  rightToWork: string
  declaration: boolean
  selectedQualifications: {
    tableA: { [key: string]: boolean }
    tableB: { [key: string]: boolean }
    tableC: { [key: string]: boolean }
  }
  skills: {
    [sectionId: string]: {
      [skillId: string]: SkillAssessment
    }
  }
  furtherKnowledgeRequired: string
  furtherExperienceRequired: string
  suitabilityResult?: SuitabilityResult
}

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

    // Convert to TESP PDF format
    const tespFormData: TespPdfFormData = {
      candidateName: data.fullName || "",
      skills: data.skills as TespPdfFormData["skills"],
      selectedQualifications: data.selectedQualifications || { tableA: {}, tableB: {}, tableC: {} },
      furtherKnowledgeRequired: data.furtherKnowledgeRequired,
      furtherExperienceRequired: data.furtherExperienceRequired,
    }

    // Generate the TESP-style PDF with suitability result
    const pdfBytes = await createTespStylePdf(tespFormData, data.suitabilityResult)

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
