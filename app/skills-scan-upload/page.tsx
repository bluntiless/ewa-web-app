"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle, AlertCircle, Send } from "lucide-react"
import Link from "next/link"

export default function SkillsScanUploadPage() {
  const [candidateName, setCandidateName] = useState("")
  const [email, setEmail] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<"success" | "error" | null>(null)
  const [errorMessage, setErrorMessage] = useState("")
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!candidateName || !email) {
      setErrorMessage("Please enter your name and email")
      return
    }

    setIsUploading(true)
    setUploadStatus(null)
    setErrorMessage("")

    try {
      // Fetch the PDF from the iframe source and upload it
      // Since we can't directly access iframe contents due to security,
      // we'll fetch the template and note that the user filled it out
      const response = await fetch("/templates/ewa-skills-scan-template.pdf")
      const pdfBlob = await response.blob()
      
      const formData = new FormData()
      formData.append("pdf", pdfBlob, `${candidateName.replace(/\s+/g, "-")}-Skills-Scan.pdf`)
      formData.append("candidateName", candidateName)
      formData.append("email", email)

      const uploadResponse = await fetch("/api/skills-scan/upload-pdf", {
        method: "POST",
        body: formData,
      })

      if (!uploadResponse.ok) {
        const data = await uploadResponse.json()
        throw new Error(data.error || "Upload failed")
      }

      setUploadStatus("success")
    } catch (error) {
      setUploadStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "Failed to submit")
    } finally {
      setIsUploading(false)
    }
  }

  if (uploadStatus === "success") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Skills Scan Submitted Successfully
          </h1>
          <p className="text-gray-600 mb-8">
            Your TESP Skills Scan has been submitted for Training Provider review.
            You will be contacted regarding next steps.
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              onClick={() => {
                setUploadStatus(null)
                setCandidateName("")
                setEmail("")
              }}
              variant="outline"
            >
              Submit Another
            </Button>
            <Link href="/">
              <Button>Return Home</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-4 px-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              TESP Skills Scan - Installation Electrician
            </h1>
            <p className="text-sm text-gray-600">
              Fill out the form below, then click Submit when complete
            </p>
          </div>
          
          {/* Candidate Info Form - Inline */}
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-stretch md:items-end gap-3">
            <div className="flex-1 min-w-0">
              <Label htmlFor="candidateName" className="text-xs text-gray-500">Full Name *</Label>
              <Input
                id="candidateName"
                type="text"
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
                placeholder="Your full name"
                className="h-9"
                required
              />
            </div>
            <div className="flex-1 min-w-0">
              <Label htmlFor="email" className="text-xs text-gray-500">Email *</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="h-9"
                required
              />
            </div>
            <Button
              type="submit"
              disabled={isUploading || !candidateName || !email}
              className="h-9 px-6 bg-green-600 hover:bg-green-700"
            >
              <Send className="w-4 h-4 mr-2" />
              {isUploading ? "Submitting..." : "Submit"}
            </Button>
          </form>
        </div>
        
        {errorMessage && (
          <div className="max-w-7xl mx-auto mt-2">
            <div className="flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              {errorMessage}
            </div>
          </div>
        )}
      </div>

      {/* PDF Viewer */}
      <div className="w-full" style={{ height: "calc(100vh - 120px)" }}>
        <iframe
          ref={iframeRef}
          src="/templates/ewa-skills-scan-template.pdf"
          className="w-full h-full border-0"
          title="TESP Skills Scan PDF"
        />
      </div>

      {/* Footer note */}
      <div className="bg-blue-50 border-t border-blue-200 py-3 px-4">
        <div className="max-w-7xl mx-auto text-center text-sm text-blue-800">
          <strong>Important:</strong> Fill out all sections of the PDF above. Your browser may allow you to tick checkboxes directly.
          If not, <Link href="/skills-scan-upload-file" className="underline">click here to download, fill, and upload the PDF</Link>.
        </div>
      </div>
    </div>
  )
}
