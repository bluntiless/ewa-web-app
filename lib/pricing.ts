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
}

export type PricingDetails = FullPaymentPricing | InstalmentPricing

export const pricing: Record<string, PricingDetails> = {
  standardFull: {
    type: "full",
    programmeFee: 2000,
    registrationFee: 224,
    discount: 112,
    total: 2112,
    description: "Standard Programme - Full Payment",
  },
  standardInstalments: {
    type: "instalments",
    initialPayment: 724,
    remainingPayments: [
      { amount: 500, due: "1 month after start", dueMonths: 1 },
      { amount: 500, due: "2 months after start", dueMonths: 2 },
      { amount: 500, due: "3 months after start", dueMonths: 3 },
    ],
    total: 2224,
    description: "Standard Programme - Instalments",
  },
  goldFull: {
    type: "full",
    programmeFee: 2500,
    registrationFee: 224,
    discount: 168,
    total: 2556,
    description: "Gold Service - Full Payment",
  },
  goldInstalments: {
    type: "instalments",
    initialPayment: 724,
    remainingPayments: [
      { amount: 500, due: "1 month after start", dueMonths: 1 },
      { amount: 500, due: "2 months after start", dueMonths: 2 },
      { amount: 500, due: "3 months after start", dueMonths: 3 },
      { amount: 500, due: "4 months after start", dueMonths: 4 },
    ],
    total: 2724,
    description: "Gold Service - Instalments",
  },
}

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
