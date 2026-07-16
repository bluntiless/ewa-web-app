import { list } from "@vercel/blob"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { authOptions } from "@/lib/auth"
import type { SkillsScanSubmission } from "@/lib/skills-scan-submission"
import { decryptJSON } from "@/lib/encryption"

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // List all submission folders
    const { blobs } = await list({
      prefix: "skills-scan-submissions/",
    })

    // Two submission formats live under this prefix:
    //  - metadata.enc  -> legacy encrypted questionnaire submissions
    //  - metadata.json -> current PDF-upload submissions (candidate uploads a
    //    completed PDF, which is also pushed to SharePoint)
    const encBlobs = blobs.filter((blob) => blob.pathname.endsWith("/metadata.enc"))
    const jsonBlobs = blobs.filter((blob) => blob.pathname.endsWith("/metadata.json"))
    const pdfBlobs = blobs.filter((blob) => blob.pathname.endsWith("/completed.pdf"))

    const byId = new Map<string, SkillsScanSubmission>()

    // Legacy encrypted questionnaire submissions
    for (const blob of encBlobs) {
      try {
        const response = await fetch(blob.url)
        if (response.ok) {
          const encryptedText = await response.text()
          const metadata = decryptJSON<SkillsScanSubmission>(encryptedText)
          byId.set(metadata.id, { ...metadata, source: "enc" })
        }
      } catch (err) {
        console.error(`Failed to read/decrypt metadata for ${blob.pathname}:`, err)
      }
    }

    // Current PDF-upload submissions (plaintext JSON metadata + completed.pdf)
    for (const blob of jsonBlobs) {
      try {
        const meta = (await fetch(blob.url).then((r) => r.json())) as {
          id: string
          candidateName: string
          email: string
          submittedAt: string
          status?: SkillsScanSubmission["status"]
          archivedAt?: string
          originalFileName?: string
        }

        // Attach the matching completed PDF from the same submission folder
        const folder = blob.pathname.replace(/metadata\.json$/, "")
        const pdf = pdfBlobs.find((p) => p.pathname.startsWith(folder))

        byId.set(meta.id, {
          id: meta.id,
          candidateName: meta.candidateName,
          email: meta.email,
          phone: "",
          yearsExperience: "",
          submittedAt: meta.submittedAt,
          status: meta.status || "pending",
          archivedAt: meta.archivedAt,
          originalFileName: meta.originalFileName,
          pdfUrl: pdf?.url,
          source: "json",
        })
      } catch (err) {
        console.error(`Failed to read metadata for ${blob.pathname}:`, err)
      }
    }

    const submissions = Array.from(byId.values())

    // Sort by submission date, newest first
    submissions.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())

    return NextResponse.json({ submissions })
  } catch (error) {
    console.error("Failed to list submissions:", error)
    return NextResponse.json({ error: "Failed to list submissions" }, { status: 500 })
  }
}
