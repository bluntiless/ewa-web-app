import Image from "next/image"
import Link from "next/link"
import { Mail, Phone, MapPin, Lightbulb } from "lucide-react"
import { MobileNav } from "@/components/mobile-nav"

export const metadata = {
  title: "Contact Us - EWA Tracker Limited",
  description: "Get in touch with EWA Tracker Limited for inquiries about our electrotechnical assessment services.",
  keywords: "contact EWA Tracker, electrical assessment contact, electrician qualifications UK, EAL support",
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Header/Navigation */}
      <header className="w-full bg-white shadow-sm py-4 px-6 md:px-8 lg:px-12 flex justify-between items-center">
        <Link href="/">
          <Image src="/ewa_logo.png" alt="EWA Tracker Logo" width={120} height={40} className="object-contain" />
        </Link>
        <div className="flex items-center">
          <nav className="hidden md:flex space-x-6">
            <Link href="/" className="text-gray-700 hover:text-blue-700 font-medium transition-colors">
              Home
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-blue-700 font-medium transition-colors">
              About Us
            </Link>
            <Link href="/services" className="text-gray-700 hover:text-blue-700 font-medium transition-colors">
              Services
            </Link>
            <Link href="/contact" className="text-blue-700 font-medium transition-colors">
              Contact
            </Link>
          </nav>
          <MobileNav className="md:hidden" />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-16 md:py-24">
        <section className="bg-white rounded-xl shadow-lg p-8 md:p-12 mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Get in Touch with EWA Tracker</h1>
          <p className="text-lg text-gray-700 leading-relaxed mb-8 max-w-3xl mx-auto">
            Have questions about our qualifications, the assessment process, or need support? We're here to help. Reach
            out to us through the following channels:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col items-center text-center bg-blue-50 rounded-lg p-6 shadow-sm">
              <Mail className="w-12 h-12 text-blue-600 mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Email Us</h2>
              <p className="text-gray-700 mb-4">For general inquiries and detailed questions.</p>
              <a
                href="mailto:info@ewatracker.co.uk"
                className="inline-flex items-center px-6 py-2 rounded-full text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                info@ewatracker.co.uk
              </a>
            </div>

            <div className="flex flex-col items-center text-center bg-green-50 rounded-lg p-6 shadow-sm">
              <Phone className="w-12 h-12 text-green-600 mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Call Us</h2>
              <p className="text-gray-700 mb-4">Speak directly with our team for immediate assistance.</p>
              <a
                href="tel:+447828893976"
                className="inline-flex items-center px-6 py-2 rounded-full text-sm font-semibold bg-green-600 text-white hover:bg-green-700 transition-colors"
              >
                07828 893976
              </a>
            </div>
          </div>

          <div className="mt-12 p-6 bg-gray-100 rounded-lg shadow-inner text-left">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <MapPin className="w-6 h-6 mr-2 text-gray-700" /> Our Location
            </h2>
            <p className="text-gray-700 leading-relaxed">
              While we primarily operate online and provide remote assessment support, our administrative office is
              located at:
            </p>
            <address className="mt-4 text-gray-800 font-medium not-italic">
              9-11 NEW BROADWAY
              <br />
              EALING
              <br />
              LONDON
              <br />
              UNITED KINGDOM
              <br />
              W5 5AW
            </address>
            <p className="text-sm text-gray-600 mt-4">
              Please note: Visits are by appointment only. For all inquiries, we recommend contacting us via email or
              phone first.
            </p>
          </div>
        </section>

        <section className="bg-blue-700 text-white rounded-xl shadow-lg p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Your Qualification Journey?</h2>
          <p className="text-lg opacity-90 max-w-3xl mx-auto mb-8">
            Take the first step towards achieving your Level 3 qualification.
          </p>
          <Link
            href="/services"
            className="inline-flex items-center px-8 py-3 rounded-full text-lg font-semibold bg-white text-blue-700 hover:bg-gray-100 transition-colors shadow-lg"
          >
            <Lightbulb className="w-5 h-5 mr-2" /> Explore Our Services
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8 text-center">
        <div className="max-w-6xl mx-auto px-4">
          <p>&copy; {new Date().getFullYear()} EWA Tracker Limited. All rights reserved.</p>
          <p className="mt-2 text-sm">Registered in England and Wales. Company No. 16413190.</p>
          <div className="flex justify-center space-x-4 mt-4">
            <a
              href="https://www.instagram.com/ewa_tracker_ltd/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Instagram
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
