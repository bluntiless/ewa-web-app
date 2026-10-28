import { getServerSession } from "next-auth"
import { type NextRequest, NextResponse } from "next/server"
import { authOptions } from "@/lib/auth"
import { findBlob, isSensitivePathname, readBlobBuffer } from "@/lib/blob/secure-store"

export const dynamic = "force-dynamic"

// Streams a stored candidate file (e.g. a completed PDF) to a signed-in admin.
// Only pathnames belonging to known sensitive record types can be requested.
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const pathname = request.nextUrl.searchParams.get("pathname") ?? ""
  if (!pathname || pathname.includes("..") || !isSensitivePathname(pathname)) {
    return NextResponse.json({ error: "Invalid file" }, { status: 400 })
  }

  try {
    const blob = await findBlob(pathname)
    const data = blob ? await readBlobBuffer(blob) : null
    if (!data) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    const filename = pathname.split("/").slice(-2).join("-")
    const contentType = pathname.endsWith(".pdf") ? "application/pdf" : "application/json"

    return new NextResponse(new Uint8Array(data), {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    })
  } catch (error) {
    console.error("Failed to serve admin file:", error)
    return NextResponse.json({ error: "Failed to load file" }, { status: 500 })
  }
}
