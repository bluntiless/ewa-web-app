import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Lightbulb, Zap, CreditCard, FilePenLine } from "lucide-react"

export const metadata: Metadata = {
  title: "Our Services",
  description:
    "Explore the Electrotechnical Experienced Worker Assessment (EWA) Level 3 and ECS Gold Card routes offered by EWA Tracker Limited.",
  keywords: ["EWA", "ECS Gold Card", "electrical qualifications", "experienced worker assessment", "UK electrician", "Level 3"],
  alternates: {
    canonical: "https://ewatracker.co.uk/services",
  },
  openGraph: {
    title: "Our Services - EWA Tracker Limited",
    description:
      "Explore the EWA Level 3 and ECS Gold Card routes offered by EWA Tracker Limited.",
    url: "https://ewatracker.co.uk/services",
  },
}

export default function ServicesPage() {
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
          <Link href="/services" className="text-blue-700 font-medium transition-colors">
            Services
          </Link>
          <Link href="/contact" className="text-gray-700 hover:text-blue-700 font-medium transition-colors">
            Contact
          </Link>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-16 md:py-24">
        <section className="bg-white rounded-xl shadow-lg p-8 md:p-12 mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Comprehensive Electrotechnical Assessment Services
          </h1>
          <p className="text-lg text-gray-700 leading-relaxed mb-8 max-w-3xl mx-auto">
            EWA Tracker Limited offers qualifications designed for experienced electrical workers, with EAL
            recognition pending. Explore our pathways to formal certification and career advancement.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Link
              href="/ewa-assessment"
              className="group bg-blue-50 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center"
            >
              <Zap className="w-12 h-12 text-blue-700 mb-4 group-hover:scale-110 transition-transform" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">EWA Assessment</h2>
              <p className="text-gray-700 text-sm mb-4">
                The direct route for experienced electricians to achieve Level 3 qualification.
              </p>
              <span className="text-blue-700 font-semibold group-hover:underline">Learn More &rarr;</span>
            </Link>

            <Link
              href="/ecs-gold-card-route"
              className="group bg-blue-50 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center"
            >
              <CreditCard className="w-12 h-12 text-blue-700 mb-4 group-hover:scale-110 transition-transform" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">ECS Gold Card Route</h2>
              <p className="text-gray-700 text-sm mb-4">
                Understand how our qualifications lead to your ECS Gold Card.
              </p>
              <span className="text-blue-700 font-semibold group-hover:underline">Learn More &rarr;</span>
            </Link>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Start Your Assessment Journey</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-8 max-w-3xl mx-auto">
              Ready to take the first step? Fill out our candidate background check and skills scan to help us
              understand your experience and guide you to the right qualification pathway.
            </p>
            <Link
              href="/candidate-check"
              className="inline-flex items-center px-8 py-3 rounded-full text-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-lg"
            >
              <FilePenLine className="w-5 h-5 mr-2" /> Start Skills Scan
            </Link>
          </div>
        </section>

        <section className="bg-blue-700 text-white rounded-xl shadow-lg p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Qualified?</h2>
          <p className="text-lg opacity-90 max-w-3xl mx-auto mb-8">
            Take the next step in your electrical career. Contact us today to discuss your assessment needs and how we
            can help you achieve your Level 3 qualification.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center px-8 py-3 rounded-full text-lg font-semibold bg-white text-blue-700 hover:bg-gray-100 transition-colors shadow-lg"
          >
            <Lightbulb className="w-5 h-5 mr-2" /> Get in Touch
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
