import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Clock, CheckCircle, AlertCircle } from "lucide-react"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"

export const metadata: Metadata = {
  title: "Do I Need AM2E for an ECS Gold Card? | EWA Tracker Ltd",
  description: "Understanding the AM2 assessment requirement for ECS Gold Card applications. Learn about AM2E vs AM2ED and when you need to complete this practical test.",
  keywords: [
    "AM2 assessment",
    "AM2E",
    "AM2ED",
    "ECS Gold Card requirements",
    "do I need AM2",
    "AM2 electrician",
  ],
  alternates: {
    canonical: "https://ewatracker.co.uk/guides/do-i-need-am2-for-ecs-gold-card",
  },
}

export default function AM2GuidePage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <SiteHeader />

      {/* Article Header */}
      <section className="bg-white border-b border-gray-200 py-8 md:py-12">
        <div className="max-w-3xl mx-auto px-4">
          <Link href="/guides" className="inline-flex items-center gap-2 text-blue-600 hover:underline mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Guides
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded">ECS Card</span>
            <span className="text-gray-500 text-sm flex items-center gap-1">
              <Clock className="w-4 h-4" /> 6 min read
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
            Do I Need AM2E for an ECS Gold Card?
          </h1>
          <p className="text-lg text-gray-600">
            Understanding the AM2 assessment requirement for ECS Gold Card applications, including the difference between AM2E and AM2ED and when you need to complete this practical test.
          </p>
        </div>
      </section>

      {/* Article Content */}
      <article className="py-12 bg-white">
        <div className="max-w-3xl mx-auto px-4 prose prose-lg">
          
          <h2>The Short Answer</h2>
          <p>
            <strong>Yes, in most cases you will need to pass an AM2 assessment to obtain an ECS Gold Card through the Experienced Worker route.</strong> The AM2 is a practical end-test that demonstrates your ability to safely complete electrical installation work to industry standards.
          </p>
          
          <div className="not-prose bg-amber-50 border border-amber-200 rounded-xl p-6 my-8">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Key Point</h3>
                <p className="text-gray-700">
                  The AM2 is mandatory for new ECS Gold Card applications through the EWA route. Without it, you cannot obtain the Gold Card, even if you have completed your Level 3 qualification.
                </p>
              </div>
            </div>
          </div>

          <h2>What is the AM2 Assessment?</h2>
          <p>
            The AM2 (Assessment of Achievement Measure 2) is a practical assessment delivered by National Electrotechnical Training (NET). It was designed as an industry-standard end-point assessment to verify that candidates can apply their knowledge and skills in practical scenarios.
          </p>
          <p>
            The assessment takes place at an approved NET assessment centre and typically lasts one full day. You will complete a series of practical electrical installation tasks under controlled conditions, demonstrating safe working practices, technical competence, and compliance with BS 7671 Wiring Regulations.
          </p>

          <h2>AM2E vs AM2ED: What&apos;s the Difference?</h2>
          <p>
            There are two main variants of the AM2 assessment, and the one you need depends on your qualification route:
          </p>
          
          <h3>AM2E (Installation Electrician)</h3>
          <p>
            The AM2E is the full-scope assessment for Installation Electricians. It covers commercial and industrial installation competence in addition to domestic work. You would take this assessment if you are completing the <Link href="/eal-5982-experienced-worker">EAL 5982 Experienced Worker Qualification (603/5982/1)</Link>.
          </p>
          <p>
            The AM2E assessment includes tasks such as:
          </p>
          <ul>
            <li>Installation of wiring systems in various enclosures</li>
            <li>Connection of distribution equipment</li>
            <li>Motor control circuit installation</li>
            <li>Safe isolation procedures</li>
            <li>Testing and inspection activities</li>
            <li>Fault diagnosis</li>
          </ul>

          <h3>AM2ED (Domestic Electrician)</h3>
          <p>
            The AM2ED is specifically designed for Domestic Electricians. It focuses exclusively on domestic installation competence and is suitable for those working primarily in residential settings.
          </p>
          <p>
            The AM2ED assessment includes tasks such as:
          </p>
          <ul>
            <li>Domestic consumer unit installation</li>
            <li>Ring final circuit wiring</li>
            <li>Lighting circuit installation</li>
            <li>Safe isolation in domestic settings</li>
            <li>Testing and certification of domestic installations</li>
          </ul>

          <h2>When Do I Take the AM2?</h2>
          <p>
            The AM2 should typically be taken towards the end of or after completing your Level 3 qualification. The recommended sequence is:
          </p>
          <ol>
            <li>Complete your <Link href="/eal-5982-experienced-worker">EAL Level 3 EWA qualification</Link></li>
            <li>Ensure you hold your 18th Edition (BS 7671) certificate</li>
            <li>Hold your Level 3 Inspection &amp; Testing qualification</li>
            <li>Book and complete your AM2 assessment</li>
            <li>Apply for your ECS Gold Card</li>
          </ol>
          <p>
            Some candidates choose to take the AM2 while still completing their Level 3 portfolio, but it&apos;s generally advisable to have most of your qualification complete first so you&apos;re fully prepared for the practical assessment.
          </p>

          <h2>How Do I Book the AM2?</h2>
          <p>
            The AM2 assessment is booked directly through National Electrotechnical Training (NET) or through their approved assessment centres. Assessment centres are located throughout the UK, and you can choose a location convenient for you.
          </p>
          <p>
            During your consultation with EWA Tracker Ltd, we can advise on the best timing for your AM2 and recommend nearby assessment centres.
          </p>

          <h2>What If I Fail the AM2?</h2>
          <p>
            If you don&apos;t pass the AM2 on your first attempt, you can re-sit the assessment. NET allows candidates to rebook and attempt the assessment again after receiving feedback on their performance.
          </p>
          <p>
            The key to passing the AM2 is ensuring you&apos;re thoroughly prepared. This means having a solid foundation in:
          </p>
          <ul>
            <li>Safe isolation procedures (a critical pass/fail area)</li>
            <li>BS 7671 Wiring Regulations requirements</li>
            <li>Practical installation techniques</li>
            <li>Testing procedures</li>
            <li>Time management during the assessment</li>
          </ul>

          <h2>Are There Any Exemptions?</h2>
          <p>
            There are limited circumstances where candidates may not need to complete the AM2:
          </p>
          <ul>
            <li><strong>Previous AM2 Pass:</strong> If you have previously passed the AM2 within its validity period</li>
            <li><strong>Transferring Qualifications:</strong> In some cases, candidates with specific legacy qualifications may have alternative pathways</li>
          </ul>
          <p>
            However, for most candidates coming through the Experienced Worker route in 2024 and beyond, the AM2 is a mandatory requirement. Always confirm your specific requirements during your consultation.
          </p>

          <h2>AM2 Costs</h2>
          <p>
            The AM2 assessment has its own fee, separate from your Level 3 qualification costs. At the time of writing, the AM2 typically costs around £400-500, though prices may vary by assessment centre and may change over time.
          </p>
          <p>
            For a full breakdown of EWA costs including the AM2, visit our <Link href="/ewa-cost">EWA Costs page</Link>.
          </p>

          <h2>Summary</h2>
          <p>
            If you&apos;re pursuing an <Link href="/ecs-gold-card-experienced-worker">ECS Gold Card</Link> through the Experienced Worker route, you will almost certainly need to pass an AM2 assessment. The specific variant (AM2E or AM2ED) depends on whether your work covers full commercial/industrial scope or focuses primarily on domestic installations.
          </p>

          {/* CTA Box */}
          <div className="not-prose bg-blue-50 border border-blue-200 rounded-xl p-6 my-8">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Questions About Your ECS Gold Card Route?</h3>
            <p className="text-gray-700 mb-4">
              Book a free consultation to discuss your pathway to the ECS Gold Card, including AM2 preparation and timing.
            </p>
            <a
              href="https://calendly.com/ewatracker-info/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors"
            >
              Book Free Consultation <ArrowRight className="w-4 h-4" />
            </a>
          </div>

        </div>
      </article>

      {/* Related Articles */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Guides</h2>
          <div className="space-y-4">
            <Link href="/guides/what-is-eal-5982-experienced-worker-qualification" className="block bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
              <h3 className="font-semibold text-gray-900 hover:text-blue-700">What is the EAL 5982 Experienced Worker Qualification?</h3>
              <p className="text-gray-600 text-sm">Understanding the Level 3 EWA qualification</p>
            </Link>
            <Link href="/guides/ewa-vs-apprenticeship-which-route" className="block bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
              <h3 className="font-semibold text-gray-900 hover:text-blue-700">EWA vs Apprenticeship – Which Route is Right?</h3>
              <p className="text-gray-600 text-sm">Comparing qualification pathways</p>
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
