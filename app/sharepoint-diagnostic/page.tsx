"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Loader2,
  RefreshCw,
  Globe,
  Shield,
  Database,
  FileText,
  Settings,
} from "lucide-react"
import { msalInstance, loginRequest } from "@/lib/msalInstance"
import { SharePointService } from "@/services/SharePointService"

interface DiagnosticTest {
  id: string
  name: string
  description: string
  status: "pending" | "running" | "passed" | "failed" | "warning"
  result?: string
  error?: string
  details?: any
}

export default function SharePointDiagnosticPage() {
  const [tests, setTests] = useState<DiagnosticTest[]>([
    {
      id: "browser",
      name: "Browser Compatibility",
      description: "Check if browser supports required features",
      status: "pending",
    },
    {
      id: "msal-config",
      name: "MSAL Configuration",
      description: "Verify MSAL client configuration",
      status: "pending",
    },
    {
      id: "auth",
      name: "Authentication",
      description: "Test Azure AD authentication flow",
      status: "pending",
    },
    {
      id: "sharepoint-access",
      name: "SharePoint Site Access",
      description: "Test access to SharePoint site",
      status: "pending",
    },
    {
      id: "drive-access",
      name: "Drive Access",
      description: "Test access to SharePoint document library",
      status: "pending",
    },
    {
      id: "evidence-retrieval",
      name: "Evidence Retrieval",
      description: "Test retrieving evidence files",
      status: "pending",
    },
  ])

  const [isRunning, setIsRunning] = useState(false)
  const [currentTest, setCurrentTest] = useState<string | null>(null)

  const updateTest = (id: string, updates: Partial<DiagnosticTest>) => {
    setTests((prev) => prev.map((test) => (test.id === id ? { ...test, ...updates } : test)))
  }

  const runTest = async (testId: string) => {
    setCurrentTest(testId)
    updateTest(testId, { status: "running" })

    try {
      switch (testId) {
        case "browser":
          await testBrowserCompatibility(testId)
          break
        case "msal-config":
          await testMsalConfiguration(testId)
          break
        case "auth":
          await testAuthentication(testId)
          break
        case "sharepoint-access":
          await testSharePointAccess(testId)
          break
        case "drive-access":
          await testDriveAccess(testId)
          break
        case "evidence-retrieval":
          await testEvidenceRetrieval(testId)
          break
      }
    } catch (error) {
      updateTest(testId, {
        status: "failed",
        error: error instanceof Error ? error.message : "Unknown error",
      })
    }
  }

  const testBrowserCompatibility = async (testId: string) => {
    const features = {
      localStorage: typeof Storage !== "undefined",
      sessionStorage: typeof sessionStorage !== "undefined",
      fetch: typeof fetch !== "undefined",
      promises: typeof Promise !== "undefined",
      crypto: typeof crypto !== "undefined",
    }

    const allSupported = Object.values(features).every(Boolean)

    updateTest(testId, {
      status: allSupported ? "passed" : "failed",
      result: allSupported ? "All required features supported" : "Some features missing",
      details: features,
    })
  }

  const testMsalConfiguration = async (testId: string) => {
    try {
      await msalInstance.initialize()
      const config = msalInstance.getConfiguration()

      const currentOrigin = window.location.origin
      const configuredRedirectUri = config.auth.redirectUri

      const isRedirectUriCorrect = configuredRedirectUri === currentOrigin

      updateTest(testId, {
        status: isRedirectUriCorrect ? "passed" : "warning",
        result: isRedirectUriCorrect
          ? "MSAL configuration is correct"
          : `Redirect URI mismatch: configured=${configuredRedirectUri}, current=${currentOrigin}`,
        details: {
          clientId: config.auth.clientId,
          authority: config.auth.authority,
          redirectUri: configuredRedirectUri,
          currentOrigin,
          isRedirectUriCorrect,
        },
      })
    } catch (error) {
      updateTest(testId, {
        status: "failed",
        error: error instanceof Error ? error.message : "MSAL initialization failed",
      })
    }
  }

  const testAuthentication = async (testId: string) => {
    try {
      // Check if user is already authenticated
      const accounts = msalInstance.getAllAccounts()

      if (accounts.length === 0) {
        // Try to authenticate
        const response = await msalInstance.loginPopup(loginRequest)
        updateTest(testId, {
          status: "passed",
          result: `Authenticated as ${response.account?.username}`,
          details: {
            account: response.account,
            scopes: response.scopes,
          },
        })
      } else {
        // User already authenticated
        updateTest(testId, {
          status: "passed",
          result: `Already authenticated as ${accounts[0].username}`,
          details: {
            account: accounts[0],
          },
        })
      }
    } catch (error) {
      updateTest(testId, {
        status: "failed",
        error: error instanceof Error ? error.message : "Authentication failed",
      })
    }
  }

  const testSharePointAccess = async (testId: string) => {
    try {
      const accounts = msalInstance.getAllAccounts()
      if (accounts.length === 0) {
        throw new Error("Not authenticated")
      }

      const sharePointService = new SharePointService()
      const sites = await sharePointService.searchSites("EWA")

      updateTest(testId, {
        status: "passed",
        result: `Found ${sites.length} SharePoint sites`,
        details: { sites: sites.slice(0, 3) }, // Show first 3 sites
      })
    } catch (error) {
      updateTest(testId, {
        status: "failed",
        error: error instanceof Error ? error.message : "SharePoint access failed",
      })
    }
  }

  const testDriveAccess = async (testId: string) => {
    try {
      const accounts = msalInstance.getAllAccounts()
      if (accounts.length === 0) {
        throw new Error("Not authenticated")
      }

      const sharePointService = new SharePointService()
      const sites = await sharePointService.searchSites("EWA")

      if (sites.length === 0) {
        throw new Error("No SharePoint sites found")
      }

      const drives = await sharePointService.getSiteDrives(sites[0].id)

      updateTest(testId, {
        status: "passed",
        result: `Found ${drives.length} document libraries`,
        details: { drives: drives.slice(0, 3) },
      })
    } catch (error) {
      updateTest(testId, {
        status: "failed",
        error: error instanceof Error ? error.message : "Drive access failed",
      })
    }
  }

  const testEvidenceRetrieval = async (testId: string) => {
    try {
      const accounts = msalInstance.getAllAccounts()
      if (accounts.length === 0) {
        throw new Error("Not authenticated")
      }

      const sharePointService = new SharePointService()
      const sites = await sharePointService.searchSites("EWA")

      if (sites.length === 0) {
        throw new Error("No SharePoint sites found")
      }

      const drives = await sharePointService.getSiteDrives(sites[0].id)
      if (drives.length === 0) {
        throw new Error("No document libraries found")
      }

      const files = await sharePointService.getDriveItems(drives[0].id)

      updateTest(testId, {
        status: "passed",
        result: `Found ${files.length} files in document library`,
        details: { files: files.slice(0, 5) },
      })
    } catch (error) {
      updateTest(testId, {
        status: "failed",
        error: error instanceof Error ? error.message : "Evidence retrieval failed",
      })
    }
  }

  const runAllTests = async () => {
    setIsRunning(true)

    for (const test of tests) {
      await runTest(test.id)
      // Small delay between tests
      await new Promise((resolve) => setTimeout(resolve, 500))
    }

    setIsRunning(false)
    setCurrentTest(null)
  }

  const resetTests = () => {
    setTests((prev) =>
      prev.map((test) => ({
        ...test,
        status: "pending" as const,
        result: undefined,
        error: undefined,
        details: undefined,
      })),
    )
    setCurrentTest(null)
    setIsRunning(false)
  }

  const getStatusIcon = (status: DiagnosticTest["status"]) => {
    switch (status) {
      case "passed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "running":
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
      default:
        return <div className="h-4 w-4 rounded-full bg-neutral-600" />
    }
  }

  const getStatusColor = (status: DiagnosticTest["status"]) => {
    switch (status) {
      case "passed":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "failed":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      case "warning":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "running":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      default:
        return "bg-neutral-500/20 text-neutral-400 border-neutral-500/30"
    }
  }

  const getTestIcon = (testId: string) => {
    switch (testId) {
      case "browser":
        return <Globe className="h-5 w-5" />
      case "msal-config":
        return <Settings className="h-5 w-5" />
      case "auth":
        return <Shield className="h-5 w-5" />
      case "sharepoint-access":
      case "drive-access":
        return <Database className="h-5 w-5" />
      case "evidence-retrieval":
        return <FileText className="h-5 w-5" />
      default:
        return <Settings className="h-5 w-5" />
    }
  }

  const passedTests = tests.filter((t) => t.status === "passed").length
  const failedTests = tests.filter((t) => t.status === "failed").length
  const warningTests = tests.filter((t) => t.status === "warning").length

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">SharePoint Diagnostic Tool</h1>
          <p className="text-neutral-400">Diagnose and troubleshoot SharePoint integration issues</p>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-neutral-900 border-neutral-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tests.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-neutral-900 border-neutral-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Passed</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">{passedTests}</div>
            </CardContent>
          </Card>

          <Card className="bg-neutral-900 border-neutral-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Failed</CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-400">{failedTests}</div>
            </CardContent>
          </Card>

          <Card className="bg-neutral-900 border-neutral-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Warnings</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-400">{warningTests}</div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <div className="flex gap-4 mb-6">
          <Button onClick={runAllTests} disabled={isRunning} className="bg-blue-600 hover:bg-blue-700">
            {isRunning ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Running Tests...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Run All Tests
              </>
            )}
          </Button>

          <Button onClick={resetTests} variant="outline" disabled={isRunning}>
            Reset Tests
          </Button>
        </div>

        {/* Test Results */}
        <div className="space-y-4">
          {tests.map((test) => (
            <Card key={test.id} className="bg-neutral-900 border-neutral-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getTestIcon(test.id)}
                    <div>
                      <CardTitle className="text-lg">{test.name}</CardTitle>
                      <CardDescription className="text-neutral-400">{test.description}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(test.status)}
                    <Badge className={getStatusColor(test.status)}>
                      {test.status.charAt(0).toUpperCase() + test.status.slice(1)}
                    </Badge>
                    {!isRunning && test.status !== "running" && (
                      <Button size="sm" variant="outline" onClick={() => runTest(test.id)}>
                        Run Test
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>

              {(test.result || test.error) && (
                <CardContent>
                  {test.result && (
                    <Alert className="mb-4">
                      <AlertDescription>{test.result}</AlertDescription>
                    </Alert>
                  )}

                  {test.error && (
                    <Alert className="mb-4 border-red-500/30 bg-red-500/10">
                      <XCircle className="h-4 w-4" />
                      <AlertDescription className="text-red-400">{test.error}</AlertDescription>
                    </Alert>
                  )}

                  {test.details && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">Details:</h4>
                      <pre className="text-xs bg-neutral-800 p-3 rounded overflow-x-auto">
                        {JSON.stringify(test.details, null, 2)}
                      </pre>
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {/* Troubleshooting Guide */}
        <Card className="bg-neutral-900 border-neutral-800 mt-8">
          <CardHeader>
            <CardTitle>Troubleshooting Guide</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium text-yellow-400 mb-2">Redirect URI Mismatch (AADSTS50011)</h4>
              <p className="text-sm text-neutral-300 mb-2">
                This error occurs when the redirect URI in your Azure AD app registration doesn't match the current
                domain.
              </p>
              <ul className="text-sm text-neutral-400 space-y-1 ml-4">
                <li>• Go to Azure Portal → App Registrations → Your App</li>
                <li>• Navigate to Authentication → Platform configurations</li>
                <li>
                  • Add the current domain as a redirect URI:{" "}
                  <code className="bg-neutral-800 px-1 rounded">
                    {typeof window !== "undefined" ? window.location.origin : "current-domain"}
                  </code>
                </li>
                <li>• Ensure the app is configured as a Single-Page Application (SPA)</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-yellow-400 mb-2">Authentication Issues</h4>
              <ul className="text-sm text-neutral-400 space-y-1 ml-4">
                <li>• Clear browser cache and cookies</li>
                <li>• Try incognito/private browsing mode</li>
                <li>• Check if popup blockers are disabled</li>
                <li>• Verify the correct scopes are requested</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-yellow-400 mb-2">SharePoint Access Issues</h4>
              <ul className="text-sm text-neutral-400 space-y-1 ml-4">
                <li>• Ensure the user has access to the SharePoint site</li>
                <li>• Verify the correct API permissions are granted</li>
                <li>• Check if the SharePoint site exists and is accessible</li>
                <li>• Confirm the site URL is correct</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
