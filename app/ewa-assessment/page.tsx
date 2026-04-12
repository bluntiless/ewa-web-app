import type { Metadata } from "next"
import { CheckCircle, Award, MapPin, HeadphonesIcon, Home } from "lucide-react"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn more about EWA Tracker Ltd, an EAL approved centre offering the Level 3 Electrotechnical Experienced Worker Qualification (603/5982/1) and the Electrotechnical in Dwellings route (610/2859/9).",
  alternates: {
    canonical: "https://ewatracker.co.uk/about",
  },
  openGraph: {
    title: "About Us - EWA Tracker Ltd",
    description:
      "EAL approved centre delivering both full-scope Electrotechnical EWA and the Electrotechnical in Dwellings route.",
    url: "https://ewatracker.co.uk/about",
  },
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <SiteHeader />

      <main>
        {/* Hero Section */}
        <section className="bg-white pt-10 pb-12 md:pt-14 md:pb-16">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-5 tracking-tight">
              About EWA Tracker Ltd
            </h1>

            <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-3">
              EWA Tracker Ltd is an EAL approved centre specialising in the{" "}
              <span className="font-medium text-gray-900">
                Level 3 Electrotechnical Experienced Worker Qualification (603/5982/1)
              </span>.
              We help experienced electricians convert real-world competence into formal
              recognition and progress towards the ECS Gold Card route.
            </p>

            {/* NEW ADDITION */}
            <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-3">
              We also offer the{" "}
              <span className="font-medium text-gray-900">
                Electrotechnical in Dwellings Experienced Worker Qualification (610/2859/9)
              </span>{" "}
              where appropriate, depending on the candidate’s occupational scope.
            </p>

            <p className="text-sm text-gray-400">
              Built for experienced electricians who want a clear, supported route to qualification.
            </p>
          </div>
        </section>

        {/* Cards Section (unchanged) */}
        <section className="py-10 md:py-12 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">

              <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 hover:border-gray-300 hover:shadow-sm transition-all">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-5">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">What We Do</h3>
                <p className="text-gray-500 leading-relaxed text-sm">
                  We assess experienced electricians against EAL requirements and support them through
                  portfolio completion and assessment.
                </p>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 hover:border-gray-300 hover:shadow-sm transition-all">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-5">
                  <Award className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Why Candidates Choose Us</h3>
                <p className="text-gray-500 leading-relaxed text-sm">
                  Clear guidance, practical assessor support, and a structured route to completion.
                </p>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 hover:border-gray-300 hover:shadow-sm transition-all">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-5">
                  <HeadphonesIcon className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">How We Work</h3>
                <p className="text-gray-500 leading-relaxed text-sm">
                  Real-site evidence, professional discussion, and efficient progress tracking.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* Trust Strip – UPDATED */}
        <section className="py-8 md:py-10 bg-white border-y border-gray-100">
          <div className="max-w-5xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">

              <div className="flex flex-col items-center text-center">
                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mb-3">
                  <Award className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-sm font-semibold text-gray-900">EAL Approved</span>
                <span className="text-xs text-gray-400 mt-0.5">Approved Centre</span>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center mb-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-sm font-semibold text-gray-900">603/5982/1</span>
                <span className="text-xs text-gray-400 mt-0.5">Main Qualification</span>
              </div>

              {/* NEW TILE */}
              <div className="flex flex-col items-center text-center">
                <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center mb-3">
                  <Home className="w-5 h-5 text-amber-600" />
                </div>
                <span className="text-sm font-semibold text-gray-900">610/2859/9</span>
                <span className="text-xs text-gray-400 mt-0.5">Dwellings Route</span>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center mb-3">
                  <MapPin className="w-5 h-5 text-purple-600" />
                </div>
                <span className="text-sm font-semibold text-gray-900">London Based</span>
                <span className="text-xs text-gray-400 mt-0.5">UK Coverage</span>
              </div>

            </div>
          </div>
        </section>

        {/* Rest unchanged */}