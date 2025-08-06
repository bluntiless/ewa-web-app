'use client'

import { useMsalAuth } from "@/hooks/useMsalAuth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, LogIn, LogOut, AlertCircle, CheckCircle } from 'lucide-react'

export default function TestLoginPage() {
  const { account, loading, error, login, logout } = useMsalAuth()

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-neutral-900 border-neutral-800">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Authentication Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {loading ? (
            <div className="flex flex-col items-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              <p className="mt-2 text-neutral-400">Loading authentication state...</p>
            </div>
          ) : (
            <>
              {account ? (
                <div className="text-center space-y-3">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                  <p className="text-lg font-semibold text-green-400">Successfully Authenticated!</p>
                  <p className="text-neutral-300">
                    Welcome, <span className="font-medium">{account.name || account.username}</span>
                  </p>
                  <p className="text-sm text-neutral-500">Account ID: {account.localAccountId}</p>
                  <Button onClick={logout} className="w-full bg-red-600 hover:bg-red-700 mt-4">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="text-center space-y-3">
                  <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto" />
                  <p className="text-lg font-semibold text-yellow-400">Not Authenticated</p>
                  <p className="text-neutral-300">Please log in to test the authentication flow.</p>
                  <Button onClick={login} className="w-full bg-blue-600 hover:bg-blue-700 mt-4">
                    <LogIn className="h-4 w-4 mr-2" />
                    Login with Microsoft
                  </Button>
                </div>
              )}
            </>
          )}

          {error && (
            <div className="p-3 bg-red-900/30 border border-red-700 rounded-md flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
