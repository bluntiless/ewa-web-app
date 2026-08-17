"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { ArrowLeft, CheckCircle2, Loader2, AlertCircle } from "lucide-react"
import {
  ELIGIBILITY_QUESTIONS,
  evaluateEligibility,
  labelFor,
  type EligibilityAnswers,
  type EligibilityResult,
} from "@/lib/eligibility/checker"

interface ContactDetails {
  name: string
  email: string
  phone: string
}

type UploadStatus = "idle" | "saving" | "success" | "error"

// Colour the result badge by outcome tone.
function resultTone(result: string): string {
  if (result.includes("LIKELY")) return "bg-green-100 text-green-800 border-green-300"
  if (result.includes("POTENTIALLY")) return "bg-blue-100 text-blue-800 border-blue-300"
  if (result.includes("FURTHER")) return "bg-red-100 text-red-800 border-red-300"
  return "bg-amber-100 text-amber-800 border-amber-300"
}

export default function AssistantEligibilityWizard({ onExit }: { onExit: () => void }) {
  // step: -1 = contact details, 0..(n-1) = questions, n = result
  const [step, setStep] = useState(-1)
  const [contact, setContact] = useState<ContactDetails>({ name: "", email: "", phone: "" })
  const [answers, setAnswers] = useState<Partial<EligibilityAnswers>>({})
  const [outcome, setOutcome] = useState<EligibilityResult | null>(null)
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle")
  const uploadedRef = useRef(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const totalQuestions = ELIGIBILITY_QUESTIONS.length
  const onResult = step === totalQuestions

  // Auto-scroll within the wizard body as steps change.
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0
  }, [step])

  // When we reach the result step, evaluate and auto-upload once.
  useEffect(() => {
    if (!onResult || uploadedRef.current) return
    uploadedRef.current = true

    const full = answers as EligibilityAnswers
    const evaluated = evaluateEligibility(full)
    setOutcome(evaluated)

    const experienceLabel = labelFor("experience", full.experience)
    const level2Label = labelFor("level2", full.level2)
    const level3Label = labelFor("level3", full.level3)
    const editionLabel = labelFor("edition", full.edition)
    const itLabel = labelFor("it", full.it)
    const workLabel = labelFor("work", full.work)

    const uploadPayload = {
      candidateName: contact.name,
      checkDate: new Date().toLocaleDateString("en-GB"),
      email: contact.email,
      phone: contact.phone,
      experience: experienceLabel,
      level2Qualification: level2Label,
      level3Qualification: level3Label,
      bs7671Status: editionLabel,
      itStatus: itLabel,
      workTypes: [workLabel],
      eligibilityResult: evaluated.result,
      recommendations: evaluated.nextStep,
      source: "AI Assistant",
    }

    const logPayload = {
      candidateName: contact.name,
      email: contact.email,
      phone: contact.phone,
      experience: experienceLabel,
      level2Qualification: level2Label,
      level3Qualification: level3Label,
      bs7671Status: editionLabel,
      itStatus: itLabel,
      workType: workLabel,
      pathway: evaluated.pathway,
      eligibilityResult: evaluated.result,
      recommendations: evaluated.nextStep,
      source: "AI Assistant",
    }

    setUploadStatus("saving")
    // Log to the admin dashboard (non-blocking) and save the full record to SharePoint.
    fetch("/api/eligibility-checker/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(logPayload),
    }).catch(() => {})

    fetch("/api/eligibility-checker/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(uploadPayload),
    })
      .then((r) => setUploadStatus(r.ok ? "success" : "error"))
      .catch(() => setUploadStatus("error"))
  }, [onResult, answers, contact])

  const contactValid = contact.name.trim().length > 1 && /\S+@\S+\.\S+/.test(contact.email)

  const chooseOption = (value: string) => {
    const q = ELIGIBILITY_QUESTIONS[step]
    setAnswers((prev) => ({ ...prev, [q.id]: value }))
    setStep((s) => s + 1)
  }

  const goBack = () => setStep((s) => Math.max(-1, s - 1))

  return (
    <div className="flex h-full flex-col">
      {/* Progress / back bar */}
      <div className="flex items-center gap-2 border-b border-gray-100 bg-white px-4 py-2.5">
        {step > -1 && !onResult && (
          <button
            type="button"
            onClick={goBack}
            aria-label="Previous question"
            className="flex h-7 w-7 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
        )}
        <div className="flex-1">
          <p className="text-xs font-semibold text-gray-700">Eligibility check</p>
          {!onResult && (
            <p className="text-[11px] text-gray-400">
              {step === -1 ? "Your details" : `Question ${step + 1} of ${totalQuestions}`}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={onExit}
          className="rounded-full px-2.5 py-1 text-[11px] font-medium text-blue-700 hover:bg-blue-50"
        >
          Back to chat
        </button>
      </div>

      {/* Progress bar */}
      {!onResult && (
        <div className="h-1 w-full bg-gray-100">
          <div
            className="h-full bg-blue-600 transition-all"
            style={{ width: `${((step + 1) / (totalQuestions + 1)) * 100}%` }}
          />
        </div>
      )}

      <div ref={scrollRef} className="flex-1 overflow-y-auto bg-gray-50 px-4 py-4">
        {/* Contact details step */}
        {step === -1 && (
          <div className="space-y-3">
            <p className="text-sm leading-relaxed text-gray-600">
              I&apos;ll ask a few quick questions to give you an indicative eligibility result for the
              EWA route. First, your details so we can follow up.
            </p>
            <div className="space-y-2">
              <div>
                <label htmlFor="ewa-elig-name" className="mb-1 block text-xs font-medium text-gray-700">
                  Full name *
                </label>
                <input
                  id="ewa-elig-name"
                  value={contact.name}
                  onChange={(e) => setContact({ ...contact, name: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="ewa-elig-email" className="mb-1 block text-xs font-medium text-gray-700">
                  Email *
                </label>
                <input
                  id="ewa-elig-email"
                  type="email"
                  value={contact.email}
                  onChange={(e) => setContact({ ...contact, email: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label htmlFor="ewa-elig-phone" className="mb-1 block text-xs font-medium text-gray-700">
                  Phone (optional)
                </label>
                <input
                  id="ewa-elig-phone"
                  value={contact.phone}
                  onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="Your number"
                />
              </div>
            </div>
            <button
              type="button"
              disabled={!contactValid}
              onClick={() => setStep(0)}
              className="w-full rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Start eligibility check
            </button>
          </div>
        )}

        {/* Question steps */}
        {step > -1 && !onResult && (
          <div className="space-y-3">
            <p className="text-sm font-medium leading-relaxed text-gray-800">
              {ELIGIBILITY_QUESTIONS[step].question}
            </p>
            <div className="flex flex-col gap-2">
              {ELIGIBILITY_QUESTIONS[step].options.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => chooseOption(opt.value)}
                  className="rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-left text-sm text-gray-800 transition-colors hover:border-blue-400 hover:bg-blue-50"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Result step */}
        {onResult && outcome && (
          <div className="space-y-3">
            <div className={`rounded-xl border px-4 py-3 ${resultTone(outcome.result)}`}>
              <p className="text-[11px] font-medium uppercase tracking-wide opacity-70">
                Indicative result
              </p>
              <p className="text-base font-bold">{outcome.result}</p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white px-4 py-3">
              <p className="text-xs font-semibold text-gray-500">Likely EWA pathway</p>
              <p className="text-sm font-medium text-gray-800">{outcome.pathway}</p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white px-4 py-3">
              <p className="text-xs font-semibold text-gray-500">Recommended next step</p>
              <p className="text-sm text-gray-800">{outcome.nextStep}</p>
            </div>

            {outcome.notes.map((note, i) => (
              <p key={i} className="rounded-lg bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-900">
                {note}
              </p>
            ))}

            {/* Upload status */}
            <div className="flex items-center justify-center gap-1.5 text-xs">
              {uploadStatus === "saving" && (
                <span className="flex items-center gap-1.5 text-gray-500">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving your result…
                </span>
              )}
              {uploadStatus === "success" && (
                <span className="flex items-center gap-1.5 text-green-700">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Sent to EWA Tracker
                </span>
              )}
              {uploadStatus === "error" && (
                <span className="flex items-center gap-1.5 text-amber-700">
                  <AlertCircle className="h-3.5 w-3.5" /> Saved locally — we&apos;ll still follow up
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 gap-2 pt-1">
              <a
                href="/book-a-call"
                className="rounded-lg bg-blue-700 px-4 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-blue-800"
              >
                Book a free consultation call
              </a>
              <a
                href="/skills-scan"
                className="rounded-lg border border-blue-200 bg-white px-4 py-2.5 text-center text-sm font-medium text-blue-700 transition-colors hover:bg-blue-50"
              >
                Start a skills scan
              </a>
              <button
                type="button"
                onClick={onExit}
                className="px-4 py-2 text-center text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                Back to chat
              </button>
            </div>

            <p className="text-center text-[10px] leading-tight text-gray-400">
              Guidance only — final suitability depends on evidence review, qualification mapping and
              assessor approval.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
