import { list, put } from "@vercel/blob"
import { getServerSession } from "next-auth"
import { type NextRequest, NextResponse } from "next/server"
import { authOptions } from "@/lib/auth"
import type { SkillsScanSubmission, SkillsScanSubmissionData } from "@/lib/skills-scan-submission"

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
    // Get current metadata
    const blobUrl = await getBlobUrl(`skills-scan-submissions/${id}/metadata.json`)

    if (!blobUrl) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 })
    }

    const response = await fetch(blobUrl)
    if (!response.ok) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 })
    }

    const metadata = await response.json() as SkillsScanSubmission

    // Update metadata
    const updatedMetadata: SkillsScanSubmission = {
      ...metadata,
      ...updates,
    }

    // Save updated metadata
    await put(
      `skills-scan-submissions/${id}/metadata.json`,
      JSON.stringify(updatedMetadata, null, 2),
      { access: "public", contentType: "application/json" }
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
    const blobUrl = await getBlobUrl(`skills-scan-submissions/${id}/metadata.json`)

    if (!blobUrl) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 })
    }

    const response = await fetch(blobUrl)
    if (!response.ok) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 })
    }

    const metadata = await response.json() as SkillsScanSubmission

    // Archive the submission
    const updatedMetadata: SkillsScanSubmission = {
      ...metadata,
      status: "archived",
      archivedAt: new Date().toISOString(),
    }

    await put(
      `skills-scan-submissions/${id}/metadata.json`,
      JSON.stringify(updatedMetadata, null, 2),
      { access: "public", contentType: "application/json" }
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to archive submission:", error)
    return NextResponse.json({ error: "Failed to archive submission" }, { status: 500 })
  }
}
