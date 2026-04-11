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

    // Filter to only encrypted metadata files
    const metadataBlobs = blobs.filter((blob) => blob.pathname.endsWith("/metadata.enc"))

    // Fetch and decrypt each metadata file
    const submissions: SkillsScanSubmission[] = []

    for (const blob of metadataBlobs) {
      try {
        const response = await fetch(blob.url)
        if (response.ok) {
          const encryptedText = await response.text()
          const metadata = decryptJSON<SkillsScanSubmission>(encryptedText)
          submissions.push(metadata)
        }
      } catch (err) {
        console.error(`Failed to read/decrypt metadata for ${blob.pathname}:`, err)
      }
    }

    // Sort by submission date, newest first
    submissions.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())

    return NextResponse.json({ submissions })
  } catch (error) {
    console.error("Failed to list submissions:", error)
    return NextResponse.json({ error: "Failed to list submissions" }, { status: 500 })
  }
}
