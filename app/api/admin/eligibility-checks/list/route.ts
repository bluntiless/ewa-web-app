import { list } from "@vercel/blob"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { authOptions } from "@/lib/auth"

export type EligibilityStatus = "pending" | "reviewed" | "failed"

export interface EligibilityCheckSubmission {
  id: string
  candidateName: string
  email: string
  phone?: string
  experience?: string
  level2Qualification?: string
  level3Qualification?: string
  bs7671Status?: string
  itStatus?: string
  workType?: string
  pathway?: string
  eligibilityResult?: string
  recommendations?: string
  submittedAt: string
  status?: EligibilityStatus
  reviewedAt?: string
}

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { blobs } = await list({ prefix: "eligibility-checks/" })
    const metadataBlobs = blobs.filter((b) => b.pathname.endsWith("metadata.json"))

    const submissions: EligibilityCheckSubmission[] = []

    for (const blob of metadataBlobs) {
      try {
        const metadata = (await fetch(blob.url).then((r) => r.json())) as EligibilityCheckSubmission
        submissions.push({ ...metadata, status: metadata.status || "pending" })
      } catch (error) {
        console.error(`Failed to read eligibility metadata: ${blob.pathname}`, error)
      }
    }

    // Newest first
    submissions.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())

    return NextResponse.json({ submissions })
  } catch (error) {
    console.error("Failed to list eligibility checks:", error)
    return NextResponse.json({ error: "Failed to list eligibility checks" }, { status: 500 })
  }
}
