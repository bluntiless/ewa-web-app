import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { list, put } from "@vercel/blob"
import { decryptJSON, encryptJSON } from "@/lib/encryption"
import type { BookingStatus } from "@/lib/booking-types"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    // Get booking data
    const { blobs } = await list({ prefix: `course-bookings/${id}/` })
    const bookingBlob = blobs.find((b) => b.pathname.endsWith("booking.enc"))

    if (!bookingBlob) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    const encryptedData = await fetch(bookingBlob.url).then((r) => r.text())
    const bookingData = decryptJSON(encryptedData)

    // Get metadata
    const metadataBlob = blobs.find((b) => b.pathname.endsWith("metadata.enc"))
    let metadata = null
    
    if (metadataBlob) {
      const metadataEncrypted = await fetch(metadataBlob.url).then((r) => r.text())
      metadata = decryptJSON(metadataEncrypted)
    }

    return NextResponse.json({ booking: bookingData, metadata })
  } catch (error) {
    console.error("Error fetching booking:", error)
    return NextResponse.json(
      { error: "Failed to fetch booking" },
      { status: 500 }
    )
  }
}

// Update booking status
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const updates = await request.json()

    // Get current metadata
    const { blobs } = await list({ prefix: `course-bookings/${id}/` })
    const metadataBlob = blobs.find((b) => b.pathname.endsWith("metadata.enc"))

    if (!metadataBlob) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    const metadataEncrypted = await fetch(metadataBlob.url).then((r) => r.text())
    const metadata = decryptJSON(metadataEncrypted)

    // Update metadata
    const updatedMetadata = {
      ...metadata,
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    // Handle specific status updates
    if (updates.status === "paid" && !metadata.paidDate) {
      updatedMetadata.paidDate = new Date().toISOString()
    }
    if (updates.status === "registered_eal" && !metadata.ealRegistrationDate) {
      updatedMetadata.ealRegistrationDate = new Date().toISOString()
    }

    const encryptedMetadata = encryptJSON(updatedMetadata)
    await put(
      `course-bookings/${id}/metadata.enc`,
      encryptedMetadata,
      { access: "public", contentType: "text/plain" }
    )

    return NextResponse.json({ ok: true, metadata: updatedMetadata })
  } catch (error) {
    console.error("Error updating booking:", error)
    return NextResponse.json(
      { error: "Failed to update booking" },
      { status: 500 }
    )
  }
}

// Archive booking
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    // Get current metadata
    const { blobs } = await list({ prefix: `course-bookings/${id}/` })
    const metadataBlob = blobs.find((b) => b.pathname.endsWith("metadata.enc"))

    if (!metadataBlob) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    const metadataEncrypted = await fetch(metadataBlob.url).then((r) => r.text())
    const metadata = decryptJSON(metadataEncrypted)

    // Mark as archived
    const updatedMetadata = {
      ...metadata,
      status: "archived" as BookingStatus,
      archivedAt: new Date().toISOString(),
    }

    const encryptedMetadata = encryptJSON(updatedMetadata)
    await put(
      `course-bookings/${id}/metadata.enc`,
      encryptedMetadata,
      { access: "public", contentType: "text/plain" }
    )

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Error archiving booking:", error)
    return NextResponse.json(
      { error: "Failed to archive booking" },
      { status: 500 }
    )
  }
}
