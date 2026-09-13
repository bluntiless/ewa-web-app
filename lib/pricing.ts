// EWA Tracker Ltd - Pricing Configuration

export type ServiceOption = "standard" | "gold"
export type PaymentOption = "full" | "instalments"

export interface FullPaymentPricing {
  type: "full"
  programmeFee: number
  registrationFee: number
  discount: number
  total: number
  description: string
  // Present only while a promotion is active — used for strikethrough display.
  originalTotal?: number
  savings?: number
}

export interface InstalmentPayment {
  amount: number
  due: string
  dueMonths: number
}

export interface InstalmentPricing {
  type: "instalments"
  initialPayment: number
  remainingPayments: InstalmentPayment[]
  total: number
  description: string
  // Present only while a promotion is active — used for strikethrough display.
  originalTotal?: number
  savings?: number
}

export type PricingDetails = FullPaymentPricing | InstalmentPricing

// EAL registration fee (inc. VAT). Not discounted — it is a pass-through fee set
// by the awarding body.
export const REGISTRATION_FEE = 268.8

/**
 * Limited-time price reduction.
 *
 * To end the promotion: set `active` to false (or let `endDate` pass). Prices,
 * strikethroughs, the site banner, and the assistant all key off this config,
 * so nothing else needs editing.
 */
export const promotion = {
  active: true,
  // Short label used on badges/banner.
  label: "Limited-time offer",
  // Human-readable end date shown to visitors.
  endDateLabel: "31 October",
  // Machine end date. Promotion is active up to and including this instant
  // (end of 31 October 2026, UK time / BST).
  endDate: "2026-10-31T23:59:59+01:00",
  // Marketing copy for the banner.
  headline: "Autumn price reduction on EWA assessment",
}

export function isPromotionActive(now: Date = new Date()): boolean {
  if (!promotion.active) return false
  return now.getTime() <= new Date(promotion.endDate).getTime()
}

// ---------------------------------------------------------------------------
// Regular (standard) pricing
// ---------------------------------------------------------------------------

const regularPricing: Record<string, PricingDetails> = {
  standardFull: {
    type: "full",
    programmeFee: 2000,
    registrationFee: REGISTRATION_FEE,
    discount: 0,
    total: 2268.8,
    description: "Standard Programme - Full Payment",
  },
  standardInstalments: {
    type: "instalments",
    initialPayment: 768.8,
    remainingPayments: [
      { amount: 500, due: "1 month after start", dueMonths: 1 },
      { amount: 500, due: "2 months after start", dueMonths: 2 },
      { amount: 500, due: "3 months after start", dueMonths: 3 },
    ],
    total: 2268.8,
    description: "Standard Programme - Instalments",
  },
  goldFull: {
    type: "full",
    programmeFee: 2500,
    registrationFee: REGISTRATION_FEE,
    discount: 0,
    total: 2768.8,
    description: "Gold Service - Full Payment",
  },
  goldInstalments: {
    type: "instalments",
    initialPayment: 768.8,
    remainingPayments: [
      { amount: 500, due: "1 month after start", dueMonths: 1 },
      { amount: 500, due: "2 months after start", dueMonths: 2 },
      { amount: 500, due: "3 months after start", dueMonths: 3 },
      { amount: 500, due: "4 months after start", dueMonths: 4 },
    ],
    total: 2768.8,
    description: "Gold Service - Instalments",
  },
}

// ---------------------------------------------------------------------------
// Promotional pricing — all-inclusive totals of £1,995 (Standard) and
// £2,395 (Gold). The EAL registration fee is unchanged; the reduction comes
// off the programme fee. For full payment we keep the original programme fee
// and express the reduction as a discount line so the maths reads clearly
// (fee + registration − discount = promo total). For instalments both plans
// share the same £495 initial payment (which covers the £268.80 EAL
// registration), with the balance spread evenly across the monthly payments.
// ---------------------------------------------------------------------------

const promoPricing: Record<string, PricingDetails> = {
  standardFull: {
    type: "full",
    programmeFee: 2000,
    registrationFee: REGISTRATION_FEE,
    discount: 273.8,
    total: 1995,
    originalTotal: 2268.8,
    savings: 273.8,
    description: "Standard Programme - Full Payment (Limited-time offer)",
  },
  standardInstalments: {
    type: "instalments",
    initialPayment: 495,
    remainingPayments: [
      { amount: 500, due: "1 month after start", dueMonths: 1 },
      { amount: 500, due: "2 months after start", dueMonths: 2 },
      { amount: 500, due: "3 months after start", dueMonths: 3 },
    ],
    total: 1995,
    originalTotal: 2268.8,
    savings: 273.8,
    description: "Standard Programme - Instalments (Limited-time offer)",
  },
  goldFull: {
    type: "full",
    programmeFee: 2500,
    registrationFee: REGISTRATION_FEE,
    discount: 373.8,
    total: 2395,
    originalTotal: 2768.8,
    savings: 373.8,
    description: "Gold Service - Full Payment (Limited-time offer)",
  },
  goldInstalments: {
    type: "instalments",
    initialPayment: 495,
    remainingPayments: [
      { amount: 475, due: "1 month after start", dueMonths: 1 },
      { amount: 475, due: "2 months after start", dueMonths: 2 },
      { amount: 475, due: "3 months after start", dueMonths: 3 },
      { amount: 475, due: "4 months after start", dueMonths: 4 },
    ],
    total: 2395,
    originalTotal: 2768.8,
    savings: 373.8,
    description: "Gold Service - Instalments (Limited-time offer)",
  },
}

// The effective pricing table. Reflects the promotion while it is active and
// automatically reverts to the regular table once it ends.
export const pricing: Record<string, PricingDetails> = isPromotionActive() ? promoPricing : regularPricing

// The highest saving currently available (used for banner/headline copy).
export const maxSavings: number = Math.max(
  0,
  ...Object.values(pricing).map((p) => p.savings ?? 0),
)

export function getPricingKey(serviceOption: ServiceOption, paymentOption: PaymentOption): string | null {
  if (serviceOption === "standard" && paymentOption === "full") return "standardFull"
  if (serviceOption === "standard" && paymentOption === "instalments") return "standardInstalments"
  if (serviceOption === "gold" && paymentOption === "full") return "goldFull"
  if (serviceOption === "gold" && paymentOption === "instalments") return "goldInstalments"
  return null
}

export function getPricing(serviceOption: ServiceOption, paymentOption: PaymentOption): PricingDetails | null {
  const key = getPricingKey(serviceOption, paymentOption)
  return key ? pricing[key] : null
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(amount)
}

export function getInitialPaymentAmount(serviceOption: ServiceOption, paymentOption: PaymentOption): number {
  const pricingDetails = getPricing(serviceOption, paymentOption)
  if (!pricingDetails) return 0
  
  if (pricingDetails.type === "full") {
    return pricingDetails.total
  }
  return pricingDetails.initialPayment
}

export function calculateInstalmentDueDates(startDate: Date, payments: InstalmentPayment[]): Array<{ amount: number; dueDate: Date; description: string }> {
  return payments.map((payment) => {
    const dueDate = new Date(startDate)
    dueDate.setMonth(dueDate.getMonth() + payment.dueMonths)
    return {
      amount: payment.amount,
      dueDate,
      description: `Payment ${payment.dueMonths + 1}`,
    }
  })
}

// Bank details for invoices
export const bankDetails = {
  accountName: "EWA Tracker Ltd",
  sortCode: "30-54-66",
  accountNumber: "43345460",
}
