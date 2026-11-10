import Image from "next/image"
import Link from "next/link"
import { Mail, Phone } from "lucide-react"

export const metadata = {
  title: "Contact Us - EWA Tracker Limited",
  description:
    "Get in touch with EWA Tracker Limited for inquiries about our electrotechnical qualifications and assessment services.",
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Header/Navigation */}
      <header className="w-full bg-white shadow-sm py-4 px-6 md:px-8 lg:px-12 flex justify-between items-center">
        <Link href="/">
          <Image src="/ewa_logo.png" alt="EWA Tracker Logo" width={120} height={40} className="object-contain" />
        </Link>
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
      </header>

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

          <div className="bg-blue-50 rounded-lg p-6 shadow-inner">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Send Us a Message</h2>
            <p className="text-gray-700 mb-6">
              For specific inquiries, please use the contact methods above. We do not currently offer a direct contact
              form on this website.
            </p>
            {/* A contact form could be added here in the future */}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8 text-center">
        <div className="max-w-6xl mx-auto px-4">
          <p>&copy; {new Date().getFullYear()} EWA Tracker Limited. All rights reserved.</p>
          <p className="mt-2 text-sm">Registered in England and Wales. Company No. 12345678.</p>
          <div className="flex justify-center space-x-4 mt-4">
            <a
              href="https://linkedin.com/company/ewatracker"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              LinkedIn
            </a>
            <a
              href="https://twitter.com/ewatracker"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Twitter
            </a>
            <a
              href="https://github.com/ewatracker"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
