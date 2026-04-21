import { put } from "@vercel/blob"
import { NextResponse } from "next/server"
import { encryptJSON } from "@/lib/encryption"

export interface EWAEntryTestResult {
  id: string
  candidateName: string
  email: string
  score: number
  totalQuestions: number
  percent: number
  passed: boolean
  categoryBreakdown: Record<string, { correct: number; total: number }>
  submittedAt: string
  answers: Array<{
    questionId: string
    selectedAnswer: number
    correct: boolean
  }>
}

function generateResultId(): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 8)
  return `et-${timestamp}-${random}`
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const candidateEmail = String(body?.candidate?.email || "").trim()
    const candidateName = String(body?.candidate?.fullName || "Candidate").trim()
    
    const resultId = generateResultId()
    const submittedAt = new Date().toISOString()

    // Create result data matching Skills Scan pattern
    const resultData: EWAEntryTestResult = {
      id: resultId,
      candidateName,
      email: candidateEmail,
      score: body.score,
      totalQuestions: body.totalQuestions,
      percent: body.percent,
      passed: body.passed,
      categoryBreakdown: body.categoryBreakdown,
      submittedAt,
      answers: body.answers || [],
    }

    // Encrypt and store result (same pattern as Skills Scan)
    const encryptedResult = encryptJSON(resultData)

    await put(
      `ewa-entry-test-results/${resultId}/result.enc`,
      encryptedResult,
      { access: "public", contentType: "text/plain" }
    )

    // Also store a simple metadata file for admin listing
    const metadata = {
      id: resultId,
      candidateName,
      email: candidateEmail,
      score: body.score,
      totalQuestions: body.totalQuestions,
      percent: body.percent,
      passed: body.passed,
      submittedAt,
    }

    const encryptedMetadata = encryptJSON(metadata)

    await put(
      `ewa-entry-test-results/${resultId}/metadata.enc`,
      encryptedMetadata,
      { access: "public", contentType: "text/plain" }
    )

    return NextResponse.json({ 
      ok: true, 
      resultId,
      message: "Result saved successfully" 
    })
  } catch (error) {
    console.error("EWA entry test error:", error)
    return NextResponse.json({ ok: false, error: "Unable to save result" }, { status: 500 })
  }
}
