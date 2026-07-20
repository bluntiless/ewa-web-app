import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Apple, Info, CheckCircle, Lightbulb, Cloud, Smartphone, Award, Globe, AlertTriangle, CalendarClock } from "lucide-react"
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
    "EAL 5982",
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
        <div className="absolute inset-0 opacity-15">
          <Image
            src="/electrical-images/electrician-hero.jpg"
            alt=""
            fill
            className="object-cover object-left mix-blend-multiply"
          />
        </div>
        <div className="max-w-6xl mx-auto px-4 relative z-10 text-center">
          <Image
            src="/ewa_logo_new.png"
            alt="EWA Tracker Logo"
            width={180}
            height={180}
            className="mx-auto mb-8 drop-shadow-lg w-[180px] h-auto"
            priority
          />
          <div className="inline-flex items-center gap-2 bg-amber-400 text-blue-950 px-4 py-1.5 rounded-full text-sm font-bold mb-6">
            <CalendarClock className="w-4 h-4" />
            Grandfather Rights End October 2026 &mdash; Act Now
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
            EWA Assessment & ECS Gold Card Route
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-4 opacity-90">
            EAL approved centre delivering the Level 3 Electrotechnical Experienced Worker Qualification (603/5982/1).
          </p>
          <p className="text-base md:text-lg max-w-2xl mx-auto mb-8 opacity-80">
            Serving experienced electricians in <strong>London</strong>, the <strong>South East</strong>, and <strong>across the UK</strong>. A structured experienced-worker route towards ECS Gold Card eligibility.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
            <Link
              href="/eligibility"
              className="bg-white text-blue-700 px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
            >
              Check My EWA Eligibility
            </Link>
            <a
              href="/book-a-call"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-white text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-white hover:text-blue-700 transition-colors shadow-lg"
            >
              Request an EWA Call
            </a>
          </div>
          <div className="flex flex-wrap justify-center gap-3 text-sm mt-6">
            <Link href="/skills-scan" className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-full transition-colors">
              Free Skills Scan
            </Link>
            <Link href="/eal-5982-experienced-worker" className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full transition-colors">
              EAL 5982 Qualification
            </Link>
            <Link href="/ecs-gold-card-experienced-worker" className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full transition-colors">
              ECS Gold Card Route
            </Link>
          </div>
        </div>
      </section>

      {/* October 2026 Deadline / Grandfather Rights Section */}
      <section className="bg-amber-50 border-y-4 border-amber-400 py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-8 h-8 text-amber-700 flex-shrink-0" />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-balance">
              October 2026: The End of &ldquo;Grandfather Rights&rdquo; for Electricians
            </h2>
          </div>
          <p className="text-gray-700 leading-relaxed mb-4 max-w-3xl">
            The <strong>October 2026 Electrotechnical Assessment Specification (EAS) update</strong> formalises a major industry shift: <strong>competence must now be formally evidenced, not assumed.</strong> The expiring &ldquo;grandfather rights&rdquo; (the Industry Accreditation route) mean you can <strong>no longer renew an ECS Gold Card based on years of experience alone.</strong>
          </p>
          <p className="text-gray-700 leading-relaxed mb-6 max-w-3xl">
            If you are <strong>time-served without a formal NVQ Level 3</strong>, the Experienced Worker Assessment (EWA) is the route designed for you &mdash; it recognises your real, on-site experience through a portfolio, professional discussion and workplace assessment. <strong>No classroom required.</strong>
          </p>
          <div className="bg-blue-700 text-white rounded-lg p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="font-medium">
              Demand is expected to rise sharply ahead of the deadline. Start your route towards an ECS Gold Card now.
            </p>
            <Link
              href="/eligibility"
              className="bg-amber-400 text-blue-950 px-6 py-3 rounded-full font-semibold hover:bg-amber-300 transition-colors whitespace-nowrap text-center"
            >
              Check Your Eligibility
            </Link>
          </div>
        </div>
      </section>

      {/* Qualifications Overview Section */}
      <section id="qualifications" className="py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">EWA to ECS Gold Card — Structured Experienced Worker Route</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Already working as an electrician but need formal qualification? The EWA is designed for experienced professionals like you. Complete the Level 3 EWA qualification as part of your route towards applying for an ECS Gold Card.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <Link href="/eal-5982-experienced-worker" className="flex items-start space-x-4 group">
                <Award className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    EAL Level 3 Electrotechnical Experienced Worker Qualification (603/5982/1)
                  </h3>
                  <p className="text-gray-600 mt-2">
                    Full-scope Installation &amp; Maintenance qualification through comprehensive assessment of your existing skills and experience.
                  </p>
                </div>
              </Link>

              

              <div className="bg-blue-50 rounded-lg p-6 mt-6 shadow-inner">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Flexible Evidence Submission</h3>
                <p className="text-gray-700 leading-relaxed">
                  Learners can upload assessment evidence via three secure and convenient methods:
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
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0" />
                    Via our Web App for Android users and desktop access
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
                You capture photo and video evidence of your work using our iOS app or Web App. PPE must be visible in all assessment photos.
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
            <Link
              href="/eligibility"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              Check Eligibility Before Booking
            </Link>
          </div>
        </div>
      </section>

      {/* iOS App Showcase Section */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-sm font-medium text-blue-600 uppercase tracking-wider mb-3">Mobile & Web App</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">EWA Tracker App</h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Track progress, upload evidence, and manage your qualification journey from anywhere.
              <span className="block mt-2 text-base text-gray-400">Available on iOS, iPad, and as a Web App for Android & desktop users.</span>
            </p>
          </div>

          {/* Premium iPhone Showcase */}
          <div className="relative mb-20">
            {/* Mobile: horizontal scroll, Desktop: tilted 3-phone display */}
            
            {/* Mobile view - horizontal scroll */}
            <div className="flex md:hidden gap-4 overflow-x-auto pb-4 px-4 -mx-4 snap-x snap-mandatory">
              <div className="flex-shrink-0 snap-center">
                <div className="relative w-[160px]">
                  <div className="bg-gray-900 rounded-[2rem] p-1.5 shadow-xl">
                    <div className="bg-black rounded-[1.5rem] overflow-hidden">
                      <div className="relative aspect-[9/19.5]">
                        <Image
                          src="/app-screenshots/qualifications.png"
                          alt="Choose Your Route"
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-center mt-3 text-xs text-gray-400">Choose Route</p>
              </div>

              <div className="flex-shrink-0 snap-center">
                <div className="relative w-[160px]">
                  <div className="bg-gray-900 rounded-[2rem] p-1.5 shadow-xl">
                    <div className="bg-black rounded-[1.5rem] overflow-hidden">
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
                <p className="text-center mt-3 text-xs font-medium text-gray-600">Unit Progress</p>
              </div>

              <div className="flex-shrink-0 snap-center">
                <div className="relative w-[160px]">
                  <div className="bg-gray-900 rounded-[2rem] p-1.5 shadow-xl">
                    <div className="bg-black rounded-[1.5rem] overflow-hidden">
                      <div className="relative aspect-[9/19.5]">
                        <Image
                          src="/app-screenshots/evidence-hints.png"
                          alt="Evidence Hints"
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-center mt-3 text-xs text-gray-400">Evidence Hints</p>
              </div>

              <div className="flex-shrink-0 snap-center">
                <div className="relative w-[160px]">
                  <div className="bg-gray-900 rounded-[2rem] p-1.5 shadow-xl">
                    <div className="bg-black rounded-[1.5rem] overflow-hidden">
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
                <p className="text-center mt-3 text-xs text-gray-400">Upload Evidence</p>
              </div>

              <div className="flex-shrink-0 snap-center">
                <div className="relative w-[160px]">
                  <div className="bg-gray-900 rounded-[2rem] p-1.5 shadow-xl">
                    <div className="bg-black rounded-[1.5rem] overflow-hidden">
                      <div className="relative aspect-[9/19.5]">
                        <Image
                          src="/app-screenshots/dashboard.png"
                          alt="Assessor Dashboard"
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-center mt-3 text-xs text-gray-400">Assessor Dashboard</p>
              </div>
            </div>

            {/* Desktop view - 5-phone display */}
            <div className="hidden md:flex justify-center items-end gap-4 lg:gap-6">
              {/* Far left phone */}
              <div className="transform -rotate-6 translate-y-12 opacity-80">
                <div className="relative w-[130px] lg:w-[150px]">
                  <div className="bg-gray-900 rounded-[2rem] p-1.5 shadow-xl">
                    <div className="bg-black rounded-[1.5rem] overflow-hidden">
                      <div className="relative aspect-[9/19.5]">
                        <Image
                          src="/app-screenshots/qualifications.png"
                          alt="Choose Route"
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-center mt-3 text-xs text-gray-400">Choose Route</p>
              </div>

              {/* Left phone */}
              <div className="transform -rotate-3 translate-y-6">
                <div className="relative w-[150px] lg:w-[170px]">
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
                <p className="text-center mt-3 text-xs text-gray-400">Unit Progress</p>
              </div>

              {/* Center phone - main focus */}
              <div className="relative z-10">
                <div className="relative w-[200px] lg:w-[220px]">
                  <div className="bg-gray-900 rounded-[2.5rem] p-2 shadow-2xl ring-1 ring-gray-800">
                    <div className="bg-black rounded-[2rem] overflow-hidden">
                      <div className="relative aspect-[9/19.5]">
                        <Image
                          src="/app-screenshots/evidence-hints.png"
                          alt="Evidence Hints & Examples"
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-center mt-3 text-sm font-medium text-gray-600">Evidence Hints</p>
              </div>

              {/* Right phone */}
              <div className="transform rotate-3 translate-y-6">
                <div className="relative w-[150px] lg:w-[170px]">
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
                <p className="text-center mt-3 text-xs text-gray-400">Upload Evidence</p>
              </div>

              {/* Far right phone */}
              <div className="transform rotate-6 translate-y-12 opacity-80">
                <div className="relative w-[130px] lg:w-[150px]">
                  <div className="bg-gray-900 rounded-[2rem] p-1.5 shadow-xl">
                    <div className="bg-black rounded-[1.5rem] overflow-hidden">
                      <div className="relative aspect-[9/19.5]">
                        <Image
                          src="/app-screenshots/dashboard.png"
                          alt="Assessor Dashboard"
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-center mt-3 text-xs text-gray-400">Assessor View</p>
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
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-16">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Lightbulb className="w-5 h-5 text-blue-600" />
              </div>
              <h4 className="text-sm font-semibold text-gray-900 mb-1">Progress Tracking</h4>
              <p className="text-xs text-gray-400">Monitor completion across all units</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Info className="w-5 h-5 text-amber-600" />
              </div>
              <h4 className="text-sm font-semibold text-gray-900 mb-1">Evidence Hints</h4>
              <p className="text-xs text-gray-400">Guidance on what evidence to upload per criteria</p>
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
              <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-5 h-5 text-rose-600" />
              </div>
              <h4 className="text-sm font-semibold text-gray-900 mb-1">Assessor Feedback</h4>
              <p className="text-xs text-gray-400">Evidence status and assessor feedback updates</p>
            </div>
          </div>

          {/* Web App Screenshots Gallery */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold text-gray-900 text-center mb-6">Web App Screenshots</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Login Screen */}
              <div className="group">
                <div className="bg-gray-900 rounded-xl p-3 shadow-lg transition-transform group-hover:scale-105">
                  <div className="flex items-center gap-1.5 mb-2">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  </div>
                  <img
                    src="/images/webapp-login.png"
                    alt="EWA Tracker Web App secure Microsoft login"
                    className="rounded-lg w-full"
                  />
                </div>
                <p className="text-center text-xs text-gray-500 mt-2">Secure Microsoft Sign-in</p>
              </div>
              
              {/* Dashboard */}
              <div className="group">
                <div className="bg-gray-900 rounded-xl p-3 shadow-lg transition-transform group-hover:scale-105">
                  <div className="flex items-center gap-1.5 mb-2">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  </div>
                  <img
                    src="/images/webapp-dashboard.png"
                    alt="EWA Tracker Web App dashboard with route selection"
                    className="rounded-lg w-full"
                  />
                </div>
                <p className="text-center text-xs text-gray-500 mt-2">Route Selection Dashboard</p>
              </div>
              
              {/* Portfolio */}
              <div className="group">
                <div className="bg-gray-900 rounded-xl p-3 shadow-lg transition-transform group-hover:scale-105">
                  <div className="flex items-center gap-1.5 mb-2">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  </div>
                  <img
                    src="/images/webapp-portfolio.png"
                    alt="EWA Tracker Web App portfolio and evidence section"
                    className="rounded-lg w-full"
                  />
                </div>
                <p className="text-center text-xs text-gray-500 mt-2">Portfolio & Evidence</p>
              </div>
              
              {/* Profile */}
              <div className="group">
                <div className="bg-gray-900 rounded-xl p-3 shadow-lg transition-transform group-hover:scale-105">
                  <div className="flex items-center gap-1.5 mb-2">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  </div>
                  <img
                    src="/images/webapp-profile.png"
                    alt="EWA Tracker Web App profile settings"
                    className="rounded-lg w-full"
                  />
                </div>
                <p className="text-center text-xs text-gray-500 mt-2">Profile Settings</p>
              </div>
              
              {/* Progress Tracking */}
              <div className="group">
                <div className="bg-gray-900 rounded-xl p-3 shadow-lg transition-transform group-hover:scale-105">
                  <div className="flex items-center gap-1.5 mb-2">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  </div>
                  <img
                    src="/images/webapp-progress.png"
                    alt="EWA Tracker Web App progress tracking with unit completion percentages"
                    className="rounded-lg w-full"
                  />
                </div>
                <p className="text-center text-xs text-gray-500 mt-2">Progress Tracking</p>
              </div>
            </div>
            <p className="text-center text-sm text-gray-500 mt-6">
              Full-featured Web App with the same functionality as our iOS app - works on any device with a browser
            </p>
          </div>

          {/* App Store & Web App CTA */}
          <div className="text-center">
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="https://apps.apple.com/gb/app/ewa-tracker/id6740567747"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-gray-900 text-white hover:bg-gray-800 transition-colors shadow-lg"
              >
                <Apple className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">Download on the App Store</span>
              </a>
              <a
                href="https://portfolio.ewatracker.co.uk"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-lg"
              >
                <Globe className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">Open Web App (Android & Desktop)</span>
              </a>
            </div>
            <p className="text-xs text-gray-400 mt-4">
              Android users and desktop candidates can use our full-featured Web App with the same functionality as the iOS app.
            </p>
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
              href="/book-a-call"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-8 py-4 rounded-full text-lg font-semibold bg-blue-700 text-white hover:bg-blue-800 transition-colors shadow-lg"
            >
              Request an EWA Call
            </a>
          </div>
        </div>
      </section>

      {/* EWA Tools Promo */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Eligibility Checker */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 shadow-lg">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-white rounded-xl shadow-md flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Eligibility Checker</h3>
                <p className="text-blue-100 text-sm mb-4">
                  Check your eligibility for the ECS Gold Card route based on qualifications, 18th Edition, and experience.
                </p>
                <a
                  href="/eligibility"
                  className="inline-flex items-center gap-2 bg-white text-blue-700 px-5 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors text-sm"
                >
                  Check Eligibility
                </a>
              </div>
            </div>

            {/* Pathway Checker */}
            <div className="bg-gradient-to-r from-gray-700 to-gray-800 rounded-2xl p-6 shadow-lg">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-white rounded-xl shadow-md flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Pathway Checker</h3>
                <p className="text-gray-300 text-sm mb-4">
                  Determine the correct EAL 603/5982/1 pathway based on your BS 7671 status and I&amp;T qualifications.
                </p>
                <a
                  href="/revision"
                  className="inline-flex items-center gap-2 bg-white text-gray-700 px-5 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-sm"
                >
                  Check Pathway
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Pricing</h2>
            <p className="text-base text-gray-500 max-w-2xl mx-auto">
              Clear, structured pricing for experienced electricians looking to complete the EAL Experienced Worker Assessment route.
            </p>
          </div>

          {/* Skills Scan Panel */}
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-5 mb-8 max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <div className="inline-flex items-center gap-2 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold mb-2">
                  Limited Time Offer &mdash; Fee Waived
                </div>
                <h3 className="text-sm font-semibold text-blue-900">Skills Scan / Eligibility Review</h3>
                <p className="text-xs text-blue-700 mt-1">
                  A short pre-enrolment review of your suitability for the Experienced Worker Assessment route. This may include review of your Skills Scan, Candidate Background Form, qualification evidence, work-history information and initial route guidance.
                </p>
                <p className="text-xs font-semibold text-green-700 mt-2">
                  For a limited time only, we are offering a FREE Skills Scan and Candidate Background Form review &mdash; the usual £50 fee is waived.
                </p>
              </div>
              <div className="text-right">
                <span className="block text-sm font-medium text-gray-400 line-through">£50</span>
                <span className="text-xl font-bold text-green-700">FREE</span>
              </div>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Standard Plan */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Standard EWA Service</h3>
              <div className="mb-4">
                <span className="text-3xl font-bold text-gray-900">£2,000</span>
              </div>
              <ul className="space-y-2.5 mb-6">
                <li className="flex items-start gap-2 text-sm text-gray-600">
                  <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Initial assessment and onboarding
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-600">
                  <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Portfolio guidance and evidence planning
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-600">
                  <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Evidence review and assessor feedback
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-600">
                  <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Professional discussion
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-600">
                  <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Up to 2 observations
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-600">
                  <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Internal quality assurance and certification support
                </li>
              </ul>
              <Link
                href="/eligibility"
                className="block w-full text-center px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
              >
                Check Eligibility First
              </Link>
            </div>

            {/* Gold Plan */}
            <div className="bg-white rounded-xl border-2 border-blue-600 p-6 shadow-md relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">Recommended</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Gold EWA Service</h3>
              <div className="mb-4">
                <span className="text-3xl font-bold text-gray-900">£2,500</span>
              </div>
              <ul className="space-y-2.5 mb-6">
                <li className="flex items-start gap-2 text-sm text-gray-600">
                  <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Everything in Standard
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-600">
                  <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Up to 4 observations
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-600">
                  <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Priority evidence review and feedback
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-600">
                  <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Additional scheduled progress reviews
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-600">
                  <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Enhanced assessor support throughout the programme
                </li>
              </ul>
              <Link
                href="/eligibility"
                className="block w-full text-center px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Check Eligibility First
              </Link>
            </div>
          </div>

          {/* Eligibility CTA */}
          <div className="mt-8 max-w-xl mx-auto text-center">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <p className="text-gray-700 mb-4">
                Not sure which option applies to you? Check your eligibility first before choosing Standard or Gold.
              </p>
              <Link
                href="/eligibility"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                Check My EWA Eligibility
              </Link>
            </div>
          </div>

          {/* Pricing Notes */}
          <div className="mt-10 max-w-3xl mx-auto text-center">
            <div className="bg-gray-100 rounded-lg p-5 text-sm text-gray-600">
              <p className="font-medium text-gray-700 mb-2">EAL registration fee applies separately:</p>
              <p>£268.80 for new registrations (inc. VAT) &nbsp;•&nbsp; £15 for transfer registrations</p>
              <p className="mt-2">Additional observations outside the agreed package: £275 each</p>
            </div>
            <p className="mt-4 text-xs text-gray-400 max-w-2xl mx-auto">
              <strong>Important:</strong> EWA Tracker Ltd delivers the EAL Level 3 Electrotechnical Experienced Worker Qualification (603/5982/1) only. 
              We do not offer 18th Edition, Inspection &amp; Testing, or AM2 assessments - these must be arranged separately through approved training providers and NET assessment centres. We can recommend providers during your consultation.
            </p>
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
