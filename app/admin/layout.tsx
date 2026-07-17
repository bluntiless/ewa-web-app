import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { SessionProvider } from "@/components/session-provider"

// Admin pages depend on the per-request session (cookies), so they must never
// be statically prerendered at build time. Without this, Next.js 15 tries to
// prerender the server pages, getServerSession() throws (no request context),
// and a static 500 gets baked in for the whole /admin route.
export const dynamic = "force-dynamic"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  )
}
