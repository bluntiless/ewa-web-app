import { getServerSession } from "next-auth"
import { type NextRequest, NextResponse } from "next/server"
import { authOptions } from "@/lib/auth"
import { findBlob, putSensitive, readBlobJSON } from "@/lib/blob/secure-store"
import type { CandidateBackgroundSubmission } from "../list/route"

// Reads the per-request session; must run per-request, never prerendered.
export const dynamic = "force-dynamic"

const VALID_STATUSES = ["pending", "reviewed", "failed"] as const

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

    const pathname = `candidate-background-submissions/${id}/metadata.json`
    const blob = await findBlob(pathname)
    const current = blob ? await readBlobJSON<CandidateBackgroundSubmission>(blob) : null
    if (!current) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 })
    }

    const updated: CandidateBackgroundSubmission = {
      ...current,
      status,
      reviewedAt: new Date().toISOString(),
    }

    await putSensitive(pathname, JSON.stringify(updated, null, 2), {
      contentType: "application/json",
      allowOverwrite: true,
    })

    return NextResponse.json({ success: true, submission: updated })
  } catch (error) {
    console.error("Failed to update candidate background status:", error)
    return NextResponse.json({ error: "Failed to update status" }, { status: 500 })
  }
}
