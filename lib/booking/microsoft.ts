// Microsoft 365 (Graph) calendar integration.
//
// Uses the OAuth client-credentials flow (app-only) via MSAL so the server can
// read free/busy and create events on a specific user's calendar without an
// interactive login. Requires an Azure app registration with the
// Calendars.ReadWrite APPLICATION permission and admin consent granted.
//
// Credentials: this reuses the SAME Azure app registration already configured
// for SharePoint (SHAREPOINT_TENANT_ID / SHAREPOINT_CLIENT_ID /
// SHAREPOINT_CLIENT_SECRET). It also accepts MS_* names as an override if you
// ever want a separate app. The Azure app MUST have the Calendars.ReadWrite
// APPLICATION permission with admin consent granted, in addition to whatever
// SharePoint permissions it already has.
//
// Env vars:
//   SHAREPOINT_TENANT_ID / MS_TENANT_ID       - Directory (tenant) ID
//   SHAREPOINT_CLIENT_ID / MS_CLIENT_ID       - Application (client) ID
//   SHAREPOINT_CLIENT_SECRET / MS_CLIENT_SECRET - A client secret value
//   BOOKING_CALENDAR_USER / MS_USER_ID        - Mailbox to manage (defaults to ADMIN_EMAIL)
//
// Every function degrades gracefully: if credentials are missing or a request
// fails, we log and return a safe fallback so a calendar outage never takes the
// booking page down.

import { ConfidentialClientApplication } from "@azure/msal-node"

const GRAPH = "https://graph.microsoft.com/v1.0"

function tenantId(): string | undefined {
  return process.env.SHAREPOINT_TENANT_ID || process.env.MS_TENANT_ID
}
function clientId(): string | undefined {
  return process.env.SHAREPOINT_CLIENT_ID || process.env.MS_CLIENT_ID
}
function clientSecret(): string | undefined {
  return process.env.SHAREPOINT_CLIENT_SECRET || process.env.MS_CLIENT_SECRET
}
// The mailbox whose calendar we read/write. Falls back to the admin email.
export function calendarUser(): string | undefined {
  return process.env.BOOKING_CALENDAR_USER || process.env.MS_USER_ID || process.env.ADMIN_EMAIL
}

export function microsoftConfigured(): boolean {
  return Boolean(tenantId() && clientId() && clientSecret() && calendarUser())
}

let cachedApp: ConfidentialClientApplication | null = null

function getApp(): ConfidentialClientApplication {
  if (!cachedApp) {
    cachedApp = new ConfidentialClientApplication({
      auth: {
        clientId: clientId()!,
        authority: `https://login.microsoftonline.com/${tenantId()}`,
        clientSecret: clientSecret()!,
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
    const mailbox = calendarUser()!
    const res = await fetch(`${GRAPH}/users/${encodeURIComponent(mailbox)}/calendar/getSchedule`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        schedules: [mailbox],
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
    const res = await fetch(`${GRAPH}/users/${encodeURIComponent(calendarUser()!)}/events`, {
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

// Diagnostic helper: reports config state, token acquisition, the tenant's
// real user mailboxes (so we can pick a valid BOOKING_CALENDAR_USER), and
// whether calendar access works for the currently configured mailbox. This is
// used by a temporary admin diagnostic endpoint and is safe to remove later.
export async function diagnoseMicrosoft(): Promise<Record<string, unknown>> {
  const out: Record<string, unknown> = {
    configured: microsoftConfigured(),
    tenantIdPresent: Boolean(tenantId()),
    clientIdPresent: Boolean(clientId()),
    clientSecretPresent: Boolean(clientSecret()),
    currentMailbox: calendarUser() ?? null,
  }

  const token = await getToken()
  out.tokenAcquired = Boolean(token)
  if (!token) {
    out.hint = "Token failed. Check SHAREPOINT_* credentials are correct."
    return out
  }

  // MOST IMPORTANT TEST FIRST: actually create then delete a real event on the
  // configured mailbox. This is exactly what a booking does, so it is the true
  // verdict on whether native M365 calendar writing will work.
  const mailbox = calendarUser()
  if (!mailbox) {
    out.calendarWriteOk = false
    out.calendarWriteError = "No mailbox configured. Set BOOKING_CALENDAR_USER."
    return out
  }
  try {
    const start = new Date(Date.now() + 24 * 3600_000)
    const end = new Date(start.getTime() + 30 * 60_000)
    const createRes = await fetch(`${GRAPH}/users/${encodeURIComponent(mailbox)}/events`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        subject: "EWA Tracker — diagnostic test (safe to ignore)",
        start: { dateTime: start.toISOString(), timeZone: "UTC" },
        end: { dateTime: end.toISOString(), timeZone: "UTC" },
      }),
    })
    if (createRes.ok) {
      const created = await createRes.json()
      out.calendarWriteOk = true
      // Clean up the test event immediately so it doesn't linger.
      if (created?.id) {
        await fetch(`${GRAPH}/users/${encodeURIComponent(mailbox)}/events/${created.id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        })
        out.testEventCleanedUp = true
      }
    } else {
      out.calendarWriteOk = false
      out.calendarWriteError = `${createRes.status}: ${await createRes.text()}`
      out.calendarWriteHint =
        "'MailboxNotEnabledForRESTAPI' or 'ErrorInvalidUser' = this account has no Exchange Online mailbox/licence, so native M365 writing isn't possible (Apple Calendar via email invite still works). A permission error = add Calendars.ReadWrite (application) with admin consent in Azure."
    }
  } catch (err) {
    out.calendarWriteOk = false
    out.calendarWriteError = String(err)
  }

  return out
}

// Cancel a previously created Microsoft event. Best-effort.
export async function cancelMicrosoftEvent(eventId: string): Promise<void> {
  if (!microsoftConfigured() || !eventId) return
  const token = await getToken()
  if (!token) return

  try {
    await fetch(`${GRAPH}/users/${encodeURIComponent(calendarUser()!)}/events/${eventId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
  } catch (err) {
    console.error("[v0] Microsoft cancelEvent error:", err)
  }
}
