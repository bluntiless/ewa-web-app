import Image from "next/image"
import Link from "next/link"
import { Award, Lightbulb } from "lucide-react"

export const metadata = {
  title: "Our Services - EWA Tracker Limited",
  description:
    "Discover the Electrotechnical Experienced Worker Assessment (EWA) Level 3 and NVQ Level 3 1605 qualifications offered by EWA Tracker Limited.",
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
        <section className="bg-white rounded-xl shadow-lg p-8 md:p-12 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 text-center">
            Our Electrotechnical Assessment Services
          </h1>
          <p className="text-lg text-gray-700 leading-relaxed mb-8 text-center max-w-3xl mx-auto">
            EWA Tracker Limited provides comprehensive assessment services for experienced electrical workers seeking to
            formalize their skills and achieve industry-recognized qualifications.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="bg-blue-50 rounded-xl p-8 shadow-inner">
              <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center">
                <Award className="w-8 h-8 mr-3 text-blue-700" /> EWA Level 3 Qualification
              </h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                The Electrotechnical Experienced Worker Assessment (EWA) Level 3 is designed for electricians with
                significant on-site experience but without a formal Level 3 qualification. This assessment pathway
                allows you to demonstrate your competence against the industry standard.
              </p>
              <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2">
                <li>**Recognised by EAL**: Ensuring your qualification is widely accepted and respected.</li>
                <li>
                  **Evidence-based Assessment**: Focuses on your practical skills and knowledge gained through
                  experience.
                </li>
                <li>**Flexible Submission**: Utilize our iOS app or SharePoint for convenient evidence upload.</li>
                <li>**Career Progression**: Opens doors to further professional development and opportunities.</li>
              </ul>
            </div>

            <div className="bg-green-50 rounded-xl p-8 shadow-inner">
              <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center">
                <Award className="w-8 h-8 mr-3 text-green-700" /> NVQ Level 3 1605 Qualification
              </h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                In addition to the EWA, we are approved to deliver the NVQ Level 3 1605 qualification. This
                qualification is ideal for those who require a broader vocational qualification in electrotechnical
                services.
              </p>
              <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2">
                <li>**Comprehensive Curriculum**: Covers a wide range of electrotechnical principles and practices.</li>
                <li>**Practical & Theoretical**: Balances hands-on assessment with essential theoretical knowledge.</li>
                <li>**Industry Standard**: Meets the requirements for competent electrical professionals.</li>
                <li>
                  **Enhanced Employability**: Boosts your credentials and job prospects in the electrical industry.
                </li>
              </ul>
            </div>
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
            <Lightbulb className="w-5 h-5 mr-2" /> Learn More
          </Link>
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
