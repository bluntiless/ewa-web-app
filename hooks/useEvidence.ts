"use client"

import { useState, useEffect } from "react"
import { SharePointService } from "../services/SharePointService"
import type { EvidenceMetadata } from "../services/SharePointService"

interface UseEvidenceProps {
  unitCode?: string
  criteriaCode?: string
}

export function useEvidence({ unitCode, criteriaCode }: UseEvidenceProps = {}) {
  const [evidence, setEvidence] = useState<EvidenceMetadata[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadEvidence = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const spService = SharePointService.getInstance()
        await spService.authenticate()

        // Get evidence for specific unit/criteria or all evidence
        const evidenceData = await spService.getEvidenceForCriteria(unitCode || "ALL", criteriaCode || "ALL")

        setEvidence(evidenceData)
      } catch (err) {
        console.error("Failed to load evidence:", err)
        setError(err instanceof Error ? err.message : "Failed to load evidence")
      } finally {
        setIsLoading(false)
      }
    }

    loadEvidence()
  }, [unitCode, criteriaCode])

  return { evidence, isLoading, error }
}
