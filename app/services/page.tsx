import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { GraduationCap, Award, ClipboardCheck } from "lucide-react"
import { MobileNav } from "@/components/mobile-nav"

export const metadata = {
  title: "Our Services - EWA Tracker Limited",
  description:
    "Professional electrical assessment and qualification services including EWA, ECS Gold Card route, and online skills assessment tools.",
  keywords: "EWA assessment, ECS Gold Card, electrical qualifications, skills scan",
}

export default function ServicesPage() {
  const services = [
    {
      icon: <GraduationCap className="w-8 h-8" />,
      title: "Experienced Worker Assessment (EWA)",
      description:
        "Professional assessment for experienced electricians seeking formal recognition of their skills and knowledge through the EWA qualification pathway.",
      link: "/ewa-assessment",
      buttonText: "Learn More",
      color: "bg-blue-50 border-blue-200 hover:bg-blue-100",
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "ECS Gold Card Route",
      description:
        "Fast-track pathway to obtaining your ECS Gold Card through our structured assessment and qualification process.",
      link: "/ecs-gold-card-route",
      buttonText: "Get Started",
      color: "bg-orange-50 border-orange-200 hover:bg-orange-100",
    },
    {
      icon: <ClipboardCheck className="w-8 h-8" />,
      title: "Online Skills Scan Tool",
      description:
        "Free online self-assessment tool to evaluate your readiness for electrical qualifications and identify areas for development.",
      link: "/candidate-check",
      buttonText: "Take Assessment",
      color: "bg-teal-50 border-teal-200 hover:bg-teal-100",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header/Navigation */}
      <header className="w-full bg-white shadow-sm py-4 px-6 md:px-8 lg:px-12 flex justify-between items-center">
        <Link href="/">
          <Image src="/ewa_logo.png" alt="EWA Tracker Logo" width={120} height={40} className="object-contain" />
        </Link>
        <div className="flex items-center">
          <nav className="hidden md:flex space-x-6">
            <Link href="/" className="text-gray-700 hover:text-blue-700 font-medium transition-colors">
              Home
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-blue-700 font-medium transition-colors">
              About Us
            </Link>
            <Link href="/services" className="text-blue-700 font-medium transition-colors">
              Services
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-blue-700 font-medium transition-colors">
              Contact
            </Link>
          </nav>
          <MobileNav className="md:hidden" />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-16 md:py-24">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Our Services</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Professional electrical assessment and qualification services designed to advance your career and validate
            your expertise in the electrical industry.
          </p>
        </section>

        {/* Services Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className={`${service.color} border-2 transition-all duration-300 hover:shadow-lg`}>
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4 text-gray-700">{service.icon}</div>
                <CardTitle className="text-xl font-bold text-gray-900 mb-2">{service.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-gray-600 mb-6 leading-relaxed">{service.description}</CardDescription>
                <Button asChild className="w-full">
                  <Link href={service.link}>{service.buttonText}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* Call to Action */}
        <section className="mt-16 text-center bg-white rounded-xl shadow-lg p-8 md:p-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Advance Your Electrical Career?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Take the first step towards professional recognition with our comprehensive assessment and qualification
            services.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/candidate-check">Start Skills Assessment</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8 text-center">
        <div className="max-w-6xl mx-auto px-4">
          <p>&copy; {new Date().getFullYear()} EWA Tracker Limited. All rights reserved.</p>
          <p className="mt-2 text-sm">Registered in England and Wales. Company&nbsp;No.&nbsp;16413190.</p>
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
