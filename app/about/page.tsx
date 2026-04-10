import type { Metadata } from "next"
import { CheckCircle, Award, MapPin, HeadphonesIcon } from "lucide-react"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn more about EWA Tracker Ltd, an EAL approved centre for the Level 3 Electrotechnical Experienced Worker Qualification (603/5982/1).",
  alternates: {
    canonical: "https://ewatracker.co.uk/about",
  },
  openGraph: {
    title: "About Us - EWA Tracker Ltd",
    description:
      "Learn more about EWA Tracker Ltd, an EAL approved centre delivering the full-scope EWA qualification.",
    url: "https://ewatracker.co.uk/about",
  },
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <SiteHeader />

      <main>
        {/* Hero Section */}
        <section className="bg-white pt-8 pb-14 md:pt-12 md:pb-20">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-5 tracking-tight">
              About EWA Tracker Ltd
            </h1>
            <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-4">
              EWA Tracker Ltd is an EAL approved centre specialising in the Level 3 Electrotechnical Experienced Worker 
              Qualification (603/5982/1). We help experienced electricians convert real-world competence into formal 
              recognition and progress towards the ECS Gold Card route.
            </p>
            <p className="text-sm text-gray-400">
              Built for experienced electricians who want a clear, supported route to qualification.
            </p>
          </div>
        </section>

        {/* Cards Section */}
        <section className="py-12 md:py-16 bg-gray-50 border-t border-gray-100">
          <div className="max-w-5xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Card 1 */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-6">
                <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">What We Do</h3>
                <p className="text-gray-500 leading-relaxed text-sm">
                  We assess experienced electricians against the requirements of the EAL Level 3 Experienced Worker 
                  Qualification and support them through portfolio completion.
                </p>
              </div>

              {/* Card 2 */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-6">
                <div className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center mb-4">
                  <Award className="w-4 h-4 text-green-600" />
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">Why Candidates Choose Us</h3>
                <p className="text-gray-500 leading-relaxed text-sm">
                  Candidates choose EWA Tracker Ltd for clear guidance, practical assessor support, and a 
                  structured route to completion.
                </p>
              </div>

              {/* Card 3 */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-6">
                <div className="w-9 h-9 bg-amber-50 rounded-lg flex items-center justify-center mb-4">
                  <HeadphonesIcon className="w-4 h-4 text-amber-600" />
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">How We Work</h3>
                <p className="text-gray-500 leading-relaxed text-sm">
                  Our process is straightforward, responsive, and built around real-site evidence, professional 
                  discussion, and efficient progress tracking.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Strip */}
        <section className="py-6 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">EAL Approved</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">603/5982/1</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">London Based</span>
              </div>
              <div className="flex items-center gap-2">
                <HeadphonesIcon className="w-4 h-4 text-purple-600" />
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Full Support</span>
              </div>
            </div>
          </div>
        </section>

        {/* Founder Section */}
        <section className="py-14 md:py-20 bg-gray-50 border-t border-gray-100">
          <div className="max-w-3xl mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-lg font-semibold text-white">WW</span>
                </div>
              </div>
              {/* Content */}
              <div className="text-center md:text-left">
                <h2 className="text-xl font-semibold text-gray-900 mb-1">Wayne Wright</h2>
                <p className="text-sm text-blue-600 font-medium mb-3">Founder & Lead Assessor</p>
                <p className="text-gray-500 leading-relaxed text-sm max-w-xl">
                  EWA Tracker Ltd is led by Wayne Wright, an experienced electrical assessor focused on helping 
                  experienced electricians achieve formal recognition through a clear and professionally managed 
                  assessment process.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 md:py-16 bg-blue-700">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <h2 className="text-xl md:text-2xl font-semibold text-white mb-3">Ready to Get Started?</h2>
            <p className="text-blue-100 text-sm mb-6 max-w-md mx-auto">
              Book a free consultation to discuss your experience and eligibility for the EWA qualification.
            </p>
            <a
              href="https://calendly.com/ewatracker-info/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 rounded-lg text-sm font-semibold bg-white text-blue-700 hover:bg-blue-50 hover:shadow-md transition-all duration-200"
            >
              Book Your EWA Assessment Call
            </a>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
