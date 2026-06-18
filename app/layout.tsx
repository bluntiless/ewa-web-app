import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import Script from "next/script"
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
    default: "EWA Tracker Ltd | Electrotechnical Experienced Worker Assessment",
    template: "%s | EWA Tracker Ltd",
  },
  description:
    "EWA Tracker Ltd is a specialist provider of the Electrotechnical Experienced Worker Assessment (EWA) Level 3 qualification and ECS Gold Card route for experienced electricians across the UK.",
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
  authors: [{ name: "EWA Tracker Ltd" }],
  creator: "EWA Tracker Ltd",
  publisher: "EWA Tracker Ltd",
  verification: {
    google: "mmueoWkgAP-JvLhbIwiftFJkfO4DHOPFEUV2P44_fnE",
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://ewatracker.co.uk",
    siteName: "EWA Tracker Ltd",
    title: "EWA Tracker Ltd | Electrotechnical Experienced Worker Assessment",
    description:
      "Specialist provider of the Electrotechnical Experienced Worker Assessment (EWA) Level 3 qualification and ECS Gold Card route for experienced electricians across the UK.",
    images: [
      {
        url: "/ewa_logo.png",
        width: 600,
        height: 200,
        alt: "EWA Tracker Ltd Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EWA Tracker Ltd | Electrotechnical Experienced Worker Assessment",
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
  // Organization schema for Google logo display in search results
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "EWA Tracker Ltd",
    url: "https://www.ewatracker.co.uk",
    logo: {
      "@type": "ImageObject",
      url: "https://www.ewatracker.co.uk/logo.png",
      width: 512,
      height: 512,
    },
    image: "https://www.ewatracker.co.uk/logo.png",
  }

  // Extended EducationalOrganization schema for rich results
  const educationalOrgJsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "EWA Tracker Ltd",
    url: "https://www.ewatracker.co.uk",
    logo: "https://www.ewatracker.co.uk/logo.png",
    image: "https://www.ewatracker.co.uk/logo.png",
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

  // Google tag (gtag.js), configured via env so we never hardcode account IDs.
  //   NEXT_PUBLIC_GA_MEASUREMENT_ID  -> GA4, e.g. "G-XXXXXXXXXX"
  //   NEXT_PUBLIC_GOOGLE_ADS_ID      -> Google Ads, e.g. "AW-123456789"
  // GA4 is the primary tracker; Ads is optional and only configured if present.
  const ga4Id = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
  const googleAdsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID
  // The base script can be loaded with any one configured ID.
  const primaryTagId = ga4Id || googleAdsId

  return (
    <html lang="en">
      <body className={inter.className}>
        {primaryTagId ? (
          <>
            <Script
              id="gtag-base"
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${primaryTagId}`}
            />
            <Script id="gtag-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                ${ga4Id ? `gtag('config', '${ga4Id}');` : ""}
                ${googleAdsId ? `gtag('config', '${googleAdsId}');` : ""}
              `}
            </Script>
          </>
        ) : null}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(educationalOrgJsonLd) }}
        />
        {children}
      </body>
    </html>
  )
}
