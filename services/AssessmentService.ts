export class AssessmentService {
  /**
   * Simulates fetching a list of mock assessments for a user.
   * In a real application, this would fetch data from a backend.
   * @returns An array of mock assessment objects.
   */
  static getMockAssessments() {
    return [
      {
        id: "ass1",
        title: "EWA Unit 1 Review",
        status: "Pending",
        dueDate: "2024-08-15",
        assessor: "Jane Smith",
      },
      {
        id: "ass2",
        title: "NVQ Level 3 Unit 5 Assessment",
        status: "Completed",
        dueDate: "2024-07-20",
        assessor: "John Doe",
      },
      {
        id: "ass3",
        title: "EWA Unit 3 Final Assessment",
        status: "Overdue",
        dueDate: "2024-07-01",
        assessor: "Jane Smith",
      },
      {
        id: "ass4",
        title: "NVQ Level 3 Unit 8 Review",
        status: "Pending",
        dueDate: "2024-09-01",
        assessor: "Alice Brown",
      },
    ]
  }

  /**
   * Simulates fetching details for a specific assessment.
   * @param assessmentId The ID of the assessment to fetch.
   * @returns A promise that resolves with the assessment details or null if not found.
   */
  static async getAssessmentDetails(assessmentId: string) {
    const assessments = this.getMockAssessments()
    return new Promise((resolve) => {
      setTimeout(() => {
        const assessment = assessments.find((a) => a.id === assessmentId)
        resolve(assessment)
      }, 500)
    })
  }

  /**
   * Simulates submitting an assessment.
   * @param assessmentData The data for the assessment submission.
   * @returns A promise that resolves on successful submission or rejects on failure.
   */
  static async submitAssessment(assessmentData: any) {
    console.log("Submitting assessment:", assessmentData)
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.1) {
          // Simulate success 90% of the time
          resolve({ success: true, message: "Assessment submitted successfully!" })
        } else {
          reject(new Error("Failed to submit assessment. Please try again."))
        }
      }, 1500)
    })
  }

  /**
   * Simulates updating an assessment status.
   * @param assessmentId The ID of the assessment to update.
   * @param newStatus The new status for the assessment.
   * @returns A promise that resolves on successful update or rejects on failure.
   */
  static async updateAssessmentStatus(assessmentId: string, newStatus: "Pending" | "Completed" | "Overdue") {
    console.log(`Updating assessment ${assessmentId} to status: ${newStatus}`)
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const assessments = this.getMockAssessments()
        const assessmentIndex = assessments.findIndex((a) => a.id === assessmentId)
        if (assessmentIndex > -1) {
          assessments[assessmentIndex].status = newStatus
          resolve({ success: true, message: `Assessment ${assessmentId} status updated to ${newStatus}.` })
        } else {
          reject(new Error(`Assessment with ID ${assessmentId} not found.`))
        }
      }, 1000)
    })
  }
}
