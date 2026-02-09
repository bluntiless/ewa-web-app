import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Lightbulb, Award, BookOpen } from "lucide-react"

export const metadata: Metadata = {
  title: "EWA Electrician Assessment UK - Electrotechnical Experienced Worker Qualification",
  description:
    "EWA Tracker Limited offers the Electrotechnical Experienced Worker Assessment (EWA) for electricians in the UK. Fast-track your Level 3 qualification and achieve your ECS Gold Card.",
  keywords: [
    "EWA electrician assessment UK",
    "EWA qualification",
    "experienced worker assessment",
    "Level 3 electrician",
    "EAL EWA",
    "electrotechnical assessment",
  ],
  alternates: {
    canonical: "https://ewatracker.co.uk/ewa-assessment",
  },
  openGraph: {
    title: "EWA Electrician Assessment UK - Electrotechnical Experienced Worker Qualification",
    description:
      "Fast-track your Level 3 qualification and achieve your ECS Gold Card with EWA Tracker Limited.",
    url: "https://ewatracker.co.uk/ewa-assessment",
  },
}

export default function EwaAssessmentPage() {
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
            Electrotechnical Experienced Worker Assessment (EWA) in the UK
          </h1>
          <p className="text-lg text-gray-700 leading-relaxed mb-8 text-center max-w-3xl mx-auto">
            The EWA is a vital qualification for experienced electricians who have been working in the industry but may
            not hold a formal Level 3 qualification. It provides a pathway to demonstrate your competence and achieve
            the industry-standard certification.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <Award className="w-6 h-6 mr-2 text-blue-600" /> What is the EWA?
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                The EWA is an assessment process designed by EAL to evaluate the skills, knowledge, and experience of
                electricians who have gained their expertise on the job. It's a practical route to gaining a recognised
                Level 3 qualification without needing to go through a full apprenticeship.
              </p>
              <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2 mb-6">
                <li>**Industry Recognition**: EAL recognition pending, ensuring your qualification will be valued across the UK.</li>
                <li>**Competence-Based**: Focuses on your proven abilities in real-world electrical installations.</li>
                <li>**Efficient Pathway**: Designed to fast-track experienced workers to qualified status.</li>
                <li>**ECS Gold Card Eligibility**: A key step towards obtaining your ECS Gold Card.</li>
              </ul>

              <div className="mt-6 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 rounded">
                <p className="font-semibold">IMPORTANT NOTE:</p>
                <p className="text-sm">
                  From 04.09.23, Learners MUST already possess as a minimum a Level 2 qualification, as detailed in the
                  TESP skills scan, to take this qualification. Please also see Section 5 of the qualification manual.
                </p>
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl p-8 shadow-inner">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <BookOpen className="w-6 h-6 mr-2 text-blue-700" /> The Assessment Process
              </h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                Our EWA process is structured to be as straightforward as possible, allowing you to demonstrate your
                competence effectively.
              </p>
              <ul className="list-decimal list-inside text-gray-700 leading-relaxed space-y-3">
                <li>
                  **Initial Skills Scan**: We'll assess your existing qualifications and experience to ensure the EWA is
                  the right route for you.
                </li>
                <li>
                  **Evidence Collection**: You'll gather evidence of your work, which can be conveniently uploaded via
                  our iOS mobile app or secure SharePoint platform.
                </li>
                <li>
                  **Practical Assessment**: Demonstrations of your practical skills in a controlled environment or
                  through on-site observations.
                </li>
                <li>
                  **Knowledge Assessment**: Evaluation of your theoretical understanding of electrotechnical principles
                  and regulations.
                </li>
                <li>**Certification**: Upon successful completion, you will receive your EAL Level 3 qualification.</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-blue-700 text-white rounded-xl shadow-lg p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Your EWA Journey?</h2>
          <p className="text-lg opacity-90 max-w-3xl mx-auto mb-8">
            Contact EWA Tracker Limited today to discuss your eligibility and begin your path to a recognised Level 3
            qualification and ECS Gold Card.
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
