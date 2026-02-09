import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Lightbulb, CreditCard, ShieldCheck } from "lucide-react"
import SiteHeader from "@/components/site-header"

export const metadata: Metadata = {
  title: "ECS Gold Card through EWA - Qualified Electrician Route UK",
  description:
    "Learn how to obtain your ECS Gold Card as a qualified electrician through the Electrotechnical Experienced Worker Assessment (EWA) with EWA Tracker Limited.",
  keywords: [
    "ECS Gold Card through EWA",
    "ECS Gold Card route",
    "qualified electrician UK",
    "ECS card assessment",
    "EWA ECS Gold Card",
  ],
  alternates: {
    canonical: "https://ewatracker.co.uk/ecs-gold-card-route",
  },
  openGraph: {
    title: "ECS Gold Card through EWA - Qualified Electrician Route UK",
    description:
      "Obtain your ECS Gold Card through the EWA with EWA Tracker Limited.",
    url: "https://ewatracker.co.uk/ecs-gold-card-route",
  },
}

export default function EcsGoldCardRoutePage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <SiteHeader />

      <main className="max-w-6xl mx-auto px-4 py-16 md:py-24">
        <section className="bg-white rounded-xl shadow-lg p-8 md:p-12 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 text-center">
            ECS Gold Card Route for Experienced Electricians
          </h1>
          <p className="text-lg text-gray-700 leading-relaxed mb-8 text-center max-w-3xl mx-auto">
            The ECS Gold Card is the industry's most recognized credential for qualified electricians in the UK,
            signifying a high level of competence and professionalism. EWA Tracker Limited provides a clear pathway to
            achieving this essential card through the Electrotechnical Experienced Worker Assessment (EWA).
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <CreditCard className="w-6 h-6 mr-2 text-purple-600" /> Why the ECS Gold Card?
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Holding an ECS Gold Card demonstrates that you are a fully qualified electrician, having achieved the
                industry-recognized Level 3 qualification. It's often a mandatory requirement for working on many sites
                and projects, enhancing your credibility and opening up new opportunities.
              </p>
              <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2 mb-6">
                <li>**Industry Standard**: The benchmark for qualified electricians.</li>
                <li>**Site Access**: Often required for entry to construction sites and commercial projects.</li>
                <li>**Professional Recognition**: Signifies your competence and adherence to safety standards.</li>
                <li>**Career Advancement**: Boosts your employability and earning potential.</li>
              </ul>
            </div>

            <div className="bg-purple-50 rounded-xl p-8 shadow-inner">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <ShieldCheck className="w-6 h-6 mr-2 text-purple-700" /> Your Route via EWA
              </h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                For experienced electricians without a formal Level 3 qualification, the Electrotechnical Experienced
                Worker Assessment (EWA) is the most direct and efficient route to achieving the qualification needed for
                the ECS Gold Card.
              </p>
              <ul className="list-decimal list-inside text-gray-700 leading-relaxed space-y-3">
                <li>
                  **Achieve Level 3 EWA**: Successfully complete the EAL Electrotechnical Experienced Worker Assessment
                  (EWA) Level 3 with EWA Tracker Limited.
                </li>
                <li>
                  **AM2E Assessment**: Pass the AM2E (Achievement Measurement 2 for Experienced Workers) assessment,
                  which is a practical competence test specifically designed for experienced electricians.
                </li>
                <li>
                  **18th Edition Wiring Regulations & Testing Certificate**: Hold a current qualification in the 18th
                  Edition IET Wiring Regulations (BS 7671) AND either the Level 3 Award in Initial Verification of
                  Electrical Installations or the Inspection and Testing of Electrical Installations.
                </li>
                <li>
                  **ECS Application**: Apply for your ECS Gold Card with the Electrotechnical Certification Scheme,
                  providing evidence of your EWA, AM2, and 18th Edition qualifications.
                </li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                We guide you through the EWA process, ensuring you are well-prepared for all necessary steps to secure
                your Gold Card.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-blue-700 text-white rounded-xl shadow-lg p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold mb-6">Secure Your ECS Gold Card Today</h2>
          <p className="text-lg opacity-90 max-w-3xl mx-auto mb-8">
            Ready to elevate your professional status and gain the recognition you deserve? Contact EWA Tracker Limited
            to start your journey towards the ECS Gold Card.
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
