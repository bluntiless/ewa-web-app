import type { Metadata } from "next"
import Link from "next/link"
import { Award, CheckCircle, ArrowRight, MapPin, Users, Briefcase } from "lucide-react"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"

export const metadata: Metadata = {
  title: "EWA for Electricians UK | Experienced Worker Assessment | EWA Tracker Ltd",
  description: "Experienced Worker Assessment for UK electricians. Get qualified through the EWA route and achieve your ECS Gold Card. Available across London, South East and nationwide.",
  keywords: [
    "EWA electrician UK",
    "Experienced Worker Assessment",
    "electrician qualification UK",
    "EWA London",
    "EWA South East",
    "electrician ECS card",
  ],
  alternates: {
    canonical: "https://ewatracker.co.uk/ewa-electrician-uk",
  },
  openGraph: {
    title: "EWA for Electricians UK | Experienced Worker Assessment | EWA Tracker Ltd",
    description: "Experienced Worker Assessment for UK electricians. Get qualified through the EWA route and achieve your ECS Gold Card.",
    url: "https://ewatracker.co.uk/ewa-electrician-uk",
  },
}

export default function EWAElectricianUKPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <SiteHeader />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-700 to-blue-900 text-white py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 leading-tight">
            Experienced Worker Assessment for UK Electricians
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-6 opacity-90">
            The EWA route is designed for experienced electricians across the UK who need formal qualification. Whether you&apos;re in London, the South East, or anywhere in the country, we can help you achieve your Level 3 certification.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          
          {/* Introduction */}
          <div className="prose prose-lg max-w-none mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">What is the EWA Route?</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              The Experienced Worker Assessment (EWA) is a qualification pathway specifically designed for electricians who have gained their skills through practical experience rather than traditional apprenticeship routes. If you&apos;ve been working as an electrician for several years but lack formal qualifications, the EWA provides a structured way to achieve recognised certification.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Unlike traditional routes that require years of college attendance and on-the-job training as an apprentice, the EWA assesses your existing competence through portfolio evidence, professional discussion, and practical observation. This makes it ideal for time-served electricians, those who trained informally under experienced tradespeople, or professionals returning to the industry.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              The EWA leads to a nationally recognised Level 3 qualification that opens the door to <Link href="/ecs-gold-card-experienced-worker" className="text-blue-600 hover:underline">ECS Gold Card</Link> eligibility, better employment opportunities, and the ability to work on regulated projects that require qualified electricians.
            </p>
          </div>

          {/* Coverage Areas */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 md:p-8 mb-12">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="w-8 h-8 text-blue-700" />
              <h2 className="text-2xl font-bold text-gray-900">UK-Wide Coverage</h2>
            </div>
            <p className="text-gray-700 mb-4">
              EWA Tracker Ltd provides Experienced Worker Assessment services across the United Kingdom. While we are based in the South East, we support candidates nationwide through a combination of remote assessment and site visits.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white border border-blue-100 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">London &amp; South East</h3>
                <p className="text-gray-600 text-sm">Our primary coverage area with regular assessment availability and site visits.</p>
              </div>
              <div className="bg-white border border-blue-100 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Midlands &amp; North</h3>
                <p className="text-gray-600 text-sm">Remote portfolio assessment with arranged site visits for practical observation.</p>
              </div>
              <div className="bg-white border border-blue-100 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Scotland &amp; Wales</h3>
                <p className="text-gray-600 text-sm">Full support available with coordinated assessment scheduling.</p>
              </div>
            </div>
          </div>

          {/* Who It's For */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-8 h-8 text-blue-700" />
              <h2 className="text-2xl font-bold text-gray-900">Who Is the EWA Route For?</h2>
            </div>
            <p className="text-gray-700 mb-6">
              The Experienced Worker Assessment is suitable for a range of electricians across the UK:
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Time-Served Electricians</h3>
                  <p className="text-gray-600 text-sm">Professionals who learned their trade on the job under supervision but never completed formal qualifications.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Career Changers</h3>
                  <p className="text-gray-600 text-sm">Those who have transferred into electrical work from related trades and have built up practical experience.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Returning Professionals</h3>
                  <p className="text-gray-600 text-sm">Electricians returning to the industry who need to update or formalise their qualifications.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Overseas Qualified Electricians</h3>
                  <p className="text-gray-600 text-sm">Professionals with international experience seeking UK-recognised certification.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Qualification Routes */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <Briefcase className="w-8 h-8 text-blue-700" />
              <h2 className="text-2xl font-bold text-gray-900">Available Qualification Routes</h2>
            </div>
            <p className="text-gray-700 mb-6">
              Depending on your occupational scope and experience, there are two main EWA qualification routes available:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Full Electrotechnical Route</h3>
                <p className="text-gray-600 text-sm mb-4">
                  The <Link href="/eal-5982-experienced-worker" className="text-blue-600 hover:underline font-semibold">EAL Level 3 Electrotechnical Experienced Worker Qualification (603/5982/1)</Link> covers the full scope of Installation &amp; Maintenance work.
                </p>
                <p className="text-gray-700 text-sm mb-3"><strong>Best for:</strong></p>
                <ul className="text-gray-600 text-sm space-y-1">
                  <li>• Commercial and industrial electricians</li>
                  <li>• Those working across multiple sectors</li>
                  <li>• Electricians seeking maximum flexibility</li>
                </ul>
              </div>
              
            </div>
          </div>

          {/* Benefits */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 md:p-8 mb-12">
            <div className="flex items-center gap-3 mb-4">
              <Award className="w-8 h-8 text-amber-700" />
              <h2 className="text-2xl font-bold text-gray-900">Benefits of the EWA Route</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                <span className="text-gray-700">Nationally recognised Level 3 qualification</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                <span className="text-gray-700">Pathway to <Link href="/ecs-gold-card-experienced-worker" className="text-blue-600 hover:underline">ECS Gold Card</Link></span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                <span className="text-gray-700">No lengthy college attendance required</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                <span className="text-gray-700">Assessment based on existing competence</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                <span className="text-gray-700">Flexible scheduling around your work</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                <span className="text-gray-700">Access to better employment opportunities</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                <span className="text-gray-700">Site access for major construction projects</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                <span className="text-gray-700">Professional recognition across the industry</span>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-blue-700 text-white rounded-xl p-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Get Qualified?</h2>
            <p className="text-lg mb-6 opacity-90">
              Take the first step towards formal qualification. Complete our Skills Scan or book a free consultation to discuss your options.
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
              
              <Link href="/ecs-gold-card-experienced-worker" className="inline-flex items-center gap-1 text-blue-600 hover:underline">
                <ArrowRight className="w-4 h-4" /> ECS Gold Card Route
              </Link>
              <Link href="/ewa-cost" className="inline-flex items-center gap-1 text-blue-600 hover:underline">
                <ArrowRight className="w-4 h-4" /> EWA Costs
              </Link>
            </div>
          </div>

        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
