import { type NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { uploadToSharePoint, isSharePointConfigured, createFolder } from "@/lib/sharepoint"
import { generateSubmissionId } from "@/lib/skills-scan-submission"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const pdfFile = formData.get("pdf") as File | null
    const candidateName = formData.get("candidateName") as string | null
    const candidateEmail = formData.get("candidateEmail") as string | null

    if (!pdfFile || !candidateName || !candidateEmail) {
      return NextResponse.json(
        { error: "Missing required fields: pdf, candidateName, or candidateEmail" },
        { status: 400 }
      )
    }

    if (pdfFile.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Invalid file type. Please upload a PDF file." },
        { status: 400 }
      )
    }

    const submissionId = generateSubmissionId()
    const dateStr = new Date().toISOString().split("T")[0]
    const sanitizedName = candidateName.replace(/[^a-zA-Z0-9\s-]/g, "").replace(/\s+/g, "-")
    const fileName = `Skills-Scan-${sanitizedName}-${dateStr}.pdf`

    // Convert file to buffer
    const pdfBuffer = Buffer.from(await pdfFile.arrayBuffer())

    console.log(`[v0] Processing Skills Scan PDF upload for: ${candidateName}`)
    console.log(`[v0] PDF size: ${pdfBuffer.length} bytes`)

    // Store a copy in Blob storage for backup
    const blobResult = await put(
      `skills-scan-submissions/${submissionId}/${fileName}`,
      pdfBuffer,
      {
        access: "public",
        contentType: "application/pdf",
      }
    )

    console.log(`[v0] PDF stored in Blob: ${blobResult.url}`)

    // Upload to SharePoint if configured
    let sharePointUrl: string | undefined
    if (isSharePointConfigured()) {
      try {
        // Create folder structure: Skills-Scan-Submissions/YYYY-MM
        const folderPath = `Skills-Scan-Submissions/${dateStr.substring(0, 7)}`
        await createFolder(folderPath)

        // Upload PDF to SharePoint
        const uploadResult = await uploadToSharePoint(
          folderPath,
          fileName,
          pdfBuffer,
          "application/pdf"
        )

        if (uploadResult.success) {
          sharePointUrl = uploadResult.url
          console.log(`[v0] Successfully uploaded to SharePoint: ${sharePointUrl}`)
        } else {
          console.error(`[v0] SharePoint upload failed: ${uploadResult.error}`)
        }
      } catch (error) {
        console.error("[v0] SharePoint upload error:", error)
        // Don't fail the submission if SharePoint upload fails
      }
    } else {
      console.log("[v0] SharePoint not configured, skipping upload")
    }

    // For now, return a placeholder suitability result
    // In the future, we could attempt to parse the PDF and extract selections
    // However, XFA forms are complex and may require specialized parsing
    const suitabilityResult = {
      result: "potentially-suitable" as const,
      title: "Preliminary Assessment Received",
      summary: "Your TESP Skills Scan has been received and will be reviewed by a Training Provider.",
      knowledgeScore: 0,
      experienceScore: 0,
      guidance: [
        "Your completed Skills Scan has been submitted successfully.",
        "A Training Provider will review your submission and verify your skills assessment.",
        "You will be contacted regarding next steps in the EWA process.",
        "Keep a copy of your submitted PDF for your records.",
      ],
    }

    // Store metadata
    const metadata = {
      submissionId,
      candidateName,
      candidateEmail,
      submittedAt: new Date().toISOString(),
      fileName,
      blobUrl: blobResult.url,
      sharePointUrl,
    }

    // Store metadata in Blob
    await put(
      `skills-scan-submissions/${submissionId}/metadata.json`,
      JSON.stringify(metadata, null, 2),
      {
        access: "public",
        contentType: "application/json",
      }
    )

    return NextResponse.json({
      success: true,
      submissionId,
      message: "Skills Scan submitted successfully",
      sharePointUrl,
      suitabilityResult,
    })
  } catch (error) {
    console.error("[v0] Error processing Skills Scan PDF:", error)
    return NextResponse.json(
      { error: "Failed to process Skills Scan. Please try again." },
      { status: 500 }
    )
  }
}
