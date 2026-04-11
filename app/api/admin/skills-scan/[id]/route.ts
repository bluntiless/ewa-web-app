import { list, put } from "@vercel/blob"
import { getServerSession } from "next-auth"
import { type NextRequest, NextResponse } from "next/server"
import { authOptions } from "@/lib/auth"
import type { SkillsScanSubmission, SkillsScanSubmissionData } from "@/lib/skills-scan-submission"
import { decryptJSON, encryptJSON } from "@/lib/encryption"

// Helper to find blob URL by pathname
async function getBlobUrl(pathname: string): Promise<string | null> {
  const { blobs } = await list({ prefix: pathname.split("/").slice(0, -1).join("/") + "/" })
  const blob = blobs.find((b) => b.pathname === pathname)
  return blob?.url || null
}

export async function GET(
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

    return NextResponse.json(data)
  } catch (error) {
    console.error("Failed to get submission:", error)
    return NextResponse.json({ error: "Failed to get submission" }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const updates = await request.json()

  try {
    // Get current encrypted metadata
    const blobUrl = await getBlobUrl(`skills-scan-submissions/${id}/metadata.enc`)

    if (!blobUrl) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 })
    }

    const response = await fetch(blobUrl)
    if (!response.ok) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 })
    }

    const encryptedText = await response.text()
    const metadata = decryptJSON<SkillsScanSubmission>(encryptedText)

    // Update metadata
    const updatedMetadata: SkillsScanSubmission = {
      ...metadata,
      ...updates,
    }

    // Save encrypted updated metadata
    await put(
      `skills-scan-submissions/${id}/metadata.enc`,
      encryptJSON(updatedMetadata),
      { access: "public", contentType: "text/plain" }
    )

    return NextResponse.json({ success: true, metadata: updatedMetadata })
  } catch (error) {
    console.error("Failed to update submission:", error)
    return NextResponse.json({ error: "Failed to update submission" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  try {
    // Archive by updating status
    const blobUrl = await getBlobUrl(`skills-scan-submissions/${id}/metadata.enc`)

    if (!blobUrl) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 })
    }

    const response = await fetch(blobUrl)
    if (!response.ok) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 })
    }

    const encryptedText = await response.text()
    const metadata = decryptJSON<SkillsScanSubmission>(encryptedText)

    // Archive the submission
    const updatedMetadata: SkillsScanSubmission = {
      ...metadata,
      status: "archived",
      archivedAt: new Date().toISOString(),
    }

    await put(
      `skills-scan-submissions/${id}/metadata.enc`,
      encryptJSON(updatedMetadata),
      { access: "public", contentType: "text/plain" }
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to archive submission:", error)
    return NextResponse.json({ error: "Failed to archive submission" }, { status: 500 })
  }
}
