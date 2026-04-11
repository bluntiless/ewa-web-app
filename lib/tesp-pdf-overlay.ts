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

// Candidate name field position (Page 1)
// The name field is below the header, in a text field area
// Y is from bottom of page, so lower Y = lower on page
const CANDIDATE_NAME_POSITION = { x: 180, y: 480 }

// Mapping from website section/skill IDs to page index and Y position
// This maps the exact IDs used in skills-scan-data.ts to coordinates in the TESP PDF
// Y positions are from BOTTOM of page (PDF coordinate system)
// A4 page height is 842 points, so y=742 is near top, y=100 is near bottom
// Each skill row is approximately 22-25 points apart
// The skills table typically starts around y=680 and rows go down from there
const SKILL_COORDINATE_MAP: {
  [sectionId: string]: {
    [skillId: string]: { pageIndex: number; y: number }
  }
} = {
  // Safe Isolation and Risk Assessment (Page 2, index 1)
  // Table starts around y=680, rows approximately 25 points apart
  safeIsolation: {
    carryOutRiskAssessment: { pageIndex: 1, y: 655 },
    safeIsolationSinglePhase: { pageIndex: 1, y: 630 },
    safeIsolationThreePhaseCircuit: { pageIndex: 1, y: 605 },
    safeIsolationThreePhaseInstallation: { pageIndex: 1, y: 580 },
  },
  // Installation (Pages 3-5, indices 2-4)
  installation: {
    interpretationOfSpecs: { pageIndex: 2, y: 655 },
    selectionOfProtectiveDevices: { pageIndex: 2, y: 630 },
    installProtectiveEquipotentialBonding: { pageIndex: 2, y: 605 },
    installTerminatePVCSingles: { pageIndex: 2, y: 580 },
    installTerminatePVCMultiCore: { pageIndex: 2, y: 555 },
    installTerminateSYMultiFlex: { pageIndex: 2, y: 530 },
    installTerminateHeatResistantFlex: { pageIndex: 2, y: 505 },
    installTerminateXLPE_SWA: { pageIndex: 2, y: 480 },
    // Page 4 (index 3)
    installTerminateDataCable: { pageIndex: 3, y: 655 },
    installTerminateFP200: { pageIndex: 3, y: 630 },
    formInstall20mmMetalConduit: { pageIndex: 3, y: 605 },
    formInstall20mmPVCConduit: { pageIndex: 3, y: 580 },
    installThreeOtherWiringSystems: { pageIndex: 3, y: 555 },
    installProtectiveDevicesTPN: { pageIndex: 3, y: 530 },
    installTwoWayIntermediateLighting: { pageIndex: 3, y: 505 },
    installBS1363SocketRing: { pageIndex: 3, y: 480 },
    // Page 5 (index 4)
    installCarbonMonoxideDetector: { pageIndex: 4, y: 655 },
    installDataOutletsCat5: { pageIndex: 4, y: 630 },
    installBSEN60309Socket: { pageIndex: 4, y: 605 },
    installProtectiveEquipotentialBondingGasWater: { pageIndex: 4, y: 580 },
    connectThreePhaseDirectMotor: { pageIndex: 4, y: 555 },
    installSPlanCentralHeating: { pageIndex: 4, y: 530 },
  },
  // Inspection and Testing (Pages 6-7, indices 5-6)
  inspectionTesting: {
    riskAssessmentHealthSafety: { pageIndex: 5, y: 655 },
    installationIsolated: { pageIndex: 5, y: 630 },
    visualInspectionBS7671: { pageIndex: 5, y: 605 },
    continuityProtectiveConductors: { pageIndex: 5, y: 580 },
    continuityRingFinalCircuit: { pageIndex: 5, y: 555 },
    insulationResistance: { pageIndex: 5, y: 530 },
    polarity: { pageIndex: 5, y: 505 },
    // Page 7 (index 6)
    earthFaultLoopImpedance: { pageIndex: 6, y: 655 },
    prospectiveFaultCurrent: { pageIndex: 6, y: 630 },
    phaseSequenceRotation: { pageIndex: 6, y: 605 },
    functionalTesting: { pageIndex: 6, y: 580 },
    verifyTestResults: { pageIndex: 6, y: 555 },
    completeElectricalInstallationCertificate: { pageIndex: 6, y: 530 },
  },
  // Fault Diagnosis and Rectification (Page 8, index 7)
  faultDiagnosisRectification: {
    riskAssessmentWorkBestPractice: { pageIndex: 7, y: 655 },
    identifyUseToolsEquipment: { pageIndex: 7, y: 630 },
    checksPreparationsPriorDiagnosis: { pageIndex: 7, y: 605 },
    identifyFaultsFromSymptom: { pageIndex: 7, y: 580 },
    stateRecordRectification: { pageIndex: 7, y: 555 },
  },
  // Assessment of Applied Knowledge (Page 9, index 8)
  assessmentAppliedKnowledge: {
    healthAndSafety: { pageIndex: 8, y: 655 },
    bs7671Requirements: { pageIndex: 8, y: 630 },
    buildingRegulations: { pageIndex: 8, y: 605 },
    inspectionTestingFaultFinding: { pageIndex: 8, y: 580 },
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
