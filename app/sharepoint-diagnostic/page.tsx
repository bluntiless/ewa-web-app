"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useState } from "react"
import { SharePointService } from "@/services/SharePointService"
import { Loader2 } from 'lucide-react'

export default function SharePointDiagnosticPage() {
  const [siteUrl, setSiteUrl] = useState("")
  const [siteInfo, setSiteInfo] = useState<any>(null)
  const [siteError, setSiteError] = useState<string | null>(null)
  const [isLoadingSiteInfo, setIsLoadingSiteInfo] = useState(false)

  const [folderPath, setFolderPath] = useState("")
  const [folderContents, setFolderContents] = useState<any[] | null>(null)
  const [folderError, setFolderError] = useState<string | null>(null)
  const [isLoadingFolderContents, setIsLoadingFolderContents] = useState(false)

  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [uploadStatus, setUploadStatus] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleGetSiteInfo = async () => {
    setSiteInfo(null)
    setSiteError(null)
    if (!siteUrl) {
      setSiteError("Please enter a SharePoint site URL.")
      return
    }
    setIsLoadingSiteInfo(true)
    try {
      const info = await SharePointService.getSiteInfo(siteUrl)
      setSiteInfo(info)
    } catch (error: any) {
      setSiteError(error.message || "Failed to get site information.")
    } finally {
      setIsLoadingSiteInfo(false)
    }
  }

  const handleGetFolderContents = async () => {
    setFolderContents(null)
    setFolderError(null)
    if (!siteUrl || !folderPath) {
      setFolderError("Please enter both a site URL and a folder path.")
      return
    }
    setIsLoadingFolderContents(true)
    try {
      const contents = await SharePointService.getFolderContents(siteUrl, folderPath)
      setFolderContents(contents)
    } catch (error: any) {
      setFolderError(error.message || "Failed to get folder contents.")
    } finally {
      setIsLoadingFolderContents(false)
    }
  }

  const handleFileUpload = async () => {
    setUploadStatus(null)
    setUploadError(null)
    if (!siteUrl || !folderPath || !uploadFile) {
      setUploadError("Please provide site URL, folder path, and select a file.")
      return
    }
    setIsUploading(true)
    try {
      setUploadStatus("Uploading...")
      const result = await SharePointService.uploadFile(siteUrl, folderPath, uploadFile)
      setUploadStatus(`File uploaded successfully: ${result.name}`)
      setUploadFile(null) // Clear selected file
    } catch (error: any) {
      setUploadError(error.message || "Failed to upload file.")
      setUploadStatus(null)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">SharePoint Diagnostic Tool</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Site Information</h3>
            <Label htmlFor="site-url">SharePoint Site URL</Label>
            <Input
              id="site-url"
              type="text"
              placeholder="e.g., https://yourtenant.sharepoint.com/sites/MySite"
              value={siteUrl}
              onChange={(e) => setSiteUrl(e.target.value)}
            />
            <Button onClick={handleGetSiteInfo} className="w-full" disabled={isLoadingSiteInfo}>
              {isLoadingSiteInfo ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Getting Info...
                </>
              ) : (
                "Get Site Info"
              )}
            </Button>
            {siteError && <p className="text-red-500 text-sm">{siteError}</p>}
            {siteInfo && (
              <div className="bg-gray-100 p-4 rounded-md text-sm break-all">
                <h4 className="font-medium">Site Details:</h4>
                <pre>{JSON.stringify(siteInfo, null, 2)}</pre>
              </div>
            )}
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Folder Contents</h3>
            <Label htmlFor="folder-path">Folder Path (relative to site)</Label>
            <Input
              id="folder-path"
              type="text"
              placeholder="e.g., Shared Documents/General"
              value={folderPath}
              onChange={(e) => setFolderPath(e.target.value)}
            />
            <Button onClick={handleGetFolderContents} className="w-full" disabled={isLoadingFolderContents}>
              {isLoadingFolderContents ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Getting Contents...
                </>
              ) : (
                "Get Folder Contents"
              )}
            </Button>
            {folderError && <p className="text-red-500 text-sm">{folderError}</p>}
            {folderContents && (
              <div className="bg-gray-100 p-4 rounded-md text-sm break-all">
                <h4 className="font-medium">Folder Contents:</h4>
                <pre>{JSON.stringify(folderContents, null, 2)}</pre>
              </div>
            )}
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Upload File</h3>
            <Label htmlFor="file-upload">Select File</Label>
            <Input
              id="file-upload"
              type="file"
              onChange={(e) => setUploadFile(e.target.files ? e.target.files[0] : null)}
            />
            <Button onClick={handleFileUpload} className="w-full" disabled={!uploadFile || isUploading}>
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...
                </>
              ) : (
                "Upload File"
              )}
            </Button>
            {uploadStatus && <p className="text-green-600 text-sm">{uploadStatus}</p>}
            {uploadError && <p className="text-red-500 text-sm">{uploadError}</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
