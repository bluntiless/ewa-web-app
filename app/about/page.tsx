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
        <section className="bg-gradient-to-b from-white to-gray-50 py-20 md:py-28">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
              About EWA Tracker Ltd
            </h1>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-6">
              EWA Tracker Ltd is an EAL approved centre specialising in the Level 3 Electrotechnical Experienced Worker 
              Qualification (603/5982/1). We help experienced electricians convert real-world competence into formal 
              recognition and progress towards the ECS Gold Card route.
            </p>
            <p className="text-base text-gray-500 font-medium">
              Built for experienced electricians who want a clear, supported route to qualification.
            </p>
          </div>
        </section>

        {/* Cards Section */}
        <section className="py-16 md:py-24 bg-stone-50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {/* Card 1 */}
              <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow p-8 flex flex-col h-full">
                <div className="w-11 h-11 bg-blue-100 rounded-lg flex items-center justify-center mb-5">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">What We Do</h3>
                <p className="text-gray-600 leading-relaxed text-sm flex-grow">
                  We assess experienced electricians against the requirements of the EAL Level 3 Experienced Worker 
                  Qualification and support them through portfolio completion.
                </p>
              </div>

              {/* Card 2 */}
              <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow p-8 flex flex-col h-full">
                <div className="w-11 h-11 bg-green-100 rounded-lg flex items-center justify-center mb-5">
                  <Award className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Why Candidates Choose Us</h3>
                <p className="text-gray-600 leading-relaxed text-sm flex-grow">
                  Candidates choose EWA Tracker Ltd for clear guidance, practical assessor support, and a 
                  structured route to completion.
                </p>
              </div>

              {/* Card 3 */}
              <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow p-8 flex flex-col h-full">
                <div className="w-11 h-11 bg-orange-100 rounded-lg flex items-center justify-center mb-5">
                  <HeadphonesIcon className="w-5 h-5 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">How We Work</h3>
                <p className="text-gray-600 leading-relaxed text-sm flex-grow">
                  Our process is straightforward, responsive, and built around real-site evidence, professional 
                  discussion, and efficient progress tracking.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Strip */}
        <section className="py-10 bg-white border-y border-gray-200">
          <div className="max-w-5xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              <div className="flex items-center gap-3 justify-center md:justify-start">
                <div className="w-9 h-9 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                  <Award className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">EAL Approved Centre</span>
              </div>
              <div className="flex items-center gap-3 justify-center md:justify-start">
                <div className="w-9 h-9 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">603/5982/1 Qualification</span>
              </div>
              <div className="flex items-center gap-3 justify-center md:justify-start">
                <div className="w-9 h-9 bg-orange-50 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-orange-600" />
                </div>
                <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">London Based</span>
              </div>
              <div className="flex items-center gap-3 justify-center md:justify-start">
                <div className="w-9 h-9 bg-purple-50 rounded-full flex items-center justify-center flex-shrink-0">
                  <HeadphonesIcon className="w-4 h-4 text-purple-600" />
                </div>
                <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Structured Candidate Support</span>
              </div>
            </div>
          </div>
        </section>

        {/* Founder Section */}
        <section className="py-16 md:py-24 bg-stone-50">
          <div className="max-w-5xl mx-auto px-4">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-5">
                {/* Avatar Side */}
                <div className="md:col-span-2 bg-gradient-to-br from-blue-600 to-blue-800 p-8 md:p-12 flex flex-col items-center justify-center text-center">
                  <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-6 ring-4 ring-white/30">
                    <span className="text-3xl font-bold text-white">WW</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">Wayne Wright</h3>
                  <p className="text-blue-200 text-sm font-medium">Founder & Lead Assessor</p>
                </div>
                {/* Content Side */}
                <div className="md:col-span-3 p-8 md:p-12 flex flex-col justify-center">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Led by Wayne Wright</h2>
                  <p className="text-gray-600 leading-relaxed">
                    EWA Tracker Ltd is led by Wayne Wright, an experienced electrical assessor focused on helping 
                    experienced electricians achieve formal recognition through a clear and professionally managed 
                    assessment process.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-20 bg-blue-700">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
            <p className="text-blue-100 mb-8 max-w-xl mx-auto">
              Book a free consultation to discuss your experience and eligibility for the EWA qualification.
            </p>
            <a
              href="https://calendly.com/ewatracker-info/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-8 py-4 rounded-full text-lg font-semibold bg-white text-blue-700 hover:bg-gray-100 transition-colors shadow-lg"
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
