import { put } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"
import { uploadToSharePoint, isSharePointConfigured, createFolder } from "@/lib/sharepoint"
import { generateSubmissionId, formatSubmissionDate, getSubmissionFileName } from "@/lib/skills-scan-submission"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const pdfFile = formData.get("pdf") as File | null
    const candidateName = formData.get("candidateName") as string | null
    const email = formData.get("email") as string | null

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

    const submissionId = generateSubmissionId()
    const dateStr = formatSubmissionDate(new Date())
    const pdfFileName = getSubmissionFileName(candidateName, dateStr, "pdf")

    // Get PDF bytes
    const pdfBytes = await pdfFile.arrayBuffer()
    const pdfBuffer = Buffer.from(pdfBytes)

    // Store backup in Blob storage
    await put(
      `skills-scan-submissions/${submissionId}/tesp-completed.pdf`,
      pdfBuffer,
      { access: "public", contentType: "application/pdf" }
    )

    // Store metadata
    const metadata = {
      id: submissionId,
      candidateName,
      email,
      submittedAt: new Date().toISOString(),
      originalFileName: pdfFile.name,
    }

    await put(
      `skills-scan-submissions/${submissionId}/metadata.json`,
      JSON.stringify(metadata, null, 2),
      { access: "public", contentType: "application/json" }
    )

    // Upload to SharePoint
    let sharePointUrl: string | undefined
    if (isSharePointConfigured()) {
      try {
        // Create folder structure: Skills-Scan-Submissions/YYYY-MM
        const folderPath = `Skills-Scan-Submissions/${dateStr.substring(0, 7)}`
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
          console.log("[v0] Successfully uploaded completed TESP PDF to SharePoint:", sharePointUrl)
        } else {
          console.error("[v0] SharePoint upload failed:", uploadResult.error)
        }
      } catch (error) {
        console.error("[v0] SharePoint upload error:", error)
      }
    }

    return NextResponse.json({
      success: true,
      submissionId,
      message: "TESP Skills Scan uploaded successfully",
      sharePointUrl,
    })
  } catch (error) {
    console.error("PDF upload error:", error)
    return NextResponse.json({ error: "Failed to upload PDF" }, { status: 500 })
  }
}
