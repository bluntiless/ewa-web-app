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
        <section className="bg-white py-20 md:py-28">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              About EWA Tracker Ltd
            </h1>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-4 max-w-3xl mx-auto">
              EWA Tracker Ltd is an EAL approved centre specialising in the Level 3 Electrotechnical Experienced Worker 
              Qualification (603/5982/1). We help experienced electricians turn real-world competence into formal 
              recognition and progress towards the ECS Gold Card route.
            </p>
            <p className="text-base text-gray-500 italic">
              Built for experienced electricians who want a clear, supported route to qualification.
            </p>
          </div>
        </section>

        {/* Cards Section */}
        <section className="py-16 md:py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Card 1 */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
                  <span className="text-2xl font-bold text-blue-600">01</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">What We Do</h3>
                <p className="text-gray-600 leading-relaxed">
                  Assessment, portfolio support, evidence review, and guidance for experienced electricians 
                  completing the EWA route.
                </p>
              </div>

              {/* Card 2 */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
                  <span className="text-2xl font-bold text-blue-600">02</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Why Candidates Choose Us</h3>
                <p className="text-gray-600 leading-relaxed">
                  Clear guidance, responsive support, structured evidence planning, and a practical 
                  understanding of the trade.
                </p>
              </div>

              {/* Card 3 */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
                  <span className="text-2xl font-bold text-blue-600">03</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Our Approach</h3>
                <p className="text-gray-600 leading-relaxed">
                  A straightforward, professional process focused on helping candidates complete 
                  efficiently and correctly.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Row */}
        <section className="py-12 bg-white border-y border-gray-100">
          <div className="max-w-5xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0">
                  <Award className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">EAL Approved Centre</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">603/5982/1 Qualification</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-orange-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">London Based</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center flex-shrink-0">
                  <HeadphonesIcon className="w-5 h-5 text-purple-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">Full Assessment Support</span>
              </div>
            </div>
          </div>
        </section>

        {/* Wayne Wright Section */}
        <section className="py-16 md:py-20 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-white">WW</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Led by Wayne Wright</h2>
                <p className="text-sm text-blue-600 font-medium mb-6">Founder & Lead Assessor</p>
                <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto">
                  EWA Tracker Ltd is led by Wayne Wright, an experienced electrical assessor focused on helping 
                  experienced electricians achieve formal recognition through a structured and supportive 
                  assessment process.
                </p>
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
