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
// These need calibration based on the actual TESP PDF layout
// Columns: Limited | Adequate | Extensive | Unsure for Knowledge, then same for Experience
const CHECKBOX_COLUMNS = {
  knowledge: {
    Limited: 262,
    Adequate: 298,
    Extensive: 334,
    Unsure: 370,
  },
  experience: {
    Limited: 422,
    Adequate: 458,
    Extensive: 494,
    Unsure: 530,
  },
}

// Candidate name field position (Page 1)
const CANDIDATE_NAME_POSITION = { x: 140, y: 695 }

// Mapping from website section/skill IDs to page index and Y position
// This maps the exact IDs used in skills-scan-data.ts to coordinates in the TESP PDF
// Y positions are from bottom of page (PDF coordinate system)
const SKILL_COORDINATE_MAP: {
  [sectionId: string]: {
    [skillId: string]: { pageIndex: number; y: number }
  }
} = {
  // Safe Isolation and Risk Assessment (Page 2, index 1)
  safeIsolation: {
    carryOutRiskAssessment: { pageIndex: 1, y: 635 },
    safeIsolationSinglePhase: { pageIndex: 1, y: 605 },
    safeIsolationThreePhaseCircuit: { pageIndex: 1, y: 575 },
    safeIsolationThreePhaseInstallation: { pageIndex: 1, y: 545 },
  },
  // Installation (Pages 3-5, indices 2-4)
  installation: {
    interpretationOfSpecs: { pageIndex: 2, y: 635 },
    selectionOfProtectiveDevices: { pageIndex: 2, y: 605 },
    installProtectiveEquipotentialBonding: { pageIndex: 2, y: 575 },
    installTerminatePVCSingles: { pageIndex: 2, y: 545 },
    installTerminatePVCMultiCore: { pageIndex: 2, y: 515 },
    installTerminateSYMultiFlex: { pageIndex: 2, y: 485 },
    installTerminateHeatResistantFlex: { pageIndex: 2, y: 455 },
    installTerminateXLPE_SWA: { pageIndex: 2, y: 425 },
    // Page 4 (index 3)
    installTerminateDataCable: { pageIndex: 3, y: 635 },
    installTerminateFP200: { pageIndex: 3, y: 605 },
    formInstall20mmMetalConduit: { pageIndex: 3, y: 575 },
    formInstall20mmPVCConduit: { pageIndex: 3, y: 545 },
    installThreeOtherWiringSystems: { pageIndex: 3, y: 515 },
    installProtectiveDevicesTPN: { pageIndex: 3, y: 485 },
    installTwoWayIntermediateLighting: { pageIndex: 3, y: 455 },
    installBS1363SocketRing: { pageIndex: 3, y: 425 },
    // Page 5 (index 4)
    installCarbonMonoxideDetector: { pageIndex: 4, y: 635 },
    installDataOutletsCat5: { pageIndex: 4, y: 605 },
    installBSEN60309Socket: { pageIndex: 4, y: 575 },
    installProtectiveEquipotentialBondingGasWater: { pageIndex: 4, y: 545 },
    connectThreePhaseDirectMotor: { pageIndex: 4, y: 515 },
    installSPlanCentralHeating: { pageIndex: 4, y: 485 },
  },
  // Inspection and Testing (Pages 6-7, indices 5-6)
  inspectionTesting: {
    riskAssessmentHealthSafety: { pageIndex: 5, y: 635 },
    installationIsolated: { pageIndex: 5, y: 605 },
    visualInspectionBS7671: { pageIndex: 5, y: 575 },
    continuityProtectiveConductors: { pageIndex: 5, y: 545 },
    continuityRingFinalCircuit: { pageIndex: 5, y: 515 },
    insulationResistance: { pageIndex: 5, y: 485 },
    polarity: { pageIndex: 5, y: 455 },
    // Page 7 (index 6)
    earthFaultLoopImpedance: { pageIndex: 6, y: 635 },
    prospectiveFaultCurrent: { pageIndex: 6, y: 605 },
    phaseSequenceRotation: { pageIndex: 6, y: 575 },
    functionalTesting: { pageIndex: 6, y: 545 },
    verifyTestResults: { pageIndex: 6, y: 515 },
    completeElectricalInstallationCertificate: { pageIndex: 6, y: 485 },
  },
  // Fault Diagnosis and Rectification (Page 8, index 7)
  faultDiagnosisRectification: {
    riskAssessmentWorkBestPractice: { pageIndex: 7, y: 635 },
    identifyUseToolsEquipment: { pageIndex: 7, y: 605 },
    checksPreparationsPriorDiagnosis: { pageIndex: 7, y: 575 },
    identifyFaultsFromSymptom: { pageIndex: 7, y: 545 },
    stateRecordRectification: { pageIndex: 7, y: 515 },
  },
  // Assessment of Applied Knowledge (Page 9, index 8)
  assessmentAppliedKnowledge: {
    healthAndSafety: { pageIndex: 8, y: 635 },
    bs7671Requirements: { pageIndex: 8, y: 605 },
    buildingRegulations: { pageIndex: 8, y: 575 },
    inspectionTestingFaultFinding: { pageIndex: 8, y: 545 },
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
  const templateBytes = fs.readFileSync(templatePath)
  
  const pdfDoc = await PDFDocument.load(templateBytes)
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  
  const pages = pdfDoc.getPages()
  
  console.log(`[v0] TESP PDF has ${pages.length} pages`)
  
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
