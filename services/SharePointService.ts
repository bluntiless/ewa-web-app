import { Client } from "@microsoft/microsoft-graph-client"
import type { PublicClientApplication, AccountInfo } from "@azure/msal-browser"
import { getInitializedMsalInstance, isInteractionInProgress, setInteractionInProgress } from "@/lib/msalInstance"

export interface UploadSession {
  uploadUrl: string
  webUrl: string
}

export interface Evidence {
  id: string
  criteriaCode: string
  unitCode: string
  title: string
  description: string
  dateUploaded: string
  assessmentStatus: AssessmentStatus
  assessorFeedback?: string
  assessorName?: string
  assessmentDate?: string
  webUrl: string
  downloadUrl?: string
}

export interface EvidenceMetadata {
  id: string
  name: string
  webUrl?: string
  downloadUrl?: string
  size: number
  mimeType: string
  createdDateTime: Date
  lastModifiedDateTime: Date
  assessmentStatus?: AssessmentStatus
  assessorFeedback?: string
  assessorName?: string
  assessmentDate?: Date | string | null
  criteriaCode?: string
  unitCode?: string
  description?: string
}

export enum AssessmentStatus {
  NotStarted = "not-started",
  Pending = "pending",
  Approved = "approved",
  Rejected = "rejected",
  NeedsRevision = "needs-revision",
}

// Required scopes for SharePoint access
const REQUIRED_SCOPES = [
  "Files.ReadWrite.All",
  "Sites.ReadWrite.All",
  "Sites.FullControl.All",
  "User.Read",
  "User.Read.All",
]

export interface SharePointFile {
  id: string
  name: string
  size: number
  lastModified: string
  downloadUrl: string
  webUrl: string
}

export interface SharePointFolder {
  id: string
  name: string
  itemCount: number
  webUrl: string
}

export interface SharePointSite {
  id: string
  name: string
  webUrl: string
  description?: string
}

export class SharePointService {
  private static instance: SharePointService
  private msalInstance: PublicClientApplication | null = null
  private client: Client | null = null
  private account: AccountInfo | null = null
  private isInitialized = false
  private authLoading = false
  private siteUrl = ""
  private accessToken: string | null = null
  private tokenExpiry: number = 0

  public isAuthLoading(): boolean {
    return this.authLoading
  }

  private constructor() {
    // Initialize MSAL immediately in browser environment
    if (typeof window !== "undefined") {
      console.log("SharePointService: Constructing and initializing MSAL...")
      this.initializeMsal().catch((err) => {
        console.error("Failed to initialize MSAL during construction:", err)
      })
    }
  }

  public static getInstance(): SharePointService {
    if (!SharePointService.instance) {
      SharePointService.instance = new SharePointService()
    }
    return SharePointService.instance
  }

  private static async getAccessToken(): Promise<string> {
    const msalInstance = await getInitializedMsalInstance()
    const account = msalInstance.getActiveAccount()
    if (!account) {
      throw new Error("No active account found")
    }

    const tokenRequest = {
      scopes: ["Sites.Read.All", "Files.Read.All"],
      account: account,
    }

    try {
      const response = await msalInstance.acquireTokenSilent(tokenRequest)
      return response.accessToken
    } catch (error) {
      if (isInteractionInProgress()) {
        throw new Error("Authentication interaction already in progress")
      }
      
      setInteractionInProgress(true)
      try {
        const response = await msalInstance.acquireTokenPopup(tokenRequest)
        return response.accessToken
      } finally {
        setInteractionInProgress(false)
      }
    }
  }

  /**
   * Utility method to retry operations with exponential backoff
   */
  private async retryWithBackoff<T>(
    operation: () => Promise<T>,
    maxRetries = 3,
    isRetryable: (error: any) => boolean = (error) => {
      return (
        error &&
        (error.statusCode === 429 ||
          (error.response && error.response.status === 429) ||
          error.statusCode === 503 ||
          (error.response && error.response.status === 503) ||
          (error.message && (error.message.includes("429") || error.message.includes("503"))))
      )
    },
  ): Promise<T> {
    let retries = 0

    while (true) {
      try {
        return await operation()
      } catch (error) {
        if (retries >= maxRetries || !isRetryable(error)) {
          throw error
        }

        const backoffTime = Math.pow(2, retries) * 1000 + Math.random() * 1000
        console.log(
          `SharePointService: Retrying operation after ${Math.round(backoffTime)}ms (retry ${retries + 1}/${maxRetries})`,
          error,
        )

        await new Promise((resolve) => setTimeout(resolve, backoffTime))
        retries++
      }
    }
  }

  // Initialize MSAL instance
  private async initializeMsal(): Promise<void> {
    try {
      if (typeof window === "undefined") {
        throw new Error("Cannot initialize MSAL in server environment")
      }

      if (this.isInitialized && this.msalInstance) {
        console.log("SharePointService: MSAL already initialized")
        return
      }

      console.log("SharePointService: Initializing MSAL...")

      this.checkBrowserCompatibility()

      try {
        this.msalInstance = await getInitializedMsalInstance()
        console.log("SharePointService: MSAL instance initialized")
      } catch (error: any) {
        console.error("SharePointService: Error getting MSAL instance:", error)
        throw new Error(`Failed to initialize authentication: ${error.message}`)
      }

      try {
        console.log("SharePointService: Checking for redirect response...")
        const response = await this.msalInstance.handleRedirectPromise()

        console.log("SharePointService: Redirect response:", response)

        if (response && response.account) {
          console.log("SharePointService: Received account after redirect:", response.account.username)
          this.account = response.account

          const returnUrl = sessionStorage.getItem("postLoginRedirect")
          if (returnUrl) {
            console.log("SharePointService: Redirecting back to saved URL:", returnUrl)
            sessionStorage.removeItem("postLoginRedirect")
            window.location.href = returnUrl
            return
          }
        } else {
          console.log("SharePointService: No redirect response found")
        }
      } catch (redirectError) {
        console.warn("SharePointService: Error handling redirect (this may be normal on first load):", redirectError)
      }

      const accounts = this.msalInstance.getAllAccounts()
      if (accounts.length > 0) {
        this.account = accounts[0]
        console.log("SharePointService: Found existing account:", this.account.username)
      }

      this.isInitialized = true

      if (accounts.length > 0) {
        this.initializeGraphClient()
      }

      console.log("SharePointService: MSAL initialized successfully")

      if (this.msalInstance) {
        this.msalInstance.addEventCallback((event) => {
          if (event.eventType.includes("LOGIN_FAILURE")) {
            console.error("SharePointService: Login failure event:", event.error)
          } else if (event.eventType.includes("LOGIN_SUCCESS")) {
            console.log("SharePointService: Login success event")
          }
        })
      }
    } catch (error) {
      console.error("SharePointService: Failed to initialize MSAL:", error)
      this.isInitialized = false
      this.msalInstance = null
      throw error
    }
  }

  private checkBrowserCompatibility(): void {
    try {
      if (typeof window !== "undefined") {
        const testKey = "msal-test"
        window.sessionStorage.setItem(testKey, "test")
        window.sessionStorage.removeItem(testKey)

        // Make cookie check less strict - just warn instead of throwing
        try {
          const testCookie = "msal-test=test; path=/"
          document.cookie = testCookie
          const cookiesEnabled = document.cookie.indexOf("msal-test=") !== -1

          if (!cookiesEnabled) {
            console.warn("SharePointService: Cookies may not be working properly. Authentication might have issues.")
          } else {
            // Clean up test cookie
            document.cookie = "msal-test=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/"
          }
        } catch (cookieError) {
          console.warn("SharePointService: Could not test cookies, but continuing anyway:", cookieError)
        }

        this.checkThirdPartyCookies()
      }
    } catch (storageError) {
      console.error("SharePointService: Browser storage not available:", storageError)
      throw new Error("Authentication requires session storage to be enabled in your browser.")
    }

    try {
      if (typeof window !== "undefined" && window.localStorage) {
        const testKey = "msal-test"
        window.localStorage.setItem(testKey, "test")
        window.localStorage.removeItem(testKey)
      }
    } catch (privateError) {
      console.warn("SharePointService: Private browsing mode detected. This may affect authentication persistence.")
    }
  }

  private checkThirdPartyCookies(): void {
    try {
      const now = new Date()
      const expires = new Date(now.getTime() + 1000).toUTCString()

      const secureCookie = "msal-test-secure=test; expires=" + expires + "; path=/; SameSite=Lax"
      document.cookie = secureCookie

      // Give it a moment to set
      setTimeout(() => {
        const secureEnabled = document.cookie.indexOf("msal-test-secure=") !== -1
        if (!secureEnabled) {
          console.warn(
            "SharePointService: Browser may be blocking secure cookies. This could cause authentication issues in some scenarios.",
          )
        }

        // Clean up test cookie
        document.cookie = "msal-test-secure=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/"
      }, 100)
    } catch (error) {
      console.warn("SharePointService: Error checking secure cookies (non-critical):", error)
    }
  }

  private initializeGraphClient(): void {
    if (!this.msalInstance) {
      throw new Error("MSAL instance must be initialized before creating Graph client")
    }

    try {
      this.client = Client.init({
        authProvider: async (callback) => {
          try {
            const token = await this.getAccessToken()
            callback(null, token)
          } catch (error) {
            callback(error as Error, null)
          }
        },
      })
      console.log("SharePointService: Graph client initialized")
    } catch (error) {
      console.error("SharePointService: Failed to initialize Graph client:", error)
      throw error
    }
  }

  private async getAccessToken(): Promise<string> {
    if (!this.isInitialized || !this.msalInstance) {
      await this.initializeMsal()
      if (!this.isInitialized || !this.msalInstance) {
        throw new Error("MSAL is not initialized")
      }
    }
    try {
      const accounts = this.msalInstance.getAllAccounts()
      if (accounts.length === 0) {
        throw new Error("No authenticated accounts found")
      }
      
      const response = await this.msalInstance.acquireTokenSilent({
        scopes: REQUIRED_SCOPES,
        account: accounts[0],
      })
      return response.accessToken
    } catch (error: any) {
      if (error.errorCode === "interaction_required" || error.errorCode === "consent_required") {
        if (isInteractionInProgress()) {
          throw new Error("Authentication interaction already in progress")
        }
        
        setInteractionInProgress(true)
        try {
          const response = await this.msalInstance.acquireTokenPopup({
            scopes: REQUIRED_SCOPES,
            account: accounts[0],
          })
          return response.accessToken
        } finally {
          setInteractionInProgress(false)
        }
      }
      console.error("SharePointService: Failed to get access token:", error)
      throw error
    }
  }

  private getProfileSiteUrl(siteUrl?: string): string {
    if (siteUrl) return siteUrl
    try {
      if (typeof window !== "undefined") {
        const profile = JSON.parse(localStorage.getItem("profile") || "{}")
        return profile.sharePointUrl || ""
      }
      return ""
    } catch {
      return ""
    }
  }

  public async validateSiteUrl(siteUrl: string): Promise<boolean> {
    try {
      if (!siteUrl || typeof siteUrl !== "string") {
        throw new Error("Invalid SharePoint site URL: URL is empty or invalid")
      }

      try {
        const url = new URL(siteUrl)

        if (!url.hostname.includes("sharepoint.com")) {
          throw new Error("Invalid SharePoint site URL: Not a SharePoint domain")
        }

        if (!url.pathname.includes("/sites/")) {
          throw new Error("Invalid SharePoint site URL: Missing site path (/sites/sitename)")
        }
      } catch (urlError: any) {
        throw new Error(`Invalid SharePoint site URL format: ${urlError.message}`)
      }

      if (!this.isAuthenticated()) {
        await this.authenticate()
      }

      try {
        const url = new URL(siteUrl)
        const hostname = url.hostname
        const path = url.pathname

        await this.client!.api(`/sites/${hostname}:${path}`).get()

        return true
      } catch (error: any) {
        console.error("Failed to validate site URL:", error)

        if (error.statusCode === 403 || (error.response && error.response.status === 403)) {
          throw new Error("Access denied to SharePoint site. Please check your permissions or try a different site.")
        }

        if (error.statusCode === 404 || (error.response && error.response.status === 404)) {
          throw new Error(`SharePoint site not found at "${siteUrl}". Please check the URL and try again.`)
        }

        throw new Error(`Failed to validate SharePoint site: ${error.message || "Unknown error"}`)
      }
    } catch (error: any) {
      console.error("Site URL validation failed:", error)
      throw error
    }
  }

  public isAuthenticated(): boolean {
    return this.account !== null && this.client !== null
  }

  public async authenticate(): Promise<void> {
    if (this.isAuthenticated()) {
      return
    }

    if (isInteractionInProgress()) {
      throw new Error("Authentication interaction already in progress")
    }

    try {
      if (!this.msalInstance) {
        await this.initializeMsal()
      }

      if (!this.msalInstance) {
        throw new Error("Failed to initialize MSAL")
      }

      try {
        const accounts = this.msalInstance.getAllAccounts()
        if (accounts.length > 0) {
          this.account = accounts[0]
          await this.getAccessToken()
          this.initializeGraphClient()
          return
        }
      } catch (silentError) {
        console.log("Silent token acquisition failed, will try interactive login")
      }

      setInteractionInProgress(true)
      try {
        const loginResponse = await this.msalInstance.loginPopup({
          scopes: REQUIRED_SCOPES,
        })

        if (loginResponse.account) {
          this.account = loginResponse.account
          await this.getAccessToken()
          this.initializeGraphClient()
        } else {
          throw new Error("No account returned from login")
        }
      } finally {
        setInteractionInProgress(false)
      }
    } catch (error) {
      console.error("Authentication failed:", error)
      throw new Error("Authentication failed: " + (error instanceof Error ? error.message : "Unknown error"))
    }
  }

  private async getDriveId(siteUrl?: string): Promise<string> {
    return this.retryWithBackoff(async () => {
      if (!this.isAuthenticated()) {
        await this.authenticate()
      }

      try {
        const siteId = await this.getSiteId()

        const response = await this.client!.api(`/sites/${siteId}/drives`).get()

        if (!response.value || response.value.length === 0) {
          throw new Error("No drives found in the SharePoint site")
        }

        return response.value[0].id
      } catch (error) {
        console.error("Failed to get drive ID:", error)
        throw new Error("Failed to get drive ID: " + (error instanceof Error ? error.message : "Unknown error"))
      }
    })
  }

  private async getSiteId(): Promise<string> {
    return this.retryWithBackoff(async () => {
      if (!this.isAuthenticated()) {
        await this.authenticate()
      }

      try {
        const siteUrl = this.getProfileSiteUrl()
        if (!siteUrl) {
          throw new Error("SharePoint site URL not configured")
        }

        const url = new URL(siteUrl)
        const hostname = url.hostname
        const path = url.pathname

        const response = await this.client!.api(`/sites/${hostname}:${path}`).get()

        return response.id
      } catch (error) {
        console.error("Failed to get site ID:", error)
        throw new Error("Failed to get site ID: " + (error instanceof Error ? error.message : "Unknown error"))
      }
    })
  }

  public async uploadEvidence(file: File, folderPath: string, fileName: string): Promise<void> {
    if (!this.isAuthenticated()) {
      await this.authenticate()
    }

    try {
      const driveId = await this.getDriveId()
      console.log(
        `SharePointService: Starting upload of ${fileName} (type: ${file.type}) to ${folderPath} in drive ${driveId}`,
      )

      if (!folderPath.startsWith("Evidence/")) {
        console.warn("SharePointService: folderPath does not start with Evidence/, correcting...")
        folderPath = folderPath.includes("Evidence")
          ? folderPath.substring(folderPath.indexOf("Evidence"))
          : `Evidence/${folderPath}`
      }

      const folderSegments = folderPath.split("/").filter(Boolean)
      let currentPath = ""
      let folderId: string | undefined = undefined

      console.log(`SharePointService: Creating folder structure: ${folderSegments.join(" > ")}`)

      for (const segment of folderSegments) {
        currentPath = currentPath ? `${currentPath}/${segment}` : segment
        console.log(`SharePointService: Checking/creating folder: ${currentPath}`)

        try {
          const folderResponse = await this.client!.api(`/drives/${driveId}/root:/${currentPath}`).get()
          folderId = folderResponse.id
          console.log(`SharePointService: Folder exists: ${currentPath} with ID: ${folderId}`)
        } catch (err: any) {
          if (err.statusCode === 404 || (err.code && err.code === "itemNotFound")) {
            console.log(`SharePointService: Folder ${currentPath} not found, creating it`)
            const parentPath = currentPath.substring(0, currentPath.lastIndexOf("/")) || ""
            console.log(`SharePointService: Creating folder ${segment} in parent path: ${parentPath || "root"}`)

            try {
              const createEndpoint = parentPath
                ? `/drives/${driveId}/root:/${parentPath}:/children`
                : `/drives/${driveId}/root/children`

              const createResp = await this.client!.api(createEndpoint).post({
                name: segment,
                folder: {},
                "@microsoft.graph.conflictBehavior": "replace",
              })

              folderId = createResp.id
              console.log(`SharePointService: Folder created with id: ${folderId}`)
            } catch (createErr: any) {
              console.error(`SharePointService: Error creating folder ${segment} in ${parentPath}:`, createErr)
              throw new Error(`Failed to create folder: ${createErr.message || JSON.stringify(createErr)}`)
            }
          } else {
            console.error(`SharePointService: Error checking folder ${currentPath}:`, err)
            throw err
          }
        }
      }

      if (!folderId) {
        console.error("SharePointService: Failed to get a valid folder ID")
        throw new Error("Failed to create or access folder structure")
      }

      const isImage = file.type.startsWith("image/")
      const isPNG = file.type === "image/png" || fileName.toLowerCase().endsWith(".png")
      const isSmallFile = file.size < 4 * 1024 * 1024

      if ((isImage || isPNG) && isSmallFile) {
        console.log(`SharePointService: Using direct upload approach for ${isPNG ? "PNG" : "image"} file`)

        try {
          const encodedFileName = encodeURIComponent(fileName)
          console.log(`SharePointService: Creating direct upload for file: ${encodedFileName} in folder: ${folderId}`)

          const response = await this.client!.api(
            `/drives/${driveId}/items/${folderId}:/${encodedFileName}:/content`,
          ).put(file)

          console.log(`SharePointService: Direct upload completed, item ID: ${response.id}`)
          return
        } catch (directError: any) {
          console.warn(
            `SharePointService: Direct upload failed, falling back to session upload: ${directError.message}`,
          )
        }
      }

      const encodedFileName = encodeURIComponent(fileName)
      console.log(`SharePointService: Creating upload session for file: ${encodedFileName} in folder: ${folderId}`)

      const uploadSessionResp = await this.client!.api(
        `/drives/${driveId}/items/${folderId}:/${encodedFileName}:/createUploadSession`,
      ).post({
        item: {
          "@microsoft.graph.conflictBehavior": "replace",
        },
      })

      const uploadUrl = uploadSessionResp.uploadUrl
      console.log(
        `SharePointService: Upload session created, URL: ${uploadUrl ? "Success (URL hidden for logs)" : "Failed"}`,
      )
      if (!uploadUrl) throw new Error("Failed to create upload session")

      await this.uploadFile(file, uploadUrl, fileName, (progress) => {
        console.log(`SharePointService: Upload progress: ${progress.toFixed(0)}%`)
      })

      console.log(`SharePointService: File upload completed successfully`)
    } catch (error) {
      console.error("Failed to upload evidence:", error)
      throw new Error("Failed to upload evidence: " + (error instanceof Error ? error.message : "Unknown error"))
    }
  }

  public async createUploadSession(fileName: string, folderPath: string): Promise<UploadSession> {
    if (!this.isAuthenticated()) {
      await this.authenticate()
    }

    try {
      const driveId = await this.getDriveId()

      if (!folderPath.startsWith("Evidence/")) {
        console.warn("SharePointService: folderPath does not start with Evidence/, correcting...")
        folderPath = folderPath.includes("Evidence")
          ? folderPath.substring(folderPath.indexOf("Evidence"))
          : `Evidence/${folderPath}`
      }

      console.log(`SharePointService: Creating upload session for ${fileName} in ${folderPath}`)

      const folderSegments = folderPath.split("/").filter(Boolean)
      let currentPath = ""
      let folderId: string | undefined = undefined

      for (const segment of folderSegments) {
        currentPath = currentPath ? `${currentPath}/${segment}` : segment
        console.log(`SharePointService: Checking/creating folder: ${currentPath}`)

        try {
          const folderResponse = await this.client!.api(`/drives/${driveId}/root:/${currentPath}`).get()
          folderId = folderResponse.id
          console.log(`SharePointService: Folder exists: ${currentPath}`)
        } catch (err: any) {
          if (err.statusCode === 404 || (err.code && err.code === "itemNotFound")) {
            console.log(`SharePointService: Folder ${currentPath} not found, creating it`)
            const parentPath = currentPath.substring(0, currentPath.lastIndexOf("/")) || ""

            try {
              const createEndpoint = parentPath
                ? `/drives/${driveId}/root:/${parentPath}:/children`
                : `/drives/${driveId}/root/children`

              const createResp = await this.client!.api(createEndpoint).post({
                name: segment,
                folder: {},
                "@microsoft.graph.conflictBehavior": "replace",
              })

              folderId = createResp.id
              console.log(`SharePointService: Folder created with id: ${folderId}`)
            } catch (createErr: any) {
              console.error(`SharePointService: Error creating folder ${segment}:`, createErr)
              throw new Error(`Failed to create folder: ${createErr.message || JSON.stringify(createErr)}`)
            }
          } else {
            console.error(`SharePointService: Error checking folder ${currentPath}:`, err)
            throw err
          }
        }
      }

      if (!folderId) {
        throw new Error("Failed to create or access folder structure")
      }

      console.log(`SharePointService: Creating upload session for file: ${fileName} in folder ID: ${folderId}`)
      const response = await this.client!.api(
        `/drives/${driveId}/items/${folderId}:/${encodeURIComponent(fileName)}:/createUploadSession`,
      ).post({
        item: {
          "@microsoft.graph.conflictBehavior": "replace",
        },
      })

      return {
        uploadUrl: response.uploadUrl,
        webUrl: response.webUrl,
      }
    } catch (error) {
      console.error("Failed to create upload session:", error)
      throw new Error("Failed to create upload session: " + (error instanceof Error ? error.message : "Unknown error"))
    }
  }

  public async uploadFile(
    file: File | Blob,
    uploadUrl: string,
    fileName: string,
    onProgress?: (progress: number) => void,
  ): Promise<void> {
    try {
      console.log(`SharePointService: Uploading file ${fileName} with MIME type: ${file.type}`)

      const isImage = file.type.startsWith("image/")
      const isVideo = file.type.startsWith("video/")
      const isSmallFile = file.size < 4 * 1024 * 1024

      if (isImage && isSmallFile) {
        console.log(`SharePointService: Using direct upload for image file: ${fileName}`)

        const response = await fetch(uploadUrl, {
          method: "PUT",
          headers: {
            "Content-Type": file.type,
            "Content-Length": file.size.toString(),
            "Content-Range": `bytes 0-${file.size - 1}/${file.size}`,
          },
          body: file,
        })

        if (!response.ok) {
          console.error(`SharePointService: Direct upload failed:`, response.status, response.statusText)
          const responseText = await response.text()
          console.error(`SharePointService: Response:`, responseText)
          throw new Error(`Failed to upload file: ${response.status} ${response.statusText}`)
        }

        console.log(`SharePointService: Direct upload completed successfully`)
        if (onProgress) {
          onProgress(100)
        }
        return
      }

      const fileBuffer = await this.readFileAsArrayBuffer(file as File)
      const fileSize = fileBuffer.byteLength

      let chunkSize = 4 * 1024 * 1024

      if (isVideo) {
        if (fileSize > 100 * 1024 * 1024) {
          chunkSize = 10 * 1024 * 1024
        } else if (fileSize > 50 * 1024 * 1024) {
          chunkSize = 8 * 1024 * 1024
        } else {
          chunkSize = 6 * 1024 * 1024
        }
      }

      console.log(
        `SharePointService: Using ${(chunkSize / 1024 / 1024).toFixed(1)}MB chunks for ${isVideo ? "video" : "file"} upload of ${(fileSize / 1024 / 1024).toFixed(1)}MB`,
      )

      let offset = 0
      let retryCount = 0
      const maxRetries = 5

      while (offset < fileSize) {
        const chunk = fileBuffer.slice(offset, offset + chunkSize)
        const contentRange = `bytes ${offset}-${offset + chunk.byteLength - 1}/${fileSize}`

        console.log(`SharePointService: Uploading chunk: ${contentRange}`)

        try {
          const response = await fetch(uploadUrl, {
            method: "PUT",
            headers: {
              "Content-Type": "application/octet-stream",
              "Content-Length": chunk.byteLength.toString(),
              "Content-Range": contentRange,
            },
            body: chunk,
          })

          if (response.status === 429) {
            if (retryCount < maxRetries) {
              retryCount++
              const backoffTime = Math.pow(2, retryCount) * 1000
              console.log(
                `SharePointService: Rate limited (429). Retrying chunk after ${backoffTime}ms (retry ${retryCount}/${maxRetries})`,
              )

              await new Promise((resolve) => setTimeout(resolve, backoffTime))
              continue
            } else {
              console.error(`SharePointService: Maximum retries (${maxRetries}) exceeded for rate limiting`)
              throw new Error("Upload failed due to persistent rate limiting. Please try again later.")
            }
          } else if (!response.ok) {
            console.error(`SharePointService: Chunk upload failed:`, response.status, response.statusText)

            let responseText = ""
            try {
              responseText = await response.text()
            } catch (e) {
              responseText = "Could not read error response"
            }

            console.error(`SharePointService: Response:`, responseText)

            if (response.status >= 500 && retryCount < maxRetries) {
              retryCount++
              const backoffTime = Math.pow(2, retryCount) * 1000
              console.log(
                `SharePointService: Server error (${response.status}). Retrying chunk after ${backoffTime}ms (retry ${retryCount}/${maxRetries})`,
              )

              await new Promise((resolve) => setTimeout(resolve, backoffTime))
              continue
            }

            throw new Error(`Failed to upload chunk: ${response.status} ${response.statusText}`)
          }
