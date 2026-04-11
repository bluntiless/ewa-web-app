import { PDFDocument } from "pdf-lib"
import type { SuitabilityEvaluation } from "./suitability-evaluation"

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
  selectedQualifications?: {
    tableA: { [key: string]: boolean }
    tableB: { [key: string]: boolean }
    tableC: { [key: string]: boolean }
  }
  furtherKnowledgeRequired?: string
  furtherExperienceRequired?: string
  suitabilityResult?: SuitabilityEvaluation
}

// Map our skill IDs to the PDF form field names
// The PDF form fields follow a naming pattern based on section and skill number
const SKILL_FIELD_MAP: { [sectionId: string]: { [skillId: string]: number } } = {
  "safe-isolation": {
    "risk-assessment": 1,
    "single-phase-isolation": 2,
    "three-phase-circuit-isolation": 3,
    "three-phase-installation-isolation": 4,
  },
  "installation": {
    "specifications-interpretation": 5,
    "protective-devices-selection": 6,
    "equipotential-bonding": 7,
    "pvc-singles-cable": 8,
    "pvc-multicore-cable": 9,
    "swa-cable-unarmoured": 10,
    "swa-cable-armoured": 11,
    "micc-cable": 12,
    "data-cable": 13,
    "fire-alarm-cable": 14,
    "containment-systems": 15,
    "circuit-accessories": 16,
    "components-equipment": 17,
    "wiring-systems-inspection": 18,
    "commissioning-systems": 19,
  },
  "inspection-testing": {
    "continuity-protective-conductors": 20,
    "continuity-ring-final": 21,
    "insulation-resistance": 22,
    "polarity": 23,
    "efli-verification": 24,
    "pscc-verification": 25,
    "rcd-testing": 26,
    "additional-requirements": 27,
    "documentation-completion": 28,
  },
  "fault-diagnosis": {
    "safe-isolation-fd": 29,
    "logical-approach": 30,
    "testing-methods": 31,
    "results-interpretation": 32,
  },
  "applied-knowledge": {
    "bs7671-application": 33,
    "osg-use": 34,
    "risk-assessment-ak": 35,
    "technical-info": 36,
    "electrical-principles": 37,
    "legislation": 38,
  },
}

// Map rating values to checkbox field suffixes
const RATING_MAP: { [key: string]: string } = {
  "limited": "L",
  "adequate": "A", 
  "extensive": "E",
  "unsure": "U",
}

/**
 * Fills the official TESP Skills Scan PDF form with candidate responses.
 * Uses pdf-lib to fill the fillable form fields directly.
 * 
 * Training Provider Verification section is left blank for provider completion.
 */
export async function fillOfficialTespPdf(
  templatePdfBytes: ArrayBuffer,
  formData: TespPdfFormData
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(templatePdfBytes)
  const form = pdfDoc.getForm()
  
  // Log available form fields for debugging
  const fields = form.getFields()
  console.log("[v0] PDF Form fields found:", fields.map(f => f.getName()))

  // Try to fill candidate name field
  try {
    // Common field name patterns for candidate name
    const nameFieldPatterns = ["CandidateName", "Candidate_Name", "candidate_name", "Name", "name"]
    for (const pattern of nameFieldPatterns) {
      try {
        const nameField = form.getTextField(pattern)
        if (nameField) {
          nameField.setText(formData.candidateName)
          break
        }
      } catch {
        // Field doesn't exist with this name, try next
      }
    }
  } catch (err) {
    console.log("[v0] Could not fill candidate name field:", err)
  }

  // Fill skill checkboxes
  for (const [sectionId, skills] of Object.entries(formData.skills)) {
    const sectionMapping = SKILL_FIELD_MAP[sectionId]
    if (!sectionMapping) continue

    for (const [skillId, ratings] of Object.entries(skills)) {
      const skillNum = sectionMapping[skillId]
      if (!skillNum) continue

      // Try to check the appropriate knowledge checkbox
      if (ratings.knowledge && RATING_MAP[ratings.knowledge]) {
        const knowledgeSuffix = RATING_MAP[ratings.knowledge]
        const fieldPatterns = [
          `K${skillNum}${knowledgeSuffix}`,
          `Knowledge_${skillNum}_${knowledgeSuffix}`,
          `skill${skillNum}_knowledge_${ratings.knowledge}`,
        ]
        
        for (const fieldName of fieldPatterns) {
          try {
            const checkbox = form.getCheckBox(fieldName)
            if (checkbox) {
              checkbox.check()
              break
            }
          } catch {
            // Try as radio button
            try {
              const radio = form.getRadioGroup(fieldName)
              if (radio) {
                radio.select(knowledgeSuffix)
                break
              }
            } catch {
              // Field doesn't exist
            }
          }
        }
      }

      // Try to check the appropriate experience checkbox
      if (ratings.experience && RATING_MAP[ratings.experience]) {
        const experienceSuffix = RATING_MAP[ratings.experience]
        const fieldPatterns = [
          `E${skillNum}${experienceSuffix}`,
          `Experience_${skillNum}_${experienceSuffix}`,
          `skill${skillNum}_experience_${ratings.experience}`,
        ]
        
        for (const fieldName of fieldPatterns) {
          try {
            const checkbox = form.getCheckBox(fieldName)
            if (checkbox) {
              checkbox.check()
              break
            }
          } catch {
            // Try as radio button
            try {
              const radio = form.getRadioGroup(fieldName)
              if (radio) {
                radio.select(experienceSuffix)
                break
              }
            } catch {
              // Field doesn't exist
            }
          }
        }
      }
    }
  }

  // Try to fill qualification checkboxes
  if (formData.selectedQualifications) {
    const allQuals = {
      ...formData.selectedQualifications.tableA,
      ...formData.selectedQualifications.tableB,
      ...formData.selectedQualifications.tableC,
    }
    
    for (const [qualName, selected] of Object.entries(allQuals)) {
      if (!selected) continue
      
      // Try various field name patterns
      const sanitizedName = qualName.replace(/[^a-zA-Z0-9]/g, "_").substring(0, 30)
      const fieldPatterns = [
        `Qual_${sanitizedName}`,
        sanitizedName,
        `qualification_${sanitizedName}`,
      ]
      
      for (const fieldName of fieldPatterns) {
        try {
          const checkbox = form.getCheckBox(fieldName)
          if (checkbox) {
            checkbox.check()
            break
          }
        } catch {
          // Field doesn't exist
        }
      }
    }
  }

  // Try to fill further requirements text fields
  if (formData.furtherKnowledgeRequired) {
    const fieldPatterns = ["FurtherKnowledge", "Further_Knowledge", "further_knowledge_required"]
    for (const fieldName of fieldPatterns) {
      try {
        const textField = form.getTextField(fieldName)
        if (textField) {
          textField.setText(formData.furtherKnowledgeRequired)
          break
        }
      } catch {
        // Field doesn't exist
      }
    }
  }

  if (formData.furtherExperienceRequired) {
    const fieldPatterns = ["FurtherExperience", "Further_Experience", "further_experience_required"]
    for (const fieldName of fieldPatterns) {
      try {
        const textField = form.getTextField(fieldName)
        if (textField) {
          textField.setText(formData.furtherExperienceRequired)
          break
        }
      } catch {
        // Field doesn't exist
      }
    }
  }

  // Flatten the form to make it non-editable (optional - remove if you want it to remain editable)
  // form.flatten()

  const pdfBytes = await pdfDoc.save()
  return pdfBytes
}

/**
 * Generate a filled TESP PDF from raw form data
 */
export async function generateFilledTespPdf(
  templateUrl: string,
  formData: TespPdfFormData
): Promise<Uint8Array> {
  // Fetch the template PDF
  const templateResponse = await fetch(templateUrl)
  if (!templateResponse.ok) {
    throw new Error(`Failed to fetch TESP PDF template: ${templateResponse.statusText}`)
  }
  
  const templateBytes = await templateResponse.arrayBuffer()
  return fillOfficialTespPdf(templateBytes, formData)
}
