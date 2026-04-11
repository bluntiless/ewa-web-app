import { get, put } from "@vercel/blob"
import { getServerSession } from "next-auth"
import { type NextRequest, NextResponse } from "next/server"
import { authOptions } from "@/lib/auth"
import type { SkillsScanSubmission, SkillsScanSubmissionData } from "@/lib/skills-scan-submission"

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
    // Get the full response data
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
    const result = await get(`skills-scan-submissions/${id}/metadata.json`, {
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
    const metadata = JSON.parse(text) as SkillsScanSubmission

    // Update metadata
    const updatedMetadata: SkillsScanSubmission = {
      ...metadata,
      ...updates,
    }

    // Save updated metadata
    await put(
      `skills-scan-submissions/${id}/metadata.json`,
      JSON.stringify(updatedMetadata, null, 2),
      { access: "private", contentType: "application/json" }
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
    const result = await get(`skills-scan-submissions/${id}/metadata.json`, {
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
    const metadata = JSON.parse(text) as SkillsScanSubmission

    // Archive the submission
    const updatedMetadata: SkillsScanSubmission = {
      ...metadata,
      status: "archived",
      archivedAt: new Date().toISOString(),
    }

    await put(
      `skills-scan-submissions/${id}/metadata.json`,
      JSON.stringify(updatedMetadata, null, 2),
      { access: "private", contentType: "application/json" }
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to archive submission:", error)
    return NextResponse.json({ error: "Failed to archive submission" }, { status: 500 })
  }
}
