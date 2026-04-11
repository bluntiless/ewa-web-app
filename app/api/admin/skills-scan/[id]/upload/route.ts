import { get, put } from "@vercel/blob"
import { getServerSession } from "next-auth"
import { type NextRequest, NextResponse } from "next/server"
import { PDFDocument, rgb, StandardFonts } from "pdf-lib"
import { authOptions } from "@/lib/auth"
import { uploadToSharePoint, isSharePointConfigured, checkFolderExists } from "@/lib/sharepoint"
import type { SkillsScanSubmission, SkillsScanSubmissionData } from "@/lib/skills-scan-submission"
import { getSubmissionFileName, formatSubmissionDate } from "@/lib/skills-scan-submission"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const { sharePointPath } = await request.json()

  if (!sharePointPath) {
    return NextResponse.json({ error: "SharePoint folder path is required" }, { status: 400 })
  }

  // Check if SharePoint is configured
  if (!isSharePointConfigured()) {
    return NextResponse.json(
      {
        error: "SharePoint integration is not configured. Please set the required environment variables.",
        details: "Required: SHAREPOINT_TENANT_ID, SHAREPOINT_CLIENT_ID, SHAREPOINT_CLIENT_SECRET, SHAREPOINT_SITE_ID",
      },
      { status: 503 }
    )
  }

  try {
    // Get submission data
    const result = await get(`skills-scan-submissions/${id}/response.json`, {
      access: "private",
    })

    if (!result || !result.stream) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 })
    }

    const reader = result.stream.getReader()
    const chunks: Uint8Array[] = []
    let done = false
    while (!done) {
      const { value, done: streamDone } = await reader.read()
      if (value) chunks.push(value)
      done = streamDone
    }
    const text = new TextDecoder().decode(Buffer.concat(chunks))
    const data = JSON.parse(text) as SkillsScanSubmissionData

    const dateStr = formatSubmissionDate(new Date(data.metadata.submittedAt))

    // Prepare files to upload
    const uploads: { fileName: string; content: Buffer | Uint8Array; contentType: string }[] = []

    // 1. JSON Response file
    const jsonFileName = getSubmissionFileName(data.metadata.candidateName, dateStr, "json")
    uploads.push({
      fileName: jsonFileName,
      content: Buffer.from(JSON.stringify(data, null, 2)),
      contentType: "application/json",
    })

    // 2. Generate PDF and upload
    const pdfResponse = await fetch(
      `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/admin/skills-scan/${id}/pdf`,
      {
        method: "POST",
        headers: {
          Cookie: request.headers.get("cookie") || "",
        },
      }
    )

    if (pdfResponse.ok) {
      const pdfBuffer = await pdfResponse.arrayBuffer()
      const pdfFileName = getSubmissionFileName(data.metadata.candidateName, dateStr, "pdf")
      uploads.push({
        fileName: pdfFileName,
        content: Buffer.from(pdfBuffer),
        contentType: "application/pdf",
      })
    }

    // Upload files to SharePoint
    const uploadResults: { fileName: string; success: boolean; url?: string; error?: string }[] = []

    for (const upload of uploads) {
      const result = await uploadToSharePoint(
        sharePointPath,
        upload.fileName,
        upload.content,
        upload.contentType
      )

      uploadResults.push({
        fileName: upload.fileName,
        ...result,
      })
    }

    // Check if all uploads succeeded
    const allSucceeded = uploadResults.every((r) => r.success)
    const anyFailed = uploadResults.some((r) => !r.success)

    // Update metadata with status and SharePoint path
    const metadataResult = await get(`skills-scan-submissions/${id}/metadata.json`, {
      access: "private",
    })

    if (metadataResult && metadataResult.stream) {
      const metaReader = metadataResult.stream.getReader()
      const metaChunks: Uint8Array[] = []
      let metaDone = false
      while (!metaDone) {
        const { value, done: streamDone } = await metaReader.read()
        if (value) metaChunks.push(value)
        metaDone = streamDone
      }
      const metaText = new TextDecoder().decode(Buffer.concat(metaChunks))
      const metadata = JSON.parse(metaText) as SkillsScanSubmission

      const updatedMetadata: SkillsScanSubmission = {
        ...metadata,
        status: allSucceeded ? "uploaded" : anyFailed ? "failed" : metadata.status,
        sharePointPath,
        uploadedAt: allSucceeded ? new Date().toISOString() : undefined,
      }

      await put(
        `skills-scan-submissions/${id}/metadata.json`,
        JSON.stringify(updatedMetadata, null, 2),
        { access: "private", contentType: "application/json" }
      )
    }

    return NextResponse.json({
      success: allSucceeded,
      uploads: uploadResults,
      message: allSucceeded
        ? "All files uploaded successfully to SharePoint"
        : anyFailed
          ? "Some files failed to upload"
          : "Upload completed with warnings",
    })
  } catch (error) {
    console.error("SharePoint upload error:", error)

    // Update status to failed
    try {
      const metadataResult = await get(`skills-scan-submissions/${id}/metadata.json`, {
        access: "private",
      })

      if (metadataResult && metadataResult.stream) {
        const reader = metadataResult.stream.getReader()
        const chunks: Uint8Array[] = []
        let done = false
        while (!done) {
          const { value, done: streamDone } = await reader.read()
          if (value) chunks.push(value)
          done = streamDone
        }
        const text = new TextDecoder().decode(Buffer.concat(chunks))
        const metadata = JSON.parse(text) as SkillsScanSubmission

        await put(
          `skills-scan-submissions/${id}/metadata.json`,
          JSON.stringify({ ...metadata, status: "failed" }, null, 2),
          { access: "private", contentType: "application/json" }
        )
      }
    } catch {}

    return NextResponse.json(
      { error: "Failed to upload to SharePoint", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}
