import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import EligibilityChecksDashboard from "./EligibilityChecksDashboard"

export default async function AdminEligibilityChecksPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/admin/login")
  }

  return <EligibilityChecksDashboard />
}
