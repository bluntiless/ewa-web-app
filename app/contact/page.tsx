import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Mail, Phone } from "lucide-react"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with EWA Tracker Ltd, an EAL approved centre for the Level 3 Electrotechnical Experienced Worker Qualification.",
  alternates: {
    canonical: "https://ewatracker.co.uk/contact",
  },
  openGraph: {
    title: "Contact Us - EWA Tracker Ltd",
    description:
      "Get in touch with EWA Tracker Ltd for inquiries about our EAL approved electrotechnical qualification.",
    url: "https://ewatracker.co.uk/contact",
  },
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <SiteHeader />

      <main className="max-w-6xl mx-auto px-4 py-16 md:py-24">
        <section className="bg-white rounded-xl shadow-lg p-8 md:p-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Contact Us</h1>
          <p className="text-lg text-gray-700 leading-relaxed mb-8 max-w-3xl mx-auto">
            We're here to answer your questions and provide support. Feel free to reach out to us through the following
            channels:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="flex flex-col items-center p-6 bg-gray-50 rounded-lg shadow-inner">
              <Mail className="w-10 h-10 text-blue-600 mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Email Us</h2>
              <a href="mailto:info@ewatracker.co.uk" className="text-blue-700 hover:underline text-lg font-medium">
                info@ewatracker.co.uk
              </a>
              <p className="text-sm text-gray-600 mt-2">We aim to respond within 24 business hours.</p>
            </div>
            <div className="flex flex-col items-center p-6 bg-gray-50 rounded-lg shadow-inner">
              <Phone className="w-10 h-10 text-blue-600 mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Call Us</h2>
              <a href="tel:+447828893976" className="text-blue-700 hover:underline text-lg font-medium">
                07828 893976
              </a>
              <p className="text-sm text-gray-600 mt-2">Available Monday - Friday, 9 AM - 5 PM GMT.</p>
            </div>
          </div>

          <div className="bg-blue-700 text-white rounded-lg p-8 shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Book Your EWA Assessment Call</h2>
            <p className="opacity-90 mb-6">
              Ready to start your EWA journey? Schedule a free 30-minute consultation to discuss your eligibility and next steps.
            </p>
            <a
              href="https://calendly.com/ewatracker-info/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-8 py-3 rounded-full text-lg font-semibold bg-white text-blue-700 hover:bg-gray-100 transition-colors shadow-lg"
            >
              Book Your EWA Assessment Call
            </a>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
