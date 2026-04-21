
import { put } from "@vercel/blob"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
    const emailPart = String(body?.candidate?.email || "unknown")
      .toLowerCase()
      .replace(/[^a-z0-9@._-]/g, "")
      .replace("@", "_at_")

    const filename = `ewa-entry-test-results/${timestamp}-${emailPart}.json`

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      await put(filename, JSON.stringify(body, null, 2), {
        access: "public",
        contentType: "application/json",
      })
    } else {
      console.log("EWA entry test result received", body)
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json({ ok: false, error: "Unable to save result" }, { status: 500 })
  }
}
