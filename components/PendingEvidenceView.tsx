"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, ImageIcon, Video, Headphones, File, Clock, AlertCircle } from "lucide-react"
import type { Evidence } from "@/models/Evidence"

interface PendingEvidenceViewProps {
  evidence: Evidence[]
}

export default function PendingEvidenceView({ evidence }: PendingEvidenceViewProps) {
  const pendingEvidence = evidence.filter((e) => e.status === "pending")

  const getFileIcon = (type: Evidence["type"]) => {
    switch (type) {
      case "document":
        return <FileText className="h-4 w-4" />
      case "image":
        return <ImageIcon className="h-4 w-4" />
      case "video":
        return <Video className="h-4 w-4" />
      case "audio":
        return <Headphones className="h-4 w-4" />
      default:
        return <File className="h-4 w-4" />
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  if (pendingEvidence.length === 0) {
    return (
      <Card className="bg-neutral-900 border-neutral-800">
        <CardContent className="text-center py-8">
          <AlertCircle className="h-12 w-12 text-neutral-500 mx-auto mb-4" />
          <p className="text-neutral-400">No pending evidence to review</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="h-5 w-5 text-yellow-500" />
        <h2 className="text-lg font-semibold">Pending Evidence Review</h2>
        <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400">
          {pendingEvidence.length} items
        </Badge>
      </div>

      {pendingEvidence.map((item) => (
        <Card key={item.id} className="bg-neutral-900 border-neutral-800">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  {getFileIcon(item.type)}
                  {item.title}
                </CardTitle>
                <CardDescription className="text-neutral-400">{item.description}</CardDescription>
              </div>
              <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Pending</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm text-neutral-400 mb-4">
              <div>
                <span className="font-medium">File:</span> {item.fileName}
              </div>
              <div>
                <span className="font-medium">Size:</span> {formatFileSize(item.fileSize)}
              </div>
              <div>
                <span className="font-medium">Uploaded:</span> {new Date(item.uploadDate).toLocaleDateString()}
              </div>
              <div>
                <span className="font-medium">Type:</span> {item.type}
              </div>
            </div>

            {item.tags.length > 0 && (
              <div className="mb-4">
                <p className="text-sm text-neutral-400 mb-2">Tags:</p>
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="bg-neutral-800 text-neutral-300">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                View Evidence
              </Button>
              <Button size="sm" variant="outline">
                Edit Details
              </Button>
              <Button size="sm" variant="destructive">
                Remove
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
