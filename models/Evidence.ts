export interface Evidence {
  id: string
  title: string
  description: string
  uploadedBy: string
  uploadDate: string
  status: "Pending" | "Approved" | "Rejected"
  fileUrl?: string // Optional: URL to the actual file
  unitId: string
  criterionId: string
}

export interface EvidenceMetadata {
  id: string
  title: string
  description: string
  uploadedBy: string
  uploadDate: string
  status: "Pending" | "Approved" | "Rejected"
  unitId: string
  criterionId: string
  fileType: string // e.g., "pdf", "jpg", "docx"
  fileSize: string // e.g., "2.5 MB"
  thumbnailUrl?: string // Optional: URL to a thumbnail image
}
