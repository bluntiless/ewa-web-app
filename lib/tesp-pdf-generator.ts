import { PDFDocument, rgb, StandardFonts, PDFPage, PDFFont } from "pdf-lib"
import type { SuitabilityEvaluation } from "./suitability-evaluation"
import { skillsScanSections } from "./skills-scan-data"

export interface TespPdfFormData {
  candidateName: string
  skills: {
    [sectionId: string]: {
      [skillId: string]: {
        knowledge: string
        experience: string
      }
    }
  }
  selectedQualifications?: {
    tableA: { [key: string]: boolean }
    tableB: { [key: string]: boolean }
    tableC: { [key: string]: boolean }
  }
  otherQualifications?: string
  furtherKnowledgeRequired?: string
  furtherExperienceRequired?: string
  suitabilityResult?: SuitabilityEvaluation
}

// Page dimensions (A4)
const PAGE_WIDTH = 595.28
const PAGE_HEIGHT = 841.89
const MARGIN = 50
const CONTENT_WIDTH = PAGE_WIDTH - (2 * MARGIN)

// Colors
const PURPLE = rgb(0.4, 0.2, 0.6)
const BLACK = rgb(0, 0, 0)
const GRAY = rgb(0.3, 0.3, 0.3)
const LIGHT_GRAY = rgb(0.85, 0.85, 0.85)
const WHITE = rgb(1, 1, 1)

// Helper to draw checkbox (with X if checked)
function drawCheckbox(
  page: PDFPage,
  x: number,
  y: number,
  checked: boolean,
  font: PDFFont,
  size: number = 10
) {
  // Draw box
  page.drawRectangle({
    x,
    y: y - size,
    width: size,
    height: size,
    borderColor: BLACK,
    borderWidth: 0.5,
    color: WHITE,
  })
  
  // Draw X if checked
  if (checked) {
    page.drawText("X", {
      x: x + 1.5,
      y: y - size + 1.5,
      size: size - 2,
      font,
      color: BLACK,
    })
  }
}

// Helper to wrap text
function wrapText(text: string, font: PDFFont, fontSize: number, maxWidth: number): string[] {
  const words = text.split(" ")
  const lines: string[] = []
  let currentLine = ""

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word
    const width = font.widthOfTextAtSize(testLine, fontSize)
    
    if (width <= maxWidth) {
      currentLine = testLine
    } else {
      if (currentLine) lines.push(currentLine)
      currentLine = word
    }
  }
  
  if (currentLine) lines.push(currentLine)
  return lines
}

/**
 * Creates a TESP-style Skills Scan PDF from scratch using pdf-lib
 * This generates a professional PDF that matches the official TESP format
 */
export async function createTespPdf(formData: TespPdfFormData): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create()
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  let currentPage = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT])
  let yPosition = PAGE_HEIGHT - MARGIN

  // Helper to add a new page
  const addNewPage = () => {
    currentPage = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT])
    yPosition = PAGE_HEIGHT - MARGIN
    return currentPage
  }

  // Helper to ensure space and add page if needed
  const ensureSpace = (needed: number) => {
    if (yPosition - needed < MARGIN + 50) {
      addNewPage()
    }
  }

  // ===== PAGE 1: Title and Header =====
  
  // Title
  currentPage.drawText("Installation & Maintenance Electrician", {
    x: MARGIN,
    y: yPosition,
    size: 16,
    font: helveticaBold,
    color: PURPLE,
  })
  yPosition -= 20

  currentPage.drawText("Experienced Worker Assessment", {
    x: MARGIN,
    y: yPosition,
    size: 16,
    font: helveticaBold,
    color: PURPLE,
  })
  yPosition -= 20

  currentPage.drawText("Skills Scan", {
    x: MARGIN,
    y: yPosition,
    size: 16,
    font: helveticaBold,
    color: PURPLE,
  })
  yPosition -= 30

  // Candidate Name
  currentPage.drawText("Candidate Name:", {
    x: MARGIN,
    y: yPosition,
    size: 11,
    font: helveticaBold,
    color: BLACK,
  })
  
  currentPage.drawText(formData.candidateName || "___________________", {
    x: MARGIN + 100,
    y: yPosition,
    size: 11,
    font: helvetica,
    color: BLACK,
  })
  yPosition -= 30

  // Training Provider Verification Section (blank for provider completion)
  currentPage.drawRectangle({
    x: MARGIN,
    y: yPosition - 120,
    width: CONTENT_WIDTH,
    height: 120,
    borderColor: PURPLE,
    borderWidth: 1,
  })

  currentPage.drawText("TRAINING PROVIDER VERIFICATION *(delete as required)", {
    x: MARGIN + 10,
    y: yPosition - 15,
    size: 10,
    font: helveticaBold,
    color: PURPLE,
  })

  const verificationItems = [
    "Does the candidate hold relevant L2 qualifications that have been verified?",
    "Does the candidate hold relevant L3 qualifications that have been verified?",
    "Approval obtained from TESP if qualification not listed in Tables A, B or C:",
    "A technical discussion has been carried out and has been Recorded/Documented*?",
    "Approval obtained from TESP if candidate is not a full time practising electrician:",
  ]

  let vY = yPosition - 30
  for (const item of verificationItems) {
    currentPage.drawText(item, {
      x: MARGIN + 10,
      y: vY,
      size: 8,
      font: helvetica,
      color: BLACK,
    })
    
    // Yes/No checkboxes (empty for provider)
    currentPage.drawText("Yes:", { x: MARGIN + 380, y: vY, size: 8, font: helvetica, color: BLACK })
    drawCheckbox(currentPage, MARGIN + 400, vY + 8, false, helvetica, 8)
    currentPage.drawText("No:", { x: MARGIN + 420, y: vY, size: 8, font: helvetica, color: BLACK })
    drawCheckbox(currentPage, MARGIN + 435, vY + 8, false, helvetica, 8)
    
    vY -= 14
  }

  yPosition -= 140

  // Signature line
  currentPage.drawText("Signature: _________________ Name: _________________ Organisation: _________________ Date: _______", {
    x: MARGIN + 10,
    y: yPosition,
    size: 8,
    font: helvetica,
    color: BLACK,
  })
  yPosition -= 40

  // ===== SKILLS SCAN SECTIONS =====
  
  for (const section of skillsScanSections) {
    ensureSpace(80)

    // Section header
    currentPage.drawRectangle({
      x: MARGIN,
      y: yPosition - 20,
      width: CONTENT_WIDTH,
      height: 25,
      color: PURPLE,
    })

    currentPage.drawText(section.title, {
      x: MARGIN + 10,
      y: yPosition - 14,
      size: 12,
      font: helveticaBold,
      color: WHITE,
    })
    yPosition -= 35

    // Column headers
    const colHeaders = ["", "KNOWLEDGE", "", "", "", "EXPERIENCE", "", "", ""]
    const subHeaders = ["Skill/Task", "L", "A", "E", "U", "L", "A", "E", "U"]
    
    // Draw header row background
    currentPage.drawRectangle({
      x: MARGIN,
      y: yPosition - 30,
      width: CONTENT_WIDTH,
      height: 30,
      color: LIGHT_GRAY,
    })

    // Draw sub-headers
    const colWidths = [200, 30, 30, 30, 30, 30, 30, 30, 30]
    let xPos = MARGIN

    // Main headers
    currentPage.drawText("KNOWLEDGE", {
      x: MARGIN + 215,
      y: yPosition - 12,
      size: 8,
      font: helveticaBold,
      color: BLACK,
    })
    currentPage.drawText("EXPERIENCE", {
      x: MARGIN + 335,
      y: yPosition - 12,
      size: 8,
      font: helveticaBold,
      color: BLACK,
    })

    // Sub-headers (L, A, E, U)
    xPos = MARGIN + 205
    for (let i = 0; i < 4; i++) {
      currentPage.drawText(["L", "A", "E", "U"][i], {
        x: xPos,
        y: yPosition - 25,
        size: 8,
        font: helveticaBold,
        color: BLACK,
      })
      xPos += 30
    }
    xPos = MARGIN + 325
    for (let i = 0; i < 4; i++) {
      currentPage.drawText(["L", "A", "E", "U"][i], {
        x: xPos,
        y: yPosition - 25,
        size: 8,
        font: helveticaBold,
        color: BLACK,
      })
      xPos += 30
    }

    yPosition -= 35

    // Draw skill rows
    for (const item of section.items) {
      ensureSpace(25)

      const skillRating = formData.skills[section.id]?.[item.id] || { knowledge: "", experience: "" }
      
      // Wrap skill text
      const wrappedText = wrapText(item.text, helvetica, 9, 190)
      const rowHeight = Math.max(20, wrappedText.length * 12)

      // Draw alternating row background
      currentPage.drawRectangle({
        x: MARGIN,
        y: yPosition - rowHeight + 5,
        width: CONTENT_WIDTH,
        height: rowHeight,
        borderColor: LIGHT_GRAY,
        borderWidth: 0.5,
      })

      // Draw skill text
      let textY = yPosition
      for (const line of wrappedText) {
        currentPage.drawText(line, {
          x: MARGIN + 5,
          y: textY - 10,
          size: 9,
          font: helvetica,
          color: BLACK,
        })
        textY -= 12
      }

      // Draw knowledge checkboxes
      const kVal = skillRating.knowledge.toLowerCase()
      xPos = MARGIN + 205
      drawCheckbox(currentPage, xPos, yPosition, kVal === "limited", helvetica, 10)
      xPos += 30
      drawCheckbox(currentPage, xPos, yPosition, kVal === "adequate", helvetica, 10)
      xPos += 30
      drawCheckbox(currentPage, xPos, yPosition, kVal === "extensive", helvetica, 10)
      xPos += 30
      drawCheckbox(currentPage, xPos, yPosition, kVal === "unsure", helvetica, 10)

      // Draw experience checkboxes
      const eVal = skillRating.experience.toLowerCase()
      xPos = MARGIN + 325
      drawCheckbox(currentPage, xPos, yPosition, eVal === "limited", helvetica, 10)
      xPos += 30
      drawCheckbox(currentPage, xPos, yPosition, eVal === "adequate", helvetica, 10)
      xPos += 30
      drawCheckbox(currentPage, xPos, yPosition, eVal === "extensive", helvetica, 10)
      xPos += 30
      drawCheckbox(currentPage, xPos, yPosition, eVal === "unsure", helvetica, 10)

      yPosition -= rowHeight
    }

    yPosition -= 15
  }

  // ===== FURTHER REQUIREMENTS SECTION =====
  ensureSpace(150)

  currentPage.drawRectangle({
    x: MARGIN,
    y: yPosition - 20,
    width: CONTENT_WIDTH,
    height: 25,
    color: PURPLE,
  })

  currentPage.drawText("Identifying any further knowledge or experience required", {
    x: MARGIN + 10,
    y: yPosition - 14,
    size: 12,
    font: helveticaBold,
    color: WHITE,
  })
  yPosition -= 40

  // Knowledge section
  currentPage.drawText("Knowledge:", {
    x: MARGIN,
    y: yPosition,
    size: 10,
    font: helveticaBold,
    color: BLACK,
  })
  yPosition -= 15

  const knowledgeText = formData.furtherKnowledgeRequired || "None identified"
  const knowledgeLines = wrapText(knowledgeText, helvetica, 9, CONTENT_WIDTH - 10)
  for (const line of knowledgeLines) {
    currentPage.drawText(line, {
      x: MARGIN + 5,
      y: yPosition,
      size: 9,
      font: helvetica,
      color: BLACK,
    })
    yPosition -= 12
  }
  yPosition -= 15

  // Experience section
  currentPage.drawText("Experience:", {
    x: MARGIN,
    y: yPosition,
    size: 10,
    font: helveticaBold,
    color: BLACK,
  })
  yPosition -= 15

  const experienceText = formData.furtherExperienceRequired || "None identified"
  const experienceLines = wrapText(experienceText, helvetica, 9, CONTENT_WIDTH - 10)
  for (const line of experienceLines) {
    currentPage.drawText(line, {
      x: MARGIN + 5,
      y: yPosition,
      size: 9,
      font: helvetica,
      color: BLACK,
    })
    yPosition -= 12
  }
  yPosition -= 20

  // ===== PRELIMINARY SUITABILITY INDICATION =====
  if (formData.suitabilityResult) {
    ensureSpace(120)

    const result = formData.suitabilityResult
    let bgColor = rgb(0.9, 0.95, 0.9) // Light green
    let borderColor = rgb(0.2, 0.6, 0.2)
    
    if (result.result === "may-need-development") {
      bgColor = rgb(1, 0.95, 0.85) // Light amber
      borderColor = rgb(0.8, 0.6, 0.2)
    } else if (result.result === "likely-not-suitable") {
      bgColor = rgb(1, 0.9, 0.9) // Light red
      borderColor = rgb(0.8, 0.2, 0.2)
    }

    currentPage.drawRectangle({
      x: MARGIN,
      y: yPosition - 100,
      width: CONTENT_WIDTH,
      height: 100,
      color: bgColor,
      borderColor: borderColor,
      borderWidth: 1,
    })

    currentPage.drawText("Preliminary Suitability Indication", {
      x: MARGIN + 10,
      y: yPosition - 15,
      size: 11,
      font: helveticaBold,
      color: BLACK,
    })

    currentPage.drawText(`Result: ${result.title}`, {
      x: MARGIN + 10,
      y: yPosition - 32,
      size: 10,
      font: helveticaBold,
      color: BLACK,
    })

    currentPage.drawText(`Knowledge Score: ${result.knowledgeScore}%  |  Experience Score: ${result.experienceScore}%`, {
      x: MARGIN + 10,
      y: yPosition - 47,
      size: 9,
      font: helvetica,
      color: GRAY,
    })

    const summaryLines = wrapText(result.summary, helvetica, 9, CONTENT_WIDTH - 30)
    let summaryY = yPosition - 62
    for (const line of summaryLines.slice(0, 3)) {
      currentPage.drawText(line, {
        x: MARGIN + 10,
        y: summaryY,
        size: 9,
        font: helvetica,
        color: BLACK,
      })
      summaryY -= 12
    }

    yPosition -= 115

    // Disclaimer
    ensureSpace(50)
    const disclaimer = "Important: This is a preliminary indication based on your self-assessment responses only and remains subject to training provider review and verification. The final decision on your suitability for the IE/ME EWA will be made by your chosen training provider."
    const disclaimerLines = wrapText(disclaimer, helvetica, 8, CONTENT_WIDTH - 10)
    
    currentPage.drawRectangle({
      x: MARGIN,
      y: yPosition - (disclaimerLines.length * 10 + 10),
      width: CONTENT_WIDTH,
      height: disclaimerLines.length * 10 + 10,
      color: rgb(0.95, 0.95, 0.95),
      borderColor: GRAY,
      borderWidth: 0.5,
    })

    let disclaimerY = yPosition - 10
    for (const line of disclaimerLines) {
      currentPage.drawText(line, {
        x: MARGIN + 5,
        y: disclaimerY,
        size: 8,
        font: helvetica,
        color: GRAY,
      })
      disclaimerY -= 10
    }
  }

  // Footer with date
  const pages = pdfDoc.getPages()
  for (let i = 0; i < pages.length; i++) {
    const page = pages[i]
    page.drawText(`Page ${i + 1} of ${pages.length}`, {
      x: PAGE_WIDTH / 2 - 30,
      y: 30,
      size: 8,
      font: helvetica,
      color: GRAY,
    })
    page.drawText(`Generated: ${new Date().toLocaleDateString("en-GB")}`, {
      x: PAGE_WIDTH - MARGIN - 80,
      y: 30,
      size: 8,
      font: helvetica,
      color: GRAY,
    })
    page.drawText("Installation & Maintenance Electrician EWA: Skills Scan", {
      x: MARGIN,
      y: 30,
      size: 8,
      font: helvetica,
      color: GRAY,
    })
  }

  return pdfDoc.save()
}
