import { useState, useEffect, useCallback } from "react"
import { Evidence } from "@/models/Evidence"
import { PortfolioCompilationService } from "@/services/PortfolioCompilationService"
import { useToast } from "@/hooks/use-toast"

interface UseEvidenceReturn {
  evidence: Evidence[]
  isLoading: boolean
  error: string | null
  addEvidence: (newEvidence: Omit<Evidence, "id" | "status" | "uploadDate">) => Promise<void>
  updateEvidence: (updatedEvidence: Evidence) => Promise<void>
  deleteEvidence: (evidenceId: string) => Promise<void>
  refreshEvidence: () => Promise<void>
}

export function useEvidence(candidateId: string): UseEvidenceReturn {
  const [evidence, setEvidence] = useState<Evidence[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchEvidence = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const fetchedEvidence = await PortfolioCompilationService.getCandidateEvidence(candidateId)
      setEvidence(fetchedEvidence)
    } catch (err: any) {
      setError(err.message || "Failed to load evidence.")
      toast({
        title: "Error",
        description: err.message || "Failed to load evidence.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [candidateId, toast])

  useEffect(() => {
    fetchEvidence()
  }, [fetchEvidence])

  const addEvidence = useCallback(
    async (newEvidence: Omit<Evidence, "id" | "status" | "uploadDate">) => {
      setIsLoading(true)
      setError(null)
      try {
        const added = await PortfolioCompilationService.submitEvidence(newEvidence)
        setEvidence((prev) => [...prev, added])
        toast({
          title: "Evidence Added",
          description: `"${added.title}" submitted successfully.`,
          variant: "default",
        })
      } catch (err: any) {
        setError(err.message || "Failed to add evidence.")
        toast({
          title: "Error",
          description: err.message || "Failed to add evidence.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    },
    [toast],
  )

  const updateEvidence = useCallback(
    async (updatedEvidence: Evidence) => {
      setIsLoading(true)
      setError(null)
      try {
        const updated = await PortfolioCompilationService.updateEvidence(updatedEvidence)
        setEvidence((prev) => prev.map((e) => (e.id === updated.id ? updated : e)))
        toast({
          title: "Evidence Updated",
          description: `"${updated.title}" updated successfully.`,
          variant: "default",
        })
      } catch (err: any) {
        setError(err.message || "Failed to update evidence.")
        toast({
          title: "Error",
          description: err.message || "Failed to update evidence.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    },
    [toast],
  )

  const deleteEvidence = useCallback(
    async (evidenceId: string) => {
      setIsLoading(true)
      setError(null)
      try {
        await PortfolioCompilationService.deleteEvidence(evidenceId)
        setEvidence((prev) => prev.filter((e) => e.id !== evidenceId))
        toast({
          title: "Evidence Deleted",
          description: "Evidence removed successfully.",
          variant: "default",
        })
      } catch (err: any) {
        setError(err.message || "Failed to delete evidence.")
        toast({
          title: "Error",
          description: err.message || "Failed to delete evidence.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    },
    [toast],
  )

  return {
    evidence,
    isLoading,
    error,
    addEvidence,
    updateEvidence,
    deleteEvidence,
    refreshEvidence: fetchEvidence,
  }
}
