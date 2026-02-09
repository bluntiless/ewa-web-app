import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Mail, Users, Briefcase, Star } from "lucide-react"

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn more about EWA Tracker Limited, our mission, and our commitment to quality electrotechnical assessments for experienced electricians across the UK.",
  alternates: {
    canonical: "https://ewatracker.co.uk/about",
  },
  openGraph: {
    title: "About Us - EWA Tracker Limited",
    description:
      "Learn more about EWA Tracker Limited, our mission, and our commitment to quality electrotechnical assessments.",
    url: "https://ewatracker.co.uk/about",
  },
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Header/Navigation */}
      <header className="w-full bg-white shadow-sm py-4 px-6 md:px-8 lg:px-12 flex justify-between items-center">
        <Link href="/">
          <Image src="/ewa_logo.png" alt="EWA Tracker Logo" width={120} height={40} className="object-contain" />
        </Link>
        <nav className="hidden md:flex space-x-6">
          <Link href="/" className="text-gray-700 hover:text-blue-700 font-medium transition-colors">
            Home
          </Link>
          <Link href="/about" className="text-blue-700 font-medium transition-colors">
            About Us
          </Link>
          <Link href="/services" className="text-gray-700 hover:text-blue-700 font-medium transition-colors">
            Services
          </Link>
          <Link href="/contact" className="text-gray-700 hover:text-blue-700 font-medium transition-colors">
            Contact
          </Link>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-16 md:py-24">
        <section className="bg-white rounded-xl shadow-lg p-8 md:p-12 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 text-center">About EWA Tracker Limited</h1>
          <p className="text-lg text-gray-700 leading-relaxed mb-8 text-center max-w-3xl mx-auto">
            EWA Tracker Limited is dedicated to providing high-quality Electrotechnical Experienced Worker Assessment
            (EWA) Level 3 qualifications. We are pending recognition by EAL and committed to supporting experienced
            electricians in achieving their professional certifications.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <Users className="w-6 h-6 mr-2 text-blue-600" /> Our Mission
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Our mission is to empower experienced electrical workers by providing accessible, efficient, and
                reliable assessment pathways to formal qualifications. We aim to bridge the gap between practical
                experience and certified competence, ensuring industry standards are met and exceeded.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <Briefcase className="w-6 h-6 mr-2 text-blue-600" /> Our Values
              </h2>
              <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2">
                <li>**Excellence**: Upholding the highest standards in assessment and service delivery.</li>
                <li>**Integrity**: Conducting all operations with honesty, transparency, and fairness.</li>
                <li>**Support**: Providing comprehensive guidance and support to all our learners.</li>
                <li>**Innovation**: Utilizing modern technology to streamline the assessment process.</li>
                <li>**Compliance**: Adhering strictly to all regulatory and awarding body requirements.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* New Testimonials Section */}
        <section className="bg-gray-100 rounded-xl shadow-lg p-8 md:p-12 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-10 text-center">What Our Clients Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center">
              <div className="flex text-yellow-500 mb-3">
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
              </div>
              <p className="text-lg text-gray-700 italic mb-4">
                “My assessor Wayne was very helpful and guided me through my EWA Level 3. He made the whole process
                smooth and clear. Highly recommend!”
              </p>
              <p className="text-sm font-semibold text-gray-600">— Google Review</p>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center">
              <div className="flex text-yellow-500 mb-3">
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
              </div>
              <p className="text-lg text-gray-700 italic mb-4">
                “Wayne is brilliant! His knowledge and approach made a stressful process much easier. Thanks again for
                the support!”
              </p>
              <p className="text-sm font-semibold text-gray-600">— Google Review</p>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center">
              <div className="flex text-yellow-500 mb-3">
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
              </div>
              <p className="text-lg text-gray-700 italic mb-4">
                “Couldn’t have done it without Wayne. Very knowledgeable and approachable assessor. Would recommend to
                anyone doing their EWA.”
              </p>
              <p className="text-sm font-semibold text-gray-600">— Google Review</p>
            </div>
          </div>
        </section>

        <section className="bg-blue-700 text-white rounded-xl shadow-lg p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold mb-6">Committed to Your Success</h2>
          <p className="text-lg opacity-90 max-w-3xl mx-auto mb-8">
            We believe in the value of experience and are here to help you gain the recognition you deserve. Our team of
            qualified assessors and support staff are dedicated to making your assessment journey as smooth and
            successful as possible.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center px-8 py-3 rounded-full text-lg font-semibold bg-white text-blue-700 hover:bg-gray-100 transition-colors shadow-lg"
          >
            <Mail className="w-5 h-5 mr-2" /> Get in Touch
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8 text-center">
        <div className="max-w-6xl mx-auto px-4">
          <p>&copy; {new Date().getFullYear()} EWA Tracker Limited. All rights reserved.</p>
          <p className="mt-2 text-sm">Registered in England and Wales. Company No. 16413190.</p>
          <div className="flex justify-center space-x-4 mt-4">
            <a
              href="https://linkedin.com/company/ewatracker"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              LinkedIn
            </a>
            <a
              href="https://twitter.com/ewatracker"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Twitter
            </a>
            <a
              href="https://github.com/ewatracker"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
