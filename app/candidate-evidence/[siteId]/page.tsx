"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useState, useEffect, useMemo } from "react"
import { useParams } from "next/navigation"
import { PortfolioCompilationService } from "@/services/PortfolioCompilationService"
import { Evidence, EvidenceMetadata } from "@/models/Evidence"
import { useToast } from "@/hooks/use-toast"
import { allUnits, getUnitsByQualification } from "@/data/units"
import { Unit, LearningOutcome, PerformanceCriterion } from "@/models/Unit"
import { Loader2, FileText, Image, File } from 'lucide-react'

export default function CandidateEvidencePage() {
  const { siteId } = useParams()
  const { toast } = useToast()

  const [evidenceList, setEvidenceList] = useState<Evidence[]>([])
  const [isLoadingList, setIsLoadingList] = useState(true)
  const [listError, setListError] = useState<string | null>(null)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const [newEvidenceTitle, setNewEvidenceTitle] = useState("")
  const [newEvidenceDescription, setNewEvidenceDescription] = useState("")
  const [selectedQualification, setSelectedQualification] = useState<"EWA" | "NVQ" | "">("")
  const [selectedUnitId, setSelectedUnitId] = useState("")
  const [selectedLearningOutcomeId, setSelectedLearningOutcomeId] = useState("")
  const [selectedPerformanceCriterionId, setSelectedPerformanceCriterionId] = useState("")
  const [file, setFile] = useState<File | null>(null)

  const availableUnits = useMemo(() => {
    return selectedQualification ? getUnitsByQualification(selectedQualification) : []
  }, [selectedQualification])

  const availableLearningOutcomes = useMemo(() => {
    const unit = availableUnits.find((u) => u.id === selectedUnitId)
    return unit ? unit.learningOutcomes : []
  }, [selectedUnitId, availableUnits])

  const availablePerformanceCriteria = useMemo(() => {
    const lo = availableLearningOutcomes.find((l) => l.id === selectedLearningOutcomeId)
    return lo ? lo.performanceCriteria : []
  }, [selectedLearningOutcomeId, availableLearningOutcomes])

  useEffect(() => {
    const fetchEvidence = async () => {
      setIsLoadingList(true)
      setListError(null)
      try {
        // In a real app, siteId would be used to filter evidence or fetch from a specific source
        const fetchedEvidence = await PortfolioCompilationService.getCandidateEvidence(siteId as string)
        setEvidenceList(fetchedEvidence)
      } catch (err: any) {
        setListError(err.message || "Failed to load evidence list.")
      } finally {
        setIsLoadingList(false)
      }
    }

    if (siteId) {
      fetchEvidence()
    }
  }, [siteId])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
    } else {
      setFile(null)
    }
  }

  const handleSubmitEvidence = async () => {
    setSubmitError(null)
    if (
      !newEvidenceTitle ||
      !newEvidenceDescription ||
      !selectedQualification ||
      !selectedUnitId ||
      !selectedLearningOutcomeId ||
      !selectedPerformanceCriterionId ||
      !file
    ) {
      setSubmitError("Please fill in all fields and select a file.")
      return
    }

    setIsSubmitting(true)
    try {
      const newEvidence: Omit<Evidence, "id" | "status" | "uploadDate"> = {
        title: newEvidenceTitle,
        description: newEvidenceDescription,
        uploadedBy: "Current User (Mock)", // Replace with actual user
        unitId: selectedUnitId,
        criterionId: selectedPerformanceCriterionId,
        fileUrl: `/mock-uploads/${file.name}`, // Mock URL for demonstration
      }
      await PortfolioCompilationService.submitEvidence(newEvidence)
      toast({
        title: "Evidence Submitted",
        description: "Your evidence has been successfully uploaded for review.",
        variant: "default",
      })
      // Clear form
      setNewEvidenceTitle("")
      setNewEvidenceDescription("")
      setSelectedQualification("")
      setSelectedUnitId("")
      setSelectedLearningOutcomeId("")
      setSelectedPerformanceCriterionId("")
      setFile(null)
      // Refresh evidence list
      const fetchedEvidence = await PortfolioCompilationService.getCandidateEvidence(siteId as string)
      setEvidenceList(fetchedEvidence)
    } catch (err: any) {
      setSubmitError(err.message || "Failed to submit evidence.")
      toast({
        title: "Submission Failed",
        description: err.message || "There was an error submitting your evidence.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.includes("image")) return <Image className="h-5 w-5 text-blue-500" />
    if (fileType.includes("pdf")) return <FileText className="h-5 w-5 text-red-500" />
    return <File className="h-5 w-5 text-gray-500" />
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Candidate Evidence for Site: {siteId}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Upload New Evidence</h3>
            <Label htmlFor="evidence-title">Evidence Title</Label>
            <Input
              id="evidence-title"
              type="text"
              placeholder="e.g., Project X Completion Report"
              value={newEvidenceTitle}
              onChange={(e) => setNewEvidenceTitle(e.target.value)}
            />

            <Label htmlFor="evidence-description">Description</Label>
            <Textarea
              id="evidence-description"
              placeholder="Provide a brief description of your evidence and how it meets the criteria."
              value={newEvidenceDescription}
              onChange={(e) => setNewEvidenceDescription(e.target.value)}
              rows={4}
            />

            <Label htmlFor="qualification-select">Qualification</Label>
            <Select value={selectedQualification} onValueChange={(value: "EWA" | "NVQ") => {
              setSelectedQualification(value)
              setSelectedUnitId("")
              setSelectedLearningOutcomeId("")
              setSelectedPerformanceCriterionId("")
            }}>
              <SelectTrigger id="qualification-select">
                <SelectValue placeholder="Select Qualification" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EWA">EWA Qualification</SelectItem>
                <SelectItem value="NVQ">NVQ Qualification</SelectItem>
              </SelectContent>
            </Select>

            {selectedQualification && (
              <>
                <Label htmlFor="unit-select">Unit</Label>
                <Select value={selectedUnitId} onValueChange={(value) => {
                  setSelectedUnitId(value)
                  setSelectedLearningOutcomeId("")
                  setSelectedPerformanceCriterionId("")
                }}>
                  <SelectTrigger id="unit-select">
                    <SelectValue placeholder="Select Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableUnits.map((unit) => (
                      <SelectItem key={unit.id} value={unit.id}>
                        {unit.id}: {unit.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </>
            )}

            {selectedUnitId && (
              <>
                <Label htmlFor="lo-select">Learning Outcome</Label>
                <Select value={selectedLearningOutcomeId} onValueChange={(value) => {
                  setSelectedLearningOutcomeId(value)
                  setSelectedPerformanceCriterionId("")
                }}>
                  <SelectTrigger id="lo-select">
                    <SelectValue placeholder="Select Learning Outcome" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableLearningOutcomes.map((lo) => (
                      <SelectItem key={lo.id} value={lo.id}>
                        {lo.id}: {lo.description}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </>
            )}

            {selectedLearningOutcomeId && (
              <>
                <Label htmlFor="pc-select">Performance Criterion</Label>
                <Select value={selectedPerformanceCriterionId} onValueChange={setSelectedPerformanceCriterionId}>
                  <SelectTrigger id="pc-select">
                    <SelectValue placeholder="Select Performance Criterion" />
                  </SelectTrigger>
                  <SelectContent>
                    {availablePerformanceCriteria.map((pc) => (
                      <SelectItem key={pc.id} value={pc.id}>
                        {pc.id}: {pc.description}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </>
            )}

            <Label htmlFor="file-upload">Attach File</Label>
            <Input id="file-upload" type="file" onChange={handleFileChange} />

            {submitError && <p className="text-red-500 text-sm">{submitError}</p>}

            <Button onClick={handleSubmitEvidence} className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
                </>
              ) : (
                "Submit Evidence"
              )}
            </Button>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">My Submitted Evidence</h3>
            {isLoadingList ? (
              <div className="flex justify-center items-center">
                <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                <p className="ml-2 text-gray-600">Loading submitted evidence...</p>
              </div>
            ) : listError ? (
              <p className="text-red-500 text-center">{listError}</p>
            ) : evidenceList.length === 0 ? (
              <p className="text-center text-gray-500">No evidence submitted yet.</p>
            ) : (
              <div className="grid gap-4">
                {evidenceList.map((item) => (
                  <Card key={item.id} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{item.title}</h4>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.status === "Approved"
                            ? "bg-green-100 text-green-800"
                            : item.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{item.description}</p>
                    <p className="text-xs text-gray-500">
                      Unit: {item.unitId} | Criterion: {item.criterionId}
                    </p>
                    <p className="text-xs text-gray-500">
                      Uploaded by {item.uploadedBy} on {item.uploadDate}
                    </p>
                    {item.fileUrl && (
                      <Button variant="link" className="p-0 h-auto mt-2 flex items-center space-x-1">
                        {getFileIcon(item.fileUrl.split(".").pop() || "")}
                        <a href={item.fileUrl} target="_blank" rel="noopener noreferrer">
                          View File
                        </a>
                      </Button>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
