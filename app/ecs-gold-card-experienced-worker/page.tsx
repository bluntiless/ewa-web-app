import type { Metadata } from "next"
import Link from "next/link"
import { Award, CheckCircle, ArrowRight, CreditCard, Zap, Shield } from "lucide-react"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"

export const metadata: Metadata = {
  title: "ECS Gold Card Experienced Worker Route | EWA Tracker Ltd",
  description: "Achieve your ECS Gold Card through the Experienced Worker route. Complete your EAL Level 3 qualification and AM2 assessment with EWA Tracker Ltd.",
  keywords: [
    "ECS Gold Card",
    "Experienced Worker",
    "ECS card electrician",
    "AM2 assessment",
    "AM2E",
    "Gold Card route",
    "JIB Gold Card",
  ],
  alternates: {
    canonical: "https://ewatracker.co.uk/ecs-gold-card-experienced-worker",
  },
  openGraph: {
    title: "ECS Gold Card Experienced Worker Route | EWA Tracker Ltd",
    description: "Achieve your ECS Gold Card through the Experienced Worker route. Complete your EAL Level 3 qualification and AM2 assessment.",
    url: "https://ewatracker.co.uk/ecs-gold-card-experienced-worker",
  },
}

export default function ECSGoldCardPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <SiteHeader />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-amber-600 to-amber-800 text-white py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <CreditCard className="w-16 h-16 mx-auto mb-6 opacity-90" />
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 leading-tight">
            ECS Gold Card Experienced Worker Route
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-6 opacity-90">
            The ECS Gold Card is the industry-standard proof of competence for Installation Electricians and Maintenance Electricians. Achieve yours through the Experienced Worker Assessment route.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          
          {/* Introduction */}
          <div className="prose prose-lg max-w-none mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">What is the ECS Gold Card?</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              The Electrotechnical Certification Scheme (ECS) Gold Card is the recognised proof of competence for qualified electricians in the UK. Managed by the JIB (Joint Industry Board), the ECS card system provides verification that an individual holds the required qualifications and competence for their occupational role.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              The Gold Card is specifically for Installation Electricians and Maintenance Electricians who have achieved their Level 3 qualification. It demonstrates to employers, clients, and site managers that you are a fully qualified professional capable of working unsupervised on electrical installations.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              For experienced electricians who have been working in the trade without formal qualifications, the Experienced Worker Assessment (EWA) route provides a pathway to achieve the necessary Level 3 qualification and subsequently apply for the ECS Gold Card.
            </p>
          </div>

          {/* Why You Need It */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 md:p-8 mb-12">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-8 h-8 text-amber-700" />
              <h2 className="text-2xl font-bold text-gray-900">Why Do You Need an ECS Gold Card?</h2>
            </div>
            <p className="text-gray-700 mb-4">
              The ECS Gold Card is increasingly required for access to construction sites and electrical contracts. Here&apos;s why it matters:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                <span className="text-gray-700"><strong>Site Access:</strong> Many major construction sites require ECS cards for entry, particularly on commercial and industrial projects</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                <span className="text-gray-700"><strong>Contract Requirements:</strong> Principal contractors often specify ECS Gold Card holders for electrical work</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                <span className="text-gray-700"><strong>Professional Recognition:</strong> Demonstrates your competence to clients and employers</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                <span className="text-gray-700"><strong>Career Progression:</strong> Opens doors to better paid positions and more complex projects</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                <span className="text-gray-700"><strong>CSCS Recognition:</strong> The ECS card is part of the CSCS family and recognised across the construction industry</span>
              </li>
            </ul>
          </div>

          {/* Requirements */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <Award className="w-8 h-8 text-blue-700" />
              <h2 className="text-2xl font-bold text-gray-900">Requirements for ECS Gold Card</h2>
            </div>
            <p className="text-gray-700 mb-6">
              To obtain an ECS Gold Card through the Experienced Worker route, you must achieve the following:
            </p>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Level 3 EWA Qualification</h3>
                <p className="text-gray-600 text-sm">The <Link href="/eal-5982-experienced-worker" className="text-blue-600 hover:underline">EAL 5982 (603/5982/1)</Link> Experienced Worker Qualification</p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">AM2 Assessment</h3>
                <p className="text-gray-600 text-sm">AM2E for Installation Electricians or AM2ED for Domestic Electricians, delivered by NET</p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">18th Edition (BS 7671)</h3>
                <p className="text-gray-600 text-sm">Current edition Wiring Regulations certificate</p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Inspection &amp; Testing</h3>
                <p className="text-gray-600 text-sm">Level 3 Initial Verification and Periodic Inspection &amp; Testing qualification</p>
              </div>
            </div>
          </div>

          {/* AM2 Explanation */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 md:p-8 mb-12">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="w-8 h-8 text-blue-700" />
              <h2 className="text-2xl font-bold text-gray-900">Understanding the AM2 Assessment</h2>
            </div>
            <p className="text-gray-700 mb-4">
              The AM2 is a practical end-test assessment delivered by National Electrotechnical Training (NET). It demonstrates your ability to safely complete electrical installation work to industry standards.
            </p>
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">AM2E (Installation Electrician)</h3>
                <p className="text-gray-600 text-sm mb-2">
                  For those qualifying through the full <Link href="/eal-5982-experienced-worker" className="text-blue-600 hover:underline">EAL 5982 route</Link>. Covers commercial and industrial installation competence.
                </p>
                <p className="text-gray-500 text-xs">Duration: 1 day practical assessment</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">AM2ED (Domestic Electrician)</h3>
                <p className="text-gray-600 text-sm mb-2">
                  For those working primarily in domestic installations. Covers domestic installation competence.
                </p>
                <p className="text-gray-500 text-xs">Duration: 1 day practical assessment</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm mt-4 italic">
              The AM2 is booked separately through NET assessment centres. We can advise on timing and preparation during your consultation.
            </p>
          </div>

          {/* The Route */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">The Experienced Worker Route to ECS Gold Card</h2>
            <p className="text-gray-700 mb-6">
              Follow this pathway to achieve your ECS Gold Card through the Experienced Worker Assessment:
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-4 bg-white border-l-4 border-blue-600 shadow-sm p-4">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">1</span>
                <div>
                  <h3 className="font-semibold text-gray-900">Complete Skills Scan</h3>
                  <p className="text-gray-600 text-sm">Start with our <Link href="/skills-scan" className="text-blue-600 hover:underline">TESP Skills Scan</Link> to assess your current competence and eligibility for the EWA route.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 bg-white border-l-4 border-blue-600 shadow-sm p-4">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">2</span>
                <div>
                  <h3 className="font-semibold text-gray-900">Achieve Level 3 Qualification</h3>
                  <p className="text-gray-600 text-sm">Complete the <Link href="/eal-5982-experienced-worker" className="text-blue-600 hover:underline">EAL 5982</Link> qualification through portfolio and assessment.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 bg-white border-l-4 border-blue-600 shadow-sm p-4">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">3</span>
                <div>
                  <h3 className="font-semibold text-gray-900">Obtain Supporting Qualifications</h3>
                  <p className="text-gray-600 text-sm">Ensure you hold 18th Edition (BS 7671) and Level 3 Inspection &amp; Testing certificates.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 bg-white border-l-4 border-blue-600 shadow-sm p-4">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">4</span>
                <div>
                  <h3 className="font-semibold text-gray-900">Pass AM2 Assessment</h3>
                  <p className="text-gray-600 text-sm">Book and complete the appropriate AM2 assessment (AM2E or AM2ED) at a NET assessment centre.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 bg-white border-l-4 border-amber-500 shadow-sm p-4">
                <span className="flex-shrink-0 w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center font-bold text-sm">5</span>
                <div>
                  <h3 className="font-semibold text-gray-900">Apply for ECS Gold Card</h3>
                  <p className="text-gray-600 text-sm">With all qualifications complete, apply for your ECS Gold Card through the JIB portal.</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-amber-600 text-white rounded-xl p-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Start Your ECS Gold Card Journey</h2>
            <p className="text-lg mb-6 opacity-90">
              Book a free consultation to discuss your pathway to the ECS Gold Card.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/skills-scan"
                className="bg-white text-amber-700 px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Complete Skills Scan
              </Link>
              <a
                href="https://calendly.com/ewatracker-info/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-white text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-white hover:text-amber-700 transition-colors"
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
              
              <Link href="/ewa-cost" className="inline-flex items-center gap-1 text-blue-600 hover:underline">
                <ArrowRight className="w-4 h-4" /> EWA Costs
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
