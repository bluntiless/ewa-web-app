export type SubmissionStatus = "pending" | "reviewed" | "uploaded" | "failed" | "archived"

export interface SkillsScanSubmission {
  id: string
  candidateName: string
  email: string
  phone: string
  yearsExperience: string
  submittedAt: string
  status: SubmissionStatus
  sharePointPath?: string
  uploadedAt?: string
  archivedAt?: string
  notes?: string
}

export interface SkillsScanSubmissionData {
  metadata: SkillsScanSubmission
  formData: {
    fullName: string
    email: string
    phone: string
    yearsExperience: string
    otherQualifications: string
    criminalConvictions: "yes" | "no"
    rightToWork: "yes" | "no"
    declaration: boolean
    selectedQualifications: {
      tableA: { [key: string]: boolean }
      tableB: { [key: string]: boolean }
      tableC: { [key: string]: boolean }
    }
    skills: {
      [sectionId: string]: {
        [skillId: string]: {
          knowledge: string
          experience: string
        }
      }
    }
    furtherKnowledgeRequired: string
    furtherExperienceRequired: string
  }
}

export function generateSubmissionId(): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 8)
  return `ss-${timestamp}-${random}`
}

export function formatSubmissionDate(date: Date): string {
  return date.toISOString().split('T')[0]
}

export function sanitizeCandidateName(name: string): string {
  // Remove characters that are invalid in SharePoint filenames: " * : < > ? / \ |
  // Also remove any control characters and trim whitespace
  return name
    .replace(/["\*:<>\?\/\\|]/g, '') // Remove SharePoint invalid chars
    .replace(/[^\w\s'-]/g, '')        // Keep only word chars, spaces, hyphens, apostrophes
    .replace(/\s+/g, ' ')             // Normalize multiple spaces to single space
    .trim()
    .substring(0, 100)                // Limit length to avoid path issues
}

export function getSubmissionFileName(candidateName: string, date: string, extension: string): string {
  const safeName = sanitizeCandidateName(candidateName)
  return `TESP Skills Scan - ${safeName} - ${date}.${extension}`
}
