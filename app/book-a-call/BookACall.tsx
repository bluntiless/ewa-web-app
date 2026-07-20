"use client"

import { useState } from "react"
import useSWR from "swr"
import { Calendar, Clock, Phone, CheckCircle2, Loader2, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface Slot {
  start: string
  end: string
  label: string
}
interface DayAvailability {
  date: string
  slots: Slot[]
}
interface AvailabilityResponse {
  timezone: string
  slotMinutes: number
  days: DayAvailability[]
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

function formatDayHeading(dateStr: string): string {
  // dateStr is "YYYY-MM-DD"; render in a friendly, locale-independent way.
  const [y, m, d] = dateStr.split("-").map(Number)
  const date = new Date(Date.UTC(y, m - 1, d))
  return date.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  })
}

export default function BookACall() {
  const { data, error, isLoading, mutate } = useSWR<AvailabilityResponse>(
    "/api/book-a-call/availability",
    fetcher,
  )

  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null)
  const [form, setForm] = useState({ name: "", email: "", phone: "", notes: "" })
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [confirmed, setConfirmed] = useState<{ start: string } | null>(null)

  const days = data?.days ?? []
  const activeDate = selectedDate ?? days[0]?.date ?? null
  const activeDay = days.find((d) => d.date === activeDate)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedSlot) return
    setSubmitting(true)
    setSubmitError(null)

    try {
      const res = await fetch("/api/book-a-call/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, start: selectedSlot.start }),
      })
      const result = await res.json()

      if (!res.ok) {
        setSubmitError(result.error || "Something went wrong. Please try again.")
        // If the slot was taken, refresh availability and step back.
        if (res.status === 409) {
          await mutate()
          setSelectedSlot(null)
        }
        return
      }

      setConfirmed({ start: selectedSlot.start })
    } catch {
      setSubmitError("Network error. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  // Success screen.
  if (confirmed) {
    const when = new Date(confirmed.start).toLocaleString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: data?.timezone || "Europe/London",
    })
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 text-center max-w-xl mx-auto">
        <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">You&apos;re booked in!</h2>
        <p className="text-gray-600 mb-6">
          Your call is confirmed for <strong>{when}</strong>. We&apos;ve emailed you a confirmation
          with a calendar invite, and we&apos;ll call you on the number you provided.
        </p>
        <p className="text-sm text-gray-500">
          Need to rearrange? Just reply to the confirmation email.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Info bar */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 bg-blue-700 text-white px-6 py-4 text-sm">
        <span className="flex items-center gap-2">
          <Clock className="w-4 h-4" /> 30 minutes
        </span>
        <span className="flex items-center gap-2">
          <Phone className="w-4 h-4" /> Phone call
        </span>
        <span className="flex items-center gap-2">
          <Calendar className="w-4 h-4" /> Free consultation
        </span>
      </div>

      <div className="p-6 md:p-8">
        {isLoading && (
          <div className="flex items-center justify-center py-16 text-gray-500">
            <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading available times…
          </div>
        )}

        {error && (
          <div className="text-center py-16 text-gray-600">
            We couldn&apos;t load available times. Please refresh the page or call us on{" "}
            <a href="tel:+447828893976" className="text-blue-700 font-medium">
              07828 893976
            </a>
            .
          </div>
        )}

        {!isLoading && !error && days.length === 0 && (
          <div className="text-center py-16 text-gray-600">
            There are no available slots right now. Please check back soon or call us on{" "}
            <a href="tel:+447828893976" className="text-blue-700 font-medium">
              07828 893976
            </a>
            .
          </div>
        )}

        {!isLoading && !error && days.length > 0 && !selectedSlot && (
          <div className="grid md:grid-cols-[220px_1fr] gap-6">
            {/* Date column */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Select a date
              </h3>
              <div className="flex md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0">
                {days.map((day) => {
                  const isActive = day.date === activeDate
                  return (
                    <button
                      key={day.date}
                      onClick={() => setSelectedDate(day.date)}
                      className={`text-left px-4 py-3 rounded-lg border whitespace-nowrap transition-colors ${
                        isActive
                          ? "border-blue-600 bg-blue-50 text-blue-800 font-semibold"
                          : "border-gray-200 hover:border-blue-300 text-gray-700"
                      }`}
                    >
                      {formatDayHeading(day.date)}
                      <span className="block text-xs text-gray-500 font-normal">
                        {day.slots.length} slot{day.slots.length === 1 ? "" : "s"}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Slots column */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                {activeDay ? formatDayHeading(activeDay.date) : "Available times"}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {activeDay?.slots.map((slot) => (
                  <button
                    key={slot.start}
                    onClick={() => {
                      setSelectedSlot(slot)
                      setSubmitError(null)
                    }}
                    className="px-4 py-3 rounded-lg border border-gray-200 text-gray-800 font-medium hover:border-blue-500 hover:bg-blue-50 transition-colors"
                  >
                    {slot.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Booking form */}
        {selectedSlot && (
          <div className="max-w-lg mx-auto">
            <button
              onClick={() => setSelectedSlot(null)}
              className="flex items-center gap-1 text-sm text-blue-700 hover:underline mb-4"
            >
              <ArrowLeft className="w-4 h-4" /> Back to times
            </button>

            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6 flex items-center gap-3">
              <Calendar className="w-5 h-5 text-blue-700" />
              <div>
                <p className="font-semibold text-blue-900">
                  {formatDayHeading(activeDate!)} at {selectedSlot.label}
                </p>
                <p className="text-sm text-blue-700">30-minute phone call</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Full name *</Label>
                <Input
                  id="name"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="The number we should call"
                />
              </div>
              <div>
                <Label htmlFor="notes">Anything you&apos;d like us to know? (optional)</Label>
                <Textarea
                  id="notes"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="e.g. your current qualifications or questions"
                  rows={3}
                />
              </div>

              {submitError && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                  {submitError}
                </p>
              )}

              <Button type="submit" disabled={submitting} className="w-full bg-blue-700 hover:bg-blue-800">
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Booking…
                  </>
                ) : (
                  "Confirm booking"
                )}
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
