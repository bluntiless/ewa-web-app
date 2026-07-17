"use client"

import { useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  FileText,
  Download,
  RefreshCw,
  LogOut,
  Search,
  AlertCircle,
  ClipboardList,
  ChevronRight,
  Clock,
  Eye,
  XCircle,
} from "lucide-react"
import Link from "next/link"

type CandidateBackgroundStatus = "pending" | "reviewed" | "failed"

interface CandidateBackgroundSubmission {
  id: string
  candidateName: string
  email: string
  formType: string
  submittedAt: string
  originalFileName?: string
  pdfUrl?: string
  status?: CandidateBackgroundStatus
  reviewedAt?: string
}

const statusConfig: Record<CandidateBackgroundStatus, { label: string; color: string; icon: typeof Clock }> = {
  pending: { label: "Pending Review", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  reviewed: { label: "Reviewed", color: "bg-blue-100 text-blue-800", icon: Eye },
  failed: { label: "Failed", color: "bg-red-100 text-red-800", icon: XCircle },
}

export default function CandidateBackgroundDashboard() {
  const { data: session } = useSession()
  const [submissions, setSubmissions] = useState<CandidateBackgroundSubmission[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const fetchSubmissions = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/admin/candidate-background/list")
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

  const filteredSubmissions = submissions.filter((submission) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      submission.candidateName.toLowerCase().includes(query) ||
      submission.email.toLowerCase().includes(query) ||
      submission.id.toLowerCase().includes(query)
    )
  })

  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const handleStatusChange = async (id: string, status: CandidateBackgroundStatus) => {
    setUpdatingId(id)
    // Optimistic update for instant feedback.
    setSubmissions((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)))

    try {
      const response = await fetch(`/api/admin/candidate-background/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) throw new Error("Failed to update status")
      await fetchSubmissions()
    } catch (err) {
      alert("Failed to update status")
      console.error(err)
      await fetchSubmissions()
    } finally {
      setUpdatingId(null)
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
            <h1 className="text-xl font-bold text-gray-900">Candidate Background Forms</h1>
            <p className="text-sm text-gray-500">Admin Dashboard</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin/skills-scan">
              <Button variant="ghost" size="sm">
                Skills Scans
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
            <Link href="/admin/bookings">
              <Button variant="ghost" size="sm">
                Course Bookings
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
            <Link href="/admin/eligibility-checks">
              <Button variant="ghost" size="sm">
                Eligibility Checks
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
            <span className="text-sm text-gray-500">{session?.user?.email}</span>
            <Button variant="outline" size="sm" onClick={() => signOut({ callbackUrl: "/admin/login" })}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats Card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <ClipboardList className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{submissions.length}</p>
                <p className="text-sm text-gray-500">Total Submissions</p>
              </div>
            </div>
          </div>
        </div>

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
              <p className="text-sm">Completed candidate background forms will appear here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Candidate
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      File
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
                  {filteredSubmissions.map((submission) => (
                    <tr key={submission.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{submission.candidateName}</p>
                          <p className="text-sm text-gray-500">{submission.email}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-400" />
                          {submission.originalFileName || "completed.pdf"}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm text-gray-600">{formatDate(submission.submittedAt)}</p>
                      </td>
                      <td className="px-4 py-4">
                        {(() => {
                          const status = statusConfig[submission.status ?? "pending"]
                          const StatusIcon = status.icon
                          return (
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}
                            >
                              <StatusIcon className="w-3.5 h-3.5" />
                              {status.label}
                            </span>
                          )
                        })()}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <select
                            value={submission.status ?? "pending"}
                            onChange={(e) =>
                              handleStatusChange(submission.id, e.target.value as CandidateBackgroundStatus)
                            }
                            disabled={updatingId === submission.id}
                            aria-label="Update review status"
                            className="px-2 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-700 disabled:opacity-50"
                          >
                            <option value="pending">Mark Pending</option>
                            <option value="reviewed">Mark Reviewed</option>
                            <option value="failed">Mark Failed</option>
                          </select>
                          {submission.pdfUrl ? (
                            <a href={submission.pdfUrl} target="_blank" rel="noopener noreferrer" download>
                              <Button variant="outline" size="sm">
                                <Download className="w-4 h-4 mr-1" />
                                Download PDF
                              </Button>
                            </a>
                          ) : (
                            <span className="text-xs text-gray-400">No file</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Stats Footer */}
        <div className="mt-4 text-sm text-gray-500">
          Showing {filteredSubmissions.length} of {submissions.length} submissions
        </div>
      </main>
    </div>
  )
}
