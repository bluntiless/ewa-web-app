import Image from "next/image"
import Link from "next/link"
import { Award, Lightbulb } from "lucide-react"
import { MobileNav } from "@/components/mobile-nav"

export const metadata = {
  title: "ECS Gold Card Route - EWA Tracker Limited",
  description:
    "Understand the pathway to obtaining your ECS Gold Card through EWA Tracker Limited's recognized qualifications.",
  keywords: "ECS Gold Card, JIB Gold Card, experienced electrician, electrical qualification, EWA, NVQ 1605",
}

export default function EcsGoldCardRoutePage() {
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
            Achieving Your ECS Gold Card with EWA Tracker
          </h1>
          <p className="text-lg text-gray-700 leading-relaxed mb-8 max-w-3xl mx-auto">
            The Electrotechnical Certification Scheme (ECS) Gold Card is the industry-recognized proof of competence for
            qualified electricians in the UK. EWA Tracker Limited provides the necessary qualifications to help you
            achieve this essential credential.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">What is the ECS Gold Card?</h2>
              <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-3">
                <li>
                  It signifies that you are a fully qualified electrician, having achieved the industry-recognized Level
                  3 NVQ in Electrotechnical Services (or equivalent).
                </li>
                <li>
                  It is often a mandatory requirement for working on many construction sites and for certain types of
                  electrical work.
                </li>
                <li>
                  The card demonstrates your competence, qualifications, and identity, enhancing your professional
                  credibility.
                </li>
              </ul>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Pathway to Your Gold Card</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                EWA Tracker Limited offers the following qualifications that are recognized pathways to the ECS Gold
                Card:
              </p>
              <div className="flex items-start space-x-4">
                <Award className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    EAL Electrotechnical Experienced Worker Assessment (EWA) Level 3
                  </h3>
                  <p className="text-gray-600 mt-2">
                    Designed for experienced electricians without a formal Level 3 qualification.
                  </p>
                  <Link href="/ewa-assessment" className="text-blue-600 hover:underline text-sm mt-1 inline-block">
                    Learn more about EWA &rarr;
                  </Link>
                </div>
              </div>
              <div className="flex items-start space-x-4 mt-4">
                <Award className="w-8 h-8 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">NVQ Level 3 (1605) Qualification</h3>
                  <p className="text-gray-600 mt-2">
                    The core vocational qualification for electrotechnical competence.
                  </p>
                  <Link href="/nvq-level-3-1605" className="text-green-600 hover:underline text-sm mt-1 inline-block">
                    Learn more about NVQ 1605 &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 p-6 bg-blue-50 border-l-4 border-blue-500 text-blue-800 rounded-lg">
            <h2 className="text-xl font-bold mb-3">Additional Requirements for ECS Gold Card</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              In addition to holding a recognized Level 3 qualification, applicants for the ECS Gold Card typically need
              to meet other criteria, including:
            </p>
            <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2 ml-4">
              <li>
                Holding a current (within 3 years) ECS Health, Safety and Environmental (HS&E) Assessment or an
                acceptable equivalent.
              </li>
              <li>Demonstrating relevant work experience.</li>
            </ul>
            <p className="text-sm text-gray-600 mt-4">
              For the most up-to-date and complete requirements, always refer to the official ECS website.
            </p>
          </div>
        </section>

        <section className="bg-blue-700 text-white rounded-xl shadow-lg p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Secure Your Gold Card?</h2>
          <p className="text-lg opacity-90 max-w-3xl mx-auto mb-8">
            Start your journey by exploring our qualifications or contacting us for personalized guidance.
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
