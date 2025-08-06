import { Evidence, AssessmentStatus } from "@/models/Evidence"

export interface AssessorFeedback {
  evidenceId: string
  assessorName: string
  feedback: string
  status: AssessmentStatus
  assessmentDate: string
}

export class AssessmentService {
  /**
   * Submits feedback for a piece of evidence.
   * This is a mock implementation.
   * @param feedback The feedback object.
   * @returns A promise resolving to the updated evidence.
   */
  static async submitEvidenceFeedback(feedback: AssessorFeedback): Promise<Evidence> {
    console.log("Submitting evidence feedback:", feedback)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock update to evidence
    const updatedEvidence: Evidence = {
      id: feedback.evidenceId,
      criteriaCode: "MOCK_CRITERIA", // Placeholder
      unitCode: "MOCK_UNIT", // Placeholder
      title: "Mock Evidence Title", // Placeholder
      description: "Mock Evidence Description", // Placeholder
      dateUploaded: new Date().toISOString(), // Placeholder
      webUrl: "#", // Placeholder
      downloadUrl: "#", // Placeholder
      assessmentStatus: feedback.status,
      assessorFeedback: feedback.feedback,
      assessorName: feedback.assessorName,
      assessmentDate: feedback.assessmentDate,
    }

    console.log("Evidence feedback submitted successfully:", updatedEvidence)
    return updatedEvidence
  }

  /**
   * Retrieves all evidence pending review for an assessor.
   * This is a mock implementation.
   * @param assessorId The ID of the assessor.
   * @returns A promise resolving to an array of evidence.
   */
  static async getPendingEvidence(assessorId: string): Promise<Evidence[]> {
    console.log(`Fetching pending evidence for assessor: ${assessorId}...`)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const mockPendingEvidence: Evidence[] = [
      {
        id: "pending_ev1",
        criteriaCode: "EWA_U1_PC1.1",
        unitCode: "EWA_U1",
        title: "Safety Training Certificate",
        description: "Certificate of completion for mandatory safety training.",
        dateUploaded: "2024-07-20T10:00:00Z",
        assessmentStatus: AssessmentStatus.Pending,
        webUrl: "/placeholder.pdf?query=safety-certificate",
        downloadUrl: "/placeholder.pdf?query=safety-certificate",
      },
      {
        id: "pending_ev2",
        criteriaCode: "NVQ_U2_PC2.1",
        unitCode: "NVQ_U2",
        title: "Fault Diagnosis Report - Motor",
        description: "Report detailing diagnosis of a faulty motor.",
        dateUploaded: "2024-07-22T14:30:00Z",
        assessmentStatus: AssessmentStatus.Pending,
        webUrl: "/placeholder.docx?query=fault-report",
        downloadUrl: "/placeholder.docx?query=fault-report",
      },
    ]

    console.log("Fetched pending evidence:", mockPendingEvidence)
    return mockPendingEvidence
  }

  /**
   * Retrieves all evidence that has been reviewed.
   * This is a mock implementation.
   * @param assessorId Optional: The ID of the assessor to filter by.
   * @returns A promise resolving to an array of evidence.
   */
  static async getReviewedEvidence(assessorId?: string): Promise<Evidence[]> {
    console.log(`Fetching reviewed evidence for assessor: ${assessorId || "all"}...`)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1200))

    const mockReviewedEvidence: Evidence[] = [
      {
        id: "reviewed_ev1",
        criteriaCode: "EWA_U1_PC1.2",
        unitCode: "EWA_U1",
        title: "Risk Assessment - Working at Height",
        description: "Completed risk assessment for working at height.",
        dateUploaded: "2024-07-18T09:00:00Z",
        assessmentStatus: AssessmentStatus.Approved,
        assessorFeedback: "Well-documented and thorough assessment.",
        assessorName: "Jane Doe",
        assessmentDate: "2024-07-20T11:00:00Z",
        webUrl: "/placeholder.pdf?query=risk-assessment",
        downloadUrl: "/placeholder.pdf?query=risk-assessment",
      },
      {
        id: "reviewed_ev2",
        criteriaCode: "NVQ_U3_PC1.1",
        unitCode: "NVQ_U3",
        title: "Maintenance Schedule - HVAC",
        description: "HVAC system preventative maintenance schedule.",
        dateUploaded: "2024-07-15T11:00:00Z",
        assessmentStatus: AssessmentStatus.NeedsRevision,
        assessorFeedback: "Needs more detail on specific component checks.",
        assessorName: "John Smith",
        assessmentDate: "2024-07-17T16:00:00Z",
        webUrl: "/placeholder.xlsx?query=maintenance-schedule",
        downloadUrl: "/placeholder.xlsx?query=maintenance-schedule",
      },
    ]

    console.log("Fetched reviewed evidence:", mockReviewedEvidence)
    return mockReviewedEvidence
  }
}
