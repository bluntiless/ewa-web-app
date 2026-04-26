// Invoice types and utilities

import { ServiceOption, PaymentOption, PricingDetails, InstalmentPayment, formatCurrency, bankDetails } from "./pricing"

export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue" | "cancelled"

export interface InvoiceLineItem {
  description: string
  amount: number
}

export interface Invoice {
  id: string
  invoiceNumber: string
  bookingId: string
  
  // Candidate details
  candidateName: string
  candidateEmail: string
  candidatePhone: string
  candidateAddress: string
  
  // Service details
  qualification: string
  serviceOption: ServiceOption
  paymentOption: PaymentOption
  
  // Financial details
  lineItems: InvoiceLineItem[]
  subtotal: number
  discount: number
  total: number
  amountDue: number
  
  // For instalments
  isInitialPayment?: boolean
  paymentNumber?: number
  totalPayments?: number
  remainingBalance?: number
  
  // Dates
  invoiceDate: string
  dueDate: string
  paidDate?: string
  
  // Status
  status: InvoiceStatus
  
  // Payment reference
  paymentReference: string
  
  // Bank details
  bankDetails: typeof bankDetails
  
  // Metadata
  createdAt: string
  updatedAt: string
  sentAt?: string
  notes?: string
}

export function generateInvoiceNumber(): string {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `INV-${year}${month}-${random}`
}

export function generatePaymentReference(candidateName: string, invoiceNumber: string): string {
  const namePart = candidateName
    .split(" ")
    .map((n) => n.charAt(0).toUpperCase())
    .join("")
    .substring(0, 3)
  return `${namePart}-${invoiceNumber}`
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export function calculateDueDate(invoiceDate: Date, daysUntilDue: number = 14): Date {
  const dueDate = new Date(invoiceDate)
  dueDate.setDate(dueDate.getDate() + daysUntilDue)
  return dueDate
}

export function createInvoiceFromBooking(
  bookingId: string,
  candidateName: string,
  candidateEmail: string,
  candidatePhone: string,
  candidateAddress: string,
  qualification: string,
  serviceOption: ServiceOption,
  paymentOption: PaymentOption,
  pricingDetails: PricingDetails,
  paymentNumber: number = 1
): Invoice {
  const now = new Date()
  const invoiceNumber = generateInvoiceNumber()
  const paymentReference = generatePaymentReference(candidateName, invoiceNumber)
  
  const lineItems: InvoiceLineItem[] = []
  let subtotal = 0
  let discount = 0
  let amountDue = 0
  let isInitialPayment = false
  let totalPayments = 1
  let remainingBalance = 0

  if (pricingDetails.type === "full") {
    lineItems.push({
      description: `${serviceOption === "gold" ? "Gold Service" : "Standard"} Programme Fee`,
      amount: pricingDetails.programmeFee,
    })
    lineItems.push({
      description: "EAL Registration Fee",
      amount: pricingDetails.registrationFee,
    })
    subtotal = pricingDetails.programmeFee + pricingDetails.registrationFee
    discount = pricingDetails.discount
    amountDue = pricingDetails.total
  } else {
    // Instalments
    isInitialPayment = paymentNumber === 1
    totalPayments = pricingDetails.remainingPayments.length + 1

    if (paymentNumber === 1) {
      // Initial payment invoice
      lineItems.push({
        description: `${serviceOption === "gold" ? "Gold Service" : "Standard"} Programme - Initial Payment`,
        amount: pricingDetails.initialPayment,
      })
      subtotal = pricingDetails.initialPayment
      amountDue = pricingDetails.initialPayment
      remainingBalance = pricingDetails.total - pricingDetails.initialPayment
    } else {
      // Subsequent instalment
      const instalmentIndex = paymentNumber - 2
      const instalment = pricingDetails.remainingPayments[instalmentIndex]
      if (instalment) {
        lineItems.push({
          description: `${serviceOption === "gold" ? "Gold Service" : "Standard"} Programme - Payment ${paymentNumber} of ${totalPayments}`,
          amount: instalment.amount,
        })
        subtotal = instalment.amount
        amountDue = instalment.amount
        // Calculate remaining balance after this payment
        const paidSoFar = pricingDetails.initialPayment + 
          pricingDetails.remainingPayments.slice(0, instalmentIndex + 1).reduce((sum, p) => sum + p.amount, 0)
        remainingBalance = pricingDetails.total - paidSoFar
      }
    }
  }

  return {
    id: `inv-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
    invoiceNumber,
    bookingId,
    candidateName,
    candidateEmail,
    candidatePhone,
    candidateAddress,
    qualification,
    serviceOption,
    paymentOption,
    lineItems,
    subtotal,
    discount,
    total: pricingDetails.total,
    amountDue,
    isInitialPayment,
    paymentNumber,
    totalPayments,
    remainingBalance,
    invoiceDate: now.toISOString(),
    dueDate: calculateDueDate(now).toISOString(),
    status: "draft",
    paymentReference,
    bankDetails,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  }
}
