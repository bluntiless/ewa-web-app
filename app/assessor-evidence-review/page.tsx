"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { AssessmentStatus, type EvidenceMetadata } from "../../services/SharePointService"
import BottomNavigation from "../../components/BottomNavigation"
import { useMsalAuth } from "../../hooks/useMsalAuth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, FileText, ExternalLink, CheckCircle, XCircle, Clock, Save } from 'lucide-react'
import React from 'react';

export default function AssessorEvidenceReview() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { account, loading, error: msalError } = useMsalAuth()

  const [evidence, setEvidence] = useState<EvidenceMetadata | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<AssessmentStatus>(AssessmentStatus.Pending)
  const [feedback, setFeedback] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  const evidenceId = searchParams.get("evidenceId")
  const candidateName = searchParams.get("candidateName")
  const unitCode = searchParams.get("unitCode")
  const criteriaCode = searchParams.get("criteriaCode")

  useEffect(() => {
    if (account && evidenceId) {
      loadEvidence()
    }
  }, [account, evidenceId])

  const loadEvidence = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // For demo purposes, create mock evidence data
      const mockEvidence: EvidenceMetadata = {
        id: evidenceId || "mock-evidence-1",
        name: "NETP3-01 Evidence Portfolio.pdf",
        webUrl: "https://wrightspark625.sharepoint.com/sites/candidate/evidence/file.pdf",
        downloadUrl: "https://wrightspark625.sharepoint.com/sites/candidate/evidence/file.pdf",
        createdDateTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        lastModifiedDateTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        size: 2048576, // 2MB
        mimeType: "application/pdf",
        description: "Health and Safety evidence portfolio for NETP3-01 unit",
        unitCode: unitCode || "NETP3-01",
        criteriaCode: criteriaCode || "1.1",
        assessmentStatus: AssessmentStatus.Pending,
        assessorFeedback: "",
      }

      setEvidence(mockEvidence)
      setStatus(mockEvidence.assessmentStatus || AssessmentStatus.Pending)
      setFeedback(mockEvidence.assessorFeedback || "")
    } catch (err) {
      console.error("Failed to load evidence:", err)
      setError(err instanceof Error ? err.message : "Failed to load evidence")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    if (!evidence || !evidence.webUrl) return

    try {
      setIsSaving(true)
      setError(null)

      // In a real implementation, this would save to SharePoint
      console.log("Saving assessment:", {
        evidenceId: evidence.id,
        status,
        feedback,
        assessorName: account?.name || "Assessor",
      })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Show success and go back
      router.push("/assessor-review")
    } catch (err) {
      console.error("Failed to save assessment:", err)
      setError(err instanceof Error ? err.message : "Failed to save assessment")
    } finally {
      setIsSaving(false)
    }
  }

  const handleApprove = () => {
    setStatus(AssessmentStatus.Approved)
  }

  const handleReject = () => {
    setStatus(AssessmentStatus.Rejected)
  }

  const handleNeedsRevision = () => {
    setStatus(AssessmentStatus.Pending)
  }

  if (loading)
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg">Loading evidence...</p>
        </div>
      </div>
    )

  if (msalError)
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
        <div className="text-center max-w-lg mx-auto px-4">
          <div className="text-red-500 text-xl mb-4">Authentication Error</div>
          <p className="text-gray-400">{String(msalError)}</p>
        </div>
      </div>
    )

  if (!account)
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg">Signing in...</p>
        </div>
      </div>
    )

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="max-w-4xl mx-auto px-4 py-8 pb-24">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="text-blue-400 hover:text-blue-300 hover:bg-neutral-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        <h1 className="text-3xl font-bold mb-8">Evidence Review</h1>

        {isLoading ? (
          <div className="text-center py-8 text-gray-500">Loading evidence...</div>
        ) : error ? (
          <Card className="bg-red-900 border-red-800 mb-6">
            <CardContent className="p-4">
              <p className="text-white">{error}</p>
            </CardContent>
          </Card>
        ) : !evidence ? (
          <div className="text-center py-8 text-gray-500">Evidence not found.</div>
        ) : (
          <div className="space-y-6">
            {/* Evidence Details */}
            <Card className="bg-neutral-900 border-neutral-800">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Evidence Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Candidate</label>
                    <p className="text-white">{candidateName || "Unknown"}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Unit</label>
                    <p className="text-white">{unitCode || evidence.unitCode || "Unknown"}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Criteria</label>
                    <p className="text-white">{criteriaCode || evidence.criteriaCode || "Unknown"}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Uploaded</label>
                    <p className="text-white">
                      {evidence.createdDateTime ? new Date(evidence.createdDateTime).toLocaleString() : "Unknown"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Evidence Preview */}
            <Card className="bg-neutral-900 border-neutral-800">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Evidence File
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium">{evidence.name}</h3>
                    {evidence.description && <p className="text-gray-400 mt-1">{evidence.description}</p>}
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <span>Size: {Math.round((evidence.size || 0) / 1024)} KB</span>
                      <span>Type: {evidence.mimeType || "Unknown"}</span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="border-neutral-700 text-neutral-300 hover:bg-neutral-800 bg-transparent"
                    onClick={() => window.open(evidence.downloadUrl || evidence.webUrl, "_blank")}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View File
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Assessment */}
            <Card className="bg-neutral-900 border-neutral-800">
              <CardHeader>
                <CardTitle>Assessment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Status Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Assessment Status</label>
                  <div className="flex space-x-4">
                    <Button
                      variant={status === AssessmentStatus.Approved ? "default" : "outline"}
                      onClick={handleApprove}
                      className={
                        status === AssessmentStatus.Approved
                          ? "bg-green-600 hover:bg-green-700"
                          : "border-neutral-700 text-neutral-300 hover:bg-neutral-800"
                      }
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      variant={status === AssessmentStatus.Rejected ? "default" : "outline"}
                      onClick={handleReject}
                      className={
                        status === AssessmentStatus.Rejected
                          ? "bg-red-600 hover:bg-red-700"
                          : "border-neutral-700 text-neutral-300 hover:bg-neutral-800"
                      }
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                    <Button
                      variant={status === AssessmentStatus.Pending ? "default" : "outline"}
                      onClick={handleNeedsRevision}
                      className={
                        status === AssessmentStatus.Pending
                          ? "bg-yellow-600 hover:bg-yellow-700"
                          : "border-neutral-700 text-neutral-300 hover:bg-neutral-800"
                      }
                    >
                      <Clock className="w-4 h-4 mr-2" />
                      Needs Revision
                    </Button>
                  </div>
                </div>

                {/* Feedback */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Feedback</label>
                  <Textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    rows={4}
                    className="bg-neutral-800 border-neutral-700 text-white placeholder-gray-400"
                    placeholder="Provide feedback for the candidate..."
                  />
                </div>

                {/* Save Button */}
                <div className="flex justify-end space-x-4">
                  <Button
                    variant="outline"
                    onClick={() => router.back()}
                    className="border-neutral-700 text-neutral-300 hover:bg-neutral-800"
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700">
                    <Save className="w-4 h-4 mr-2" />
                    {isSaving ? "Saving..." : "Save Assessment"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  )
}
