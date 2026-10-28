import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { adminFileUrl, listMerged, readBlobJSON } from "@/lib/blob/secure-store"

// Reads the per-request session; must run per-request, never prerendered.
export const dynamic = "force-dynamic"

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

    const blobs = await listMerged("candidate-background-submissions/")

    const metadataBlobs = blobs.filter((b) => b.pathname.endsWith("metadata.json"))
    const pdfBlobs = blobs.filter((b) => b.pathname.endsWith("completed.pdf"))

    const submissions: CandidateBackgroundSubmission[] = []

    for (const blob of metadataBlobs) {
      try {
        const metadata = await readBlobJSON<CandidateBackgroundSubmission>(blob)
        if (!metadata) continue
        // PDF is served through the authenticated admin file route, never a raw Blob URL.
        const folder = blob.pathname.replace(/metadata\.json$/, "")
        const pdf = pdfBlobs.find((p) => p.pathname.startsWith(folder))
        submissions.push({
          ...metadata,
          status: metadata.status || "pending",
          pdfUrl: pdf ? adminFileUrl(pdf.pathname) : undefined,
        })
      } catch (error) {
        console.error(`Failed to read candidate background metadata: ${blob.pathname}`, error)
      }
    }

    submissions.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())

    return NextResponse.json({ submissions })
  } catch (error) {
    console.error("Error listing candidate background submissions:", error)
    return NextResponse.json({ error: "Failed to list submissions" }, { status: 500 })
  }
}
