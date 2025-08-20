import Image from "next/image"
import Link from "next/link"
import { Users, Lightbulb, Award, Handshake } from "lucide-react"
import { MobileNav } from "@/components/mobile-nav"

export const metadata = {
  title: "About Us - EWA Tracker Limited",
  description:
    "Learn about EWA Tracker Limited, our mission, values, and commitment to providing high-quality electrotechnical assessments.",
  keywords: "EWA Tracker, about us, electrical assessment, company values, mission, EAL recognised",
}

export default function AboutPage() {
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
            <Link href="/about" className="text-blue-700 font-medium transition-colors">
              About Us
            </Link>
            <Link href="/services" className="text-gray-700 hover:text-blue-700 font-medium transition-colors">
              Services
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-blue-700 font-medium transition-colors">
              Contact
            </Link>
          </nav>
          <MobileNav className="md:hidden" />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-16 md:py-24">
        <section className="bg-white rounded-xl shadow-lg p-8 md:p-12 mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">About EWA Tracker Limited</h1>
          <p className="text-lg text-gray-700 leading-relaxed mb-8 max-w-3xl mx-auto">
            EWA Tracker Limited is dedicated to empowering experienced electricians to achieve formal recognition for
            their skills and expertise. We provide comprehensive assessment solutions, ensuring a clear pathway to
            industry-standard qualifications.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <div className="flex items-start space-x-4">
                <Lightbulb className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Empowering Electricians</h3>
                  <p className="text-gray-600 mt-2">
                    To provide accessible and efficient assessment pathways for experienced electrical workers, enabling
                    them to gain the qualifications necessary for career advancement and professional recognition.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Award className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Maintaining Standards</h3>
                  <p className="text-gray-600 mt-2">
                    To uphold the highest standards of assessment integrity and quality, ensuring that all certified
                    individuals meet the rigorous requirements of the electrotechnical industry.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Values</h2>
              <div className="flex items-start space-x-4">
                <Handshake className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Integrity & Transparency</h3>
                  <p className="text-gray-600 mt-2">
                    Conducting all assessments and operations with honesty, fairness, and clear communication.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Users className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Support & Guidance</h3>
                  <p className="text-gray-600 mt-2">
                    Providing comprehensive support to candidates throughout their assessment journey, from initial
                    enquiry to certification.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-blue-700 text-white rounded-xl shadow-lg p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-lg opacity-90 max-w-3xl mx-auto mb-8">
            Explore our services or contact us directly to learn how we can help you achieve your qualification.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link
              href="/services"
              className="inline-flex items-center px-8 py-3 rounded-full text-lg font-semibold bg-white text-blue-700 hover:bg-gray-100 transition-colors shadow-lg"
            >
              <Lightbulb className="w-5 h-5 mr-2" /> Our Services
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center px-8 py-3 rounded-full text-lg font-semibold border border-white text-white hover:bg-white hover:text-blue-700 transition-colors shadow-lg"
            >
              <Handshake className="w-5 h-5 mr-2" /> Contact Us
            </Link>
          </div>
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
