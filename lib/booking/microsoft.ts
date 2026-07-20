// Microsoft 365 (Graph) calendar integration.
//
// Uses the OAuth client-credentials flow (app-only) via MSAL so the server can
// read free/busy and create events on a specific user's calendar without an
// interactive login. Requires an Azure app registration with the
// Calendars.ReadWrite APPLICATION permission and admin consent granted.
//
// Env vars:
//   MS_TENANT_ID     - Directory (tenant) ID
//   MS_CLIENT_ID     - Application (client) ID
//   MS_CLIENT_SECRET - A client secret value
//   MS_USER_ID       - The mailbox to manage (email or object id), e.g. you@ewatracker.co.uk
//
// Every function degrades gracefully: if credentials are missing or a request
// fails, we log and return a safe fallback so a calendar outage never takes the
// booking page down.

import { ConfidentialClientApplication } from "@azure/msal-node"

const GRAPH = "https://graph.microsoft.com/v1.0"

export function microsoftConfigured(): boolean {
  return Boolean(
    process.env.MS_TENANT_ID &&
      process.env.MS_CLIENT_ID &&
      process.env.MS_CLIENT_SECRET &&
      process.env.MS_USER_ID,
  )
}

let cachedApp: ConfidentialClientApplication | null = null

function getApp(): ConfidentialClientApplication {
  if (!cachedApp) {
    cachedApp = new ConfidentialClientApplication({
      auth: {
        clientId: process.env.MS_CLIENT_ID!,
        authority: `https://login.microsoftonline.com/${process.env.MS_TENANT_ID}`,
        clientSecret: process.env.MS_CLIENT_SECRET!,
      },
    })
  }
  return cachedApp
}

async function getToken(): Promise<string | null> {
  try {
    const result = await getApp().acquireTokenByClientCredential({
      scopes: ["https://graph.microsoft.com/.default"],
    })
    return result?.accessToken ?? null
  } catch (err) {
    console.error("[v0] Microsoft token acquisition failed:", err)
    return null
  }
}

export interface BusyInterval {
  start: Date
  end: Date
}

// Read busy intervals from the configured Microsoft 365 calendar between two
// instants. Returns [] if unavailable so callers can treat "no data" as "no
// known Microsoft conflicts".
export async function getMicrosoftBusy(rangeStart: Date, rangeEnd: Date): Promise<BusyInterval[]> {
  if (!microsoftConfigured()) return []
  const token = await getToken()
  if (!token) return []

  try {
    const res = await fetch(`${GRAPH}/users/${encodeURIComponent(process.env.MS_USER_ID!)}/calendar/getSchedule`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        schedules: [process.env.MS_USER_ID],
        startTime: { dateTime: rangeStart.toISOString(), timeZone: "UTC" },
        endTime: { dateTime: rangeEnd.toISOString(), timeZone: "UTC" },
        availabilityViewInterval: 30,
      }),
    })

    if (!res.ok) {
      console.error("[v0] Microsoft getSchedule failed:", res.status, await res.text())
      return []
    }

    const data = await res.json()
    const items = data?.value?.[0]?.scheduleItems ?? []
    return items
      .filter((i: any) => i.status && i.status !== "free")
      .map((i: any) => ({
        start: new Date(i.start.dateTime + "Z"),
        end: new Date(i.end.dateTime + "Z"),
      }))
  } catch (err) {
    console.error("[v0] Microsoft getSchedule error:", err)
    return []
  }
}

// Create a calendar event on the Microsoft 365 calendar. Returns the created
// event id (used later to cancel), or null on failure.
export async function createMicrosoftEvent(params: {
  subject: string
  body: string
  start: Date
  end: Date
  attendeeName: string
  attendeeEmail: string
  location: string
}): Promise<string | null> {
  if (!microsoftConfigured()) return null
  const token = await getToken()
  if (!token) return null

  try {
    const res = await fetch(`${GRAPH}/users/${encodeURIComponent(process.env.MS_USER_ID!)}/events`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        subject: params.subject,
        body: { contentType: "HTML", content: params.body },
        start: { dateTime: params.start.toISOString(), timeZone: "UTC" },
        end: { dateTime: params.end.toISOString(), timeZone: "UTC" },
        location: { displayName: params.location },
        attendees: [
          {
            emailAddress: { address: params.attendeeEmail, name: params.attendeeName },
            type: "required",
          },
        ],
      }),
    })

    if (!res.ok) {
      console.error("[v0] Microsoft createEvent failed:", res.status, await res.text())
      return null
    }

    const data = await res.json()
    return data?.id ?? null
  } catch (err) {
    console.error("[v0] Microsoft createEvent error:", err)
    return null
  }
}

// Cancel a previously created Microsoft event. Best-effort.
export async function cancelMicrosoftEvent(eventId: string): Promise<void> {
  if (!microsoftConfigured() || !eventId) return
  const token = await getToken()
  if (!token) return

  try {
    await fetch(`${GRAPH}/users/${encodeURIComponent(process.env.MS_USER_ID!)}/events/${eventId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
  } catch (err) {
    console.error("[v0] Microsoft cancelEvent error:", err)
  }
}
