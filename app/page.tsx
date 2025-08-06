'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useMsalAuth } from "@/hooks/useMsalAuth"
import { getQualificationStats } from "@/data/units"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, LogIn, LogOut, AlertCircle, CheckCircle } from 'lucide-react'
import Link from "next/link"

export default function HomePage() {
  const { account, loading, error, login, logout } = useMsalAuth()
  const router = useRouter()
  const [stats, setStats] = useState({ ewaCount: 0, nvqCount: 0, totalCount: 0 })

  useEffect(() => {
    setStats(getQualificationStats())
  }, [])

  const handleLogin = async () => {
    await login()
  }

  const handleLogout = async () => {
    await logout()
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-950 text-white">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
        <p className="mt-4 text-lg">Loading authentication...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex flex-col sm:flex-row items-center justify-between mb-8 space-y-4 sm:space-y-0">
          <h1 className="text-3xl font-bold text-center sm:text-left">EWA Portfolio App</h1>
          <div className="flex items-center space-x-4">
            {account ? (
              <>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm text-neutral-300 hidden sm:inline">
                    Logged in as {account.name || account.username}
                  </span>
                </div>
                <Button onClick={handleLogout} variant="outline" className="flex items-center">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <Button onClick={handleLogin} className="bg-blue-600 hover:bg-blue-700 flex items-center">
                <LogIn className="h-4 w-4 mr-2" />
                Login with Microsoft
              </Button>
            )}
          </div>
        </header>

        {error && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-700 rounded-lg flex items-center space-x-3">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        {!account && (
          <div className="text-center py-12 bg-neutral-900 rounded-lg border border-neutral-800">
            <h2 className="text-xl font-semibold mb-4">Please log in to access the application features.</h2>
            <p className="text-neutral-400 mb-6">
              Your data and portfolio are securely managed through your Microsoft account.
            </p>
            <Button onClick={handleLogin} className="bg-blue-600 hover:bg-blue-700 text-lg px-6 py-3">
              <LogIn className="h-5 w-5 mr-3" />
              Login to Get Started
            </Button>
          </div>
        )}

        {account && (
          <main className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Qualification Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-neutral-900 border-neutral-800">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Units</CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-neutral-500"
                    >
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalCount}</div>
                    <p className="text-xs text-neutral-500">Across all qualifications</p>
                  </CardContent>
                </Card>
                <Card className="bg-neutral-900 border-neutral-800">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">EWA Units</CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-neutral-500"
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.ewaCount}</div>
                    <p className="text-xs text-neutral-500">Experienced Worker Assessment</p>
                  </CardContent>
                </Card>
                <Card className="bg-neutral-900 border-neutral-800">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">NVQ Units</CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-neutral-500"
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.nvqCount}</div>
                    <p className="text-xs text-neutral-500">National Vocational Qualification</p>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Link href="/units" passHref>
                  <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center text-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mb-2 h-6 w-6"
                    >
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" x2="8" y1="13" y2="13" />
                      <line x1="16" x2="8" y1="17" y2="17" />
                      <line x1="10" x2="8" y1="9" y2="9" />
                    </svg>
                    View All Units
                  </Button>
                </Link>
                <Link href="/portfolio" passHref>
                  <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center text-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mb-2 h-6 w-6"
                    >
                      <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Z" />
                      <path d="M18 22V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Z" />
                      <path d="M10 2v4" />
                      <path d="M14 2v4" />
                      <path d="M8 6h8" />
                      <path d="M12 18v.01" />
                      <path d="M12 13v.01" />
                      <path d="M12 8v.01" />
                    </svg>
                    Manage Portfolio
                  </Button>
                </Link>
                <Link href="/assessments" passHref>
                  <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center text-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mb-2 h-6 w-6"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" x2="8" y1="13" y2="13" />
                      <line x1="16" x2="8" y1="17" y2="17" />
                      <line x1="10" x2="8" y1="9" y2="9" />
                    </svg>
                    View Assessments
                  </Button>
                </Link>
                <Link href="/teams" passHref>
                  <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center text-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mb-2 h-6 w-6"
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                    Manage Teams
                  </Button>
                </Link>
                <Link href="/profile" passHref>
                  <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center text-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mb-2 h-6 w-6"
                    >
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    View Profile
                  </Button>
                </Link>
                <Link href="/sharepoint-diagnostic" passHref>
                  <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center text-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mb-2 h-6 w-6"
                    >
                      <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2z" />
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                      <path d="M12 14l-4 4 4 4 4-4-4-4z" />
                      <path d="M12 10l-4-4 4-4 4 4-4 4z" />
                    </svg>
                    SharePoint Diagnostic
                  </Button>
                </Link>
              </div>
            </section>
          </main>
        )}
      </div>
    </div>
  )
}
