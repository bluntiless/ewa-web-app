import Image from "next/image"
import Link from "next/link" // Import Link for navigation
import { Apple, Info, CheckCircle, Lightbulb, Cloud, Smartphone, Award, Globe, Star } from "lucide-react" // Import Globe and Star icon
import { MobileNav } from "@/components/mobile-nav"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Header/Navigation */}
      <header className="w-full bg-white shadow-sm py-4 px-6 md:px-8 lg:px-12 flex justify-between items-center">
        <Link href="/">
          <Image src="/ewa_logo.png" alt="EWA Tracker Logo" width={120} height={40} className="object-contain" />
        </Link>
        <div className="flex items-center">
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
          <MobileNav className="md:hidden" />
        </div>
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
            height={300}
            className="mx-auto mb-8 drop-shadow-lg"
            priority
          />
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">EWA Tracker Limited</h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 opacity-90">
            Your trusted partner for Electrotechnical Experienced Worker Assessment (EWA) Level 3 qualification. EAL
            recognition pending.
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
              EWA Tracker Limited is working towards offering EAL-recognised qualifications for experienced electrical
              workers.
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
              <div className="flex items-start space-x-4">
                <Award className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">NVQ Level 3 1605 Qualification</h3>
                  <p className="text-gray-600 mt-2">
                    We are also approved to deliver the NVQ Level 3 1605 qualification, providing robust
                    electrotechnical assessment solutions.
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

      {/* App Showcase Section - Updated for both iOS and Web */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Digital Assessment Tools</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Empowering learners to track progress, upload evidence, and manage EWA qualifications seamlessly on the
              go, whether on iOS or any web-enabled device.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* iOS App - Qualifications Overview */}
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
              <h3 className="text-lg font-semibold text-gray-900 mb-2">iOS App: Qualifications Overview</h3>
              <p className="text-gray-600 text-sm">
                View all available EWA qualifications and track completion progress across multiple units on your iOS
                device.
              </p>
            </div>

            {/* iOS App - Units and Progress */}
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
              <h3 className="text-lg font-semibold text-gray-900 mb-2">iOS App: Unit Progress Tracking</h3>
              <p className="text-gray-600 text-sm">
                Monitor progress across NETP3 units including Health & Safety, Electrical Installation, and more.
              </p>
            </div>

            {/* iOS App - Learning Outcomes */}
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
              <h3 className="text-lg font-semibold text-gray-900 mb-2">iOS App: Learning Outcomes</h3>
              <p className="text-gray-600 text-sm">
                Detailed breakdown of learning outcomes and criteria with checkbox tracking for completion.
              </p>
            </div>

            {/* Web App - Qualifications */}
            <div className="bg-gray-50 rounded-xl shadow-md p-6 flex flex-col items-center text-center">
              <div className="mb-4 w-full max-w-[200px] h-[400px] relative">
                <Image
                  src="/app-screenshots/web-app-qualifications-mobile.jpeg"
                  alt="Web App Qualifications Overview"
                  layout="fill"
                  objectFit="contain"
                  className="rounded-lg border border-gray-200 shadow-inner"
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Web App: Qualifications Overview</h3>
              <p className="text-gray-600 text-sm">
                View all available EWA qualifications and track completion progress across multiple units on the web
                app.
              </p>
            </div>

            {/* Web App - Profile */}
            <div className="bg-gray-50 rounded-xl shadow-md p-6 flex flex-col items-center text-center">
              <div className="mb-4 w-full max-w-[200px] h-[400px] relative">
                <Image
                  src="/app-screenshots/web-app-profile-mobile.jpeg"
                  alt="Web App Profile Settings"
                  layout="fill"
                  objectFit="contain"
                  className="rounded-lg border border-gray-200 shadow-inner"
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Web App: Profile & Settings</h3>
              <p className="text-gray-600 text-sm">
                Manage your personal information and SharePoint integration settings directly in the web app.
              </p>
            </div>

            {/* iOS App - Photo Upload */}
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

            {/* iOS App - Profile & SharePoint */}
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
            <div className="mt-10 text-center flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="https://apps.apple.com/gb/app/ewa-tracker/id6740567747"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-8 py-4 rounded-full shadow-lg font-bold text-blue-700 bg-white hover:bg-gray-100 transition-colors text-lg"
              >
                <Apple className="w-6 h-6 mr-3" />
                Download iOS App
              </a>
              <a
                href="https://ewa-web-app-vl9z.vercel.app/#code=1.AUEB_bFr8I1P1k2-2YrnAsYyubAv7k2oFn5BmeAYIjhAZxZHAXFBAQ.AgABBAIAAABVrSpeuWamRam2jAF1XRQEAwDs_wUA9P_U6Gkqf076CqjS5dmCWm6KRMJPCZusCcgBKIkoASlNMnwk-vvNTeSFZ6DOeuseFcvqD2Pwd9LEUzVqa6reQb1zYL6tq2p-omSlMF9_zjWO284Ds9S7cwfZIW71IcXiIrZlPrabqckqNZAttj9YQuu9I2sxCx96dtoRwRjYEheotdRricZva3sFf4OWFwxxTbBef4EDpbJ6456VJw8nu1XmYkU3rXLkcG7NBPZsPuSw9iRkAroSzQensQu9Q6jReBwPj9M0SzuNJv-VRAp8ZUWqSoiJ18O-1g8h3KBFSBZUnNPCjl5ROiKkeZ6wr8p4fmmwOcmlYwDVPI2zWf0lEWDmOghkF5zgbxGsUNiTP-QIGylkDXrDrTAtCsDUIsOEoAb-j_TvS2344gY_OIyk5MaOUCMjJMhMt--biUtHQABG9-Yan43grJic1nT2c29ftJzSUHWrY7Dz2ExklsUUe_5ZU5BtboJU7x89XcOmwvdWnXTwDHXBRyQtce6XRp5xcgXZnYZ4UvjjereDGUgq9tyLuu-hUcbjxFSOvLlr-Rgpo_E-nUbQPRIckkLj3-PfPEpOlKXFfJDR0PU8_-BvkBDg_ragBk2RCAaDo7yTJHoxfihJy7zJeRk3c5BudYxn4IOFz8lZ5DKds19ai2aNiPYgAZDuTFPMN_21hNHBQpcGs95DTQ33dkeAo8ND_ffYKavIs0HCCwQaiRJQ-uKKbws9HfjmNTavA0Kxk6EFSDyiQw-Z6dfuo4u1xWfOxrvST2VulLN-4I8Wc4dwOpJ0xSTcoYhlA07NBGywO0Aw5iHuZT248wXO0KPdUCFJ_-EiVRHHX7pam6dSqMvUGFqLDRHPu6pGT_icaPdebV_VGmdbTxNJmIGH_7aVbm1euwqOS-6gmUMBUK41gzpO&client_info=eyJ1aWQiOiI2NDUyZTRjZi1hY2ZhLTRlMmUtYTVmYS00NDhiYjU2MTc5MDgiLCJ1dGlkIjoiZjA2YmIxZmQtNGY4ZC00ZGQ2LWJlZDktOGFlNzAyYzYzMmI5In0&state=eyJpZCI6IjAxOTgyNDhjLTczM2YtNzcwNy1hM2YxLWQwMjdhN2Q0NmY5MCIsIm1ldGEiOnsiaW50ZXJhY3Rpb25UeXBlIjoicmVkaXJlY3QifX0%3d&session_state=006d96c9-a1a5-d545-91f8-6ddd86e372e3"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-8 py-4 rounded-full shadow-lg font-bold text-blue-700 bg-white hover:bg-gray-100 transition-colors text-lg"
              >
                <Globe className="w-6 h-6 mr-3" />
                Launch Web App
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Google Reviews Section */}
      <section className="py-16 md:py-24 bg-gray-200 text-gray-800">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12">What Our Clients Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Review 1 */}
            <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center">
              <div className="flex mb-4">
                <Star className="w-6 h-6 text-yellow-500 fill-current" />
                <Star className="w-6 h-6 text-yellow-500 fill-current" />
                <Star className="w-6 h-6 text-yellow-500 fill-current" />
                <Star className="w-6 h-6 text-yellow-500 fill-current" />
                <Star className="w-6 h-6 text-yellow-500 fill-current" />
              </div>
              <p className="text-lg italic text-gray-700 mb-4">
                {
                  "“My assessor Wayne was very helpful and guided me through my NVQ Level 3. He made the whole process smooth and clear. Highly recommend!”"
                }
              </p>
              <p className="text-sm text-gray-600">— Google Review</p>
            </div>
            {/* Review 2 */}
            <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center">
              <div className="flex mb-4">
                <Star className="w-6 h-6 text-yellow-500 fill-current" />
                <Star className="w-6 h-6 text-yellow-500 fill-current" />
                <Star className="w-6 h-6 text-yellow-500 fill-current" />
                <Star className="w-6 h-6 text-yellow-500 fill-current" />
                <Star className="w-6 h-6 text-yellow-500 fill-current" />
              </div>
              <p className="text-lg italic text-gray-700 mb-4">
                {
                  "“Wayne is brilliant! His knowledge and approach made a stressful process much easier. Thanks again for the support!”"
                }
              </p>
              <p className="text-sm text-gray-600">— Google Review</p>
            </div>
            {/* Review 3 */}
            <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center">
              <div className="flex mb-4">
                <Star className="w-6 h-6 text-yellow-500 fill-current" />
                <Star className="w-6 h-6 text-yellow-500 fill-current" />
                <Star className="w-6 h-6 text-yellow-500 fill-current" />
                <Star className="w-6 h-6 text-yellow-500 fill-current" />
                <Star className="w-6 h-6 text-yellow-500 fill-current" />
              </div>
              <p className="text-lg italic text-gray-700 mb-4">
                {
                  "“Couldn’t have done it without Wayne. Very knowledgeable and approachable assessor. Would recommend to anyone doing their EWA.”"
                }
              </p>
              <p className="text-sm text-gray-600">— Google Review</p>
            </div>
          </div>
        </div>
      </section>

      {/* Committed to Your Success Section (formerly Contact Section) */}
      <section id="contact" className="py-16 md:py-24 bg-blue-800 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Committed to Your Success</h2>
          <p className="text-lg opacity-90 mb-8">
            We believe in the value of experience and are here to help you gain the recognition you deserve. Our team of
            qualified assessors and support staff are dedicated to making your assessment journey as smooth and
            successful as possible.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center bg-white text-blue-800 px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
            </svg>
            Get in Touch
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8 text-center">
        <div className="max-w-6xl mx-auto px-4">
          <p>&copy; {new Date().getFullYear()} EWA Tracker Limited. All rights reserved.</p>
          <p className="mt-2 text-sm">Registered in England and Wales. Company No. 16413190.</p>
          <div className="flex justify-center space-x-4 mt-4">
            <a
              href="https://www.instagram.com/ewa_tracker_ltd/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Instagram
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
        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l1.3 9.137a1 1 0 01-.285.867l-2.542 2.542a1 1 0 00-.285.867l.3 2.153a1 1 0 001 .836h.001a1 1 0 00.986-.836l1.3-9.137a1 1 0 01-.285-.867l2.542-2.542a1 1 0 00-.285-.867l-.3-2.153a1 1 0 00-1-.836h-.001a1 1 0 00-.986.836l-1.3 9.137a1 1 0 01-.285.867l-2.542 2.542a1 1 0 00-.285.867l.3-2.153a1 1 0 001-.836h.001z"></path>
        </svg>
      </div>
      <div>
        <h4 className="font-semibold text-gray-900 text-lg group-hover:text-blue-700 transition-colors">{title}</h4>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      </div>
    </a>
  )
}
