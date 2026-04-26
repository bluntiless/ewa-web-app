"use client"

import { useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  FileText,
  Download,
  Eye,
  Archive,
  RefreshCw,
  LogOut,
  Search,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Receipt,
  Mail,
  CreditCard,
  GraduationCap,
  Crown,
  ChevronRight,
} from "lucide-react"
import type { BookingMetadata, BookingStatus } from "@/lib/booking-types"
import BookingDetailModal from "./BookingDetailModal"
import Link from "next/link"

const statusConfig: Record<BookingStatus, { label: string; color: string; icon: typeof Clock }> = {
  pending: { label: "Pending Review", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  invoice_generated: { label: "Invoice Generated", color: "bg-blue-100 text-blue-800", icon: Receipt },
  invoice_sent: { label: "Invoice Sent", color: "bg-indigo-100 text-indigo-800", icon: Mail },
  paid: { label: "Paid", color: "bg-green-100 text-green-800", icon: CreditCard },
  registered_eal: { label: "EAL Registered", color: "bg-purple-100 text-purple-800", icon: GraduationCap },
  in_progress: { label: "In Progress", color: "bg-cyan-100 text-cyan-800", icon: RefreshCw },
  completed: { label: "Completed", color: "bg-emerald-100 text-emerald-800", icon: CheckCircle },
  archived: { label: "Archived", color: "bg-gray-100 text-gray-800", icon: Archive },
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(amount)
}

export default function BookingsDashboard() {
  const { data: session } = useSession()
  const [bookings, setBookings] = useState<BookingMetadata[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "all">("all")
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null)
  const [showArchived, setShowArchived] = useState(false)

  const fetchBookings = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/admin/bookings/list")
      if (!response.ok) throw new Error("Failed to fetch bookings")

      const data = await response.json()
      setBookings(data.bookings || [])
    } catch (err) {
      setError("Failed to load bookings. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  const filteredBookings = bookings.filter((booking) => {
    // Filter by archived status
    if (!showArchived && booking.status === "archived") return false
    if (showArchived && booking.status !== "archived") return false

    // Filter by status
    if (statusFilter !== "all" && booking.status !== statusFilter) return false

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        booking.candidateName.toLowerCase().includes(query) ||
        booking.email.toLowerCase().includes(query) ||
        booking.id.toLowerCase().includes(query)
      )
    }

    return true
  })

  const handleArchive = async (id: string) => {
    if (!confirm("Are you sure you want to archive this booking?")) return

    try {
      const response = await fetch(`/api/admin/bookings/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to archive")

      await fetchBookings()
    } catch (err) {
      alert("Failed to archive booking")
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

  // Stats
  const stats = {
    pending: bookings.filter((b) => b.status === "pending").length,
    awaitingPayment: bookings.filter((b) => ["invoice_generated", "invoice_sent"].includes(b.status)).length,
    paid: bookings.filter((b) => b.status === "paid").length,
    totalRevenue: bookings
      .filter((b) => b.status === "paid")
      .reduce((sum, b) => sum + (b.totalAmount || 0), 0),
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Course Bookings</h1>
            <p className="text-sm text-gray-500">Admin Dashboard</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin/skills-scan">
              <Button variant="ghost" size="sm">
                Skills Scans
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
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
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                <p className="text-sm text-gray-500">Pending Review</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Receipt className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.awaitingPayment}</p>
                <p className="text-sm text-gray-500">Awaiting Payment</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.paid}</p>
                <p className="text-sm text-gray-500">Paid</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
                <p className="text-sm text-gray-500">Total Revenue</p>
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

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as BookingStatus | "all")}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="invoice_generated">Invoice Generated</option>
              <option value="invoice_sent">Invoice Sent</option>
              <option value="paid">Paid</option>
              <option value="registered_eal">EAL Registered</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>

            <Button
              variant={showArchived ? "default" : "outline"}
              size="sm"
              onClick={() => setShowArchived(!showArchived)}
            >
              <Archive className="w-4 h-4 mr-2" />
              {showArchived ? "Showing Archived" : "Show Archived"}
            </Button>

            <Button variant="outline" size="sm" onClick={fetchBookings} disabled={isLoading}>
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

        {/* Bookings Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center text-gray-500">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3" />
              Loading bookings...
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="font-medium">No bookings found</p>
              <p className="text-sm">
                {showArchived
                  ? "No archived bookings yet."
                  : "Course bookings will appear here."}
              </p>
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
                      Service
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Amount
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
                  {filteredBookings.map((booking) => {
                    const status = statusConfig[booking.status] || statusConfig.pending
                    const StatusIcon = status.icon

                    return (
                      <tr key={booking.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4">
                          <div>
                            <p className="font-medium text-gray-900 flex items-center gap-2">
                              {booking.candidateName}
                              {booking.serviceOption === "gold" && (
                                <Crown className="w-4 h-4 text-amber-500" />
                              )}
                            </p>
                            <p className="text-sm text-gray-500">{booking.email}</p>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {booking.serviceOption === "gold" ? "Gold Service" : "Standard"}
                            </p>
                            <p className="text-xs text-gray-500">
                              {booking.paymentOption === "full" ? "Full Payment" : "Instalments"}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              {booking.invoiceAmount ? formatCurrency(booking.invoiceAmount) : "—"}
                            </p>
                            {booking.totalAmount && booking.invoiceAmount !== booking.totalAmount && (
                              <p className="text-xs text-gray-500">
                                of {formatCurrency(booking.totalAmount)}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <p className="text-sm text-gray-600">{formatDate(booking.submittedAt)}</p>
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
                              onClick={() => setSelectedBooking(booking.id)}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                            {booking.status !== "archived" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleArchive(booking.id)}
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
            </div>
          )}
        </div>

        {/* Stats Footer */}
        <div className="mt-4 text-sm text-gray-500">
          Showing {filteredBookings.length} of{" "}
          {bookings.filter((b) => (showArchived ? b.status === "archived" : b.status !== "archived")).length} bookings
        </div>
      </main>

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <BookingDetailModal
          bookingId={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onUpdate={fetchBookings}
        />
      )}
    </div>
  )
}
