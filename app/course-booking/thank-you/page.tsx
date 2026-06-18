"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"
import { CheckCircle, FileText } from "lucide-react"
import Link from "next/link"

interface BookingSummary {
  fullName: string
  email: string
  qualification: string
  route: string
  serviceOption: "standard" | "gold" | ""
  paymentOption: "full" | "instalments" | ""
  preferredStartDate: string
  digitalSignature: string
  value: number
  totalValue: number
  currency: string
  submittedAt: string
}

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[]
    gtag?: (...args: unknown[]) => void
  }
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(amount)
}

export default function CourseBookingThankYouPage() {
  const [summary, setSummary] = useState<BookingSummary | null>(null)
  const trackedRef = useRef(false)

  useEffect(() => {
    // Read the submission summary stashed by the booking form.
    let parsed: BookingSummary | null = null
    try {
      const raw = sessionStorage.getItem("courseBookingSubmission")
      if (raw) parsed = JSON.parse(raw) as BookingSummary
    } catch {
      parsed = null
    }
    setSummary(parsed)

    // Fire the conversion event exactly once (guard against StrictMode double-run).
    if (trackedRef.current) return
    trackedRef.current = true

    // Push a structured event to the GTM dataLayer. This is the reliable,
    // page-load based conversion signal — point your Google Ads / GA4 / GTM
    // conversion trigger at this event (or at the /course-booking/thank-you URL).
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({
      event: "course_booking_submitted",
      booking_service: parsed?.serviceOption || "unknown",
      booking_payment: parsed?.paymentOption || "unknown",
      value: parsed?.value ?? 0,
      total_value: parsed?.totalValue ?? 0,
      currency: parsed?.currency || "GBP",
    })

    // If gtag (Google Ads / GA4) is loaded directly, also fire a standard event.
    if (typeof window.gtag === "function") {
      window.gtag("event", "course_booking_submitted", {
        value: parsed?.value ?? 0,
        currency: parsed?.currency || "GBP",
      })
    }
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <SiteHeader />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 md:p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2 text-balance">Thank You — Booking Form Submitted</h1>
            <p className="text-gray-600 text-pretty">
              {"We've received your course booking application. A confirmation of next steps will follow by email."}
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8">
            <h2 className="font-semibold text-amber-900 mb-2">Important Information</h2>
            <ul className="text-amber-800 text-sm space-y-2">
              <li>
                {"• Submission of this form "}
                <strong>does not confirm registration or acceptance</strong>
                {" onto the programme."}
              </li>
              <li>
                {
                  "• Registration is subject to verification of certificates, completion of the Technical Discussion, and EAL registration requirements."
                }
              </li>
              <li>{"• We will review your details and send your invoice once eligibility checks are complete."}</li>
              {summary?.email ? (
                <li>
                  {"• We will contact you at "}
                  <strong>{summary.email}</strong>
                  {" with next steps."}
                </li>
              ) : (
                <li>{"• We will contact you using the details you provided with next steps."}</li>
              )}
            </ul>
          </div>

          {summary && (
            <div className="border border-gray-200 rounded-lg p-6 mb-8">
              <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Submission Summary
              </h2>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="text-gray-500">Candidate Name</dt>
                  <dd className="font-medium text-gray-900">{summary.fullName}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Email</dt>
                  <dd className="font-medium text-gray-900">{summary.email}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Qualification</dt>
                  <dd className="font-medium text-gray-900">{summary.qualification}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Route</dt>
                  <dd className="font-medium text-gray-900">{summary.route}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Service Option</dt>
                  <dd className="font-medium text-gray-900">
                    {summary.serviceOption === "standard"
                      ? "Standard Programme"
                      : summary.serviceOption === "gold"
                        ? "Gold Service"
                        : "—"}
                  </dd>
                </div>
                <div>
                  <dt className="text-gray-500">Payment Option</dt>
                  <dd className="font-medium text-gray-900">
                    {summary.paymentOption === "full"
                      ? "Full Payment"
                      : summary.paymentOption === "instalments"
                        ? "Instalments"
                        : "—"}
                  </dd>
                </div>
                {summary.value > 0 && (
                  <div>
                    <dt className="text-gray-500">Amount Due Now</dt>
                    <dd className="font-medium text-gray-900">{formatCurrency(summary.value)}</dd>
                  </div>
                )}
                {summary.totalValue > 0 && (
                  <div>
                    <dt className="text-gray-500">Total Programme Cost</dt>
                    <dd className="font-medium text-gray-900">{formatCurrency(summary.totalValue)}</dd>
                  </div>
                )}
                {summary.preferredStartDate && (
                  <div>
                    <dt className="text-gray-500">Preferred Start Date</dt>
                    <dd className="font-medium text-gray-900">{summary.preferredStartDate}</dd>
                  </div>
                )}
                {summary.digitalSignature && (
                  <div>
                    <dt className="text-gray-500">Digital Signature</dt>
                    <dd className="font-medium text-gray-900">{summary.digitalSignature}</dd>
                  </div>
                )}
              </dl>
            </div>
          )}

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/services">
              <Button variant="outline">Return to Services</Button>
            </Link>
            <Link href="/skills-scan">
              <Button className="bg-blue-600 hover:bg-blue-700">Submit Skills Scan</Button>
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
