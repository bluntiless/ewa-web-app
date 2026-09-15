// Shared server-side validation for candidate contact details on eligibility
// checks. Name, email and phone are all mandatory: without them we cannot send
// the result or follow up, so the check is rejected rather than stored as an
// "Unnamed candidate".

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
// UK mobiles/landlines with optional +44, spaces, dashes or brackets.
const PHONE_PATTERN = /^(\+44\s?|0)[0-9\s\-()]{9,14}$/

export interface ContactDetails {
  candidateName: string
  email: string
  phone: string
}

export type ContactValidation =
  | { ok: true; contact: ContactDetails }
  | { ok: false; error: string; missing: Array<"name" | "email" | "phone"> }

export function validateContactDetails(input: {
  candidateName?: unknown
  email?: unknown
  phone?: unknown
}): ContactValidation {
  const candidateName = typeof input.candidateName === "string" ? input.candidateName.trim() : ""
  const email = typeof input.email === "string" ? input.email.trim() : ""
  const phone = typeof input.phone === "string" ? input.phone.trim() : ""

  const missing: Array<"name" | "email" | "phone"> = []
  if (candidateName.length < 2) missing.push("name")
  if (!EMAIL_PATTERN.test(email)) missing.push("email")
  if (!PHONE_PATTERN.test(phone)) missing.push("phone")

  if (missing.length > 0) {
    const labels = { name: "full name", email: "a valid email address", phone: "a valid UK phone number" }
    return {
      ok: false,
      missing,
      error: `Please provide ${missing.map((m) => labels[m]).join(", ")} before submitting an eligibility check.`,
    }
  }

  return { ok: true, contact: { candidateName, email, phone } }
}
