// Minimal iCalendar (RFC 5545) invite generator.
//
// We hand-roll this rather than pull a heavy dependency because we only need a
// single VEVENT with an organizer + attendee and METHOD:REQUEST, which is what
// makes Apple Mail / Gmail / Outlook treat it as an actionable invitation that
// drops straight into the recipient's calendar.

export interface IcsEvent {
  uid: string
  start: Date
  end: Date
  summary: string
  description: string
  location: string
  organizerName: string
  organizerEmail: string
  attendeeName: string
  attendeeEmail: string
  // "REQUEST" for new/updated invites, "CANCEL" to withdraw one.
  method?: "REQUEST" | "CANCEL"
  // Incremented each time the event changes; cancellations must be > the
  // sequence of the invite they cancel.
  sequence?: number
}

// Format a Date as a UTC iCalendar timestamp: 20260101T130000Z
function formatUtc(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")
}

// Escape text per RFC 5545 (commas, semicolons, backslashes, newlines).
function escapeText(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n")
}

// Fold lines longer than 75 octets as required by RFC 5545.
function foldLine(line: string): string {
  if (line.length <= 75) return line
  const chunks: string[] = []
  let remaining = line
  chunks.push(remaining.slice(0, 75))
  remaining = remaining.slice(75)
  while (remaining.length > 0) {
    chunks.push(" " + remaining.slice(0, 74))
    remaining = remaining.slice(74)
  }
  return chunks.join("\r\n")
}

export function buildIcs(event: IcsEvent): string {
  const method = event.method ?? "REQUEST"
  const sequence = event.sequence ?? 0
  const status = method === "CANCEL" ? "CANCELLED" : "CONFIRMED"

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//EWA Tracker Ltd//Booking//EN",
    "CALSCALE:GREGORIAN",
    `METHOD:${method}`,
    "BEGIN:VEVENT",
    `UID:${event.uid}`,
    `SEQUENCE:${sequence}`,
    `DTSTAMP:${formatUtc(new Date())}`,
    `DTSTART:${formatUtc(event.start)}`,
    `DTEND:${formatUtc(event.end)}`,
    `SUMMARY:${escapeText(event.summary)}`,
    `DESCRIPTION:${escapeText(event.description)}`,
    `LOCATION:${escapeText(event.location)}`,
    `STATUS:${status}`,
    `ORGANIZER;CN=${escapeText(event.organizerName)}:mailto:${event.organizerEmail}`,
    `ATTENDEE;CN=${escapeText(event.attendeeName)};ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;RSVP=TRUE:mailto:${event.attendeeEmail}`,
    "BEGIN:VALARM",
    "TRIGGER:-PT30M",
    "ACTION:DISPLAY",
    "DESCRIPTION:Reminder",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ]

  return lines.map(foldLine).join("\r\n")
}
