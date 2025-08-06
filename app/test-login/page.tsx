"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useMsalAuth } from "@/hooks/useMsalAuth"
import { Loader2 } from 'lucide-react'

export default function TestLoginPage() {
  const { account, login, logout, loading, error } = useMsalAuth()

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Authentication Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {loading ? (
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              <p className="text-gray-600">Loading authentication status...</p>
            </div>
          ) : account ? (
            <div className="space-y-4 text-center">
              <p className="text-lg font-semibold text-green-600">Logged In Successfully!</p>
              <p>
                Welcome, <span className="font-medium">{account.name || account.username}</span>
              </p>
              <p className="text-sm text-gray-500">Account ID: {account.localAccountId}</p>
              <Button onClick={logout} className="w-full">
                Logout
              </Button>
            </div>
          ) : (
            <div className="space-y-4 text-center">
              <p className="text-lg font-semibold text-red-600">Not Logged In</p>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button onClick={login} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging In...
                  </>
                ) : (
                  "Login with Microsoft"
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
