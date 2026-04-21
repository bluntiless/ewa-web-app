
"use client"

import { useEffect, useMemo, useState } from "react"
import {
  PASS_MARK_PERCENT,
  QUESTION_POOL,
  QUESTION_POOL_SIZE,
  QUESTIONS_PER_ATTEMPT,
  TEST_TIME_MINUTES,
  type Question,
} from "@/lib/ewa-question-bank"

type AttemptQuestion = Question & {
  order: number
}

type AnswersMap = Record<string, number>

type CandidateDetails = {
  fullName: string
  email: string
}

const STORAGE_KEYS = {
  details: "ewa-entry-test-details-v1",
  attemptSeed: "ewa-entry-test-seed-v1",
  answers: "ewa-entry-test-answers-v1",
  submitted: "ewa-entry-test-submitted-v1",
  startedAt: "ewa-entry-test-started-at-v1",
}

function seededShuffle<T>(items: T[], seed: number): T[] {
  const array = [...items]
  let s = seed
  for (let i = array.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280
    const j = Math.floor((s / 233280) * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

function getOrCreateSeed() {
  if (typeof window === "undefined") return Date.now()
  const existing = window.sessionStorage.getItem(STORAGE_KEYS.attemptSeed)
  if (existing) return Number(existing)

  const seed = Date.now()
  window.sessionStorage.setItem(STORAGE_KEYS.attemptSeed, String(seed))
  return seed
}

function buildAttemptQuestions(seed: number): AttemptQuestion[] {
  return seededShuffle(QUESTION_POOL, seed)
    .slice(0, QUESTIONS_PER_ATTEMPT)
    .map((question, index) => ({ ...question, order: index + 1 }))
}

function formatSeconds(totalSeconds: number) {
  const mins = Math.floor(totalSeconds / 60)
  const secs = totalSeconds % 60
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
}

function getCategoryBreakdown(questions: AttemptQuestion[], answers: AnswersMap) {
  const grouped: Record<string, { total: number; correct: number }> = {}
  for (const question of questions) {
    if (!grouped[question.category]) {
      grouped[question.category] = { total: 0, correct: 0 }
    }
    grouped[question.category].total += 1
    if (answers[question.id] === question.correctIndex) {
      grouped[question.category].correct += 1
    }
  }
  return grouped
}

export default function EwaEntryTestPage() {
  const [mounted, setMounted] = useState(false)
  const [details, setDetails] = useState<CandidateDetails>({ fullName: "", email: "" })
  const [started, setStarted] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [answers, setAnswers] = useState<AnswersMap>({})
  const [secondsRemaining, setSecondsRemaining] = useState(TEST_TIME_MINUTES * 60)
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState("")

  const seed = useMemo(() => (mounted ? getOrCreateSeed() : 0), [mounted])
  const questions = useMemo(() => (mounted ? buildAttemptQuestions(seed) : []), [mounted, seed])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const storedDetails = window.localStorage.getItem(STORAGE_KEYS.details)
    const storedAnswers = window.sessionStorage.getItem(STORAGE_KEYS.answers)
    const storedSubmitted = window.sessionStorage.getItem(STORAGE_KEYS.submitted)
    const startedAt = window.sessionStorage.getItem(STORAGE_KEYS.startedAt)

    if (storedDetails) setDetails(JSON.parse(storedDetails))
    if (storedAnswers) setAnswers(JSON.parse(storedAnswers))
    if (storedSubmitted === "true") setSubmitted(true)
    if (startedAt) {
      setStarted(true)
      const elapsed = Math.floor((Date.now() - Number(startedAt)) / 1000)
      const remaining = Math.max(TEST_TIME_MINUTES * 60 - elapsed, 0)
      setSecondsRemaining(remaining)
    }
  }, [mounted])

  useEffect(() => {
    if (!mounted || !started || submitted) return
    if (secondsRemaining <= 0) {
      void handleSubmit(true)
      return
    }

    const timer = window.setInterval(() => {
      setSecondsRemaining((prev) => prev - 1)
    }, 1000)

    return () => window.clearInterval(timer)
  }, [mounted, started, submitted, secondsRemaining])

  const answeredCount = Object.keys(answers).length
  const score = questions.reduce((sum, question) => {
    return sum + (answers[question.id] === question.correctIndex ? 1 : 0)
  }, 0)
  const percent = questions.length ? Math.round((score / questions.length) * 100) : 0
  const passed = percent >= PASS_MARK_PERCENT
  const categoryBreakdown = getCategoryBreakdown(questions, answers)

  function startAttempt() {
    if (!details.fullName.trim() || !details.email.trim()) {
      setSaveMessage("Please enter your full name and email address before starting.")
      return
    }

    window.localStorage.setItem(STORAGE_KEYS.details, JSON.stringify(details))
    window.sessionStorage.setItem(STORAGE_KEYS.startedAt, String(Date.now()))
    window.sessionStorage.removeItem(STORAGE_KEYS.answers)
    window.sessionStorage.removeItem(STORAGE_KEYS.submitted)
    setAnswers({})
    setSubmitted(false)
    setStarted(true)
    setSecondsRemaining(TEST_TIME_MINUTES * 60)
    setSaveMessage("")
  }

  function updateAnswer(questionId: string, optionIndex: number) {
    const updated = { ...answers, [questionId]: optionIndex }
    setAnswers(updated)
    window.sessionStorage.setItem(STORAGE_KEYS.answers, JSON.stringify(updated))
  }

  async function handleSubmit(autoSubmitted = false) {
    if (submitted) return

    setSubmitted(true)
    window.sessionStorage.setItem(STORAGE_KEYS.submitted, "true")
    window.sessionStorage.setItem(STORAGE_KEYS.answers, JSON.stringify(answers))

    setSaving(true)
    setSaveMessage("Saving result...")
    try {
      const payload = {
        candidate: details,
        score,
        percent,
        passed,
        answeredCount,
        totalQuestions: questions.length,
        questionPoolSize: QUESTION_POOL_SIZE,
        submittedAt: new Date().toISOString(),
        autoSubmitted,
        categoryBreakdown,
        responses: questions.map((question) => ({
          id: question.id,
          category: question.category,
          prompt: question.prompt,
          selectedIndex: answers[question.id] ?? null,
          correctIndex: question.correctIndex,
          correct: answers[question.id] === question.correctIndex,
        })),
      }

      const response = await fetch("/api/ewa-entry-test-attempt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error("Unable to save test result.")
      }

      setSaveMessage(autoSubmitted ? "Time expired. Result saved." : "Result saved successfully.")
    } catch (error) {
      setSaveMessage("Result marked, but saving failed. Check the API setup.")
    } finally {
      setSaving(false)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  function resetAttempt() {
    window.sessionStorage.removeItem(STORAGE_KEYS.attemptSeed)
    window.sessionStorage.removeItem(STORAGE_KEYS.answers)
    window.sessionStorage.removeItem(STORAGE_KEYS.submitted)
    window.sessionStorage.removeItem(STORAGE_KEYS.startedAt)
    window.location.reload()
  }

  if (!mounted) {
    return <div className="mx-auto max-w-5xl p-6">Loading...</div>
  }

  return (
    <main className="min-h-screen bg-slate-50 py-8 text-slate-900">
      <div className="mx-auto max-w-5xl px-4">
        <div className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="mb-2 flex items-center gap-3">
                  <img
                    src="/ewa_logo_eal_recognised.png"
                    alt="EWA Tracker Ltd logo"
                    className="h-14 w-auto"
                  />
                  <div>
                    <h1 className="text-2xl font-bold">EWA Entry Test Mock Assessment</h1>
                    <p className="text-sm text-slate-600">
                      Unofficial practice assessment for electricians considering the EWA entry test.
                    </p>
                  </div>
                </div>
                <p className="max-w-3xl text-sm text-slate-600">
                  This mock is designed to reflect topic areas and question style candidates may encounter. It is
                  <span className="font-semibold"> not an official EAL paper</span> and does not reproduce official
                  questions.
                </p>
              </div>
              <div className="rounded-xl bg-blue-50 px-4 py-3 text-sm text-blue-900">
                <div><strong>Question pool:</strong> {QUESTION_POOL_SIZE}</div>
                <div><strong>Questions per attempt:</strong> {QUESTIONS_PER_ATTEMPT}</div>
                <div><strong>Pass mark:</strong> {PASS_MARK_PERCENT}%</div>
                <div><strong>Time allowed:</strong> {TEST_TIME_MINUTES} minutes</div>
              </div>
            </div>
          </div>

          {!started && (
            <div className="grid gap-6 px-6 py-6 md:grid-cols-[1.2fr_.8fr]">
              <div>
                <h2 className="mb-3 text-lg font-semibold">Before you begin</h2>
                <ul className="list-disc space-y-2 pl-5 text-sm text-slate-700">
                  <li>Each attempt loads a random 50-question paper from a 200-question bank.</li>
                  <li>Your attempt is kept stable during the session, even if you refresh the page.</li>
                  <li>When the time expires, the test is submitted automatically.</li>
                  <li>Use this as a practice tool only. It does not guarantee success in any official entry test.</li>
                </ul>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <h2 className="mb-4 text-lg font-semibold">Candidate details</h2>
                <div className="space-y-3">
                  <div>
                    <label className="mb-1 block text-sm font-medium">Full name</label>
                    <input
                      type="text"
                      value={details.fullName}
                      onChange={(e) => setDetails((prev) => ({ ...prev, fullName: e.target.value }))}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none ring-0 transition focus:border-blue-500"
                      placeholder="Enter full name"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">Email address</label>
                    <input
                      type="email"
                      value={details.email}
                      onChange={(e) => setDetails((prev) => ({ ...prev, email: e.target.value }))}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none ring-0 transition focus:border-blue-500"
                      placeholder="Enter email address"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={startAttempt}
                    className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700"
                  >
                    Start mock test
                  </button>
                  {saveMessage && <p className="text-sm text-amber-700">{saveMessage}</p>}
                </div>
              </div>
            </div>
          )}

          {started && (
            <div className="border-t border-slate-200 bg-slate-50 px-6 py-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="text-sm text-slate-700">
                  <strong>Candidate:</strong> {details.fullName || "Not set"} | <strong>Email:</strong>{" "}
                  {details.email || "Not set"}
                </div>
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <span className="rounded-full bg-white px-3 py-1 shadow-sm">
                    Answered: <strong>{answeredCount}</strong> / {questions.length}
                  </span>
                  <span className="rounded-full bg-white px-3 py-1 shadow-sm">
                    Time remaining: <strong>{formatSeconds(secondsRemaining)}</strong>
                  </span>
                  {!submitted && (
                    <button
                      type="button"
                      onClick={() => handleSubmit(false)}
                      className="rounded-xl bg-emerald-600 px-4 py-2 font-semibold text-white transition hover:bg-emerald-700"
                    >
                      Submit attempt
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={resetAttempt}
                    className="rounded-xl border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-800 transition hover:bg-slate-100"
                  >
                    New random attempt
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {submitted && (
          <section className={`mb-6 rounded-2xl border p-6 shadow-sm ${passed ? "border-emerald-300 bg-emerald-50" : "border-rose-300 bg-rose-50"}`}>
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <h2 className="text-2xl font-bold">{passed ? "Pass" : "Fail"}</h2>
                <p className="mt-2 text-sm text-slate-700">
                  Score: <strong>{score}</strong> / {questions.length} ({percent}%)
                </p>
                <p className="text-sm text-slate-700">
                  Questions answered: <strong>{answeredCount}</strong> / {questions.length}
                </p>
                <p className="mt-3 max-w-3xl text-sm text-slate-700">
                  {passed
                    ? "This is a positive practice result. It suggests a reasonable level of underpinning knowledge across the areas tested."
                    : "This practice result suggests further revision is needed before attempting any formal entry test route."}
                </p>
                <p className="mt-1 text-xs text-slate-600">
                  {saving ? "Saving..." : saveMessage}
                </p>
              </div>

              <div className="rounded-xl bg-white p-4 text-sm shadow-sm">
                <h3 className="mb-2 font-semibold">Category breakdown</h3>
                <div className="space-y-1">
                  {Object.entries(categoryBreakdown).map(([category, values]) => {
                    const categoryPercent = Math.round((values.correct / values.total) * 100)
                    return (
                      <div key={category} className="flex items-center justify-between gap-6">
                        <span>{category}</span>
                        <span className="font-medium">
                          {values.correct}/{values.total} ({categoryPercent}%)
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </section>
        )}

        {started && (
          <section className="space-y-4">
            {questions.map((question) => {
              const selected = answers[question.id]
              const isCorrect = submitted && selected === question.correctIndex
              const isIncorrect = submitted && selected !== undefined && selected !== question.correctIndex

              return (
                <article key={question.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="mb-4">
                    <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      {question.category}
                    </div>
                    <h3 className="text-base font-semibold">
                      {question.order}. {question.prompt}
                    </h3>
                  </div>

                  <div className="space-y-2">
                    {question.options.map((option, optionIndex) => {
                      const checked = selected === optionIndex
                      const showCorrect = submitted && optionIndex === question.correctIndex
                      const showIncorrect = submitted && checked && optionIndex !== question.correctIndex

                      return (
                        <label
                          key={optionIndex}
                          className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 transition ${
                            showCorrect
                              ? "border-emerald-400 bg-emerald-50"
                              : showIncorrect
                              ? "border-rose-400 bg-rose-50"
                              : checked
                              ? "border-blue-500 bg-blue-50"
                              : "border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          <input
                            type="radio"
                            name={question.id}
                            checked={checked}
                            disabled={submitted}
                            onChange={() => updateAnswer(question.id, optionIndex)}
                            className="mt-1"
                          />
                          <span className="text-sm">
                            <strong>{String.fromCharCode(65 + optionIndex)})</strong> {option}
                          </span>
                        </label>
                      )
                    })}
                  </div>

                  {submitted && (
                    <div className={`mt-4 rounded-xl px-4 py-3 text-sm ${isCorrect ? "bg-emerald-50 text-emerald-900" : isIncorrect ? "bg-rose-50 text-rose-900" : "bg-slate-50 text-slate-800"}`}>
                      <div className="font-semibold">
                        Suggested answer: {String.fromCharCode(65 + question.correctIndex)}){" "}
                        {question.options[question.correctIndex]}
                      </div>
                      <div className="mt-1">{question.explanation}</div>
                    </div>
                  )}
                </article>
              )
            })}
          </section>
        )}
      </div>
    </main>
  )
}
