import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { diagnoseMicrosoft } from "@/lib/booking/microsoft"

// Per-request only; never prerender. Temporary diagnostic to verify the
// Microsoft 365 calendar connection and list valid tenant mailboxes.
export const dynamic = "force-dynamic"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const diagnostics = await diagnoseMicrosoft()
    return NextResponse.json({ ok: true, diagnostics })
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
