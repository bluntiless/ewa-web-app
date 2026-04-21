import { put } from "@vercel/blob"
import { NextResponse } from "next/server"
import { encryptJSON } from "@/lib/encryption"
import { uploadToSharePoint, isSharePointConfigured, createFolder } from "@/lib/sharepoint"
import { PDFDocument, StandardFonts, rgb } from "pdf-lib"

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

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0]
}

async function generateResultPDF(result: EWAEntryTestResult): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create()
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica)

  const page = pdfDoc.addPage([595, 842]) // A4 size
  const { width, height } = page.getSize()

  let y = height - 50

  // Header
  page.drawText("EWA Entry Test Mock - Results", {
    x: 50,
    y,
    size: 20,
    font: helveticaBold,
    color: rgb(0.12, 0.23, 0.37), // Dark blue
  })

  y -= 30

  // Candidate details
  page.drawText(`Candidate: ${result.candidateName}`, {
    x: 50,
    y,
    size: 12,
    font: helveticaBold,
    color: rgb(0, 0, 0),
  })

  y -= 18
  page.drawText(`Email: ${result.email}`, {
    x: 50,
    y,
    size: 10,
    font: helvetica,
    color: rgb(0.3, 0.3, 0.3),
  })

  y -= 18
  page.drawText(`Submitted: ${new Date(result.submittedAt).toLocaleString("en-GB")}`, {
    x: 50,
    y,
    size: 10,
    font: helvetica,
    color: rgb(0.3, 0.3, 0.3),
  })

  y -= 18
  page.drawText(`Reference: ${result.id}`, {
    x: 50,
    y,
    size: 10,
    font: helvetica,
    color: rgb(0.3, 0.3, 0.3),
  })

  y -= 40

  // Result summary box
  const resultColor = result.passed ? rgb(0.02, 0.59, 0.41) : rgb(0.86, 0.15, 0.15)
  const resultText = result.passed ? "PASS" : "FAIL"

  page.drawRectangle({
    x: 50,
    y: y - 60,
    width: width - 100,
    height: 70,
    color: result.passed ? rgb(0.93, 0.99, 0.96) : rgb(1, 0.95, 0.95),
    borderColor: resultColor,
    borderWidth: 2,
  })

  page.drawText(resultText, {
    x: 70,
    y: y - 25,
    size: 24,
    font: helveticaBold,
    color: resultColor,
  })

  page.drawText(`Score: ${result.score}/${result.totalQuestions} (${result.percent}%)`, {
    x: 70,
    y: y - 50,
    size: 14,
    font: helvetica,
    color: rgb(0.2, 0.2, 0.2),
  })

  page.drawText("Pass mark: 60%", {
    x: 350,
    y: y - 50,
    size: 10,
    font: helvetica,
    color: rgb(0.4, 0.4, 0.4),
  })

  y -= 90

  // Category breakdown header
  page.drawText("Category Breakdown", {
    x: 50,
    y,
    size: 14,
    font: helveticaBold,
    color: rgb(0.12, 0.23, 0.37),
  })

  y -= 25

  // Table header
  page.drawText("Category", {
    x: 50,
    y,
    size: 10,
    font: helveticaBold,
    color: rgb(0.3, 0.3, 0.3),
  })

  page.drawText("Score", {
    x: 400,
    y,
    size: 10,
    font: helveticaBold,
    color: rgb(0.3, 0.3, 0.3),
  })

  page.drawText("%", {
    x: 480,
    y,
    size: 10,
    font: helveticaBold,
    color: rgb(0.3, 0.3, 0.3),
  })

  y -= 5
  page.drawLine({
    start: { x: 50, y },
    end: { x: width - 50, y },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8),
  })

  y -= 18

  // Category rows
  for (const [category, values] of Object.entries(result.categoryBreakdown)) {
    const pct = Math.round((values.correct / values.total) * 100)
    const catColor = pct >= 60 ? rgb(0.02, 0.59, 0.41) : rgb(0.86, 0.15, 0.15)

    page.drawText(category, {
      x: 50,
      y,
      size: 10,
      font: helvetica,
      color: rgb(0.2, 0.2, 0.2),
    })

    page.drawText(`${values.correct}/${values.total}`, {
      x: 400,
      y,
      size: 10,
      font: helvetica,
      color: rgb(0.2, 0.2, 0.2),
    })

    page.drawText(`${pct}%`, {
      x: 480,
      y,
      size: 10,
      font: helveticaBold,
      color: catColor,
    })

    y -= 18
  }

  y -= 20

  // Disclaimer
  page.drawText("Note: This is an unofficial practice assessment for revision purposes only.", {
    x: 50,
    y,
    size: 9,
    font: helvetica,
    color: rgb(0.5, 0.5, 0.5),
  })

  y -= 14
  page.drawText("It does not reproduce official EAL questions.", {
    x: 50,
    y,
    size: 9,
    font: helvetica,
    color: rgb(0.5, 0.5, 0.5),
  })

  // Footer
  page.drawText("EWA Tracker Ltd | ewatracker.co.uk", {
    x: 50,
    y: 30,
    size: 8,
    font: helvetica,
    color: rgb(0.6, 0.6, 0.6),
  })

  return pdfDoc.save()
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const candidateEmail = String(body?.candidate?.email || "").trim()
    const candidateName = String(body?.candidate?.fullName || "Candidate").trim()
    
    const resultId = generateResultId()
    const submittedAt = new Date().toISOString()
    const dateStr = formatDate(new Date())

    // Create result data
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

    // Encrypt and store result in Blob
    const encryptedResult = encryptJSON(resultData)

    await put(
      `ewa-entry-test-results/${resultId}/result.enc`,
      encryptedResult,
      { access: "public", contentType: "text/plain" }
    )

    // Store metadata file for admin listing
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

    // Upload PDF to SharePoint if configured
    let sharePointUrl: string | undefined
    if (isSharePointConfigured()) {
      try {
        // Generate results PDF
        const pdfBytes = await generateResultPDF(resultData)

        // Create folder structure: EWA-Entry-Test-Results/YYYY-MM
        const folderPath = `EWA-Entry-Test-Results/${dateStr.substring(0, 7)}`
        await createFolder(folderPath)

        // Generate filename
        const safeName = candidateName.replace(/[^a-zA-Z0-9]/g, "-").substring(0, 30)
        const pdfFileName = `EWA-Entry-Test-${safeName}-${dateStr}-${resultId}.pdf`

        // Upload PDF to SharePoint
        const uploadResult = await uploadToSharePoint(
          folderPath,
          pdfFileName,
          Buffer.from(pdfBytes),
          "application/pdf"
        )

        if (uploadResult.success) {
          sharePointUrl = uploadResult.url
          console.log("Successfully uploaded EWA Entry Test result to SharePoint:", sharePointUrl)
        } else {
          console.error("SharePoint upload failed:", uploadResult.error)
        }
      } catch (error) {
        console.error("SharePoint upload error:", error)
        // Don't fail the submission if SharePoint upload fails
      }
    } else {
      console.log("SharePoint not configured, skipping upload")
    }

    return NextResponse.json({ 
      ok: true, 
      resultId,
      sharePointUrl,
      message: "Result saved successfully" 
    })
  } catch (error) {
    console.error("EWA entry test error:", error)
    return NextResponse.json({ ok: false, error: "Unable to save result" }, { status: 500 })
  }
}
