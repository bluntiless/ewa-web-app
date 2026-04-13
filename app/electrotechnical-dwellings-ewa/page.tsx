import type { Metadata } from "next"
import Link from "next/link"
import { Award, CheckCircle, ArrowRight, Home, FileText, Users } from "lucide-react"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"

export const metadata: Metadata = {
  title: "Electrotechnical in Dwellings EWA Qualification (610/2859/9) | EWA Tracker Ltd",
  description: "Achieve the EAL Level 3 Electrotechnical in Dwellings Experienced Worker Qualification (610/2859/9). Specialist domestic electrician route to ECS Gold Card.",
  keywords: [
    "Electrotechnical in Dwellings",
    "610/2859/9",
    "domestic electrician qualification",
    "EWA domestic",
    "AM2ED",
    "domestic ECS card",
  ],
  alternates: {
    canonical: "https://ewatracker.co.uk/electrotechnical-dwellings-ewa",
  },
  openGraph: {
    title: "Electrotechnical in Dwellings EWA Qualification (610/2859/9) | EWA Tracker Ltd",
    description: "Achieve the EAL Level 3 Electrotechnical in Dwellings Experienced Worker Qualification. Specialist domestic electrician route.",
    url: "https://ewatracker.co.uk/electrotechnical-dwellings-ewa",
  },
}

export default function ElectrotechnicalDwellingsPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <SiteHeader />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-700 to-green-900 text-white py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Home className="w-16 h-16 mx-auto mb-6 opacity-90" />
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 leading-tight">
            Electrotechnical in Dwellings Experienced Worker Qualification
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-6 opacity-90">
            The EAL Level 3 Electrotechnical in Dwellings qualification (610/2859/9) is the specialist route for domestic electricians seeking formal certification and ECS Gold Card eligibility.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          
          {/* Introduction */}
          <div className="prose prose-lg max-w-none mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">What is the Electrotechnical in Dwellings Qualification?</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              The EAL Level 3 Electrotechnical in Dwellings Experienced Worker Qualification (610/2859/9) is a nationally recognised qualification specifically designed for electricians whose work is focused on domestic and residential installations.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Unlike the full-scope <Link href="/eal-5982-experienced-worker" className="text-blue-600 hover:underline">EAL 5982 qualification</Link> which covers commercial and industrial work, this qualification is tailored for those who primarily work in houses, flats, and other dwelling environments. It covers domestic consumer units, rewires, extensions, alterations, and all aspects of electrical work within residential properties.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              This qualification is recognised for Part P compliance and provides a pathway to the ECS Gold Card through the AM2ED (Domestic) assessment. It&apos;s the ideal choice for domestic installation specialists, self-employed electricians focused on residential work, and those seeking Part P competent person scheme registration.
            </p>
          </div>

          {/* Comparison */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 md:p-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Dwellings vs Full Electrotechnical Qualification</h2>
            <p className="text-gray-700 mb-6">
              Not sure which qualification is right for you? Here&apos;s how they compare:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-300">
                    <th className="text-left py-3 px-2 font-semibold text-gray-900">Feature</th>
                    <th className="text-left py-3 px-2 font-semibold text-green-700">Dwellings (610/2859/9)</th>
                    <th className="text-left py-3 px-2 font-semibold text-blue-700">Full Scope (603/5982/1)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-2 text-gray-700">Work Scope</td>
                    <td className="py-3 px-2 text-gray-600">Domestic installations only</td>
                    <td className="py-3 px-2 text-gray-600">All sectors including commercial/industrial</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-2 text-gray-700">AM2 Assessment</td>
                    <td className="py-3 px-2 text-gray-600">AM2ED (Domestic)</td>
                    <td className="py-3 px-2 text-gray-600">AM2E (Full scope)</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-2 text-gray-700">ECS Card</td>
                    <td className="py-3 px-2 text-gray-600">Gold Card (Domestic)</td>
                    <td className="py-3 px-2 text-gray-600">Gold Card (Installation/Maintenance)</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-2 text-gray-700">Part P Eligible</td>
                    <td className="py-3 px-2 text-gray-600">Yes</td>
                    <td className="py-3 px-2 text-gray-600">Yes</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-2 text-gray-700">Best For</td>
                    <td className="py-3 px-2 text-gray-600">Domestic specialists</td>
                    <td className="py-3 px-2 text-gray-600">Multi-sector electricians</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Who It's For */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 md:p-8 mb-12">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-8 h-8 text-green-700" />
              <h2 className="text-2xl font-bold text-gray-900">Who Is This Qualification For?</h2>
            </div>
            <p className="text-gray-700 mb-4">
              The Electrotechnical in Dwellings qualification is ideal for:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                <span className="text-gray-700"><strong>Domestic Installation Specialists:</strong> Electricians who work exclusively or primarily in residential properties</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                <span className="text-gray-700"><strong>Self-Employed Domestic Electricians:</strong> Those running their own domestic electrical business</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                <span className="text-gray-700"><strong>Part P Scheme Applicants:</strong> Electricians seeking competent person scheme registration for notifiable work</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                <span className="text-gray-700"><strong>Renovation &amp; Extension Specialists:</strong> Those focused on domestic rewires, alterations, and new build housing</span>
              </li>
            </ul>
            <p className="text-gray-600 text-sm mt-4 italic">
              If you work across commercial, industrial, and domestic sectors, the <Link href="/eal-5982-experienced-worker" className="text-blue-600 hover:underline">full EAL 5982 qualification</Link> may be more suitable for your career goals.
            </p>
          </div>

          {/* Requirements */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-8 h-8 text-green-700" />
              <h2 className="text-2xl font-bold text-gray-900">Entry Requirements</h2>
            </div>
            <p className="text-gray-700 mb-4">
              To be eligible for the Electrotechnical in Dwellings qualification, you must meet the following criteria:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Prior Learning</h3>
                <p className="text-gray-600 text-sm">Level 2 Diploma in Electrical Installation or equivalent theory qualification</p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Industry Experience</h3>
                <p className="text-gray-600 text-sm">Minimum 3 years verifiable experience in domestic electrical installations</p>
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
              You must be able to provide portfolio evidence from domestic installation work, including photographs, certificates, and witness testimonies demonstrating your competence.
            </p>
          </div>

          {/* Coverage Areas */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What Does This Qualification Cover?</h2>
            <p className="text-gray-700 mb-6">
              The Electrotechnical in Dwellings qualification assesses competence across all aspects of domestic electrical work:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                <span className="text-gray-700">Full and partial domestic rewires</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                <span className="text-gray-700">Consumer unit upgrades and replacements</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                <span className="text-gray-700">New circuit installations</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                <span className="text-gray-700">Lighting installations and alterations</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                <span className="text-gray-700">Socket outlet additions and modifications</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                <span className="text-gray-700">Electric vehicle charging point installations</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                <span className="text-gray-700">Outdoor electrical installations</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                <span className="text-gray-700">Testing and inspection of domestic installations</span>
              </div>
            </div>
          </div>

          {/* ECS Gold Card */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 md:p-8 mb-12">
            <div className="flex items-center gap-3 mb-4">
              <Award className="w-8 h-8 text-amber-700" />
              <h2 className="text-2xl font-bold text-gray-900">Route to ECS Gold Card</h2>
            </div>
            <p className="text-gray-700 mb-4">
              Upon completing the Electrotechnical in Dwellings qualification, you become eligible to apply for the <Link href="/ecs-gold-card-experienced-worker" className="text-blue-600 hover:underline">ECS Gold Card</Link> through the AM2ED pathway.
            </p>
            <p className="text-gray-700 mb-4">
              The AM2ED is the domestic-focused practical end-test assessment delivered by National Electrotechnical Training (NET). It demonstrates your ability to safely complete domestic electrical installation work to industry standards.
            </p>
            <p className="text-gray-600 text-sm">
              For full details on the ECS Gold Card requirements and process, visit our <Link href="/ecs-gold-card-experienced-worker" className="text-blue-600 hover:underline">ECS Gold Card page</Link>.
            </p>
          </div>

          {/* CTA Section */}
          <div className="bg-green-700 text-white rounded-xl p-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Start Your Domestic Electrician Qualification</h2>
            <p className="text-lg mb-6 opacity-90">
              Take the first step towards formal qualification in domestic electrical work.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/skills-scan"
                className="bg-white text-green-700 px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Complete Skills Scan
              </Link>
              <a
                href="https://calendly.com/ewatracker-info/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-white text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-white hover:text-green-700 transition-colors"
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
                <ArrowRight className="w-4 h-4" /> EAL 5982 Full Scope
              </Link>
              <Link href="/ecs-gold-card-experienced-worker" className="inline-flex items-center gap-1 text-blue-600 hover:underline">
                <ArrowRight className="w-4 h-4" /> ECS Gold Card Route
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
