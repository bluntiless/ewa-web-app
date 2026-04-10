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
        <section className="py-10 md:py-14 bg-gray-50/50">
          <div className="max-w-4xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg border border-gray-100/80 p-5 hover:border-gray-200 transition-colors">
                <div className="w-8 h-8 bg-blue-50 rounded-md flex items-center justify-center mb-3">
                  <CheckCircle className="w-3.5 h-3.5 text-blue-600" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1.5">What We Do</h3>
                <p className="text-gray-400 leading-relaxed text-xs">
                  We assess experienced electricians against the requirements of the EAL Level 3 Experienced Worker 
                  Qualification and support them through portfolio completion.
                </p>
              </div>

              <div className="bg-white rounded-lg border border-gray-100/80 p-5 hover:border-gray-200 transition-colors">
                <div className="w-8 h-8 bg-emerald-50 rounded-md flex items-center justify-center mb-3">
                  <Award className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1.5">Why Candidates Choose Us</h3>
                <p className="text-gray-400 leading-relaxed text-xs">
                  Candidates choose EWA Tracker Ltd for clear guidance, practical assessor support, and a 
                  structured route to completion.
                </p>
              </div>

              <div className="bg-white rounded-lg border border-gray-100/80 p-5 hover:border-gray-200 transition-colors">
                <div className="w-8 h-8 bg-amber-50 rounded-md flex items-center justify-center mb-3">
                  <HeadphonesIcon className="w-3.5 h-3.5 text-amber-600" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1.5">How We Work</h3>
                <p className="text-gray-400 leading-relaxed text-xs">
                  Our process is straightforward, responsive, and built around real-site evidence, professional 
                  discussion, and efficient progress tracking.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Strip */}
        <section className="py-5 bg-white border-y border-gray-50">
          <div className="max-w-3xl mx-auto px-4">
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              <div className="flex items-center gap-1.5">
                <Award className="w-3 h-3 text-gray-400" />
                <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">EAL Approved</span>
              </div>
              <span className="text-gray-200">|</span>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-3 h-3 text-gray-400" />
                <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">603/5982/1</span>
              </div>
              <span className="text-gray-200">|</span>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-gray-400" />
                <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">London</span>
              </div>
              <span className="text-gray-200">|</span>
              <div className="flex items-center gap-1.5">
                <HeadphonesIcon className="w-3 h-3 text-gray-400" />
                <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Full Support</span>
              </div>
            </div>
          </div>
        </section>

        {/* Founder Section */}
        <section className="py-12 md:py-16 bg-gray-50/50">
          <div className="max-w-2xl mx-auto px-4">
            <div className="flex items-start gap-5">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center shadow-sm">
                  <span className="text-sm font-medium text-white">WW</span>
                </div>
              </div>
              <div>
                <h2 className="text-base font-semibold text-gray-900">Wayne Wright</h2>
                <p className="text-xs text-blue-600 font-medium mb-2">Founder & Lead Assessor</p>
                <p className="text-gray-400 leading-relaxed text-xs">
                  EWA Tracker Ltd is led by Wayne Wright, an experienced electrical assessor focused on helping 
                  experienced electricians achieve formal recognition through a clear and professionally managed 
                  assessment process.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-10 md:py-14 bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="max-w-xl mx-auto px-4 text-center">
            <h2 className="text-lg md:text-xl font-semibold text-white mb-2">Ready to Get Started?</h2>
            <p className="text-blue-100/80 text-sm mb-5">
              Book a free consultation to discuss your eligibility.
            </p>
            <a
              href="https://calendly.com/ewatracker-info/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-5 py-2.5 rounded-md text-xs font-semibold bg-white text-blue-700 hover:bg-blue-50 shadow-sm hover:shadow transition-all duration-150"
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
