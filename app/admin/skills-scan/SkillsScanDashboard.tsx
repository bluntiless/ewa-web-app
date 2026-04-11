"use client"

import { useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  FileText,
  Download,
  Upload,
  Eye,
  Archive,
  RefreshCw,
  LogOut,
  Search,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react"
import type { SkillsScanSubmission, SubmissionStatus } from "@/lib/skills-scan-submission"
import SubmissionDetailModal from "./SubmissionDetailModal"

const statusConfig: Record<SubmissionStatus, { label: string; color: string; icon: typeof Clock }> = {
  pending: { label: "Pending Review", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  reviewed: { label: "Reviewed", color: "bg-blue-100 text-blue-800", icon: Eye },
  uploaded: { label: "Uploaded", color: "bg-green-100 text-green-800", icon: CheckCircle },
  failed: { label: "Upload Failed", color: "bg-red-100 text-red-800", icon: XCircle },
  archived: { label: "Archived", color: "bg-gray-100 text-gray-800", icon: Archive },
}

export default function SkillsScanDashboard() {
  const { data: session } = useSession()
  const [submissions, setSubmissions] = useState<SkillsScanSubmission[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<SubmissionStatus | "all">("all")
  const [selectedSubmission, setSelectedSubmission] = useState<string | null>(null)
  const [showArchived, setShowArchived] = useState(false)

  const fetchSubmissions = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/admin/skills-scan/list")
      if (!response.ok) throw new Error("Failed to fetch submissions")

      const data = await response.json()
      setSubmissions(data.submissions || [])
    } catch (err) {
      setError("Failed to load submissions. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSubmissions()
  }, [])

  const filteredSubmissions = submissions.filter((sub) => {
    // Filter by archived status
    if (!showArchived && sub.status === "archived") return false
    if (showArchived && sub.status !== "archived") return false

    // Filter by status
    if (statusFilter !== "all" && sub.status !== statusFilter) return false

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        sub.candidateName.toLowerCase().includes(query) ||
        sub.email.toLowerCase().includes(query) ||
        sub.id.toLowerCase().includes(query)
      )
    }

    return true
  })

  const handleArchive = async (id: string) => {
    if (!confirm("Are you sure you want to archive this submission?")) return

    try {
      const response = await fetch(`/api/admin/skills-scan/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to archive")

      await fetchSubmissions()
    } catch (err) {
      alert("Failed to archive submission")
      console.error(err)
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Skills Scan Submissions</h1>
            <p className="text-sm text-gray-500">Admin Dashboard</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">{session?.user?.email}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => signOut({ callbackUrl: "/admin/login" })}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search by name, email, or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as SubmissionStatus | "all")}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="reviewed">Reviewed</option>
              <option value="uploaded">Uploaded</option>
              <option value="failed">Failed</option>
            </select>

            <Button
              variant={showArchived ? "default" : "outline"}
              size="sm"
              onClick={() => setShowArchived(!showArchived)}
            >
              <Archive className="w-4 h-4 mr-2" />
              {showArchived ? "Showing Archived" : "Show Archived"}
            </Button>

            <Button variant="outline" size="sm" onClick={fetchSubmissions} disabled={isLoading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-800">{error}</span>
          </div>
        )}

        {/* Submissions Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center text-gray-500">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3" />
              Loading submissions...
            </div>
          ) : filteredSubmissions.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="font-medium">No submissions found</p>
              <p className="text-sm">
                {showArchived
                  ? "No archived submissions yet."
                  : "Skills Scan submissions will appear here."}
              </p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Candidate
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Submitted
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredSubmissions.map((submission) => {
                  const status = statusConfig[submission.status]
                  const StatusIcon = status.icon

                  return (
                    <tr key={submission.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{submission.candidateName}</p>
                          <p className="text-sm text-gray-500">{submission.email}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm text-gray-600">{formatDate(submission.submittedAt)}</p>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}
                        >
                          <StatusIcon className="w-3.5 h-3.5" />
                          {status.label}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedSubmission(submission.id)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          {submission.status !== "archived" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleArchive(submission.id)}
                              className="text-gray-500 hover:text-red-600"
                            >
                              <Archive className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Stats Footer */}
        <div className="mt-4 text-sm text-gray-500">
          Showing {filteredSubmissions.length} of {submissions.filter((s) => showArchived ? s.status === "archived" : s.status !== "archived").length} submissions
        </div>
      </main>

      {/* Submission Detail Modal */}
      {selectedSubmission && (
        <SubmissionDetailModal
          submissionId={selectedSubmission}
          onClose={() => setSelectedSubmission(null)}
          onUpdate={fetchSubmissions}
        />
      )}
    </div>
  )
}
