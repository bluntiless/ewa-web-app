import { put } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"
import { uploadToSharePoint, isSharePointConfigured, createFolder } from "@/lib/sharepoint"
import { generateSubmissionId, formatSubmissionDate, sanitizeCandidateName } from "@/lib/skills-scan-submission"

// Form type configurations for SharePoint folder routing
const FORM_TYPE_CONFIG: Record<string, { 
  folderPrefix: string
  blobPrefix: string
  filePrefix: string
  successMessage: string
}> = {
  "skills-scan": {
    folderPrefix: "Skills-Scan-Submissions",
    blobPrefix: "skills-scan-submissions",
    filePrefix: "TESP Skills Scan",
    successMessage: "TESP Skills Scan uploaded successfully",
  },
  "candidate-background": {
    folderPrefix: "Candidate-Background-Forms",
    blobPrefix: "candidate-background-submissions",
    filePrefix: "Candidate Background Form",
    successMessage: "Candidate Background Form uploaded successfully",
  },
}

function getFormFileName(formType: string, candidateName: string, dateStr: string): string {
  const config = FORM_TYPE_CONFIG[formType] || FORM_TYPE_CONFIG["skills-scan"]
  const safeName = sanitizeCandidateName(candidateName)
  return `${config.filePrefix} - ${safeName} - ${dateStr}.pdf`
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const pdfFile = formData.get("pdf") as File | null
    const candidateName = formData.get("candidateName") as string | null
    const email = formData.get("email") as string | null
    const formType = (formData.get("formType") as string | null) || "skills-scan"

    if (!pdfFile) {
      return NextResponse.json({ error: "PDF file is required" }, { status: 400 })
    }

    if (!candidateName || !email) {
      return NextResponse.json({ error: "Candidate name and email are required" }, { status: 400 })
    }

    // Validate it's a PDF - check both MIME type and file extension
    const isPdf = pdfFile.type === "application/pdf" || 
                  pdfFile.type.includes("pdf") || 
                  pdfFile.name.toLowerCase().endsWith(".pdf")
    if (!isPdf) {
      return NextResponse.json({ error: "File must be a PDF" }, { status: 400 })
    }

    // Get form type configuration (defaults to skills-scan if unknown type)
    const config = FORM_TYPE_CONFIG[formType] || FORM_TYPE_CONFIG["skills-scan"]
    
    const submissionId = generateSubmissionId()
    const dateStr = formatSubmissionDate(new Date())
    const pdfFileName = getFormFileName(formType, candidateName, dateStr)

    // Get PDF bytes
    const pdfBytes = await pdfFile.arrayBuffer()
    const pdfBuffer = Buffer.from(pdfBytes)

    // Store backup in Blob storage (using form-type-specific path)
    await put(
      `${config.blobPrefix}/${submissionId}/completed.pdf`,
      pdfBuffer,
      { access: "public", contentType: "application/pdf" }
    )

    // Store metadata
    const metadata = {
      id: submissionId,
      candidateName,
      email,
      formType,
      submittedAt: new Date().toISOString(),
      originalFileName: pdfFile.name,
    }

    await put(
      `${config.blobPrefix}/${submissionId}/metadata.json`,
      JSON.stringify(metadata, null, 2),
      { access: "public", contentType: "application/json" }
    )

    // Upload to SharePoint
    let sharePointUrl: string | undefined
    if (isSharePointConfigured()) {
      try {
        // Create folder structure based on form type: [FormTypeFolder]/YYYY-MM
        const folderPath = `${config.folderPrefix}/${dateStr.substring(0, 7)}`
        await createFolder(folderPath)

        // Upload the completed PDF to SharePoint
        const uploadResult = await uploadToSharePoint(
          folderPath,
          pdfFileName,
          pdfBuffer,
          "application/pdf"
        )

        if (uploadResult.success) {
          sharePointUrl = uploadResult.url
          console.log(`[v0] Successfully uploaded ${formType} PDF to SharePoint:`, sharePointUrl)
        } else {
          console.error(`[v0] SharePoint upload failed for ${formType}:`, uploadResult.error)
        }
      } catch (error) {
        console.error(`[v0] SharePoint upload error for ${formType}:`, error)
      }
    }

    return NextResponse.json({
      success: true,
      submissionId,
      formType,
      message: config.successMessage,
      sharePointUrl,
    })
  } catch (error) {
    console.error("PDF upload error:", error)
    return NextResponse.json({ error: "Failed to upload PDF" }, { status: 500 })
  }
}
