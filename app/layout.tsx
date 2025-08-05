import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "EWA Tracker Limited",
  description:
    "EWA Tracker Limited - Electrotechnical Experienced Worker Assessment (EWA) Level 3 qualification provider",
  keywords: "EWA, Electrotechnical, Assessment, Level 3, EAL, Qualification, ECS Gold Card, NVQ Electrical",
  metadataBase: new URL("https://ewatracker.co.uk"), // Add this line if you have a base URL
  verification: {
    google: "mmueoWkgAP-JvLhbIwiftFJkfO4DHOPFEUV2P44_fnE",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
