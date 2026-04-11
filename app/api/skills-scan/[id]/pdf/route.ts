import { list } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"
import { PDFDocument, rgb, StandardFonts } from "pdf-lib"
import { skillsScanSections } from "@/lib/skills-scan-data"
import { decryptJSON } from "@/lib/encryption"

interface SkillAssessment {
  knowledge: string
  experience: string
}

interface SkillsScanSubmissionData {
  fullName: string
  email: string
  phone: string
  yearsExperience: string
  otherQualifications: string
  criminalConvictions: string
  rightToWork: string
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
  suitabilityResult?: {
    result: string
    title: string
    summary: string
    knowledgeScore: number
    experienceScore: number
  }
}

async function getBlobUrl(pathname: string): Promise<string | null> {
  const { blobs } = await list({ prefix: pathname.split("/").slice(0, -1).join("/") + "/" })
  const blob = blobs.find((b) => b.pathname === pathname)
  return blob?.url || null
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  try {
    // Get the encrypted submission data
    const blobUrl = await getBlobUrl(`skills-scan-submissions/${id}/response.enc`)

    if (!blobUrl) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 })
    }

    const response = await fetch(blobUrl)
    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch submission data" }, { status: 500 })
    }

    const encryptedText = await response.text()
    const data = decryptJSON<SkillsScanSubmissionData>(encryptedText)

    // Create a new PDF document
    const pdfDoc = await PDFDocument.create()
    const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

    const pageWidth = 595.28 // A4 width in points
    const pageHeight = 841.89 // A4 height in points
    const margin = 50
    const lineHeight = 14
    const sectionSpacing = 20

    let currentPage = pdfDoc.addPage([pageWidth, pageHeight])
    let yPosition = pageHeight - margin

    const addText = (text: string, x: number, y: number, size: number, font = helvetica) => {
      currentPage.drawText(text, { x, y, size, font, color: rgb(0, 0, 0) })
    }

    const checkNewPage = (neededSpace: number) => {
      if (yPosition - neededSpace < margin) {
        currentPage = pdfDoc.addPage([pageWidth, pageHeight])
        yPosition = pageHeight - margin
      }
    }

    const wrapText = (text: string, maxWidth: number, fontSize: number): string[] => {
      const words = text.split(" ")
      const lines: string[] = []
      let currentLine = ""

      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word
        const width = helvetica.widthOfTextAtSize(testLine, fontSize)

        if (width < maxWidth) {
          currentLine = testLine
        } else {
          if (currentLine) lines.push(currentLine)
          currentLine = word
        }
      }
      if (currentLine) lines.push(currentLine)
      return lines
    }

    // Title
    addText("Installation & Maintenance Electrician EWA", margin, yPosition, 16, helveticaBold)
    yPosition -= lineHeight * 1.5
    addText("Skills Scan - Completed Submission", margin, yPosition, 14, helveticaBold)
    yPosition -= lineHeight
    addText(`Generated: ${new Date().toLocaleDateString("en-GB")}`, margin, yPosition, 10)
    yPosition -= sectionSpacing * 1.5

    // Candidate Details Section
    addText("Candidate Details", margin, yPosition, 12, helveticaBold)
    yPosition -= lineHeight * 1.2
    currentPage.drawLine({
      start: { x: margin, y: yPosition + 5 },
      end: { x: pageWidth - margin, y: yPosition + 5 },
      thickness: 1,
      color: rgb(0, 0, 0),
    })
    yPosition -= lineHeight

    const details = [
      ["Name:", data.fullName || "Not provided"],
      ["Email:", data.email || "Not provided"],
      ["Phone:", data.phone || "Not provided"],
      ["Years of Experience:", data.yearsExperience || "Not provided"],
    ]

    for (const [label, value] of details) {
      addText(label, margin, yPosition, 10, helveticaBold)
      addText(value, margin + 120, yPosition, 10)
      yPosition -= lineHeight
    }

    yPosition -= sectionSpacing

    // Suitability Result Section (if available)
    if (data.suitabilityResult) {
      checkNewPage(80)
      addText("Preliminary Suitability Indication", margin, yPosition, 12, helveticaBold)
      yPosition -= lineHeight * 1.2
      currentPage.drawLine({
        start: { x: margin, y: yPosition + 5 },
        end: { x: pageWidth - margin, y: yPosition + 5 },
        thickness: 1,
        color: rgb(0, 0, 0),
      })
      yPosition -= lineHeight

      addText(`Result: ${data.suitabilityResult.title}`, margin, yPosition, 10, helveticaBold)
      yPosition -= lineHeight

      addText(`Knowledge Score: ${data.suitabilityResult.knowledgeScore}%`, margin, yPosition, 10)
      addText(`Experience Score: ${data.suitabilityResult.experienceScore}%`, margin + 150, yPosition, 10)
      yPosition -= lineHeight * 1.5

      const summaryLines = wrapText(data.suitabilityResult.summary, pageWidth - margin * 2, 10)
      for (const line of summaryLines) {
        checkNewPage(lineHeight)
        addText(line, margin, yPosition, 10)
        yPosition -= lineHeight
      }

      yPosition -= lineHeight
      const disclaimerLines = wrapText(
        "Important: This is a preliminary indication based on self-assessment responses only and remains subject to training provider review and verification.",
        pageWidth - margin * 2,
        8
      )
      for (const line of disclaimerLines) {
        checkNewPage(lineHeight)
        addText(line, margin, yPosition, 8)
        yPosition -= lineHeight * 0.9
      }

      yPosition -= sectionSpacing
    }

    // Selected Qualifications Section
    const selectedTableA = Object.entries(data.selectedQualifications?.tableA || {}).filter(([_, v]) => v)
    const selectedTableB = Object.entries(data.selectedQualifications?.tableB || {}).filter(([_, v]) => v)
    const selectedTableC = Object.entries(data.selectedQualifications?.tableC || {}).filter(([_, v]) => v)

    if (selectedTableA.length > 0 || selectedTableB.length > 0 || selectedTableC.length > 0) {
      checkNewPage(60)
      addText("Selected Qualifications", margin, yPosition, 12, helveticaBold)
      yPosition -= lineHeight * 1.2
      currentPage.drawLine({
        start: { x: margin, y: yPosition + 5 },
        end: { x: pageWidth - margin, y: yPosition + 5 },
        thickness: 1,
        color: rgb(0, 0, 0),
      })
      yPosition -= lineHeight

      const printQualifications = (title: string, quals: [string, boolean][]) => {
        if (quals.length === 0) return
        checkNewPage(30)
        addText(title, margin, yPosition, 10, helveticaBold)
        yPosition -= lineHeight

        for (const [name] of quals) {
          const lines = wrapText(`• ${name}`, pageWidth - margin * 2 - 10, 9)
          for (const line of lines) {
            checkNewPage(lineHeight)
            addText(line, margin + 10, yPosition, 9)
            yPosition -= lineHeight
          }
        }
        yPosition -= lineHeight * 0.5
      }

      printQualifications("Table A:", selectedTableA)
      printQualifications("Table B:", selectedTableB)
      printQualifications("Table C:", selectedTableC)

      yPosition -= sectionSpacing * 0.5
    }

    // Skills Assessment Sections
    for (const section of skillsScanSections) {
      checkNewPage(80)
      addText(section.title, margin, yPosition, 12, helveticaBold)
      yPosition -= lineHeight * 1.2
      currentPage.drawLine({
        start: { x: margin, y: yPosition + 5 },
        end: { x: pageWidth - margin, y: yPosition + 5 },
        thickness: 1,
        color: rgb(0, 0, 0),
      })
      yPosition -= lineHeight

      // Table header
      const col1Width = 250
      const col2Width = 80
      const col3Width = 80
      const tableX = margin

      addText("Skill/Task", tableX, yPosition, 9, helveticaBold)
      addText("Knowledge", tableX + col1Width + 20, yPosition, 9, helveticaBold)
      addText("Experience", tableX + col1Width + col2Width + 40, yPosition, 9, helveticaBold)
      yPosition -= lineHeight * 1.2

      for (const item of section.items) {
        const skill = data.skills?.[section.id]?.[item.id]
        const knowledge = skill?.knowledge || "-"
        const experience = skill?.experience || "-"

        // Calculate how many lines the skill text will need
        const textLines = wrapText(item.text, col1Width, 9)
        checkNewPage(textLines.length * lineHeight + 5)

        for (let i = 0; i < textLines.length; i++) {
          addText(textLines[i], tableX, yPosition, 9)
          if (i === 0) {
            // Format rating for display
            const formatRating = (r: string) => {
              if (r === "adequate") return "Adequate"
              if (r === "extensive") return "Extensive"
              if (r === "limited") return "Limited"
              if (r === "unsure") return "Unsure"
              return r
            }
            addText(formatRating(knowledge), tableX + col1Width + 20, yPosition, 9)
            addText(formatRating(experience), tableX + col1Width + col2Width + 40, yPosition, 9)
          }
          yPosition -= lineHeight
        }
        yPosition -= 3
      }

      yPosition -= sectionSpacing
    }

    // Further Requirements Section
    if (data.furtherKnowledgeRequired || data.furtherExperienceRequired) {
      checkNewPage(60)
      addText("Further Requirements Identified", margin, yPosition, 12, helveticaBold)
      yPosition -= lineHeight * 1.2
      currentPage.drawLine({
        start: { x: margin, y: yPosition + 5 },
        end: { x: pageWidth - margin, y: yPosition + 5 },
        thickness: 1,
        color: rgb(0, 0, 0),
      })
      yPosition -= lineHeight

      if (data.furtherKnowledgeRequired) {
        addText("Knowledge:", margin, yPosition, 10, helveticaBold)
        yPosition -= lineHeight
        const lines = wrapText(data.furtherKnowledgeRequired, pageWidth - margin * 2, 10)
        for (const line of lines) {
          checkNewPage(lineHeight)
          addText(line, margin, yPosition, 10)
          yPosition -= lineHeight
        }
        yPosition -= lineHeight * 0.5
      }

      if (data.furtherExperienceRequired) {
        addText("Experience:", margin, yPosition, 10, helveticaBold)
        yPosition -= lineHeight
        const lines = wrapText(data.furtherExperienceRequired, pageWidth - margin * 2, 10)
        for (const line of lines) {
          checkNewPage(lineHeight)
          addText(line, margin, yPosition, 10)
          yPosition -= lineHeight
        }
      }

      yPosition -= sectionSpacing
    }

    // Declaration Section
    checkNewPage(60)
    addText("Declaration", margin, yPosition, 12, helveticaBold)
    yPosition -= lineHeight * 1.2
    currentPage.drawLine({
      start: { x: margin, y: yPosition + 5 },
      end: { x: pageWidth - margin, y: yPosition + 5 },
      thickness: 1,
      color: rgb(0, 0, 0),
    })
    yPosition -= lineHeight

    addText("Criminal Convictions:", margin, yPosition, 10, helveticaBold)
    addText(data.criminalConvictions === "yes" ? "Yes" : "No", margin + 130, yPosition, 10)
    yPosition -= lineHeight

    addText("Right to Work in UK:", margin, yPosition, 10, helveticaBold)
    addText(data.rightToWork === "yes" ? "Yes" : "No", margin + 130, yPosition, 10)
    yPosition -= lineHeight

    addText("Declaration Agreed:", margin, yPosition, 10, helveticaBold)
    addText(data.declaration ? "Yes" : "No", margin + 130, yPosition, 10)
    yPosition -= sectionSpacing

    // Training Provider Verification Section (empty for provider to complete)
    checkNewPage(100)
    addText("Training Provider Verification", margin, yPosition, 12, helveticaBold)
    yPosition -= lineHeight * 1.2
    currentPage.drawLine({
      start: { x: margin, y: yPosition + 5 },
      end: { x: pageWidth - margin, y: yPosition + 5 },
      thickness: 1,
      color: rgb(0, 0, 0),
    })
    yPosition -= lineHeight

    addText("(To be completed by Training Provider only)", margin, yPosition, 9)
    yPosition -= lineHeight * 1.5

    const verificationFields = [
      "Does the candidate hold relevant L2 qualifications verified? Yes [ ] No [ ]",
      "Does the candidate hold relevant L3 qualifications verified? Yes [ ] No [ ]",
      "Approval obtained from TESP if qualification not listed? Yes [ ] No [ ] N/A [ ]",
      "Technical discussion carried out and documented? Yes [ ] No [ ]",
      "Approval obtained from TESP if not full-time practising electrician? Yes [ ] No [ ] N/A [ ]",
    ]

    for (const field of verificationFields) {
      checkNewPage(lineHeight * 1.5)
      addText(field, margin, yPosition, 9)
      yPosition -= lineHeight * 1.5
    }

    yPosition -= lineHeight
    addText("I confirm I have authenticated the applicant's knowledge and experience.", margin, yPosition, 9)
    yPosition -= lineHeight * 2

    addText("Signature: ________________________", margin, yPosition, 10)
    addText("Date: ______________", margin + 250, yPosition, 10)
    yPosition -= lineHeight * 1.5

    addText("Name: ________________________", margin, yPosition, 10)
    addText("Organisation: ______________", margin + 250, yPosition, 10)

    // Generate PDF bytes
    const pdfBytes = await pdfDoc.save()

    // Return the PDF
    return new NextResponse(pdfBytes, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Skills_Scan_${data.fullName?.replace(/\s+/g, "_") || "Candidate"}.pdf"`,
      },
    })
  } catch (error) {
    console.error("Error generating PDF:", error)
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 })
  }
}
