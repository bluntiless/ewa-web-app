import { put } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"
import { uploadToSharePoint, isSharePointConfigured, createFolder } from "@/lib/sharepoint"
import { generateSubmissionId, formatSubmissionDate } from "@/lib/skills-scan-submission"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const pdfFile = formData.get("pdf") as File | null
    const candidateName = formData.get("candidateName") as string | null
    const email = formData.get("email") as string | null
    const formType = formData.get("formType") as string | null // "candidate-background" or "skills-scan"

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

    // Determine if this is a Candidate Background Form or Skills Scan
    const isCandidateBackground = formType === "candidate-background"
    
    const submissionId = generateSubmissionId()
    const dateStr = formatSubmissionDate(new Date())
    
    // Use different filename prefix based on form type
    const filePrefix = isCandidateBackground ? "Candidate-Background" : "Skills-Scan"
    const pdfFileName = `${filePrefix}_${candidateName.replace(/\s+/g, "_")}_${dateStr}.pdf`

    // Get PDF bytes
    const pdfBytes = await pdfFile.arrayBuffer()
    const pdfBuffer = Buffer.from(pdfBytes)

    // Store backup in Blob storage - use different paths for each form type
    const blobFolder = isCandidateBackground ? "candidate-background-submissions" : "skills-scan-submissions"
    await put(
      `${blobFolder}/${submissionId}/completed-form.pdf`,
      pdfBuffer,
      { access: "public", contentType: "application/pdf" }
    )

    // Store metadata
    const metadata = {
      id: submissionId,
      candidateName,
      email,
      formType: isCandidateBackground ? "candidate-background" : "skills-scan",
      submittedAt: new Date().toISOString(),
      originalFileName: pdfFile.name,
    }

    await put(
      `${blobFolder}/${submissionId}/metadata.json`,
      JSON.stringify(metadata, null, 2),
      { access: "public", contentType: "application/json" }
    )

    // Upload to SharePoint
    let sharePointUrl: string | undefined
    if (isSharePointConfigured()) {
      try {
        // Create folder structure based on form type:
        // - Candidate Background Forms go to: Candidate-Background-Submissions/YYYY-MM
        // - Skills Scan Forms go to: Skills-Scan-Submissions/YYYY-MM
        const sharePointFolder = isCandidateBackground 
          ? "Candidate-Background-Submissions" 
          : "Skills-Scan-Submissions"
        const folderPath = `${sharePointFolder}/${dateStr.substring(0, 7)}`
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
          console.log(`[v0] Successfully uploaded ${isCandidateBackground ? "Candidate Background" : "Skills Scan"} PDF to SharePoint:`, sharePointUrl)
        } else {
          console.error("[v0] SharePoint upload failed:", uploadResult.error)
        }
      } catch (error) {
        console.error("[v0] SharePoint upload error:", error)
      }
    }

    const formTypeName = isCandidateBackground ? "Candidate Background Form" : "Skills Scan"
    return NextResponse.json({
      success: true,
      submissionId,
      message: `${formTypeName} uploaded successfully`,
      sharePointUrl,
    })
  } catch (error) {
    console.error("PDF upload error:", error)
    return NextResponse.json({ error: "Failed to upload PDF" }, { status: 500 })
  }
}
