import { getServerSession } from "next-auth"
import { type NextRequest, NextResponse } from "next/server"
import { authOptions } from "@/lib/auth"
import {
  DELETE_CONFIRMATION_PHRASE,
  checkOldUrls,
  copyToPrivate,
  deleteVerifiedPublicCopies,
  getMigrationStatus,
  verifyAll,
} from "@/lib/blob/migration"

export const dynamic = "force-dynamic"
export const maxDuration = 300

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    return NextResponse.json(await getMigrationStatus())
  } catch (error) {
    console.error("Migration status failed:", error)
    return NextResponse.json({ error: "Failed to load migration status" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const { action, confirm } = (await request.json()) as { action?: string; confirm?: string }

    switch (action) {
      case "copy":
        return NextResponse.json({ results: await copyToPrivate() })
      case "verify":
        return NextResponse.json({ results: await verifyAll() })
      case "check-urls":
        return NextResponse.json({ results: await checkOldUrls() })
      case "delete-public":
        if (confirm !== DELETE_CONFIRMATION_PHRASE) {
          return NextResponse.json({ error: "Confirmation phrase does not match" }, { status: 400 })
        }
        console.log(`[data-security] ${session.user?.email} triggered deletion of verified public copies`)
        return NextResponse.json({ results: await deleteVerifiedPublicCopies() })
      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Migration action failed:", error)
    return NextResponse.json({ error: (error as Error).message || "Migration failed" }, { status: 500 })
  }
}
