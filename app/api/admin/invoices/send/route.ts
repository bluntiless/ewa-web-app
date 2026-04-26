import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { list, put } from "@vercel/blob"
import { decryptJSON, encryptJSON } from "@/lib/encryption"
import { formatCurrency, bankDetails } from "@/lib/pricing"
import { formatDate, type Invoice } from "@/lib/invoice"

// Resend client is initialized lazily inside the handler to avoid build-time errors
async function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    throw new Error("RESEND_API_KEY environment variable is not set")
  }
  const { Resend } = await import("resend")
  return new Resend(apiKey)
}

// Generate HTML email content for invoice
function generateInvoiceEmailHTML(invoice: Invoice): string {
  const isInstalments = invoice.paymentOption === "instalments"
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice ${invoice.invoiceNumber} - EWA Tracker Ltd</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <!-- Header -->
    <tr>
      <td style="padding: 30px 40px; background-color: #1e3a5f;">
        <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: bold;">EWA Tracker Ltd</h1>
        <p style="margin: 5px 0 0 0; color: #94a3b8; font-size: 14px;">EAL Approved Centre</p>
      </td>
    </tr>
    
    <!-- Invoice Header -->
    <tr>
      <td style="padding: 30px 40px 20px;">
        <table cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td>
              <h2 style="margin: 0 0 10px 0; color: #1e3a5f; font-size: 28px;">INVOICE</h2>
              <p style="margin: 0; color: #64748b; font-size: 14px;">Invoice No: <strong style="color: #1e3a5f;">${invoice.invoiceNumber}</strong></p>
              <p style="margin: 5px 0 0 0; color: #64748b; font-size: 14px;">Date: ${formatDate(invoice.invoiceDate)}</p>
            </td>
            <td style="text-align: right; vertical-align: top;">
              <p style="margin: 0; padding: 10px 20px; background-color: #fee2e2; color: #dc2626; border-radius: 8px; font-size: 14px; font-weight: bold; display: inline-block;">
                Due: ${formatDate(invoice.dueDate)}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    
    <!-- Greeting -->
    <tr>
      <td style="padding: 0 40px 20px;">
        <p style="margin: 0; color: #374151; font-size: 16px; line-height: 1.6;">
          Dear ${invoice.candidateName},
        </p>
        <p style="margin: 15px 0 0 0; color: #374151; font-size: 16px; line-height: 1.6;">
          Thank you for choosing EWA Tracker Ltd for your ${invoice.serviceOption === "gold" ? "Gold Service" : "Standard"} qualification programme. Please find your invoice details below.
        </p>
      </td>
    </tr>
    
    <!-- Service Details -->
    <tr>
      <td style="padding: 0 40px 20px;">
        <table cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border-radius: 8px; overflow: hidden;">
          <tr>
            <td style="padding: 20px;">
              <p style="margin: 0 0 5px 0; color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Service</p>
              <p style="margin: 0; color: #1e3a5f; font-size: 16px; font-weight: 600;">
                ${invoice.qualification}
              </p>
              <p style="margin: 8px 0 0 0; color: #64748b; font-size: 14px;">
                ${invoice.serviceOption === "gold" ? "Gold Service" : "Standard Programme"} | ${invoice.paymentOption === "full" ? "Full Payment" : "Instalments"}
                ${isInstalments && invoice.paymentNumber ? ` (Payment ${invoice.paymentNumber} of ${invoice.totalPayments})` : ""}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    
    <!-- Line Items -->
    <tr>
      <td style="padding: 0 40px 20px;">
        <table cellpadding="0" cellspacing="0" width="100%" style="border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
          <tr style="background-color: #1e3a5f;">
            <td style="padding: 12px 16px; color: #ffffff; font-size: 14px; font-weight: 600;">Description</td>
            <td style="padding: 12px 16px; color: #ffffff; font-size: 14px; font-weight: 600; text-align: right;">Amount</td>
          </tr>
          ${invoice.lineItems.map(item => `
          <tr>
            <td style="padding: 16px; color: #374151; font-size: 14px; border-bottom: 1px solid #e2e8f0;">${item.description}</td>
            <td style="padding: 16px; color: #374151; font-size: 14px; text-align: right; border-bottom: 1px solid #e2e8f0;">${formatCurrency(item.amount)}</td>
          </tr>
          `).join("")}
          ${invoice.discount > 0 ? `
          <tr>
            <td style="padding: 16px; color: #059669; font-size: 14px; border-bottom: 1px solid #e2e8f0;">Discount</td>
            <td style="padding: 16px; color: #059669; font-size: 14px; text-align: right; border-bottom: 1px solid #e2e8f0;">-${formatCurrency(invoice.discount)}</td>
          </tr>
          ` : ""}
          <tr style="background-color: #1e3a5f;">
            <td style="padding: 16px; color: #ffffff; font-size: 16px; font-weight: bold;">Amount Due</td>
            <td style="padding: 16px; color: #ffffff; font-size: 20px; font-weight: bold; text-align: right;">${formatCurrency(invoice.amountDue)}</td>
          </tr>
        </table>
      </td>
    </tr>
    
    ${isInstalments && invoice.remainingBalance && invoice.remainingBalance > 0 ? `
    <tr>
      <td style="padding: 0 40px 20px;">
        <p style="margin: 0; color: #64748b; font-size: 14px; text-align: right;">
          Remaining balance after this payment: <strong>${formatCurrency(invoice.remainingBalance)}</strong>
        </p>
      </td>
    </tr>
    ` : ""}
    
    <!-- Payment Details -->
    <tr>
      <td style="padding: 0 40px 30px;">
        <table cellpadding="0" cellspacing="0" width="100%" style="background-color: #eff6ff; border: 2px solid #1e3a5f; border-radius: 8px;">
          <tr>
            <td style="padding: 24px;">
              <h3 style="margin: 0 0 16px 0; color: #1e3a5f; font-size: 18px; font-weight: bold;">Payment Details</h3>
              <table cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="padding: 4px 0; color: #64748b; font-size: 14px; width: 140px;">Account Name:</td>
                  <td style="padding: 4px 0; color: #1e3a5f; font-size: 14px; font-weight: 600;">${bankDetails.accountName}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; color: #64748b; font-size: 14px;">Sort Code:</td>
                  <td style="padding: 4px 0; color: #1e3a5f; font-size: 14px; font-weight: 600;">${bankDetails.sortCode}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; color: #64748b; font-size: 14px;">Account Number:</td>
                  <td style="padding: 4px 0; color: #1e3a5f; font-size: 14px; font-weight: 600;">${bankDetails.accountNumber}</td>
                </tr>
              </table>
              <div style="margin-top: 16px; padding: 12px 16px; background-color: #fef2f2; border-radius: 6px;">
                <p style="margin: 0; color: #dc2626; font-size: 14px;">
                  <strong>Payment Reference:</strong> ${invoice.paymentReference}
                </p>
                <p style="margin: 8px 0 0 0; color: #64748b; font-size: 12px;">
                  Please use this reference when making your payment
                </p>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    
    <!-- Next Steps -->
    <tr>
      <td style="padding: 0 40px 30px;">
        <h3 style="margin: 0 0 12px 0; color: #1e3a5f; font-size: 16px; font-weight: bold;">Next Steps</h3>
        <ol style="margin: 0; padding-left: 20px; color: #374151; font-size: 14px; line-height: 1.8;">
          <li>Make payment using the bank details above</li>
          <li>Include your payment reference: <strong>${invoice.paymentReference}</strong></li>
          <li>Once payment is confirmed, we will send your EAL registration details</li>
          ${isInstalments ? `<li>Your next payment will be due approximately 1 month after your programme start date</li>` : ""}
        </ol>
      </td>
    </tr>
    
    <!-- Contact -->
    <tr>
      <td style="padding: 0 40px 30px;">
        <p style="margin: 0; color: #374151; font-size: 14px; line-height: 1.6;">
          If you have any questions about this invoice or your programme, please don&apos;t hesitate to contact us:
        </p>
        <p style="margin: 10px 0 0 0; color: #1e3a5f; font-size: 14px;">
          <strong>Email:</strong> info@ewatracker.co.uk<br>
          <strong>Phone:</strong> 07828 893976
        </p>
      </td>
    </tr>
    
    <!-- Footer -->
    <tr>
      <td style="padding: 20px 40px; background-color: #f8fafc; border-top: 1px solid #e2e8f0;">
        <p style="margin: 0; color: #64748b; font-size: 12px; text-align: center;">
          EWA Tracker Ltd | EAL Approved Centre | Company Registration: 15852314
        </p>
        <p style="margin: 8px 0 0 0; color: #94a3b8; font-size: 11px; text-align: center;">
          This invoice was generated electronically and is valid without a signature.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
`
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check for Resend API key
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: "Email service not configured. Please add RESEND_API_KEY." },
        { status: 500 }
      )
    }

    const { bookingId } = await request.json()

    if (!bookingId) {
      return NextResponse.json({ error: "Booking ID is required" }, { status: 400 })
    }

    // Get booking metadata
    const { blobs } = await list({ prefix: `course-bookings/${bookingId}/` })
    const metadataBlob = blobs.find((b) => b.pathname.endsWith("metadata.enc"))

    if (!metadataBlob) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    const metadataEncrypted = await fetch(metadataBlob.url).then((r) => r.text())
    const metadata = decryptJSON(metadataEncrypted)

    // Get the latest invoice
    const invoiceIds = metadata.invoiceIds || []
    if (invoiceIds.length === 0) {
      return NextResponse.json(
        { error: "No invoice found. Please generate an invoice first." },
        { status: 400 }
      )
    }

    const latestInvoiceId = invoiceIds[invoiceIds.length - 1]

    // Fetch invoice data
    const { blobs: invoiceBlobs } = await list({ prefix: `invoices/${latestInvoiceId}/` })
    const invoiceDataBlob = invoiceBlobs.find((b) => b.pathname.endsWith("invoice.enc"))
    const invoicePdfBlob = invoiceBlobs.find((b) => b.pathname.endsWith("invoice.pdf"))

    if (!invoiceDataBlob) {
      return NextResponse.json({ error: "Invoice data not found" }, { status: 404 })
    }

    const invoiceEncrypted = await fetch(invoiceDataBlob.url).then((r) => r.text())
    const invoice = decryptJSON(invoiceEncrypted) as Invoice

    // Get PDF as attachment if available
    let pdfAttachment: { filename: string; content: Buffer } | undefined
    if (invoicePdfBlob) {
      const pdfResponse = await fetch(invoicePdfBlob.url)
      const pdfBuffer = await pdfResponse.arrayBuffer()
      pdfAttachment = {
        filename: `Invoice-${invoice.invoiceNumber}.pdf`,
        content: Buffer.from(pdfBuffer),
      }
    }

    // Send email via Resend
    const resend = getResendClient()
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "EWA Tracker <invoices@ewatracker.co.uk>",
      to: [invoice.candidateEmail],
      subject: `Invoice ${invoice.invoiceNumber} - EWA Tracker Ltd`,
      html: generateInvoiceEmailHTML(invoice),
      attachments: pdfAttachment ? [pdfAttachment] : undefined,
    })

    if (error) {
      console.error("Resend error:", error)
      return NextResponse.json(
        { error: `Failed to send email: ${error.message}` },
        { status: 500 }
      )
    }

    // Update invoice status
    const updatedInvoice = {
      ...invoice,
      status: "sent" as const,
      sentAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const encryptedInvoice = encryptJSON(updatedInvoice)
    await put(
      `invoices/${latestInvoiceId}/invoice.enc`,
      encryptedInvoice,
      { access: "public", contentType: "text/plain" }
    )

    // Update booking metadata
    const updatedMetadata = {
      ...metadata,
      status: "invoice_sent",
      lastEmailSentAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const encryptedMetadata = encryptJSON(updatedMetadata)
    await put(
      `course-bookings/${bookingId}/metadata.enc`,
      encryptedMetadata,
      { access: "public", contentType: "text/plain" }
    )

    return NextResponse.json({
      ok: true,
      emailId: data?.id,
      sentTo: invoice.candidateEmail,
      invoiceNumber: invoice.invoiceNumber,
    })
  } catch (error) {
    console.error("Invoice email error:", error)
    return NextResponse.json(
      { ok: false, error: "Failed to send invoice email" },
      { status: 500 }
    )
  }
}
