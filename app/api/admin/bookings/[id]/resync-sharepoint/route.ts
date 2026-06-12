import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { list } from "@vercel/blob"
import { decryptJSON } from "@/lib/encryption"
import { uploadToSharePoint, isSharePointConfigured, createFolder } from "@/lib/sharepoint"
import { generateBookingPDF, type CourseBookingData } from "@/app/api/course-booking/submit/route"

// Recovers a booking form that failed to upload to SharePoint at submission time.
// Loads the encrypted booking record from Blob, regenerates the PDF + JSON,
// and uploads both to SharePoint using the same folder/naming convention.
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!isSharePointConfigured()) {
      return NextResponse.json(
        { error: "SharePoint is not configured, so the booking form cannot be uploaded." },
        { status: 400 }
      )
    }

    const { id } = await params

    // Load the encrypted booking record from Blob
    const { blobs } = await list({ prefix: `course-bookings/${id}/` })
    const bookingBlob = blobs.find((b) => b.pathname.endsWith("booking.enc"))

    if (!bookingBlob) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    const encryptedData = await fetch(bookingBlob.url).then((r) => r.text())
    const bookingData = decryptJSON(encryptedData) as CourseBookingData & { submittedAt?: string }

    // Determine the original submission date so the file lands in the correct YYYY-MM folder
    const submittedAt = bookingData.submittedAt || new Date().toISOString()
    const dateStr = submittedAt.split("T")[0]

    // Regenerate the booking PDF (this is the step that previously failed)
    const pdfBytes = await generateBookingPDF(bookingData, id, submittedAt)
    const jsonContent = JSON.stringify(bookingData, null, 2)

    // Same folder + naming convention as the original submission flow
    const safeName = (bookingData.fullName || "Candidate").replace(/[^a-zA-Z0-9]/g, "-").substring(0, 30)
    const folderPath = `Course-Booking-Forms/${dateStr.substring(0, 7)}`
    await createFolder(folderPath)

    const pdfFileName = `Course-Booking-Form-${safeName}-${dateStr}.pdf`
    const jsonFileName = `Course-Booking-Form-${safeName}-${dateStr}.json`

    const pdfResult = await uploadToSharePoint(
      folderPath,
      pdfFileName,
      Buffer.from(pdfBytes),
      "application/pdf"
    )

    if (!pdfResult.success) {
      return NextResponse.json(
        { error: `SharePoint PDF upload failed: ${pdfResult.error}` },
        { status: 502 }
      )
    }

    const jsonResult = await uploadToSharePoint(
      folderPath,
      jsonFileName,
      Buffer.from(jsonContent),
      "application/json"
    )

    return NextResponse.json({
      ok: true,
      pdfUrl: pdfResult.url,
      jsonUrl: jsonResult.success ? jsonResult.url : undefined,
      fileName: pdfFileName,
    })
  } catch (error) {
    console.error("Error resyncing booking to SharePoint:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to resync booking form" },
      { status: 500 }
    )
  }
}
