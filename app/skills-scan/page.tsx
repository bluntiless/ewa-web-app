"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, Download, CheckCircle, AlertCircle, FileText, Info } from "lucide-react"
import Link from "next/link"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"

export default function SkillsScanPage() {
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
      console.log("[v0] Starting PDF download...")
      const response = await fetch("/templates/ewa-skills-scan-template.pdf")
      console.log("[v0] Fetch response status:", response.status)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const blob = await response.blob()
      console.log("[v0] Blob size:", blob.size, "type:", blob.type)
      
      if (blob.size === 0) {
        throw new Error("Downloaded file is empty")
      }
      
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "EWA-Skills-Scan-Installation-Electrician.pdf"
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      setDownloadComplete(true)
      console.log("[v0] PDF download complete")
    } catch (error) {
      console.error("[v0] Download failed:", error)
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
      setDownloadComplete(false)
    } catch (error) {
      setUploadStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "Failed to upload PDF")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <SiteHeader />
      
      <main className="max-w-3xl mx-auto px-4 py-12 md:py-16">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Official TESP Skills Scan
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Complete and submit your Training &amp; Experience Self Profile (TESP) Skills Scan for Training Provider review.
          </p>
        </div>

        {/* Adobe Reader Note */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8 flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-800">
            <strong>Important:</strong> We recommend using <strong>Adobe Acrobat Reader</strong> to complete this PDF.
            Browser-based PDF viewers may not preserve all fillable form functionality. 
            <a 
              href="https://get.adobe.com/reader/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-amber-700 underline hover:text-amber-900 ml-1"
            >
              Download Adobe Reader (free)
            </a>
          </div>
        </div>

        {/* Instructions Card */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 md:p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">How to Complete Your Skills Scan</h2>
          
          <ol className="space-y-6">
            {/* Step 1 */}
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">1</span>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">Download the Official TESP Skills Scan PDF</h3>
                <p className="text-gray-600 text-sm mb-3">
                  Click below to download the official fillable PDF document.
                </p>
                <Button
                  type="button"
                  onClick={handleDownloadTemplate}
                  disabled={isDownloading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {isDownloading ? "Downloading..." : "Download TESP Skills Scan PDF"}
                </Button>
                {downloadComplete && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 text-green-700 font-medium">
                      <CheckCircle className="w-5 h-5" />
                      PDF Downloaded Successfully
                    </div>
                    <p className="text-green-600 text-sm mt-1">
                      Check your <strong>Downloads folder</strong> for:<br />
                      <code className="bg-green-100 px-1.5 py-0.5 rounded text-xs">EWA-Skills-Scan-Installation-Electrician.pdf</code>
                    </p>
                  </div>
                )}
              </div>
            </li>

            {/* Step 2 */}
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">2</span>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Complete the PDF in Adobe Acrobat Reader</h3>
                <p className="text-gray-600 text-sm">
                  Open the PDF in Adobe Acrobat Reader (not your browser). Fill in your name and tick all the appropriate boxes for your knowledge and experience levels across each section.
                </p>
              </div>
            </li>

            {/* Step 3 */}
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">3</span>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Save the Completed PDF</h3>
                <p className="text-gray-600 text-sm">
                  After filling in all sections, save the PDF file to your computer (File &gt; Save or Ctrl+S / Cmd+S).
                </p>
              </div>
            </li>

            {/* Step 4 */}
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">4</span>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Upload Your Completed PDF Below</h3>
                <p className="text-gray-600 text-sm">
                  Use the form below to upload your completed Skills Scan for Training Provider review.
                </p>
              </div>
            </li>
          </ol>
        </div>

        {/* Upload Form Card */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 md:p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Upload Your Completed Skills Scan</h2>
          
          {uploadStatus === "success" ? (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-green-700 mb-2">Submission Successful</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Your TESP Skills Scan has been submitted successfully and is now awaiting Training Provider review.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={() => setUploadStatus(null)} variant="outline">
                  Submit Another
                </Button>
                <Link href="/">
                  <Button className="bg-blue-600 hover:bg-blue-700">Return Home</Button>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="candidateName" className="text-gray-700">Full Name *</Label>
                  <Input
                    id="candidateName"
                    type="text"
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    placeholder="Enter your full name"
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-gray-700">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="mt-1"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="pdf" className="text-gray-700">Completed TESP Skills Scan PDF *</Label>
                <label
                  htmlFor="pdf"
                  className={`mt-1 flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                    selectedFile
                      ? "border-green-400 bg-green-50"
                      : "border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400"
                  }`}
                >
                  {selectedFile ? (
                    <div className="flex items-center gap-3 text-green-700">
                      <FileText className="w-10 h-10" />
                      <div>
                        <p className="font-medium">{selectedFile.name}</p>
                        <p className="text-sm text-green-600">Click to change file</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-gray-500">
                      <Upload className="w-10 h-10 mb-2" />
                      <p className="font-medium">Click to select your completed PDF</p>
                      <p className="text-sm text-gray-400">or drag and drop</p>
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
                <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {errorMessage}
                </div>
              )}

              <Button
                type="submit"
                className="w-full py-3 text-lg bg-blue-600 hover:bg-blue-700"
                disabled={isUploading || !selectedFile || !candidateName || !email}
              >
                {isUploading ? "Uploading..." : "Submit TESP Skills Scan"}
              </Button>
              
              <p className="text-xs text-gray-500 text-center">
                Your completed PDF will be securely stored and sent to our Training Provider team for review.
              </p>
            </form>
          )}
        </div>

        {/* Preliminary Assessment Link */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-2">Not sure if you&apos;re ready?</p>
          <Link href="/candidate-check" className="text-blue-600 hover:text-blue-700 hover:underline font-medium">
            Take our free preliminary self-assessment first
          </Link>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
