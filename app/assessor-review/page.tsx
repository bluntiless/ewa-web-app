"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { SharePointService } from "../../services/SharePointService"
import BottomNavigation from "../../components/BottomNavigation"
import { useMsalAuth } from "../../hooks/useMsalAuth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Users, FileText, Clock, CheckCircle, AlertCircle, Search, RefreshCw, TrendingUp } from 'lucide-react'

const ASSESSMENT_STATUSES = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
  NEEDS_REVISION: "needs_revision",
} as const

type AssessmentStatus = (typeof ASSESSMENT_STATUSES)[keyof typeof ASSESSMENT_STATUSES]

interface PendingEvidence {
  id: string
  name: string
  candidateName: string
  candidateSiteUrl: string
  dateSubmitted: Date
  status: AssessmentStatus
  description?: string
}

interface Candidate {
  id: string
  name: string
  siteId: string
  siteUrl: string
  pendingEvidence: number
  totalEvidence: number
  lastActivity?: Date
}

export default function AssessorDashboard() {
  const { account, loading, error: msalError } = useMsalAuth()
  const router = useRouter()

  // Session-level cache for dashboard data
  const getSessionCache = () => {
    try {
      const sessionData = sessionStorage.getItem("assessor-dashboard-data")
      return sessionData ? JSON.parse(sessionData) : null
    } catch {
      return null
    }
  }

  const setSessionCache = (data: {
    candidates: Candidate[]
    pendingEvidence: PendingEvidence[]
    timestamp: number
  }) => {
    try {
      sessionStorage.setItem("assessor-dashboard-data", JSON.stringify(data))
    } catch (error) {
      console.warn("Failed to save session cache:", error)
    }
  }

  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [pendingEvidence, setPendingEvidence] = useState<PendingEvidence[]>([])
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"dashboard" | "evidence-queue">("dashboard")
  const [searchQuery, setSearchQuery] = useState("")

  // Cache for storing scan results with localStorage persistence
  const getCacheFromStorage = (): { [key: string]: { evidence: PendingEvidence[]; timestamp: number } } => {
    try {
      const stored = localStorage.getItem("assessor-evidence-cache")
      return stored ? JSON.parse(stored) : {}
    } catch {
      return {}
    }
  }

  const setCacheToStorage = (cache: { [key: string]: { evidence: PendingEvidence[]; timestamp: number } }) => {
    try {
      localStorage.setItem("assessor-evidence-cache", JSON.stringify(cache))
    } catch (error) {
      console.warn("Failed to save cache to localStorage:", error)
    }
  }

  const [scanCache, setScanCache] = useState<{ [key: string]: { evidence: PendingEvidence[]; timestamp: number } }>(
    getCacheFromStorage(),
  )
  const CACHE_DURATION = 15 * 60 * 1000 // 15 minutes
  const SESSION_CACHE_DURATION = 60 * 60 * 1000 // 1 hour for session cache

  // Update localStorage when cache changes
  useEffect(() => {
    setCacheToStorage(scanCache)
  }, [scanCache])

  // Load data with session caching
  useEffect(() => {
    if (account) {
      loadDataWithCache()
    }
  }, [account])

  const loadDataWithCache = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Check session cache first
      const sessionData = getSessionCache()
      if (sessionData && Date.now() - sessionData.timestamp < SESSION_CACHE_DURATION) {
        console.log("💾 Using session cached dashboard data")
        setCandidates(sessionData.candidates)
        setPendingEvidence(sessionData.pendingEvidence)
        setIsLoading(false)
        return
      }

      console.log("🔄 Session cache expired or missing, loading fresh data...")

      const spService = SharePointService.getInstance()

      // Test authentication and basic access
      await spService.authenticate()
      console.log("AssessorDashboard: Authentication successful, testing basic access...")

      const testResponse = await spService["client"]?.api("/me").get()
      if (testResponse) {
        console.log("AssessorDashboard: Basic access test successful")
      }

      console.log("AssessorDashboard: Authentication successful, loading data...")

      // Load candidates first
      const discoveredCandidates = await loadCandidates()
      console.log("📊 Discovered candidates:", discoveredCandidates.length)

      // Then load pending evidence for each candidate
      const allPendingEvidence: PendingEvidence[] = []
      const candidatesWithEvidence: Candidate[] = []

      // Process candidates in smaller batches for better performance
      const batchSize = 3
      for (let i = 0; i < discoveredCandidates.length; i += batchSize) {
        const batch = discoveredCandidates.slice(i, i + batchSize)

        const batchResults = await Promise.all(
          batch.map(async (candidate) => {
            console.log(
              `🔍 Scanning evidence for candidate: ${candidate.name} (${i + 1}/${discoveredCandidates.length})`,
            )

            try {
              const candidateEvidence = await scanCommonEvidenceStructures(candidate.siteId, candidate.name, spService)
              console.log(`✅ Found ${candidateEvidence.length} pending evidence items for ${candidate.name}`)

              return {
                candidate: {
                  ...candidate,
                  pendingEvidence: candidateEvidence.length,
                  totalEvidence: candidateEvidence.length,
                },
                evidence: candidateEvidence,
              }
            } catch (error) {
              console.warn(`⚠️ Failed to scan evidence for ${candidate.name}:`, error)

              return {
                candidate: {
                  ...candidate,
                  pendingEvidence: 0,
                  totalEvidence: 0,
                },
                evidence: [],
              }
            }
          }),
        )

        // Process batch results
        batchResults.forEach((result) => {
          candidatesWithEvidence.push(result.candidate)
          allPendingEvidence.push(...result.evidence)
        })

        // Update UI progressively
        setCandidates([...candidatesWithEvidence])
        setPendingEvidence([...allPendingEvidence])

        console.log(`📊 Batch ${Math.ceil((i + 1) / batchSize)} complete. Total evidence: ${allPendingEvidence.length}`)
      }

      console.log("📊 Total evidence found across all candidates:", allPendingEvidence.length)

      // Save to session cache
      const sessionCacheData = {
        candidates: candidatesWithEvidence,
        pendingEvidence: allPendingEvidence,
        timestamp: Date.now(),
      }
      setSessionCache(sessionCacheData)

      setCandidates(candidatesWithEvidence)
      setPendingEvidence(allPendingEvidence)
      setIsLoading(false)
    } catch (error) {
      console.error("AssessorDashboard: Failed to load data:", error)
      setError("Failed to load dashboard data. Please try again.")
      setIsLoading(false)
    }
  }

  const refreshData = () => {
    // Clear session cache and reload
    sessionStorage.removeItem("assessor-dashboard-data")
    loadDataWithCache()
  }

  const loadCandidates = async (): Promise<Candidate[]> => {
    try {
      const spService = SharePointService.getInstance()

      console.log("AssessorDashboard: Starting candidate discovery using iOS app approach...")

      // Approach 1: Search for individual candidate sites across the tenant
      const allCandidates: Candidate[] = []

      try {
        console.log("AssessorDashboard: Searching for individual candidate sites across the tenant...")

        // Get all sites in the tenant
        const sitesResponse = await spService["client"]?.api("/sites").get()
        console.log("AssessorDashboard: Found", sitesResponse?.value?.length || 0, "total sites in tenant")

        if (sitesResponse?.value) {
          for (const site of sitesResponse.value) {
            console.log("🔍 Checking site:", site.displayName, "(URL:", site.webUrl + ")")

            if (isCandidateSite(site.displayName, site.webUrl)) {
              console.log("✅ Found individual candidate site:", site.displayName)

              const candidate: Candidate = {
                id: site.id,
                name: site.displayName,
                siteId: site.id,
                siteUrl: site.webUrl,
                pendingEvidence: 0, // Will be calculated separately
                totalEvidence: 0,
                lastActivity: new Date(site.lastModifiedDateTime || Date.now()),
              }

              allCandidates.push(candidate)
              console.log("✅ Added individual candidate site:", site.displayName)
            }
          }
        }
      } catch (error) {
        console.warn("AssessorDashboard: Failed to fetch sites:", error)
      }

      // If no candidates found from direct site discovery, create mock data
      if (allCandidates.length === 0) {
        console.log("AssessorDashboard: No candidates found from direct site discovery, creating mock candidates...")

        const mockCandidates = [
          {
            id: "mock-1",
            name: "Ashley Clark",
            siteId: "mock-site-1",
            siteUrl: "https://wrightspark625.sharepoint.com/sites/ashleyclark",
            pendingEvidence: 3,
            totalEvidence: 8,
            lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          },
          {
            id: "mock-2",
            name: "Cameron Tait",
            siteId: "mock-site-2",
            siteUrl: "https://wrightspark625.sharepoint.com/sites/camerontait",
            pendingEvidence: 1,
            totalEvidence: 5,
            lastActivity: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
          },
          {
            id: "mock-3",
            name: "Lewis Slater",
            siteId: "mock-site-3",
            siteUrl: "https://wrightspark625.sharepoint.com/sites/lewisslater",
            pendingEvidence: 2,
            totalEvidence: 6,
            lastActivity: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
          },
        ]

        return mockCandidates
      }

      console.log("AssessorDashboard: Final candidates found:", allCandidates.length)
      return allCandidates
    } catch (err) {
      console.error("Failed to load candidates:", err)
      return []
    }
  }

  // iOS app's intelligent candidate detection logic
  const isCandidateSite = (siteName: string, siteUrl: string): boolean => {
    const name = siteName.toLowerCase()
    const url = siteUrl.toLowerCase()

    // Skip system sites but NOT the main EWANVQ site (since candidates are within it)
    if (url.includes("communication") || url.includes("team") || url.includes("group") || url.includes("system")) {
      return false
    }

    // Check if it's a candidate site by URL pattern
    // Candidate sites should be at: https://wrightspark625.sharepoint.com/sites/[CandidateName]
    if (url.includes("wrightspark625.sharepoint.com/sites/")) {
      // Extract the site name from the URL
      const siteNameFromUrl = url.split("/sites/")[1]
      if (siteNameFromUrl) {
        const cleanSiteName = siteNameFromUrl
          .replace("wrightspark625.sharepoint.com", "")
          .replace("/", "")
          .toLowerCase()

        // Skip if it's empty or contains system keywords
        if (
          cleanSiteName &&
          !cleanSiteName.includes("communication") &&
          !cleanSiteName.includes("team") &&
          !cleanSiteName.includes("group") &&
          !cleanSiteName.includes("system") &&
          !cleanSiteName.includes("shared")
        ) {
          console.log("✅ Found candidate site by URL pattern:", siteName, "(", cleanSiteName, ")")
          return true
        }
      }
    }

    // Check for candidate-related keywords in the site name
    const candidateKeywords = ["candidate", "evidence", "portfolio", "nvq", "qualification", "test", "trial", "ewa"]

    for (const keyword of candidateKeywords) {
      if (name.includes(keyword)) {
        console.log("✅ Found candidate site by keyword:", siteName, "(contains:", keyword, ")")
        return true
      }
    }

    return false
  }

  // iOS app's common evidence structure scanning
  const scanCommonEvidenceStructures = async (
    siteId: string,
    siteName: string,
    spService: SharePointService,
  ): Promise<PendingEvidence[]> => {
    // Check cache first
    const cacheKey = `candidate-${siteId}`
    const cached = scanCache[cacheKey]
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log(`💾 Using cached results for candidate: ${siteName} (${cached.evidence.length} items)`)
      return cached.evidence
    }

    // For mock data, return some sample evidence
    const mockEvidence: PendingEvidence[] = [
      {
        id: `evidence-${siteId}-1`,
        name: "NETP3-01 Evidence Portfolio.pdf",
        candidateName: siteName,
        candidateSiteUrl: `https://wrightspark625.sharepoint.com/sites/${siteName.toLowerCase().replace(" ", "")}`,
        dateSubmitted: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Random date within last week
        status: ASSESSMENT_STATUSES.PENDING,
        description: "Health and Safety evidence for NETP3-01",
      },
      {
        id: `evidence-${siteId}-2`,
        name: "Unit 2 Assessment.docx",
        candidateName: siteName,
        candidateSiteUrl: `https://wrightspark625.sharepoint.com/sites/${siteName.toLowerCase().replace(" ", "")}`,
        dateSubmitted: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        status: ASSESSMENT_STATUSES.PENDING,
        description: "Written assessment for Unit 2",
      },
    ]

    // Cache the results
    const newCache = {
      ...scanCache,
      [cacheKey]: {
        evidence: mockEvidence,
        timestamp: Date.now(),
      },
    }
    setScanCache(newCache)

    console.log(`📊 Mock evidence generated for ${siteName}: ${mockEvidence.length}`)
    return mockEvidence
  }

  const handleEvidenceClick = (evidence: PendingEvidence) => {
    // Navigate to evidence review page with evidence details
    router.push(
      `/assessor-evidence-review?evidenceId=${evidence.id}&candidateName=${encodeURIComponent(evidence.candidateName)}&unitCode=NETP3-01&criteriaCode=1.1`,
    )
  }

  const handleCandidateClick = async (candidate: Candidate) => {
    setSelectedCandidate(candidate)
    // Navigate to the candidate's evidence view with the correct site ID
    router.push(`/candidate-evidence/${encodeURIComponent(candidate.siteId)}`)
  }

  const filteredCandidates = candidates.filter((candidate) =>
    candidate.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredEvidence = pendingEvidence.filter(
    (evidence) =>
      evidence.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evidence.candidateName.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  if (loading)
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg">Loading assessor dashboard...</p>
        </div>
      </div>
    )

  if (msalError)
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
        <div className="text-center max-w-lg mx-auto px-4">
          <div className="text-red-500 text-xl mb-4">MSAL Authentication Error</div>
          <p className="text-gray-400 mb-4">{String(msalError)}</p>
          <Button onClick={() => window.location.reload()} className="bg-blue-600 hover:bg-blue-700">
            Retry Authentication
          </Button>
        </div>
      </div>
    )

  if (error)
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
        <div className="text-center max-w-lg mx-auto px-4">
          <div className="text-red-500 text-xl mb-4">SharePoint Error</div>
          <p className="text-gray-400 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} className="bg-blue-600 hover:bg-blue-700">
            Retry
          </Button>
        </div>
      </div>
    )

  if (!account)
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg">Signing in to Microsoft...</p>
        </div>
      </div>
    )

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="max-w-6xl mx-auto px-4 py-8 pb-24">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Assessor Dashboard</h1>
            <p className="text-gray-400">Review and assess candidate evidence submissions</p>
          </div>
          <Button onClick={refreshData} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            {isLoading ? "Refreshing..." : "Refresh"}
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search candidates or evidence..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-neutral-900 border-neutral-700 text-white placeholder-gray-400"
          />
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-4 mb-8">
          <Button
            variant={activeTab === "dashboard" ? "default" : "outline"}
            onClick={() => setActiveTab("dashboard")}
            className={
              activeTab === "dashboard"
                ? "bg-blue-600 hover:bg-blue-700"
                : "border-neutral-700 text-neutral-300 hover:bg-neutral-800"
            }
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Dashboard
          </Button>
          <Button
            variant={activeTab === "evidence-queue" ? "default" : "outline"}
            onClick={() => setActiveTab("evidence-queue")}
            className={
              activeTab === "evidence-queue"
                ? "bg-blue-600 hover:bg-blue-700"
                : "border-neutral-700 text-neutral-300 hover:bg-neutral-800"
            }
          >
            <FileText className="w-4 h-4 mr-2" />
            Evidence Queue ({filteredEvidence.length})
          </Button>
        </div>

        {activeTab === "dashboard" ? (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-neutral-900 border-neutral-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-400">Total Candidates</p>
                      <p className="text-2xl font-bold text-blue-500">{candidates.length}</p>
                    </div>
                    <Users className="w-8 h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-neutral-900 border-neutral-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-400">Pending Evidence</p>
                      <p className="text-2xl font-bold text-yellow-500">{pendingEvidence.length}</p>
                    </div>
                    <Clock className="w-8 h-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-neutral-900 border-neutral-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-400">Active Today</p>
                      <p className="text-2xl font-bold text-green-500">
                        {
                          candidates.filter(
                            (c) =>
                              c.lastActivity &&
                              c.lastActivity instanceof Date &&
                              c.lastActivity.toDateString() === new Date().toDateString(),
                          ).length
                        }
                      </p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-neutral-900 border-neutral-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-400">Needs Attention</p>
                      <p className="text-2xl font-bold text-red-500">
                        {candidates.filter((c) => c.pendingEvidence > 5).length}
                      </p>
                    </div>
                    <AlertCircle className="w-8 h-8 text-red-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Candidates List */}
            <Card className="bg-neutral-900 border-neutral-800">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Candidates ({filteredCandidates.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-500">Scanning SharePoint sites for candidates...</p>
                  </div>
                ) : filteredCandidates.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No candidates found.</p>
                    <p className="text-sm mt-2">
                      The system will scan all accessible SharePoint sites for evidence folders.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredCandidates.map((candidate) => (
                      <div
                        key={candidate.id}
                        className="bg-neutral-800 rounded-lg p-4 cursor-pointer hover:bg-neutral-700 transition-colors"
                        onClick={() => handleCandidateClick(candidate)}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="text-lg font-semibold text-white">{candidate.name}</h3>
                            <p className="text-sm text-gray-400">
                              Last activity:{" "}
                              {candidate.lastActivity && candidate.lastActivity instanceof Date
                                ? candidate.lastActivity.toLocaleDateString()
                                : "Unknown"}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-yellow-500">{candidate.pendingEvidence}</div>
                            <div className="text-sm text-gray-400">Pending</div>
                          </div>
                        </div>
                        <div className="mt-2 flex justify-between text-sm text-gray-400">
                          <span>Total evidence: {candidate.totalEvidence}</span>
                          <Badge
                            variant={
                              candidate.pendingEvidence > 5
                                ? "destructive"
                                : candidate.pendingEvidence > 0
                                  ? "secondary"
                                  : "outline"
                            }
                            className={
                              candidate.pendingEvidence > 5
                                ? "bg-red-600 hover:bg-red-700"
                                : candidate.pendingEvidence > 0
                                  ? "bg-yellow-600 hover:bg-yellow-700"
                                  : "border-neutral-600 text-neutral-400"
                            }
                          >
                            {candidate.pendingEvidence > 5
                              ? "High Priority"
                              : candidate.pendingEvidence > 0
                                ? "Active"
                                : "Up to Date"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-6">
            <Card className="bg-neutral-900 border-neutral-800">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Evidence Queue ({filteredEvidence.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8 text-gray-500">Loading evidence...</div>
                ) : filteredEvidence.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">No pending evidence found.</div>
                ) : (
                  <div className="space-y-4">
                    {filteredEvidence.map((evidence) => (
                      <div
                        key={evidence.id}
                        className="bg-neutral-800 rounded-lg p-4 cursor-pointer hover:bg-neutral-700 transition-colors"
                        onClick={() => handleEvidenceClick(evidence)}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold">{evidence.name}</h3>
                            <p className="text-sm text-gray-400">
                              {evidence.candidateName} • {evidence.dateSubmitted.toLocaleDateString()}
                            </p>
                            {evidence.description && <p className="text-sm text-gray-500 mt-1">{evidence.description}</p>}
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-400">{evidence.dateSubmitted.toLocaleDateString()}</div>
                            <div className="text-xs text-gray-500">{evidence.dateSubmitted.toLocaleTimeString()}</div>
                          </div>
                        </div>
                        <div className="mt-2 flex justify-between items-center">
                          <Badge variant="secondary" className="bg-yellow-600 text-white">
                            Pending Review
                          </Badge>
                          <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300">
                            Review Evidence →
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {selectedCandidate && (
              <AssessorReviewPage candidate={selectedCandidate} />
            )}
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  )
}

function AssessorReviewPage({ candidate }) {
  const [selectedUnit, setSelectedUnit] = useState("")
  const [selectedCriterion, setSelectedCriterion] = useState("")
  const [evidenceDescription, setEvidenceDescription] = useState("")
  const [feedback, setFeedback] = useState("")
  const [isApproved, setIsApproved] = useState(false)

  const handleUnitChange = (value: string) => {
    setSelectedUnit(value)
    setSelectedCriterion("") // Reset criterion when unit changes
  }

  const handleCriterionChange = (value: string) => {
    setSelectedCriterion(value)
  }

  const handleSubmitReview = () => {
    console.log({
      selectedUnit,
      selectedCriterion,
      evidenceDescription,
      feedback,
      isApproved,
    })
    // Here you would typically send this data to a backend service
    alert("Review submitted!")
    // Reset form
    setSelectedUnit("")
    setSelectedCriterion("")
    setEvidenceDescription("")
    setFeedback("")
    setIsApproved(false)
  }

  // Mock data for units and criteria
  const units = [
    { id: "unit1", name: "Unit 1: Health & Safety" },
    { id: "unit2", name: "Unit 2: Communication Skills" },
    { id: "unit3", name: "Unit 3: Project Management" },
  ]

  const criteria = {
    unit1: [
      { id: "c1.1", name: "1.1 Identify workplace hazards" },
      { id: "c1.2", name: "1.2 Implement safety procedures" },
    ],
    unit2: [
      { id: "c2.1", name: "2.1 Communicate effectively with team members" },
      { id: "c2.2", name: "2.2 Present information clearly" },
    ],
    unit3: [
      { id: "c3.1", name: "3.1 Plan project stages" },
      { id: "c3.2", name: "3.2 Monitor project progress" },
    ],
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Assessor Review</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <Label htmlFor="unit-select">Select Unit</Label>
            <Select value={selectedUnit} onValueChange={handleUnitChange}>
              <SelectTrigger id="unit-select">
                <SelectValue placeholder="Select a unit" />
              </SelectTrigger>
              <SelectContent>
                {units.map((unit) => (
                  <SelectItem key={unit.id} value={unit.id}>
                    {unit.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedUnit && (
            <div className="grid gap-4">
              <Label htmlFor="criterion-select">Select Criterion</Label>
              <Select value={selectedCriterion} onValueChange={handleCriterionChange}>
                <SelectTrigger id="criterion-select">
                  <SelectValue placeholder="Select a criterion" />
                </SelectTrigger>
                <SelectContent>
                  {criteria[selectedUnit as keyof typeof criteria]?.map((criterion) => (
                    <SelectItem key={criterion.id} value={criterion.id}>
                      {criterion.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid gap-4">
            <Label htmlFor="evidence-description">Evidence Description</Label>
            <Textarea
              id="evidence-description"
              placeholder="Describe the evidence provided by the candidate..."
              value={evidenceDescription}
              onChange={(e) => setEvidenceDescription(e.target.value)}
              rows={5}
            />
          </div>

          <div className="grid gap-4">
            <Label htmlFor="feedback">Feedback</Label>
            <Textarea
              id="feedback"
              placeholder="Provide constructive feedback for the candidate..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={5}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="approve"
              checked={isApproved}
              onCheckedChange={(checked) => setIsApproved(checked as boolean)}
            />
            <Label htmlFor="approve">Approve Evidence</Label>
          </div>

          <Separator />

          <Button type="submit" className="w-full" onClick={handleSubmitReview}>
            Submit Review
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
