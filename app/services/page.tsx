import Image from "next/image"
import Link from "next/link"
import { Lightbulb, CheckCircle, BookOpen, Search } from "lucide-react"
import { MobileNav } from "@/components/mobile-nav"

export const metadata = {
  title: "Our Services - EWA Tracker Limited",
  description:
    "Explore the services offered by EWA Tracker Limited, including NVQ assessments, skills scans, and ECS Gold Card guidance.",
  keywords:
    "electrical NVQ, NVQ assessment, ECS Gold Card, skills scan, experienced worker assessment, electrical qualifications UK",
}

export default function ServicesPage() {
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
        <section className="bg-white rounded-xl shadow-lg p-8 md:p-12 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 text-center">Our Services</h1>
          <p className="text-lg text-gray-700 leading-relaxed mb-8 text-center max-w-3xl mx-auto">
            EWA Tracker Limited provides comprehensive support for experienced electricians seeking to achieve
            nationally recognized qualifications and the ECS Gold Card.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {/* Service 1: Experienced Worker Assessment (EWA) */}
            <div className="bg-gray-50 rounded-lg p-6 shadow-sm flex flex-col items-center text-center">
              <Lightbulb className="w-12 h-12 text-blue-600 mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Experienced Worker Assessment (EWA)</h2>
              <p className="text-gray-700 mb-4 flex-grow">
                For electricians with significant experience but no formal Level 3 qualification. This route assesses
                your existing skills and knowledge.
              </p>
              <Link
                href="/ewa-assessment"
                className="inline-flex items-center px-6 py-2 rounded-full text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                Learn More <span className="ml-2">&rarr;</span>
              </Link>
            </div>

            {/* Service 2: NVQ Level 3 (1605) Qualification */}
            <div className="bg-gray-50 rounded-lg p-6 shadow-sm flex flex-col items-center text-center">
              <BookOpen className="w-12 h-12 text-green-600 mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-3">NVQ Level 3 (1605) Qualification</h2>
              <p className="text-gray-700 mb-4 flex-grow">
                The industry-standard competency-based qualification for experienced electricians, leading to the ECS
                Gold Card.
              </p>
              <Link
                href="/nvq-level-3-1605"
                className="inline-flex items-center px-6 py-2 rounded-full text-sm font-semibold bg-green-600 text-white hover:bg-green-700 transition-colors"
              >
                Learn More <span className="ml-2">&rarr;</span>
              </Link>
            </div>

            {/* Service 4: ECS Gold Card Route */}
            <div className="bg-gray-50 rounded-lg p-6 shadow-sm flex flex-col items-center text-center">
              <CheckCircle className="w-12 h-12 text-orange-600 mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-3">ECS Gold Card Route</h2>
              <p className="text-gray-700 mb-4 flex-grow">
                Guidance and support through the process of obtaining your ECS Gold Card, the industry benchmark for
                qualified electricians.
              </p>
              <Link
                href="/ecs-gold-card-route"
                className="inline-flex items-center px-6 py-2 rounded-full text-sm font-semibold bg-orange-600 text-white hover:bg-orange-700 transition-colors"
              >
                Learn More <span className="ml-2">&rarr;</span>
              </Link>
            </div>

            {/* Service 5: Skills Scan Tool */}
            <div className="bg-gray-50 rounded-lg p-6 shadow-sm flex flex-col items-center text-center">
              <Search className="w-12 h-12 text-teal-600 mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Online Skills Scan Tool</h2>
              <p className="text-gray-700 mb-4 flex-grow">
                Quickly assess your current skills and identify potential qualification routes with our interactive
                online tool.
              </p>
              <Link
                href="/candidate-check"
                className="inline-flex items-center px-6 py-2 rounded-full text-sm font-semibold bg-teal-600 text-white hover:bg-teal-700 transition-colors"
              >
                Start Scan <span className="ml-2">&rarr;</span>
              </Link>
              <p className="text-xs text-gray-500 mt-2">
                Note: A PDF version of the skills scan is still required before enrollment.
              </p>
            </div>

            {/* Service 6: Bridging Exam Check Tool */}
            <div className="bg-gray-50 rounded-lg p-6 shadow-sm flex flex-col items-center text-center">
              <Lightbulb className="w-12 h-12 text-indigo-600 mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Bridging Exam Check</h2>
              <p className="text-gray-700 mb-4 flex-grow">
                Determine if you need to sit the Bridging Assessment Exam for the NVQ 1605 qualification.
              </p>
              <Link
                href="/bridging-exam-check"
                className="inline-flex items-center px-6 py-2 rounded-full text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
              >
                Check Now <span className="ml-2">&rarr;</span>
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-blue-700 text-white rounded-xl shadow-lg p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Advance Your Career?</h2>
          <p className="text-lg opacity-90 max-w-3xl mx-auto mb-8">
            Contact us today to discuss your specific needs and how we can help you achieve your professional goals.
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
