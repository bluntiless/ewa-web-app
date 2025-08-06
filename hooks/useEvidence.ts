import { useState, useEffect, useCallback } from "react"
import { SharePointService, Evidence, EvidenceMetadata, AssessmentStatus } from "@/services/SharePointService"

export interface UseEvidenceReturn {
  evidence: Evidence[]
  loading: boolean
  error: string | null
  uploadEvidence: (file: File, folderPath: string, fileName: string) => Promise<void>
  deleteEvidence: (fileUrl: string) => Promise<void>
  refreshEvidence: () => Promise<void>
  updateEvidenceMetadata: (fileUrl: string, metadata: Partial<EvidenceMetadata>) => Promise<void>
}

export function useEvidence(): UseEvidenceReturn {
  const [evidence, setEvidence] = useState<Evidence[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const sharePointService = SharePointService.getInstance()

  const fetchEvidence = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const fetchedEvidence = await sharePointService.getEvidence()
      setEvidence(fetchedEvidence)
    } catch (err: any) {
      console.error("Failed to fetch evidence:", err)
      setError(err.message || "Failed to load evidence.")
    } finally {
      setLoading(false)
    }
  }, [sharePointService])

  useEffect(() => {
    fetchEvidence()
  }, [fetchEvidence])

  const uploadEvidence = useCallback(
    async (file: File, folderPath: string, fileName: string) => {
      setLoading(true)
      setError(null)
      try {
        // SharePointService.uploadEvidence handles both direct and session uploads
        await sharePointService.uploadEvidence(file, folderPath, fileName)
        await fetchEvidence() // Refresh list after upload
      } catch (err: any) {
        console.error("Failed to upload evidence:", err)
        setError(err.message || "Failed to upload evidence.")
      } finally {
        setLoading(false)
      }
    },
    [sharePointService, fetchEvidence],
  )

  const deleteEvidence = useCallback(
    async (fileUrl: string) => {
      setLoading(true)
      setError(null)
      try {
        await sharePointService.deleteFile(fileUrl)
        await fetchEvidence() // Refresh list after delete
      } catch (err: any) {
        console.error("Failed to delete evidence:", err)
        setError(err.message || "Failed to delete evidence.")
      } finally {
        setLoading(false)
      }
    },
    [sharePointService, fetchEvidence],
  )

  const updateEvidenceMetadata = useCallback(
    async (fileUrl: string, metadata: Partial<EvidenceMetadata>) => {
      setLoading(true)
      setError(null)
      try {
        // This would typically involve a specific SharePoint API call to update list item fields
        // For now, we'll simulate it and then refresh
        console.log(`Updating metadata for ${fileUrl}:`, metadata)
        // In a real scenario, you'd call a SharePointService method like:
        // await sharePointService.updateFileMetadata(fileUrl, metadata);
        await fetchEvidence() // Refresh to reflect changes
      } catch (err: any) {
        console.error("Failed to update evidence metadata:", err)
        setError(err.message || "Failed to update evidence metadata.")
      } finally {
        setLoading(false)
      }
    },
    [fetchEvidence],
  )

  return {
    evidence,
    loading,
    error,
    uploadEvidence,
    deleteEvidence,
    refreshEvidence: fetchEvidence,
    updateEvidenceMetadata,
  }
}
