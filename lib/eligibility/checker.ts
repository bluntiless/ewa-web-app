// Shared eligibility questionnaire options and scoring logic.
//
// This mirrors the exact dropdown values/labels and evaluation logic used by the
// original static eligibility checker at public/eligibility/index.html. It powers
// the in-chat questionnaire so that the chat flow produces IDENTICAL results and
// SharePoint records. The static form is intentionally left unchanged — both
// flows run independently and write the same shaped records.

export interface EligibilityOption {
  value: string
  label: string
}

export interface EligibilityQuestion {
  id: "experience" | "level2" | "level3" | "edition" | "it" | "work"
  // Short prompt shown in the chat questionnaire.
  question: string
  options: EligibilityOption[]
}

// Order matches the natural flow of the original form.
export const ELIGIBILITY_QUESTIONS: EligibilityQuestion[] = [
  {
    id: "experience",
    question: "How many years of relevant electrical experience do you have?",
    options: [
      { value: "10plus", label: "10+ Years" },
      { value: "5plus", label: "5–10 Years" },
      { value: "under5", label: "Under 5 Years" },
      { value: "unsure", label: "Unsure" },
    ],
  },
  {
    id: "level2",
    question: "Do you hold a full Level 2 electrotechnical qualification?",
    options: [
      { value: "2365L2", label: "C&G 2365 Level 2 Diploma in Electrical Installations" },
      { value: "2330L2", label: "C&G 2330 Level 2 Certificate in Electrotechnical Technology" },
      { value: "236P1", label: "C&G 236 Part 1" },
      { value: "EALL2", label: "EAL Level 2 Diploma in Electrical Installation" },
      { value: "apprenticeL2", label: "Full Level 2 electrical apprenticeship qualification" },
      { value: "equivalentL2", label: "Equivalent older Level 2 electrical qualification" },
      { value: "overseasL2", label: "Overseas equivalent electrical qualification" },
      { value: "none", label: "No Level 2 qualification" },
      { value: "unsure", label: "Not sure" },
    ],
  },
  {
    id: "level3",
    question: "Do you hold a Level 3 electrotechnical qualification?",
    options: [
      { value: "2365L3", label: "C&G 2365 Level 3 Diploma" },
      { value: "2330L3", label: "C&G 2330 Level 3" },
      { value: "236P2", label: "C&G 236 Part 2" },
      { value: "2357L3", label: "C&G 2357 Level 3 NVQ / apprenticeship" },
      { value: "EALL3", label: "EAL Level 3 electrical installation qualification" },
      { value: "equivalentL3", label: "Equivalent older Level 3 electrical qualification" },
      { value: "overseasL3", label: "Overseas equivalent electrical qualification" },
      { value: "none", label: "No Level 3 qualification" },
      { value: "unsure", label: "Not sure" },
    ],
  },
  {
    id: "edition",
    question: "What is your 18th Edition (BS 7671) status?",
    options: [
      { value: "2026", label: "BS 7671 Amendment 4 / 2026" },
      { value: "2024", label: "BS 7671 Amendment 3 / 2024" },
      { value: "2022", label: "BS 7671 Amendment 2 / 2022" },
      { value: "2018", label: "Original BS 7671:2018" },
      { value: "none", label: "No 18th Edition" },
      { value: "unsure", label: "Unsure" },
    ],
  },
  {
    id: "it",
    question: "Do you hold an Inspection & Testing qualification?",
    options: [
      { value: "yes", label: "C&G 2391 / Inspection & Testing Held" },
      { value: "initial", label: "Initial Verification Qualification" },
      { value: "equivalent", label: "Equivalent Inspection & Testing Qualification" },
      { value: "none", label: "No Inspection & Testing Qualification" },
      { value: "unsure", label: "Unsure" },
    ],
  },
  {
    id: "work",
    question: "What is your main type of work?",
    options: [
      { value: "commercial", label: "Commercial Electrical Installation" },
      { value: "industrial", label: "Industrial Electrical Installation" },
      { value: "domestic", label: "Domestic Installation" },
      { value: "mixed", label: "Mixed Electrical Work" },
      { value: "maintenance", label: "Maintenance / Service Engineering" },
      { value: "other", label: "Other / Specialist" },
    ],
  },
]

export type EligibilityAnswers = Record<EligibilityQuestion["id"], string>

export interface EligibilityResult {
  result: string
  pathway: string
  nextStep: string
  notes: string[]
}

// Returns the human-readable label for a given question value.
export function labelFor(id: EligibilityQuestion["id"], value: string): string {
  const q = ELIGIBILITY_QUESTIONS.find((x) => x.id === id)
  return q?.options.find((o) => o.value === value)?.label ?? value
}

// Replicates the exact scoring logic from the original static checker.
export function evaluateEligibility(answers: EligibilityAnswers): EligibilityResult {
  const { experience, level2, level3, edition, it } = answers

  const hasLevel2 = !!level2 && level2 !== "none" && level2 !== "unsure"
  const hasLevel3 = !!level3 && level3 !== "none" && level3 !== "unsure"
  const has5PlusYears = experience === "10plus" || experience === "5plus"

  // Pathway based on 18th Edition status.
  let pathway: string
  switch (edition) {
    case "2026":
    case "none":
      pathway = "603/5982/1DZ"
      break
    case "2024":
      pathway = "603/5982/1CZ"
      break
    case "2022":
      pathway = "603/5982/1AZ"
      break
    case "2018":
      pathway = "603/5982/1BZ"
      break
    default:
      pathway = "Further Review Required"
  }

  // Main eligibility outcome.
  let result: string
  let nextStep: string

  if (hasLevel2 && hasLevel3 && has5PlusYears) {
    result = "LIKELY SUITABLE"
    nextStep = "Complete full skills scan and provide qualification evidence for formal review."
  } else if (hasLevel2 && !hasLevel3 && has5PlusYears) {
    result = "POTENTIALLY SUITABLE"
    nextStep = "Full skills scan and assessor review recommended to confirm suitability."
  } else if (!hasLevel2 && !hasLevel3) {
    result = "FURTHER REVIEW REQUIRED"
    nextStep = "Contact EWA Tracker Ltd for detailed qualification mapping and guidance."
  } else if (!has5PlusYears) {
    result = "EXPERIENCE REVIEW REQUIRED"
    nextStep = "Contact EWA Tracker Ltd to discuss experience requirements."
  } else {
    result = "MANUAL REVIEW REQUIRED"
    nextStep = "Contact EWA Tracker Ltd for further guidance."
  }

  // Additional advisory notes (mirrors the form's warning boxes).
  const notes: string[] = []
  if (it === "none") {
    notes.push(
      "Inspection & Testing: You will need to hold an Inspection & Testing / Initial Verification qualification before certification claim. This can be completed alongside the EWA process.",
    )
  }
  if (edition === "none") {
    notes.push(
      "18th Edition: You do not currently hold the 18th Edition qualification. This will need to be completed as part of your EWA pathway.",
    )
  }
  if (level2 === "unsure" || level3 === "unsure") {
    notes.push(
      "Qualification Uncertainty: You indicated uncertainty about your qualification status. Please provide your qualification certificates for review so we can confirm your eligibility position.",
    )
  }
  notes.push(
    "Important: AM2E and ECS Gold Card progression come after the EWA qualification stage. The EWA is the first step in qualifying for the ECS Gold Card route.",
  )

  return { result, pathway, nextStep, notes }
}
