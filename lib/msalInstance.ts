import { PublicClientApplication, type Configuration, LogLevel } from "@azure/msal-browser"

// MSAL configuration
export const msalConfig: Configuration = {
  auth: {
    clientId: process.env.NEXT_PUBLIC_AZURE_CLIENT_ID || "your-client-id-here",
    authority: `https://login.microsoftonline.com/${process.env.NEXT_PUBLIC_AZURE_TENANT_ID || "your-tenant-id"}`,
    redirectUri: typeof window !== "undefined" ? window.location.origin : "http://localhost:3000",
    postLogoutRedirectUri: typeof window !== "undefined" ? window.location.origin : "http://localhost:3000",
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {
          return
        }
        switch (level) {
          case LogLevel.Error:
            console.error(message)
            return
          case LogLevel.Info:
            console.info(message)
            return
          case LogLevel.Verbose:
            console.debug(message)
            return
          case LogLevel.Warning:
            console.warn(message)
            return
        }
      },
    },
  },
}

// Create the MSAL instance
export const msalInstance = new PublicClientApplication(msalConfig)

// Track initialization state
let isInitialized = false
let initializationPromise: Promise<void> | null = null
let interactionInProgress = false

// Initialize MSAL with proper error handling
export const initializeMsal = async (): Promise<void> => {
  if (isInitialized) {
    return
  }

  if (initializationPromise) {
    return initializationPromise
  }

  initializationPromise = (async () => {
    try {
      await msalInstance.initialize()
      isInitialized = true
      console.log("MSAL initialized successfully")
    } catch (error) {
      console.error("MSAL initialization failed:", error)
      initializationPromise = null
      throw error
    }
  })()

  return initializationPromise
}

// Check if MSAL is initialized
export const isMsalInitialized = (): boolean => {
  return isInitialized
}

// Check if interaction is in progress
export const isInteractionInProgress = (): boolean => {
  return interactionInProgress
}

// Set interaction state
export const setInteractionInProgress = (inProgress: boolean): void => {
  interactionInProgress = inProgress
}

// Get initialized MSAL instance
export const getInitializedMsalInstance = async (): Promise<PublicClientApplication> => {
  if (!isInitialized) {
    await initializeMsal()
  }
  return msalInstance
}

// Login request configuration
export const loginRequest = {
  scopes: ["User.Read", "Sites.Read.All", "Files.ReadWrite.All"],
}

// Graph API request configuration
export const graphConfig = {
  graphMeEndpoint: "https://graph.microsoft.com/v1.0/me",
  graphSitesEndpoint: "https://graph.microsoft.com/v1.0/sites",
}
