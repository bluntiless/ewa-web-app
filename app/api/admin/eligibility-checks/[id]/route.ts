import { getServerSession } from "next-auth"
import { type NextRequest, NextResponse } from "next/server"
import { authOptions } from "@/lib/auth"
import { deleteBlobs, findBlob, listStore, putSensitive, readBlobJSON } from "@/lib/blob/secure-store"
import type { EligibilityCheckSubmission } from "../list/route"

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

    const pathname = `eligibility-checks/${id}/metadata.json`
    const blob = await findBlob(pathname)
    const current = blob ? await readBlobJSON<EligibilityCheckSubmission>(blob) : null
    if (!current) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 })
    }

    const updated: EligibilityCheckSubmission = {
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
    // Delete from both stores explicitly so no stale legacy copy survives.
    const prefix = `eligibility-checks/${id}/`
    const [priv, pub] = await Promise.all([listStore(prefix, "private"), listStore(prefix, "public")])
    if (priv.length + pub.length === 0) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 })
    }
    await deleteBlobs([...priv, ...pub])
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete eligibility check:", error)
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 })
  }
}
