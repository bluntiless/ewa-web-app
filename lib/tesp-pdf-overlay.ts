import { PDFDocument, rgb, StandardFonts } from "pdf-lib"
import fs from "fs"
import path from "path"

// Skill rating type
type Rating = "Limited" | "Adequate" | "Extensive" | "Unsure" | ""

export interface TespOverlayData {
  candidateName: string
  skills: {
    [sectionId: string]: {
      [skillId: string]: {
        knowledge: string
        experience: string
      }
    }
  }
  furtherKnowledgeRequired?: string
  furtherExperienceRequired?: string
}

// Checkbox column X positions (in points from left edge of page)
// A4 page is 595 x 842 points
// The TESP PDF has 8 checkbox columns across the skills table
// Layout: Skill text | L | A | E | U (Knowledge) | L | A | E | U (Experience)
const CHECKBOX_COLUMNS = {
  knowledge: {
    Limited: 295,
    Adequate: 330,
    Extensive: 365,
    Unsure: 400,
  },
  experience: {
    Limited: 450,
    Adequate: 485,
    Extensive: 520,
    Unsure: 555,
  },
}

// Candidate name field position (Page 1, index 0)
// "Candidate Name:" text is at the very top of page 1
// Y=760 is near the top of the page (A4 height is 842)
const CANDIDATE_NAME_POSITION = { x: 115, y: 760 }

// PDF STRUCTURE (from text extraction):
// Page 1 (index 0): Cover page with "Candidate Name:" field
// Pages 2-5 (indices 1-4): Qualification tables (Tables A, B, C) - NO SKILLS
// Page 6 (index 5): Safe Isolation + Installation start
// Page 7 (index 6): Installation continued
// Page 8 (index 7): Inspection and Testing
// Page 9 (index 8): Fault Diagnosis + Assessment of Applied Knowledge
// Page 10 (index 9): Further requirements
// Page 11 (index 10): Understanding Results

// Mapping from website section/skill IDs to page index and Y position
// Y positions are from BOTTOM of page (PDF coordinate system)
// A4 page height is 842 points
const SKILL_COORDINATE_MAP: {
  [sectionId: string]: {
    [skillId: string]: { pageIndex: number; y: number }
  }
} = {
  // Safe Isolation and Risk Assessment (Page 6, index 5)
  // Looking at PDF: this section starts partway down page 6
  // Skills table rows are approximately 28-32 points apart
  safeIsolation: {
    carryOutRiskAssessment: { pageIndex: 5, y: 545 },
    safeIsolationSinglePhase: { pageIndex: 5, y: 510 },
    safeIsolationThreePhaseCircuit: { pageIndex: 5, y: 475 },
    safeIsolationThreePhaseInstallation: { pageIndex: 5, y: 435 },
  },
  // Installation (Pages 6-7, indices 5-6)
  // Installation section starts after Safe Isolation on page 6
  installation: {
    interpretationOfSpecs: { pageIndex: 5, y: 295 },
    selectionOfProtectiveDevices: { pageIndex: 5, y: 265 },
    installProtectiveEquipotentialBonding: { pageIndex: 5, y: 235 },
    installTerminatePVCSingles: { pageIndex: 5, y: 205 },
    installTerminatePVCMultiCore: { pageIndex: 5, y: 175 },
    installTerminateSYMultiFlex: { pageIndex: 5, y: 145 },
    installTerminateHeatResistantFlex: { pageIndex: 5, y: 115 },
    installTerminateXLPE_SWA: { pageIndex: 5, y: 85 },
    // Page 7 (index 6) - Installation continued
    installTerminateDataCable: { pageIndex: 6, y: 720 },
    installTerminateFP200: { pageIndex: 6, y: 690 },
    formInstall20mmMetalConduit: { pageIndex: 6, y: 660 },
    formInstall20mmPVCConduit: { pageIndex: 6, y: 630 },
    installThreeOtherWiringSystems: { pageIndex: 6, y: 590 },
    installProtectiveDevicesTPN: { pageIndex: 6, y: 555 },
    installTwoWayIntermediateLighting: { pageIndex: 6, y: 520 },
    installBS1363SocketRing: { pageIndex: 6, y: 485 },
    installCarbonMonoxideDetector: { pageIndex: 6, y: 445 },
    installDataOutletsCat5: { pageIndex: 6, y: 415 },
    installBSEN60309Socket: { pageIndex: 6, y: 385 },
    installProtectiveEquipotentialBondingGasWater: { pageIndex: 6, y: 355 },
    connectThreePhaseDirectMotor: { pageIndex: 6, y: 325 },
    installSPlanCentralHeating: { pageIndex: 6, y: 275 },
  },
  // Inspection and Testing (Page 8, index 7)
  inspectionTesting: {
    riskAssessmentHealthSafety: { pageIndex: 7, y: 660 },
    installationIsolated: { pageIndex: 7, y: 620 },
    visualInspectionBS7671: { pageIndex: 7, y: 580 },
    continuityProtectiveConductors: { pageIndex: 7, y: 505 },
    continuityRingFinalCircuit: { pageIndex: 7, y: 475 },
    insulationResistance: { pageIndex: 7, y: 450 },
    polarity: { pageIndex: 7, y: 425 },
    earthFaultLoopImpedance: { pageIndex: 7, y: 400 },
    prospectiveFaultCurrent: { pageIndex: 7, y: 375 },
    phaseSequenceRotation: { pageIndex: 7, y: 350 },
    functionalTesting: { pageIndex: 7, y: 325 },
    verifyTestResults: { pageIndex: 7, y: 290 },
    completeElectricalInstallationCertificate: { pageIndex: 7, y: 245 },
  },
  // Fault Diagnosis and Rectification (Page 9, index 8)
  faultDiagnosisRectification: {
    riskAssessmentWorkBestPractice: { pageIndex: 8, y: 660 },
    identifyUseToolsEquipment: { pageIndex: 8, y: 620 },
    checksPreparationsPriorDiagnosis: { pageIndex: 8, y: 580 },
    identifyFaultsFromSymptom: { pageIndex: 8, y: 550 },
    stateRecordRectification: { pageIndex: 8, y: 520 },
  },
  // Assessment of Applied Knowledge (Page 9, index 8 - lower section)
  assessmentAppliedKnowledge: {
    healthAndSafety: { pageIndex: 8, y: 390 },
    bs7671Requirements: { pageIndex: 8, y: 355 },
    buildingRegulations: { pageIndex: 8, y: 325 },
    inspectionTestingFaultFinding: { pageIndex: 8, y: 290 },
  },
}

// Further requirements text field positions (Page 10, index 9)
const FURTHER_REQUIREMENTS_POSITIONS = {
  knowledge: { x: 72, y: 600, maxWidth: 470 },
  experience: { x: 72, y: 450, maxWidth: 470 },
}

/**
 * Overlays candidate responses onto the original TESP PDF
 */
export async function overlayTespPdf(data: TespOverlayData): Promise<Uint8Array> {
  // Load the original TESP PDF template
  const templatePath = path.join(process.cwd(), "public", "templates", "ewa-skills-scan-template.pdf")
  
  if (!fs.existsSync(templatePath)) {
    throw new Error(`TESP PDF template not found at: ${templatePath}`)
  }
  
  const templateBytes = fs.readFileSync(templatePath)
  console.log(`[v0] TESP PDF template loaded: ${templateBytes.length} bytes from ${templatePath}`)
  
  const pdfDoc = await PDFDocument.load(templateBytes)
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  
  const pages = pdfDoc.getPages()
  
  console.log(`[v0] TESP PDF has ${pages.length} pages`)
  
  // Log page sizes for verification
  pages.forEach((page, idx) => {
    const { width, height } = page.getSize()
    console.log(`[v0] Page ${idx + 1}: ${width.toFixed(0)} x ${height.toFixed(0)} points`)
  })
  
  // Fill candidate name on page 1 (index 0)
  if (data.candidateName && pages.length > 0) {
    const page1 = pages[0]
    page1.drawText(data.candidateName, {
      x: CANDIDATE_NAME_POSITION.x,
      y: CANDIDATE_NAME_POSITION.y,
      size: 11,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    })
    console.log(`[v0] Filled candidate name: ${data.candidateName}`)
  }
  
  // Draw checkmarks for each skill based on the mapping
  for (const [sectionId, skills] of Object.entries(data.skills)) {
    const sectionMap = SKILL_COORDINATE_MAP[sectionId]
    if (!sectionMap) {
      console.log(`[v0] No mapping found for section: ${sectionId}`)
      continue
    }
    
    for (const [skillId, rating] of Object.entries(skills)) {
      const coords = sectionMap[skillId]
      if (!coords) {
        console.log(`[v0] No mapping found for skill: ${sectionId}.${skillId}`)
        continue
      }
      
      const { pageIndex, y } = coords
      if (pageIndex >= pages.length) {
        console.log(`[v0] Page index ${pageIndex} out of range`)
        continue
      }
      
      const page = pages[pageIndex]
      
      // Draw knowledge checkbox
      const knowledgeRating = normalizeRating(rating.knowledge)
      if (knowledgeRating && CHECKBOX_COLUMNS.knowledge[knowledgeRating]) {
        const x = CHECKBOX_COLUMNS.knowledge[knowledgeRating]
        drawCheckmark(page, x, y, helveticaBold)
        console.log(`[v0] Marked ${sectionId}.${skillId} knowledge: ${knowledgeRating} at (${x}, ${y})`)
      }
      
      // Draw experience checkbox
      const experienceRating = normalizeRating(rating.experience)
      if (experienceRating && CHECKBOX_COLUMNS.experience[experienceRating]) {
        const x = CHECKBOX_COLUMNS.experience[experienceRating]
        drawCheckmark(page, x, y, helveticaBold)
        console.log(`[v0] Marked ${sectionId}.${skillId} experience: ${experienceRating} at (${x}, ${y})`)
      }
    }
  }
  
  // Fill further requirements on page 10 (index 9) if it exists
  if (pages.length > 9) {
    const page10 = pages[9]
    
    if (data.furtherKnowledgeRequired) {
      const wrappedText = wrapText(data.furtherKnowledgeRequired, 80)
      page10.drawText(wrappedText, {
        x: FURTHER_REQUIREMENTS_POSITIONS.knowledge.x,
        y: FURTHER_REQUIREMENTS_POSITIONS.knowledge.y,
        size: 10,
        font: helveticaFont,
        color: rgb(0, 0, 0),
        lineHeight: 14,
      })
      console.log(`[v0] Filled further knowledge required`)
    }
    
    if (data.furtherExperienceRequired) {
      const wrappedText = wrapText(data.furtherExperienceRequired, 80)
      page10.drawText(wrappedText, {
        x: FURTHER_REQUIREMENTS_POSITIONS.experience.x,
        y: FURTHER_REQUIREMENTS_POSITIONS.experience.y,
        size: 10,
        font: helveticaFont,
        color: rgb(0, 0, 0),
        lineHeight: 14,
      })
      console.log(`[v0] Filled further experience required`)
    }
  }
  
  // Save and return the modified PDF
  console.log(`[v0] Saving overlaid TESP PDF`)
  return await pdfDoc.save()
}

/**
 * Draws a checkmark (X) at the specified position
 */
function drawCheckmark(
  page: ReturnType<typeof PDFDocument.prototype.getPages>[0],
  x: number,
  y: number,
  font: Awaited<ReturnType<typeof PDFDocument.prototype.embedFont>>
) {
  page.drawText("X", {
    x: x + 4,
    y: y - 3,
    size: 12,
    font,
    color: rgb(0, 0, 0),
  })
}

/**
 * Normalizes rating string to match expected values
 */
function normalizeRating(rating: string): Rating | null {
  if (!rating) return null
  const normalized = rating.toLowerCase().trim()
  if (normalized === "limited" || normalized === "l") return "Limited"
  if (normalized === "adequate" || normalized === "a") return "Adequate"
  if (normalized === "extensive" || normalized === "e") return "Extensive"
  if (normalized === "unsure" || normalized === "u") return "Unsure"
  return null
}

/**
 * Wraps text to fit within a given character width
 */
function wrapText(text: string, maxCharsPerLine: number): string {
  const words = text.split(" ")
  const lines: string[] = []
  let currentLine = ""
  
  for (const word of words) {
    if ((currentLine + " " + word).trim().length <= maxCharsPerLine) {
      currentLine = (currentLine + " " + word).trim()
    } else {
      if (currentLine) lines.push(currentLine)
      currentLine = word
    }
  }
  if (currentLine) lines.push(currentLine)
  
  return lines.join("\n")
}
