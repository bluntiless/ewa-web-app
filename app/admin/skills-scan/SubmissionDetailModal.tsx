"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  X,
  Download,
  Upload,
  FileText,
  CheckCircle,
  Clock,
  User,
  Mail,
  Phone,
  Briefcase,
  RefreshCw,
} from "lucide-react"
import type { SkillsScanSubmissionData, SubmissionStatus } from "@/lib/skills-scan-submission"
import { skillsScanSections } from "@/lib/skills-scan-data"

interface SubmissionDetailModalProps {
  submissionId: string
  onClose: () => void
  onUpdate: () => void
}

export default function SubmissionDetailModal({
  submissionId,
  onClose,
  onUpdate,
}: SubmissionDetailModalProps) {
  const [data, setData] = useState<SkillsScanSubmissionData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sharePointPath, setSharePointPath] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState<{ success: boolean; message: string } | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/admin/skills-scan/${submissionId}`)
        if (!response.ok) throw new Error("Failed to fetch")
        const result = await response.json()
        setData(result)
        setSharePointPath(result.metadata.sharePointPath || "")
      } catch (err) {
        setError("Failed to load submission details")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [submissionId])

  const updateStatus = async (status: SubmissionStatus) => {
    setIsUpdating(true)
    try {
      const response = await fetch(`/api/admin/skills-scan/${submissionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) throw new Error("Failed to update")

      const result = await response.json()
      setData((prev) => prev ? { ...prev, metadata: result.metadata } : null)
      onUpdate()
    } catch (err) {
      alert("Failed to update status")
      console.error(err)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDownloadJson = () => {
    if (!data) return

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `Skills Scan Response - ${data.metadata.candidateName} - ${data.metadata.submittedAt.split("T")[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleGeneratePdf = async () => {
    setIsGeneratingPdf(true)
    try {
      const response = await fetch(`/api/admin/skills-scan/${submissionId}/pdf`, {
        method: "POST",
      })

      if (!response.ok) throw new Error("Failed to generate PDF")

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `Skills Scan - ${data?.metadata.candidateName} - ${data?.metadata.submittedAt.split("T")[0]}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      alert("Failed to generate PDF")
      console.error(err)
    } finally {
      setIsGeneratingPdf(false)
    }
  }

  const handleUploadToSharePoint = async () => {
    if (!sharePointPath.trim()) {
      setUploadResult({ success: false, message: "Please enter a SharePoint folder path" })
      return
    }

    setIsUploading(true)
    setUploadResult(null)

    try {
      const response = await fetch(`/api/admin/skills-scan/${submissionId}/upload`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sharePointPath: sharePointPath.trim() }),
      })

      const result = await response.json()

      if (!response.ok) {
        setUploadResult({
          success: false,
          message: result.error || "Upload failed",
        })
      } else {
        setUploadResult({
          success: result.success,
          message: result.message,
        })
        if (result.success) {
          onUpdate()
        }
      }
    } catch (err) {
      setUploadResult({ success: false, message: "Failed to upload to SharePoint" })
      console.error(err)
    } finally {
      setIsUploading(false)
    }
  }

  const getRatingLabel = (rating: string) => {
    switch (rating) {
      case "limited":
        return "Limited"
      case "adequate":
        return "Adequate"
      case "extensive":
        return "Extensive"
      case "unsure":
        return "Unsure"
      default:
        return "Not rated"
    }
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-8">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-8 max-w-md">
          <p className="text-red-600 mb-4">{error || "Failed to load data"}</p>
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    )
  }

  const { metadata, formData } = data

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{metadata.candidateName}</h2>
            <p className="text-sm text-gray-500">Submission ID: {metadata.id}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Candidate Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                <User className="w-4 h-4" />
                Name
              </div>
              <p className="font-medium text-gray-900">{formData.fullName}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                <Mail className="w-4 h-4" />
                Email
              </div>
              <p className="font-medium text-gray-900 text-sm break-all">{formData.email}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                <Phone className="w-4 h-4" />
                Phone
              </div>
              <p className="font-medium text-gray-900">{formData.phone || "Not provided"}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                <Briefcase className="w-4 h-4" />
                Experience
              </div>
              <p className="font-medium text-gray-900">{formData.yearsExperience || "Not provided"}</p>
            </div>
          </div>

          {/* Preliminary Suitability Result */}
          {formData.suitabilityResult && (
            <div className={`rounded-lg p-4 mb-6 border ${
              formData.suitabilityResult.result === "likely-suitable"
                ? "bg-green-50 border-green-200"
                : formData.suitabilityResult.result === "may-need-development"
                ? "bg-amber-50 border-amber-200"
                : "bg-red-50 border-red-200"
            }`}>
              <h3 className="font-semibold text-gray-900 mb-2">Preliminary Suitability Indication</h3>
              <div className="flex flex-wrap items-center gap-4 mb-2">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  formData.suitabilityResult.result === "likely-suitable"
                    ? "bg-green-100 text-green-800"
                    : formData.suitabilityResult.result === "may-need-development"
                    ? "bg-amber-100 text-amber-800"
                    : "bg-red-100 text-red-800"
                }`}>
                  {formData.suitabilityResult.title}
                </span>
                <span className="text-sm text-gray-600">
                  Knowledge: {formData.suitabilityResult.knowledgeScore}% | 
                  Experience: {formData.suitabilityResult.experienceScore}%
                </span>
              </div>
              <p className="text-sm text-gray-700">{formData.suitabilityResult.summary}</p>
            </div>
          )}

          {/* Status Actions */}
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium text-blue-900">Update Status:</span>
              <Button
                size="sm"
                variant={metadata.status === "reviewed" ? "default" : "outline"}
                onClick={() => updateStatus("reviewed")}
                disabled={isUpdating}
              >
                Mark as Reviewed
              </Button>
              <Button
                size="sm"
                variant={metadata.status === "uploaded" ? "default" : "outline"}
                onClick={() => updateStatus("uploaded")}
                disabled={isUpdating}
                className="bg-green-600 hover:bg-green-700"
              >
                Mark as Uploaded
              </Button>
              <Button
                size="sm"
                variant={metadata.status === "failed" ? "default" : "outline"}
                onClick={() => updateStatus("failed")}
                disabled={isUpdating}
                className="bg-red-600 hover:bg-red-700"
              >
                Mark as Failed
              </Button>
            </div>
          </div>

          {/* Skills Summary */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills Assessment Summary</h3>
            <div className="space-y-4">
              {skillsScanSections.map((section) => {
                const sectionData = formData.skills[section.id]
                if (!sectionData) return null

                const ratedCount = Object.values(sectionData).filter(
                  (s) => s.knowledge || s.experience
                ).length

                return (
                  <details key={section.id} className="border border-gray-200 rounded-lg">
                    <summary className="px-4 py-3 cursor-pointer hover:bg-gray-50 flex items-center justify-between">
                      <span className="font-medium text-gray-900">{section.title}</span>
                      <span className="text-sm text-gray-500">
                        {ratedCount} / {section.items.length} items rated
                      </span>
                    </summary>
                    <div className="px-4 pb-4 border-t border-gray-100">
                      <table className="w-full text-sm mt-3">
                        <thead>
                          <tr className="text-left text-gray-500">
                            <th className="pb-2">Skill</th>
                            <th className="pb-2 text-center">Knowledge</th>
                            <th className="pb-2 text-center">Experience</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {section.items.map((item) => {
                            const skill = sectionData[item.id]
                            return (
                              <tr key={item.id}>
                                <td className="py-2 pr-4 text-gray-700">{item.text}</td>
                                <td className="py-2 text-center">
                                  <span
                                    className={`inline-block px-2 py-0.5 rounded text-xs ${
                                      skill?.knowledge === "extensive"
                                        ? "bg-green-100 text-green-800"
                                        : skill?.knowledge === "adequate"
                                          ? "bg-blue-100 text-blue-800"
                                          : skill?.knowledge === "limited"
                                            ? "bg-yellow-100 text-yellow-800"
                                            : "bg-gray-100 text-gray-600"
                                    }`}
                                  >
                                    {getRatingLabel(skill?.knowledge || "")}
                                  </span>
                                </td>
                                <td className="py-2 text-center">
                                  <span
                                    className={`inline-block px-2 py-0.5 rounded text-xs ${
                                      skill?.experience === "extensive"
                                        ? "bg-green-100 text-green-800"
                                        : skill?.experience === "adequate"
                                          ? "bg-blue-100 text-blue-800"
                                          : skill?.experience === "limited"
                                            ? "bg-yellow-100 text-yellow-800"
                                            : "bg-gray-100 text-gray-600"
                                    }`}
                                  >
                                    {getRatingLabel(skill?.experience || "")}
                                  </span>
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  </details>
                )
              })}
            </div>
          </div>

          {/* SharePoint Path */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              SharePoint Folder Path (for upload)
            </Label>
            <div className="flex gap-2">
              <Input
                value={sharePointPath}
                onChange={(e) => setSharePointPath(e.target.value)}
                placeholder="e.g., Candidates/John Smith"
                className="flex-1"
              />
              <Button
                variant="outline"
                onClick={handleUploadToSharePoint}
                disabled={isUploading || !sharePointPath.trim()}
              >
                <Upload className="w-4 h-4 mr-2" />
                {isUploading ? "Uploading..." : "Upload to SharePoint"}
              </Button>
            </div>
            {uploadResult && (
              <div
                className={`mt-3 p-3 rounded-lg flex items-center gap-2 text-sm ${
                  uploadResult.success
                    ? "bg-green-50 text-green-800 border border-green-200"
                    : "bg-red-50 text-red-800 border border-red-200"
                }`}
              >
                {uploadResult.success ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <Clock className="w-4 h-4" />
                )}
                {uploadResult.message}
              </div>
            )}
            <p className="text-xs text-gray-500 mt-2">
              Enter the relative path within your SharePoint document library where files should be uploaded.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
          <div className="text-sm text-gray-500">
            Submitted: {new Date(metadata.submittedAt).toLocaleString("en-GB")}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleDownloadJson}>
              <Download className="w-4 h-4 mr-2" />
              Download JSON
            </Button>
            <Button onClick={handleGeneratePdf} disabled={isGeneratingPdf}>
              <FileText className="w-4 h-4 mr-2" />
              {isGeneratingPdf ? "Generating..." : "Generate TESP PDF"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
