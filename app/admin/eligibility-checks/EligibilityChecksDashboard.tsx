"use client"

import { Fragment, useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  FileText,
  RefreshCw,
  LogOut,
  Search,
  Clock,
  Eye,
  XCircle,
  AlertCircle,
  Trash2,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
} from "lucide-react"
import Link from "next/link"
import type { EligibilityCheckSubmission, EligibilityStatus } from "@/app/api/admin/eligibility-checks/list/route"

const statusConfig: Record<EligibilityStatus, { label: string; color: string; icon: typeof Clock }> = {
  pending: { label: "Pending Review", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  reviewed: { label: "Reviewed", color: "bg-blue-100 text-blue-800", icon: Eye },
  failed: { label: "Failed", color: "bg-red-100 text-red-800", icon: XCircle },
}

// Colour the eligibility outcome text based on its wording.
function resultColor(result?: string): string {
  const r = (result || "").toUpperCase()
  if (r.includes("LIKELY SUITABLE")) return "bg-green-100 text-green-800"
  if (r.includes("NOT") || r.includes("FURTHER REVIEW")) return "bg-red-100 text-red-800"
  if (r) return "bg-amber-100 text-amber-800"
  return "bg-gray-100 text-gray-600"
}

export default function EligibilityChecksDashboard() {
  const { data: session } = useSession()
  const [submissions, setSubmissions] = useState<EligibilityCheckSubmission[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<EligibilityStatus | "all">("all")
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const fetchSubmissions = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/admin/eligibility-checks/list")
      if (!response.ok) throw new Error("Failed to fetch")
      const data = await response.json()
      setSubmissions(data.submissions || [])
    } catch (err) {
      setError("Failed to load eligibility checks. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSubmissions()
  }, [])

  const filteredSubmissions = submissions.filter((sub) => {
    if (statusFilter !== "all" && (sub.status ?? "pending") !== statusFilter) return false
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        sub.candidateName.toLowerCase().includes(query) ||
        sub.email.toLowerCase().includes(query) ||
        (sub.eligibilityResult || "").toLowerCase().includes(query)
      )
    }
    return true
  })

  const handleStatusChange = async (id: string, status: EligibilityStatus) => {
    setUpdatingId(id)
    setSubmissions((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)))
    try {
      const response = await fetch(`/api/admin/eligibility-checks/${id}`, {
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

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this eligibility check permanently?")) return
    try {
      const response = await fetch(`/api/admin/eligibility-checks/${id}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Failed to delete")
      await fetchSubmissions()
    } catch (err) {
      alert("Failed to delete eligibility check")
      console.error(err)
    }
  }

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Eligibility Checks</h1>
            <p className="text-sm text-gray-500">Admin Dashboard</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin/bookings">
              <Button variant="ghost" size="sm">
                Course Bookings
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
            <Link href="/admin/skills-scan">
              <Button variant="ghost" size="sm">
                Skills Scans
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
            <Link href="/admin/candidate-background">
              <Button variant="ghost" size="sm">
                Background Forms
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
        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search by name, email, or result..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as EligibilityStatus | "all")}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="reviewed">Reviewed</option>
              <option value="failed">Failed</option>
            </select>
            <Button variant="outline" size="sm" onClick={fetchSubmissions} disabled={isLoading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-800">{error}</span>
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center text-gray-500">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3" />
              Loading eligibility checks...
            </div>
          ) : filteredSubmissions.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <ClipboardCheck className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="font-medium">No eligibility checks found</p>
              <p className="text-sm">Completed eligibility checks will appear here.</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="w-8 px-2 py-3" />
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Candidate
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Result
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
                  const status = statusConfig[submission.status ?? "pending"] ?? statusConfig.pending
                  const StatusIcon = status.icon
                  const isExpanded = expandedId === submission.id

                  return (
                    <Fragment key={submission.id}>
                      <tr className="hover:bg-gray-50">
                        <td className="px-2 py-4 text-center">
                          <button
                            onClick={() => setExpandedId(isExpanded ? null : submission.id)}
                            aria-label={isExpanded ? "Collapse details" : "Expand details"}
                            className="text-gray-400 hover:text-gray-700"
                          >
                            {isExpanded ? (
                              <ChevronDown className="w-4 h-4" />
                            ) : (
                              <ChevronRight className="w-4 h-4" />
                            )}
                          </button>
                        </td>
                        <td className="px-4 py-4">
                          <div>
                            <p className="font-medium text-gray-900">{submission.candidateName}</p>
                            <p className="text-sm text-gray-500">{submission.email || "No email provided"}</p>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${resultColor(
                              submission.eligibilityResult,
                            )}`}
                          >
                            {submission.eligibilityResult || "No result"}
                          </span>
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
                            <select
                              value={submission.status ?? "pending"}
                              onChange={(e) =>
                                handleStatusChange(submission.id, e.target.value as EligibilityStatus)
                              }
                              disabled={updatingId === submission.id}
                              aria-label="Update review status"
                              className="px-2 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-700 disabled:opacity-50"
                            >
                              <option value="pending">Mark Pending</option>
                              <option value="reviewed">Mark Reviewed</option>
                              <option value="failed">Mark Failed</option>
                            </select>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(submission.id)}
                              className="text-gray-500 hover:text-red-600"
                              aria-label="Delete eligibility check"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr className="bg-gray-50">
                          <td colSpan={6} className="px-6 py-4">
                            <div className="grid gap-4 md:grid-cols-2 text-sm">
                              <div>
                                <p className="text-gray-500">Phone</p>
                                <p className="font-medium text-gray-900">{submission.phone || "Not provided"}</p>
                              </div>
                              <div>
                                <p className="text-gray-500">Experience</p>
                                <p className="font-medium text-gray-900">{submission.experience || "Not provided"}</p>
                              </div>
                              <div>
                                <p className="text-gray-500">Level 2 Qualification</p>
                                <p className="font-medium text-gray-900">
                                  {submission.level2Qualification || "Not provided"}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-500">Level 3 Qualification</p>
                                <p className="font-medium text-gray-900">
                                  {submission.level3Qualification || "Not provided"}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-500">18th Edition (BS 7671)</p>
                                <p className="font-medium text-gray-900">{submission.bs7671Status || "Not provided"}</p>
                              </div>
                              <div>
                                <p className="text-gray-500">Inspection &amp; Testing</p>
                                <p className="font-medium text-gray-900">{submission.itStatus || "Not provided"}</p>
                              </div>
                              <div>
                                <p className="text-gray-500">Main Work Type</p>
                                <p className="font-medium text-gray-900">{submission.workType || "Not provided"}</p>
                              </div>
                              <div>
                                <p className="text-gray-500">Likely EWA Pathway</p>
                                <p className="font-medium text-gray-900">{submission.pathway || "Not provided"}</p>
                              </div>
                              {submission.recommendations && (
                                <div className="md:col-span-2">
                                  <p className="text-gray-500">Recommended Next Step</p>
                                  <p className="font-medium text-gray-900">{submission.recommendations}</p>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>

        <div className="mt-4 text-sm text-gray-500">
          Showing {filteredSubmissions.length} of {submissions.length} eligibility checks
        </div>
      </main>
    </div>
  )
}
