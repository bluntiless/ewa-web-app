"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, Download, CheckCircle, AlertCircle, FileText } from "lucide-react"
import Link from "next/link"

export default function SkillsScanUploadFilePage() {
  const [candidateName, setCandidateName] = useState("")
  const [email, setEmail] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadComplete, setDownloadComplete] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<"success" | "error" | null>(null)
  const [errorMessage, setErrorMessage] = useState("")

  const handleDownloadTemplate = async () => {
    setIsDownloading(true)
    try {
      const response = await fetch("/templates/ewa-skills-scan-template.pdf")
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "EWA-Skills-Scan-Installation-Electrician.pdf"
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      setDownloadComplete(true)
    } catch (error) {
      console.error("Download failed:", error)
      setErrorMessage("Failed to download template. Please try again.")
    } finally {
      setIsDownloading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.type === "application/pdf") {
        setSelectedFile(file)
        setUploadStatus(null)
        setErrorMessage("")
      } else {
        setErrorMessage("Please select a PDF file")
        setSelectedFile(null)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedFile || !candidateName || !email) {
      setErrorMessage("Please fill in all fields and select a PDF file")
      return
    }

    setIsUploading(true)
    setUploadStatus(null)
    setErrorMessage("")

    try {
      const formData = new FormData()
      formData.append("pdf", selectedFile)
      formData.append("candidateName", candidateName)
      formData.append("email", email)

      const response = await fetch("/api/skills-scan/upload-pdf", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Upload failed")
      }

      setUploadStatus("success")
      setSelectedFile(null)
      setCandidateName("")
      setEmail("")
    } catch (error) {
      setUploadStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "Failed to upload PDF")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Submit Your TESP Skills Scan
          </h1>
          <p className="text-gray-600">
            Download, complete, and upload your TESP Skills Scan PDF
          </p>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h2 className="font-semibold text-blue-900 mb-4">How to Complete Your Submission</h2>
          <ol className="space-y-4 text-blue-800">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">1</span>
              <div className="flex-1">
                <strong>Download the official TESP Skills Scan PDF</strong>
                <div className="mt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleDownloadTemplate}
                    disabled={isDownloading}
                    className="text-blue-600 border-blue-300 hover:bg-blue-50"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {isDownloading ? "Downloading..." : "Download TESP Skills Scan PDF"}
                  </Button>
                </div>
                {downloadComplete && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 text-green-700 font-medium">
                      <CheckCircle className="w-5 h-5" />
                      PDF Downloaded
                    </div>
                    <p className="text-green-600 text-sm mt-1">
                      Check your <strong>Downloads folder</strong> for:<br />
                      <code className="bg-green-100 px-1 rounded text-xs">EWA-Skills-Scan-Installation-Electrician.pdf</code>
                    </p>
                  </div>
                )}
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">2</span>
              <span>Open with <strong>Adobe Acrobat Reader</strong> and fill in all checkboxes</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">3</span>
              <span>Save the completed PDF</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">4</span>
              <span>Upload using the form below</span>
            </li>
          </ol>
        </div>

        {/* Upload Form */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-4">Upload Completed PDF</h2>
          
          {uploadStatus === "success" ? (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-green-700 mb-2">Submitted Successfully</h3>
              <p className="text-gray-600 mb-6">
                Your TESP Skills Scan has been submitted for Training Provider review.
              </p>
              <div className="flex gap-4 justify-center">
                <Button onClick={() => setUploadStatus(null)} variant="outline">
                  Submit Another
                </Button>
                <Link href="/">
                  <Button>Return Home</Button>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="candidateName">Full Name *</Label>
                <Input
                  id="candidateName"
                  type="text"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                />
              </div>

              <div>
                <Label htmlFor="pdf">Completed PDF *</Label>
                <label
                  htmlFor="pdf"
                  className={`mt-1 flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                    selectedFile
                      ? "border-green-400 bg-green-50"
                      : "border-gray-300 bg-gray-50 hover:bg-gray-100"
                  }`}
                >
                  {selectedFile ? (
                    <div className="flex items-center gap-2 text-green-700">
                      <FileText className="w-8 h-8" />
                      <div>
                        <p className="font-medium">{selectedFile.name}</p>
                        <p className="text-sm text-green-600">Click to change</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-gray-500">
                      <Upload className="w-8 h-8 mb-2" />
                      <p className="text-sm">Click to select your completed PDF</p>
                    </div>
                  )}
                  <input
                    id="pdf"
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>

              {errorMessage && (
                <div className="flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errorMessage}
                </div>
              )}

              <Button
                type="submit"
                className="w-full py-3"
                disabled={isUploading || !selectedFile || !candidateName || !email}
              >
                {isUploading ? "Uploading..." : "Submit TESP Skills Scan"}
              </Button>
            </form>
          )}
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <Link href="/skills-scan-upload" className="text-blue-600 hover:underline">
            Try filling out the PDF directly in your browser instead
          </Link>
        </div>
      </div>
    </div>
  )
}
