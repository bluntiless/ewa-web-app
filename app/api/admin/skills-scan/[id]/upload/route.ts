import { list, put } from "@vercel/blob"
import { getServerSession } from "next-auth"
import { type NextRequest, NextResponse } from "next/server"
import { authOptions } from "@/lib/auth"
import { uploadToSharePoint, isSharePointConfigured } from "@/lib/sharepoint"
import type { SkillsScanSubmission, SkillsScanSubmissionData } from "@/lib/skills-scan-submission"
import { getSubmissionFileName, formatSubmissionDate } from "@/lib/skills-scan-submission"

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
    // Get blob URL for the response file
    const blobUrl = await getBlobUrl(`skills-scan-submissions/${id}/response.json`)

    if (!blobUrl) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 })
    }

    const response = await fetch(blobUrl)
    if (!response.ok) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 })
    }

    const data = await response.json() as SkillsScanSubmissionData

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
    const metadataBlobUrl = await getBlobUrl(`skills-scan-submissions/${id}/metadata.json`)

    if (metadataBlobUrl) {
      const metaResponse = await fetch(metadataBlobUrl)
      if (metaResponse.ok) {
        const metadata = await metaResponse.json() as SkillsScanSubmission

        const updatedMetadata: SkillsScanSubmission = {
          ...metadata,
          status: allSucceeded ? "uploaded" : anyFailed ? "failed" : metadata.status,
          sharePointPath,
          uploadedAt: allSucceeded ? new Date().toISOString() : undefined,
        }

        await put(
          `skills-scan-submissions/${id}/metadata.json`,
          JSON.stringify(updatedMetadata, null, 2),
          { access: "public", contentType: "application/json" }
        )
      }
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
      const metadataBlobUrl = await getBlobUrl(`skills-scan-submissions/${id}/metadata.json`)

      if (metadataBlobUrl) {
        const metaResponse = await fetch(metadataBlobUrl)
        if (metaResponse.ok) {
          const metadata = await metaResponse.json() as SkillsScanSubmission

          await put(
            `skills-scan-submissions/${id}/metadata.json`,
            JSON.stringify({ ...metadata, status: "failed" }, null, 2),
            { access: "public", contentType: "application/json" }
          )
        }
      }
    } catch {}

    return NextResponse.json(
      { error: "Failed to upload to SharePoint", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}
