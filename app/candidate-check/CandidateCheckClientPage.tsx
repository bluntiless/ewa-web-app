"use client"

import type React from "react"
import { useState, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import SkillRatingRow from "@/components/skill-rating-row"
import { qualificationsData, skillsScanSections } from "@/lib/skills-scan-data"
import { CheckCircle, AlertTriangle } from "lucide-react" // Import AlertTriangle icon
import { MobileNav } from "@/components/mobile-nav"

type Rating = "limited" | "adequate" | "extensive" | "unsure" | ""

interface SkillAssessment {
  knowledge: Rating
  experience: Rating
}

interface SkillsScanFormState {
  fullName: string
  email: string
  phone: string
  yearsExperience: string
  otherQualifications: string
  criminalConvictions: "yes" | "no"
  rightToWork: "yes" | "no"
  declaration: boolean
  selectedQualifications: {
    tableA: { [key: string]: boolean }
    tableB: { [key: string]: boolean }
    tableC: { [key: string]: boolean }
  }
  skills: {
    [sectionId: string]: {
      [skillId: string]: SkillAssessment
    }
  }
  furtherKnowledgeRequired: string
  furtherExperienceRequired: string
}

export default function CandidateCheckClientPage() {
  const initialSkillsState = skillsScanSections.reduce(
    (acc, section) => {
      acc[section.id] = section.items.reduce(
        (itemAcc, item) => {
          itemAcc[item.id] = { knowledge: "", experience: "" }
          return itemAcc
        },
        {} as { [key: string]: SkillAssessment },
      )
      return acc
    },
    {} as { [sectionId: string]: { [skillId: string]: SkillAssessment } },
  )

  const initialQualificationsState = {
    tableA: qualificationsData.tableA.reduce((acc, q) => ({ ...acc, [q.title]: false }), {}),
    tableB: qualificationsData.tableB.reduce((acc, q) => ({ ...acc, [q.title]: false }), {}),
    tableC: qualificationsData.tableC.reduce((acc, q) => ({ ...acc, [q.title]: false }), {}),
  }

  const [formData, setFormData] = useState<SkillsScanFormState>({
    fullName: "",
    email: "",
    phone: "",
    yearsExperience: "",
    otherQualifications: "",
    criminalConvictions: "no",
    rightToWork: "yes",
    declaration: false,
    selectedQualifications: initialQualificationsState,
    skills: initialSkillsState,
    furtherKnowledgeRequired: "",
    furtherExperienceRequired: "",
  })

  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null)
  const [outcomeType, setOutcomeType] = useState<
    "highly_suitable" | "knowledge_gaps" | "experience_gaps" | "significant_gaps" | null
  >(null)

  const outcomeRef = useRef<HTMLDivElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleRadioChange = (id: keyof SkillsScanFormState, value: "yes" | "no") => {
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, declaration: checked }))
  }

  const handleQualificationChange = (table: "tableA" | "tableB" | "tableC", title: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      selectedQualifications: {
        ...prev.selectedQualifications,
        [table]: {
          ...prev.selectedQualifications[table],
          [title]: checked,
        },
      },
    }))
  }

  const handleSkillRatingChange = (
    sectionId: string,
    skillId: string,
    type: "knowledge" | "experience",
    value: Rating,
  ) => {
    setFormData((prev) => ({
      ...prev, // keep the rest of the state intact
      skills: {
        ...prev.skills,
        [sectionId]: {
          ...prev.skills[sectionId],
          [skillId]: {
            ...prev.skills[sectionId][skillId],
            [type]: value,
          },
        },
      },
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitted(true)
    setSubmitStatus(null)
    setOutcomeType(null)

    if (!formData.fullName || !formData.email || !formData.yearsExperience || !formData.declaration) {
      setSubmitStatus("error")
      setIsSubmitted(false)
      return
    }

    try {
      console.log("Submitting form data:", formData)
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const yearsExp = Number.parseInt(formData.yearsExperience)
      let knowledgeAdequateCount = 0
      let experienceAdequateCount = 0
      let totalSkills = 0
      let hasInvalidQualificationSelected = false

      // Check for selected qualifications with "N/A" in their numbers
      const allQualifications = [
        ...qualificationsData.tableA,
        ...qualificationsData.tableB,
        ...qualificationsData.tableC,
      ]

      for (const tableKey of ["tableA", "tableB", "tableC"] as const) {
        for (const qualTitle in formData.selectedQualifications[tableKey]) {
          if (formData.selectedQualifications[tableKey][qualTitle]) {
            const qual = allQualifications.find((q) => q.title === qualTitle)
            if (qual && qual.qualificationNumbers.includes("N/A")) {
              hasInvalidQualificationSelected = true
              break
            }
          }
        }
        if (hasInvalidQualificationSelected) break
      }

      for (const sectionId in formData.skills) {
        for (const skillId in formData.skills[sectionId]) {
          totalSkills++
          if (
            formData.skills[sectionId][skillId].knowledge === "adequate" ||
            formData.skills[sectionId][skillId].knowledge === "extensive"
          ) {
            knowledgeAdequateCount++
          }
          if (
            formData.skills[sectionId][skillId].experience === "adequate" ||
            formData.skills[sectionId][skillId].experience === "extensive"
          ) {
            experienceAdequateCount++
          }
        }
      }

      const knowledgeScore = (knowledgeAdequateCount / totalSkills) * 100
      const experienceScore = (experienceAdequateCount / totalSkills) * 100

      let calculatedOutcome: "highly_suitable" | "knowledge_gaps" | "experience_gaps" | "significant_gaps"

      if (hasInvalidQualificationSelected) {
        calculatedOutcome = "significant_gaps" // Force unsuitable if N/A qualification is selected
      } else if (yearsExp >= 5) {
        if (knowledgeScore >= 80 && experienceScore >= 80) {
          calculatedOutcome = "highly_suitable"
        } else if (knowledgeScore < 80 && experienceScore >= 80) {
          calculatedOutcome = "knowledge_gaps"
        } else if (knowledgeScore >= 80 && experienceScore < 80) {
          calculatedOutcome = "experience_gaps"
        } else {
          calculatedOutcome = "significant_gaps"
        }
      } else {
        calculatedOutcome = "significant_gaps"
      }

      setOutcomeType(calculatedOutcome)
      setSubmitStatus("success")
      console.log("Calculated Outcome:", calculatedOutcome)

      setTimeout(() => {
        outcomeRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
      }, 100)
    } catch (error) {
      console.error("Form submission error:", error)
      setSubmitStatus("error")
    } finally {
      setIsSubmitted(false)
    }
  }

  const getOutcomeStyling = (outcome: typeof outcomeType) => {
    switch (outcome) {
      case "highly_suitable":
        return "bg-green-100 border-green-500 text-green-800"
      case "knowledge_gaps":
      case "experience_gaps":
        return "bg-orange-100 border-orange-500 text-orange-800"
      case "significant_gaps":
        return "bg-red-100 border-red-500 text-red-800"
      default:
        return ""
    }
  }

  const getOutcomeIcon = (outcome: typeof outcomeType) => {
    switch (outcome) {
      case "highly_suitable":
        return <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0" />
      case "knowledge_gaps":
      case "experience_gaps":
      case "significant_gaps":
        return <AlertTriangle className="w-8 h-8 text-current flex-shrink-0" /> // text-current will use the parent's text color
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
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

      <main className="max-w-4xl mx-auto px-4 py-16 md:py-24">
        <section className="bg-white rounded-xl shadow-lg p-8 md:p-12">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Installation & Maintenance Electrician EWA: Skills Scan
            </h1>
            <span className="text-sm text-gray-500">June 2024</span>
          </div>
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            This online self-assessment Skills Scan is a tool designed to help you check your suitability for the
            Installation & Maintenance Electrician Experienced Worker Assessment (IE/ME EWA) by reviewing your knowledge
            and skills against the IE/ME EWA requirements. Upon completion, you will receive an immediate outcome and
            guidance.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            The IE/ME EWA mirrors the content of the Level 3 Installation & Maintenance Electrician Apprenticeship
            Standard and is designed for currently practising electricians with{" "}
            <span className="font-semibold">5 or more years’ experience</span> working in the industry, not including
            time spent in education or training.
          </p>
          <p className="text-sm text-gray-600 mb-8">
            NB: This version of the Skills Scan and all future revisions align with the Version 2 of the Installation &
            Maintenance Electrician apprenticeship standard.
          </p>

          {/* Important Note about PDF version */}
          <div className="mb-8 p-4 bg-blue-100 border-l-4 border-blue-500 text-blue-800 rounded">
            <p className="font-semibold">Important Note:</p>
            <p className="text-sm">
              This online tool provides an initial suitability check. You will still be required to complete and submit
              the official PDF version of the Skills Scan and Candidate Background Form before being formally enrolled.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-12">
            {/* Personal Details */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Candidate Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="fullName" className="mb-2 block">
                    Candidate Name
                  </Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="mb-2 block">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john.doe@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="mb-2 block">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+44 7123 456789"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Step One: Check Eligibility */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">STEP ONE: CHECK THAT YOU ARE ELIGIBLE</h2>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Qualifications You Already Hold</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                A pre-requisite to registering on the IE/ME EWA is having knowledge and understanding that is comparable
                to the Level 3 Installation & Maintenance Electrician Qualification. Candidates must hold at least a
                relevant Level 2 qualification as shown in the tables below.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Non-UK qualifications: candidates must obtain an Ecctis Electrotechnical mapping (Installation &
                Maintenance Electrician). Non-UK qualifications cannot be accepted without this.
              </p>
              <p className="text-gray-700 leading-relaxed mb-6">
                The following is a list of currently accepted qualifications from the EAS Qualifications Guide. If you
                hold any of these qualifications please tick the relevant boxes.
              </p>

              <div className="mb-6 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 rounded">
                <p className="font-semibold">NOTES:</p>
                <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                  <li>
                    Non-UK qualifications: any candidates holding electrical qualifications from outside of the UK will
                    need to undertake the Ecctis mapping process (the specific electrotechnical mapping route and not
                    the general mapping). Training providers should not be enrolling candidates with non-UK
                    qualifications without proof of this mapping.
                  </li>
                  <li>
                    A qualification in Inspection & Testing, Periodic Inspection, Initial Verification or BS 7671 Wiring
                    Regulations does not meet the requirement for an underpinning technical certificate.
                  </li>
                  <li>
                    Where one of the listed qualifications covers both practical on-site performance and knowledge and
                    understanding - it is the knowledge and understanding element that needs to have been achieved (e.g.
                    the knowledge and understanding units in the Level 3 NVQ Diploma in Installing Electrotechnical
                    Systems and Equipment (building structures and the environment)).
                  </li>
                  <li>
                    You may hold a qualification such as EAL 600/6724/X, EAL 601/4561/4, C&G 2330 L2, C&G 2360 Pt 1
                    which are Level 2 VRQ pre-cursor qualifications to some of those listed below. These will partially
                    count towards the knowledge and understanding requirements so please note these on the list.
                  </li>
                  <li>
                    Not sufficient to demonstrate underpinning knowledge: City & Guilds Level 3 Certificate in the
                    Building Regulations for Electrical Installations in Dwellings (2393-10) (Part-P Building
                    Regulations); LCL Awards Domestic Electrical Installer certificate.
                  </li>
                </ul>
              </div>

              <div className="mb-6">
                <Label htmlFor="yearsExperience" className="mb-2 block">
                  Years of Electrical Experience (excluding education/training)
                </Label>
                <Input
                  id="yearsExperience"
                  type="number"
                  placeholder="e.g., 5"
                  min="0"
                  value={formData.yearsExperience}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Table A Qualifications */}
              <div className="mb-8 p-6 bg-blue-50 rounded-lg shadow-inner">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Table A: These should provide evidence of most of the underpinning knowledge but a technical
                  discussion is needed to cover new technology areas detailed in the Skills Scan, unless these are
                  already evidenced by additional Continuous Professional Development (CPD) qualifications.
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left table-auto">
                    <thead>
                      <tr className="border-b border-gray-300">
                        <th className="py-2 pr-4 text-sm font-semibold text-gray-700 min-w-[250px]">
                          Qualification Title
                        </th>
                        <th className="py-2 px-2 text-sm font-semibold text-gray-700 min-w-[150px]">
                          Awarding Organisations
                        </th>
                        <th className="py-2 px-2 text-sm font-semibold text-gray-700 min-w-[150px]">
                          Qualification Numbers (Ofqual)
                        </th>
                        <th className="py-2 pl-2 text-sm font-semibold text-gray-700 w-16 text-center">Tick</th>
                      </tr>
                    </thead>
                    <tbody>
                      {qualificationsData.tableA.map((q) => (
                        <tr key={q.title} className="border-b border-gray-200 last:border-b-0">
                          <td className="py-2 pr-4 text-sm text-gray-700">{q.title}</td>
                          <td className="py-2 px-2 text-sm text-gray-600">{q.awardingOrganisations}</td>
                          <td className="py-2 px-2 text-sm text-gray-600">{q.qualificationNumbers}</td>
                          <td className="py-2 pl-2 text-center">
                            <Checkbox
                              id={`qual-A-${q.title}`}
                              checked={formData.selectedQualifications.tableA[q.title]}
                              onCheckedChange={(checked) =>
                                handleQualificationChange("tableA", q.title, checked as boolean)
                              }
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Table B Qualifications */}
              <div className="mb-8 p-6 bg-green-50 rounded-lg shadow-inner">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Table B: A recorded/documented auditable technical discussion must be held to ensure you can meet the
                  full Level 3 knowledge requirements of the IE/ME EWA qualification.
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left table-auto">
                    <thead>
                      <tr className="border-b border-gray-300">
                        <th className="py-2 pr-4 text-sm font-semibold text-gray-700 min-w-[250px]">
                          Qualification Title
                        </th>
                        <th className="py-2 px-2 text-sm font-semibold text-gray-700 min-w-[150px]">
                          Awarding Organisations
                        </th>
                        <th className="py-2 px-2 text-sm font-semibold text-gray-700 min-w-[150px]">
                          Qualification Numbers (Ofqual)
                        </th>
                        <th className="py-2 pl-2 text-sm font-semibold text-gray-700 w-16 text-center">Tick</th>
                      </tr>
                    </thead>
                    <tbody>
                      {qualificationsData.tableB.map((q) => (
                        <tr key={q.title} className="border-b border-gray-200 last:border-b-0">
                          <td className="py-2 pr-4 text-sm text-gray-700">{q.title}</td>
                          <td className="py-2 px-2 text-sm text-gray-600">{q.awardingOrganisations}</td>
                          <td className="py-2 px-2 text-sm text-gray-600">{q.qualificationNumbers}</td>
                          <td className="py-2 pl-2 text-center">
                            <Checkbox
                              id={`qual-B-${q.title}`}
                              checked={formData.selectedQualifications.tableB[q.title]}
                              onCheckedChange={(checked) =>
                                handleQualificationChange("tableB", q.title, checked as boolean)
                              }
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Table C Qualifications */}
              <div className="mb-8 p-6 bg-purple-50 rounded-lg shadow-inner">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Table C: A recorded/documented auditable technical discussion must be held to ensure you can meet the
                  full Level 3 knowledge requirements of the IE/ME EWA qualification.
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left table-auto">
                    <thead>
                      <tr className="border-b border-gray-300">
                        <th className="py-2 pr-4 text-sm font-semibold text-gray-700 min-w-[250px]">
                          Qualification Title
                        </th>
                        <th className="py-2 px-2 text-sm font-semibold text-gray-700 min-w-[150px]">
                          Awarding Organisations
                        </th>
                        <th className="py-2 px-2 text-sm font-semibold text-gray-700 min-w-[150px]">
                          Qualification Numbers (Ofqual)
                        </th>
                        <th className="py-2 pl-2 text-sm font-semibold text-gray-700 w-16 text-center">Tick</th>
                      </tr>
                    </thead>
                    <tbody>
                      {qualificationsData.tableC.map((q) => (
                        <tr key={q.title} className="border-b border-gray-200 last:border-b-0">
                          <td className="py-2 pr-4 text-sm text-gray-700">{q.title}</td>
                          <td className="py-2 px-2 text-sm text-gray-600">{q.awardingOrganisations}</td>
                          <td className="py-2 px-2 text-sm text-gray-600">{q.qualificationNumbers}</td>
                          <td className="py-2 pl-2 text-center">
                            <Checkbox
                              id={`qual-C-${q.title}`}
                              checked={formData.selectedQualifications.tableC[q.title]}
                              onCheckedChange={(checked) =>
                                handleQualificationChange("tableC", q.title, checked as boolean)
                              }
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <Label htmlFor="otherQualifications" className="mb-2 block">
                  Other Relevant Qualifications (if not listed above)
                </Label>
                <Textarea
                  id="otherQualifications"
                  placeholder="List any other relevant electrical qualifications here..."
                  value={formData.otherQualifications}
                  onChange={handleChange}
                  rows={3}
                />
                <p className="text-sm text-gray-500 mt-2">
                  If you hold another equivalent qualification not listed above which you think is relevant to the
                  Knowledge required, please contact TESP for further guidance via{" "}
                  <a
                    href="https://www.the-esp.org.uk/contact-us"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    www.the-esp.org.uk/contact-us
                  </a>
                  . Training providers must obtain approval from TESP before they can accept any qualifications not
                  listed in Tables A, B and C.
                </p>
              </div>
            </div>

            {/* Step Two: Completing This Document (Skills Scan) */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">STEP TWO: COMPLETING THIS DOCUMENT</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                You only should complete this section if you have determined in Step 1 that you are eligible and hold
                the relevant qualifications.
              </p>
              <p className="text-gray-700 leading-relaxed mb-6">
                To pass the IE/ME EWA you will need to demonstrate breadth and depth of knowledge and practical skills,
                covering all the areas listed in this Skills Scan. Be honest with yourself when completing it - if you
                cannot confidently tick “Adequate” as a minimum for every statement in terms of both Knowledge and
                Practical Experience, it’s highly unlikely that you will be able to provide the evidence required to
                pass the IE/ME EWA. Once you enrol on the IE/ME EWA you will have a maximum 18 months to complete the
                process. It’s important to ensure before enrolling that you will be able to undertake the range of work
                required to provide the evidence required for the performance assessments.
              </p>
              <p className="text-gray-700 leading-relaxed mb-6">
                If you are not regularly working across the full breadth of work in the tables below, it’s unlikely you
                will be able to complete the EWA within 18 months. Do not enrol until you are confident you can provide
                the evidence within that timescale, or consider an alternative training route - visit{" "}
                <a
                  href="https://www.electricalcareers.co.uk/routes"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  www.electricalcareers.co.uk/routes
                </a>{" "}
                for more information.
              </p>
              <p className="text-gray-700 leading-relaxed mb-6">
                <span className="font-semibold">Remember:</span> You’ll only be able to use evidence for the IE/ME EWA
                performance assessments that is generated after you enrol on the IE/ME EWA - so you’ll need to be
                currently working day-to-day on activity that covers the breadth of what is required. You may have
                evidence from past work that will confirm that you’re a suitable candidate for IE/ME EWA, but you’d
                still need to be currently working as an electrician in order to create evidence for the practical
                units.
              </p>

              {skillsScanSections.map((section) => (
                <div key={section.id} className="mb-8 p-6 bg-gray-50 rounded-lg shadow-inner">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{section.title}</h3>
                  {section.description && <p className="text-gray-700 leading-relaxed mb-6">{section.description}</p>}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left table-fixed">
                      <thead>
                        <tr className="border-b border-gray-300">
                          <th className="py-2 pr-4 text-sm font-semibold text-gray-700 w-[40%]">
                            For each item please tick one box in the&nbsp;Knowledge section and one box in
                            the&nbsp;Experience section
                          </th>
                          <th className="py-2 px-2 text-sm font-semibold text-gray-700 text-center w-[30%]">
                            KNOWLEDGE
                          </th>
                          <th className="py-2 px-2 text-sm font-semibold text-gray-700 text-center w-[30%]">
                            EXPERIENCE
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {section.items.map((item) => (
                          <SkillRatingRow
                            key={item.id}
                            idPrefix={section.id}
                            skillId={item.id}
                            skillText={item.text}
                            knowledgeValue={formData.skills[section.id]?.[item.id]?.knowledge || ""}
                            experienceValue={formData.skills[section.id]?.[item.id]?.experience || ""}
                            onKnowledgeChange={(value) =>
                              handleSkillRatingChange(section.id, item.id, "knowledge", value)
                            }
                            onExperienceChange={(value) =>
                              handleSkillRatingChange(section.id, item.id, "experience", value)
                            }
                          />
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>

            {/* Identifying any further knowledge or experience required */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Identifying any further knowledge or experience required
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Having completed the Skills Scan, summarise any areas where you feel further knowledge or experience may
                be required before undertaking the assessment.
              </p>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="furtherKnowledgeRequired" className="mb-2 block">
                    Knowledge (List items)
                  </Label>
                  <Textarea
                    id="furtherKnowledgeRequired"
                    placeholder="List areas where further knowledge is needed..."
                    value={formData.furtherKnowledgeRequired}
                    onChange={handleChange}
                    rows={4}
                  />
                </div>
                <div>
                  <Label htmlFor="furtherExperienceRequired" className="mb-2 block">
                    Experience (List items)
                  </Label>
                  <Textarea
                    id="furtherExperienceRequired"
                    placeholder="List areas where further practical experience is needed..."
                    value={formData.furtherExperienceRequired}
                    onChange={handleChange}
                    rows={4}
                  />
                </div>
              </div>
            </div>

            {/* Background Check Questions (Existing) */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Background Declaration</h2>
              <div className="space-y-6">
                <div>
                  <Label className="mb-2 block">Have you ever been convicted of a criminal offense?</Label>
                  <RadioGroup
                    value={formData.criminalConvictions}
                    onValueChange={(value) => handleRadioChange("criminalConvictions", value as "yes" | "no")}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="criminalConvictions-yes" />
                      <Label htmlFor="criminalConvictions-yes">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="criminalConvictions-no" />
                      <Label htmlFor="criminalConvictions-no">No</Label>
                    </div>
                  </RadioGroup>
                  {formData.criminalConvictions === "yes" && (
                    <p className="text-sm text-gray-500 mt-2">
                      If yes, please provide details in the 'Further Knowledge/Experience' section or contact us
                      directly.
                    </p>
                  )}
                </div>
                <div>
                  <Label className="mb-2 block">Do you have the legal right to work in the UK?</Label>
                  <RadioGroup
                    value={formData.rightToWork}
                    onValueChange={(value) => handleRadioChange("rightToWork", value as "yes" | "no")}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="rightToWork-yes" />
                      <Label htmlFor="rightToWork-yes">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="rightToWork-no" />
                      <Label htmlFor="rightToWork-no">No</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>

            {/* Declaration */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="declaration"
                checked={formData.declaration}
                onCheckedChange={handleCheckboxChange}
                required
              />
              <Label
                htmlFor="declaration"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I declare that the information provided is true and accurate to the best of my knowledge.
              </Label>
            </div>

            <Button type="submit" className="w-full py-3 text-lg" disabled={isSubmitted}>
              {isSubmitted ? "Submitting..." : "Submit Skills Scan"}
            </Button>

            {submitStatus === "error" && (
              <div className="mt-4 text-center text-red-600">
                Please fill in all required fields and accept the declaration.
              </div>
            )}

            {/* Understanding my Results - Conditional Outcome Display */}
            {outcomeType && (
              <div ref={outcomeRef} className="mt-16 pt-8 border-t border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Understanding Your Results</h2>
                <div className={`${getOutcomeStyling(outcomeType)} p-4 mb-6 rounded-md flex items-center space-x-3`}>
                  {getOutcomeIcon(outcomeType)}
                  <div>
                    {outcomeType === "highly_suitable" && (
                      <>
                        <h3 className="text-2xl font-bold text-green-900 mb-1">SUITABLE</h3>
                        <p className="text-lg">
                          Based on your responses, you appear to be highly suitable for the IE/ME EWA. Your experience
                          and knowledge align well with the qualification requirements.
                        </p>
                      </>
                    )}
                    {outcomeType === "knowledge_gaps" && (
                      <>
                        <h3 className="text-2xl font-bold text-orange-900 mb-1">KNOWLEDGE GAPS IDENTIFIED</h3>
                        <p className="text-lg">
                          Based on your responses, it appears you have some gaps in your knowledge.
                        </p>
                      </>
                    )}
                    {outcomeType === "experience_gaps" && (
                      <>
                        <h3 className="text-2xl font-bold text-orange-900 mb-1">EXPERIENCE GAPS IDENTIFIED</h3>
                        <p className="text-lg">
                          Based on your responses, it appears you have some gaps in your practical experience.
                        </p>
                      </>
                    )}
                    {outcomeType === "significant_gaps" && (
                      <>
                        <h3 className="text-2xl font-bold text-red-900 mb-1">NOT SUITABLE AT THIS TIME</h3>
                        <p className="text-lg">
                          Based on your responses, it appears you have significant gaps in both knowledge and/or
                          experience, or you have selected a qualification that is not sufficient for the EWA.
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {outcomeType === "highly_suitable" && (
                  <ul className="list-disc list-inside space-y-1">
                    <li>This suggests the IE/ME EWA is right for you.</li>
                    <li>
                      Think about the boxes where you can’t tick Adequate - if the gaps are around Knowledge, you may be
                      able to do some self-study or training to top up. If the gap is in terms of Practical Experience,
                      think about whether there are options within your current role to cover these areas.
                    </li>
                    <li>
                      You should now complete the Candidate Background form available from the EWA website and choose a
                      training provider - see{" "}
                      <a
                        href="https://www.electrical-ewa.org.uk"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        www.electrical-ewa.org.uk
                      </a>{" "}
                      for more details.
                    </li>
                    <li>
                      You will need to give a copy of the Skills Scan to the training provider. They will need to
                      discuss it with you to verify the information you have provided.
                    </li>
                    <li>
                      You will also need to provide certificates for any relevant qualifications so that these can be
                      verified.
                    </li>
                  </ul>
                )}

                {outcomeType === "knowledge_gaps" && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      I SEEM TO HAVE QUITE A FEW GAPS AROUND KNOWLEDGE:
                    </h3>
                    <ul className="list-disc list-inside space-y-1">
                      <li>
                        You might need to undertake some further training or study in order to fill these before you can
                        take the IE/ME EWA.
                      </li>
                      <li>If you’re not sure what would be required, talk to a training provider.</li>
                      <li>
                        Make sure that any recommended training or qualifications can be recognized as meeting the IE/ME
                        EWA requirements. A list of accepted qualifications is contained within the Skills Scan.
                      </li>
                      <li>
                        If the Knowledge gaps are significant, and you also need additional practical experience which
                        is likely to take at least 12 months to obtain, you should consider enrolling on an
                        apprenticeship. There are no age restrictions and any training and the cost of the end
                        assessment will be funded. You can find more details at{" "}
                        <a
                          href="https://www.electricalcareers.co.uk/ewa-info"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          www.electricalcareers.co.uk/ewa-info
                        </a>
                        .
                      </li>
                    </ul>
                  </div>
                )}

                {outcomeType === "experience_gaps" && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      I SEEM TO HAVE QUITE A FEW GAPS AROUND PRACTICAL EXPERIENCE:
                    </h3>
                    <ul className="list-disc list-inside space-y-1">
                      <li>
                        If it’s likely to take at least 12 months to obtain sufficient practical experience, you should
                        consider enrolling on an apprenticeship. There are no age restrictions and any training and the
                        cost of the end assessment will be funded. You can find more details at{" "}
                        <a
                          href="https://www.electricalcareers.co.uk/ewa-info"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          www.electricalcareers.co.uk/ewa-info
                        </a>
                        .
                      </li>
                      <li>
                        If you don’t meet the requirements for an apprenticeship, think about whether it’s possible to
                        gain the experience by taking on different tasks within your work.
                      </li>
                      <li>
                        If you’re employed, talk to your employer about possible options. If you’re self-employed,
                        consider whether it’s possible to broaden the work you undertake to fill the gaps.
                      </li>
                    </ul>
                  </div>
                )}

                {outcomeType === "significant_gaps" && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Based on your responses, it appears you have significant gaps in both knowledge and/or experience.
                    </h3>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      It is highly recommended that you consider an alternative training route before pursuing the IE/ME
                      EWA. The IE/ME EWA is designed for experienced electricians who can confidently demonstrate
                      breadth and depth of knowledge and practical skills across all areas.
                    </p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>
                        If you have less than 5 years of experience, or significant gaps in both knowledge and practical
                        experience, an apprenticeship might be a more suitable pathway. There are no age restrictions,
                        and training and end assessment costs may be funded. You can find more details at{" "}
                        <a
                          href="https://www.electricalcareers.co.uk/ewa-info"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          www.electricalcareers.co.uk/ewa-info
                        </a>
                        .
                      </li>
                      <li>
                        Alternatively, consider undertaking further training or study to fill knowledge gaps, and
                        actively seek opportunities to gain more practical experience in the areas identified.
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Next Steps */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Next Steps</h2>
              <p className="text-gray-700 leading-relaxed">
                This Skills Scan provides a useful record of the gaps you may need to fill if you intend to take the
                IE/ME EWA in the future. If the IE/ME EWA seems right for you based on this outcome, you can now
                complete the Candidate Background form available from the EWA website and choose a training provider.
              </p>
            </div>
          </form>
        </section>
      </main>
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
