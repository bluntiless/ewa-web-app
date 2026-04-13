import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, PoundSterling, CheckCircle, Info, Calculator } from "lucide-react"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"

export const metadata: Metadata = {
  title: "EWA Cost | Experienced Worker Assessment Pricing | EWA Tracker Ltd",
  description: "Find out the costs of Experienced Worker Assessment (EWA) qualifications. EAL registration fees, assessment costs, and what's included in the EWA route.",
  keywords: [
    "EWA cost",
    "Experienced Worker Assessment price",
    "EAL registration fee",
    "electrician qualification cost",
    "ECS Gold Card cost",
    "EWA pricing",
  ],
  alternates: {
    canonical: "https://ewatracker.co.uk/ewa-cost",
  },
  openGraph: {
    title: "EWA Cost | Experienced Worker Assessment Pricing | EWA Tracker Ltd",
    description: "Find out the costs of Experienced Worker Assessment (EWA) qualifications. EAL registration fees and assessment costs.",
    url: "https://ewatracker.co.uk/ewa-cost",
  },
}

export default function EWACostPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <SiteHeader />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-700 to-blue-900 text-white py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <PoundSterling className="w-16 h-16 mx-auto mb-6 opacity-90" />
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 leading-tight">
            EWA Cost &amp; Pricing Guide
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-6 opacity-90">
            Understand the full costs involved in achieving your Experienced Worker Assessment qualification and ECS Gold Card.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          
          {/* Introduction */}
          <div className="prose prose-lg max-w-none mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Understanding EWA Costs</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              The total cost of achieving your Experienced Worker Assessment qualification depends on several factors, including which qualification route you choose, what supporting qualifications you already hold, and the complexity of your assessment needs.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              This page provides a transparent breakdown of the costs involved so you can plan your investment effectively. All pricing is subject to change by the awarding body and should be confirmed during your initial consultation.
            </p>
          </div>

          {/* EAL Registration Fees */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 md:p-8 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Calculator className="w-8 h-8 text-blue-700" />
              <h2 className="text-2xl font-bold text-gray-900">EAL Registration Fees</h2>
            </div>
            <p className="text-gray-700 mb-6">
              EAL (Excellence, Achievement &amp; Learning) is the awarding body for the Experienced Worker qualifications. Registration fees are set by EAL and are payable directly to them through approved centres.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white border border-blue-100 rounded-lg p-5">
                <h3 className="font-semibold text-gray-900 mb-2">New Registration</h3>
                <p className="text-3xl font-bold text-blue-700 mb-2">£224</p>
                <p className="text-gray-600 text-sm">For candidates registering for the first time with EAL</p>
              </div>
              <div className="bg-white border border-blue-100 rounded-lg p-5">
                <h3 className="font-semibold text-gray-900 mb-2">Transfer Registration</h3>
                <p className="text-3xl font-bold text-blue-700 mb-2">£15</p>
                <p className="text-gray-600 text-sm">For candidates transferring from another EAL approved centre</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm mt-4 italic">
              Registration fees are subject to change by EAL. Current pricing confirmed as of 2024.
            </p>
          </div>

          {/* Assessment Costs */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Assessment &amp; Centre Costs</h2>
            <p className="text-gray-700 mb-6">
              In addition to EAL registration, centre assessment costs cover the following services:
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Initial Skills Scan &amp; Consultation</h3>
                  <p className="text-gray-600 text-sm">Assessment of your eligibility and development of your qualification pathway</p>
                </div>
              </div>
              <div className="flex items-start gap-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Portfolio Development Support</h3>
                  <p className="text-gray-600 text-sm">Guidance on evidence requirements and portfolio building</p>
                </div>
              </div>
              <div className="flex items-start gap-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Professional Discussion Sessions</h3>
                  <p className="text-gray-600 text-sm">Assessment of underpinning knowledge through structured discussion</p>
                </div>
              </div>
              <div className="flex items-start gap-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Practical Workplace Observation</h3>
                  <p className="text-gray-600 text-sm">On-site assessment of your practical competence</p>
                </div>
              </div>
              <div className="flex items-start gap-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Internal Quality Assurance</h3>
                  <p className="text-gray-600 text-sm">Review and verification of assessment decisions</p>
                </div>
              </div>
              <div className="flex items-start gap-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Certification Processing</h3>
                  <p className="text-gray-600 text-sm">Completion and submission of certification to EAL</p>
                </div>
              </div>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-6">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
                <p className="text-amber-800 text-sm">
                  <strong>Personalised Pricing:</strong> Centre assessment costs vary based on the complexity of your assessment needs, location, and qualification route. During your free consultation, we will provide a full breakdown of costs specific to your situation.
                </p>
              </div>
            </div>
          </div>

          {/* Additional Qualifications */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 md:p-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Additional Qualification Costs</h2>
            <p className="text-gray-700 mb-6">
              To complete the EWA route and obtain your <Link href="/ecs-gold-card-experienced-worker" className="text-blue-600 hover:underline">ECS Gold Card</Link>, you may also need to achieve the following qualifications if you don&apos;t already hold them:
            </p>
            <div className="space-y-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div>
                  <h3 className="font-semibold text-gray-900">18th Edition (BS 7671)</h3>
                  <p className="text-gray-600 text-sm">Wiring Regulations certificate - required for all candidates</p>
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div>
                  <h3 className="font-semibold text-gray-900">Level 3 Inspection &amp; Testing</h3>
                  <p className="text-gray-600 text-sm">Initial Verification and Periodic Inspection &amp; Testing qualification</p>
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div>
                  <h3 className="font-semibold text-gray-900">AM2 Assessment</h3>
                  <p className="text-gray-600 text-sm">AM2E or AM2ED practical end-test (for ECS Gold Card)</p>
                </div>
              </div>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
              <p className="text-amber-800 text-sm">
                <strong>Please note:</strong> EWA Tracker Ltd does not deliver the 18th Edition, Inspection &amp; Testing, or AM2 assessments. These qualifications are provided by separate training providers and NET assessment centres. We can recommend approved providers during your consultation.
              </p>
            </div>
          </div>

          {/* What's Included */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What&apos;s Included in Your EWA Journey</h2>
            <p className="text-gray-700 mb-6">
              When you undertake your EWA with EWA Tracker Ltd, you receive comprehensive support throughout your qualification:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                <span className="text-gray-700">Free initial skills scan assessment</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                <span className="text-gray-700">No-obligation consultation call</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                <span className="text-gray-700">Personalised assessment plan</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                <span className="text-gray-700">Portfolio development guidance</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                <span className="text-gray-700">Flexible assessment scheduling</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                <span className="text-gray-700">Qualified and experienced assessors</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                <span className="text-gray-700">Ongoing support throughout</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                <span className="text-gray-700">ECS Gold Card application guidance</span>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-blue-700 text-white rounded-xl p-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Get Your Personalised Quote</h2>
            <p className="text-lg mb-6 opacity-90">
              Book a free consultation to receive a full cost breakdown based on your individual circumstances.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/skills-scan"
                className="bg-white text-blue-700 px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Complete Skills Scan
              </Link>
              <a
                href="https://calendly.com/ewatracker-info/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-white text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-white hover:text-blue-700 transition-colors"
              >
                Book Free Consultation
              </a>
            </div>
          </div>

          {/* Internal Links */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Pages</h3>
            <div className="flex flex-wrap gap-3">
              <Link href="/eal-5982-experienced-worker" className="inline-flex items-center gap-1 text-blue-600 hover:underline">
                <ArrowRight className="w-4 h-4" /> EAL 5982 Qualification
              </Link>
              <Link href="/electrotechnical-dwellings-ewa" className="inline-flex items-center gap-1 text-blue-600 hover:underline">
                <ArrowRight className="w-4 h-4" /> Electrotechnical in Dwellings
              </Link>
              <Link href="/ecs-gold-card-experienced-worker" className="inline-flex items-center gap-1 text-blue-600 hover:underline">
                <ArrowRight className="w-4 h-4" /> ECS Gold Card Route
              </Link>
              <Link href="/ewa-electrician-uk" className="inline-flex items-center gap-1 text-blue-600 hover:underline">
                <ArrowRight className="w-4 h-4" /> EWA for UK Electricians
              </Link>
            </div>
          </div>

        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
