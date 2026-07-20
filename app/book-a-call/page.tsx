import type { Metadata } from "next"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"
import BookACall from "./BookACall"

export const metadata: Metadata = {
  title: "Book a Free Call",
  description:
    "Book a free 30-minute phone consultation with EWA Tracker Ltd to discuss your Experienced Worker Assessment route and eligibility. Pick a time that suits you.",
  alternates: {
    canonical: "https://ewatracker.co.uk/book-a-call",
  },
  openGraph: {
    title: "Book a Free Call - EWA Tracker Ltd",
    description:
      "Schedule a free 30-minute phone consultation to discuss your EWA eligibility and next steps.",
    url: "https://ewatracker.co.uk/book-a-call",
  },
}

export default function BookACallPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <SiteHeader />
      <main className="max-w-4xl mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 text-balance">
            Book Your Free 30-Minute Call
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto text-pretty">
            Pick a time that suits you and we&apos;ll call you to discuss your Experienced Worker
            Assessment route and eligibility. Evening slots available for those working during the day.
          </p>
        </div>
        <BookACall />
      </main>
      <SiteFooter />
    </div>
  )
}
