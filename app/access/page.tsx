"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Mail, KeyRound, AlertCircle, ArrowRight, FileText, Award, Clock } from "lucide-react"
import Link from "next/link"

export default function CandidateAccessPage() {
  const [accessCode, setAccessCode] = useState("")
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // TODO: Implement candidate authentication/portfolio lookup
      // For now, show a message that this feature is coming soon
      setTimeout(() => {
        setError("Portfolio access is coming soon. Please contact your training provider for updates.")
        setIsLoading(false)
      }, 1000)
    } catch (err) {
      setError("An error occurred. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Link href="https://www.ewatracker.co.uk" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">EWA</span>
            </div>
            <span className="font-semibold text-gray-900">EWA Tracker</span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Info */}
          <div className="order-2 lg:order-1">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Candidate Portfolio
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Access your EWA assessment progress, uploaded documents, and qualification status all in one place.
            </p>

            {/* Feature Cards */}
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Document Tracking</h3>
                  <p className="text-gray-600 text-sm">View and manage your uploaded documents, skills scans, and background forms.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Progress Updates</h3>
                  <p className="text-gray-600 text-sm">Track your assessment stages and see real-time status updates.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Award className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Qualification Status</h3>
                  <p className="text-gray-600 text-sm">Check your ECS Gold Card eligibility and certification progress.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Login Form */}
          <div className="order-1 lg:order-2">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Access Your Portfolio</h2>
                <p className="text-gray-500 text-sm mt-2">
                  Enter your details to view your assessment progress
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="mt-1.5"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="accessCode" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <KeyRound className="w-4 h-4" />
                    Access Code
                  </Label>
                  <Input
                    id="accessCode"
                    type="text"
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                    placeholder="Enter your unique access code"
                    className="mt-1.5 uppercase tracking-wider"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1.5">
                    Your access code was provided in your welcome email from EWA Tracker.
                  </p>
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-amber-700 text-sm bg-amber-50 p-3 rounded-lg border border-amber-200">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 py-3 text-base"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    "Accessing Portfolio..."
                  ) : (
                    <>
                      Access Portfolio
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-center text-sm text-gray-600">
                  {"Don't have an access code?"}
                </p>
                <div className="mt-3 flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href="https://www.ewatracker.co.uk/contact">
                    <Button variant="outline" size="sm" className="w-full sm:w-auto">
                      Contact Support
                    </Button>
                  </Link>
                  <Link href="https://www.ewatracker.co.uk/eligibility">
                    <Button variant="outline" size="sm" className="w-full sm:w-auto">
                      Check Eligibility
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Help Text */}
            <p className="text-center text-gray-400 text-xs mt-6">
              EWA Tracker Ltd - Candidate Portal
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} EWA Tracker Ltd. All rights reserved.</p>
          <div className="mt-2 space-x-4">
            <Link href="https://www.ewatracker.co.uk/policies" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="https://www.ewatracker.co.uk/contact" className="hover:text-white transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
