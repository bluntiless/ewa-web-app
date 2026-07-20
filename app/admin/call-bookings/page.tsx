import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { CallBookingsDashboard } from "./CallBookingsDashboard"

// Depends on the per-request session; never prerender at build time.
export const dynamic = "force-dynamic"

export default async function CallBookingsPage() {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect("/admin/login")
  }

  return <CallBookingsDashboard session={session} />
}
