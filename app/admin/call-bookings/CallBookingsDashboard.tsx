"use client"

import { Fragment, useState } from "react"
import useSWR from "swr"
import type { Session } from "next-auth"
import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import {
  Phone,
  Calendar,
  Clock,
  RefreshCw,
  LogOut,
  X,
  ChevronRight,
  Mail,
  User,
  FileText,
  Settings,
  Check,
} from "lucide-react"
import Link from "next/link"

type BookingStatus = "confirmed" | "cancelled"

interface CallBooking {
  id: string
  name: string
  email: string
  phone: string
  experience?: string
  has18thEdition?: string
  hasInspectionTesting?: string
  notes?: string
  start: string
  end: string
  status: BookingStatus
  createdAt: string
  cancelledAt?: string
}

type DayRange = { start: string; end: string }
interface BookingSettings {
  timezone: string
  slotMinutes: number
  minNoticeMinutes: number
  maxAdvanceDays: number
  weekly: { [day: number]: DayRange[] }
}

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

const fetcher = (url: string) => fetch(url).then((r) => r.json())

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function CallBookingsDashboard({ session }: { session: Session | null }) {
  const {
    data: bookingsData,
    isLoading: bookingsLoading,
    mutate: mutateBookings,
  } = useSWR<{ bookings: CallBooking[] }>("/api/admin/call-bookings/list", fetcher)
  const { data: settingsData, mutate: mutateSettings } = useSWR<BookingSettings>(
    "/api/admin/call-bookings/settings",
    fetcher,
  )

  const [cancellingId, setCancellingId] = useState<string | null>(null)
  const [showSettings, setShowSettings] = useState(false)

  const bookings = bookingsData?.bookings ?? []
  const now = Date.now()
  const upcoming = bookings.filter((b) => b.status === "confirmed" && new Date(b.start).getTime() >= now)
  const past = bookings.filter((b) => b.status !== "confirmed" || new Date(b.start).getTime() < now)

  const handleCancel = async (id: string) => {
    if (!confirm("Cancel this call? The booker will be notified and the slot freed up.")) return
    setCancellingId(id)
    try {
      const res = await fetch(`/api/admin/call-bookings/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to cancel")
      await mutateBookings()
    } catch (err) {
      alert("Failed to cancel booking")
      console.error(err)
    } finally {
      setCancellingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Phone className="w-5 h-5 text-blue-700" />
            <h1 className="text-lg font-semibold text-gray-900">Call Bookings</h1>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Link href="/admin/bookings">
              <Button variant="ghost" size="sm">
                Course Bookings
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
            <Link href="/admin/skills-scan">
              <Button variant="ghost" size="sm">
                Skills Scan
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
            <Button variant="ghost" size="sm" onClick={() => signOut({ callbackUrl: "/admin/login" })}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="flex gap-4">
            <div className="bg-white rounded-lg border border-gray-200 px-5 py-3">
              <p className="text-xs text-gray-500">Upcoming calls</p>
              <p className="text-2xl font-bold text-blue-700">{upcoming.length}</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 px-5 py-3">
              <p className="text-xs text-gray-500">Total booked</p>
              <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowSettings((s) => !s)}>
              <Settings className="w-4 h-4 mr-1" />
              Availability Hours
            </Button>
            <Button variant="outline" size="sm" onClick={() => mutateBookings()}>
              <RefreshCw className="w-4 h-4 mr-1" />
              Refresh
            </Button>
          </div>
        </div>

        {showSettings && settingsData?.weekly && (
          <AvailabilityEditor
            settings={settingsData}
            onSaved={() => {
              mutateSettings()
              mutateBookings()
            }}
          />
        )}

        {/* Upcoming */}
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">Upcoming</h2>
          {bookingsLoading ? (
            <p className="text-sm text-gray-500">Loading…</p>
          ) : upcoming.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <Calendar className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No upcoming calls booked.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcoming.map((b) => (
                <BookingCard key={b.id} booking={b} onCancel={handleCancel} cancelling={cancellingId === b.id} />
              ))}
            </div>
          )}
        </section>

        {/* Past / cancelled */}
        {past.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">Past &amp; cancelled</h2>
            <div className="space-y-3 opacity-75">
              {past.map((b) => (
                <BookingCard key={b.id} booking={b} onCancel={handleCancel} cancelling={cancellingId === b.id} isPast />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

function BookingCard({
  booking,
  onCancel,
  cancelling,
  isPast,
}: {
  booking: CallBooking
  onCancel: (id: string) => void
  cancelling: boolean
  isPast?: boolean
}) {
  const cancelled = booking.status === "cancelled"
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex-1 min-w-[240px]">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-blue-700" />
            <span className="font-semibold text-gray-900">{formatDateTime(booking.start)}</span>
            {cancelled && (
              <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">Cancelled</span>
            )}
          </div>
          <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1 text-sm text-gray-600">
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-gray-400" />
              {booking.name}
            </span>
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-gray-400" />
              <a href={`tel:${booking.phone}`} className="text-blue-700 hover:underline">
                {booking.phone}
              </a>
            </span>
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-gray-400" />
              <a href={`mailto:${booking.email}`} className="text-blue-700 hover:underline">
                {booking.email}
              </a>
            </span>
          </div>
          {(booking.experience || booking.has18thEdition || booking.hasInspectionTesting) && (
            <div className="mt-3 border-t border-gray-100 pt-3 space-y-1.5 text-sm text-gray-600">
              {booking.experience && (
                <p>
                  <span className="font-medium text-gray-700">Experience:</span> {booking.experience}
                </p>
              )}
              {booking.has18thEdition && (
                <p>
                  <span className="font-medium text-gray-700">18th Edition (BS 7671):</span>{" "}
                  {booking.has18thEdition}
                </p>
              )}
              {booking.hasInspectionTesting && (
                <p>
                  <span className="font-medium text-gray-700">Inspection &amp; Testing:</span>{" "}
                  {booking.hasInspectionTesting}
                </p>
              )}
            </div>
          )}
          {booking.notes && (
            <p className="mt-2 text-sm text-gray-600 flex items-start gap-1.5">
              <FileText className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />
              {booking.notes}
            </p>
          )}
        </div>
        {!cancelled && !isPast && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onCancel(booking.id)}
            disabled={cancelling}
            className="text-gray-500 hover:text-red-600"
          >
            <X className="w-4 h-4 mr-1" />
            {cancelling ? "Cancelling…" : "Cancel"}
          </Button>
        )}
      </div>
    </div>
  )
}

function AvailabilityEditor({ settings, onSaved }: { settings: BookingSettings; onSaved: () => void }) {
  const [weekly, setWeekly] = useState(settings.weekly)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const setDayEnabled = (day: number, enabled: boolean) => {
    setWeekly((w) => ({ ...w, [day]: enabled ? [{ start: "13:00", end: "19:00" }] : [] }))
    setSaved(false)
  }
  const setRange = (day: number, field: "start" | "end", value: string) => {
    setWeekly((w) => ({ ...w, [day]: [{ ...(w[day]?.[0] ?? { start: "13:00", end: "19:00" }), [field]: value }] }))
    setSaved(false)
  }

  const save = async () => {
    setSaving(true)
    try {
      const res = await fetch("/api/admin/call-bookings/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...settings, weekly }),
      })
      if (!res.ok) throw new Error("Failed to save")
      setSaved(true)
      onSaved()
    } catch (err) {
      alert("Failed to save availability")
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 mb-8">
      <h3 className="text-sm font-semibold text-gray-900 mb-1">Weekly availability</h3>
      <p className="text-xs text-gray-500 mb-4">
        Bookable hours in {settings.timezone}. Slots are {settings.slotMinutes} minutes. Toggle a day off to stop taking
        calls that day.
      </p>
      <div className="space-y-2">
        {[1, 2, 3, 4, 5, 6, 0].map((day) => {
          const ranges = weekly[day] ?? []
          const enabled = ranges.length > 0
          const range = ranges[0] ?? { start: "13:00", end: "19:00" }
          return (
            <div key={day} className="flex items-center gap-3 flex-wrap">
              <label className="flex items-center gap-2 w-32 shrink-0 cursor-pointer">
                <input type="checkbox" checked={enabled} onChange={(e) => setDayEnabled(day, e.target.checked)} />
                <span className="text-sm text-gray-700">{DAY_NAMES[day]}</span>
              </label>
              {enabled ? (
                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    value={range.start}
                    onChange={(e) => setRange(day, "start", e.target.value)}
                    className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm"
                  />
                  <span className="text-gray-400 text-sm">to</span>
                  <input
                    type="time"
                    value={range.end}
                    onChange={(e) => setRange(day, "end", e.target.value)}
                    className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm"
                  />
                </div>
              ) : (
                <span className="text-sm text-gray-400">Closed</span>
              )}
            </div>
          )
        })}
      </div>
      <div className="mt-4 flex items-center gap-3">
        <Button size="sm" onClick={save} disabled={saving}>
          {saving ? "Saving…" : "Save hours"}
        </Button>
        {saved && (
          <span className="text-sm text-green-700 flex items-center gap-1">
            <Check className="w-4 h-4" />
            Saved
          </span>
        )}
      </div>
    </div>
  )
}
