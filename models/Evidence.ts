export enum AssessmentStatus {
  NotStarted = "not-started",
  Pending = "pending",
  Approved = "approved",
  Rejected = "rejected",
  NeedsRevision = "needs-revision",
}

export interface Evidence {
  id: string
  criteriaCode: string
  unitCode: string
  title: string
  description: string
  dateUploaded: string
  assessmentStatus: AssessmentStatus
  assessorFeedback?: string
  assessorName?: string
  assessmentDate?: string
  webUrl: string
  downloadUrl?: string
}

export interface EvidenceMetadata {
  id: string
  name: string
  webUrl?: string
  downloadUrl?: string
  size: number
  mimeType: string
  createdDateTime: Date
  lastModifiedDateTime: Date
  assessmentStatus?: AssessmentStatus
  assessorFeedback?: string
  assessorName?: string
  assessmentDate?: Date | string | null
  criteriaCode?: string
  unitCode?: string
  description?: string
}
