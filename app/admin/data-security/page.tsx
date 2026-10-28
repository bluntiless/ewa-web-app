import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import DataSecurityDashboard from "./DataSecurityDashboard"

export default async function AdminDataSecurityPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/admin/login")
  }

  return <DataSecurityDashboard />
}
