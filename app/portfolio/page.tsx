"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { PortfolioCompilationService } from "@/services/PortfolioCompilationService"
import { useEffect, useState } from "react"
import { allUnits } from "@/data/units"
import { ProgressView } from "@/components/ProgressView"
import { PendingEvidenceView } from "@/components/PendingEvidenceView"
import { Evidence } from "@/models/Evidence"
import { getUnitsByQualification, getQualificationStats } from "@/data/units"

export default function PortfolioPage() {
  const { toast } = useToast()
  const [isCompiling, setIsCompiling] = useState(false)
  const [evidence, setEvidence] = useState<Evidence[]>([])
  const [isLoadingEvidence, setIsLoadingEvidence] = useState(true)
  const [evidenceError, setEvidenceError] = useState<string | null>(null)

  const ewaUnits = getUnitsByQualification("EWA")
  const nvqUnits = getUnitsByQualification("NVQ")

  const ewaStats = getQualificationStats("EWA")
  const nvqStats = getQualificationStats("NVQ")

  const qualificationsProgress = [
    {
      name: "EWA Qualification",
      completedUnits: ewaStats.completedUnits,
      totalUnits: ewaStats.totalUnits,
      progress: ewaStats.progressPercentage,
    },
    {
      name: "NVQ Qualification",
      completedUnits: nvqStats.completedUnits,
      totalUnits: nvqStats.totalUnits,
      progress: nvqStats.progressPercentage,
    },
  ]

  useEffect(() => {
    const fetchEvidence = async () => {
      setIsLoadingEvidence(true)
      setEvidenceError(null)
      try {
        // In a real app, pass the actual candidate ID
        const fetchedEvidence = await PortfolioCompilationService.getCandidateEvidence("mock-candidate-id")
        setEvidence(fetchedEvidence)
      } catch (err: any) {
        setEvidenceError(err.message || "Failed to load evidence.")
      } finally {
        setIsLoadingEvidence(false)
      }
    }

    fetchEvidence()
  }, [])

  const handleCompilePortfolio = async (qualificationId: string) => {
    setIsCompiling(true)
    try {
      const unitsForCompilation = qualificationId === "EWA" ? ewaUnits : nvqUnits
      const message = await PortfolioCompilationService.compilePortfolio(qualificationId, unitsForCompilation, evidence)
      toast({
        title: "Portfolio Compiled",
        description: message,
        variant: "default",
      })
    } catch (error: any) {
      toast({
        title: "Compilation Failed",
        description: error.message || "There was an error compiling the portfolio.",
        variant: "destructive",
      })
    } finally {
      setIsCompiling(false)
    }
  }

  const handleViewEvidenceDetails = (evidenceId: string) => {
    // In a real application, this would navigate to a detailed evidence view page
    toast({
      title: "View Evidence",
      description: `Navigating to details for evidence ID: ${evidenceId}`,
    })
    console.log(`Viewing details for evidence ID: ${evidenceId}`)
  }

  const pendingEvidence = evidence.filter((item) => item.status === "Pending")

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">My Portfolio</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <ProgressView qualifications={qualificationsProgress} />

          <Separator />

          {isLoadingEvidence ? (
            <p className="text-center text-gray-500">Loading evidence...</p>
          ) : evidenceError ? (
            <p className="text-center text-red-500">Error loading evidence: {evidenceError}</p>
          ) : (
            <PendingEvidenceView evidence={pendingEvidence} onViewDetails={handleViewEvidenceDetails} />
          )}

          <Separator />

          <div className="space-y-4">
            <h3 className="text-xl font-bold">Compile Portfolio</h3>
            <p className="text-gray-600">Generate a comprehensive report of your completed units and evidence.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button onClick={() => handleCompilePortfolio("EWA")} disabled={isCompiling}>
                {isCompiling ? "Compiling EWA..." : "Compile EWA Portfolio"}
              </Button>
              <Button onClick={() => handleCompilePortfolio("NVQ")} disabled={isCompiling}>
                {isCompiling ? "Compiling NVQ..." : "Compile NVQ Portfolio"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
