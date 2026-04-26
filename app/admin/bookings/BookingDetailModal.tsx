"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  X,
  Loader2,
  Receipt,
  Mail,
  CheckCircle,
  GraduationCap,
  Crown,
  Download,
  AlertCircle,
  User,
  Building2,
  CreditCard,
} from "lucide-react"
import type { BookingStatus } from "@/lib/booking-types"

interface BookingData {
  id: string
  fullName: string
  email: string
  contactNumber: string
  dateOfBirth: string
  homeAddress: string
  ethnicity?: string
  employerName?: string
  companyContactName?: string
  employerAddress?: string
  employerTelephone?: string
  employerMobile?: string
  employerEmail?: string
  qualification: string
  route: string
  serviceOption: "standard" | "gold"
  paymentOption: "full" | "instalments"
  preferredStartDate?: string
  notes?: string
  digitalSignature: string
  submittedAt: string
}

interface BookingMetadata {
  id: string
  status: BookingStatus
  invoiceIds?: string[]
  invoiceAmount?: number
  totalAmount?: number
  lastInvoiceDate?: string
  paidDate?: string
  ealRegistrationDate?: string
}

interface Props {
  bookingId: string
  onClose: () => void
  onUpdate: () => void
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(amount)
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

const statusOptions: { value: BookingStatus; label: string }[] = [
  { value: "pending", label: "Pending Review" },
  { value: "invoice_generated", label: "Invoice Generated" },
  { value: "invoice_sent", label: "Invoice Sent" },
  { value: "paid", label: "Paid" },
  { value: "registered_eal", label: "EAL Registered" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
]

export default function BookingDetailModal({ bookingId, onClose, onUpdate }: Props) {
  const [booking, setBooking] = useState<BookingData | null>(null)
  const [metadata, setMetadata] = useState<BookingMetadata | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isGeneratingInvoice, setIsGeneratingInvoice] = useState(false)
  const [isSendingEmail, setIsSendingEmail] = useState(false)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)
  const [actionMessage, setActionMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  useEffect(() => {
    fetchBooking()
  }, [bookingId])

  const fetchBooking = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}`)
      if (!response.ok) throw new Error("Failed to fetch booking")

      const data = await response.json()
      setBooking(data.booking)
      setMetadata(data.metadata)
    } catch (err) {
      setError("Failed to load booking details")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerateInvoice = async () => {
    setIsGeneratingInvoice(true)
    setActionMessage(null)

    try {
      const response = await fetch("/api/admin/invoices/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId }),
      })

      const data = await response.json()

      if (!response.ok) throw new Error(data.error || "Failed to generate invoice")

      setActionMessage({
        type: "success",
        text: `Invoice ${data.invoice.invoiceNumber} generated successfully. Amount due: ${formatCurrency(data.invoice.amountDue)}`,
      })

      await fetchBooking()
      onUpdate()
    } catch (err) {
      setActionMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to generate invoice",
      })
    } finally {
      setIsGeneratingInvoice(false)
    }
  }

  const handleSendInvoice = async () => {
    setIsSendingEmail(true)
    setActionMessage(null)

    try {
      const response = await fetch("/api/admin/invoices/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId }),
      })

      const data = await response.json()

      if (!response.ok) throw new Error(data.error || "Failed to send invoice")

      setActionMessage({
        type: "success",
        text: `Invoice sent to ${booking?.email}`,
      })

      await fetchBooking()
      onUpdate()
    } catch (err) {
      setActionMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to send invoice",
      })
    } finally {
      setIsSendingEmail(false)
    }
  }

  const handleStatusUpdate = async (newStatus: BookingStatus) => {
    setIsUpdatingStatus(true)
    setActionMessage(null)

    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) throw new Error("Failed to update status")

      setActionMessage({
        type: "success",
        text: `Status updated to "${statusOptions.find((s) => s.value === newStatus)?.label}"`,
      })

      await fetchBooking()
      onUpdate()
    } catch (err) {
      setActionMessage({
        type: "error",
        text: "Failed to update status",
      })
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-gray-900">Booking Details</h2>
            {booking?.serviceOption === "gold" && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                <Crown className="w-3 h-3" />
                Gold Service
              </span>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : error ? (
            <div className="flex items-center gap-3 text-red-600 bg-red-50 p-4 rounded-lg">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          ) : booking ? (
            <div className="space-y-6">
              {/* Action Message */}
              {actionMessage && (
                <div
                  className={`flex items-center gap-3 p-4 rounded-lg ${
                    actionMessage.type === "success"
                      ? "bg-green-50 text-green-800"
                      : "bg-red-50 text-red-800"
                  }`}
                >
                  {actionMessage.type === "success" ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <AlertCircle className="w-5 h-5" />
                  )}
                  {actionMessage.text}
                </div>
              )}

              {/* Quick Actions */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Quick Actions</h3>
                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={handleGenerateInvoice}
                    disabled={isGeneratingInvoice}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isGeneratingInvoice ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Receipt className="w-4 h-4 mr-2" />
                    )}
                    Generate Invoice
                  </Button>

                  <Button
                    onClick={handleSendInvoice}
                    disabled={isSendingEmail || !metadata?.invoiceIds?.length}
                    variant="outline"
                  >
                    {isSendingEmail ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Mail className="w-4 h-4 mr-2" />
                    )}
                    Email Invoice
                  </Button>

                  <Button
                    onClick={() => handleStatusUpdate("paid")}
                    disabled={isUpdatingStatus || metadata?.status === "paid"}
                    variant="outline"
                    className="text-green-600 hover:text-green-700 hover:bg-green-50"
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Mark Paid
                  </Button>

                  <Button
                    onClick={() => handleStatusUpdate("registered_eal")}
                    disabled={isUpdatingStatus || metadata?.status === "registered_eal"}
                    variant="outline"
                    className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                  >
                    <GraduationCap className="w-4 h-4 mr-2" />
                    Register with EAL
                  </Button>
                </div>

                {/* Status Update */}
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Update Status
                  </label>
                  <select
                    value={metadata?.status || "pending"}
                    onChange={(e) => handleStatusUpdate(e.target.value as BookingStatus)}
                    disabled={isUpdatingStatus}
                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm w-full max-w-xs"
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Financial Summary */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-gray-500" />
                  Financial Summary
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Initial Due</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {metadata?.invoiceAmount ? formatCurrency(metadata.invoiceAmount) : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Programme</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {metadata?.totalAmount ? formatCurrency(metadata.totalAmount) : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Invoices Generated</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {metadata?.invoiceIds?.length || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="text-lg font-semibold text-gray-900 capitalize">
                      {metadata?.status?.replace(/_/g, " ") || "Pending"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Candidate Details */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  Candidate Details
                </h3>
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <dt className="text-gray-500">Full Name</dt>
                    <dd className="font-medium text-gray-900">{booking.fullName}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Email</dt>
                    <dd className="font-medium text-gray-900">{booking.email}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Phone</dt>
                    <dd className="font-medium text-gray-900">{booking.contactNumber}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Date of Birth</dt>
                    <dd className="font-medium text-gray-900">{formatDate(booking.dateOfBirth)}</dd>
                  </div>
                  <div className="md:col-span-2">
                    <dt className="text-gray-500">Address</dt>
                    <dd className="font-medium text-gray-900">{booking.homeAddress}</dd>
                  </div>
                </dl>
              </div>

              {/* Employer Details */}
              {booking.employerName && (
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-gray-500" />
                    Employer Details
                  </h3>
                  <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <dt className="text-gray-500">Employer</dt>
                      <dd className="font-medium text-gray-900">{booking.employerName}</dd>
                    </div>
                    {booking.companyContactName && (
                      <div>
                        <dt className="text-gray-500">Contact</dt>
                        <dd className="font-medium text-gray-900">{booking.companyContactName}</dd>
                      </div>
                    )}
                    {booking.employerEmail && (
                      <div>
                        <dt className="text-gray-500">Email</dt>
                        <dd className="font-medium text-gray-900">{booking.employerEmail}</dd>
                      </div>
                    )}
                    {(booking.employerTelephone || booking.employerMobile) && (
                      <div>
                        <dt className="text-gray-500">Phone</dt>
                        <dd className="font-medium text-gray-900">
                          {booking.employerTelephone || booking.employerMobile}
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>
              )}

              {/* Course Details */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-gray-500" />
                  Course Details
                </h3>
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="md:col-span-2">
                    <dt className="text-gray-500">Qualification</dt>
                    <dd className="font-medium text-gray-900">{booking.qualification}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Route</dt>
                    <dd className="font-medium text-gray-900">{booking.route}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Service</dt>
                    <dd className="font-medium text-gray-900">
                      {booking.serviceOption === "gold" ? "Gold Service" : "Standard Programme"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Payment</dt>
                    <dd className="font-medium text-gray-900">
                      {booking.paymentOption === "full" ? "Full Payment" : "Instalments"}
                    </dd>
                  </div>
                  {booking.preferredStartDate && (
                    <div>
                      <dt className="text-gray-500">Preferred Start</dt>
                      <dd className="font-medium text-gray-900">
                        {formatDate(booking.preferredStartDate)}
                      </dd>
                    </div>
                  )}
                </dl>
                {booking.notes && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <dt className="text-sm text-gray-500 mb-1">Notes / Experience</dt>
                    <dd className="text-sm text-gray-700 whitespace-pre-wrap">{booking.notes}</dd>
                  </div>
                )}
              </div>

              {/* Submission Info */}
              <div className="text-sm text-gray-500">
                <p>
                  Submitted: {formatDate(booking.submittedAt)} at{" "}
                  {new Date(booking.submittedAt).toLocaleTimeString("en-GB")}
                </p>
                <p>Digital Signature: {booking.digitalSignature}</p>
                <p className="font-mono text-xs mt-1">ID: {bookingId}</p>
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}
