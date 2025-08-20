import Image from "next/image"
import Link from "next/link"
import { Lightbulb, FileText, Award } from "lucide-react"
import { MobileNav } from "@/components/mobile-nav"

export const metadata = {
  title: "EWA Assessment - EWA Tracker Limited",
  description:
    "Learn about the Electrotechnical Experienced Worker Assessment (EWA) Level 3 qualification process offered by EWA Tracker Limited.",
  keywords:
    "EWA, Experienced Worker Assessment, electrical qualification, Level 3 electrician, UK electrical assessment",
}

export default function EwaAssessmentPage() {
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
            <Link href="/services" className="text-blue-700 font-medium transition-colors">
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
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Electrotechnical Experienced Worker Assessment (EWA)
          </h1>
          <p className="text-lg text-gray-700 leading-relaxed mb-8 max-w-3xl mx-auto">
            The EWA is designed for experienced electricians who have been working in the industry for several years but
            do not hold a formal Level 3 qualification. It provides a pathway to gain the industry-recognized
            qualification based on your existing skills and knowledge.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Key Features of the EWA</h2>
              <div className="flex items-start space-x-4">
                <Award className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Industry Recognition</h3>
                  <p className="text-gray-600 mt-2">
                    Achieve a nationally recognized Level 3 qualification, essential for career progression and ECS Gold
                    Card eligibility.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Lightbulb className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Assessment of Prior Learning</h3>
                  <p className="text-gray-600 mt-2">
                    Your existing experience and skills are formally assessed, reducing the need for extensive
                    retraining.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <FileText className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Comprehensive Assessment</h3>
                  <p className="text-gray-600 mt-2">
                    Includes practical assessments, professional discussions, and a portfolio of evidence to cover all
                    required units.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Who is the EWA for?</h2>
              <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-3">
                <li>
                  Experienced electricians who have worked in the industry for 5+ years but lack a formal Level 3
                  qualification.
                </li>
                <li>
                  Individuals who have completed relevant Level 2 and Level 3 qualifications (e.g., C&G 2365) but need
                  to achieve the full NVQ.
                </li>
                <li>Electricians seeking to apply for the ECS Gold Card.</li>
              </ul>
              <div className="bg-blue-50 rounded-lg p-6 mt-6 shadow-inner">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Ready to Start?</h3>
                <p className="text-gray-700 leading-relaxed">
                  Take our online Skills Scan to get an initial indication of your suitability for the EWA.
                </p>
                <Link
                  href="/candidate-check"
                  className="inline-flex items-center px-6 py-2 rounded-full text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors mt-4"
                >
                  Start Skills Scan <span className="ml-2">&rarr;</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-blue-700 text-white rounded-xl shadow-lg p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold mb-6">Contact Us for More Information</h2>
          <p className="text-lg opacity-90 max-w-3xl mx-auto mb-8">
            Our team is ready to guide you through the EWA process and answer any questions you may have.
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
