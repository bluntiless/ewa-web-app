export interface Evidence {
  id: string
  title: string
  description: string
  type: "document" | "image" | "video" | "audio" | "other"
  fileName: string
  fileSize: number
  uploadDate: string
  unitId: string
  learningOutcomeId: string
  status: "pending" | "approved" | "rejected" | "needs_revision"
  assessorComments?: string
  tags: string[]
  isConfidential: boolean
}

export interface EvidenceSubmission {
  evidenceId: string
  unitId: string
  learningOutcomeId: string
  submissionDate: string
  status: "submitted" | "under_review" | "approved" | "rejected"
  assessorFeedback?: string
}
