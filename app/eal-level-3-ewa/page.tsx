import Image from "next/image"
import Link from "next/link"
import { CheckCircle, Lightbulb, FileText, Award } from "lucide-react"
import { MobileNav } from "@/components/mobile-nav"

export const metadata = {
  title: "EAL Level 3 EWA - EWA Tracker Limited",
  description:
    "Details on the EAL Level 3 Electrotechnical Experienced Worker Assessment (EWA) qualification offered by EWA Tracker Limited.",
  keywords: "EAL Level 3, EWA, electrotechnical qualification, experienced worker, electrical assessment, UK",
}

export default function EalLevel3EwaPage() {
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
            EAL Level 3 Electrotechnical Experienced Worker Assessment (EWA)
          </h1>
          <p className="text-lg text-gray-700 leading-relaxed mb-8 max-w-3xl mx-auto">
            The EAL Level 3 Electrotechnical Experienced Worker Assessment (EWA) is a comprehensive qualification
            designed for individuals who have significant experience in the electrical industry but require formal
            certification to demonstrate their competence.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Qualification Overview</h2>
              <div className="flex items-start space-x-4">
                <Award className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Industry Standard</h3>
                  <p className="text-gray-600 mt-2">
                    This qualification is recognized across the UK electrotechnical industry and is a key requirement
                    for many professional roles.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <FileText className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Competence-Based</h3>
                  <p className="text-gray-600 mt-2">
                    Focuses on assessing your practical skills and knowledge gained through on-the-job experience.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <CheckCircle className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">ECS Gold Card Pathway</h3>
                  <p className="text-gray-600 mt-2">
                    Successful completion is a direct route to applying for the ECS Gold Card.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Assessment Components</h2>
              <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-3">
                <li>
                  <span className="font-semibold">Skills Scan:</span> An initial assessment to determine your
                  suitability and identify any knowledge gaps.
                </li>
                <li>
                  <span className="font-semibold">Portfolio of Evidence:</span> Compilation of work-based evidence
                  demonstrating your competence in various electrical tasks.
                </li>
                <li>
                  <span className="font-semibold">Practical Assessments:</span> Hands-on tasks to verify your practical
                  skills in a controlled environment.
                </li>
                <li>
                  <span className="font-semibold">Professional Discussion:</span> An interview with an assessor to
                  discuss your experience and knowledge.
                </li>
                <li>
                  <span className="font-semibold">AM2 (Achievement Measurement 2):</span> The industry-standard
                  practical assessment of competence.
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 p-6 bg-blue-50 border-l-4 border-blue-500 text-blue-800 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Is this the right qualification for you?</h3>
            <p className="text-gray-700 leading-relaxed">
              The EAL Level 3 EWA is ideal for experienced electricians who have not completed a formal apprenticeship
              or traditional training route but possess the necessary skills and knowledge.
            </p>
            <Link
              href="/candidate-check"
              className="inline-flex items-center px-6 py-2 rounded-full text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors mt-4"
            >
              Take our Skills Scan <span className="ml-2">&rarr;</span>
            </Link>
          </div>
        </section>

        <section className="bg-blue-700 text-white rounded-xl shadow-lg p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Achieve Your EAL Level 3 EWA?</h2>
          <p className="text-lg opacity-90 max-w-3xl mx-auto mb-8">
            Contact us today to discuss your eligibility and start your assessment journey.
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
