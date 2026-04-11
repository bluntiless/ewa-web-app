import { skillsScanSections } from "./skills-scan-data"

type Rating = "limited" | "adequate" | "extensive" | "unsure" | ""

interface SkillAssessment {
  knowledge: Rating
  experience: Rating
}

interface SkillsScanFormData {
  fullName: string
  email: string
  phone: string
  yearsExperience: string
  otherQualifications: string
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
}

export type SuitabilityResult = "likely-suitable" | "may-need-development" | "likely-not-suitable"

export interface SuitabilityEvaluation {
  result: SuitabilityResult
  title: string
  summary: string
  knowledgeScore: number
  experienceScore: number
  totalItems: number
  adequateOrBetterKnowledge: number
  adequateOrBetterExperience: number
  limitedKnowledgeCount: number
  limitedExperienceCount: number
  unsureKnowledgeCount: number
  unsureExperienceCount: number
  hasQualifications: boolean
  qualificationLevel: "tableA" | "tableB" | "tableC" | "none"
  knowledgeGaps: string[]
  experienceGaps: string[]
  guidance: string[]
}

export function evaluateSuitability(formData: SkillsScanFormData): SuitabilityEvaluation {
  // Count qualifications
  const hasTableA = Object.values(formData.selectedQualifications.tableA).some(v => v)
  const hasTableB = Object.values(formData.selectedQualifications.tableB).some(v => v)
  const hasTableC = Object.values(formData.selectedQualifications.tableC).some(v => v)
  const hasQualifications = hasTableA || hasTableB || hasTableC
  
  let qualificationLevel: "tableA" | "tableB" | "tableC" | "none" = "none"
  if (hasTableA) qualificationLevel = "tableA"
  else if (hasTableB) qualificationLevel = "tableB"
  else if (hasTableC) qualificationLevel = "tableC"

  // Count skills ratings
  let totalItems = 0
  let adequateOrBetterKnowledge = 0
  let adequateOrBetterExperience = 0
  let limitedKnowledgeCount = 0
  let limitedExperienceCount = 0
  let unsureKnowledgeCount = 0
  let unsureExperienceCount = 0
  const knowledgeGaps: string[] = []
  const experienceGaps: string[] = []

  for (const section of skillsScanSections) {
    const sectionSkills = formData.skills[section.id] || {}
    
    for (const item of section.items) {
      const skill = sectionSkills[item.id]
      totalItems++

      if (skill) {
        // Knowledge assessment
        if (skill.knowledge === "adequate" || skill.knowledge === "extensive") {
          adequateOrBetterKnowledge++
        } else if (skill.knowledge === "limited") {
          limitedKnowledgeCount++
          knowledgeGaps.push(item.text)
        } else if (skill.knowledge === "unsure") {
          unsureKnowledgeCount++
          knowledgeGaps.push(item.text)
        }

        // Experience assessment
        if (skill.experience === "adequate" || skill.experience === "extensive") {
          adequateOrBetterExperience++
        } else if (skill.experience === "limited") {
          limitedExperienceCount++
          experienceGaps.push(item.text)
        } else if (skill.experience === "unsure") {
          unsureExperienceCount++
          experienceGaps.push(item.text)
        }
      }
    }
  }

  const knowledgeScore = totalItems > 0 ? (adequateOrBetterKnowledge / totalItems) * 100 : 0
  const experienceScore = totalItems > 0 ? (adequateOrBetterExperience / totalItems) * 100 : 0

  // Determine result
  let result: SuitabilityResult
  let title: string
  let summary: string
  const guidance: string[] = []

  // Criteria for suitability
  const hasStrongKnowledge = knowledgeScore >= 85
  const hasStrongExperience = experienceScore >= 85
  const hasModerateKnowledge = knowledgeScore >= 60
  const hasModerateExperience = experienceScore >= 60
  const hasSignificantGaps = (limitedKnowledgeCount + unsureKnowledgeCount) > 10 || 
                             (limitedExperienceCount + unsureExperienceCount) > 10

  if (!hasQualifications) {
    result = "likely-not-suitable"
    title = "Qualifications Required"
    summary = "You have not indicated holding any of the required qualifications. A pre-requisite to registering on the IE/ME EWA is having knowledge and understanding comparable to the Level 3 Installation & Maintenance Electrician Qualification."
    guidance.push("You must hold at least a relevant Level 2 qualification from Tables A, B or C to be eligible for the IE/ME EWA.")
    guidance.push("If you hold a qualification not listed, please contact TESP for guidance via www.the-esp.org.uk/contact-us.")
    guidance.push("Consider undertaking a relevant electrical qualification before applying for the EWA route.")
  } else if (hasStrongKnowledge && hasStrongExperience) {
    result = "likely-suitable"
    title = "Likely Suitable for IE/ME EWA"
    summary = "Based on your responses, you appear to have the knowledge and practical experience expected for the Installation & Maintenance Electrician Experienced Worker Assessment."
    guidance.push("You should complete the Candidate Background form and choose a training provider.")
    guidance.push("You will need to provide certificates for your qualifications so they can be verified.")
    guidance.push("A training provider will discuss this Skills Scan with you to verify the information you have provided.")
    if (qualificationLevel === "tableB" || qualificationLevel === "tableC") {
      guidance.push("Note: As your qualifications are from Table B or C, a recorded/documented auditable technical discussion will be required to confirm you meet the full Level 3 knowledge requirements.")
    }
  } else if (hasModerateKnowledge && hasModerateExperience && !hasSignificantGaps) {
    result = "may-need-development"
    title = "May Need Further Development"
    summary = "You have indicated some gaps in knowledge or practical experience. Depending on the nature of these gaps, you may still be suitable for the IE/ME EWA with some additional preparation."
    
    if (limitedKnowledgeCount > 0 || unsureKnowledgeCount > 0) {
      guidance.push("Consider undertaking self-study or training to address the knowledge gaps identified.")
    }
    if (limitedExperienceCount > 0 || unsureExperienceCount > 0) {
      guidance.push("Think about whether there are opportunities within your current role to gain experience in the areas identified as gaps.")
    }
    guidance.push("Speak to a training provider to discuss whether the gaps can be addressed during the EWA process.")
    guidance.push("Make sure any recommended training or qualifications are recognised as meeting IE/ME EWA requirements.")
  } else {
    result = "likely-not-suitable"
    title = "Likely Not Suitable Yet"
    summary = "Based on your responses, you have indicated significant gaps in either knowledge or practical experience that may prevent you from successfully completing the IE/ME EWA at this time."
    
    if ((limitedKnowledgeCount + unsureKnowledgeCount) > (limitedExperienceCount + unsureExperienceCount)) {
      guidance.push("You appear to have significant gaps around knowledge. You may need to undertake further training or study to fill these gaps before applying for the IE/ME EWA.")
      guidance.push("If these knowledge gaps are significant and you also need practical experience taking at least 12 months, consider enrolling on an apprenticeship. There are no age restrictions and training costs are funded.")
    } else {
      guidance.push("You appear to have significant gaps around practical experience. If it's likely to take at least 12 months to obtain sufficient experience, consider enrolling on an apprenticeship.")
      guidance.push("If you don't meet apprenticeship requirements, consider whether it's possible to gain experience by taking on different tasks within your work.")
      guidance.push("If employed, talk to your employer about possible options. If self-employed, consider broadening the work you undertake.")
    }
    guidance.push("Visit www.electricalcareers.co.uk/routes for more information about alternative training routes.")
  }

  return {
    result,
    title,
    summary,
    knowledgeScore: Math.round(knowledgeScore),
    experienceScore: Math.round(experienceScore),
    totalItems,
    adequateOrBetterKnowledge,
    adequateOrBetterExperience,
    limitedKnowledgeCount,
    limitedExperienceCount,
    unsureKnowledgeCount,
    unsureExperienceCount,
    hasQualifications,
    qualificationLevel,
    knowledgeGaps: knowledgeGaps.slice(0, 5), // Limit to first 5 gaps
    experienceGaps: experienceGaps.slice(0, 5),
    guidance,
  }
}
