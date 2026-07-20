import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getSettings, saveSettings } from "@/lib/booking/store"
import { DEFAULT_SETTINGS, type BookingSettings, type WeeklyAvailability } from "@/lib/booking/config"

// Reads the per-request session; must run per-request, never prerendered.
export const dynamic = "force-dynamic"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const settings = await getSettings()
  return NextResponse.json(settings)
}

const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/

// Validate a weekly-availability object: keys 0-6, each an array of
// {start,end} "HH:mm" ranges with start < end.
function sanitizeWeekly(input: unknown): WeeklyAvailability | null {
  if (typeof input !== "object" || input === null) return null
  const result: WeeklyAvailability = {}
  for (let day = 0; day <= 6; day++) {
    const ranges = (input as Record<string, unknown>)[String(day)]
    if (ranges === undefined) {
      result[day] = []
      continue
    }
    if (!Array.isArray(ranges)) return null
    const clean: { start: string; end: string }[] = []
    for (const r of ranges) {
      if (typeof r !== "object" || r === null) return null
      const start = (r as any).start
      const end = (r as any).end
      if (typeof start !== "string" || typeof end !== "string") return null
      if (!TIME_RE.test(start) || !TIME_RE.test(end)) return null
      if (start >= end) return null
      clean.push({ start, end })
    }
    result[day] = clean
  }
  return result
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const weekly = sanitizeWeekly(body.weekly)
    if (!weekly) {
      return NextResponse.json({ error: "Invalid availability hours." }, { status: 400 })
    }

    const settings: BookingSettings = {
      timezone: typeof body.timezone === "string" ? body.timezone : DEFAULT_SETTINGS.timezone,
      slotMinutes:
        Number.isFinite(body.slotMinutes) && body.slotMinutes > 0
          ? Math.floor(body.slotMinutes)
          : DEFAULT_SETTINGS.slotMinutes,
      minNoticeMinutes:
        Number.isFinite(body.minNoticeMinutes) && body.minNoticeMinutes >= 0
          ? Math.floor(body.minNoticeMinutes)
          : DEFAULT_SETTINGS.minNoticeMinutes,
      maxAdvanceDays:
        Number.isFinite(body.maxAdvanceDays) && body.maxAdvanceDays > 0
          ? Math.floor(body.maxAdvanceDays)
          : DEFAULT_SETTINGS.maxAdvanceDays,
      weekly,
    }

    await saveSettings(settings)
    return NextResponse.json({ success: true, settings })
  } catch (err) {
    console.error("[v0] save settings error:", err)
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 })
  }
}
