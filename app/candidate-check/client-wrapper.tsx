"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"

// Dynamically load the heavy client page (html2canvas / jsPDF) on the browser only
const CandidateCheckClientPage = dynamic(
  () => import("./CandidateCheckClientPage"),
  { ssr: false }, // This ensures the component itself is not rendered on the server
)

export default function CandidateCheckClientWrapper() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Set mounted to true once the component has mounted on the client
    setMounted(true)
  }, [])

  // Render the client page only after it has mounted on the client
  // This prevents any potential hydration mismatches by ensuring the component's
  // content is only generated in the browser environment.
  if (!mounted) {
    return null // Or a simple loading spinner/placeholder
  }

  return <CandidateCheckClientPage />
}
