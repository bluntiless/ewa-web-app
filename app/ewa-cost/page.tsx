import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, PoundSterling, CheckCircle, Info, Tag, CalendarClock } from "lucide-react"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"
import { pricing, isPromotionActive, promotion, formatCurrency, REGISTRATION_FEE } from "@/lib/pricing"

export const metadata: Metadata = {
  title: "EWA Cost | Experienced Worker Assessment Pricing",
  description:
    "Experienced Worker Assessment (EWA) cost explained. All-inclusive Standard and Gold packages including EAL registration, with instalment options. Clear, transparent pricing.",
  keywords: [
    "EWA cost",
    "Experienced Worker Assessment price",
    "EAL registration fee",
    "electrician qualification cost",
    "ECS Gold Card cost",
    "EWA pricing",
  ],
  alternates: {
    canonical: "https://ewatracker.co.uk/ewa-cost",
  },
  openGraph: {
    title: "EWA Cost | Experienced Worker Assessment Pricing | EWA Tracker Ltd",
    description:
      "Experienced Worker Assessment (EWA) cost explained. All-inclusive Standard and Gold packages including EAL registration.",
    url: "https://ewatracker.co.uk/ewa-cost",
  },
}

function CheckItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2 text-sm text-gray-700">
      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
      <span>{children}</span>
    </li>
  )
}

export default function EWACostPage() {
  const promoActive = isPromotionActive()
  const standardFull = pricing.standardFull
  const standardInst = pricing.standardInstalments
  const goldFull = pricing.goldFull
  const goldInst = pricing.goldInstalments

  const standardInitial = standardInst.type === "instalments" ? standardInst.initialPayment : 0
  const standardRemaining = standardInst.type === "instalments" ? standardInst.remainingPayments : []
  const goldInitial = goldInst.type === "instalments" ? goldInst.initialPayment : 0
  const goldRemaining = goldInst.type === "instalments" ? goldInst.remainingPayments : []

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <SiteHeader />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-700 to-blue-900 text-white py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <PoundSterling className="w-16 h-16 mx-auto mb-6 opacity-90" />
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 leading-tight text-balance">
            EWA Cost &amp; Pricing Guide
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-6 opacity-90 text-pretty">
            Two clear, all-inclusive packages for your Experienced Worker Assessment. EAL registration is included, and instalment plans are available.
          </p>
          {promoActive && (
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-4 py-2 text-sm font-bold text-blue-950">
              <Tag className="w-4 h-4" />
              {promotion.label}: prices reduced until {promotion.endDateLabel}
            </div>
          )}
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">

          {/* Introduction */}
          <div className="max-w-none mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">How much does an EWA cost?</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              The Experienced Worker Assessment with EWA Tracker Ltd costs{" "}
              <strong>{formatCurrency(standardFull.total)}</strong> for the Standard Programme or{" "}
              <strong>{formatCurrency(goldFull.total)}</strong> for the Gold Service. Both prices are all-inclusive and cover your EAL registration, assessor support, workplace observations, professional discussion, internal quality assurance and certification.
            </p>
            <p className="text-gray-700 leading-relaxed">
              There are no hidden extras: the only additional costs are separate qualifications you may still need for the ECS Gold Card (see below) or observations beyond your agreed package.
            </p>
          </div>

          {/* Packages */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Standard */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 flex flex-col">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Standard Programme</h3>
              <p className="text-sm text-gray-500 mb-4">Best for independent candidates confident gathering their own evidence</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-gray-900">{formatCurrency(standardFull.total)}</span>
                {promoActive && standardFull.originalTotal && (
                  <span className="text-lg text-gray-400 line-through">{formatCurrency(standardFull.originalTotal)}</span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-0.5 mb-4">All-inclusive, inc. EAL registration</p>
              {promoActive && standardFull.savings && (
                <span className="mb-4 self-start rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800">
                  Save {formatCurrency(standardFull.savings)} &middot; ends {promotion.endDateLabel}
                </span>
              )}
              <ul className="flex flex-col gap-2 mb-5">
                <CheckItem>EAL registration included</CheckItem>
                <CheckItem>Dedicated assessor support</CheckItem>
                <CheckItem>Evidence review and feedback</CheckItem>
                <CheckItem>Up to 2 workplace observations</CheckItem>
                <CheckItem>Professional discussion and IQA</CheckItem>
              </ul>
              <div className="mt-auto rounded-lg bg-gray-50 border border-gray-200 p-3 text-sm text-gray-700">
                <p className="font-medium text-gray-900 mb-1 flex items-center gap-1.5">
                  <CalendarClock className="w-4 h-4 text-blue-600" /> Instalment option
                </p>
                <p>
                  {formatCurrency(standardInitial)} initial payment, then {standardRemaining.length} monthly payments of{" "}
                  {formatCurrency(standardRemaining[0]?.amount ?? 0)}
                </p>
              </div>
            </div>

            {/* Gold */}
            <div className="bg-white border-2 border-amber-400 rounded-xl p-6 flex flex-col relative">
              <span className="absolute -top-3 left-6 rounded-full bg-amber-400 px-3 py-0.5 text-xs font-bold text-blue-950">
                More assessor-led
              </span>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Gold Service</h3>
              <p className="text-sm text-gray-500 mb-4">Best for candidates who want the assessor to gather more of the evidence</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-gray-900">{formatCurrency(goldFull.total)}</span>
                {promoActive && goldFull.originalTotal && (
                  <span className="text-lg text-gray-400 line-through">{formatCurrency(goldFull.originalTotal)}</span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-0.5 mb-4">All-inclusive, inc. EAL registration</p>
              {promoActive && goldFull.savings && (
                <span className="mb-4 self-start rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800">
                  Save {formatCurrency(goldFull.savings)} &middot; ends {promotion.endDateLabel}
                </span>
              )}
              <ul className="flex flex-col gap-2 mb-5">
                <CheckItem>Everything in Standard</CheckItem>
                <CheckItem>
                  <strong className="text-gray-900">Up to 4 workplace observations</strong> — your assessor captures more evidence directly, potentially reducing the photo/video evidence you need to upload
                </CheckItem>
                <CheckItem>Priority evidence review and feedback</CheckItem>
                <CheckItem>Additional scheduled progress reviews</CheckItem>
                <CheckItem>Enhanced assessor support throughout</CheckItem>
              </ul>
              <div className="mt-auto rounded-lg bg-gray-50 border border-gray-200 p-3 text-sm text-gray-700">
                <p className="font-medium text-gray-900 mb-1 flex items-center gap-1.5">
                  <CalendarClock className="w-4 h-4 text-blue-600" /> Instalment option
                </p>
                <p>
                  {formatCurrency(goldInitial)} initial payment, then {goldRemaining.length} monthly payments of{" "}
                  {formatCurrency(goldRemaining[0]?.amount ?? 0)}
                </p>
              </div>
            </div>
          </div>

          {/* Registration note */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 md:p-6 mb-12">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-700 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-gray-700 flex flex-col gap-2">
                <p>
                  <strong className="text-gray-900">EAL registration included.</strong> Both Standard and Gold prices include the{" "}
                  {formatCurrency(REGISTRATION_FEE)} EAL new-candidate registration fee (inc. VAT). Transfer candidates will receive an adjusted price where the £15 EAL transfer registration fee applies.
                </p>
                <p>Additional observations outside your agreed package are charged at £275 each. Registration fees are set by EAL and subject to change by the awarding body.</p>
              </div>
            </div>
          </div>

          {/* Standard vs Gold comparison */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Standard vs Gold: what&apos;s the difference?</h2>
            <p className="text-gray-700 mb-6">
              Both packages lead to the same qualification. The difference is how much of the evidence-gathering your assessor does for you.
            </p>
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-900">
                  <tr>
                    <th scope="col" className="px-4 py-3 font-semibold">Feature</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Standard</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Gold</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-gray-700">
                  <tr>
                    <th scope="row" className="px-4 py-3 font-medium text-gray-900">Price (all-inclusive)</th>
                    <td className="px-4 py-3">{formatCurrency(standardFull.total)}</td>
                    <td className="px-4 py-3">{formatCurrency(goldFull.total)}</td>
                  </tr>
                  <tr>
                    <th scope="row" className="px-4 py-3 font-medium text-gray-900">EAL registration</th>
                    <td className="px-4 py-3">Included</td>
                    <td className="px-4 py-3">Included</td>
                  </tr>
                  <tr>
                    <th scope="row" className="px-4 py-3 font-medium text-gray-900">Assessor support</th>
                    <td className="px-4 py-3">Standard</td>
                    <td className="px-4 py-3">Enhanced</td>
                  </tr>
                  <tr>
                    <th scope="row" className="px-4 py-3 font-medium text-gray-900">Evidence review and feedback</th>
                    <td className="px-4 py-3">Standard</td>
                    <td className="px-4 py-3">Priority</td>
                  </tr>
                  <tr>
                    <th scope="row" className="px-4 py-3 font-medium text-gray-900">Workplace observations</th>
                    <td className="px-4 py-3">Up to 2</td>
                    <td className="px-4 py-3">Up to 4</td>
                  </tr>
                  <tr>
                    <th scope="row" className="px-4 py-3 font-medium text-gray-900">Assessor gathers workplace evidence</th>
                    <td className="px-4 py-3">Standard</td>
                    <td className="px-4 py-3">Much more extensive</td>
                  </tr>
                  <tr>
                    <th scope="row" className="px-4 py-3 font-medium text-gray-900">Candidate photo/video evidence</th>
                    <td className="px-4 py-3">More self-gathered evidence likely</td>
                    <td className="px-4 py-3">Potentially significantly reduced</td>
                  </tr>
                  <tr>
                    <th scope="row" className="px-4 py-3 font-medium text-gray-900">Best for</th>
                    <td className="px-4 py-3">Independent candidates</td>
                    <td className="px-4 py-3">Candidates wanting more assessor-led evidence gathering</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* What's included */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What your package covers</h2>
            <p className="text-gray-700 mb-6">Every package includes the full assessment service from registration to certification:</p>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                ["EAL registration", "Registered with the awarding body for the Level 3 Experienced Worker qualification (603/5982/1)"],
                ["Initial skills scan and consultation", "Assessment of your eligibility and development of your qualification pathway"],
                ["Portfolio development support", "Guidance on evidence requirements and portfolio building"],
                ["Professional discussion", "Assessment of underpinning knowledge through structured discussion"],
                ["Workplace observations", "On-site assessment of your practical competence"],
                ["Internal quality assurance", "Review and verification of assessment decisions"],
                ["Certification processing", "Completion and submission of certification to EAL"],
                ["ECS Gold Card guidance", "Support with your application once qualified"],
              ].map(([title, desc]) => (
                <div key={title} className="flex items-start gap-3 bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900">{title}</h3>
                    <p className="text-gray-600 text-sm">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Qualifications */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 md:p-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Other qualifications you may need</h2>
            <p className="text-gray-700 mb-6">
              To obtain your <Link href="/ecs-gold-card-experienced-worker" className="text-blue-600 hover:underline">ECS Gold Card</Link>, you may also need the following if you don&apos;t already hold them. These are not included in the packages above:
            </p>
            <div className="flex flex-col gap-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900">18th Edition (BS 7671)</h3>
                <p className="text-gray-600 text-sm">Wiring Regulations certificate - required for all candidates</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900">Level 3 Inspection &amp; Testing</h3>
                <p className="text-gray-600 text-sm">Initial Verification and Periodic Inspection &amp; Testing qualification</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900">AM2 Assessment</h3>
                <p className="text-gray-600 text-sm">AM2E or AM2ED practical end-test (for ECS Gold Card)</p>
              </div>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
              <p className="text-amber-800 text-sm">
                <strong>Please note:</strong> EWA Tracker Ltd does not deliver the 18th Edition, Inspection &amp; Testing, or AM2 assessments. These qualifications are provided by separate training providers and NET assessment centres. We can recommend approved providers during your consultation.
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-blue-700 text-white rounded-xl p-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to get started?</h2>
            <p className="text-lg mb-6 opacity-90 text-pretty">
              Check your eligibility first, then book your place on the Standard or Gold programme.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/eligibility"
                className="bg-white text-blue-700 px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Check My Eligibility
              </Link>
              <Link
                href="/course-booking"
                className="border-2 border-white text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-white hover:text-blue-700 transition-colors"
              >
                Book Now
              </Link>
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
