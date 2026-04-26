// Booking types shared between client and server

export type BookingStatus = 
  | "pending"
  | "invoice_generated"
  | "invoice_sent"
  | "paid"
  | "registered_eal"
  | "in_progress"
  | "completed"
  | "archived"

export interface BookingMetadata {
  id: string
  candidateName: string
  email: string
  phone?: string
  qualification: string
  route: string
  serviceOption?: "standard" | "gold"
  paymentOption?: "full" | "instalments"
  preferredStartDate?: string
  invoiceAmount?: number
  totalAmount?: number
  status: BookingStatus
  submittedAt: string
  invoiceIds?: string[]
  lastInvoiceDate?: string
  paidDate?: string
  ealRegistrationDate?: string
}

export interface BookingDetails extends BookingMetadata {
  fullName: string
  dateOfBirth?: string
  homeAddress?: string
  contactNumber?: string
  ethnicity?: string
  employerName?: string
  companyContactName?: string
  employerAddress?: string
  employerTelephone?: string
  employerMobile?: string
  employerEmail?: string
  notes?: string
  digitalSignature?: string
}
