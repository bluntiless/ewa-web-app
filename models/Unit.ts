export interface PerformanceCriterion {
  id: string
  description: string
}

export interface LearningOutcome {
  id: string
  description: string
  performanceCriteria: PerformanceCriterion[]
}

export interface Unit {
  id: string
  title: string
  qualification: "EWA" | "NVQ"
  learningOutcomes: LearningOutcome[]
  isCompleted?: boolean // Optional: for tracking user progress
}
