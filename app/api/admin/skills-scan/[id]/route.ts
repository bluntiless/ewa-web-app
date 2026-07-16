import { list, put } from "@vercel/blob"
import { getServerSession } from "next-auth"
import { type NextRequest, NextResponse } from "next/server"
import { authOptions } from "@/lib/auth"
import type { SkillsScanSubmission, SkillsScanSubmissionData } from "@/lib/skills-scan-submission"
import { decryptJSON, encryptJSON } from "@/lib/encryption"

// Helper to find a blob URL by exact pathname
async function getBlobUrl(pathname: string): Promise<string | null> {
  const { blobs } = await list({ prefix: pathname.split("/").slice(0, -1).join("/") + "/" })
  const blob = blobs.find((b) => b.pathname === pathname)
  return blob?.url || null
}

// Resolve which metadata format a submission uses.
// Current PDF uploads store plaintext "metadata.json"; legacy questionnaire
// submissions store encrypted "metadata.enc".
async function resolveMetadata(id: string): Promise<
  | { format: "json"; url: string; data: SkillsScanSubmission }
  | { format: "enc"; url: string; data: SkillsScanSubmission }
  | null
> {
  const jsonUrl = await getBlobUrl(`skills-scan-submissions/${id}/metadata.json`)
  if (jsonUrl) {
    const res = await fetch(jsonUrl)
    if (res.ok) {
      const data = (await res.json()) as SkillsScanSubmission
      return { format: "json", url: jsonUrl, data: { ...data, status: data.status || "pending" } }
    }
  }

  const encUrl = await getBlobUrl(`skills-scan-submissions/${id}/metadata.enc`)
  if (encUrl) {
    const res = await fetch(encUrl)
    if (res.ok) {
      const data = decryptJSON<SkillsScanSubmission>(await res.text())
      return { format: "enc", url: encUrl, data }
    }
  }

  return null
}

async function writeMetadata(id: string, format: "json" | "enc", data: SkillsScanSubmission) {
  if (format === "json") {
    await put(`skills-scan-submissions/${id}/metadata.json`, JSON.stringify(data, null, 2), {
      access: "public",
      contentType: "application/json",
      allowOverwrite: true,
    })
  } else {
    await put(`skills-scan-submissions/${id}/metadata.enc`, encryptJSON(data), {
      access: "public",
      contentType: "text/plain",
      allowOverwrite: true,
    })
  }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  try {
    // Legacy questionnaire submissions have a full encrypted response payload.
    const responseUrl = await getBlobUrl(`skills-scan-submissions/${id}/response.enc`)
    if (responseUrl) {
      const response = await fetch(responseUrl)
      if (response.ok) {
        const data = decryptJSON<SkillsScanSubmissionData>(await response.text())
        return NextResponse.json(data)
      }
    }

    // PDF-upload submissions have no questionnaire payload — return metadata
    // plus the completed PDF link so the admin can download it.
    const resolved = await resolveMetadata(id)
    if (resolved) {
      const { blobs } = await list({ prefix: `skills-scan-submissions/${id}/` })
      const pdf = blobs.find((b) => b.pathname.endsWith("/completed.pdf"))
      return NextResponse.json({ metadata: { ...resolved.data, pdfUrl: pdf?.url }, formData: null })
    }

    return NextResponse.json({ error: "Submission not found" }, { status: 404 })
  } catch (error) {
    console.error("Failed to get submission:", error)
    return NextResponse.json({ error: "Failed to get submission" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const updates = await request.json()

  try {
    const resolved = await resolveMetadata(id)
    if (!resolved) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 })
    }

    const updatedMetadata: SkillsScanSubmission = { ...resolved.data, ...updates }
    await writeMetadata(id, resolved.format, updatedMetadata)

    return NextResponse.json({ success: true, metadata: updatedMetadata })
  } catch (error) {
    console.error("Failed to update submission:", error)
    return NextResponse.json({ error: "Failed to update submission" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  try {
    const resolved = await resolveMetadata(id)
    if (!resolved) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 })
    }

    const updatedMetadata: SkillsScanSubmission = {
      ...resolved.data,
      status: "archived",
      archivedAt: new Date().toISOString(),
    }
    await writeMetadata(id, resolved.format, updatedMetadata)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to archive submission:", error)
    return NextResponse.json({ error: "Failed to archive submission" }, { status: 500 })
  }
}
