import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Apple, Info, CheckCircle, Lightbulb, Cloud, Smartphone, Award } from "lucide-react"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"

export const metadata: Metadata = {
  title: "EWA Assessment London & UK | ECS Gold Card Route for Electricians",
  description:
    "EWA Tracker Ltd is an EAL approved centre delivering the Level 3 Electrotechnical Experienced Worker Qualification (603/5982/1). Fast-track your ECS Gold Card in London, South East, and across the UK.",
  keywords: [
    "EWA assessment London",
    "ECS Gold Card electrician",
    "experienced worker assessment UK",
    "Level 3 electrical qualification",
    "EAL approved centre",
    "electrician qualification London",
  ],
  alternates: {
    canonical: "https://ewatracker.co.uk",
  },
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <SiteHeader />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-700 to-blue-900 text-white py-20 md:py-28 lg:py-36 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <Image
            src="/electrical-images/ewa-advert.png"
            alt=""
            fill
            className="object-cover mix-blend-multiply"
          />
        </div>
        <div className="max-w-6xl mx-auto px-4 relative z-10 text-center">
          <Image
            src="/ewa_logo.png"
            alt="EWA Tracker Logo"
            width={250}
            height={100}
            className="mx-auto mb-8 drop-shadow-lg w-[250px] h-auto"
            priority
          />
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
            EWA Assessment & ECS Gold Card Route
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-4 opacity-90">
            EAL approved centre delivering the Level 3 Electrotechnical Experienced Worker Qualification (603/5982/1).
          </p>
          <p className="text-base md:text-lg max-w-2xl mx-auto mb-8 opacity-80">
            Serving experienced electricians in <strong>London</strong>, the <strong>South East</strong>, and <strong>across the UK</strong>. Fast-track your ECS Gold Card today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/services"
              className="bg-white text-blue-700 px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
            >
              Explore Qualifications
            </Link>
            <a
              href="https://calendly.com/ewatracker-info/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-white text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-white hover:text-blue-700 transition-colors shadow-lg"
            >
              Book Your EWA Assessment Call
            </a>
          </div>
        </div>
      </section>

      {/* Qualifications Overview Section */}
      <section id="qualifications" className="py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">EWA to ECS Gold Card — Your Fast-Track Route</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Already working as an electrician but need formal qualification? The EWA is designed for experienced professionals like you. Complete your Level 3 assessment and unlock your ECS Gold Card.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <Award className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    EAL Level 3 Electrotechnical Experienced Worker Qualification (603/5982/1)
                  </h3>
                  <p className="text-gray-600 mt-2">
                    Achieve your industry-standard qualification through a comprehensive assessment of your existing
                    skills and experience.
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-6 mt-6 shadow-inner">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Flexible Evidence Submission</h3>
                <p className="text-gray-700 leading-relaxed">
                  Learners can upload assessment evidence via two secure and convenient methods:
                </p>
                <ul className="mt-3 space-y-2 text-gray-700">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0" />
                    Direct upload to our secure SharePoint platform
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0" />
                    Through our dedicated iOS mobile application for on-the-go submissions
                  </li>
                </ul>
              </div>
            </div>
            <div className="relative h-96 w-full rounded-xl overflow-hidden shadow-xl">
              <Image
                src="/electrical-images/ewa-advert.png"
                alt="EWA Qualification Overview"
                fill
                className="object-cover object-center"
              />
            </div>
          </div>
        </div>
      </section>

      {/* What the EWA Process Looks Like */}
      <section className="py-16 md:py-20 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sm font-medium text-blue-600 uppercase tracking-wider mb-2">The Assessment Journey</p>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">What the EWA Process Looks Like</h2>
            <p className="text-base text-gray-500 max-w-2xl mx-auto">
              A practical, evidence-based qualification built around your real work. Here&apos;s how it works.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* On-Site Assessment */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-lg font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">On-Site Assessment</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-3">
                Your assessor reviews your work in real environments — whether domestic, commercial, or industrial installations.
              </p>
              <ul className="text-xs text-gray-400 space-y-1">
                <li>• Workplace observation</li>
                <li>• Professional discussion</li>
                <li>• Practical demonstration</li>
              </ul>
            </div>

            {/* Evidence Collection */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-lg font-bold text-green-600">2</span>
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">Evidence Collection</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-3">
                You capture photo and video evidence of your work using our iOS app. PPE must be visible in all assessment photos.
              </p>
              <ul className="text-xs text-gray-400 space-y-1">
                <li>• Photos of completed work</li>
                <li>• Video walkthroughs</li>
                <li>• Supporting documentation</li>
              </ul>
            </div>

            {/* Structured Support */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-lg font-bold text-amber-600">3</span>
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">Structured Support</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-3">
                Your assessor guides you through each unit, providing feedback and helping you complete efficiently.
              </p>
              <ul className="text-xs text-gray-400 space-y-1">
                <li>• Clear progress tracking</li>
                <li>• Regular assessor feedback</li>
                <li>• Portfolio review sessions</li>
              </ul>
            </div>
          </div>

          <div className="mt-12 text-center">
            <a
              href="https://calendly.com/ewatracker-info/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Book a Call to Discuss Your Experience
            </a>
          </div>
        </div>
      </section>

      {/* iOS App Showcase Section */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-sm font-medium text-blue-600 uppercase tracking-wider mb-3">Mobile App</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">EWA Tracker for iOS</h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Track progress, upload evidence, and manage your qualification journey from anywhere.
            </p>
          </div>

          {/* Premium iPhone Showcase */}
          <div className="relative mb-20">
            {/* Main 3 phones display */}
            <div className="flex justify-center items-end gap-4 md:gap-8">
              {/* Left phone - tilted */}
              <div className="hidden md:block transform -rotate-6 translate-y-8">
                <div className="relative w-[180px]">
                  <div className="bg-gray-900 rounded-[2.5rem] p-2 shadow-2xl">
                    <div className="bg-black rounded-[2rem] overflow-hidden">
                      <div className="relative aspect-[9/19.5]">
                        <Image
                          src="/app-screenshots/units-overview.png"
                          alt="Unit Progress"
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-center mt-4 text-xs text-gray-400">Unit Progress</p>
              </div>

              {/* Center phone - main focus */}
              <div className="relative z-10">
                <div className="relative w-[220px] md:w-[260px]">
                  <div className="bg-gray-900 rounded-[2.5rem] p-2 shadow-2xl ring-1 ring-gray-800">
                    <div className="bg-black rounded-[2rem] overflow-hidden">
                      <div className="relative aspect-[9/19.5]">
                        <Image
                          src="/app-screenshots/qualifications.png"
                          alt="Qualifications Overview"
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-center mt-4 text-sm font-medium text-gray-600">Qualifications</p>
              </div>

              {/* Right phone - tilted */}
              <div className="hidden md:block transform rotate-6 translate-y-8">
                <div className="relative w-[180px]">
                  <div className="bg-gray-900 rounded-[2.5rem] p-2 shadow-2xl">
                    <div className="bg-black rounded-[2rem] overflow-hidden">
                      <div className="relative aspect-[9/19.5]">
                        <Image
                          src="/app-screenshots/upload-options.png"
                          alt="Upload Evidence"
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-center mt-4 text-xs text-gray-400">Upload Evidence</p>
              </div>
            </div>
          </div>

          {/* iPad Showcase */}
          <div className="relative mb-20">
            <div className="flex justify-center">
              <div className="relative max-w-3xl w-full">
                {/* iPad Frame */}
                <div className="bg-gray-900 rounded-[1.5rem] md:rounded-[2rem] p-2 md:p-3 shadow-2xl">
                  <div className="bg-gray-900 rounded-[1rem] md:rounded-[1.5rem] overflow-hidden">
                    <Image
                      src="/app-screenshots/ipad-qualifications.png"
                      alt="EWA Tracker iPad - Experienced Worker Assessment"
                      width={1200}
                      height={900}
                      className="w-full h-auto"
                    />
                  </div>
                </div>
              </div>
            </div>
            <p className="text-center mt-6 text-sm text-gray-500">Also available on iPad for larger screen management</p>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Lightbulb className="w-5 h-5 text-blue-600" />
              </div>
              <h4 className="text-sm font-semibold text-gray-900 mb-1">Progress Tracking</h4>
              <p className="text-xs text-gray-400">Monitor completion across all units</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Smartphone className="w-5 h-5 text-green-600" />
              </div>
              <h4 className="text-sm font-semibold text-gray-900 mb-1">Evidence Upload</h4>
              <p className="text-xs text-gray-400">Photos, videos, and documents</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Cloud className="w-5 h-5 text-purple-600" />
              </div>
              <h4 className="text-sm font-semibold text-gray-900 mb-1">SharePoint Sync</h4>
              <p className="text-xs text-gray-400">Enterprise-grade cloud storage</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Info className="w-5 h-5 text-amber-600" />
              </div>
              <h4 className="text-sm font-semibold text-gray-900 mb-1">Assessor Feedback</h4>
              <p className="text-xs text-gray-400">Real-time approval status</p>
            </div>
          </div>

          {/* App Store CTA */}
          <div className="text-center">
            <a
              href="https://apps.apple.com/gb/app/ewa-tracker/id6740567747"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 rounded-xl bg-gray-900 text-white hover:bg-gray-800 transition-colors shadow-lg"
            >
              <Apple className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">Download on the App Store</span>
            </a>
          </div>
        </div>
      </section>

      {/* ECS Gold Card Benefits Section */}
      <section className="py-16 md:py-24 bg-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Get Your ECS Gold Card?</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              The ECS Gold Card is the industry standard for qualified electricians across the UK. Here&apos;s what it unlocks for your career.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Site Access</h3>
              <p className="text-gray-600">
                Gain entry to major construction sites that require ECS card verification for all electrical workers.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Proven Competence</h3>
              <p className="text-gray-600">
                Demonstrate your Level 3 qualification to clients, contractors, and employers with industry-recognised credentials.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Career Growth</h3>
              <p className="text-gray-600">
                Open doors to higher-paying contracts, supervisory roles, and specialist electrical work across the UK.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <a
              href="https://calendly.com/ewatracker-info/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-8 py-4 rounded-full text-lg font-semibold bg-blue-700 text-white hover:bg-blue-800 transition-colors shadow-lg"
            >
              Book Your EWA Assessment Call
            </a>
          </div>
        </div>
      </section>

      {/* Policies CTA Section */}
      <section className="py-12 bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Policies & Procedures</h3>
          <p className="text-gray-600 mb-4">
            View our comprehensive documentation including complaints, appeals, data protection, and quality assurance policies.
          </p>
          <Link
            href="/policies"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            View All Policies
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 md:py-24 bg-blue-800 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Get in Touch</h2>
          <p className="text-lg opacity-90 mb-8">
            Have questions about our qualifications or the assessment process? We're here to help.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <a
              href="mailto:info@ewatracker.co.uk"
              className="flex items-center justify-center bg-white text-blue-800 px-6 py-3 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l1.3 9.137a1 1 0 01-.285.867l-2.542 2.542a1 1 0 00-.285.867l.3 2.153a1 1 0 001 .836h.001a1 1 0 00.986-.836l1.3-9.137a1 1 0 01.285-.867l2.542-2.542a1 1 0 00.285-.867l-.3-2.153a1 1 0 00-1-.836h-.001a1 1 0 00-.986.836l-1.3 9.137a1 1 0 01-.285.867l-2.542 2.542a1 1 0 00-.285.867l.3-2.153a1 1 0 001-.836h.001z"></path>
              </svg>
              info@ewatracker.co.uk
            </a>
            <a
              href="tel:+447828893976"
              className="flex items-center justify-center border border-white text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-white hover:text-blue-800 transition-colors shadow-lg"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l1.3 9.137a1 1 0 01-.285.867l-2.542 2.542a1 1 0 00-.285.867l.3 2.153a1 1 0 001 .836h.001a1 1 0 00.986-.836l1.3-9.137a1 1 0 01.285-.867l2.542-2.542a1 1 0 00.285-.867l-.3-2.153a1 1 0 00-1-.836h-.001a1 1 0 00-.986.836l-1.3 9.137a1 1 0 01-.285.867l-2.542 2.542a1 1 0 00-.285.867l.3-2.153a1 1 0 001-.836h.001z"></path>
              </svg>
              07828 893976
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}

interface PolicyLinkProps {
  href: string
  title: string
  description: string
  color: "blue" | "green"
}

function PolicyLink({ href, title, description, color }: PolicyLinkProps) {
  const bgColorClass = color === "blue" ? "bg-blue-500" : "bg-green-500"
  const hoverShadowClass = color === "blue" ? "hover:shadow-blue-200" : "hover:shadow-green-200"

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center p-5 bg-white rounded-lg shadow-sm hover:shadow-md ${hoverShadowClass} transition-all duration-200 group`}
    >
      <div className={`w-10 h-10 ${bgColorClass} rounded-full flex items-center justify-center mr-4 flex-shrink-0`}>
        <Download className="w-5 h-5 text-white" />
      </div>
      <div>
        <h4 className="font-semibold text-gray-900 text-lg group-hover:text-blue-700 transition-colors">{title}</h4>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      </div>
    </a>
  )
}
