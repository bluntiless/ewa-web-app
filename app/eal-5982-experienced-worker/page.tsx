import type { Metadata } from "next"
import Link from "next/link"
import { Award, CheckCircle, ArrowRight, FileText, Users, Clock } from "lucide-react"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"

export const metadata: Metadata = {
  title: "EAL 5982 Experienced Worker Qualification | EWA Tracker Ltd",
  description: "Achieve your EAL Level 3 Electrotechnical Experienced Worker Qualification (603/5982/1). Fast-track route to ECS Gold Card for experienced UK electricians.",
  keywords: [
    "EAL 5982",
    "EAL 603/5982/1",
    "Experienced Worker Qualification",
    "Level 3 Electrotechnical",
    "ECS Gold Card",
    "electrician qualification UK",
  ],
  alternates: {
    canonical: "https://ewatracker.co.uk/eal-5982-experienced-worker",
  },
  openGraph: {
    title: "EAL 5982 Experienced Worker Qualification | EWA Tracker Ltd",
    description: "Achieve your EAL Level 3 Electrotechnical Experienced Worker Qualification (603/5982/1). Fast-track route to ECS Gold Card.",
    url: "https://ewatracker.co.uk/eal-5982-experienced-worker",
  },
}

export default function EAL5982Page() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <SiteHeader />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-700 to-blue-900 text-white py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 leading-tight">
            EAL 5982 Experienced Worker Qualification
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-6 opacity-90">
            The EAL Level 3 Electrotechnical Experienced Worker Qualification (603/5982/1) is the industry-recognised route for experienced electricians to gain formal certification and access the ECS Gold Card.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          
          {/* Introduction */}
          <div className="prose prose-lg max-w-none mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">What is the EAL 5982 Qualification?</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              The EAL Level 3 Electrotechnical Experienced Worker Qualification, commonly referred to by its qualification number 603/5982/1 or simply "EAL 5982", is a nationally recognised qualification designed specifically for electricians who have been working in the industry but lack formal certification.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Unlike traditional apprenticeship routes that require years of college attendance, the Experienced Worker Assessment (EWA) route allows you to demonstrate your existing competence through portfolio evidence and practical assessment. This makes it the ideal pathway for time-served electricians, career changers with industry experience, or those returning to the trade.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              At EWA Tracker Ltd, we are an EAL approved centre specialising in delivering this qualification. We guide candidates through the entire process, from initial skills scan to final certification, ensuring you achieve your qualification efficiently and professionally.
            </p>
          </div>

          {/* Who Is It For */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 md:p-8 mb-12">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-8 h-8 text-blue-700" />
              <h2 className="text-2xl font-bold text-gray-900">Who Is This Qualification For?</h2>
            </div>
            <p className="text-gray-700 mb-4">
              The EAL 5982 Experienced Worker Qualification is designed for electricians who meet the following criteria:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                <span className="text-gray-700"><strong>Minimum 5 years&apos; industry experience</strong> as a practicing electrician with verifiable work history</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                <span className="text-gray-700"><strong>Level 2 Diploma in Electrical Installation</strong> or equivalent electrotechnical theory training</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                <span className="text-gray-700"><strong>Working across commercial and industrial installations</strong>, not limited to domestic work</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                <span className="text-gray-700"><strong>Able to provide portfolio evidence</strong> of work including photographs, certificates, and witness testimonies</span>
              </li>
            </ul>
            <p className="text-gray-600 text-sm mt-4 italic">
              If your experience is primarily in domestic installations, the <Link href="/electrotechnical-dwellings-ewa" className="text-blue-600 hover:underline">Electrotechnical in Dwellings qualification (610/2859/9)</Link> may be more suitable.
            </p>
          </div>

          {/* Requirements */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-8 h-8 text-blue-700" />
              <h2 className="text-2xl font-bold text-gray-900">Entry Requirements</h2>
            </div>
            <p className="text-gray-700 mb-4">
              To be eligible for the EAL 5982 Experienced Worker Qualification, you must meet the following requirements:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Prior Learning</h3>
                <p className="text-gray-600 text-sm">Level 2 Diploma in Electrical Installation or equivalent theory qualification</p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Industry Experience</h3>
                <p className="text-gray-600 text-sm">Minimum 5 years verifiable experience as a practicing electrician</p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">18th Edition</h3>
                <p className="text-gray-600 text-sm">BS 7671 Wiring Regulations certificate (can be achieved during the programme)</p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Inspection &amp; Testing</h3>
                <p className="text-gray-600 text-sm">Level 3 Initial Verification and Periodic Inspection &amp; Testing qualification</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm mt-4">
              Additionally, you must have an appropriate level of English to read, write, speak, and understand technical information. For those seeking an <Link href="/ecs-gold-card-experienced-worker" className="text-blue-600 hover:underline">ECS Gold Card</Link>, the AM2E assessment will also be required.
            </p>
          </div>

          {/* Process */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Clock className="w-8 h-8 text-blue-700" />
              <h2 className="text-2xl font-bold text-gray-900">The Assessment Process</h2>
            </div>
            <p className="text-gray-700 mb-6">
              Our streamlined process is designed to assess your existing competence without unnecessary delays. Here&apos;s what to expect:
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-4 bg-white border border-gray-200 rounded-lg p-4">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">1</span>
                <div>
                  <h3 className="font-semibold text-gray-900">Initial Skills Scan</h3>
                  <p className="text-gray-600 text-sm">Complete our online <Link href="/skills-scan" className="text-blue-600 hover:underline">TESP Skills Scan</Link> to assess your current knowledge and experience levels. This helps us understand your suitability for the EWA route.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 bg-white border border-gray-200 rounded-lg p-4">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">2</span>
                <div>
                  <h3 className="font-semibold text-gray-900">Consultation Call</h3>
                  <p className="text-gray-600 text-sm">Book a no-obligation consultation to discuss your experience, review your qualifications, and determine the best pathway for your situation.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 bg-white border border-gray-200 rounded-lg p-4">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">3</span>
                <div>
                  <h3 className="font-semibold text-gray-900">Portfolio Development</h3>
                  <p className="text-gray-600 text-sm">Build your evidence portfolio with photographs, certificates, job sheets, and witness testimonies demonstrating your competence across all required units.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 bg-white border border-gray-200 rounded-lg p-4">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">4</span>
                <div>
                  <h3 className="font-semibold text-gray-900">Professional Discussion</h3>
                  <p className="text-gray-600 text-sm">Participate in a professional discussion with our qualified assessors to demonstrate your underpinning knowledge and understanding.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 bg-white border border-gray-200 rounded-lg p-4">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">5</span>
                <div>
                  <h3 className="font-semibold text-gray-900">Practical Assessment</h3>
                  <p className="text-gray-600 text-sm">Complete workplace observations where assessors verify your practical competence on live installations.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 bg-white border border-gray-200 rounded-lg p-4">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">6</span>
                <div>
                  <h3 className="font-semibold text-gray-900">Certification</h3>
                  <p className="text-gray-600 text-sm">Upon successful completion, receive your EAL Level 3 certificate and become eligible for ECS Gold Card application.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Costs */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 md:p-8 mb-12">
            <div className="flex items-center gap-3 mb-4">
              <Award className="w-8 h-8 text-amber-700" />
              <h2 className="text-2xl font-bold text-gray-900">Costs &amp; Investment</h2>
            </div>
            <p className="text-gray-700 mb-4">
              The total cost of achieving your EAL 5982 qualification includes EAL registration fees and centre assessment costs. During your initial consultation, we will provide a full breakdown based on your individual circumstances.
            </p>
            <p className="text-gray-700 mb-4">
              EAL registration is currently £224 for new registrations. Additional costs may include 18th Edition certification and Inspection &amp; Testing qualifications if not already held.
            </p>
            <p className="text-gray-600 text-sm italic">
              For detailed pricing information, please visit our <Link href="/ewa-cost" className="text-blue-600 hover:underline">EWA costs page</Link> or book a consultation.
            </p>
          </div>

          {/* CTA Section */}
          <div className="bg-blue-700 text-white rounded-xl p-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-lg mb-6 opacity-90">
              Take the first step towards your EAL 5982 qualification and ECS Gold Card today.
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
              <Link href="/ecs-gold-card-experienced-worker" className="inline-flex items-center gap-1 text-blue-600 hover:underline">
                <ArrowRight className="w-4 h-4" /> ECS Gold Card Route
              </Link>
              <Link href="/electrotechnical-dwellings-ewa" className="inline-flex items-center gap-1 text-blue-600 hover:underline">
                <ArrowRight className="w-4 h-4" /> Electrotechnical in Dwellings
              </Link>
              <Link href="/ewa-electrician-uk" className="inline-flex items-center gap-1 text-blue-600 hover:underline">
                <ArrowRight className="w-4 h-4" /> EWA for UK Electricians
              </Link>
              <Link href="/services" className="inline-flex items-center gap-1 text-blue-600 hover:underline">
                <ArrowRight className="w-4 h-4" /> All Services
              </Link>
            </div>
          </div>

        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
