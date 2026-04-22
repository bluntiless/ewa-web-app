import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Lightbulb, Zap, CreditCard, FilePenLine, ChevronDown, CheckCircle, BookOpen, ClipboardCheck, FileEdit } from "lucide-react"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"

export const metadata: Metadata = {
  title: "Our Services",
  description:
    "EWA Tracker Ltd is an EAL approved centre delivering the Level 3 Electrotechnical Experienced Worker Qualification (603/5982/1). ECS Gold Card route available.",
  keywords: ["EWA", "ECS Gold Card", "electrical qualifications", "experienced worker assessment", "UK electrician", "Level 3", "EAL approved centre", "EAL 5982"],
  alternates: {
    canonical: "https://ewatracker.co.uk/services",
  },
  openGraph: {
    title: "Our Services - EWA Tracker Ltd",
    description:
      "EAL approved centre delivering the Level 3 Electrotechnical Experienced Worker Qualification and ECS Gold Card route.",
    url: "https://ewatracker.co.uk/services",
  },
}

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <SiteHeader />

      <main className="max-w-6xl mx-auto px-4 py-16 md:py-24">
        <section className="bg-white rounded-xl shadow-lg p-8 md:p-12 mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Comprehensive Electrotechnical Assessment Services
          </h1>
          <p className="text-lg text-gray-700 leading-relaxed mb-8 max-w-3xl mx-auto">
            EWA Tracker Ltd is an EAL approved centre specialising in the Experienced Worker Assessment route for experienced electricians seeking formal qualification.
          </p>
          <div className="flex justify-center mb-8 max-w-4xl mx-auto">
            <Link href="/eal-5982-experienced-worker" className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-md hover:border-blue-400 hover:shadow-md transition-all">
              <p className="font-semibold text-blue-900 text-lg">Level 3 Electrotechnical Experienced Worker Qualification</p>
              <p className="text-sm text-blue-700 mt-1">(603/5982/1) - Full scope Installation &amp; Maintenance</p>
              <p className="text-xs text-blue-600 mt-3 font-medium">Learn more about EAL 5982 &rarr;</p>
            </Link>
          </div>

          {/* Eligibility Requirements Dropdown */}
          <details className="group bg-amber-50 border border-amber-200 rounded-xl max-w-4xl mx-auto mb-8 text-left">
            <summary className="flex items-center justify-between cursor-pointer p-5 list-none">
              <div className="flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-amber-700" />
                <span className="text-lg font-semibold text-amber-900">Eligibility Requirements for EWA Route</span>
              </div>
              <ChevronDown className="w-5 h-5 text-amber-700 transition-transform group-open:rotate-180" />
            </summary>
            <div className="px-5 pb-5 pt-2 border-t border-amber-200">
              <p className="text-gray-700 mb-4">
                To be eligible for the Experienced Worker Assessment route, you should have completed relevant electrotechnical theory training, typically holding a <strong>Level 2 Diploma in Electrical Installation</strong>, followed by a minimum of <strong>5 years&apos; industry experience</strong> as a practicing electrician. This experience must be verifiable and auditable.
              </p>
              <p className="text-gray-700 mb-4">
                You must be able to provide sufficient evidence from site, supported where necessary by witness testimony, to demonstrate competence against the full qualification requirements.
              </p>
              <p className="text-gray-700 mb-4">
                You must also have an appropriate level of English to read, write, speak, and understand technical information.
              </p>
              
              <p className="text-gray-800 font-semibold mb-3">As part of the ECS Gold Card route, you will also need to achieve:</p>
              <ul className="space-y-2 mb-4">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">18th Edition Wiring Regulations (BS 7671)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Level 3 Initial Verification and Periodic Inspection &amp; Testing of Electrical Installations</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">AM2 Assessment (AM2E or AM2ED practical end-test)</span>
                </li>
              </ul>
              
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                <p className="text-amber-800 text-sm">
                  <strong>Please note:</strong> EWA Tracker Ltd does not deliver the 18th Edition, Inspection &amp; Testing, or AM2 assessments. These are provided by separate training providers and NET assessment centres. We can recommend approved providers during your consultation to help you complete these requirements.
                </p>
              </div>
              
              <p className="text-gray-700 italic">
                The most appropriate route and any additional requirements will be discussed with you during a no-obligation initial consultation.
              </p>
            </div>
          </details>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Link
              href="/ewa-assessment"
              className="group bg-blue-50 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center"
            >
              <Zap className="w-12 h-12 text-blue-700 mb-4 group-hover:scale-110 transition-transform" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">EWA Assessment</h2>
              <p className="text-gray-700 text-sm mb-4">
                The direct route for experienced electricians to achieve Level 3 qualification.
              </p>
              <span className="text-blue-700 font-semibold group-hover:underline">Learn More &rarr;</span>
            </Link>

            <Link
              href="/ecs-gold-card-route"
              className="group bg-blue-50 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center"
            >
              <CreditCard className="w-12 h-12 text-blue-700 mb-4 group-hover:scale-110 transition-transform" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">ECS Gold Card Route</h2>
              <p className="text-gray-700 text-sm mb-4">
                Understand how our qualifications lead to your ECS Gold Card.
              </p>
              <span className="text-blue-700 font-semibold group-hover:underline">Learn More &rarr;</span>
            </Link>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Start Your Assessment Journey</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-8 max-w-3xl mx-auto">
              Ready to take the first step? Complete your Skills Scan to help us understand your experience and guide you to the right qualification pathway.
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
              {/* Option 1: Preliminary Self-Check */}
              <div className="bg-white border-2 border-blue-200 rounded-xl p-6 text-left hover:border-blue-400 hover:shadow-lg transition-all">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded">Recommended First</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Preliminary Self-Check</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Complete an online self-assessment to get instant feedback on your suitability for the IE/ME EWA.
                </p>
                <ul className="text-sm text-gray-600 mb-4 space-y-1">
                  <li>• Instant suitability indication</li>
                  <li>• Identify knowledge gaps</li>
                  <li>• No document uploads</li>
                </ul>
                <Link
                  href="/candidate-check"
                  className="inline-flex items-center px-5 py-2 rounded-full text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  <FilePenLine className="w-4 h-4 mr-2" /> Start Self-Check
                </Link>
              </div>

              {/* Option 2: EWA Entry Test Mock */}
              <div className="bg-white border-2 border-purple-200 rounded-xl p-6 text-left hover:border-purple-400 hover:shadow-lg transition-all">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-2 py-1 rounded">Practice Test</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">EWA Entry Test Mock</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Practice with our 50-question mock assessment covering key electrotechnical topics.
                </p>
                <ul className="text-sm text-gray-600 mb-4 space-y-1">
                  <li>• 50 random questions</li>
                  <li>• 100-minute timed test</li>
                  <li>• Instant results &amp; feedback</li>
                </ul>
                <Link
                  href="/ewa-entry-test"
                  className="inline-flex items-center px-5 py-2 rounded-full text-sm font-semibold bg-purple-600 text-white hover:bg-purple-700 transition-colors"
                >
                  <ClipboardCheck className="w-4 h-4 mr-2" /> Start Mock Test
                </Link>
              </div>

              {/* Option 3: Official TESP Submission */}
              <div className="bg-white border-2 border-gray-200 rounded-xl p-6 text-left hover:border-blue-400 hover:shadow-lg transition-all">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-gray-100 text-gray-700 text-xs font-semibold px-2 py-1 rounded">Official Submission</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Submit TESP Skills Scan</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Download the official TESP Skills Scan PDF, complete it in Adobe Reader, and upload.
                </p>
                <ul className="text-sm text-gray-600 mb-4 space-y-1">
                  <li>• Official EWA document</li>
                  <li>• Fill in Adobe Reader</li>
                  <li>• Direct submission</li>
                </ul>
                <Link
                  href="/skills-scan"
                  className="inline-flex items-center px-5 py-2 rounded-full text-sm font-semibold bg-gray-800 text-white hover:bg-gray-900 transition-colors"
                >
                  <FilePenLine className="w-4 h-4 mr-2" /> Submit TESP
                </Link>
              </div>

              {/* Option 4: Candidate Background Form */}
              <div className="bg-white border-2 border-green-200 rounded-xl p-6 text-left hover:border-green-400 hover:shadow-lg transition-all">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded">Required Document</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Candidate Background Form</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Complete the Candidate Background form to provide your employment history and qualifications.
                </p>
                <ul className="text-sm text-gray-600 mb-4 space-y-1">
                  <li>• Employment history</li>
                  <li>• Qualification details</li>
                  <li>• Required for assessment</li>
                </ul>
                <Link
                  href="/candidate-background"
                  className="inline-flex items-center px-5 py-2 rounded-full text-sm font-semibold bg-green-600 text-white hover:bg-green-700 transition-colors"
                >
                  <FilePenLine className="w-4 h-4 mr-2" /> Complete Form
                </Link>
              </div>

              {/* Option 5: Course Booking Form */}
              <div className="bg-white border-2 border-orange-200 rounded-xl p-6 text-left hover:border-orange-400 hover:shadow-lg transition-all">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-orange-100 text-orange-700 text-xs font-semibold px-2 py-1 rounded">Course Booking</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Course Booking Form</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Register your interest in the EWA qualification programme with our online booking form.
                </p>
                <ul className="text-sm text-gray-600 mb-4 space-y-1">
                  <li>• Online registration</li>
                  <li>• Digital signature</li>
                  <li>• Instant submission</li>
                </ul>
                <Link
                  href="/course-booking"
                  className="inline-flex items-center px-5 py-2 rounded-full text-sm font-semibold bg-orange-600 text-white hover:bg-orange-700 transition-colors"
                >
                  <FileEdit className="w-4 h-4 mr-2" /> Book Course
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-blue-700 text-white rounded-xl shadow-lg p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Qualified?</h2>
          <p className="text-lg opacity-90 max-w-3xl mx-auto mb-8">
            Take the next step in your electrical career. Start your EWA journey today and achieve your Level 3 qualification.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center px-8 py-3 rounded-full text-lg font-semibold bg-white text-blue-700 hover:bg-gray-100 transition-colors shadow-lg"
          >
            <Lightbulb className="w-5 h-5 mr-2" /> Start Your EWA
          </Link>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
