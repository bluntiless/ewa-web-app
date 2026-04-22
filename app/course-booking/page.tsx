"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"
import { CheckCircle, AlertCircle, FileText, Calendar, User, Building2, BookOpen, PenLine } from "lucide-react"
import Link from "next/link"

interface FormData {
  // Section A - Candidate Details
  fullName: string
  dateOfBirth: string
  homeAddress: string
  email: string
  contactNumber: string
  ethnicity: string

  // Section B - Employer Details
  employerName: string
  companyContactName: string
  employerAddress: string
  employerTelephone: string
  employerMobile: string
  employerEmail: string

  // Section C - Course/Booking Details
  qualification: string
  route: string
  preferredStartDate: string
  paymentOption: string
  notes: string

  // Section D - Declaration
  declarationAccepted: boolean

  // Section E - Digital Signature
  digitalSignature: string
}

const initialFormData: FormData = {
  fullName: "",
  dateOfBirth: "",
  homeAddress: "",
  email: "",
  contactNumber: "",
  ethnicity: "",
  employerName: "",
  companyContactName: "",
  employerAddress: "",
  employerTelephone: "",
  employerMobile: "",
  employerEmail: "",
  qualification: "EAL Level 3 Electrotechnical Experienced Worker Qualification",
  route: "Installation EWA (603/5982/1)",
  preferredStartDate: "",
  paymentOption: "",
  notes: "",
  declarationAccepted: false,
  digitalSignature: "",
}

export default function CourseBookingPage() {
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null)
  const [errorMessage, setErrorMessage] = useState("")
  const [submittedData, setSubmittedData] = useState<FormData | null>(null)

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage("")

    // Validation
    if (!formData.fullName.trim()) {
      setErrorMessage("Please enter your full name")
      return
    }
    if (!formData.dateOfBirth) {
      setErrorMessage("Please enter your date of birth")
      return
    }
    if (!formData.homeAddress.trim()) {
      setErrorMessage("Please enter your home address")
      return
    }
    if (!formData.email.trim()) {
      setErrorMessage("Please enter your email address")
      return
    }
    if (!formData.contactNumber.trim()) {
      setErrorMessage("Please enter your contact number")
      return
    }
    if (!formData.qualification) {
      setErrorMessage("Please select a qualification")
      return
    }
    if (!formData.route) {
      setErrorMessage("Please select a route")
      return
    }
    if (!formData.declarationAccepted) {
      setErrorMessage("Please accept the declaration to proceed")
      return
    }
    if (!formData.digitalSignature.trim()) {
      setErrorMessage("Please provide your digital signature (type your full name)")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/course-booking/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Submission failed")
      }

      setSubmittedData(formData)
      setSubmitStatus("success")
    } catch (error) {
      console.error("Submission error:", error)
      setSubmitStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "Failed to submit booking form")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitStatus === "success" && submittedData) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <SiteHeader />
        <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 md:p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Booking Form Submitted</h1>
              <p className="text-gray-600">
                Thank you for submitting your course booking form. We have received your application.
              </p>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8">
              <h3 className="font-semibold text-amber-900 mb-2">Important Information</h3>
              <ul className="text-amber-800 text-sm space-y-2">
                <li>• This booking form submission is <strong>not automatic acceptance</strong> onto the qualification.</li>
                <li>• Your suitability and evidence requirements will be reviewed by our team.</li>
                <li>• You may be required to provide additional documentation or complete a Skills Scan.</li>
                <li>• We will contact you at <strong>{submittedData.email}</strong> with next steps.</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-6 mb-8">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Submission Summary
              </h3>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="text-gray-500">Candidate Name</dt>
                  <dd className="font-medium text-gray-900">{submittedData.fullName}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Email</dt>
                  <dd className="font-medium text-gray-900">{submittedData.email}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Qualification</dt>
                  <dd className="font-medium text-gray-900">{submittedData.qualification}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Route</dt>
                  <dd className="font-medium text-gray-900">{submittedData.route}</dd>
                </div>
                {submittedData.preferredStartDate && (
                  <div>
                    <dt className="text-gray-500">Preferred Start Date</dt>
                    <dd className="font-medium text-gray-900">{submittedData.preferredStartDate}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-gray-500">Digital Signature</dt>
                  <dd className="font-medium text-gray-900">{submittedData.digitalSignature}</dd>
                </div>
              </dl>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/services">
                <Button variant="outline">Return to Services</Button>
              </Link>
              <Link href="/skills-scan">
                <Button className="bg-blue-600 hover:bg-blue-700">Submit Skills Scan</Button>
              </Link>
            </div>
          </div>
        </main>
        <SiteFooter />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <SiteHeader />

      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Course Booking Form</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Complete this form to register your interest in the EAL Level 3 Electrotechnical Experienced Worker Qualification.
            All fields marked with * are required.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section A - Candidate Details */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Section A — Candidate Details</h2>
                <p className="text-sm text-gray-500">Your personal information</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  placeholder="Enter your full legal name"
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="contactNumber">Contact Number *</Label>
                <Input
                  id="contactNumber"
                  type="tel"
                  value={formData.contactNumber}
                  onChange={(e) => handleInputChange("contactNumber", e.target.value)}
                  placeholder="07XXX XXXXXX"
                  required
                  className="mt-1"
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="homeAddress">Home Address *</Label>
                <Textarea
                  id="homeAddress"
                  value={formData.homeAddress}
                  onChange={(e) => handleInputChange("homeAddress", e.target.value)}
                  placeholder="Enter your full home address including postcode"
                  required
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="your.email@example.com"
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="ethnicity">Ethnicity (Optional)</Label>
                <select
                  id="ethnicity"
                  value={formData.ethnicity}
                  onChange={(e) => handleInputChange("ethnicity", e.target.value)}
                  className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">Prefer not to say</option>
                  <option value="White British">White British</option>
                  <option value="White Irish">White Irish</option>
                  <option value="White Other">White Other</option>
                  <option value="Mixed White and Black Caribbean">Mixed White and Black Caribbean</option>
                  <option value="Mixed White and Black African">Mixed White and Black African</option>
                  <option value="Mixed White and Asian">Mixed White and Asian</option>
                  <option value="Mixed Other">Mixed Other</option>
                  <option value="Asian Indian">Asian Indian</option>
                  <option value="Asian Pakistani">Asian Pakistani</option>
                  <option value="Asian Bangladeshi">Asian Bangladeshi</option>
                  <option value="Asian Chinese">Asian Chinese</option>
                  <option value="Asian Other">Asian Other</option>
                  <option value="Black Caribbean">Black Caribbean</option>
                  <option value="Black African">Black African</option>
                  <option value="Black Other">Black Other</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section B - Employer Details */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Building2 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Section B — Employer Details</h2>
                <p className="text-sm text-gray-500">Your current employer information (if applicable)</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="employerName">Employer Name</Label>
                <Input
                  id="employerName"
                  type="text"
                  value={formData.employerName}
                  onChange={(e) => handleInputChange("employerName", e.target.value)}
                  placeholder="Company name"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="companyContactName">Company Contact Name</Label>
                <Input
                  id="companyContactName"
                  type="text"
                  value={formData.companyContactName}
                  onChange={(e) => handleInputChange("companyContactName", e.target.value)}
                  placeholder="Manager or HR contact"
                  className="mt-1"
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="employerAddress">Employer Address</Label>
                <Textarea
                  id="employerAddress"
                  value={formData.employerAddress}
                  onChange={(e) => handleInputChange("employerAddress", e.target.value)}
                  placeholder="Company address including postcode"
                  className="mt-1"
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="employerTelephone">Telephone Number</Label>
                <Input
                  id="employerTelephone"
                  type="tel"
                  value={formData.employerTelephone}
                  onChange={(e) => handleInputChange("employerTelephone", e.target.value)}
                  placeholder="Office telephone"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="employerMobile">Mobile Number</Label>
                <Input
                  id="employerMobile"
                  type="tel"
                  value={formData.employerMobile}
                  onChange={(e) => handleInputChange("employerMobile", e.target.value)}
                  placeholder="Mobile number"
                  className="mt-1"
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="employerEmail">Employer Email</Label>
                <Input
                  id="employerEmail"
                  type="email"
                  value={formData.employerEmail}
                  onChange={(e) => handleInputChange("employerEmail", e.target.value)}
                  placeholder="employer@company.com"
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* Section C - Course/Booking Details */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Section C — Course / Booking Details</h2>
                <p className="text-sm text-gray-500">Qualification and booking preferences</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Label htmlFor="qualification">Qualification *</Label>
                <select
                  id="qualification"
                  value={formData.qualification}
                  onChange={(e) => handleInputChange("qualification", e.target.value)}
                  required
                  className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="EAL Level 3 Electrotechnical Experienced Worker Qualification">
                    EAL Level 3 Electrotechnical Experienced Worker Qualification
                  </option>
                </select>
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="route">Route *</Label>
                <select
                  id="route"
                  value={formData.route}
                  onChange={(e) => handleInputChange("route", e.target.value)}
                  required
                  className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="Installation EWA (603/5982/1)">Installation EWA (603/5982/1)</option>
                </select>
              </div>

              <div>
                <Label htmlFor="preferredStartDate">Preferred Start Date</Label>
                <Input
                  id="preferredStartDate"
                  type="date"
                  value={formData.preferredStartDate}
                  onChange={(e) => handleInputChange("preferredStartDate", e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="paymentOption">Payment Option</Label>
                <select
                  id="paymentOption"
                  value={formData.paymentOption}
                  onChange={(e) => handleInputChange("paymentOption", e.target.value)}
                  className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">Select payment option</option>
                  <option value="Self-funded">Self-funded</option>
                  <option value="Employer-funded">Employer-funded</option>
                  <option value="Payment plan">Payment plan (subject to approval)</option>
                  <option value="To be discussed">To be discussed</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="notes">Notes / Prior Experience Summary</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  placeholder="Briefly describe your electrical experience, qualifications held, and any other relevant information..."
                  className="mt-1"
                  rows={4}
                />
              </div>
            </div>
          </div>

          {/* Section D - Declaration */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                <Calendar className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Section D — Declaration</h2>
                <p className="text-sm text-gray-500">Please read and accept the declaration</p>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
              <p className="text-gray-700 text-sm mb-4">
                By submitting this booking form, I confirm that:
              </p>
              <ul className="text-gray-600 text-sm space-y-2">
                <li>• The information provided in this form is accurate and complete to the best of my knowledge.</li>
                <li>• I understand that additional requirements may still apply depending on my experience and evidence.</li>
                <li>• I am aware that <strong>18th Edition</strong>, <strong>Inspection &amp; Testing</strong>, and <strong>AM2E</strong> qualifications may be required depending on progression and certification requirements.</li>
                <li>• I understand this booking form is not automatic acceptance onto the qualification programme.</li>
              </ul>
            </div>

            <div className="flex items-start gap-3">
              <Checkbox
                id="declaration"
                checked={formData.declarationAccepted}
                onCheckedChange={(checked) => handleInputChange("declarationAccepted", checked === true)}
              />
              <Label htmlFor="declaration" className="text-sm text-gray-700 cursor-pointer leading-relaxed">
                I have read and accept the above declaration *
              </Label>
            </div>
          </div>

          {/* Section E - Digital Signature */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center">
                <PenLine className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Section E — Digital Signature</h2>
                <p className="text-sm text-gray-500">Type your full name as your digital signature</p>
              </div>
            </div>

            <div>
              <Label htmlFor="digitalSignature">Digital Signature (Type your full name) *</Label>
              <Input
                id="digitalSignature"
                type="text"
                value={formData.digitalSignature}
                onChange={(e) => handleInputChange("digitalSignature", e.target.value)}
                placeholder="Type your full name exactly as it appears above"
                required
                className="mt-1 font-medium"
              />
              <p className="text-xs text-gray-500 mt-2">
                By typing your name, you confirm this serves as your electronic signature and has the same legal validity as a handwritten signature.
              </p>
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 p-4 rounded-lg">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{errorMessage}</span>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-center">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full md:w-auto md:min-w-[300px] bg-blue-600 hover:bg-blue-700 py-3 text-lg"
            >
              {isSubmitting ? "Submitting..." : "Submit Booking Form"}
            </Button>
          </div>
        </form>
      </main>

      <SiteFooter />
    </div>
  )
}
