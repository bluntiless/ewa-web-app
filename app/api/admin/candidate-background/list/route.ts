import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { list } from "@vercel/blob"

export type CandidateBackgroundStatus = "pending" | "reviewed" | "failed"

export interface CandidateBackgroundSubmission {
  id: string
  candidateName: string
  email: string
  formType: string
  submittedAt: string
  originalFileName?: string
  pdfUrl?: string
  status?: CandidateBackgroundStatus
  reviewedAt?: string
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // List all candidate background submission folders
    const { blobs } = await list({ prefix: "candidate-background-submissions/" })

    // Find metadata (plain JSON) and the completed PDF for each submission
    const metadataBlobs = blobs.filter((b) => b.pathname.endsWith("metadata.json"))
    const pdfBlobs = blobs.filter((b) => b.pathname.endsWith("completed.pdf"))

    const submissions: CandidateBackgroundSubmission[] = []

    for (const blob of metadataBlobs) {
      try {
        const metadata = (await fetch(blob.url).then((r) => r.json())) as CandidateBackgroundSubmission
        // Attach the matching PDF download URL (same submission folder)
        const folder = blob.pathname.replace(/metadata\.json$/, "")
        const pdf = pdfBlobs.find((p) => p.pathname.startsWith(folder))
        submissions.push({ ...metadata, status: metadata.status || "pending", pdfUrl: pdf?.url })
      } catch (error) {
        console.error(`Failed to read candidate background metadata: ${blob.pathname}`, error)
      }
    }

    // Sort by submission date, newest first
    submissions.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())

    return NextResponse.json({ submissions })
  } catch (error) {
    console.error("Error listing candidate background submissions:", error)
    return NextResponse.json({ error: "Failed to list submissions" }, { status: 500 })
  }
}
