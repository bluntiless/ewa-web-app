"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { useState, useEffect } from "react"
import { Evidence } from "@/models/Evidence"
import { PortfolioCompilationService } from "@/services/PortfolioCompilationService"
import { useToast } from "@/hooks/use-toast"

export default function AssessorEvidenceReviewPage() {
  const { toast } = useToast()
  const [evidenceToReview, setEvidenceToReview] = useState<Evidence | null>(null)
  const [feedback, setFeedback] = useState("")
  const [isApproved, setIsApproved] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Mock evidence ID for demonstration. In a real app, this would come from URL params or state.
  const mockEvidenceId = "ev2" // Example: a pending evidence item

  useEffect(() => {
    const fetchEvidence = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const allEvidence = await PortfolioCompilationService.getCandidateEvidence("mock-candidate-id")
        const foundEvidence = allEvidence.find((e) => e.id === mockEvidenceId)
        if (foundEvidence) {
          setEvidenceToReview(foundEvidence)
          setFeedback("") // Clear feedback for new review
          setIsApproved(foundEvidence.status === "Approved") // Set initial approval based on status
        } else {
          setError("Evidence not found.")
        }
      } catch (err: any) {
        setError(err.message || "Failed to load evidence for review.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchEvidence()
  }, [mockEvidenceId])

  const handleSubmitReview = async () => {
    if (!evidenceToReview) return

    setIsLoading(true)
    setError(null)

    const newStatus = isApproved ? "Approved" : "Rejected"
    const updatedEvidence: Evidence = {
      ...evidenceToReview,
      status: newStatus,
      // In a real app, you might add assessor ID and date of review
    }

    try {
      await PortfolioCompilationService.updateEvidence(updatedEvidence)
      toast({
        title: "Review Submitted",
        description: `Evidence "${evidenceToReview.title}" has been ${newStatus}.`,
        variant: "default",
      })
      // Optionally, refresh the evidence list or navigate away
      setEvidenceToReview(updatedEvidence) // Update local state to reflect change
    } catch (err: any) {
      setError(err.message || "Failed to submit review.")
      toast({
        title: "Submission Failed",
        description: err.message || "There was an error submitting the review.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p>Loading evidence for review...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p className="text-red-500">Error: {error}</p>
      </div>
    )
  }

  if (!evidenceToReview) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p>No evidence selected for review or evidence not found.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Review Evidence: {evidenceToReview.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Evidence Details</h3>
            <p>
              <strong>Unit:</strong> {evidenceToReview.unitId}
            </p>
            <p>
              <strong>Criterion:</strong> {evidenceToReview.criterionId}
            </p>
            <p>
              <strong>Description:</strong> {evidenceToReview.description}
            </p>
            <p>
              <strong>Uploaded By:</strong> {evidenceToReview.uploadedBy} on {evidenceToReview.uploadDate}
            </p>
            <p>
              <strong>Current Status:</strong>{" "}
              <Badge variant={evidenceToReview.status === "Approved" ? "default" : "secondary"}>
                {evidenceToReview.status}
              </Badge>
            </p>
            {evidenceToReview.fileUrl && (
              <Button variant="link" className="p-0 h-auto mt-2">
                <a href={evidenceToReview.fileUrl} target="_blank" rel="noopener noreferrer">
                  View Attached File
                </a>
              </Button>
            )}
          </div>

          <Separator />

          <div className="grid gap-4">
            <Label htmlFor="feedback">Assessor Feedback</Label>
            <Textarea
              id="feedback"
              placeholder="Provide constructive feedback for the candidate..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={5}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="approve"
              checked={isApproved}
              onCheckedChange={(checked) => setIsApproved(checked as boolean)}
            />
            <Label htmlFor="approve">Approve Evidence</Label>
          </div>

          <Separator />

          <Button type="submit" className="w-full" onClick={handleSubmitReview} disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit Review"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
