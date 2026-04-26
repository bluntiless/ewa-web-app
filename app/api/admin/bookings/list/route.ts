import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { list } from "@vercel/blob"
import { decryptJSON } from "@/lib/encryption"
import type { BookingMetadata } from "@/lib/booking-types"

export type { BookingStatus, BookingMetadata } from "@/lib/booking-types"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // List all booking folders
    const { blobs } = await list({ prefix: "course-bookings/" })

    // Group blobs by booking ID and get metadata files
    const metadataBlobs = blobs.filter((b) => b.pathname.endsWith("metadata.enc"))

    const bookings: BookingMetadata[] = []

    for (const blob of metadataBlobs) {
      try {
        const encryptedData = await fetch(blob.url).then((r) => r.text())
        const metadata = decryptJSON(encryptedData) as BookingMetadata
        bookings.push(metadata)
      } catch (error) {
        console.error(`Failed to decrypt booking metadata: ${blob.pathname}`, error)
      }
    }

    // Sort by submission date, newest first
    bookings.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())

    return NextResponse.json({ bookings })
  } catch (error) {
    console.error("Error listing bookings:", error)
    return NextResponse.json(
      { error: "Failed to list bookings" },
      { status: 500 }
    )
  }
}
