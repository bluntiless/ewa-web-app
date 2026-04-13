import type { Metadata } from "next"
import Link from "next/link"
import { Award, CheckCircle, ArrowRight, FileText, Users, Clock, HelpCircle, CreditCard } from "lucide-react"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"

export const metadata: Metadata = {
  title: "EAL 5982 Experienced Worker Qualification | EWA Tracker Ltd",
  description: "Complete your EAL 5982 Experienced Worker Qualification and achieve ECS Gold Card status. Check eligibility and start your EWA today.",
  keywords: [
    "EAL 5982 Experienced Worker Qualification",
    "EAL 603/5982/1",
    "Experienced Worker Qualification",
    "Level 3 Electrotechnical",
    "ECS Gold Card experienced worker",
    "EWA electrician UK",
    "NVQ Level 3 electrician",
  ],
  alternates: {
    canonical: "https://ewatracker.co.uk/eal-5982-experienced-worker",
  },
  openGraph: {
    title: "EAL 5982 Experienced Worker Qualification | EWA Tracker Ltd",
    description: "Complete your EAL 5982 Experienced Worker Qualification and achieve ECS Gold Card status. Check eligibility and start your EWA today.",
    url: "https://ewatracker.co.uk/eal-5982-experienced-worker",
  },
}

export default function EAL5982Page() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <SiteHeader />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-700 to-blue-900 text-white py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 leading-tight">
            EAL 5982 Experienced Worker Qualification (Level 3)
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-6 opacity-90">
            The EAL 5982 Experienced Worker Qualification is the industry-recognised route for experienced UK electricians to gain formal Level 3 certification and access the prestigious ECS Gold Card.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/candidate-check"
              className="bg-white text-blue-700 px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Check Your Eligibility
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
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          
          {/* Section 1: What is the EAL 5982? */}
          <div className="prose prose-lg max-w-none mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">What is the EAL 5982 Experienced Worker Qualification?</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              The <strong>EAL 5982 Experienced Worker Qualification</strong>, officially known as the EAL Level 3 Electrotechnical Qualification (603/5982/1), is a nationally recognised certification designed specifically for electricians who have substantial industry experience but lack formal qualifications. This qualification validates your existing skills and knowledge, providing the certification needed to advance your career.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Unlike traditional apprenticeship routes that require years of college attendance, the Experienced Worker Assessment (EWA) route allows you to demonstrate your existing competence through portfolio evidence, professional discussions, and practical workplace assessments. For <strong>EWA electricians across the UK</strong>, this represents the most efficient pathway to formal recognition.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              The EAL 5982 Experienced Worker Qualification covers the full scope of Installation and Maintenance Electrician competencies, including electrical installation, maintenance, fault diagnosis, inspection and testing procedures, and compliance with BS 7671 Wiring Regulations. Upon completion, you will hold an industry-standard Level 3 qualification equivalent to completing a full electrical apprenticeship.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              At EWA Tracker Ltd, we are an EAL approved centre specialising in delivering the EAL 5982 Experienced Worker Qualification. We guide candidates through the entire process, from initial skills scan to final certification, ensuring you achieve your qualification efficiently and professionally.
            </p>
          </div>

          {/* Section 2: Who Is It For */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 md:p-8 mb-12">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-8 h-8 text-blue-700" />
              <h2 className="text-2xl font-bold text-gray-900">Who is the EAL 5982 Experienced Worker Qualification For?</h2>
            </div>
            <p className="text-gray-700 mb-4">
              The EAL 5982 Experienced Worker Qualification is ideal for experienced electricians who want to formalise their skills and gain industry-recognised certification. You may be suitable if you are:
            </p>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                <span className="text-gray-700"><strong>A time-served electrician</strong> who learned on the job but never completed formal qualifications</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                <span className="text-gray-700"><strong>A career changer</strong> with transferable electrical experience from military service, industrial maintenance, or related trades</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                <span className="text-gray-700"><strong>An overseas-qualified electrician</strong> seeking UK recognition of your international experience and qualifications</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                <span className="text-gray-700"><strong>An electrician returning to the trade</strong> after a career break who needs to update their credentials</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                <span className="text-gray-700"><strong>An experienced worker seeking ECS Gold Card status</strong> to access major construction sites and contracts</span>
              </li>
            </ul>
            <p className="text-gray-700 mb-4">
              The EAL 5982 Experienced Worker Qualification is specifically designed for those working across <strong>commercial, industrial, and mixed-scope installations</strong>. If your experience is primarily in domestic installations, the <Link href="/electrotechnical-dwellings-ewa" className="text-blue-600 hover:underline">Electrotechnical in Dwellings qualification (610/2859/9)</Link> may be more suitable, requiring only 3 years of experience.
            </p>
          </div>

          {/* Section 3: Entry Requirements */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-8 h-8 text-blue-700" />
              <h2 className="text-2xl font-bold text-gray-900">Entry Requirements for the EAL 5982 Experienced Worker Qualification</h2>
            </div>
            <p className="text-gray-700 mb-6">
              To be eligible for the EAL 5982 Experienced Worker Qualification, you must meet specific entry criteria that demonstrate your readiness for assessment:
            </p>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
                <h3 className="font-semibold text-gray-900 mb-2">Prior Learning</h3>
                <p className="text-gray-600 text-sm">Level 2 Diploma in Electrical Installation (2365 or equivalent) or demonstrable electrotechnical theory knowledge</p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
                <h3 className="font-semibold text-gray-900 mb-2">Industry Experience</h3>
                <p className="text-gray-600 text-sm"><strong>Minimum 5 years</strong> verifiable experience as a practicing electrician in commercial/industrial settings</p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
                <h3 className="font-semibold text-gray-900 mb-2">Portfolio Evidence</h3>
                <p className="text-gray-600 text-sm">Ability to provide photographs, certificates, job records, and witness testimonies from your work</p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
                <h3 className="font-semibold text-gray-900 mb-2">English Proficiency</h3>
                <p className="text-gray-600 text-sm">Appropriate level of English to read, write, speak, and understand technical information</p>
              </div>
            </div>
            <p className="text-gray-700 mb-4">
              For those seeking an <Link href="/ecs-gold-card-experienced-worker" className="text-blue-600 hover:underline">ECS Gold Card</Link> upon completion, you will also need to hold or obtain:
            </p>
            <ul className="space-y-2 mb-4">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">18th Edition Wiring Regulations (BS 7671) certificate</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Level 3 Initial Verification and Periodic Inspection &amp; Testing qualification</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">AM2E practical end-test assessment</span>
              </li>
            </ul>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-amber-800 text-sm">
                <strong>Please note:</strong> EWA Tracker Ltd does not deliver 18th Edition, Inspection &amp; Testing, or AM2 assessments. These are provided by separate training providers and NET assessment centres. We can recommend approved providers during your consultation.
              </p>
            </div>
          </div>

          {/* Section 4: Process */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Clock className="w-8 h-8 text-blue-700" />
              <h2 className="text-2xl font-bold text-gray-900">How the EWA Process Works (Step-by-Step)</h2>
            </div>
            <p className="text-gray-700 mb-6">
              Our streamlined EWA process is designed to assess your existing competence efficiently. Here is exactly what to expect when pursuing your EAL 5982 Experienced Worker Qualification:
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-4 bg-white border border-gray-200 rounded-lg p-4">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">1</span>
                <div>
                  <h3 className="font-semibold text-gray-900">Initial Skills Scan</h3>
                  <p className="text-gray-600 text-sm">Complete our online <Link href="/candidate-check" className="text-blue-600 hover:underline">TESP Skills Scan</Link> to assess your current knowledge and experience levels. This free assessment helps determine your suitability for the EAL 5982 Experienced Worker Qualification route.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 bg-white border border-gray-200 rounded-lg p-4">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">2</span>
                <div>
                  <h3 className="font-semibold text-gray-900">Free Consultation Call</h3>
                  <p className="text-gray-600 text-sm">Book a no-obligation consultation to discuss your experience, review your existing qualifications, and determine the best pathway. We will explain the full process and answer any questions about the EAL 5982 Experienced Worker Qualification.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 bg-white border border-gray-200 rounded-lg p-4">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">3</span>
                <div>
                  <h3 className="font-semibold text-gray-900">Registration &amp; Portfolio Development</h3>
                  <p className="text-gray-600 text-sm">Once registered with EAL, you will begin building your evidence portfolio. This includes photographs of your work, certificates, job sheets, completion records, and witness testimonies demonstrating competence across all required units.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 bg-white border border-gray-200 rounded-lg p-4">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">4</span>
                <div>
                  <h3 className="font-semibold text-gray-900">Professional Discussion</h3>
                  <p className="text-gray-600 text-sm">Participate in a structured professional discussion with our qualified assessors. This allows you to demonstrate your underpinning knowledge, technical understanding, and approach to electrical work.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 bg-white border border-gray-200 rounded-lg p-4">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">5</span>
                <div>
                  <h3 className="font-semibold text-gray-900">Workplace Observation</h3>
                  <p className="text-gray-600 text-sm">Our assessors will observe you carrying out electrical work on live installations to verify your practical competence. This takes place at your normal workplace during your regular duties.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 bg-white border border-gray-200 rounded-lg p-4">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">6</span>
                <div>
                  <h3 className="font-semibold text-gray-900">Certification</h3>
                  <p className="text-gray-600 text-sm">Upon successful completion of all assessment components, you receive your EAL Level 3 Electrotechnical Experienced Worker Qualification certificate. You are now eligible to apply for ECS Gold Card status.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 5: How Long Does It Take */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 md:p-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How Long Does the EAL 5982 Experienced Worker Qualification Take?</h2>
            <p className="text-gray-700 mb-4">
              The duration of your EAL 5982 Experienced Worker Qualification journey depends on several factors, including your existing qualifications, the quality of evidence you can provide, and your availability for assessments.
            </p>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-blue-700 mb-2">3-6</p>
                <p className="text-gray-600 text-sm">Months typical completion time</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-blue-700 mb-2">4-6</p>
                <p className="text-gray-600 text-sm">Assessment sessions required</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-blue-700 mb-2">Flexible</p>
                <p className="text-gray-600 text-sm">Scheduling around your work</p>
              </div>
            </div>
            <p className="text-gray-700 mb-4">
              Most candidates complete the EAL 5982 Experienced Worker Qualification within 3-6 months. Well-prepared candidates with comprehensive portfolios and good evidence can complete more quickly. We work flexibly around your work schedule to minimise disruption.
            </p>
            <p className="text-gray-600 text-sm italic">
              Unlike traditional apprenticeships that take 3-4 years, the EWA route recognises your existing experience, making it significantly faster for qualified candidates.
            </p>
          </div>

          {/* Section 6: Cost */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 md:p-8 mb-12">
            <div className="flex items-center gap-3 mb-4">
              <Award className="w-8 h-8 text-amber-700" />
              <h2 className="text-2xl font-bold text-gray-900">Cost of the EAL 5982 Experienced Worker Qualification</h2>
            </div>
            <p className="text-gray-700 mb-4">
              The investment for your EAL 5982 Experienced Worker Qualification includes EAL registration fees and centre assessment costs. During your initial consultation, we provide a full breakdown based on your individual circumstances.
            </p>
            <div className="bg-white border border-amber-300 rounded-lg p-4 mb-4">
              <p className="text-gray-800"><strong>EAL Registration Fee:</strong> Currently £224 for new registrations (£15 for transfers from another centre)</p>
            </div>
            <p className="text-gray-700 mb-4">
              Assessment and centre fees are discussed during your consultation, as these vary depending on your location, evidence requirements, and the number of assessment sessions needed. We offer competitive pricing and payment plans where appropriate.
            </p>
            <p className="text-gray-600 text-sm">
              For detailed pricing information, please visit our <Link href="/ewa-cost" className="text-blue-600 hover:underline">EWA costs page</Link> or book a free consultation to receive a personalised quote.
            </p>
          </div>

          {/* Section 7: ECS Gold Card */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="w-8 h-8 text-blue-700" />
              <h2 className="text-2xl font-bold text-gray-900">EAL 5982 Experienced Worker Qualification and the ECS Gold Card</h2>
            </div>
            <p className="text-gray-700 mb-4">
              The <Link href="/ecs-gold-card-experienced-worker" className="text-blue-600 hover:underline">ECS Gold Card</Link> is the industry-standard identification card required for electricians working on major construction sites across the UK. Achieving your EAL 5982 Experienced Worker Qualification is the key step towards obtaining this prestigious credential.
            </p>
            <p className="text-gray-700 mb-4">
              The ECS Gold Card demonstrates to employers, contractors, and clients that you hold a recognised Level 3 qualification and are competent to carry out electrical installation and maintenance work. It is increasingly required for site access on large commercial, industrial, and infrastructure projects.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-blue-800">
                <strong>To obtain your ECS Gold Card after completing the EAL 5982 Experienced Worker Qualification, you will need:</strong>
              </p>
              <ul className="mt-2 space-y-1 text-blue-700 text-sm">
                <li>• Your EAL 5982 Level 3 certificate</li>
                <li>• 18th Edition (BS 7671) certificate</li>
                <li>• Level 3 Inspection &amp; Testing qualification</li>
                <li>• AM2E practical assessment pass</li>
              </ul>
            </div>
            <p className="text-gray-700">
              We can guide you through the complete pathway from EAL 5982 Experienced Worker Qualification to ECS Gold Card application, including recommending providers for the additional qualifications and assessments required.
            </p>
          </div>

          {/* Section 8: Skills Scan CTA */}
          <div className="bg-blue-700 text-white rounded-xl p-8 text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Check Your Eligibility for the EAL 5982 Experienced Worker Qualification</h2>
            <p className="text-lg mb-6 opacity-90">
              Not sure if you qualify? Take our free Skills Scan to assess your current knowledge and experience levels. It only takes a few minutes and gives you an instant indication of your suitability.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/candidate-check"
                className="bg-white text-blue-700 px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Start Free Skills Scan
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

          {/* Section 9: FAQ */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <HelpCircle className="w-8 h-8 text-blue-700" />
              <h2 className="text-2xl font-bold text-gray-900">Frequently Asked Questions About the EAL 5982 Experienced Worker Qualification</h2>
            </div>
            
            <div className="space-y-4">
              <details className="bg-white border border-gray-200 rounded-lg">
                <summary className="p-4 cursor-pointer font-semibold text-gray-900 hover:bg-gray-50">
                  What is the difference between EAL 5982 and NVQ Level 3?
                </summary>
                <div className="px-4 pb-4 text-gray-700 text-sm">
                  The EAL 5982 Experienced Worker Qualification is essentially the modern replacement for the older NVQ Level 3 in Electrical Installation. Both are Level 3 qualifications that demonstrate competence in electrical work. The EAL 5982 Experienced Worker Qualification uses updated assessment methods and aligns with current industry standards and BS 7671 requirements. For <strong>NVQ Level 3 electricians</strong> seeking updated credentials, this is the direct equivalent.
                </div>
              </details>

              <details className="bg-white border border-gray-200 rounded-lg">
                <summary className="p-4 cursor-pointer font-semibold text-gray-900 hover:bg-gray-50">
                  How much does the EAL 5982 Experienced Worker Qualification cost?
                </summary>
                <div className="px-4 pb-4 text-gray-700 text-sm">
                  The EAL registration fee is currently £224 for new registrations. Centre assessment fees vary depending on your circumstances. We provide a full breakdown during your free consultation. Visit our <Link href="/ewa-cost" className="text-blue-600 hover:underline">EWA costs page</Link> for more information.
                </div>
              </details>

              <details className="bg-white border border-gray-200 rounded-lg">
                <summary className="p-4 cursor-pointer font-semibold text-gray-900 hover:bg-gray-50">
                  How long does the EAL 5982 Experienced Worker Qualification take to complete?
                </summary>
                <div className="px-4 pb-4 text-gray-700 text-sm">
                  Most candidates complete the EAL 5982 Experienced Worker Qualification within 3-6 months. The exact duration depends on your existing evidence, availability for assessments, and how quickly you can compile your portfolio. Well-prepared candidates can complete faster.
                </div>
              </details>

              <details className="bg-white border border-gray-200 rounded-lg">
                <summary className="p-4 cursor-pointer font-semibold text-gray-900 hover:bg-gray-50">
                  Can I get an ECS Gold Card with the EAL 5982 Experienced Worker Qualification?
                </summary>
                <div className="px-4 pb-4 text-gray-700 text-sm">
                  Yes, the EAL 5982 Experienced Worker Qualification is one of the accepted qualifications for the <Link href="/ecs-gold-card-experienced-worker" className="text-blue-600 hover:underline">ECS Gold Card experienced worker route</Link>. You will also need 18th Edition, Inspection &amp; Testing, and AM2E to complete the Gold Card requirements.
                </div>
              </details>

              <details className="bg-white border border-gray-200 rounded-lg">
                <summary className="p-4 cursor-pointer font-semibold text-gray-900 hover:bg-gray-50">
                  What evidence do I need for the EAL 5982 portfolio?
                </summary>
                <div className="px-4 pb-4 text-gray-700 text-sm">
                  Your portfolio should include photographs of your work, job sheets, completion certificates, witness testimonies from supervisors or clients, training records, and any existing qualifications. We guide you through exactly what evidence is needed during the assessment process.
                </div>
              </details>

              <details className="bg-white border border-gray-200 rounded-lg">
                <summary className="p-4 cursor-pointer font-semibold text-gray-900 hover:bg-gray-50">
                  Do I need 5 years experience for the EAL 5982?
                </summary>
                <div className="px-4 pb-4 text-gray-700 text-sm">
                  Yes, the EAL 5982 Experienced Worker Qualification requires a minimum of 5 years verifiable industry experience. If you have less experience or work primarily in domestic settings, the <Link href="/electrotechnical-dwellings-ewa" className="text-blue-600 hover:underline">Electrotechnical in Dwellings qualification (610/2859/9)</Link> requires only 3 years and may be more suitable.
                </div>
              </details>

              <details className="bg-white border border-gray-200 rounded-lg">
                <summary className="p-4 cursor-pointer font-semibold text-gray-900 hover:bg-gray-50">
                  Is the EAL 5982 Experienced Worker Qualification recognised by employers?
                </summary>
                <div className="px-4 pb-4 text-gray-700 text-sm">
                  Absolutely. The EAL 5982 Experienced Worker Qualification is a nationally recognised Level 3 qualification regulated by Ofqual. It is accepted by all major employers, contractors, and is the required qualification for ECS Gold Card applications. It demonstrates the same competence as completing a full electrical apprenticeship.
                </div>
              </details>
            </div>
          </div>

          {/* Internal Links */}
          <div className="pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Pages</h3>
            <div className="flex flex-wrap gap-3">
              <Link href="/ecs-gold-card-experienced-worker" className="inline-flex items-center gap-1 text-blue-600 hover:underline">
                <ArrowRight className="w-4 h-4" /> ECS Gold Card Experienced Worker Route
              </Link>
              <Link href="/electrotechnical-dwellings-ewa" className="inline-flex items-center gap-1 text-blue-600 hover:underline">
                <ArrowRight className="w-4 h-4" /> Electrotechnical in Dwellings (3 Years)
              </Link>
              <Link href="/ewa-electrician-uk" className="inline-flex items-center gap-1 text-blue-600 hover:underline">
                <ArrowRight className="w-4 h-4" /> EWA for UK Electricians
              </Link>
              <Link href="/candidate-check" className="inline-flex items-center gap-1 text-blue-600 hover:underline">
                <ArrowRight className="w-4 h-4" /> Free Skills Scan
              </Link>
              <Link href="/ewa-cost" className="inline-flex items-center gap-1 text-blue-600 hover:underline">
                <ArrowRight className="w-4 h-4" /> EWA Costs
              </Link>
              <Link href="/services" className="inline-flex items-center gap-1 text-blue-600 hover:underline">
                <ArrowRight className="w-4 h-4" /> All Services
              </Link>
            </div>
          </div>

        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
