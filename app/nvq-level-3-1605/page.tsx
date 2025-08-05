import Image from "next/image"
import Link from "next/link"
import { CheckCircle, Lightbulb, FileText, Award } from "lucide-react"
import { MobileNav } from "@/components/mobile-nav"

export const metadata = {
  title: "NVQ Level 3 (1605) - EWA Tracker Limited",
  description:
    "Information on the NVQ Level 3 (1605) Electrotechnical Qualification offered by EWA Tracker Limited, a pathway to the ECS Gold Card.",
  keywords: "NVQ Level 3, 1605 qualification, electrical NVQ, experienced electrician, ECS Gold Card, UK",
}

export default function NvqLevel31605Page() {
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
            NVQ Level 3 Electrotechnical Qualification (1605)
          </h1>
          <p className="text-lg text-gray-700 leading-relaxed mb-8 max-w-3xl mx-auto">
            The NVQ Level 3 Electrotechnical Qualification (1605) is a key industry standard, demonstrating the
            competence of experienced electricians. It is a vital step towards achieving the ECS Gold Card.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Qualification Highlights</h2>
              <div className="flex items-start space-x-4">
                <Award className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Recognised Competence</h3>
                  <p className="text-gray-600 mt-2">
                    This NVQ confirms your ability to work safely and competently in various electrotechnical roles.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <FileText className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Portfolio-Based Assessment</h3>
                  <p className="text-gray-600 mt-2">
                    Evidence of your work and skills is gathered through a portfolio, reflecting real-world experience.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <CheckCircle className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">ECS Gold Card Eligibility</h3>
                  <p className="text-gray-600 mt-2">
                    A fundamental qualification required for obtaining the prestigious ECS Gold Card.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Who is this NVQ for?</h2>
              <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-3">
                <li>
                  Experienced electricians who have completed relevant technical certificates (e.g., C&G 2365 Level 2 &
                  3) and now need to achieve the full NVQ.
                </li>
                <li>
                  Individuals seeking to formalize their extensive on-the-job experience with a nationally recognized
                  qualification.
                </li>
                <li>Electricians aiming to enhance their career prospects and meet industry requirements.</li>
              </ul>
              <div className="bg-blue-50 rounded-lg p-6 mt-6 shadow-inner">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Bridging Exam Requirement</h3>
                <p className="text-gray-700 leading-relaxed">
                  Depending on your previous qualifications and when they were completed, you may need to sit a Bridging
                  Assessment Exam. Use our tool to check your requirement.
                </p>
                <Link
                  href="/bridging-exam-check"
                  className="inline-flex items-center px-6 py-2 rounded-full text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors mt-4"
                >
                  Check Bridging Exam <span className="ml-2">&rarr;</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-blue-700 text-white rounded-xl shadow-lg p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Achieve Your NVQ Level 3 (1605)?</h2>
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
