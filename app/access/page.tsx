"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function CandidateAccessPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the main app where MSAL login handles authentication
    // Candidates sign in with their registered Microsoft email
    window.location.href = "/"
  }, [])

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4">
      <div className="text-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
        <p className="text-gray-400">Redirecting to sign in...</p>
      </div>
    </div>
  )
}
