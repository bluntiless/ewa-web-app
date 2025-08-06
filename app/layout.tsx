import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import BottomNavigation from "@/components/BottomNavigation"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "EWA Portfolio App",
  description: "Experienced Worker Assessment and NVQ Portfolio Management",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-neutral-950 text-white min-h-screen pb-16`}>
        {children}
        <BottomNavigation />
      </body>
    </html>
  )
}
