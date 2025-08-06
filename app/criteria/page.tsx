"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Upload, CheckCircle, Clock, AlertCircle } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Unit, LearningOutcome, PerformanceCriteria } from "../../models/Unit"
import { ewaUnits } from "../../data/ewaUnits"
import { allNVQ1605Units } from "../../data/ealUnits"
import { rplUnits } from "../../data/units"
import BottomNavigation from "../../components/BottomNavigation"
import { useMsalAuth } from "../../hooks/useMsalAuth"
import { SharePointService } from "../../services/SharePointService"

export default function CriteriaPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const unitCode = searchParams.get("unit")
  const type = searchParams.get("type") || "ewa"

  const { account, login, isAuthenticating } = useMsalAuth()

  const [unit, setUnit] = useState<Unit | null>(null)
  const [loading, setLoading] = useState(true)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [selectedCriteria, setSelectedCriteria] = useState<PerformanceCriteria | null>(null)
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [uploadDescription, setUploadDescription] = useState("")
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (!unitCode || !type) {
      router.push("/")
      return
    }

    let allUnits: Unit[] = []

    switch (type) {
      case "ewa":
        allUnits = ewaUnits
        break
      case "nvq":
        allUnits = allNVQ1605Units
        break
      case "rpl":
        allUnits = rplUnits
        break
      default:
        router.push("/")
        return
    }

    const foundUnit = allUnits.find(
      (u) => u.code === unitCode || u.displayCode === unitCode || u.reference === unitCode,
    )

    if (!foundUnit) {
      router.push(`/units?type=${type}`)
      return
    }

    setUnit(foundUnit)
    setLoading(false)
  }, [unitCode, type, router])

  const handleUploadEvidence = (criteria: PerformanceCriteria) => {
    if (!account) {
      login()
      return
    }
    setSelectedCriteria(criteria)
    setUploadDialogOpen(true)
  }

  const handleFileUpload = async () => {
    if (!uploadFile || !selectedCriteria || !account || !unit) return

    setUploading(true)
    try {
      const spService = SharePointService.getInstance()

      // Create folder path for evidence
      const folderPath = `Evidence/${unit.code.replace(/\./g, "_")}/${selectedCriteria.code.replace(/\./g, "_")}`

      // Upload file to SharePoint
      await spService.uploadEvidence(uploadFile, folderPath, uploadFile.name)

      // Update criteria status (in real app, this would update the database)
      if (selectedCriteria) {
        selectedCriteria.status = "pending"
      }

      setUploadDialogOpen(false)
      setUploadFile(null)
      setUploadDescription("")
      setSelectedCriteria(null)
    } catch (error) {
      console.error("Upload failed:", error)
      alert("Upload failed. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "not-started":
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "not-started":
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-safe">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading criteria...</div>
        </div>
        <BottomNavigation />
      </div>
    )
  }

  if (!unit) {
    return (
      <div className="min-h-screen bg-gray-50 pb-safe">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-red-600">Unit not found</p>
            <Button onClick={() => router.back()} className="mt-4">
              Go Back
            </Button>
          </div>
        </div>
        <BottomNavigation />
      </div>
    )
  }

  // Safely calculate progress
  const totalCriteria =
    unit.learningOutcomes?.reduce((total, lo) => {
      return total + (lo.performanceCriteria?.length || 0)
    }, 0) || 0

  const completedCriteria =
    unit.learningOutcomes?.reduce((total, lo) => {
      return total + (lo.performanceCriteria?.filter((pc) => pc.status === "approved").length || 0)
    }, 0) || 0

  const progress = totalCriteria > 0 ? Math.round((completedCriteria / totalCriteria) * 100) : 0

  return (
    <div className="min-h-screen bg-gray-50 pb-safe">
      <div className="container mx-auto px-4 py-8 pb-24">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline">{unit.displayCode || unit.code}</Badge>
            <Badge variant="secondary">{type.toUpperCase()}</Badge>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{unit.title}</h1>

          {/* Progress Summary */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{totalCriteria}</div>
                  <div className="text-sm text-gray-600">Total Criteria</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{completedCriteria}</div>
                  <div className="text-sm text-gray-600">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{totalCriteria - completedCriteria}</div>
                  <div className="text-sm text-gray-600">Remaining</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{progress}%</div>
                  <div className="text-sm text-gray-600">Progress</div>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>Unit Progress</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Learning Outcomes */}
        <div className="space-y-6">
          {unit.learningOutcomes && unit.learningOutcomes.length > 0 ? (
            unit.learningOutcomes.map((learningOutcome: LearningOutcome, index: number) => (
              <Card key={learningOutcome.number || index}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Learning Outcome {learningOutcome.number}: {learningOutcome.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {learningOutcome.performanceCriteria && learningOutcome.performanceCriteria.length > 0 ? (
                      learningOutcome.performanceCriteria.map(
                        (criteria: PerformanceCriteria, criteriaIndex: number) => (
                          <div
                            key={criteria.code || criteriaIndex}
                            className="flex items-center justify-between p-4 border rounded-lg"
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                {getStatusIcon(criteria.status)}
                                <span className="font-medium">{criteria.code}</span>
                                <Badge className={getStatusColor(criteria.status)}>
                                  {criteria.status || "not-started"}
                                </Badge>
                              </div>
                              <p className="text-gray-700">{criteria.description}</p>
                            </div>
                            <div className="ml-4">
                              <Button
                                size="sm"
                                variant={criteria.status === "approved" ? "outline" : "default"}
                                onClick={() => handleUploadEvidence(criteria)}
                                disabled={isAuthenticating}
                              >
                                <Upload className="h-4 w-4 mr-2" />
                                {criteria.status === "approved" ? "Update" : "Upload"} Evidence
                              </Button>
                            </div>
                          </div>
                        ),
                      )
                    ) : (
                      <div className="text-center text-gray-500 py-4">
                        No performance criteria available for this learning outcome.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Learning Outcomes Available</h3>
                <p className="text-gray-600">Learning outcomes for this unit are not yet available.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Upload Evidence Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Evidence</DialogTitle>
            <DialogDescription>Upload evidence for criteria: {selectedCriteria?.code}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="file">Select File</Label>
              <Input
                id="file"
                type="file"
                onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe how this evidence meets the criteria..."
                value={uploadDescription}
                onChange={(e) => setUploadDescription(e.target.value)}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleFileUpload} disabled={!uploadFile || uploading}>
                {uploading ? "Uploading..." : "Upload"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <BottomNavigation />
    </div>
  )
}
