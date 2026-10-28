import { put } from "@vercel/blob"
import { adminFileUrl, findBlob, listMerged, putSensitive, readBlobJSON, readBlobText } from "@/lib/blob/secure-store"
import { getServerSession } from "next-auth"
import { type NextRequest, NextResponse } from "next/server"
import { authOptions } from "@/lib/auth"

// Reads the per-request session; must run per-request, never prerendered.
export const dynamic = "force-dynamic"
import type { SkillsScanSubmission, SkillsScanSubmissionData } from "@/lib/skills-scan-submission"
import { decryptJSON, encryptJSON } from "@/lib/encryption"


// Resolve which metadata format a submission uses.
// Current PDF uploads store plaintext "metadata.json"; legacy questionnaire
// submissions store encrypted "metadata.enc".
async function resolveMetadata(id: string): Promise<
  | { format: "json"; data: SkillsScanSubmission }
  | { format: "enc"; data: SkillsScanSubmission }
  | null
> {
  const jsonBlob = await findBlob(`skills-scan-submissions/${id}/metadata.json`)
  if (jsonBlob) {
    const data = await readBlobJSON<SkillsScanSubmission>(jsonBlob)
    if (data) return { format: "json", data: { ...data, status: data.status || "pending" } }
  }

  const encBlob = await findBlob(`skills-scan-submissions/${id}/metadata.enc`)
  if (encBlob) {
    const text = await readBlobText(encBlob)
    if (text) return { format: "enc", data: decryptJSON<SkillsScanSubmission>(text) }
  }

  return null
}

async function writeMetadata(id: string, format: "json" | "enc", data: SkillsScanSubmission) {
  if (format === "json") {
    await putSensitive(`skills-scan-submissions/${id}/metadata.json`, JSON.stringify(data, null, 2), {
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
    const responseBlob = await findBlob(`skills-scan-submissions/${id}/response.enc`)
    const responseText = responseBlob ? await readBlobText(responseBlob) : null
    if (responseText) {
      return NextResponse.json(decryptJSON<SkillsScanSubmissionData>(responseText))
    }

    // PDF-upload submissions have no questionnaire payload — return metadata
    // plus the completed PDF link so the admin can download it.
    const resolved = await resolveMetadata(id)
    if (resolved) {
      const blobs = await listMerged(`skills-scan-submissions/${id}/`)
      const pdf = blobs.find((b) => b.pathname.endsWith("/completed.pdf"))
      return NextResponse.json({
        metadata: { ...resolved.data, pdfUrl: pdf ? adminFileUrl(pdf.pathname) : undefined },
        formData: null,
      })
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
