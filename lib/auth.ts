import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcryptjs"

// In production, store this in environment variables
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || ""
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@ewatracker.co.uk"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Admin Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Check if email matches admin email
        if (credentials.email !== ADMIN_EMAIL) {
          return null
        }

        // Verify password against hash
        const isValidPassword = await compare(
          credentials.password,
          ADMIN_PASSWORD_HASH
        )

        if (!isValidPassword) {
          return null
        }

        return {
          id: "admin",
          email: ADMIN_EMAIL,
          name: "Admin",
          role: "admin",
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { role?: string }).role = token.role as string
      }
      return session
    },
  },
}
