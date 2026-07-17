import { del, list, put } from "@vercel/blob"
import { getServerSession } from "next-auth"
import { type NextRequest, NextResponse } from "next/server"
import { authOptions } from "@/lib/auth"
import type { EligibilityCheckSubmission } from "../list/route"

const VALID_STATUSES = ["pending", "reviewed", "failed"] as const

async function getMetadataUrl(id: string): Promise<string | null> {
  const { blobs } = await list({ prefix: `eligibility-checks/${id}/` })
  const blob = blobs.find((b) => b.pathname.endsWith("metadata.json"))
  return blob?.url || null
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  try {
    const { status } = await request.json()

    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    const metadataUrl = await getMetadataUrl(id)
    if (!metadataUrl) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 })
    }

    const current = (await fetch(metadataUrl).then((r) => r.json())) as EligibilityCheckSubmission

    const updated: EligibilityCheckSubmission = {
      ...current,
      status,
      reviewedAt: new Date().toISOString(),
    }

    await put(`eligibility-checks/${id}/metadata.json`, JSON.stringify(updated, null, 2), {
      access: "public",
      contentType: "application/json",
      allowOverwrite: true,
    })

    return NextResponse.json({ success: true, submission: updated })
  } catch (error) {
    console.error("Failed to update eligibility check status:", error)
    return NextResponse.json({ error: "Failed to update status" }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  try {
    const { blobs } = await list({ prefix: `eligibility-checks/${id}/` })
    if (blobs.length === 0) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 })
    }
    await Promise.all(blobs.map((b) => del(b.url)))
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete eligibility check:", error)
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 })
  }
}
