import type { Metadata } from "next"
import Link from "next/link"
import { BookOpen, ArrowRight, Clock, User } from "lucide-react"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"

export const metadata: Metadata = {
  title: "EWA Guides & Articles | Electrician Qualification Resources | EWA Tracker Ltd",
  description: "Expert guides on Experienced Worker Assessment, ECS Gold Card routes, and electrician qualifications. Learn about EAL 5982, AM2 assessments, and more.",
  keywords: [
    "EWA guides",
    "electrician qualification guide",
    "ECS Gold Card guide",
    "AM2 assessment guide",
    "EAL 5982 guide",
  ],
  alternates: {
    canonical: "https://ewatracker.co.uk/guides",
  },
  openGraph: {
    title: "EWA Guides & Articles | Electrician Qualification Resources | EWA Tracker Ltd",
    description: "Expert guides on Experienced Worker Assessment, ECS Gold Card routes, and electrician qualifications.",
    url: "https://ewatracker.co.uk/guides",
  },
}

const guides = [
  {
    slug: "what-is-eal-5982-experienced-worker-qualification",
    title: "What is the EAL 5982 Experienced Worker Qualification?",
    description: "A comprehensive guide to understanding the EAL Level 3 Electrotechnical Experienced Worker Qualification (603/5982/1), who it's for, and how to achieve it.",
    readTime: "8 min read",
    category: "Qualifications",
  },
  {
    slug: "do-i-need-am2-for-ecs-gold-card",
    title: "Do I Need AM2E for an ECS Gold Card?",
    description: "Understanding the AM2 assessment requirement for ECS Gold Card applications. Learn about AM2E vs AM2ED and when you need to complete this practical test.",
    readTime: "6 min read",
    category: "ECS Card",
  },
  {
    slug: "ewa-vs-apprenticeship-which-route",
    title: "EWA vs Apprenticeship – Which Route is Right?",
    description: "Comparing the Experienced Worker Assessment route with traditional apprenticeship pathways. Find out which qualification route suits your career situation.",
    readTime: "7 min read",
    category: "Career Advice",
  },
]

export default function GuidesPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <SiteHeader />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-700 to-blue-900 text-white py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <BookOpen className="w-16 h-16 mx-auto mb-6 opacity-90" />
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 leading-tight">
            EWA Guides &amp; Resources
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-6 opacity-90">
            Expert guides to help you understand the Experienced Worker Assessment route, qualification requirements, and your pathway to the ECS Gold Card.
          </p>
        </div>
      </section>

      {/* Guides Grid */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="space-y-6">
            {guides.map((guide) => (
              <Link
                key={guide.slug}
                href={`/guides/${guide.slug}`}
                className="block bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-lg transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded">
                        {guide.category}
                      </span>
                      <span className="text-gray-500 text-sm flex items-center gap-1">
                        <Clock className="w-4 h-4" /> {guide.readTime}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">
                      {guide.title}
                    </h2>
                    <p className="text-gray-600">{guide.description}</p>
                  </div>
                  <ArrowRight className="w-6 h-6 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all flex-shrink-0 mt-2" />
                </div>
              </Link>
            ))}
          </div>

          {/* CTA Section */}
          <div className="mt-12 bg-blue-50 border border-blue-200 rounded-xl p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Start Your EWA Journey?</h2>
            <p className="text-gray-700 mb-6">
              Complete our Skills Scan to assess your eligibility or book a free consultation to discuss your options.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/skills-scan"
                className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Complete Skills Scan
              </Link>
              <a
                href="https://calendly.com/ewatracker-info/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-600 hover:text-white transition-colors"
              >
                Book Free Consultation
              </a>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
