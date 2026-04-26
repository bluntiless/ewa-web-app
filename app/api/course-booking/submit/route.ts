import { put } from "@vercel/blob"
import { NextResponse } from "next/server"
import { encryptJSON } from "@/lib/encryption"
import { uploadToSharePoint, isSharePointConfigured, createFolder } from "@/lib/sharepoint"
import { PDFDocument, StandardFonts, rgb } from "pdf-lib"
import { 
  createInvoiceFromBooking, 
  generateInvoiceNumber,
  formatDate as formatInvoiceDate,
  type Invoice 
} from "@/lib/invoice"
import { 
  getPricing, 
  formatCurrency as formatPriceCurrency, 
  bankDetails,
  type PricingDetails
} from "@/lib/pricing"

interface CourseBookingData {
  // Section A - Candidate Details
  fullName: string
  dateOfBirth: string
  homeAddress: string
  email: string
  contactNumber: string
  ethnicity: string

  // Section B - Employer Details
  employerName: string
  companyContactName: string
  employerAddress: string
  employerTelephone: string
  employerMobile: string
  employerEmail: string

  // Section C - Course/Booking Details
  qualification: string
  route: string
  serviceOption: "standard" | "gold"
  paymentOption: "full" | "instalments"
  preferredStartDate: string
  notes: string

  // Section D - Declaration
  declarationAccepted: boolean

  // Section E - Digital Signature
  digitalSignature: string
}

// Pricing structure
const pricing = {
  standardFull: {
    programmeFee: 2000,
    registrationFee: 224,
    discount: 112,
    total: 2112,
    description: "Standard Programme - Full Payment",
  },
  standardInstalments: {
    initialPayment: 724,
    remainingPayments: [
      { amount: 500, due: "1 month after start" },
      { amount: 500, due: "2 months after start" },
      { amount: 500, due: "3 months after start" },
    ],
    total: 2224,
    description: "Standard Programme - Instalments",
  },
  goldFull: {
    programmeFee: 2500,
    registrationFee: 224,
    discount: 168,
    total: 2556,
    description: "Gold Service - Full Payment",
  },
  goldInstalments: {
    initialPayment: 724,
    remainingPayments: [
      { amount: 500, due: "1 month after start" },
      { amount: 500, due: "2 months after start" },
      { amount: 500, due: "3 months after start" },
      { amount: 500, due: "4 months after start" },
    ],
    total: 2724,
    description: "Gold Service - Instalments",
  },
}

function getPricingKey(serviceOption: string, paymentOption: string): keyof typeof pricing | null {
  if (serviceOption === "standard" && paymentOption === "full") return "standardFull"
  if (serviceOption === "standard" && paymentOption === "instalments") return "standardInstalments"
  if (serviceOption === "gold" && paymentOption === "full") return "goldFull"
  if (serviceOption === "gold" && paymentOption === "instalments") return "goldInstalments"
  return null
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(amount)
}

function generateBookingId(): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 8)
  return `cb-${timestamp}-${random}`
}

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0]
}

function formatDateDisplay(dateStr: string): string {
  if (!dateStr) return "Not specified"
  const date = new Date(dateStr)
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
}

async function generateBookingPDF(data: CourseBookingData, bookingId: string, submittedAt: string): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create()
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica)

  const page = pdfDoc.addPage([595, 842]) // A4 size
  const { width } = page.getSize()

  let y = 800

  // Header
  page.drawText("EWA Tracker Ltd", {
    x: 50,
    y,
    size: 18,
    font: helveticaBold,
    color: rgb(0.12, 0.23, 0.37),
  })

  y -= 18
  page.drawText("EAL Approved Centre | Course Booking Form", {
    x: 50,
    y,
    size: 10,
    font: helvetica,
    color: rgb(0.4, 0.4, 0.4),
  })

  y -= 14
  page.drawText("info@ewatracker.co.uk | 07828 893976 | ewatracker.co.uk", {
    x: 50,
    y,
    size: 9,
    font: helvetica,
    color: rgb(0.5, 0.5, 0.5),
  })

  y -= 30

  // Title
  page.drawRectangle({
    x: 50,
    y: y - 25,
    width: width - 100,
    height: 35,
    color: rgb(0.12, 0.23, 0.37),
  })

  page.drawText("COURSE BOOKING FORM", {
    x: 60,
    y: y - 17,
    size: 14,
    font: helveticaBold,
    color: rgb(1, 1, 1),
  })

  y -= 50

  // Booking reference and date
  page.drawText(`Booking Reference: ${bookingId}`, {
    x: 50,
    y,
    size: 10,
    font: helveticaBold,
    color: rgb(0.2, 0.2, 0.2),
  })

  page.drawText(`Submitted: ${new Date(submittedAt).toLocaleString("en-GB")}`, {
    x: 350,
    y,
    size: 10,
    font: helvetica,
    color: rgb(0.4, 0.4, 0.4),
  })

  y -= 35

  // Helper function to draw section header with better styling
  const drawSectionHeader = (title: string) => {
    page.drawRectangle({
      x: 50,
      y: y - 4,
      width: width - 100,
      height: 18,
      color: rgb(0.95, 0.97, 1),
    })
    page.drawText(title, {
      x: 55,
      y,
      size: 10,
      font: helveticaBold,
      color: rgb(0.12, 0.23, 0.37),
    })
    y -= 6
    page.drawLine({
      start: { x: 50, y },
      end: { x: width - 50, y },
      thickness: 1.5,
      color: rgb(0.12, 0.23, 0.37),
    })
    y -= 18
  }

  // Helper function to draw field
  const drawField = (label: string, value: string, xOffset = 50, labelWidth = 110) => {
    page.drawText(`${label}:`, {
      x: xOffset,
      y,
      size: 9,
      font: helveticaBold,
      color: rgb(0.35, 0.35, 0.35),
    })
    page.drawText(value || "Not provided", {
      x: xOffset + labelWidth,
      y,
      size: 9,
      font: helvetica,
      color: rgb(0.1, 0.1, 0.1),
    })
  }

  // Helper function to wrap and draw multi-line address text
  const drawMultiLineText = (label: string, text: string, xOffset = 50, labelWidth = 110, maxCharsPerLine = 55) => {
    page.drawText(`${label}:`, {
      x: xOffset,
      y,
      size: 9,
      font: helveticaBold,
      color: rgb(0.35, 0.35, 0.35),
    })

    if (!text || text.trim() === "") {
      page.drawText("Not provided", {
        x: xOffset + labelWidth,
        y,
        size: 9,
        font: helvetica,
        color: rgb(0.1, 0.1, 0.1),
      })
      return
    }

    const words = text.split(/\s+/)
    let line = ""
    let isFirstLine = true

    for (const word of words) {
      if ((line + word).length > maxCharsPerLine) {
        page.drawText(line.trim(), {
          x: xOffset + (isFirstLine ? labelWidth : labelWidth),
          y,
          size: 9,
          font: helvetica,
          color: rgb(0.1, 0.1, 0.1),
        })
        y -= 13
        line = word + " "
        isFirstLine = false
      } else {
        line += word + " "
      }
    }
    if (line.trim()) {
      page.drawText(line.trim(), {
        x: xOffset + (isFirstLine ? labelWidth : labelWidth),
        y,
        size: 9,
        font: helvetica,
        color: rgb(0.1, 0.1, 0.1),
      })
    }
  }

  // Section A - Candidate Details
  drawSectionHeader("SECTION A — CANDIDATE DETAILS")

  drawField("Full Name", data.fullName)
  y -= 16
  drawField("Date of Birth", formatDateDisplay(data.dateOfBirth))
  y -= 16
  drawField("Contact Number", data.contactNumber)
  y -= 16
  drawField("Email", data.email)
  y -= 16
  drawMultiLineText("Home Address", data.homeAddress)
  y -= 16
  if (data.ethnicity) {
    drawField("Ethnicity", data.ethnicity)
    y -= 16
  }

  y -= 20

  // Section B - Employer Details
  drawSectionHeader("SECTION B — EMPLOYER DETAILS")

  if (data.employerName || data.companyContactName || data.employerEmail || data.employerTelephone || data.employerMobile) {
    if (data.employerName) {
      drawField("Employer Name", data.employerName)
      y -= 16
    }
    if (data.companyContactName) {
      drawField("Contact Name", data.companyContactName)
      y -= 16
    }
    if (data.employerAddress) {
      drawMultiLineText("Address", data.employerAddress)
      y -= 16
    }
    // Show telephone and/or mobile if provided
    if (data.employerTelephone && data.employerMobile) {
      drawField("Telephone", data.employerTelephone)
      y -= 16
      drawField("Mobile", data.employerMobile)
      y -= 16
    } else if (data.employerTelephone) {
      drawField("Telephone", data.employerTelephone)
      y -= 16
    } else if (data.employerMobile) {
      drawField("Mobile", data.employerMobile)
      y -= 16
    }
    if (data.employerEmail) {
      drawField("Email", data.employerEmail)
      y -= 16
    }
  } else {
    page.drawText("No employer details provided", {
      x: 50,
      y,
      size: 9,
      font: helvetica,
      color: rgb(0.5, 0.5, 0.5),
    })
    y -= 16
  }

  y -= 20

  // Section C - Course/Booking Details
  drawSectionHeader("SECTION C — COURSE / BOOKING DETAILS")

  drawField("Qualification", data.qualification)
  y -= 16
  drawField("Route", data.route)
  y -= 16
  drawField("Service Option", data.serviceOption === "gold" ? "Gold Service" : "Standard Programme")
  y -= 16
  drawField("Payment Option", data.paymentOption === "full" ? "Full Payment" : "Instalments")
  y -= 16
  drawField("Preferred Start", formatDateDisplay(data.preferredStartDate))
  y -= 20

  // Pricing Summary Box
  const pricingKey = getPricingKey(data.serviceOption, data.paymentOption)
  if (pricingKey) {
    const selectedPricing = pricing[pricingKey]
    
    page.drawRectangle({
      x: 50,
      y: y - 85,
      width: width - 100,
      height: 95,
      color: rgb(0.97, 0.98, 1),
      borderColor: rgb(0.12, 0.23, 0.37),
      borderWidth: 1,
    })

    page.drawText("PRICING SUMMARY", {
      x: 60,
      y: y - 16,
      size: 10,
      font: helveticaBold,
      color: rgb(0.12, 0.23, 0.37),
    })

    y -= 32

    if ("discount" in selectedPricing) {
      // Full payment pricing
      page.drawText(`Programme Fee: ${formatCurrency(selectedPricing.programmeFee)}`, {
        x: 60,
        y,
        size: 9,
        font: helvetica,
        color: rgb(0.3, 0.3, 0.3),
      })
      y -= 13
      page.drawText(`EAL Registration: ${formatCurrency(selectedPricing.registrationFee)}`, {
        x: 60,
        y,
        size: 9,
        font: helvetica,
        color: rgb(0.3, 0.3, 0.3),
      })
      y -= 13
      page.drawText(`Discount: -${formatCurrency(selectedPricing.discount)}`, {
        x: 60,
        y,
        size: 9,
        font: helvetica,
        color: rgb(0.02, 0.59, 0.41),
      })
      y -= 15
      page.drawText(`Total Due: ${formatCurrency(selectedPricing.total)}`, {
        x: 60,
        y,
        size: 11,
        font: helveticaBold,
        color: rgb(0.12, 0.23, 0.37),
      })
      y -= 22
    } else {
      // Instalments pricing
      page.drawText(`Initial Payment (due now): ${formatCurrency(selectedPricing.initialPayment)}`, {
        x: 60,
        y,
        size: 9,
        font: helveticaBold,
        color: rgb(0.3, 0.3, 0.3),
      })
      y -= 13
      const remainingText = selectedPricing.remainingPayments.map((p, i) => `Payment ${i + 2}: ${formatCurrency(p.amount)}`).join(" | ")
      page.drawText(`Remaining: ${remainingText}`, {
        x: 60,
        y,
        size: 8,
        font: helvetica,
        color: rgb(0.4, 0.4, 0.4),
      })
      y -= 15
      page.drawText(`Total Programme Cost: ${formatCurrency(selectedPricing.total)}`, {
        x: 60,
        y,
        size: 11,
        font: helveticaBold,
        color: rgb(0.12, 0.23, 0.37),
      })
      y -= 22
    }
  }

  y -= 10

  // Notes / Experience section with bordered box
  if (data.notes) {
    page.drawText("Notes / Experience:", {
      x: 50,
      y,
      size: 9,
      font: helveticaBold,
      color: rgb(0.35, 0.35, 0.35),
    })
    y -= 12

    // Calculate box height based on text length
    const maxCharsPerLine = 85
    const words = data.notes.split(/\s+/)
    let lineCount = 1
    let currentLineLength = 0
    for (const word of words) {
      if (currentLineLength + word.length + 1 > maxCharsPerLine) {
        lineCount++
        currentLineLength = word.length + 1
      } else {
        currentLineLength += word.length + 1
      }
    }
    const boxHeight = Math.max(40, lineCount * 13 + 16)

    // Draw bordered content box
    page.drawRectangle({
      x: 50,
      y: y - boxHeight + 8,
      width: width - 100,
      height: boxHeight,
      color: rgb(0.98, 0.98, 0.98),
      borderColor: rgb(0.85, 0.85, 0.85),
      borderWidth: 1,
    })

    // Draw wrapped text inside box
    let textY = y - 4
    let line = ""
    for (const word of words) {
      if ((line + word).length > maxCharsPerLine) {
        page.drawText(line.trim(), {
          x: 58,
          y: textY,
          size: 9,
          font: helvetica,
          color: rgb(0.15, 0.15, 0.15),
        })
        textY -= 13
        line = word + " "
      } else {
        line += word + " "
      }
    }
    if (line.trim()) {
      page.drawText(line.trim(), {
        x: 58,
        y: textY,
        size: 9,
        font: helvetica,
        color: rgb(0.15, 0.15, 0.15),
      })
    }

    y -= boxHeight + 8
  }

  y -= 22

  // Section D & E - Declaration and Signature
  drawSectionHeader("DECLARATION & SIGNATURE")

  page.drawText("The candidate confirms:", {
    x: 50,
    y,
    size: 9,
    font: helveticaBold,
    color: rgb(0.35, 0.35, 0.35),
  })

  y -= 15
  page.drawText("• The information provided is accurate and complete", {
    x: 50,
    y,
    size: 9,
    font: helvetica,
    color: rgb(0.2, 0.2, 0.2),
  })

  y -= 13
  page.drawText("• 18th Edition, I&T/Initial Verification, AM2E are required for Gold Card progression", {
    x: 50,
    y,
    size: 9,
    font: helvetica,
    color: rgb(0.2, 0.2, 0.2),
  })

  y -= 13
  page.drawText("• This form is not automatic acceptance onto the programme", {
    x: 50,
    y,
    size: 9,
    font: helvetica,
    color: rgb(0.2, 0.2, 0.2),
  })

  y -= 22

  // Signature box
  page.drawRectangle({
    x: 50,
    y: y - 48,
    width: width - 100,
    height: 58,
    color: rgb(0.97, 0.97, 0.97),
    borderColor: rgb(0.75, 0.75, 0.75),
    borderWidth: 1,
  })

  page.drawText("Digital Signature:", {
    x: 60,
    y: y - 16,
    size: 9,
    font: helveticaBold,
    color: rgb(0.35, 0.35, 0.35),
  })

  page.drawText(data.digitalSignature, {
    x: 60,
    y: y - 34,
    size: 14,
    font: helveticaBold,
    color: rgb(0.12, 0.23, 0.37),
  })

  page.drawText(`Signed: ${new Date(submittedAt).toLocaleString("en-GB")}`, {
    x: 350,
    y: y - 34,
    size: 9,
    font: helvetica,
    color: rgb(0.5, 0.5, 0.5),
  })

  // Footer
  page.drawLine({
    start: { x: 50, y: 50 },
    end: { x: width - 50, y: 50 },
    thickness: 0.5,
    color: rgb(0.8, 0.8, 0.8),
  })

  page.drawText("EWA Tracker Ltd | EAL Approved Centre | ewatracker.co.uk", {
    x: 50,
    y: 35,
    size: 8,
    font: helvetica,
    color: rgb(0.6, 0.6, 0.6),
  })

  page.drawText("This document was generated electronically and requires no physical signature.", {
    x: 50,
    y: 22,
    size: 7,
    font: helvetica,
    color: rgb(0.6, 0.6, 0.6),
  })

  return pdfDoc.save()
}

async function generateInvoicePDF(invoice: Invoice): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create()
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica)

  const page = pdfDoc.addPage([595, 842]) // A4 size
  const { width } = page.getSize()

  let y = 800

  // Header
  page.drawText("EWA Tracker Ltd", {
    x: 50,
    y,
    size: 22,
    font: helveticaBold,
    color: rgb(0.12, 0.23, 0.37),
  })

  y -= 20
  page.drawText("EAL Approved Centre", {
    x: 50,
    y,
    size: 10,
    font: helvetica,
    color: rgb(0.4, 0.4, 0.4),
  })

  y -= 14
  page.drawText("info@ewatracker.co.uk | 07828 893976 | ewatracker.co.uk", {
    x: 50,
    y,
    size: 9,
    font: helvetica,
    color: rgb(0.5, 0.5, 0.5),
  })

  // INVOICE badge on right
  page.drawRectangle({
    x: width - 150,
    y: y + 20,
    width: 100,
    height: 30,
    color: rgb(0.12, 0.23, 0.37),
  })

  page.drawText("INVOICE", {
    x: width - 135,
    y: y + 30,
    size: 14,
    font: helveticaBold,
    color: rgb(1, 1, 1),
  })

  y -= 40

  // Invoice details box
  page.drawRectangle({
    x: 50,
    y: y - 65,
    width: width - 100,
    height: 75,
    color: rgb(0.97, 0.98, 1),
    borderColor: rgb(0.85, 0.88, 0.92),
    borderWidth: 1,
  })

  page.drawText(`Invoice Number: ${invoice.invoiceNumber}`, {
    x: 60,
    y: y - 18,
    size: 10,
    font: helveticaBold,
    color: rgb(0.2, 0.2, 0.2),
  })

  page.drawText(`Invoice Date: ${formatInvoiceDate(invoice.invoiceDate)}`, {
    x: 60,
    y: y - 35,
    size: 10,
    font: helvetica,
    color: rgb(0.3, 0.3, 0.3),
  })

  page.drawText(`Due Date: ${formatInvoiceDate(invoice.dueDate)}`, {
    x: 60,
    y: y - 52,
    size: 10,
    font: helvetica,
    color: rgb(0.3, 0.3, 0.3),
  })

  page.drawText(`Payment Reference: ${invoice.paymentReference}`, {
    x: 300,
    y: y - 18,
    size: 10,
    font: helveticaBold,
    color: rgb(0.12, 0.23, 0.37),
  })

  page.drawText(`Booking ID: ${invoice.bookingId}`, {
    x: 300,
    y: y - 35,
    size: 9,
    font: helvetica,
    color: rgb(0.4, 0.4, 0.4),
  })

  y -= 90

  // Bill To section
  page.drawText("BILL TO:", {
    x: 50,
    y,
    size: 10,
    font: helveticaBold,
    color: rgb(0.12, 0.23, 0.37),
  })

  y -= 16
  page.drawText(invoice.candidateName, {
    x: 50,
    y,
    size: 10,
    font: helveticaBold,
    color: rgb(0.2, 0.2, 0.2),
  })

  y -= 14
  page.drawText(invoice.candidateEmail, {
    x: 50,
    y,
    size: 9,
    font: helvetica,
    color: rgb(0.3, 0.3, 0.3),
  })

  y -= 12
  page.drawText(invoice.candidatePhone, {
    x: 50,
    y,
    size: 9,
    font: helvetica,
    color: rgb(0.3, 0.3, 0.3),
  })

  // Address (wrap if needed)
  if (invoice.candidateAddress) {
    const addressLines = invoice.candidateAddress.match(/.{1,50}/g) || []
    for (const line of addressLines.slice(0, 2)) {
      y -= 12
      page.drawText(line, {
        x: 50,
        y,
        size: 9,
        font: helvetica,
        color: rgb(0.3, 0.3, 0.3),
      })
    }
  }

  y -= 30

  // Line items table header
  page.drawRectangle({
    x: 50,
    y: y - 20,
    width: width - 100,
    height: 25,
    color: rgb(0.12, 0.23, 0.37),
  })

  page.drawText("Description", {
    x: 60,
    y: y - 13,
    size: 10,
    font: helveticaBold,
    color: rgb(1, 1, 1),
  })

  page.drawText("Amount", {
    x: width - 120,
    y: y - 13,
    size: 10,
    font: helveticaBold,
    color: rgb(1, 1, 1),
  })

  y -= 28

  // Line items
  for (const item of invoice.lineItems) {
    page.drawText(item.description, {
      x: 60,
      y,
      size: 10,
      font: helvetica,
      color: rgb(0.2, 0.2, 0.2),
    })

    page.drawText(formatPriceCurrency(item.amount), {
      x: width - 120,
      y,
      size: 10,
      font: helvetica,
      color: rgb(0.2, 0.2, 0.2),
    })

    y -= 20

    // Line separator
    page.drawLine({
      start: { x: 50, y: y + 8 },
      end: { x: width - 50, y: y + 8 },
      thickness: 0.5,
      color: rgb(0.9, 0.9, 0.9),
    })
  }

  y -= 10

  // Subtotal, discount, total
  if (invoice.discount > 0) {
    page.drawText("Subtotal:", {
      x: width - 200,
      y,
      size: 10,
      font: helvetica,
      color: rgb(0.3, 0.3, 0.3),
    })
    page.drawText(formatPriceCurrency(invoice.subtotal), {
      x: width - 120,
      y,
      size: 10,
      font: helvetica,
      color: rgb(0.3, 0.3, 0.3),
    })
    y -= 18

    page.drawText("Discount:", {
      x: width - 200,
      y,
      size: 10,
      font: helvetica,
      color: rgb(0.02, 0.59, 0.41),
    })
    page.drawText(`-${formatPriceCurrency(invoice.discount)}`, {
      x: width - 120,
      y,
      size: 10,
      font: helvetica,
      color: rgb(0.02, 0.59, 0.41),
    })
    y -= 18
  }

  // Amount due box
  page.drawRectangle({
    x: width - 220,
    y: y - 25,
    width: 170,
    height: 35,
    color: rgb(0.12, 0.23, 0.37),
  })

  page.drawText("AMOUNT DUE:", {
    x: width - 210,
    y: y - 12,
    size: 10,
    font: helveticaBold,
    color: rgb(1, 1, 1),
  })

  page.drawText(formatPriceCurrency(invoice.amountDue), {
    x: width - 120,
    y: y - 12,
    size: 14,
    font: helveticaBold,
    color: rgb(1, 1, 1),
  })

  y -= 50

  // Instalment info if applicable
  if (invoice.paymentOption === "instalments" && invoice.remainingBalance && invoice.remainingBalance > 0) {
    page.drawText(`Payment ${invoice.paymentNumber} of ${invoice.totalPayments}`, {
      x: 50,
      y,
      size: 10,
      font: helveticaBold,
      color: rgb(0.4, 0.4, 0.4),
    })
    y -= 14
    page.drawText(`Remaining balance after this payment: ${formatPriceCurrency(invoice.remainingBalance)}`, {
      x: 50,
      y,
      size: 9,
      font: helvetica,
      color: rgb(0.4, 0.4, 0.4),
    })
    y -= 14
    page.drawText(`Total programme cost: ${formatPriceCurrency(invoice.total)}`, {
      x: 50,
      y,
      size: 9,
      font: helvetica,
      color: rgb(0.4, 0.4, 0.4),
    })
    y -= 30
  }

  // Bank details section
  page.drawRectangle({
    x: 50,
    y: y - 85,
    width: width - 100,
    height: 95,
    color: rgb(0.97, 0.98, 0.97),
    borderColor: rgb(0.85, 0.88, 0.85),
    borderWidth: 1,
  })

  page.drawText("PAYMENT DETAILS", {
    x: 60,
    y: y - 18,
    size: 11,
    font: helveticaBold,
    color: rgb(0.12, 0.23, 0.37),
  })

  page.drawText("Please make payment by bank transfer using the details below:", {
    x: 60,
    y: y - 35,
    size: 9,
    font: helvetica,
    color: rgb(0.3, 0.3, 0.3),
  })

  page.drawText(`Account Name: ${bankDetails.accountName}`, {
    x: 60,
    y: y - 52,
    size: 10,
    font: helvetica,
    color: rgb(0.2, 0.2, 0.2),
  })

  page.drawText(`Sort Code: ${bankDetails.sortCode}`, {
    x: 60,
    y: y - 66,
    size: 10,
    font: helvetica,
    color: rgb(0.2, 0.2, 0.2),
  })

  page.drawText(`Account Number: ${bankDetails.accountNumber}`, {
    x: 250,
    y: y - 66,
    size: 10,
    font: helvetica,
    color: rgb(0.2, 0.2, 0.2),
  })

  page.drawText(`Reference: ${invoice.paymentReference}`, {
    x: 60,
    y: y - 80,
    size: 10,
    font: helveticaBold,
    color: rgb(0.12, 0.23, 0.37),
  })

  // Footer
  page.drawLine({
    start: { x: 50, y: 55 },
    end: { x: width - 50, y: 55 },
    thickness: 0.5,
    color: rgb(0.8, 0.8, 0.8),
  })

  page.drawText("EWA Tracker Ltd | EAL Approved Centre | Company Registration: 15083099", {
    x: 50,
    y: 40,
    size: 8,
    font: helvetica,
    color: rgb(0.6, 0.6, 0.6),
  })

  page.drawText("Thank you for choosing EWA Tracker Ltd for your qualification journey.", {
    x: 50,
    y: 28,
    size: 8,
    font: helvetica,
    color: rgb(0.6, 0.6, 0.6),
  })

  return pdfDoc.save()
}

export async function POST(request: Request) {
  try {
    const body: CourseBookingData = await request.json()

    // Validate required fields
    if (!body.fullName?.trim()) {
      return NextResponse.json({ error: "Full name is required" }, { status: 400 })
    }
    if (!body.dateOfBirth) {
      return NextResponse.json({ error: "Date of birth is required" }, { status: 400 })
    }
    if (!body.homeAddress?.trim()) {
      return NextResponse.json({ error: "Home address is required" }, { status: 400 })
    }
    if (!body.email?.trim()) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }
    if (!body.contactNumber?.trim()) {
      return NextResponse.json({ error: "Contact number is required" }, { status: 400 })
    }
    if (!body.declarationAccepted) {
      return NextResponse.json({ error: "Declaration must be accepted" }, { status: 400 })
    }
    if (!body.digitalSignature?.trim()) {
      return NextResponse.json({ error: "Digital signature is required" }, { status: 400 })
    }

    const bookingId = generateBookingId()
    const submittedAt = new Date().toISOString()
    const dateStr = formatDate(new Date())

    // Create booking data with metadata
    const bookingData = {
      id: bookingId,
      ...body,
      submittedAt,
    }

    // Encrypt and store in Blob
    const encryptedData = encryptJSON(bookingData)

    await put(
      `course-bookings/${bookingId}/booking.enc`,
      encryptedData,
      { access: "public", contentType: "text/plain" }
    )

    // Calculate pricing for metadata
    const pricingKey = getPricingKey(body.serviceOption, body.paymentOption)
    const selectedPricing = pricingKey ? pricing[pricingKey] : null
    const invoiceAmount = selectedPricing 
      ? ("initialPayment" in selectedPricing ? selectedPricing.initialPayment : selectedPricing.total)
      : 0
    const totalAmount = selectedPricing?.total || 0

    // Store metadata file for admin listing
    const metadata = {
      id: bookingId,
      candidateName: body.fullName,
      email: body.email,
      phone: body.contactNumber,
      qualification: body.qualification,
      route: body.route,
      serviceOption: body.serviceOption,
      paymentOption: body.paymentOption,
      preferredStartDate: body.preferredStartDate,
      invoiceAmount,
      totalAmount,
      status: "pending" as const,
      submittedAt,
    }

    const encryptedMetadata = encryptJSON(metadata)

    await put(
      `course-bookings/${bookingId}/metadata.enc`,
      encryptedMetadata,
      { access: "public", contentType: "text/plain" }
    )

    // Store JSON file for SharePoint
    const jsonContent = JSON.stringify(bookingData, null, 2)

    // Upload to SharePoint if configured
    let sharePointPdfUrl: string | undefined
    let sharePointJsonUrl: string | undefined

    // Generate safe filename from candidate name
    const safeName = body.fullName.replace(/[^a-zA-Z0-9]/g, "-").substring(0, 30)

    if (isSharePointConfigured()) {
      try {
        // Generate PDF
        const pdfBytes = await generateBookingPDF(body, bookingId, submittedAt)

        // Create folder structure: Course-Booking-Forms/YYYY-MM
        const folderPath = `Course-Booking-Forms/${dateStr.substring(0, 7)}`
        await createFolder(folderPath)

        // Generate filenames
        const pdfFileName = `Course-Booking-Form-${safeName}-${dateStr}.pdf`
        const jsonFileName = `Course-Booking-Form-${safeName}-${dateStr}.json`

        // Upload PDF to SharePoint
        const pdfResult = await uploadToSharePoint(
          folderPath,
          pdfFileName,
          Buffer.from(pdfBytes),
          "application/pdf"
        )

        if (pdfResult.success) {
          sharePointPdfUrl = pdfResult.url
          console.log("Successfully uploaded course booking PDF to SharePoint:", sharePointPdfUrl)
        } else {
          console.error("SharePoint PDF upload failed:", pdfResult.error)
        }

        // Upload JSON to SharePoint
        const jsonResult = await uploadToSharePoint(
          folderPath,
          jsonFileName,
          Buffer.from(jsonContent),
          "application/json"
        )

        if (jsonResult.success) {
          sharePointJsonUrl = jsonResult.url
          console.log("Successfully uploaded course booking JSON to SharePoint:", sharePointJsonUrl)
        } else {
          console.error("SharePoint JSON upload failed:", jsonResult.error)
        }
      } catch (error) {
        console.error("SharePoint upload error:", error)
        // Don't fail the submission if SharePoint upload fails
      }
    } else {
      console.log("SharePoint not configured, skipping upload")
    }

    // Generate and upload invoice automatically
    let invoiceId: string | undefined
    let invoiceNumber: string | undefined
    let sharePointInvoiceUrl: string | undefined

    try {
      // Get pricing details
      const pricingDetails = getPricing(body.serviceOption, body.paymentOption)
      
      if (pricingDetails) {
        // Create invoice
        const invoice = createInvoiceFromBooking(
          bookingId,
          body.fullName,
          body.email,
          body.contactNumber,
          body.homeAddress,
          body.qualification,
          body.serviceOption,
          body.paymentOption,
          pricingDetails,
          1 // First payment
        )

        invoiceId = invoice.id
        invoiceNumber = invoice.invoiceNumber

        // Generate invoice PDF
        const invoicePdfBytes = await generateInvoicePDF(invoice)

        // Store invoice in Blob
        const encryptedInvoice = encryptJSON(invoice)
        await put(
          `invoices/${invoice.id}/invoice.enc`,
          encryptedInvoice,
          { access: "public", contentType: "text/plain" }
        )

        // Upload invoice to SharePoint if configured
        if (isSharePointConfigured()) {
          try {
            // Create Invoices folder structure: Invoices/YYYY-MM
            const invoiceFolderPath = `Invoices/${dateStr.substring(0, 7)}`
            await createFolder(invoiceFolderPath)

            const invoiceFileName = `Invoice-${invoice.invoiceNumber}-${safeName}.pdf`

            const invoiceResult = await uploadToSharePoint(
              invoiceFolderPath,
              invoiceFileName,
              Buffer.from(invoicePdfBytes),
              "application/pdf"
            )

            if (invoiceResult.success) {
              sharePointInvoiceUrl = invoiceResult.url
              console.log("Successfully uploaded invoice to SharePoint:", sharePointInvoiceUrl)
            } else {
              console.error("SharePoint invoice upload failed:", invoiceResult.error)
            }
          } catch (invoiceError) {
            console.error("Invoice SharePoint upload error:", invoiceError)
          }
        }

        console.log(`Invoice ${invoiceNumber} generated for booking ${bookingId}`)
      }
    } catch (invoiceError) {
      console.error("Invoice generation error:", invoiceError)
      // Don't fail the submission if invoice generation fails
    }

    return NextResponse.json({
      ok: true,
      bookingId,
      invoiceId,
      invoiceNumber,
      sharePointPdfUrl,
      sharePointJsonUrl,
      sharePointInvoiceUrl,
      message: "Booking form submitted successfully",
    })
  } catch (error) {
    console.error("Course booking submission error:", error)
    return NextResponse.json(
      { ok: false, error: "Unable to submit booking form" },
      { status: 500 }
    )
  }
}
