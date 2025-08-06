import { Evidence } from "@/models/Evidence"
import { Unit } from "@/models/Unit"

export class PortfolioCompilationService {
  /**
   * Simulates compiling a portfolio for a given qualification.
   * In a real application, this would involve fetching and organizing
   * evidence, generating reports, and potentially creating a shareable document.
   * @param qualificationId The ID of the qualification to compile.
   * @param units The units associated with the qualification.
   * @param evidence The evidence submitted by the candidate.
   * @returns A promise that resolves with a success message or rejects with an error.
   */
  static async compilePortfolio(qualificationId: string, units: Unit[], evidence: Evidence[]): Promise<string> {
    console.log(`Attempting to compile portfolio for ${qualificationId}...`)
    console.log("Units included:", units.map((u) => u.id))
    console.log("Evidence included:", evidence.map((e) => e.id))

    // Simulate API call or complex compilation process
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.1) {
          // Simulate success 90% of the time
          const compiledReportUrl = `/reports/${qualificationId}-portfolio-${Date.now()}.pdf`
          console.log(`Portfolio for ${qualificationId} compiled successfully. Report available at: ${compiledReportUrl}`)
          resolve(`Portfolio for ${qualificationId} compiled successfully! View report: ${compiledReportUrl}`)
        } else {
          // Simulate failure 10% of the time
          console.error(`Failed to compile portfolio for ${qualificationId}.`)
          reject(new Error(`Failed to compile portfolio for ${qualificationId}. Please try again.`))
        }
      }, 3000) // Simulate a 3-second compilation time
    })
  }

  /**
   * Simulates generating a summary of the portfolio status.
   * @param units All units relevant to the user.
   * @param evidence All evidence submitted by the user.
   * @returns An object summarizing completed and pending evidence.
   */
  static getPortfolioSummary(units: Unit[], evidence: Evidence[]) {
    const totalCriteria = units.reduce(
      (sum, unit) => sum + unit.learningOutcomes.reduce((loSum, lo) => loSum + lo.performanceCriteria.length, 0),
      0,
    )

    const approvedEvidenceCount = evidence.filter((e) => e.status === "Approved").length
    const pendingEvidenceCount = evidence.filter((e) => e.status === "Pending").length
    const rejectedEvidenceCount = evidence.filter((e) => e.status === "Rejected").length

    // This is a simplified calculation. In a real app, you'd map evidence to specific criteria.
    // For demonstration, we'll just count approved evidence as 'covered criteria'.
    const coveredCriteria = Math.min(approvedEvidenceCount, totalCriteria)
    const progressPercentage = totalCriteria > 0 ? (coveredCriteria / totalCriteria) * 100 : 0

    return {
      totalUnits: units.length,
      totalCriteria,
      approvedEvidenceCount,
      pendingEvidenceCount,
      rejectedEvidenceCount,
      progressPercentage,
      message: `You have ${approvedEvidenceCount} pieces of approved evidence covering ${coveredCriteria} out of ${totalCriteria} criteria.`,
    }
  }

  /**
   * Simulates retrieving a list of all evidence submitted by a candidate.
   * @param candidateId The ID of the candidate.
   * @returns A promise that resolves with an array of Evidence objects.
   */
  static async getCandidateEvidence(candidateId: string): Promise<Evidence[]> {
    console.log(`Fetching evidence for candidate: ${candidateId}`)
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock data for demonstration
        const mockEvidence: Evidence[] = [
          {
            id: "ev1",
            title: "Health & Safety Report",
            description: "Report on workplace safety procedures.",
            uploadedBy: "John Doe",
            uploadDate: "2023-01-15",
            status: "Approved",
            unitId: "EWA-U1",
            criterionId: "EWA-U1.1",
          },
          {
            id: "ev2",
            title: "Communication Log",
            description: "Log of team communication for project X.",
            uploadedBy: "John Doe",
            uploadDate: "2023-02-01",
            status: "Pending",
            unitId: "EWA-U2",
            criterionId: "EWA-U2.2",
          },
          {
            id: "ev3",
            title: "Project Plan Document",
            description: "Detailed plan for the Q1 development project.",
            uploadedBy: "John Doe",
            uploadDate: "2023-02-10",
            status: "Rejected",
            unitId: "EWA-U3",
            criterionId: "EWA-U3.1",
          },
          {
            id: "ev4",
            title: "Risk Assessment Form",
            description: "Completed risk assessment for new machinery.",
            uploadedBy: "John Doe",
            uploadDate: "2023-03-05",
            status: "Approved",
            unitId: "EWA-U1",
            criterionId: "EWA-U1.2",
          },
          {
            id: "ev5",
            title: "Meeting Minutes",
            description: "Minutes from weekly team sync meeting.",
            uploadedBy: "John Doe",
            uploadDate: "2023-03-12",
            status: "Pending",
            unitId: "EWA-U2",
            criterionId: "EWA-U2.1",
          },
        ]
        resolve(mockEvidence)
      }, 1000)
    })
  }

  /**
   * Simulates submitting new evidence.
   * @param newEvidence The evidence object to submit.
   * @returns A promise that resolves with the submitted evidence or rejects with an error.
   */
  static async submitEvidence(newEvidence: Omit<Evidence, "id" | "status" | "uploadDate">): Promise<Evidence> {
    console.log("Submitting new evidence:", newEvidence)
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.05) {
          // Simulate success 95% of the time
          const submittedEvidence: Evidence = {
            ...newEvidence,
            id: `ev-${Date.now()}`,
            status: "Pending", // Newly submitted evidence is always pending
            uploadDate: new Date().toISOString().split("T")[0], // Current date
          }
          console.log("Evidence submitted successfully:", submittedEvidence)
          resolve(submittedEvidence)
        } else {
          // Simulate failure 5% of the time
          reject(new Error("Failed to submit evidence. Please check your input and try again."))
        }
      }, 1500) // Simulate network delay
    })
  }

  /**
   * Simulates updating existing evidence.
   * @param updatedEvidence The evidence object with updated fields.
   * @returns A promise that resolves with the updated evidence or rejects with an error.
   */
  static async updateEvidence(updatedEvidence: Evidence): Promise<Evidence> {
    console.log("Updating evidence:", updatedEvidence)
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.05) {
          // Simulate success 95% of the time
          console.log("Evidence updated successfully:", updatedEvidence)
          resolve(updatedEvidence)
        } else {
          // Simulate failure 5% of the time
          reject(new Error("Failed to update evidence. Please try again."))
        }
      }, 1500) // Simulate network delay
    })
  }

  /**
   * Simulates deleting evidence.
   * @param evidenceId The ID of the evidence to delete.
   * @returns A promise that resolves on success or rejects on failure.
   */
  static async deleteEvidence(evidenceId: string): Promise<void> {
    console.log("Deleting evidence:", evidenceId)
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.05) {
          // Simulate success 95% of the time
          console.log("Evidence deleted successfully:", evidenceId)
          resolve()
        } else {
          // Simulate failure 5% of the time
          reject(new Error("Failed to delete evidence. Please try again."))
        }
      }, 1000) // Simulate network delay
    })
  }
}
