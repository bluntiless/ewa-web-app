"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, FileText, ImageIcon, Video, Download, Eye, Filter } from "lucide-react"
import PendingEvidenceView from "@/components/PendingEvidenceView"
import ProgressView from "@/components/ProgressView"
import { useEvidence } from "@/hooks/useEvidence"
import { ewaUnits } from "@/data/ewaUnits"
import { nvqUnits } from "@/data/ealUnits"

export default function PortfolioPage() {
  const [selectedTab, setSelectedTab] = useState("overview")
  const { evidence, loading, uploadEvidence } = useEvidence()

  // Combine all units for progress tracking
  const allUnits = [...ewaUnits, ...nvqUnits]

  const stats = {
    totalEvidence: evidence.length,
    pendingReview: evidence.filter((e) => e.status === "pending").length,
    approved: evidence.filter((e) => e.status === "approved").length,
    needsRevision: evidence.filter((e) => e.status === "needs_revision").length,
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    for (const file of Array.from(files)) {
      await uploadEvidence(file, "unit_1", "lo_1") // Mock unit and learning outcome
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Portfolio Management</h1>
          <p className="text-neutral-400">Upload, organize, and track your evidence submissions</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-neutral-900 border-neutral-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Evidence</CardTitle>
              <FileText className="h-4 w-4 text-neutral-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalEvidence}</div>
            </CardContent>
          </Card>

          <Card className="bg-neutral-900 border-neutral-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              <Eye className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-400">{stats.pendingReview}</div>
            </CardContent>
          </Card>

          <Card className="bg-neutral-900 border-neutral-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <Download className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">{stats.approved}</div>
            </CardContent>
          </Card>

          <Card className="bg-neutral-900 border-neutral-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Needs Revision</CardTitle>
              <FileText className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-400">{stats.needsRevision}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="upload">Upload Evidence</TabsTrigger>
            <TabsTrigger value="pending">Pending Review</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-neutral-900 border-neutral-800">
                <CardHeader>
                  <CardTitle>Recent Uploads</CardTitle>
                  <CardDescription>Your latest evidence submissions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {evidence.slice(0, 5).map((item) => (
                      <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg bg-neutral-800">
                        <div className="w-8 h-8 rounded bg-blue-500/20 flex items-center justify-center">
                          <FileText className="h-4 w-4 text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{item.title}</p>
                          <p className="text-xs text-neutral-400">{new Date(item.uploadDate).toLocaleDateString()}</p>
                        </div>
                        <Badge className="text-xs">{item.status}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-neutral-900 border-neutral-800">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common portfolio tasks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload New Evidence
                  </Button>
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download Portfolio
                  </Button>
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview Submission
                  </Button>
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter Evidence
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="upload" className="space-y-6">
            <Card className="bg-neutral-900 border-neutral-800">
              <CardHeader>
                <CardTitle>Upload Evidence</CardTitle>
                <CardDescription>Add new evidence to your portfolio</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-neutral-700 rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 text-neutral-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Upload your evidence files</h3>
                  <p className="text-neutral-400 mb-4">Drag and drop files here, or click to browse</p>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.mp4,.mp3"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload">
                    <Button asChild>
                      <span>Choose Files</span>
                    </Button>
                  </label>
                  <p className="text-xs text-neutral-500 mt-2">Supported formats: PDF, DOC, DOCX, JPG, PNG, MP4, MP3</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-neutral-900 border-neutral-800">
              <CardHeader>
                <CardTitle>Evidence Guidelines</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-neutral-800">
                    <FileText className="h-8 w-8 text-blue-400 mb-2" />
                    <h4 className="font-medium mb-1">Documents</h4>
                    <p className="text-sm text-neutral-400">Reports, certificates, assessments</p>
                  </div>
                  <div className="p-4 rounded-lg bg-neutral-800">
                    <ImageIcon className="h-8 w-8 text-green-400 mb-2" />
                    <h4 className="font-medium mb-1">Images</h4>
                    <p className="text-sm text-neutral-400">Photos of work, installations, equipment</p>
                  </div>
                  <div className="p-4 rounded-lg bg-neutral-800">
                    <Video className="h-8 w-8 text-purple-400 mb-2" />
                    <h4 className="font-medium mb-1">Videos</h4>
                    <p className="text-sm text-neutral-400">Demonstrations, procedures, explanations</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pending">
            <PendingEvidenceView evidence={evidence} />
          </TabsContent>

          <TabsContent value="progress">
            <ProgressView units={allUnits} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
