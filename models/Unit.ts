export interface Unit {
  id: string
  code: string
  title: string
  description: string
  qualification: "EWA" | "NVQ"
  type: string
  creditValue: number
  guidedLearningHours: number
  totalQualificationTime: number
  level: number
  learningOutcomes: LearningOutcome[]
  status?: 'completed' | 'in_progress' | 'not_started'
  overallProgress?: number
  displayCode?: string
  category?: string
}

export interface LearningOutcome {
  id: string
  code: string
  description: string
  performanceCriteria: PerformanceCriteria[]
}

export interface PerformanceCriteria {
  id: string
  code: string
  description: string
}
