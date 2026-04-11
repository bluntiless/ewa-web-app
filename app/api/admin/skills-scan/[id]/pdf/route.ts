import { list } from "@vercel/blob"
import { getServerSession } from "next-auth"
import { type NextRequest, NextResponse } from "next/server"
import { PDFDocument, rgb, StandardFonts } from "pdf-lib"
import { authOptions } from "@/lib/auth"
import type { SkillsScanSubmissionData } from "@/lib/skills-scan-submission"
import { skillsScanSections } from "@/lib/skills-scan-data"
import { decryptJSON } from "@/lib/encryption"

// Helper to find blob URL by pathname
async function getBlobUrl(pathname: string): Promise<string | null> {
  const { blobs } = await list({ prefix: pathname.split("/").slice(0, -1).join("/") + "/" })
  const blob = blobs.find((b) => b.pathname === pathname)
  return blob?.url || null
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  try {
    // Get blob URL for the encrypted response file
    const blobUrl = await getBlobUrl(`skills-scan-submissions/${id}/response.enc`)

    if (!blobUrl) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 })
    }

    const response = await fetch(blobUrl)
    if (!response.ok) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 })
    }

    const encryptedText = await response.text()
    const data = decryptJSON<SkillsScanSubmissionData>(encryptedText)

    // Generate the filled PDF
    const pdfBytes = await generateTespPdf(data)

    // Return the PDF
    return new NextResponse(pdfBytes, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Skills Scan - ${data.metadata.candidateName} - ${data.metadata.submittedAt.split("T")[0]}.pdf"`,
      },
    })
  } catch (error) {
    console.error("Failed to generate PDF:", error)
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 })
  }
}

async function generateTespPdf(data: SkillsScanSubmissionData): Promise<Uint8Array> {
  // Create a new PDF document (since we can't reliably fill the template, we'll create a new one)
  const pdfDoc = await PDFDocument.create()
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  const { formData, metadata } = data

  // Page settings
  const pageWidth = 595.28 // A4 width in points
  const pageHeight = 841.89 // A4 height in points
  const margin = 50
  const lineHeight = 14
  const sectionGap = 20

  // Helper function to add a new page
  const addPage = () => {
    const page = pdfDoc.addPage([pageWidth, pageHeight])
    return { page, y: pageHeight - margin }
  }

  // Helper to draw text
  const drawText = (
    page: ReturnType<typeof pdfDoc.addPage>,
    text: string,
    x: number,
    y: number,
    options: { font?: typeof helveticaFont; size?: number; color?: ReturnType<typeof rgb> } = {}
  ) => {
    const { font = helveticaFont, size = 10, color = rgb(0, 0, 0) } = options
    page.drawText(text, { x, y, font, size, color })
  }

  // Helper to draw a checkbox
  const drawCheckbox = (
    page: ReturnType<typeof pdfDoc.addPage>,
    x: number,
    y: number,
    checked: boolean
  ) => {
    const size = 10
    page.drawRectangle({
      x,
      y: y - 2,
      width: size,
      height: size,
      borderColor: rgb(0, 0, 0),
      borderWidth: 1,
    })
    if (checked) {
      drawText(page, "X", x + 2, y, { size: 8 })
    }
  }

  // Page 1: Cover and Candidate Details
  let { page, y } = addPage()

  // Header
  drawText(page, "EWA Skills Scan", margin, y, { font: helveticaBold, size: 18 })
  y -= 25
  drawText(page, "Installation & Maintenance Electrician - Level 3", margin, y, { size: 12 })
  y -= 15
  drawText(page, "Experienced Worker Assessment", margin, y, { size: 12 })
  y -= sectionGap * 2

  // Candidate Details Section
  drawText(page, "CANDIDATE DETAILS", margin, y, { font: helveticaBold, size: 12 })
  y -= lineHeight * 1.5

  const labelWidth = 150
  const details = [
    ["Full Name:", formData.fullName],
    ["Email:", formData.email],
    ["Phone:", formData.phone || "Not provided"],
    ["Years of Experience:", formData.yearsExperience || "Not provided"],
    ["Right to Work in UK:", formData.rightToWork === "yes" ? "Yes" : "No"],
    ["Criminal Convictions:", formData.criminalConvictions === "yes" ? "Yes - see notes" : "No"],
    ["Declaration Signed:", formData.declaration ? "Yes" : "No"],
  ]

  for (const [label, value] of details) {
    drawText(page, label, margin, y, { font: helveticaBold })
    drawText(page, value, margin + labelWidth, y)
    y -= lineHeight * 1.2
  }

  y -= sectionGap

  // Submission Info
  drawText(page, "SUBMISSION INFORMATION", margin, y, { font: helveticaBold, size: 12 })
  y -= lineHeight * 1.5
  drawText(page, "Submission ID:", margin, y, { font: helveticaBold })
  drawText(page, metadata.id, margin + labelWidth, y)
  y -= lineHeight * 1.2
  drawText(page, "Submitted At:", margin, y, { font: helveticaBold })
  drawText(page, new Date(metadata.submittedAt).toLocaleString("en-GB"), margin + labelWidth, y)
  y -= sectionGap * 2

  // Note about provider verification
  drawText(page, "PROVIDER VERIFICATION", margin, y, { font: helveticaBold, size: 12 })
  y -= lineHeight * 1.5
  drawText(page, "This section to be completed by the training provider during assessment.", margin, y, {
    color: rgb(0.5, 0.5, 0.5),
  })
  y -= lineHeight * 1.2
  drawText(page, "Provider Name: _______________________________________", margin, y)
  y -= lineHeight * 1.2
  drawText(page, "Assessor Name: _______________________________________", margin, y)
  y -= lineHeight * 1.2
  drawText(page, "Date: _______________________________________", margin, y)
  y -= lineHeight * 1.2
  drawText(page, "Signature: _______________________________________", margin, y)

  // Skills Scan Pages
  for (const section of skillsScanSections) {
    const sectionData = formData.skills[section.id]
    if (!sectionData) continue

    // Start a new page for each section
    const result = addPage()
    page = result.page
    y = result.y

    // Section Header
    drawText(page, section.title.toUpperCase(), margin, y, { font: helveticaBold, size: 14 })
    y -= lineHeight * 1.5

    if (section.description) {
      // Wrap description text
      const maxWidth = pageWidth - margin * 2
      const words = section.description.split(" ")
      let currentLine = ""

      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word
        const textWidth = helveticaFont.widthOfTextAtSize(testLine, 9)

        if (textWidth > maxWidth) {
          drawText(page, currentLine, margin, y, { size: 9, color: rgb(0.3, 0.3, 0.3) })
          y -= lineHeight
          currentLine = word
        } else {
          currentLine = testLine
        }
      }
      if (currentLine) {
        drawText(page, currentLine, margin, y, { size: 9, color: rgb(0.3, 0.3, 0.3) })
        y -= lineHeight
      }
    }

    y -= lineHeight

    // Column headers
    const colSkill = margin
    const colKnowledge = pageWidth - margin - 150
    const colExperience = pageWidth - margin - 75

    drawText(page, "SKILL/COMPETENCY", colSkill, y, { font: helveticaBold, size: 9 })
    drawText(page, "KNOWLEDGE", colKnowledge, y, { font: helveticaBold, size: 9 })
    drawText(page, "EXPERIENCE", colExperience, y, { font: helveticaBold, size: 9 })
    y -= lineHeight * 1.5

    // Draw a line
    page.drawLine({
      start: { x: margin, y: y + 5 },
      end: { x: pageWidth - margin, y: y + 5 },
      thickness: 0.5,
      color: rgb(0.8, 0.8, 0.8),
    })

    y -= 5

    // Items
    for (const item of section.items) {
      const skill = sectionData[item.id]

      // Check if we need a new page
      if (y < margin + 50) {
        const newResult = addPage()
        page = newResult.page
        y = newResult.y

        // Redraw headers on new page
        drawText(page, `${section.title} (continued)`, margin, y, { font: helveticaBold, size: 12 })
        y -= lineHeight * 2
      }

      // Wrap skill text
      const maxSkillWidth = colKnowledge - colSkill - 10
      const words = item.text.split(" ")
      let lines: string[] = []
      let currentLine = ""

      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word
        const textWidth = helveticaFont.widthOfTextAtSize(testLine, 9)

        if (textWidth > maxSkillWidth) {
          lines.push(currentLine)
          currentLine = word
        } else {
          currentLine = testLine
        }
      }
      if (currentLine) lines.push(currentLine)

      // Draw skill text (first line with ratings)
      drawText(page, lines[0] || item.text, colSkill, y, { size: 9 })

      // Draw ratings
      const knowledgeRating = skill?.knowledge || ""
      const experienceRating = skill?.experience || ""

      drawText(page, getRatingLabel(knowledgeRating), colKnowledge, y, {
        size: 9,
        color: getRatingColor(knowledgeRating),
      })
      drawText(page, getRatingLabel(experienceRating), colExperience, y, {
        size: 9,
        color: getRatingColor(experienceRating),
      })

      y -= lineHeight

      // Draw remaining lines of skill text
      for (let i = 1; i < lines.length; i++) {
        drawText(page, lines[i], colSkill, y, { size: 9 })
        y -= lineHeight
      }

      y -= 3 // Small gap between items
    }
  }

  // Final page with notes
  const notesResult = addPage()
  page = notesResult.page
  y = notesResult.y

  drawText(page, "ADDITIONAL NOTES", margin, y, { font: helveticaBold, size: 14 })
  y -= lineHeight * 2

  if (formData.furtherKnowledgeRequired) {
    drawText(page, "Further Knowledge Required:", margin, y, { font: helveticaBold, size: 10 })
    y -= lineHeight * 1.2
    const lines = wrapText(formData.furtherKnowledgeRequired, helveticaFont, 9, pageWidth - margin * 2)
    for (const line of lines) {
      drawText(page, line, margin, y, { size: 9 })
      y -= lineHeight
    }
    y -= lineHeight
  }

  if (formData.furtherExperienceRequired) {
    drawText(page, "Further Experience Required:", margin, y, { font: helveticaBold, size: 10 })
    y -= lineHeight * 1.2
    const lines = wrapText(formData.furtherExperienceRequired, helveticaFont, 9, pageWidth - margin * 2)
    for (const line of lines) {
      drawText(page, line, margin, y, { size: 9 })
      y -= lineHeight
    }
    y -= lineHeight
  }

  if (formData.otherQualifications) {
    drawText(page, "Other Qualifications:", margin, y, { font: helveticaBold, size: 10 })
    y -= lineHeight * 1.2
    const lines = wrapText(formData.otherQualifications, helveticaFont, 9, pageWidth - margin * 2)
    for (const line of lines) {
      drawText(page, line, margin, y, { size: 9 })
      y -= lineHeight
    }
  }

  // Footer note
  y -= sectionGap * 2
  drawText(
    page,
    "Generated by EWA Tracker Ltd - This document contains candidate self-assessment data only.",
    margin,
    y,
    { size: 8, color: rgb(0.5, 0.5, 0.5) }
  )
  y -= lineHeight
  drawText(
    page,
    "Provider verification sections must be completed during formal assessment.",
    margin,
    y,
    { size: 8, color: rgb(0.5, 0.5, 0.5) }
  )

  const pdfBytes = await pdfDoc.save()
  return pdfBytes
}

function getRatingLabel(rating: string): string {
  switch (rating) {
    case "limited":
      return "Limited"
    case "adequate":
      return "Adequate"
    case "extensive":
      return "Extensive"
    case "unsure":
      return "Unsure"
    default:
      return "-"
  }
}

function getRatingColor(rating: string) {
  switch (rating) {
    case "limited":
      return rgb(0.8, 0.6, 0)
    case "adequate":
      return rgb(0, 0.5, 0.8)
    case "extensive":
      return rgb(0, 0.6, 0.3)
    case "unsure":
      return rgb(0.5, 0.5, 0.5)
    default:
      return rgb(0.7, 0.7, 0.7)
  }
}

function wrapText(
  text: string,
  font: { widthOfTextAtSize: (text: string, size: number) => number },
  size: number,
  maxWidth: number
): string[] {
  const words = text.split(" ")
  const lines: string[] = []
  let currentLine = ""

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word
    const textWidth = font.widthOfTextAtSize(testLine, size)

    if (textWidth > maxWidth) {
      lines.push(currentLine)
      currentLine = word
    } else {
      currentLine = testLine
    }
  }
  if (currentLine) lines.push(currentLine)

  return lines
}
