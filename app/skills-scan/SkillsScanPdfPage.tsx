"use client"

import { useState, useRef } from "react"
import { Upload, FileText, CheckCircle, AlertCircle, Download, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"

interface SuitabilityResult {
  result: "suitable" | "potentially-suitable" | "not-suitable"
  title: string
  summary: string
  knowledgeScore: number
  experienceScore: number
  guidance: string[]
}

export default function SkillsScanPdfPage() {
  const [candidateName, setCandidateName] = useState("")
  const [candidateEmail, setCandidateEmail] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState<{
    success: boolean
    message: string
    suitabilityResult?: SuitabilityResult
  } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type === "application/pdf") {
      setSelectedFile(file)
      setUploadResult(null)
    } else {
      alert("Please select a PDF file")
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type === "application/pdf") {
      setSelectedFile(file)
      setUploadResult(null)
    } else {
      alert("Please drop a PDF file")
    }
  }

  const handleSubmit = async () => {
    if (!selectedFile || !candidateName.trim() || !candidateEmail.trim()) {
      alert("Please fill in your name, email, and select a completed TESP PDF file")
      return
    }

    setIsUploading(true)
    setUploadResult(null)

    try {
      const formData = new FormData()
      formData.append("pdf", selectedFile)
      formData.append("candidateName", candidateName)
      formData.append("candidateEmail", candidateEmail)

      const response = await fetch("/api/skills-scan/upload-pdf", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (response.ok) {
        setUploadResult({
          success: true,
          message: "Your Skills Scan has been submitted successfully!",
          suitabilityResult: result.suitabilityResult,
        })
      } else {
        setUploadResult({
          success: false,
          message: result.error || "Failed to upload Skills Scan. Please try again.",
        })
      }
    } catch (error) {
      setUploadResult({
        success: false,
        message: "An error occurred while uploading. Please try again.",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const getSuitabilityColor = (result: string) => {
    switch (result) {
      case "suitable":
        return "bg-green-50 border-green-200 text-green-800"
      case "potentially-suitable":
        return "bg-amber-50 border-amber-200 text-amber-800"
      case "not-suitable":
        return "bg-red-50 border-red-200 text-red-800"
      default:
        return "bg-muted border-border"
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />

      <main className="flex-1">
        <div className="container mx-auto max-w-4xl px-4 py-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-foreground md:text-4xl">
              TESP Skills Scan
            </h1>
            <p className="mt-2 text-muted-foreground">
              Complete the official TESP Skills Scan PDF and upload it to receive your preliminary suitability indication
            </p>
          </div>

          {/* Step 1: Download PDF */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                  1
                </span>
                Download the TESP Skills Scan PDF
              </CardTitle>
              <CardDescription>
                Download the official fillable PDF form and complete it with your skills assessment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <a
                href="/templates/ewa-skills-scan-template.pdf"
                download="EWA-Skills-Scan-Form.pdf"
                className="inline-flex"
              >
                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Download TESP Skills Scan PDF
                </Button>
              </a>
              <p className="mt-3 text-sm text-muted-foreground">
                Open the PDF in Adobe Reader or your PDF viewer, fill in all sections including your name, 
                qualifications, and skill ratings, then save the completed form.
              </p>
            </CardContent>
          </Card>

          {/* Step 2: Enter Details */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                  2
                </span>
                Enter Your Details
              </CardTitle>
              <CardDescription>
                Provide your name and email for submission tracking
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="candidateName">Full Name *</Label>
                  <Input
                    id="candidateName"
                    placeholder="Enter your full name"
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    disabled={isUploading || uploadResult?.success}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="candidateEmail">Email Address *</Label>
                  <Input
                    id="candidateEmail"
                    type="email"
                    placeholder="Enter your email"
                    value={candidateEmail}
                    onChange={(e) => setCandidateEmail(e.target.value)}
                    disabled={isUploading || uploadResult?.success}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step 3: Upload Completed PDF */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                  3
                </span>
                Upload Your Completed PDF
              </CardTitle>
              <CardDescription>
                Upload your completed TESP Skills Scan PDF to receive your preliminary suitability indication
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={`relative rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
                  selectedFile
                    ? "border-primary bg-primary/5"
                    : "border-muted-foreground/25 hover:border-primary/50"
                }`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileSelect}
                  className="absolute inset-0 cursor-pointer opacity-0"
                  disabled={isUploading || uploadResult?.success}
                />
                
                {selectedFile ? (
                  <div className="flex flex-col items-center gap-2">
                    <FileText className="h-12 w-12 text-primary" />
                    <p className="font-medium text-foreground">{selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    {!uploadResult?.success && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedFile(null)
                        }}
                      >
                        Choose a different file
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="h-12 w-12 text-muted-foreground" />
                    <p className="font-medium text-foreground">
                      Drop your completed PDF here or click to browse
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Only PDF files are accepted
                    </p>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              {!uploadResult?.success && (
                <Button
                  className="mt-6 w-full"
                  size="lg"
                  onClick={handleSubmit}
                  disabled={!selectedFile || !candidateName.trim() || !candidateEmail.trim() || isUploading}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading and Processing...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Submit Skills Scan
                    </>
                  )}
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Results */}
          {uploadResult && (
            <Card className={uploadResult.success ? "border-green-200" : "border-red-200"}>
              <CardContent className="pt-6">
                {uploadResult.success ? (
                  <div className="space-y-6">
                    <Alert className="border-green-200 bg-green-50">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertTitle className="text-green-800">Submission Successful</AlertTitle>
                      <AlertDescription className="text-green-700">
                        {uploadResult.message}
                      </AlertDescription>
                    </Alert>

                    {uploadResult.suitabilityResult && (
                      <div className={`rounded-lg border p-6 ${getSuitabilityColor(uploadResult.suitabilityResult.result)}`}>
                        <h3 className="text-xl font-bold mb-2">
                          {uploadResult.suitabilityResult.title}
                        </h3>
                        <p className="mb-4">{uploadResult.suitabilityResult.summary}</p>
                        
                        <div className="grid gap-4 sm:grid-cols-2 mb-4">
                          <div className="rounded bg-white/50 p-3">
                            <p className="text-sm font-medium">Knowledge Score</p>
                            <p className="text-2xl font-bold">
                              {uploadResult.suitabilityResult.knowledgeScore}%
                            </p>
                          </div>
                          <div className="rounded bg-white/50 p-3">
                            <p className="text-sm font-medium">Experience Score</p>
                            <p className="text-2xl font-bold">
                              {uploadResult.suitabilityResult.experienceScore}%
                            </p>
                          </div>
                        </div>

                        {uploadResult.suitabilityResult.guidance.length > 0 && (
                          <div>
                            <h4 className="font-semibold mb-2">Next Steps:</h4>
                            <ul className="list-disc list-inside space-y-1 text-sm">
                              {uploadResult.suitabilityResult.guidance.map((item, idx) => (
                                <li key={idx}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <p className="mt-4 text-xs opacity-75">
                          This is a preliminary indication only. Final suitability will be determined by 
                          a Training Provider during verification.
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Submission Failed</AlertTitle>
                    <AlertDescription>{uploadResult.message}</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
