import Image from "next/image"
import Link from "next/link"
import { Lightbulb, Award, FileText } from "lucide-react"

export const metadata = {
  title: "NVQ Level 3 Electrical Fast Track - Experienced Worker Qualification",
  description:
    "Achieve your NVQ Level 3 electrical qualification with EWA Tracker Limited. Our fast-track assessment route is designed for experienced electricians in the UK.",
  keywords:
    "NVQ Level 3 electrical fast track, NVQ 1605, electrical NVQ, experienced electrician qualification, UK electrical NVQ",
}

export default function NvqLevel3ElectricalPage() {
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
            NVQ Level 3 Electrical Qualification for Experienced Workers
          </h1>
          <p className="text-lg text-gray-700 leading-relaxed mb-8 text-center max-w-3xl mx-auto">
            The NVQ Level 3 1605 qualification is a comprehensive vocational qualification for electrotechnical systems.
            It's designed for individuals who have gained significant experience in the electrical industry and wish to
            formalize their skills with a nationally recognized qualification.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <Award className="w-6 h-6 mr-2 text-green-600" /> About the NVQ Level 3 1605
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                This qualification demonstrates your competence in a wide range of electrotechnical activities, from
                installation and maintenance to fault diagnosis and testing. It's a robust qualification that proves
                your ability to work safely and effectively to industry standards.
              </p>
              <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2 mb-6">
                <li>**Broad Coverage**: Encompasses various aspects of electrotechnical work.</li>
                <li>
                  **Practical & Knowledge-Based**: Assesses both your hands-on skills and theoretical understanding.
                </li>
                <li>**Industry Standard**: Meets the requirements for competent electrical professionals in the UK.</li>
                <li>**Career Advancement**: Enhances your professional standing and employability.</li>
              </ul>
            </div>

            <div className="bg-green-50 rounded-xl p-8 shadow-inner">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <FileText className="w-6 h-6 mr-2 text-green-700" /> Our Assessment Approach
              </h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                At EWA Tracker Limited, we make the NVQ Level 3 assessment process efficient and supportive for
                experienced workers.
              </p>
              <ul className="list-decimal list-inside text-gray-700 leading-relaxed space-y-3">
                <li>
                  **Portfolio Building**: We guide you in compiling a portfolio of evidence from your workplace
                  experience.
                </li>
                <li>
                  **On-site Assessment**: Our qualified assessors will conduct observations of your work in a real
                  working environment.
                </li>
                <li>
                  **Professional Discussion**: Opportunities to discuss your experience and knowledge with an assessor.
                </li>
                <li>
                  **Flexible Evidence Submission**: Use our iOS mobile app or secure SharePoint platform to submit
                  photos, videos, and documents.
                </li>
                <li>
                  **Certification**: Upon successful completion, you will receive your EAL NVQ Level 3 1605
                  qualification.
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-blue-700 text-white rounded-xl shadow-lg p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold mb-6">Explore Your NVQ Pathway</h2>
          <p className="text-lg opacity-90 max-w-3xl mx-auto mb-8">
            Ready to formalize your electrical expertise with an NVQ Level 3? Contact EWA Tracker Limited to learn more
            about our assessment process and how we can support your qualification goals.
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
