import type { Metadata } from "next"
import Link from "next/link"
import { 
  ClipboardCheck, 
  Video, 
  Shield, 
  Users, 
  MapPin, 
  FileCheck, 
  MessageSquare, 
  TrendingUp,
  Monitor,
  Clock,
  Globe,
  Zap,
  CheckCircle,
  Building2,
  GraduationCap,
  Briefcase
} from "lucide-react"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"

export const metadata: Metadata = {
  title: "Assessment & IQA Services | EWA Tracker Ltd",
  description:
    "Professional electrotechnical assessment and Internal Quality Assurance (IQA) services for training providers, colleges, and private centres. Face-to-face and remote assessment support.",
  keywords: ["electrotechnical assessment", "IQA services", "internal quality assurance", "assessor services", "remote observation", "training provider support", "portfolio assessment", "EAL assessment"],
  alternates: {
    canonical: "https://ewatracker.co.uk/assessment-iqa-services",
  },
  openGraph: {
    title: "Assessment & IQA Services - EWA Tracker Ltd",
    description:
      "Professional electrotechnical assessment and IQA services for training providers and centres.",
    url: "https://ewatracker.co.uk/assessment-iqa-services",
  },
}

export default function AssessmentIQAServicesPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <SiteHeader />

      <main className="max-w-6xl mx-auto px-4 py-16 md:py-24">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-700 to-blue-900 text-white rounded-xl shadow-lg p-8 md:p-12 mb-12 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Assessment & IQA Services
          </h1>
          <p className="text-lg md:text-xl opacity-90 max-w-3xl mx-auto mb-8">
            Professional electrotechnical assessment services for training providers, colleges, and private centres delivering competency-based electrical qualifications.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center px-6 py-3 rounded-full text-lg font-semibold bg-white text-blue-700 hover:bg-gray-100 transition-colors shadow-lg"
            >
              Discuss Your Requirements
            </Link>
          </div>
        </section>

        {/* Electrical Assessment Services */}
        <section className="bg-white rounded-xl shadow-lg p-8 md:p-12 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-100 rounded-lg">
              <ClipboardCheck className="w-8 h-8 text-blue-700" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Electrical Assessment Services
            </h2>
          </div>
          
          <p className="text-lg text-gray-700 mb-8">
            EWA Tracker Ltd offers professional electrotechnical assessment services for training providers, colleges, and private centres delivering competency-based electrical qualifications.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <MapPin className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900">Workplace Site Observations</h3>
                <p className="text-sm text-gray-600">On-site assessment of practical competencies</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <FileCheck className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900">Performance Assessment</h3>
                <p className="text-sm text-gray-600">Assessment against qualification criteria</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <ClipboardCheck className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900">Evidence Review</h3>
                <p className="text-sm text-gray-600">Portfolio mapping and evidence verification</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <MessageSquare className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900">Professional Discussions</h3>
                <p className="text-sm text-gray-600">Technical questioning and knowledge assessment</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900">Progress Reviews</h3>
                <p className="text-sm text-gray-600">Candidate reviews and action planning</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <Monitor className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900">Remote & Face-to-Face</h3>
                <p className="text-sm text-gray-600">Flexible assessment support options</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-3">Assessment Delivery Options</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-gray-700">Face-to-face on site</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-gray-700">Remote via secure online video assessment</span>
              </div>
            </div>
            <p className="text-sm text-blue-800 mt-4">
              All assessment activities are conducted in line with awarding organisation standards and qualification specifications.
            </p>
          </div>
        </section>

        {/* Remote Online Site Observations */}
        <section className="bg-white rounded-xl shadow-lg p-8 md:p-12 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Video className="w-8 h-8 text-purple-700" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Remote Online Site Observations
            </h2>
          </div>
          
          <p className="text-lg text-gray-700 mb-6">
            Remote observation services are available for suitable activities where live video assessment is acceptable within qualification requirements.
          </p>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-purple-900 mb-4">This service can help:</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Reduce travel costs</span>
              </div>
              <div className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Increase assessment flexibility</span>
              </div>
              <div className="flex items-start gap-3">
                <Globe className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Support geographically dispersed candidates</span>
              </div>
              <div className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Accelerate evidence collection and portfolio completion</span>
              </div>
            </div>
          </div>

          <p className="text-gray-700">
            Remote observations are planned in advance and supported by professional discussion, questioning, and evidence verification to ensure assessment validity and compliance.
          </p>
        </section>

        {/* Internal Quality Assurance (IQA) Services */}
        <section className="bg-white rounded-xl shadow-lg p-8 md:p-12 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-green-100 rounded-lg">
              <Shield className="w-8 h-8 text-green-700" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Internal Quality Assurance (IQA) Services
            </h2>
          </div>
          
          <p className="text-lg text-gray-700 mb-8">
            Remote IQA services are available for centres requiring qualified Internal Quality Assurance support.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Sampling of learner portfolios and assessment decisions</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Standardisation support</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Assessor feedback and guidance</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">IQA documentation and audit trails</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Risk-based sampling strategies</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Support with awarding organisation compliance requirements</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Preparation support for EQA visits and external quality assurance activity</span>
              </div>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800 text-sm">
              All IQA activity is conducted remotely using secure digital systems and documentation review processes.
            </p>
          </div>
        </section>

        {/* Flexible Support Section */}
        <section className="bg-white rounded-xl shadow-lg p-8 md:p-12 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Users className="w-8 h-8 text-orange-700" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Flexible Support for Training Providers & Centres
            </h2>
          </div>

          <p className="text-lg text-gray-700 mb-8">
            Whether you require additional capacity or specialist support, EWA Tracker Ltd can provide flexible professional services tailored to your centre&apos;s requirements.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-5">
              <Briefcase className="w-8 h-8 text-orange-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Additional Assessor Capacity</h3>
              <p className="text-sm text-gray-600">Scale your assessment capacity during busy periods</p>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-5">
              <Shield className="w-8 h-8 text-orange-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Independent IQA Support</h3>
              <p className="text-sm text-gray-600">Impartial quality assurance from external experts</p>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-5">
              <Video className="w-8 h-8 text-orange-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Remote Observation Capability</h3>
              <p className="text-sm text-gray-600">Expand your reach with online assessment options</p>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-5">
              <FileCheck className="w-8 h-8 text-orange-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Portfolio Review Assistance</h3>
              <p className="text-sm text-gray-600">Expert review of candidate evidence and portfolios</p>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-5">
              <Clock className="w-8 h-8 text-orange-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Temporary QA Support</h3>
              <p className="text-sm text-gray-600">Cover for staff absence or increased demand</p>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-5">
              <GraduationCap className="w-8 h-8 text-orange-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Assessor Development</h3>
              <p className="text-sm text-gray-600">Guidance and support for new assessors</p>
            </div>
          </div>
        </section>

        {/* Who We Work With */}
        <section className="bg-gray-100 rounded-xl p-8 md:p-12 mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
            Who We Work With
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 text-center shadow-sm">
              <Building2 className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Training Providers</h3>
              <p className="text-sm text-gray-600">Private training companies delivering electrical qualifications</p>
            </div>
            <div className="bg-white rounded-lg p-6 text-center shadow-sm">
              <GraduationCap className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Colleges</h3>
              <p className="text-sm text-gray-600">Further education colleges with electrotechnical programmes</p>
            </div>
            <div className="bg-white rounded-lg p-6 text-center shadow-sm">
              <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Private Centres</h3>
              <p className="text-sm text-gray-600">Approved assessment centres seeking additional support</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-br from-blue-700 to-blue-900 text-white rounded-xl shadow-lg p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Discuss Your Requirements?</h2>
          <p className="text-lg opacity-90 max-w-3xl mx-auto mb-8">
            Contact us to discuss availability and service arrangements tailored to your centre&apos;s needs.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center px-8 py-3 rounded-full text-lg font-semibold bg-white text-blue-700 hover:bg-gray-100 transition-colors shadow-lg"
          >
            Contact Us Today
          </Link>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
