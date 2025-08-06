"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { SharePointService } from "../../services/SharePointService"
import BottomNavigation from "../../components/BottomNavigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useMsalAuth } from "@/hooks/useMsalAuth"
import { Loader2 } from 'lucide-react'

const SHAREPOINT_PROFILE_FOLDER = "portfolio profile picture"
const PROFILE_JSON = "profile.json"
const DOMAIN = "https://wrightspark625.sharepoint.com/"

export default function ProfilePage() {
  const { account, loading, error } = useMsalAuth()
  const [profile, setProfile] = useState({
    fullName: "",
    jobTitle: "",
    employer: "",
    yearsOfExperience: 0,
    sharePointUrl: "",
    profilePicUrl: "",
  })
  const [profilePicFile, setProfilePicFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null)
  const [showingSharePointHelp, setShowingSharePointHelp] = useState(false)

  useEffect(() => {
    // Load profile.json and profile picture from SharePoint
    const loadProfile = async () => {
      setSaving(true)
      setSaveError(null)
      try {
        // Load SharePoint URL from localStorage
        const savedProfile = localStorage.getItem("profile")
        if (savedProfile) {
          const { sharePointUrl } = JSON.parse(savedProfile)
          if (sharePointUrl) {
            setProfile((prev) => ({ ...prev, sharePointUrl }))
          }
        }

        const sp = SharePointService.getInstance()
        await sp.authenticate()

        try {
          // Try to fetch profile.json
          const driveId = await sp["getDriveId"]()
          if (!sp["client"]) {
            throw new Error("SharePoint client not initialized")
          }

          const response = await sp["client"]
            .api(`/drives/${driveId}/root:/${SHAREPOINT_PROFILE_FOLDER}/${PROFILE_JSON}`)
            .get()

          if (response["@microsoft.graph.downloadUrl"]) {
            const res = await fetch(response["@microsoft.graph.downloadUrl"])
            const data = await res.json()
            setProfile((prev) => ({ ...prev, ...data }))
          }

          // Try to fetch profile picture
          const picResponse = await sp["client"]
            .api(`/drives/${driveId}/root:/${SHAREPOINT_PROFILE_FOLDER}/ProfilePic.jpg`)
            .get()

          if (picResponse["@microsoft.graph.downloadUrl"]) {
            setProfile((prev) => ({ ...prev, profilePicUrl: picResponse["@microsoft.graph.downloadUrl"] }))
          }
        } catch (e) {
          // Ignore if files don't exist yet
          console.log("Profile files not found, will create on save")
        }
      } catch (e) {
        console.error("Load error:", e)
        setSaveError(e instanceof Error ? e.message : "Failed to load profile")
      } finally {
        setSaving(false)
      }
    }
    if (account) {
      loadProfile()
    }
  }, [account])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfile((prev) => ({ ...prev, [name]: name === "yearsOfExperience" ? Number(value) : value }))
  }

  const handlePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    const file = e.target.files[0]
    setProfilePicFile(file)
    setProfile((prev) => ({ ...prev, profilePicUrl: URL.createObjectURL(file) }))
  }

  const handleSave = async () => {
    setSaving(true)
    setSaveError(null)
    setSaveSuccess(null)
    try {
      if (!profile.sharePointUrl.startsWith(DOMAIN)) {
        setSaveError("SharePoint URL must start with " + DOMAIN)
        setSaving(false)
        return
      }

      const sp = SharePointService.getInstance()

      // Validate the SharePoint URL before saving
      try {
        // Ensure we're authenticated
        await sp.authenticate()

        console.log("Validating SharePoint URL:", profile.sharePointUrl)
        await sp.validateSiteUrl(profile.sharePointUrl)
      } catch (validationError: any) {
        setSaveError(`SharePoint URL validation failed: ${validationError.message}`)
        setSaving(false)
        return
      }

      // Save SharePoint URL to localStorage
      localStorage.setItem("profile", JSON.stringify({ sharePointUrl: profile.sharePointUrl }))
      localStorage.setItem("sharepointSiteUrl", profile.sharePointUrl)

      // Create the profile folder if it doesn't exist
      await sp.createFolderIfNeeded(SHAREPOINT_PROFILE_FOLDER)

      // Upload profile.json
      const blob = new Blob([JSON.stringify(profile)], { type: "application/json" })
      const file = new File([blob], PROFILE_JSON, { type: "application/json" })
      await sp.uploadEvidence(file, SHAREPOINT_PROFILE_FOLDER, PROFILE_JSON)

      // Upload profile picture if changed
      if (profilePicFile) {
        await sp.uploadEvidence(profilePicFile, SHAREPOINT_PROFILE_FOLDER, "ProfilePic.jpg")
      }

      setSaveSuccess("Profile saved successfully!")
    } catch (e) {
      console.error("Save error:", e)
      setSaveError(e instanceof Error ? e.message : "Failed to save profile. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <p className="ml-2">Loading profile...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">Error: {error}</p>
      </div>
    )
  }

  if (!account) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Please log in to view your profile.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="container mx-auto p-4">
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader className="flex flex-col items-center gap-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profile.profilePicUrl || "/placeholder-user.jpg"} alt="User Avatar" />
              <AvatarFallback>
                {account.name ? account.name.charAt(0) : account.username.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <CardTitle className="text-3xl font-bold">{account.name || account.username}</CardTitle>
            <Badge variant="secondary" className="text-lg px-3 py-1">
              Candidate
            </Badge>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Contact Information</h3>
                <p className="text-gray-600">
                  <strong>Email:</strong> {account.username}
                </p>
                <p className="text-gray-600">
                  <strong>Phone:</strong> +44 1234 567890
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Qualifications</h3>
                <p className="text-gray-600">EWA Qualification (In Progress)</p>
                <p className="text-gray-600">NVQ Level 3 Engineering (Completed)</p>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold mb-2">Recent Activity</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Submitted evidence for Unit 1.1 (Health & Safety) - 2 days ago</li>
                <li>Reviewed feedback for Unit 2.3 (Communication) - 5 days ago</li>
                <li>Started Unit 3.1 (Project Planning) - 1 week ago</li>
              </ul>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold mb-2">Assessor Information</h3>
              <p className="text-gray-600">
                <strong>Assessor:</strong> Jane Smith
              </p>
              <p className="text-gray-600">
                <strong>Email:</strong> jane.smith@example.com
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SharePoint Settings */}
      <div className="bg-neutral-900 rounded-2xl shadow-lg p-6 mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">SharePoint Settings</h2>
          <button onClick={() => setShowingSharePointHelp(true)} className="text-blue-400 hover:text-blue-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.25 11.25l.41-.41a2.25 2.25 0 113.182 3.182l-4.182 4.182a2.25 2.25 0 01-3.182-3.182l.41-.41"
              />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12.75v6.75m0 0h6.75m-6.75 0l-9-9" />
            </svg>
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-1">SharePoint Site URL</label>
            <input
              type="text"
              name="sharePointUrl"
              value={profile.sharePointUrl}
              onChange={handleInputChange}
              className="w-full bg-neutral-800 text-white rounded px-4 py-2"
              placeholder="https://wrightspark625.sharepoint.com/sites/YourSiteName"
            />
            <p className="mt-1 text-sm text-neutral-400">
              Enter your SharePoint site URL. You can copy this directly from your web browser when viewing your
              SharePoint site.
            </p>
          </div>
        </div>
      </div>

      {saveError && <div className="bg-red-100 text-red-700 px-4 py-2 rounded mt-4">{saveError}</div>}

      {saveSuccess && <div className="bg-green-100 text-green-700 px-4 py-2 rounded mt-4">{saveSuccess}</div>}

      <button
        className="w-full bg-blue-600 text-white font-semibold rounded-xl px-8 py-3 shadow-lg text-lg active:scale-95 transition-all mt-4"
        onClick={handleSave}
        disabled={saving}
      >
        {saving ? "Saving..." : "Save Profile"}
      </button>

      {/* SharePoint Help Modal */}
      {showingSharePointHelp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-neutral-900 rounded-2xl p-6 max-w-lg w-full">
            <h3 className="text-xl font-semibold mb-4">About SharePoint Site URL</h3>
            <p className="text-neutral-300 mb-4">
              The SharePoint Site URL is necessary for connecting to your specific SharePoint site. It allows the app to
              securely access your evidence portfolio while maintaining privacy and security.
            </p>
            <div className="space-y-2 text-neutral-400">
              <p className="font-medium">How to find your SharePoint URL:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Open your SharePoint site in a web browser</li>
                <li>Copy the entire URL from the address bar</li>
                <li>Paste it in the field above</li>
              </ol>
            </div>
            <button
              className="mt-6 w-full bg-blue-600 text-white font-semibold rounded-xl px-8 py-3"
              onClick={() => setShowingSharePointHelp(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <BottomNavigation />
    </div>
  )
}
