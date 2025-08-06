export interface AssessmentBooking {
  id: string
  studentId: string
  assessorId: string
  unitIds: string[]
  scheduledDate: string
  scheduledTime: string
  location: string
  type: "practical" | "portfolio_review" | "interview" | "observation"
  status: "scheduled" | "completed" | "cancelled" | "rescheduled"
  notes?: string
}

export interface AssessmentResult {
  id: string
  bookingId: string
  unitId: string
  learningOutcomeId: string
  result: "competent" | "not_yet_competent" | "referred"
  assessorComments: string
  evidenceReviewed: string[]
  assessmentDate: string
  assessorId: string
}

export interface AssessmentFeedback {
  id: string
  studentId: string
  assessorId: string
  unitId: string
  overallFeedback: string
  strengths: string[]
  areasForImprovement: string[]
  nextSteps: string[]
  grade?: string
  dateProvided: string
}

export class AssessmentService {
  static async bookAssessment(booking: Omit<AssessmentBooking, "id" | "status">): Promise<AssessmentBooking> {
    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          ...booking,
          id: `booking_${Date.now()}`,
          status: "scheduled",
        })
      }, 1000)
    })
  }

  static async getAvailableSlots(assessorId: string, date: string): Promise<string[]> {
    // Mock implementation - return available time slots
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"])
      }, 500)
    })
  }

  static async getAssessmentHistory(studentId: string): Promise<AssessmentBooking[]> {
    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: "booking_1",
            studentId,
            assessorId: "assessor_1",
            unitIds: ["unit_1", "unit_2"],
            scheduledDate: "2024-01-15",
            scheduledTime: "09:00",
            location: "Workshop A",
            type: "practical",
            status: "completed",
            notes: "Practical assessment for electrical installation units",
          },
        ])
      }, 800)
    })
  }

  static async submitAssessmentResults(results: Omit<AssessmentResult, "id">[]): Promise<AssessmentResult[]> {
    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        const assessmentResults = results.map((result) => ({
          ...result,
          id: `result_${Date.now()}_${Math.random()}`,
        }))
        resolve(assessmentResults)
      }, 1200)
    })
  }

  static async getAssessmentResults(studentId: string, unitId?: string): Promise<AssessmentResult[]> {
    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: "result_1",
            bookingId: "booking_1",
            unitId: "unit_1",
            learningOutcomeId: "lo_1",
            result: "competent",
            assessorComments: "Excellent demonstration of electrical safety procedures",
            evidenceReviewed: ["evidence_1", "evidence_2"],
            assessmentDate: "2024-01-15T09:00:00Z",
            assessorId: "assessor_1",
          },
        ])
      }, 600)
    })
  }

  static async provideFeedback(feedback: Omit<AssessmentFeedback, "id">): Promise<AssessmentFeedback> {
    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          ...feedback,
          id: `feedback_${Date.now()}`,
        })
      }, 800)
    })
  }

  static async getFeedback(studentId: string, unitId?: string): Promise<AssessmentFeedback[]> {
    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: "feedback_1",
            studentId,
            assessorId: "assessor_1",
            unitId: "unit_1",
            overallFeedback: "Strong performance in practical skills demonstration",
            strengths: ["Safety awareness", "Technical competency", "Problem-solving"],
            areasForImprovement: ["Documentation", "Time management"],
            nextSteps: ["Complete portfolio evidence", "Schedule final assessment"],
            grade: "Pass",
            dateProvided: "2024-01-15T16:00:00Z",
          },
        ])
      }, 700)
    })
  }
}
