import type { Metadata } from "next"
import DocumentManager from "@/components/document-manager"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"

export const metadata: Metadata = {
  title: "Policies & Procedures",
  description:
    "Access EWA Tracker Ltd policies and procedures including complaints, appeals, data protection, safeguarding, and quality assurance documentation.",
  alternates: {
    canonical: "https://ewatracker.co.uk/policies",
  },
  openGraph: {
    title: "Policies & Procedures - EWA Tracker Ltd",
    description:
      "Access our comprehensive policies and procedures documentation for learners and assessors.",
    url: "https://ewatracker.co.uk/policies",
  },
}

export default function PoliciesPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <SiteHeader />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-700 to-blue-900 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Policies & Procedures</h1>
          <p className="text-lg md:text-xl opacity-90 max-w-3xl mx-auto">
            Access our comprehensive documentation covering learner support, quality assurance, and regulatory compliance.
          </p>
        </div>
      </section>

      {/* Document Manager */}
      <DocumentManager />

      <SiteFooter />
    </div>
  )
}
