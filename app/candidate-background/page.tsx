"use client"

// Candidate Background Form page - download, fill, and upload workflow
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"
import { Download, Upload, CheckCircle, AlertCircle, FileText } from "lucide-react"
import Link from "next/link"

export default function CandidateBackgroundPage() {
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
    setErrorMessage("")
    try {
      const response = await fetch("/templates/candidate-background-form.pdf")
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const blob = await response.blob()
      
      if (blob.size === 0) {
        throw new Error("Downloaded file is empty")
      }
      
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "EWA-Candidate-Background-Form.pdf"
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      setDownloadComplete(true)
    } catch (error) {
      console.error("Download failed:", error)
      setErrorMessage("Candidate Background Form coming soon. Please contact us for the form.")
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
    
    if (!candidateName.trim() || !email.trim()) {
      setErrorMessage("Please enter your name and email")
      return
    }
    
    if (!selectedFile) {
      setErrorMessage("Please select your completed form to upload")
      return
    }

    setIsUploading(true)
    setErrorMessage("")

    try {
      const formData = new FormData()
      formData.append("file", selectedFile)
      formData.append("candidateName", candidateName)
      formData.append("email", email)
      formData.append("formType", "candidate-background")

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
    } catch (error) {
      console.error("Upload error:", error)
      setUploadStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "Failed to upload form")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <SiteHeader />
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Candidate Background Form</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Complete and submit your Candidate Background form to provide your employment history, 
            qualifications, and experience details for Training Provider review.
          </p>
        </div>

        {/* Instructions Card */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 md:p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">How to Complete Your Background Form</h2>
          
          <ol className="space-y-6">
            {/* Step 1 */}
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">1</span>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">Download the Candidate Background Form</h3>
                <p className="text-gray-600 text-sm mb-3">
                  Click below to download the official fillable PDF document.
                </p>
                <Button
                  type="button"
                  onClick={handleDownloadTemplate}
                  disabled={isDownloading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {isDownloading ? "Downloading..." : "Download Background Form"}
                </Button>
                {downloadComplete && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 text-green-700 font-medium">
                      <CheckCircle className="w-5 h-5" />
                      Form Downloaded Successfully
                    </div>
                    <p className="text-green-600 text-sm mt-1">
                      Check your <strong>Downloads folder</strong> for the form.
                    </p>
                  </div>
                )}
              </div>
            </li>

            {/* Step 2 */}
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">2</span>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Complete the Form in Adobe Reader</h3>
                <p className="text-gray-600 text-sm">
                  Open the PDF in <strong>Adobe Acrobat Reader</strong> (free download from adobe.com). 
                  Fill in all required fields including your employment history, qualifications, and experience.
                </p>
                <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-amber-800 text-sm">
                    <strong>Note:</strong> Use Adobe Acrobat Reader for best results. Browser PDF viewers may not preserve all form functionality.
                  </p>
                </div>
              </div>
            </li>

            {/* Step 3 */}
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">3</span>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Save Your Completed Form</h3>
                <p className="text-gray-600 text-sm">
                  Save the completed PDF to your computer (File &gt; Save As).
                </p>
              </div>
            </li>

            {/* Step 4 */}
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">4</span>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Upload Your Completed Form</h3>
                <p className="text-gray-600 text-sm">
                  Use the form below to upload your completed Background Form for Training Provider review.
                </p>
              </div>
            </li>
          </ol>
        </div>

        {/* Upload Form */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 md:p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Upload Completed Form</h2>
          
          {uploadStatus === "success" ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Form Submitted Successfully</h3>
              <p className="text-gray-600 mb-6">
                Your Candidate Background Form has been submitted for Training Provider review.
              </p>
              <div className="flex justify-center gap-4">
                <Link href="/services">
                  <Button variant="outline">Return to Services</Button>
                </Link>
                <Link href="/skills-scan">
                  <Button className="bg-blue-600 hover:bg-blue-700">Submit TESP Skills Scan</Button>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="candidateName">Full Name *</Label>
                  <Input
                    id="candidateName"
                    type="text"
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    placeholder="Enter your full name"
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="file">Completed Background Form (PDF) *</Label>
                <div className="mt-1 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
                  <input
                    type="file"
                    id="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label htmlFor="file" className="cursor-pointer">
                    {selectedFile ? (
                      <div className="flex items-center justify-center gap-2 text-green-600">
                        <FileText className="w-6 h-6" />
                        <span className="font-medium">{selectedFile.name}</span>
                      </div>
                    ) : (
                      <div>
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600">Click to select your completed form</p>
                        <p className="text-gray-400 text-sm">PDF files only</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {errorMessage && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">{errorMessage}</span>
                </div>
              )}

              <Button
                type="submit"
                disabled={isUploading || !selectedFile || !candidateName || !email}
                className="w-full bg-green-600 hover:bg-green-700 py-3 text-lg"
              >
                {isUploading ? "Uploading..." : "Submit Background Form"}
              </Button>
            </form>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
