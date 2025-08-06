"use client"

import { useEffect, useState } from "react"
import type { AccountInfo, AuthenticationResult } from "@azure/msal-browser"
import { getInitializedMsalInstance, isInteractionInProgress, setInteractionInProgress } from "./msalInstance"

export interface UseMsalAuthReturn {
  account: AccountInfo | null
  loading: boolean
  error: string | null
  login: () => Promise<void>
  logout: () => Promise<void>
}

export function useMsalAuth(): UseMsalAuthReturn {
  const [account, setAccount] = useState<AccountInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const initializeMsal = async () => {
      try {
        const msalInstance = await getInitializedMsalInstance()

        const accounts = msalInstance.getAllAccounts()
        if (accounts.length > 0) {
          setAccount(accounts[0])
          msalInstance.setActiveAccount(accounts[0])
        }

        setLoading(false)
      } catch (err) {
        console.error("MSAL initialization failed:", err)
        setError("Failed to initialize authentication system")
        setLoading(false)
      }
    }

    initializeMsal()
  }, [])

  const login = async () => {
    if (isInteractionInProgress()) {
      console.log("Authentication interaction already in progress, skipping...")
      return
    }

    try {
      setLoading(true)
      setError(null)
      setInteractionInProgress(true)

      const msalInstance = await getInitializedMsalInstance()

      const loginRequest = {
        scopes: ["User.Read", "Sites.Read.All", "Files.ReadWrite.All"],
        prompt: "select_account",
      }

      const response: AuthenticationResult = await msalInstance.loginPopup(loginRequest)

      if (response.account) {
        setAccount(response.account)
        msalInstance.setActiveAccount(response.account)
      }

      setLoading(false)
    } catch (err: any) {
      console.error("Login failed:", err)

      if (err.errorCode === "interaction_in_progress") {
        setError("❌ Authentication already in progress. Please wait for the current login to complete.")
      } else if (err.errorCode === "AADSTS9002326") {
        setError(
          "❌ Azure AD Configuration Error: Your app registration must be configured as a Single-Page Application (SPA). Please update your Azure AD app registration platform configuration from 'Web' to 'Single-page application'.",
        )
      } else if (err.errorCode === "AADSTS50011") {
        setError(
          `❌ Redirect URI Error: Please add this URL to your Azure AD app registration as a Single-Page Application: ${window.location.origin}`,
        )
      } else if (err.errorCode === "popup_window_error") {
        setError("❌ Popup Blocked: Please allow popups for this site and try again.")
      } else {
        setError(`❌ Login failed: ${err.errorMessage || err.message || "Unknown error"}`)
      }

      setLoading(false)
    } finally {
      setInteractionInProgress(false)
    }
  }

  const logout = async () => {
    if (isInteractionInProgress()) {
      console.log("Authentication interaction already in progress, skipping logout...")
      return
    }

    try {
      setLoading(true)
      setInteractionInProgress(true)
      const msalInstance = await getInitializedMsalInstance()
      await msalInstance.logoutPopup()
      setAccount(null)
      setLoading(false)
    } catch (err: any) {
      console.error("Logout failed:", err)
      setError(`Logout failed: ${err.errorMessage || err.message || "Unknown error"}`)
      setLoading(false)
    } finally {
      setInteractionInProgress(false)
    }
  }

  return {
    account,
    loading,
    error,
    login,
    logout,
  }
}
