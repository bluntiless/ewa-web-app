import Image from "next/image"
import Link from "next/link" // Import Link for navigation
import { Apple, Download, Info, CheckCircle, Lightbulb, Cloud, Smartphone, Award } from "lucide-react"
import DocumentManager from "@/components/document-manager"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Header/Navigation */}
      <header className="w-full bg-white shadow-sm py-4 px-6 md:px-8 lg:px-12 flex justify-between items-center">
        <Link href="/">
          <Image src="/ewa_logo.png" alt="EWA Tracker Logo" width={120} height={40} className="object-contain" />
        </Link>
        <nav className="hidden md:flex space-x-6">
          <Link href="/" className="text-blue-700 font-medium transition-colors">
            Home
          </Link>
          <Link href="/about" className="text-gray-700 hover:text-blue-700 font-medium transition-colors">
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

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-700 to-blue-900 text-white py-20 md:py-28 lg:py-36 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <Image
            src="/electrical-images/ewa-advert.png"
            alt="Background pattern"
            layout="fill"
            objectFit="cover"
            className="mix-blend-multiply"
          />
        </div>
        <div className="max-w-6xl mx-auto px-4 relative z-10 text-center">
          <Image
            src="/ewa_logo.png"
            alt="EWA Tracker Logo"
            width={250}
            height={100}
            className="mx-auto mb-8 drop-shadow-lg"
            priority
          />
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">EWA Tracker Limited</h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 opacity-90">
            Your trusted partner for Electrotechnical Experienced Worker Assessment (EWA) Level 3 qualification.
            Pending recognition by EAL.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/services" // Changed to link to services page
              className="bg-white text-blue-700 px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
            >
              Explore Qualifications
            </Link>
            <Link
              href="/contact" // Changed to link to contact page
              className="border border-white text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-white hover:text-blue-700 transition-colors shadow-lg"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Qualifications Overview Section */}
      <section id="qualifications" className="py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Recognised Qualifications</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              EWA Tracker Limited offers qualifications for experienced electrical workers, with EAL recognition pending.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <Award className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    EAL Electrotechnical Experienced Worker Assessment (EWA) Level 3
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
                layout="fill"
                objectFit="cover"
                className="object-center"
              />
            </div>
          </div>
        </div>
      </section>

      {/* EWA Candidate Showcase Section */}
      <section className="py-16 md:py-24 bg-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">EWA Candidate Showcase</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Highlighting key skills, essential tools, and critical safety practices for experienced electricians
              pursuing the EWA qualification.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-transform hover:scale-105 duration-300">
              <Image
                src="/electrical-images/conduit-bent.png"
                alt="Conduit Bending"
                width={400}
                height={250}
                className="w-full h-48 object-cover"
              />
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Precision Conduit Bending</h3>
                <p className="text-gray-600 text-sm">
                  Showcasing the meticulous skill required for high-quality electrical conduit installations.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-transform hover:scale-105 duration-300">
              <Image
                src="/electrical-images/tools.png"
                alt="Essential Electrical Tools"
                width={400}
                height={250}
                className="w-full h-48 object-cover"
              />
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Comprehensive Toolset</h3>
                <p className="text-gray-600 text-sm">
                  A display of the diverse and essential tools vital for professional electrical work.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-transform hover:scale-105 duration-300">
              <Image
                src="/electrical-images/PPE.png"
                alt="Electrical Safety Gear"
                width={400}
                height={250}
                className="w-full h-48 object-cover"
              />
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Critical Safety Equipment</h3>
                <p className="text-gray-600 text-sm">
                  Emphasizing the importance of personal protective equipment in ensuring workplace safety.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-transform hover:scale-105 duration-300">
              <Image
                src="/electrical-images/ewa-advert.png"
                alt="EWA Electrotechnical Experienced Worker Assessment"
                width={400}
                height={250}
                className="w-full h-48 object-cover"
              />
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">EWA Qualification Journey</h3>
                <p className="text-gray-600 text-sm">
                  An overview of the Electrotechnical Experienced Worker Assessment (EWA) qualification process.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* iOS App Showcase Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our iOS Mobile Application</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Empowering learners to track progress, upload evidence, and manage EWA qualifications seamlessly on the
              go.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Qualifications Overview */}
            <div className="bg-gray-50 rounded-xl shadow-md p-6 flex flex-col items-center text-center">
              <div className="mb-4 w-full max-w-[200px] h-[400px] relative">
                <Image
                  src="/app-screenshots/qualifications.png"
                  alt="Qualifications Overview"
                  layout="fill"
                  objectFit="contain"
                  className="rounded-lg border border-gray-200 shadow-inner"
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Qualifications Overview</h3>
              <p className="text-gray-600 text-sm">
                View all available EWA qualifications and track completion progress across multiple units.
              </p>
            </div>

            {/* Units and Progress */}
            <div className="bg-gray-50 rounded-xl shadow-md p-6 flex flex-col items-center text-center">
              <div className="mb-4 w-full max-w-[200px] h-[400px] relative">
                <Image
                  src="/app-screenshots/units-overview.png"
                  alt="Units Overview"
                  layout="fill"
                  objectFit="contain"
                  className="rounded-lg border border-gray-200 shadow-inner"
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Unit Progress Tracking</h3>
              <p className="text-gray-600 text-sm">
                Monitor progress across NETP3 units including Health & Safety, Electrical Installation, and more.
              </p>
            </div>

            {/* Learning Outcomes */}
            <div className="bg-gray-50 rounded-xl shadow-md p-6 flex flex-col items-center text-center">
              <div className="mb-4 w-full max-w-[200px] h-[400px] relative">
                <Image
                  src="/app-screenshots/learning-outcomes.png"
                  alt="Learning Outcomes"
                  layout="fill"
                  objectFit="contain"
                  className="rounded-lg border border-gray-200 shadow-inner"
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Learning Outcomes</h3>
              <p className="text-gray-600 text-sm">
                Detailed breakdown of learning outcomes and criteria with checkbox tracking for completion.
              </p>
            </div>

            {/* Upload Options */}
            <div className="bg-gray-50 rounded-xl shadow-md p-6 flex flex-col items-center text-center">
              <div className="mb-4 w-full max-w-[200px] h-[400px] relative">
                <Image
                  src="/app-screenshots/upload-options.png"
                  alt="Upload Options"
                  layout="fill"
                  objectFit="contain"
                  className="rounded-lg border border-gray-200 shadow-inner"
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Multiple Upload Types</h3>
              <p className="text-gray-600 text-sm">
                Submit photos, videos, and documents as evidence for each criteria with intuitive color-coded buttons.
              </p>
            </div>

            {/* Photo Upload */}
            <div className="bg-gray-50 rounded-xl shadow-md p-6 flex flex-col items-center text-center">
              <div className="mb-4 w-full max-w-[200px] h-[400px] relative">
                <Image
                  src="/app-screenshots/photo-upload.png"
                  alt="Photo Upload"
                  layout="fill"
                  objectFit="contain"
                  className="rounded-lg border border-gray-200 shadow-inner"
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Evidence Upload</h3>
              <p className="text-gray-600 text-sm">
                Easily select and upload multiple photos showing real workplace electrical installations and safety
                procedures.
              </p>
            </div>

            {/* Profile & SharePoint */}
            <div className="bg-gray-50 rounded-xl shadow-md p-6 flex flex-col items-center text-center">
              <div className="mb-4 w-full max-w-[200px] h-[400px] relative">
                <Image
                  src="/app-screenshots/profile.png"
                  alt="Profile and SharePoint Settings"
                  layout="fill"
                  objectFit="contain"
                  className="rounded-lg border border-gray-200 shadow-inner"
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Profile & SharePoint Integration</h3>
              <p className="text-gray-600 text-sm">
                Manage personal information and configure SharePoint integration for seamless evidence storage.
              </p>
            </div>
          </div>

          {/* Key Features */}
          <div className="mt-16 bg-blue-700 text-white rounded-xl shadow-lg p-8 md:p-10">
            <h3 className="text-2xl md:text-3xl font-bold mb-8 text-center">Key App Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-start space-x-4">
                <Lightbulb className="w-7 h-7 text-blue-200 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-xl">Real-time Progress Tracking</h4>
                  <p className="text-blue-100 text-base mt-1">
                    Monitor completion status across all NETP3 units and criteria.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Smartphone className="w-7 h-7 text-blue-200 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-xl">Multi-format Evidence Upload</h4>
                  <p className="text-blue-100 text-base mt-1">
                    Submit photos, videos, and documents directly from your device.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Cloud className="w-7 h-7 text-blue-200 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-xl">SharePoint Integration</h4>
                  <p className="text-blue-100 text-base mt-1">
                    Secure cloud storage with enterprise-grade SharePoint platform.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Info className="w-7 h-7 text-blue-200 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-xl">Assessment Management</h4>
                  <p className="text-blue-100 text-base mt-1">Track evidence approval status and assessor feedback.</p>
                </div>
              </div>
            </div>
            <div className="mt-10 text-center">
              <a
                href="https://apps.apple.com/gb/app/ewa-tracker/id6740567747"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-8 py-4 rounded-full shadow-lg font-bold text-blue-700 bg-white hover:bg-gray-100 transition-colors text-lg"
              >
                <Apple className="w-6 h-6 mr-3" />
                Download on the App&nbsp;Store
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Policies and Procedures Section */}
      <DocumentManager />

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

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8 text-center">
        <div className="max-w-6xl mx-auto px-4">
          <p>&copy; {new Date().getFullYear()} EWA Tracker Limited. All rights reserved.</p>
          <p className="mt-2 text-sm">Registered in England and Wales. Company No. 12345678.</p>
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
