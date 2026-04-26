import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { put, list } from "@vercel/blob"
import { decryptJSON, encryptJSON } from "@/lib/encryption"
import { PDFDocument, StandardFonts, rgb } from "pdf-lib"
import { 
  createInvoiceFromBooking, 
  generateInvoiceNumber, 
  formatDate,
  type Invoice 
} from "@/lib/invoice"
import { getPricing, formatCurrency, type ServiceOption, type PaymentOption } from "@/lib/pricing"
import { uploadToSharePoint, isSharePointConfigured, createFolder } from "@/lib/sharepoint"

// Generate professional invoice PDF
async function generateInvoicePDF(invoice: Invoice): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create()
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica)

  const page = pdfDoc.addPage([595, 842]) // A4
  const { width, height } = page.getSize()

  let y = height - 50

  // Header - Company details
  page.drawText("EWA Tracker Ltd", {
    x: 50,
    y,
    size: 20,
    font: helveticaBold,
    color: rgb(0.12, 0.23, 0.37),
  })

  y -= 18
  page.drawText("EAL Approved Centre", {
    x: 50,
    y,
    size: 10,
    font: helvetica,
    color: rgb(0.4, 0.4, 0.4),
  })

  y -= 14
  page.drawText("info@ewatracker.co.uk | 07828 893976", {
    x: 50,
    y,
    size: 9,
    font: helvetica,
    color: rgb(0.5, 0.5, 0.5),
  })

  y -= 12
  page.drawText("ewatracker.co.uk", {
    x: 50,
    y,
    size: 9,
    font: helvetica,
    color: rgb(0.5, 0.5, 0.5),
  })

  // Invoice title - right side
  page.drawText("INVOICE", {
    x: width - 150,
    y: height - 50,
    size: 28,
    font: helveticaBold,
    color: rgb(0.12, 0.23, 0.37),
  })

  // Invoice details - right side
  page.drawText(`Invoice No: ${invoice.invoiceNumber}`, {
    x: width - 200,
    y: height - 85,
    size: 10,
    font: helvetica,
    color: rgb(0.3, 0.3, 0.3),
  })

  page.drawText(`Date: ${formatDate(invoice.invoiceDate)}`, {
    x: width - 200,
    y: height - 100,
    size: 10,
    font: helvetica,
    color: rgb(0.3, 0.3, 0.3),
  })

  page.drawText(`Due Date: ${formatDate(invoice.dueDate)}`, {
    x: width - 200,
    y: height - 115,
    size: 10,
    font: helveticaBold,
    color: rgb(0.8, 0.2, 0.2),
  })

  y = height - 160

  // Divider line
  page.drawLine({
    start: { x: 50, y },
    end: { x: width - 50, y },
    thickness: 1,
    color: rgb(0.85, 0.85, 0.85),
  })

  y -= 25

  // Bill To section
  page.drawText("BILL TO:", {
    x: 50,
    y,
    size: 10,
    font: helveticaBold,
    color: rgb(0.4, 0.4, 0.4),
  })

  y -= 16
  page.drawText(invoice.candidateName, {
    x: 50,
    y,
    size: 11,
    font: helveticaBold,
    color: rgb(0.1, 0.1, 0.1),
  })

  y -= 14
  page.drawText(invoice.candidateEmail, {
    x: 50,
    y,
    size: 10,
    font: helvetica,
    color: rgb(0.3, 0.3, 0.3),
  })

  y -= 14
  page.drawText(invoice.candidatePhone, {
    x: 50,
    y,
    size: 10,
    font: helvetica,
    color: rgb(0.3, 0.3, 0.3),
  })

  // Address (wrap if needed)
  if (invoice.candidateAddress) {
    const addressLines = invoice.candidateAddress.split(/,|\n/).map(l => l.trim()).filter(Boolean)
    for (const line of addressLines.slice(0, 3)) {
      y -= 14
      page.drawText(line, {
        x: 50,
        y,
        size: 10,
        font: helvetica,
        color: rgb(0.3, 0.3, 0.3),
      })
    }
  }

  y -= 30

  // Service details
  page.drawText("SERVICE DETAILS:", {
    x: 50,
    y,
    size: 10,
    font: helveticaBold,
    color: rgb(0.4, 0.4, 0.4),
  })

  y -= 16
  page.drawText(invoice.qualification, {
    x: 50,
    y,
    size: 10,
    font: helvetica,
    color: rgb(0.2, 0.2, 0.2),
  })

  y -= 14
  page.drawText(`${invoice.serviceOption === "gold" ? "Gold Service" : "Standard Programme"} | ${invoice.paymentOption === "full" ? "Full Payment" : "Instalments"}`, {
    x: 50,
    y,
    size: 10,
    font: helvetica,
    color: rgb(0.3, 0.3, 0.3),
  })

  if (invoice.paymentOption === "instalments" && invoice.paymentNumber) {
    y -= 14
    page.drawText(`Payment ${invoice.paymentNumber} of ${invoice.totalPayments}`, {
      x: 50,
      y,
      size: 10,
      font: helveticaBold,
      color: rgb(0.12, 0.23, 0.37),
    })
  }

  y -= 35

  // Line items table header
  page.drawRectangle({
    x: 50,
    y: y - 4,
    width: width - 100,
    height: 24,
    color: rgb(0.12, 0.23, 0.37),
  })

  page.drawText("Description", {
    x: 60,
    y: y + 3,
    size: 10,
    font: helveticaBold,
    color: rgb(1, 1, 1),
  })

  page.drawText("Amount", {
    x: width - 130,
    y: y + 3,
    size: 10,
    font: helveticaBold,
    color: rgb(1, 1, 1),
  })

  y -= 30

  // Line items
  for (const item of invoice.lineItems) {
    page.drawText(item.description, {
      x: 60,
      y,
      size: 10,
      font: helvetica,
      color: rgb(0.2, 0.2, 0.2),
    })

    page.drawText(formatCurrency(item.amount), {
      x: width - 130,
      y,
      size: 10,
      font: helvetica,
      color: rgb(0.2, 0.2, 0.2),
    })

    y -= 20
  }

  // Divider
  page.drawLine({
    start: { x: width - 220, y: y + 5 },
    end: { x: width - 50, y: y + 5 },
    thickness: 1,
    color: rgb(0.85, 0.85, 0.85),
  })

  y -= 10

  // Subtotal
  page.drawText("Subtotal:", {
    x: width - 220,
    y,
    size: 10,
    font: helvetica,
    color: rgb(0.4, 0.4, 0.4),
  })

  page.drawText(formatCurrency(invoice.subtotal), {
    x: width - 130,
    y,
    size: 10,
    font: helvetica,
    color: rgb(0.2, 0.2, 0.2),
  })

  // Discount (if any)
  if (invoice.discount > 0) {
    y -= 18
    page.drawText("Discount:", {
      x: width - 220,
      y,
      size: 10,
      font: helvetica,
      color: rgb(0.02, 0.59, 0.41),
    })

    page.drawText(`-${formatCurrency(invoice.discount)}`, {
      x: width - 130,
      y,
      size: 10,
      font: helvetica,
      color: rgb(0.02, 0.59, 0.41),
    })
  }

  y -= 25

  // Amount Due box
  page.drawRectangle({
    x: width - 220,
    y: y - 8,
    width: 170,
    height: 35,
    color: rgb(0.12, 0.23, 0.37),
  })

  page.drawText("AMOUNT DUE:", {
    x: width - 210,
    y: y + 5,
    size: 10,
    font: helveticaBold,
    color: rgb(1, 1, 1),
  })

  page.drawText(formatCurrency(invoice.amountDue), {
    x: width - 130,
    y: y + 5,
    size: 14,
    font: helveticaBold,
    color: rgb(1, 1, 1),
  })

  // Remaining balance for instalments
  if (invoice.paymentOption === "instalments" && invoice.remainingBalance && invoice.remainingBalance > 0) {
    y -= 45
    page.drawText(`Remaining Balance After This Payment: ${formatCurrency(invoice.remainingBalance)}`, {
      x: width - 300,
      y,
      size: 9,
      font: helvetica,
      color: rgb(0.5, 0.5, 0.5),
    })
  }

  y -= 50

  // Payment Details Section
  page.drawRectangle({
    x: 50,
    y: y - 100,
    width: width - 100,
    height: 115,
    color: rgb(0.97, 0.98, 1),
    borderColor: rgb(0.12, 0.23, 0.37),
    borderWidth: 1,
  })

  page.drawText("PAYMENT DETAILS", {
    x: 60,
    y: y - 18,
    size: 11,
    font: helveticaBold,
    color: rgb(0.12, 0.23, 0.37),
  })

  y -= 38

  page.drawText(`Account Name: ${invoice.bankDetails.accountName}`, {
    x: 60,
    y,
    size: 10,
    font: helvetica,
    color: rgb(0.2, 0.2, 0.2),
  })

  y -= 16
  page.drawText(`Sort Code: ${invoice.bankDetails.sortCode}`, {
    x: 60,
    y,
    size: 10,
    font: helvetica,
    color: rgb(0.2, 0.2, 0.2),
  })

  y -= 16
  page.drawText(`Account Number: ${invoice.bankDetails.accountNumber}`, {
    x: 60,
    y,
    size: 10,
    font: helvetica,
    color: rgb(0.2, 0.2, 0.2),
  })

  y -= 20
  page.drawText(`Payment Reference: ${invoice.paymentReference}`, {
    x: 60,
    y,
    size: 11,
    font: helveticaBold,
    color: rgb(0.8, 0.2, 0.2),
  })

  // Footer
  page.drawLine({
    start: { x: 50, y: 60 },
    end: { x: width - 50, y: 60 },
    thickness: 0.5,
    color: rgb(0.85, 0.85, 0.85),
  })

  page.drawText("EWA Tracker Ltd | EAL Approved Centre | Company Registration: 15852314", {
    x: 50,
    y: 45,
    size: 8,
    font: helvetica,
    color: rgb(0.6, 0.6, 0.6),
  })

  page.drawText("Thank you for choosing EWA Tracker Ltd for your qualification journey.", {
    x: 50,
    y: 32,
    size: 8,
    font: helvetica,
    color: rgb(0.6, 0.6, 0.6),
  })

  return pdfDoc.save()
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { bookingId, paymentNumber = 1 } = await request.json()

    if (!bookingId) {
      return NextResponse.json({ error: "Booking ID is required" }, { status: 400 })
    }

    // Fetch booking data from Blob
    const { blobs } = await list({ prefix: `course-bookings/${bookingId}/` })
    const bookingBlob = blobs.find((b) => b.pathname.endsWith("booking.enc"))

    if (!bookingBlob) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    const encryptedData = await fetch(bookingBlob.url).then((r) => r.text())
    const bookingData = decryptJSON(encryptedData)

    // Get pricing details
    const pricingDetails = getPricing(
      bookingData.serviceOption as ServiceOption,
      bookingData.paymentOption as PaymentOption
    )

    if (!pricingDetails) {
      return NextResponse.json({ error: "Invalid pricing configuration" }, { status: 400 })
    }

    // Create invoice
    const invoice = createInvoiceFromBooking(
      bookingId,
      bookingData.fullName,
      bookingData.email,
      bookingData.contactNumber,
      bookingData.homeAddress,
      bookingData.qualification,
      bookingData.serviceOption as ServiceOption,
      bookingData.paymentOption as PaymentOption,
      pricingDetails,
      paymentNumber
    )

    // Generate PDF
    const pdfBytes = await generateInvoicePDF(invoice)

    // Store invoice data in Blob
    const encryptedInvoice = encryptJSON(invoice)
    await put(
      `invoices/${invoice.id}/invoice.enc`,
      encryptedInvoice,
      { access: "public", contentType: "text/plain" }
    )

    // Store PDF in Blob
    await put(
      `invoices/${invoice.id}/invoice.pdf`,
      pdfBytes,
      { access: "public", contentType: "application/pdf" }
    )

    // Upload to SharePoint if configured
    let sharePointUrl: string | undefined

    if (isSharePointConfigured()) {
      try {
        const dateStr = new Date().toISOString().split("T")[0].substring(0, 7)
        const folderPath = `Invoices/${dateStr}`
        await createFolder(folderPath)

        const safeName = bookingData.fullName.replace(/[^a-zA-Z0-9]/g, "-").substring(0, 30)
        const pdfFileName = `Invoice-${invoice.invoiceNumber}-${safeName}.pdf`

        const result = await uploadToSharePoint(
          folderPath,
          pdfFileName,
          Buffer.from(pdfBytes),
          "application/pdf"
        )

        if (result.success) {
          sharePointUrl = result.url
        }
      } catch (error) {
        console.error("SharePoint upload error:", error)
      }
    }

    // Update booking metadata with invoice ID
    const metadataBlob = blobs.find((b) => b.pathname.endsWith("metadata.enc"))
    if (metadataBlob) {
      const metadataEncrypted = await fetch(metadataBlob.url).then((r) => r.text())
      const metadata = decryptJSON(metadataEncrypted)
      
      const invoiceIds = metadata.invoiceIds || []
      invoiceIds.push(invoice.id)
      
      const updatedMetadata = {
        ...metadata,
        invoiceIds,
        status: "invoice_generated",
        lastInvoiceDate: new Date().toISOString(),
      }

      const encryptedMetadata = encryptJSON(updatedMetadata)
      await put(
        `course-bookings/${bookingId}/metadata.enc`,
        encryptedMetadata,
        { access: "public", contentType: "text/plain" }
      )
    }

    return NextResponse.json({
      ok: true,
      invoice: {
        id: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        amountDue: invoice.amountDue,
        dueDate: invoice.dueDate,
        paymentReference: invoice.paymentReference,
      },
      sharePointUrl,
    })
  } catch (error) {
    console.error("Invoice generation error:", error)
    return NextResponse.json(
      { ok: false, error: "Failed to generate invoice" },
      { status: 500 }
    )
  }
}
