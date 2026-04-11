import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import SkillsScanDashboard from "./SkillsScanDashboard"

export default async function AdminSkillsScanPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/admin/login")
  }

  return <SkillsScanDashboard />
}
