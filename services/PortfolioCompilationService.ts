import type { Evidence } from "@/models/Evidence"
import type { Unit } from "@/models/Unit"

export interface PortfolioSection {
  id: string
  title: string
  description: string
  evidence: Evidence[]
  completionStatus: "complete" | "incomplete" | "partial"
}

export interface CompiledPortfolio {
  id: string
  studentId: string
  qualificationType: "EWA" | "NVQ" | "RPL"
  createdDate: string
  lastModified: string
  sections: PortfolioSection[]
  overallCompletionPercentage: number
  status: "draft" | "submitted" | "under_review" | "approved" | "rejected"
}

export class PortfolioCompilationService {
  static async compilePortfolio(
    studentId: string,
    qualificationType: "EWA" | "NVQ" | "RPL",
    units: Unit[],
    evidence: Evidence[],
  ): Promise<CompiledPortfolio> {
    // Group evidence by units and learning outcomes
    const sections: PortfolioSection[] = units.map((unit) => {
      const unitEvidence = evidence.filter((e) => e.unitId === unit.id)

      return {
        id: unit.id,
        title: `${unit.code}: ${unit.title}`,
        description: unit.description,
        evidence: unitEvidence,
        completionStatus: this.calculateSectionCompletionStatus(unit, unitEvidence),
      }
    })

    const overallCompletionPercentage = this.calculateOverallCompletion(sections)

    return {
      id: `portfolio_${Date.now()}`,
      studentId,
      qualificationType,
      createdDate: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      sections,
      overallCompletionPercentage,
      status: "draft",
    }
  }

  private static calculateSectionCompletionStatus(
    unit: Unit,
    evidence: Evidence[],
  ): "complete" | "incomplete" | "partial" {
    const requiredOutcomes = unit.learningOutcomes.length
    const completedOutcomes = unit.learningOutcomes.filter((outcome) =>
      evidence.some((e) => e.learningOutcomeId === outcome.id && e.status === "approved"),
    ).length

    if (completedOutcomes === 0) return "incomplete"
    if (completedOutcomes === requiredOutcomes) return "complete"
    return "partial"
  }

  private static calculateOverallCompletion(sections: PortfolioSection[]): number {
    if (sections.length === 0) return 0

    const completedSections = sections.filter((s) => s.completionStatus === "complete").length
    return Math.round((completedSections / sections.length) * 100)
  }

  static async generatePortfolioReport(portfolioId: string): Promise<Blob> {
    // Mock implementation - would generate PDF report
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockPdfContent = "Mock PDF content for portfolio report"
        const blob = new Blob([mockPdfContent], { type: "application/pdf" })
        resolve(blob)
      }, 2000)
    })
  }

  static async submitPortfolio(portfolioId: string): Promise<void> {
    // Mock implementation - would submit to assessment system
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve()
      }, 1500)
    })
  }

  static async getPortfolioStatus(portfolioId: string): Promise<CompiledPortfolio["status"]> {
    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("under_review")
      }, 500)
    })
  }
}
