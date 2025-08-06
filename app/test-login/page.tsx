"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, User, CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import { useMsalAuth } from "@/lib/useMsalAuth"

export default function TestLoginPage() {
  const { account, loading, error, login, logout } = useMsalAuth()

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Authentication Test</h1>
          <p className="text-neutral-400">Test Microsoft 365 authentication integration</p>
        </div>

        {/* Authentication Status */}
        <Card className="mb-6 bg-neutral-900 border-neutral-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Authentication Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center gap-2 text-blue-400">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Checking authentication...</span>
              </div>
            ) : account ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-green-400">
                  <CheckCircle className="h-4 w-4" />
                  <span>Successfully authenticated</span>
                </div>
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div>
                    <span className="font-medium text-neutral-400">User:</span>
                    <span className="ml-2">{account.username}</span>
                  </div>
                  <div>
                    <span className="font-medium text-neutral-400">Name:</span>
                    <span className="ml-2">{account.name || "Not provided"}</span>
                  </div>
                  <div>
                    <span className="font-medium text-neutral-400">Tenant ID:</span>
                    <span className="ml-2 font-mono text-xs">{account.tenantId}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-neutral-400">
                <XCircle className="h-4 w-4" />
                <span>Not authenticated</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <Alert className="mb-6 bg-red-500/10 border-red-500/30 text-red-400">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Authentication Error:</strong> {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Actions */}
        <Card className="bg-neutral-900 border-neutral-800">
          <CardHeader>
            <CardTitle>Actions</CardTitle>
            <CardDescription>Test authentication functions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              {account ? (
                <Button onClick={logout} disabled={loading} variant="destructive">
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Signing out...
                    </>
                  ) : (
                    "Sign Out"
                  )}
                </Button>
              ) : (
                <Button onClick={login} disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In with Microsoft"
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Configuration Info */}
        <Card className="mt-6 bg-neutral-900 border-neutral-800">
          <CardHeader>
            <CardTitle>Configuration</CardTitle>
            <CardDescription>Current MSAL configuration details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium text-neutral-400">Client ID:</span>
                <span className="ml-2 font-mono">4dee2fb0-16a8-417e-99e0-182238406716</span>
              </div>
              <div>
                <span className="font-medium text-neutral-400">Authority:</span>
                <span className="ml-2">https://login.microsoftonline.com/common</span>
              </div>
              <div>
                <span className="font-medium text-neutral-400">Redirect URI:</span>
                <span className="ml-2">{typeof window !== "undefined" ? window.location.origin : "Not available"}</span>
              </div>
              <div>
                <span className="font-medium text-neutral-400">Scopes:</span>
                <div className="ml-2 flex flex-wrap gap-1 mt-1">
                  <Badge variant="secondary">User.Read</Badge>
                  <Badge variant="secondary">Sites.Read.All</Badge>
                  <Badge variant="secondary">Files.Read.All</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
