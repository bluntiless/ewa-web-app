"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { SharePointService } from "../../../services/SharePointService"
import React from 'react';

interface EvidenceItem {
  id: string
  name: string
  dateSubmitted: Date
  status: string
  downloadUrl?: string
  webUrl?: string
  isFolder: boolean
  path: string
  assessorFeedback?: string
  assessorName?: string
  assessmentDate?: string
}

const CandidateEvidencePage: React.FC = () => {
  const params = useParams()
  const siteId = params.siteId as string

  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState<EvidenceItem[]>([])
  const [candidateName, setCandidateName] = useState("")
  const [currentPath, setCurrentPath] = useState("")
  const [pathHistory, setPathHistory] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadItems = async () => {
      if (!siteId || typeof siteId !== "string") return

      try {
        setLoading(true)
        const spService = SharePointService.getInstance()

        // Get site details first
        const siteResponse = await spService["client"]?.api(`/sites/${siteId}`).get()
        if (siteResponse) {
          setCandidateName(siteResponse.displayName)
        }

        // Try to find the best starting path
        await findBestStartingPath()
      } catch (error) {
        console.error("Failed to load candidate info:", error)
        setError("Failed to load candidate information.")
        setLoading(false)
      }
    }

    loadItems()
  }, [siteId])

  useEffect(() => {
    if (siteId && currentPath) {
      loadCurrentPath()
    }
  }, [currentPath, siteId])

  const findBestStartingPath = async () => {
    if (!siteId || typeof siteId !== "string") return

    const spService = SharePointService.getInstance()

    // Try different possible starting paths
    const possiblePaths = [
      "Documents/Evidence",
      "Evidence",
      "Shared Documents/Evidence",
      "Documents",
      "Shared Documents",
    ]

    for (const path of possiblePaths) {
      try {
        console.log(`Trying starting path: ${path}`)
        const response = await spService["client"]?.api(`/sites/${siteId}/drive/root:/${path}:/children`).get()

        if (response?.value && response.value.length > 0) {
          console.log(`✅ Found items in ${path}, using as starting path`)
          setCurrentPath(path)
          setPathHistory([path])
          return
        }
      } catch (error) {
        console.log(`❌ Path ${path} not accessible`)
      }
    }

    // If no evidence paths work, try root
    try {
      console.log("Trying root path as fallback")
      const response = await spService["client"]?.api(`/sites/${siteId}/drive/root/children`).get()

      if (response?.value) {
        console.log("✅ Using root path as starting point")
        setCurrentPath("")
        setPathHistory([""])
        return
      }
    } catch (error) {
      console.error("Failed to access root path:", error)
    }

    setError("Could not access any folders in this site. You may not have permission.")
    setLoading(false)
  }

  const loadCurrentPath = async () => {
    if (!siteId || typeof siteId !== "string") return

    try {
      setLoading(true)
      setError(null)
      const spService = SharePointService.getInstance()

      console.log(`Loading path: "${currentPath}"`)

      let response
      if (currentPath === "" || currentPath === "/") {
        // Load root
        response = await spService["client"]?.api(`/sites/${siteId}/drive/root/children`).get()
      } else {
        // Load specific path
        response = await spService["client"]?.api(`/sites/${siteId}/drive/root:/${currentPath}:/children`).get()
      }

      if (response?.value) {
        const evidenceItems: EvidenceItem[] = []

        // Process each item to get detailed metadata
        for (const item of response.value) {
          let assessmentStatus = "Unknown"
          let assessorFeedback = ""
          let assessorName = ""
          let assessmentDate = ""

          // For files, try to get the SharePoint list item metadata
          if (!item.folder) {
            try {
              console.log(`Getting metadata for file: ${item.name}`)

              // Get the list item with all fields
              const listItemResponse = await spService["client"]
                ?.api(`/sites/${siteId}/drive/items/${item.id}/listItem`)
                .expand("fields")
                .get()

              console.log(`Metadata for ${item.name}:`, listItemResponse)

              if (listItemResponse?.fields) {
                const fields = listItemResponse.fields

                // Try different possible field names for assessment status
                assessmentStatus =
                  fields.Assessment ||
                  fields.AssessmentStatus ||
                  fields.assessment ||
                  fields.Assessment_x0020_Status ||
                  fields["Assessment Status"] ||
                  "Unknown"

                // Get assessor feedback
                assessorFeedback =
                  fields.AssessorFeedback ||
                  fields.Assessor_x0020_Feedback ||
                  fields["Assessor Feedback"] ||
                  fields.AssessorFe ||
                  ""

                // Get assessor name
                assessorName =
                  fields.AssessorName ||
                  fields.Assessor_x0020_Name ||
                  fields["Assessor Name"] ||
                  fields.AssessorNa ||
                  ""

                // Get assessment date
                assessmentDate =
                  fields.AssessmentDate ||
                  fields.Assessment_x0020_Date ||
                  fields["Assessment Date"] ||
                  fields.AssessmentDa ||
                  ""

                console.log(
                  `📊 ${item.name} - Status: "${assessmentStatus}", Feedback: "${assessorFeedback}", Assessor: "${assessorName}"`,
                )
              }
            } catch (metadataError) {
              console.warn(`⚠️ Could not get metadata for ${item.name}:`, metadataError)
              // For files without metadata access, keep as Unknown
            }
          }

          const evidenceItem: EvidenceItem = {
            id: item.id,
            name: item.name,
            dateSubmitted: new Date(item.createdDateTime),
            status: assessmentStatus,
            downloadUrl: item["@microsoft.graph.downloadUrl"],
            webUrl: item.webUrl,
            isFolder: !!item.folder,
            path: currentPath ? `${currentPath}/${item.name}` : item.name,
            assessorFeedback,
            assessorName,
            assessmentDate,
          }

          evidenceItems.push(evidenceItem)
        }

        // Sort folders first, then files
        evidenceItems.sort((a, b) => {
          if (a.isFolder && !b.isFolder) return -1
          if (!a.isFolder && b.isFolder) return 1
          return a.name.localeCompare(b.name)
        })

        setItems(evidenceItems)
        console.log(`✅ Loaded ${evidenceItems.length} items from ${currentPath || "root"}`)
      } else {
        setItems([])
        console.log(`📭 No items found in ${currentPath || "root"}`)
      }
      setLoading(false)
    } catch (error: any) {
      console.error("Failed to load path:", error)
      setError(`Failed to load ${currentPath || "root"}. ${error?.message || "Access denied or path not found."}`)
      setLoading(false)
    }
  }

  const handleItemClick = (item: EvidenceItem) => {
    if (item.isFolder) {
      // Navigate into folder
      setCurrentPath(item.path)
      setPathHistory((prev) => [...prev, item.path])
    } else {
      // For all file types, use webUrl to display/preview in browser (not download)
      if (item.webUrl) {
        window.open(item.webUrl, "_blank")
      } else if (item.downloadUrl) {
        // Only use downloadUrl as last resort fallback
        window.open(item.downloadUrl, "_blank")
      }
    }
  }

  const navigateBack = () => {
    if (pathHistory.length > 1) {
      const newHistory = pathHistory.slice(0, -1)
      setPathHistory(newHistory)
      setCurrentPath(newHistory[newHistory.length - 1])
    }
  }

  const navigateToDashboard = () => {
    window.location.href = "/assessor-review"
  }

  if (loading) {
    return (
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Loading...</h1>
          <button onClick={navigateToDashboard} className="px-4 py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200">
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Error</h1>
          <button onClick={navigateToDashboard} className="px-4 py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200">
            Back to Dashboard
          </button>
        </div>
        <div className="text-red-600">{error}</div>
      </div>
    )
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{candidateName}'s Evidence</h1>
        <button onClick={navigateToDashboard} className="px-4 py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200">
          Back to Dashboard
        </button>
      </div>

      {/* Breadcrumb */}
      <div className="mb-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span>Path:</span>
          <span className="font-mono bg-gray-100 px-2 py-1 rounded">{currentPath}</span>
          {pathHistory.length > 1 && (
            <button
              onClick={navigateBack}
              className="px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
            >
              ← Back
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className={`bg-white p-4 rounded-lg shadow cursor-pointer hover:bg-gray-50 ${
              item.isFolder ? "border-l-4 border-blue-500" : ""
            }`}
            onClick={() => handleItemClick(item)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{item.isFolder ? "📁" : "📄"}</span>
                <div className="flex-1">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-gray-500">
                    {item.isFolder ? "Folder" : `Submitted: ${item.dateSubmitted.toLocaleDateString()}`}
                  </p>
                  {!item.isFolder && item.assessorName && (
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-medium">Assessor:</span> {item.assessorName}
                      {item.assessmentDate && (
                        <span className="ml-2 text-gray-500">
                          • {new Date(item.assessmentDate).toLocaleDateString()}
                        </span>
                      )}
                    </p>
                  )}
                  {!item.isFolder && item.assessorFeedback && (
                    <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                      <span className="font-medium text-gray-700">Feedback:</span>
                      <p className="text-gray-600 mt-1">{item.assessorFeedback}</p>
                    </div>
                  )}
                </div>
              </div>
              {!item.isFolder && (
                <div className="flex flex-col items-end space-y-1">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      item.status.toLowerCase().includes("approved")
                        ? "bg-green-100 text-green-800"
                        : item.status.toLowerCase().includes("pending")
                          ? "bg-yellow-100 text-yellow-800"
                          : item.status.toLowerCase().includes("rejected")
                            ? "bg-red-100 text-red-800"
                            : item.status.toLowerCase().includes("needs")
                              ? "bg-orange-100 text-orange-800"
                              : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {item.status}
                  </span>
                  {item.assessmentDate && (
                    <span className="text-xs text-gray-500">{new Date(item.assessmentDate).toLocaleTimeString()}</span>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div className="text-center py-8 text-gray-500">No items found in {currentPath || "root"}.</div>
        )}
      </div>
    </div>
  );
};

export default CandidateEvidencePage;
