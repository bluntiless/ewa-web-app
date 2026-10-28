import { withAuth } from "next-auth/middleware"

// Server-side gate for the whole admin area. Individual pages and API routes
// also check the session, so this is defence in depth: no admin page or admin
// API can be reached without a valid admin JWT, even if a page only guards on
// the client.
export default withAuth({
  pages: { signIn: "/admin/login" },
  callbacks: {
    authorized: ({ token }) => token?.role === "admin",
  },
})

export const config = {
  matcher: ["/admin", "/admin/((?!login).*)", "/api/admin/:path*"],
}
