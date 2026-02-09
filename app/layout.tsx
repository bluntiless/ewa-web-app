import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#1d4ed8",
}

export const metadata: Metadata = {
  metadataBase: new URL("https://ewatracker.co.uk"),
  title: {
    default: "EWA Tracker Limited | Electrotechnical Experienced Worker Assessment",
    template: "%s | EWA Tracker Limited",
  },
  description:
    "EWA Tracker Limited is a specialist provider of the Electrotechnical Experienced Worker Assessment (EWA) Level 3 qualification and ECS Gold Card route for experienced electricians across the UK.",
  keywords: [
    "EWA",
    "Electrotechnical Experienced Worker Assessment",
    "Level 3 Electrical Qualification",
    "EAL",
    "ECS Gold Card",
    "Experienced Worker Assessment",
    "UK Electrician Qualification",
    "Electrical Assessment",
    "EWA Tracker",
  ],
  authors: [{ name: "EWA Tracker Limited" }],
  creator: "EWA Tracker Limited",
  publisher: "EWA Tracker Limited",
  verification: {
    google: "mmueoWkgAP-JvLhbIwiftFJkfO4DHOPFEUV2P44_fnE",
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://ewatracker.co.uk",
    siteName: "EWA Tracker Limited",
    title: "EWA Tracker Limited | Electrotechnical Experienced Worker Assessment",
    description:
      "Specialist provider of the Electrotechnical Experienced Worker Assessment (EWA) Level 3 qualification and ECS Gold Card route for experienced electricians across the UK.",
    images: [
      {
        url: "/ewa_logo.png",
        width: 600,
        height: 200,
        alt: "EWA Tracker Limited Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EWA Tracker Limited | Electrotechnical Experienced Worker Assessment",
    description:
      "Specialist provider of the EWA Level 3 qualification and ECS Gold Card route for experienced electricians across the UK.",
    images: ["/ewa_logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://ewatracker.co.uk",
  },
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "EWA Tracker Limited",
    url: "https://ewatracker.co.uk",
    logo: "https://ewatracker.co.uk/ewa_logo.png",
    description:
      "Specialist provider of the Electrotechnical Experienced Worker Assessment (EWA) Level 3 qualification and ECS Gold Card route for experienced electricians across the UK.",
    email: "info@ewatracker.co.uk",
    telephone: "+447828893976",
    address: {
      "@type": "PostalAddress",
      addressCountry: "GB",
    },
    sameAs: ["https://linkedin.com/company/ewatracker"],
    areaServed: {
      "@type": "Country",
      name: "United Kingdom",
    },
    hasCredential: [
      {
        "@type": "EducationalOccupationalCredential",
        name: "Electrotechnical Experienced Worker Assessment (EWA) Level 3",
        credentialCategory: "Level 3 Qualification",
      },
    ],
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  )
}
