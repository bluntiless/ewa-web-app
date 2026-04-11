import { PDFDocument, rgb, StandardFonts } from "pdf-lib"
import { skillsScanSections } from "./skills-scan-data"

// TESP PDF page structure and checkbox positions
// These coordinates are based on the official TESP PDF layout
// Page numbers are 0-indexed

interface SkillPosition {
  sectionId: string
  skillId: string
  page: number
  // Y position from bottom of page
  y: number
  // X positions for each checkbox column
  knowledgeLimited: number
  knowledgeAdequate: number
  knowledgeExtensive: number
  knowledgeUnsure: number
  experienceLimited: number
  experienceAdequate: number
  experienceExtensive: number
  experienceUnsure: number
}

// Define checkbox positions for the TESP PDF
// These are approximate positions that need to be calibrated to the actual PDF
// The TESP PDF uses A4 size (595.28 x 841.89 points)

const PAGE_WIDTH = 595.28
const PAGE_HEIGHT = 841.89

// Checkbox column X positions (approximate, based on PDF structure)
const CHECKBOX_COLS = {
  knowledgeLimited: 340,
  knowledgeAdequate: 375,
  knowledgeExtensive: 410,
  knowledgeUnsure: 445,
  experienceLimited: 480,
  experienceAdequate: 515,
  experienceExtensive: 550,
  experienceUnsure: 585,
}

// Skill positions mapped to PDF pages
// Page 5 (index 5): Safe Isolation and Risk Assessment + Installation start
// Page 6 (index 6): Installation continued
// Page 7 (index 7): Installation continued
// Page 8 (index 8): Inspection and Testing
// Page 9 (index 9): Fault Diagnosis and Rectification + Assessment of Applied Knowledge

const SKILL_POSITIONS: SkillPosition[] = [
  // Safe Isolation and Risk Assessment - Page 5
  { sectionId: "safe-isolation", skillId: "risk-assessment", page: 5, y: 575, ...CHECKBOX_COLS },
  { sectionId: "safe-isolation", skillId: "single-phase-isolation", page: 5, y: 545, ...CHECKBOX_COLS },
  { sectionId: "safe-isolation", skillId: "three-phase-circuit-isolation", page: 5, y: 515, ...CHECKBOX_COLS },
  { sectionId: "safe-isolation", skillId: "three-phase-installation-isolation", page: 5, y: 475, ...CHECKBOX_COLS },
  
  // Installation - Page 5 (lower portion)
  { sectionId: "installation", skillId: "specifications-interpretation", page: 5, y: 340, ...CHECKBOX_COLS },
  { sectionId: "installation", skillId: "protective-devices-selection", page: 5, y: 310, ...CHECKBOX_COLS },
  { sectionId: "installation", skillId: "equipotential-bonding", page: 5, y: 280, ...CHECKBOX_COLS },
  { sectionId: "installation", skillId: "pvc-singles-cable", page: 5, y: 250, ...CHECKBOX_COLS },
  { sectionId: "installation", skillId: "pvc-multicore-cable", page: 5, y: 220, ...CHECKBOX_COLS },
  { sectionId: "installation", skillId: "sy-multi-flex-cable", page: 5, y: 190, ...CHECKBOX_COLS },
  { sectionId: "installation", skillId: "heat-resistant-flex", page: 5, y: 160, ...CHECKBOX_COLS },
  { sectionId: "installation", skillId: "xlpe-swa", page: 5, y: 130, ...CHECKBOX_COLS },
  { sectionId: "installation", skillId: "data-cable", page: 5, y: 100, ...CHECKBOX_COLS },
  
  // Installation continued - Page 6
  { sectionId: "installation", skillId: "fp200-cable", page: 6, y: 720, ...CHECKBOX_COLS },
  { sectionId: "installation", skillId: "metal-conduit", page: 6, y: 690, ...CHECKBOX_COLS },
  { sectionId: "installation", skillId: "pvc-conduit", page: 6, y: 660, ...CHECKBOX_COLS },
  { sectionId: "installation", skillId: "other-wiring-systems", page: 6, y: 615, ...CHECKBOX_COLS },
  { sectionId: "installation", skillId: "tpn-distribution-board", page: 6, y: 575, ...CHECKBOX_COLS },
  { sectionId: "installation", skillId: "two-way-intermediate-lighting", page: 6, y: 535, ...CHECKBOX_COLS },
  { sectionId: "installation", skillId: "ring-circuit", page: 6, y: 495, ...CHECKBOX_COLS },
  { sectionId: "installation", skillId: "carbon-monoxide-detector", page: 6, y: 455, ...CHECKBOX_COLS },
  { sectionId: "installation", skillId: "data-outlets", page: 6, y: 415, ...CHECKBOX_COLS },
  { sectionId: "installation", skillId: "bs-en-60309-socket", page: 6, y: 375, ...CHECKBOX_COLS },
  { sectionId: "installation", skillId: "gas-water-bonding", page: 6, y: 335, ...CHECKBOX_COLS },
  { sectionId: "installation", skillId: "three-phase-motor", page: 6, y: 295, ...CHECKBOX_COLS },
  { sectionId: "installation", skillId: "s-plan-central-heating", page: 6, y: 230, ...CHECKBOX_COLS },
  
  // Inspection and Testing - Page 7
  { sectionId: "inspection-testing", skillId: "risk-assessment-health-safety", page: 7, y: 645, ...CHECKBOX_COLS },
  { sectionId: "inspection-testing", skillId: "correct-isolation", page: 7, y: 600, ...CHECKBOX_COLS },
  { sectionId: "inspection-testing", skillId: "visual-inspection", page: 7, y: 555, ...CHECKBOX_COLS },
  { sectionId: "inspection-testing", skillId: "tests-intro", page: 7, y: 510, ...CHECKBOX_COLS },
  { sectionId: "inspection-testing", skillId: "continuity-protective", page: 7, y: 480, ...CHECKBOX_COLS },
  { sectionId: "inspection-testing", skillId: "continuity-ring", page: 7, y: 450, ...CHECKBOX_COLS },
  { sectionId: "inspection-testing", skillId: "insulation-resistance", page: 7, y: 420, ...CHECKBOX_COLS },
  { sectionId: "inspection-testing", skillId: "polarity", page: 7, y: 390, ...CHECKBOX_COLS },
  { sectionId: "inspection-testing", skillId: "earth-fault-loop", page: 7, y: 360, ...CHECKBOX_COLS },
  { sectionId: "inspection-testing", skillId: "prospective-fault-current", page: 7, y: 330, ...CHECKBOX_COLS },
  { sectionId: "inspection-testing", skillId: "phase-sequence", page: 7, y: 300, ...CHECKBOX_COLS },
  { sectionId: "inspection-testing", skillId: "functional-testing", page: 7, y: 270, ...CHECKBOX_COLS },
  { sectionId: "inspection-testing", skillId: "verify-test-results", page: 7, y: 225, ...CHECKBOX_COLS },
  { sectionId: "inspection-testing", skillId: "electrical-installation-cert", page: 7, y: 165, ...CHECKBOX_COLS },
  
  // Fault Diagnosis and Rectification - Page 8
  { sectionId: "fault-diagnosis", skillId: "risk-assessment-fd", page: 8, y: 645, ...CHECKBOX_COLS },
  { sectionId: "fault-diagnosis", skillId: "tools-equipment", page: 8, y: 600, ...CHECKBOX_COLS },
  { sectionId: "fault-diagnosis", skillId: "checks-preparations", page: 8, y: 555, ...CHECKBOX_COLS },
  { sectionId: "fault-diagnosis", skillId: "identify-faults", page: 8, y: 510, ...CHECKBOX_COLS },
  { sectionId: "fault-diagnosis", skillId: "state-record-faults", page: 8, y: 465, ...CHECKBOX_COLS },
  
  // Assessment of Applied Knowledge - Page 8 (lower portion)
  { sectionId: "applied-knowledge", skillId: "health-safety", page: 8, y: 330, ...CHECKBOX_COLS },
  { sectionId: "applied-knowledge", skillId: "bs7671", page: 8, y: 295, ...CHECKBOX_COLS },
  { sectionId: "applied-knowledge", skillId: "building-regulations", page: 8, y: 260, ...CHECKBOX_COLS },
  { sectionId: "applied-knowledge", skillId: "inspection-testing-fault", page: 8, y: 225, ...CHECKBOX_COLS },
]

// Qualification checkbox positions
interface QualificationPosition {
  tableId: "tableA" | "tableB" | "tableC"
  qualId: string
  page: number
  y: number
  x: number
}

// These would need to be mapped to the actual TESP PDF qualification checkbox positions
// Pages 2-4 contain the qualification tables

export interface TespPdfFormData {
  candidateName: string
  skills: {
    [sectionId: string]: {
      [skillId: string]: {
        knowledge: "limited" | "adequate" | "extensive" | "unsure" | ""
        experience: "limited" | "adequate" | "extensive" | "unsure" | ""
      }
    }
  }
  selectedQualifications: {
    tableA: { [key: string]: boolean }
    tableB: { [key: string]: boolean }
    tableC: { [key: string]: boolean }
  }
  furtherKnowledgeRequired?: string
  furtherExperienceRequired?: string
}

export async function fillTespPdf(
  templatePdfBytes: ArrayBuffer,
  formData: TespPdfFormData
): Promise<Uint8Array> {
  // Load the template PDF
  const pdfDoc = await PDFDocument.load(templatePdfBytes)
  const pages = pdfDoc.getPages()
  
  // Embed fonts
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  
  // Fill in candidate name on page 0
  if (pages.length > 0) {
    const firstPage = pages[0]
    // The candidate name field is near the top of page 1
    // Position needs calibration to actual PDF
    firstPage.drawText(formData.candidateName || "", {
      x: 120,
      y: PAGE_HEIGHT - 80,
      size: 11,
      font: helvetica,
      color: rgb(0, 0, 0),
    })
  }
  
  // Draw checkmarks for skill ratings
  for (const skillPos of SKILL_POSITIONS) {
    if (skillPos.page >= pages.length) continue
    
    const page = pages[skillPos.page]
    const skillData = formData.skills[skillPos.sectionId]?.[skillPos.skillId]
    
    if (!skillData) continue
    
    // Draw knowledge checkmark
    if (skillData.knowledge) {
      const xPos = getCheckboxX(skillPos, "knowledge", skillData.knowledge)
      if (xPos) {
        drawCheckmark(page, xPos, skillPos.y, helveticaBold)
      }
    }
    
    // Draw experience checkmark
    if (skillData.experience) {
      const xPos = getCheckboxX(skillPos, "experience", skillData.experience)
      if (xPos) {
        drawCheckmark(page, xPos, skillPos.y, helveticaBold)
      }
    }
  }
  
  // Fill in further knowledge/experience required on page 9 (index 9)
  if (pages.length > 9) {
    const notesPage = pages[9]
    
    if (formData.furtherKnowledgeRequired) {
      // Knowledge notes section
      const knowledgeLines = wrapText(formData.furtherKnowledgeRequired, 350, helvetica, 9)
      let yPos = 560 // Approximate position for knowledge notes
      for (const line of knowledgeLines.slice(0, 6)) { // Max 6 lines
        notesPage.drawText(line, {
          x: 60,
          y: yPos,
          size: 9,
          font: helvetica,
          color: rgb(0, 0, 0),
        })
        yPos -= 14
      }
    }
    
    if (formData.furtherExperienceRequired) {
      // Experience notes section
      const experienceLines = wrapText(formData.furtherExperienceRequired, 350, helvetica, 9)
      let yPos = 360 // Approximate position for experience notes
      for (const line of experienceLines.slice(0, 6)) { // Max 6 lines
        notesPage.drawText(line, {
          x: 60,
          y: yPos,
          size: 9,
          font: helvetica,
          color: rgb(0, 0, 0),
        })
        yPos -= 14
      }
    }
  }
  
  // Save and return the filled PDF
  const pdfBytes = await pdfDoc.save()
  return pdfBytes
}

function getCheckboxX(
  skillPos: SkillPosition,
  type: "knowledge" | "experience",
  rating: string
): number | null {
  const key = `${type}${rating.charAt(0).toUpperCase() + rating.slice(1)}` as keyof SkillPosition
  const value = skillPos[key]
  return typeof value === "number" ? value : null
}

function drawCheckmark(
  page: ReturnType<typeof PDFDocument.prototype.getPages>[0],
  x: number,
  y: number,
  font: Awaited<ReturnType<typeof PDFDocument.prototype.embedFont>>
) {
  // Draw an X or checkmark in the checkbox
  page.drawText("✓", {
    x: x + 2,
    y: y - 3,
    size: 12,
    font,
    color: rgb(0, 0, 0),
  })
}

function wrapText(
  text: string,
  maxWidth: number,
  font: Awaited<ReturnType<typeof PDFDocument.prototype.embedFont>>,
  fontSize: number
): string[] {
  const words = text.split(" ")
  const lines: string[] = []
  let currentLine = ""
  
  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word
    const width = font.widthOfTextAtSize(testLine, fontSize)
    
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

// Alternative approach: Create a filled PDF that mimics the TESP format exactly
// This is used when the template PDF cannot be reliably filled
export async function createTespStylePdf(
  formData: TespPdfFormData,
  suitabilityResult?: {
    result: string
    title: string
    summary: string
    knowledgeScore: number
    experienceScore: number
    guidance: string[]
  }
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create()
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  
  const margin = 50
  const lineHeight = 14
  
  // Helper functions
  const addPage = () => {
    const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT])
    return { page, y: PAGE_HEIGHT - margin }
  }
  
  const drawText = (
    page: ReturnType<typeof pdfDoc.addPage>,
    text: string,
    x: number,
    y: number,
    options: { font?: typeof helvetica; size?: number; color?: ReturnType<typeof rgb> } = {}
  ) => {
    const { font = helvetica, size = 10, color = rgb(0, 0, 0) } = options
    page.drawText(text, { x, y, font, size, color })
  }
  
  // Cover Page
  let { page, y } = addPage()
  
  // Header
  drawText(page, "EWA Skills Scan", margin, y, { font: helveticaBold, size: 20 })
  y -= 30
  drawText(page, "Installation & Maintenance Electrician", margin, y, { size: 14 })
  y -= 18
  drawText(page, "Experienced Worker Assessment", margin, y, { size: 14 })
  y -= 40
  
  // Candidate Name
  drawText(page, "Candidate Name:", margin, y, { font: helveticaBold, size: 12 })
  y -= 18
  drawText(page, formData.candidateName || "Not provided", margin + 10, y, { size: 12 })
  y -= 40
  
  // Training Provider Verification Section (blank for provider)
  drawText(page, "TRAINING PROVIDER VERIFICATION", margin, y, { font: helveticaBold, size: 12 })
  y -= 5
  page.drawLine({
    start: { x: margin, y },
    end: { x: PAGE_WIDTH - margin, y },
    thickness: 1,
    color: rgb(0, 0, 0),
  })
  y -= 20
  
  drawText(page, "(To be completed by Training Provider only)", margin, y, { size: 9, color: rgb(0.4, 0.4, 0.4) })
  y -= 25
  
  const verificationItems = [
    "Does the candidate hold relevant L2 qualifications that have been verified?  Yes: [ ]  No: [ ]",
    "Does the candidate hold relevant L3 qualifications that have been verified?  Yes: [ ]  No: [ ]",
    "Approval obtained from TESP if qualification not listed in Tables A, B or C:  Yes: [ ]  No: [ ]",
    "A technical discussion has been carried out and documented for EQA purposes?  Yes: [ ]  No: [ ]",
    "Approval obtained from TESP if candidate is not a full time practising electrician:  Yes: [ ]  No: [ ]",
  ]
  
  for (const item of verificationItems) {
    drawText(page, item, margin, y, { size: 9 })
    y -= 18
  }
  
  y -= 10
  drawText(page, "I confirm I have authenticated the applicant's knowledge and experience.", margin, y, { size: 9 })
  y -= 25
  
  drawText(page, "Signature: ________________________", margin, y, { size: 10 })
  drawText(page, "Name: ________________________", margin + 250, y, { size: 10 })
  y -= 20
  drawText(page, "Organisation: ________________________", margin, y, { size: 10 })
  drawText(page, "Date: ____________", margin + 250, y, { size: 10 })
  
  // Skills Scan Pages
  for (const section of skillsScanSections) {
    const result = addPage()
    page = result.page
    y = result.y
    
    // Section Header
    drawText(page, section.title, margin, y, { font: helveticaBold, size: 14 })
    y -= 5
    page.drawLine({
      start: { x: margin, y },
      end: { x: PAGE_WIDTH - margin, y },
      thickness: 1,
      color: rgb(0, 0, 0),
    })
    y -= 20
    
    if (section.description) {
      const descLines = wrapText(section.description, PAGE_WIDTH - margin * 2, helvetica, 9)
      for (const line of descLines) {
        drawText(page, line, margin, y, { size: 9, color: rgb(0.3, 0.3, 0.3) })
        y -= 12
      }
      y -= 10
    }
    
    // Column headers
    const colSkill = margin
    const colKL = 295
    const colKA = 330
    const colKE = 365
    const colKU = 400
    const colEL = 435
    const colEA = 470
    const colEE = 505
    const colEU = 540
    
    drawText(page, "KNOWLEDGE", colKL, y, { font: helveticaBold, size: 7 })
    drawText(page, "EXPERIENCE", colEL, y, { font: helveticaBold, size: 7 })
    y -= 12
    
    drawText(page, "L", colKL + 5, y, { font: helveticaBold, size: 7 })
    drawText(page, "A", colKA + 5, y, { font: helveticaBold, size: 7 })
    drawText(page, "E", colKE + 5, y, { font: helveticaBold, size: 7 })
    drawText(page, "U", colKU + 5, y, { font: helveticaBold, size: 7 })
    drawText(page, "L", colEL + 5, y, { font: helveticaBold, size: 7 })
    drawText(page, "A", colEA + 5, y, { font: helveticaBold, size: 7 })
    drawText(page, "E", colEE + 5, y, { font: helveticaBold, size: 7 })
    drawText(page, "U", colEU + 5, y, { font: helveticaBold, size: 7 })
    y -= 15
    
    // Items
    for (const item of section.items) {
      // Check if we need a new page
      if (y < margin + 50) {
        const newResult = addPage()
        page = newResult.page
        y = newResult.y
        
        drawText(page, `${section.title} (continued)`, margin, y, { font: helveticaBold, size: 12 })
        y -= 25
        
        // Redraw column headers
        drawText(page, "L", colKL + 5, y, { font: helveticaBold, size: 7 })
        drawText(page, "A", colKA + 5, y, { font: helveticaBold, size: 7 })
        drawText(page, "E", colKE + 5, y, { font: helveticaBold, size: 7 })
        drawText(page, "U", colKU + 5, y, { font: helveticaBold, size: 7 })
        drawText(page, "L", colEL + 5, y, { font: helveticaBold, size: 7 })
        drawText(page, "A", colEA + 5, y, { font: helveticaBold, size: 7 })
        drawText(page, "E", colEE + 5, y, { font: helveticaBold, size: 7 })
        drawText(page, "U", colEU + 5, y, { font: helveticaBold, size: 7 })
        y -= 15
      }
      
      const skill = formData.skills[section.id]?.[item.id]
      
      // Wrap skill text
      const skillLines = wrapText(item.text, 240, helvetica, 9)
      
      // Draw first line with checkboxes
      drawText(page, skillLines[0], colSkill, y, { size: 9 })
      
      // Draw checkbox squares and marks
      const drawCheckbox = (x: number, checked: boolean) => {
        page.drawRectangle({
          x,
          y: y - 3,
          width: 12,
          height: 12,
          borderColor: rgb(0, 0, 0),
          borderWidth: 0.5,
        })
        if (checked) {
          drawText(page, "✓", x + 2, y - 1, { size: 10 })
        }
      }
      
      drawCheckbox(colKL, skill?.knowledge === "limited")
      drawCheckbox(colKA, skill?.knowledge === "adequate")
      drawCheckbox(colKE, skill?.knowledge === "extensive")
      drawCheckbox(colKU, skill?.knowledge === "unsure")
      drawCheckbox(colEL, skill?.experience === "limited")
      drawCheckbox(colEA, skill?.experience === "adequate")
      drawCheckbox(colEE, skill?.experience === "extensive")
      drawCheckbox(colEU, skill?.experience === "unsure")
      
      y -= 15
      
      // Draw remaining skill text lines
      for (let i = 1; i < skillLines.length; i++) {
        drawText(page, skillLines[i], colSkill, y, { size: 9 })
        y -= 12
      }
      
      y -= 5
    }
  }
  
  // Further Requirements Page
  const reqResult = addPage()
  page = reqResult.page
  y = reqResult.y
  
  drawText(page, "Identifying any further knowledge or experience required", margin, y, { font: helveticaBold, size: 14 })
  y -= 5
  page.drawLine({
    start: { x: margin, y },
    end: { x: PAGE_WIDTH - margin, y },
    thickness: 1,
    color: rgb(0, 0, 0),
  })
  y -= 20
  
  drawText(page, "Knowledge", margin, y, { font: helveticaBold, size: 11 })
  y -= 18
  
  if (formData.furtherKnowledgeRequired) {
    const knowledgeLines = wrapText(formData.furtherKnowledgeRequired, PAGE_WIDTH - margin * 2, helvetica, 10)
    for (const line of knowledgeLines) {
      drawText(page, line, margin, y, { size: 10 })
      y -= 14
    }
  } else {
    drawText(page, "(None specified)", margin, y, { size: 10, color: rgb(0.5, 0.5, 0.5) })
    y -= 14
  }
  
  y -= 30
  drawText(page, "Experience", margin, y, { font: helveticaBold, size: 11 })
  y -= 18
  
  if (formData.furtherExperienceRequired) {
    const experienceLines = wrapText(formData.furtherExperienceRequired, PAGE_WIDTH - margin * 2, helvetica, 10)
    for (const line of experienceLines) {
      drawText(page, line, margin, y, { size: 10 })
      y -= 14
    }
  } else {
    drawText(page, "(None specified)", margin, y, { size: 10, color: rgb(0.5, 0.5, 0.5) })
    y -= 14
  }
  
  // Preliminary Suitability Result (if provided)
  if (suitabilityResult) {
    y -= 40
    drawText(page, "Preliminary Suitability Indication", margin, y, { font: helveticaBold, size: 12 })
    y -= 5
    page.drawLine({
      start: { x: margin, y },
      end: { x: PAGE_WIDTH - margin, y },
      thickness: 0.5,
      color: rgb(0.7, 0.7, 0.7),
    })
    y -= 20
    
    drawText(page, `Result: ${suitabilityResult.title}`, margin, y, { font: helveticaBold, size: 11 })
    y -= 18
    drawText(page, `Knowledge Score: ${suitabilityResult.knowledgeScore}%   Experience Score: ${suitabilityResult.experienceScore}%`, margin, y, { size: 10 })
    y -= 20
    
    const summaryLines = wrapText(suitabilityResult.summary, PAGE_WIDTH - margin * 2, helvetica, 10)
    for (const line of summaryLines) {
      drawText(page, line, margin, y, { size: 10 })
      y -= 14
    }
    
    y -= 15
    const disclaimer = "Important: This is a preliminary indication based on self-assessment responses only and remains subject to training provider review and verification."
    const disclaimerLines = wrapText(disclaimer, PAGE_WIDTH - margin * 2, helvetica, 8)
    for (const line of disclaimerLines) {
      drawText(page, line, margin, y, { size: 8, color: rgb(0.4, 0.4, 0.4) })
      y -= 11
    }
  }
  
  // Footer
  y = margin + 30
  drawText(page, "Generated by EWA Tracker - Skills Scan Submission", margin, y, { size: 8, color: rgb(0.5, 0.5, 0.5) })
  y -= 12
  drawText(page, `Date: ${new Date().toLocaleDateString("en-GB")}`, margin, y, { size: 8, color: rgb(0.5, 0.5, 0.5) })
  
  const pdfBytes = await pdfDoc.save()
  return pdfBytes
}
