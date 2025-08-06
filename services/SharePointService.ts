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

          retryCount = 0
          offset += chunk.byteLength

          if (onProgress) {
            onProgress(Math.min(100, (offset / fileSize) * 100))
          }
        } catch (error) {
          if (retryCount < maxRetries) {
            retryCount++
            const backoffTime = Math.pow(2, retryCount) * 1000
            console.log(
              `SharePointService: Error during upload: ${error}. Retrying chunk after ${backoffTime}ms (retry ${retryCount}/${maxRetries})`,
            )

            await new Promise((resolve) => setTimeout(resolve, backoffTime))
            continue
          } else {
            console.error(`SharePointService: Maximum retries (${maxRetries}) exceeded for chunk upload`)
            throw error
          }
        }
      }

      console.log(`SharePointService: Chunked upload completed successfully`)
    } catch (error) {
      console.error("Failed to upload file:", error)
      throw new Error("Failed to upload file: " + (error instanceof Error ? error.message : "Unknown error"))
    }
  }

  public async fetchEvidenceMetadata(webUrl: string, siteUrl?: string): Promise<EvidenceMetadata> {
    if (!this.isAuthenticated()) {
      await this.authenticate()
    }

    try {
      const driveId = await this.getDriveId(siteUrl)
      const filePath = this.getRelativePath(webUrl)

      if (!filePath) {
        console.warn("Unable to determine relative path from URL, using direct API approach:", webUrl)

        const fileId = this.extractFileIdFromUrl(webUrl)
        if (fileId) {
          console.log("Found file ID from URL:", fileId)
          try {
            const itemResponse = await this.client!.api(`/drives/${driveId}/items/${fileId}`).get()

            console.log("Successfully retrieved file by ID:", itemResponse.id)

            try {
              const fieldsResponse = await this.client!.api(
                `/drives/${driveId}/items/${itemResponse.id}/listItem/fields`,
              ).get()

              return {
                id: itemResponse.id,
                name: fieldsResponse.Title || fieldsResponse.FileLeafRef || itemResponse.name,
                webUrl: itemResponse.webUrl,
                downloadUrl: itemResponse["@microsoft.graph.downloadUrl"],
                size: itemResponse.size || 0,
                mimeType: itemResponse.file?.mimeType || "application/octet-stream",
                createdDateTime: new Date(
                  fieldsResponse.Created || fieldsResponse.createdDateTime || itemResponse.createdDateTime,
                ),
                lastModifiedDateTime: new Date(
                  fieldsResponse.Modified || fieldsResponse.lastModifiedDateTime || itemResponse.lastModifiedDateTime,
                ),
                assessmentStatus: (fieldsResponse.AssessmentStatus as AssessmentStatus) || AssessmentStatus.Pending,
                assessorFeedback: fieldsResponse.AssessorFeedback || "",
                assessorName: fieldsResponse.AssessorName || "",
                assessmentDate: fieldsResponse.AssessmentDate ? new Date(fieldsResponse.AssessmentDate) : "",
                criteriaCode: fieldsResponse.CriteriaCode || "",
                unitCode: fieldsResponse.UnitCode || "",
                description: fieldsResponse.Description || "",
              }
            } catch (fieldsError) {
              console.warn("Failed to get listItem fields for file ID, using basic metadata:", fieldsError)
              return {
                id: itemResponse.id,
                name: itemResponse.name,
                webUrl: itemResponse.webUrl,
                downloadUrl: itemResponse["@microsoft.graph.downloadUrl"],
                size: itemResponse.size || 0,
                mimeType: itemResponse.file?.mimeType || "application/octet-stream",
                createdDateTime: new Date(itemResponse.createdDateTime),
                lastModifiedDateTime: new Date(itemResponse.lastModifiedDateTime),
                assessmentStatus: AssessmentStatus.Pending,
              }
            }
          } catch (idError) {
            console.error("Failed to get file by ID:", idError)
          }
        }

        const fileName = this.extractFilenameFromUrl(webUrl)
        console.log("Creating minimal metadata from URL with filename:", fileName)
        return {
          id: crypto.randomUUID(),
          name: fileName || "Unknown File",
          webUrl: webUrl,
          size: 0,
          mimeType: "application/octet-stream",
          createdDateTime: new Date(),
          lastModifiedDateTime: new Date(),
          assessmentStatus: AssessmentStatus.Pending,
        }
      }

      if (filePath.startsWith("sourcedoc:")) {
        const fileId = filePath.substring("sourcedoc:".length)
        console.log(`SharePointService: Searching for file with sourcedoc ID: ${fileId}`)

        try {
          const searchResults = await this.client!.api(`/drives/${driveId}/root/search(q='${fileId}')`).get()

          if (searchResults.value && searchResults.value.length > 0) {
            const bestMatch = searchResults.value[0]
            console.log(`SharePointService: Found file by sourcedoc search: ${bestMatch.name}`)

            try {
              const fieldsResponse = await this.client!.api(
                `/drives/${driveId}/items/${bestMatch.id}/listItem/fields`,
              ).get()

              console.log("Fetched fields for file from sourcedoc search")

              const extractedUnitCode = this.extractFromPath(bestMatch.webUrl, "unit")
              const extractedCriteriaCode = this.extractFromPath(bestMatch.webUrl, "criteria")

              const metadata: EvidenceMetadata = {
                id: bestMatch.id,
                name: fieldsResponse.Title || fieldsResponse.FileLeafRef || bestMatch.name,
                webUrl: bestMatch.webUrl,
                downloadUrl: bestMatch["@microsoft.graph.downloadUrl"],
                size: bestMatch.size || 0,
                mimeType: bestMatch.file?.mimeType || "application/octet-stream",
                createdDateTime: new Date(
                  fieldsResponse.Created || fieldsResponse.createdDateTime || bestMatch.createdDateTime,
                ),
                lastModifiedDateTime: new Date(
                  fieldsResponse.Modified || fieldsResponse.lastModifiedDateTime || bestMatch.lastModifiedDateTime,
                ),
                assessmentStatus: (fieldsResponse.AssessmentStatus as AssessmentStatus) || AssessmentStatus.Pending,
                assessorFeedback: fieldsResponse.AssessorFeedback || "",
                assessorName: fieldsResponse.AssessorName || "",
                assessmentDate: fieldsResponse.AssessmentDate ? new Date(fieldsResponse.AssessmentDate) : "",
                criteriaCode: fieldsResponse.CriteriaCode || extractedCriteriaCode || "",
                unitCode: fieldsResponse.UnitCode || extractedUnitCode || "",
                description: fieldsResponse.Description || "",
              }

              return metadata
            } catch (fieldsError) {
              console.warn(
                "Failed to get listItem fields for sourcedoc search result, using basic metadata:",
                fieldsError,
              )

              return {
                id: bestMatch.id,
                name: bestMatch.name,
                webUrl: bestMatch.webUrl,
                downloadUrl: bestMatch["@microsoft.graph.downloadUrl"],
                size: bestMatch.size || 0,
                mimeType: bestMatch.file?.mimeType || "application/octet-stream",
                createdDateTime: new Date(bestMatch.createdDateTime),
                lastModifiedDateTime: new Date(bestMatch.lastModifiedDateTime),
                assessmentStatus: AssessmentStatus.Pending,
                criteriaCode: this.extractFromPath(bestMatch.webUrl, "criteria"),
                unitCode: this.extractFromPath(bestMatch.webUrl, "unit"),
              }
            }
          }
        } catch (searchError) {
          console.warn("Failed to search for file by sourcedoc ID:", searchError)
        }

        try {
          const itemResponse = await this.client!.api(`/drives/${driveId}/items/${fileId}`).get()

          console.log("Found file directly by sourcedoc ID:", itemResponse.id)

          return {
            id: itemResponse.id,
            name: itemResponse.name,
            webUrl: itemResponse.webUrl,
            downloadUrl: itemResponse["@microsoft.graph.downloadUrl"],
            size: itemResponse.size || 0,
            mimeType: itemResponse.file?.mimeType || "application/octet-stream",
            createdDateTime: new Date(itemResponse.createdDateTime),
            lastModifiedDateTime: new Date(itemResponse.lastModifiedDateTime),
            assessmentStatus: AssessmentStatus.Pending,
          }
        } catch (directError) {
          console.warn("Failed to get file directly by sourcedoc ID:", directError)
        }

        console.log("Creating minimal metadata from sourcedoc ID")
        return {
          id: fileId,
          name: `File ${fileId}`,
          webUrl: webUrl,
          size: 0,
          mimeType: "application/octet-stream",
          createdDateTime: new Date(),
          lastModifiedDateTime: new Date(),
          assessmentStatus: AssessmentStatus.Pending,
        }
      }

      if (filePath.startsWith("id:")) {
        const fileId = filePath.substring("id:".length)
        console.log(`SharePointService: Fetching file directly by ID: ${fileId}`)

        try {
          const itemResponse = await this.client!.api(`/drives/${driveId}/items/${fileId}`).get()

          console.log("Found file by direct ID:", itemResponse.id)

          try {
            const fieldsResponse = await this.client!.api(
              `/drives/${driveId}/items/${itemResponse.id}/listItem/fields`,
            ).get()

            const extractedUnitCode = this.extractFromPath(itemResponse.webUrl, "unit")
            const extractedCriteriaCode = this.extractFromPath(itemResponse.webUrl, "criteria")

            return {
              id: itemResponse.id,
              name: fieldsResponse.Title || fieldsResponse.FileLeafRef || itemResponse.name,
              webUrl: itemResponse.webUrl,
              downloadUrl: itemResponse["@microsoft.graph.downloadUrl"],
              size: itemResponse.size || 0,
              mimeType: itemResponse.file?.mimeType || "application/octet-stream",
              createdDateTime: new Date(
                fieldsResponse.Created || fieldsResponse.createdDateTime || itemResponse.createdDateTime,
              ),
              lastModifiedDateTime: new Date(
                fieldsResponse.Modified || fieldsResponse.lastModifiedDateTime || itemResponse.lastModifiedDateTime,
              ),
              assessmentStatus: (fieldsResponse.AssessmentStatus as AssessmentStatus) || AssessmentStatus.Pending,
              assessorFeedback: fieldsResponse.AssessorFeedback || "",
              assessorName: fieldsResponse.AssessorName || "",
              assessmentDate: fieldsResponse.AssessmentDate ? new Date(fieldsResponse.AssessmentDate) : "",
              criteriaCode: fieldsResponse.CriteriaCode || extractedCriteriaCode || "",
              unitCode: fieldsResponse.UnitCode || extractedUnitCode || "",
              description: fieldsResponse.Description || "",
            }
          } catch (fieldsError) {
            console.warn("Failed to get listItem fields for direct ID, using basic metadata:", fieldsError)

            return {
              id: itemResponse.id,
              name: itemResponse.name,
              webUrl: itemResponse.webUrl,
              downloadUrl: itemResponse["@microsoft.graph.downloadUrl"],
              size: itemResponse.size || 0,
              mimeType: itemResponse.file?.mimeType || "application/octet-stream",
              createdDateTime: new Date(itemResponse.createdDateTime),
              lastModifiedDateTime: new Date(itemResponse.lastModifiedDateTime),
              assessmentStatus: AssessmentStatus.Pending,
              criteriaCode: this.extractFromPath(itemResponse.webUrl, "criteria"),
              unitCode: this.extractFromPath(itemResponse.webUrl, "unit"),
            }
          }
        } catch (idError) {
          console.error("Failed to get file by direct ID:", idError)

          return {
            id: fileId,
            name: `File ${fileId}`,
            webUrl: webUrl,
            size: 0,
            mimeType: "application/octet-stream",
            createdDateTime: new Date(),
            lastModifiedDateTime: new Date(),
            assessmentStatus: AssessmentStatus.Pending,
          }
        }
      }

      console.log(`SharePointService: Fetching metadata for file at path: ${filePath}`)

      try {
        const itemResponse = await this.client!.api(`/drives/${driveId}/root:/${filePath}`).get()

        console.log("Found file item:", itemResponse.id)

        try {
          const fieldsResponse = await this.client!.api(
            `/drives/${driveId}/items/${itemResponse.id}/listItem/fields`,
          ).get()

          console.log("Fetched fields for file:", webUrl)

          const extractedUnitCode = this.extractFromPath(webUrl, "unit")
          const extractedCriteriaCode = this.extractFromPath(webUrl, "criteria")

          const metadata: EvidenceMetadata = {
            id: itemResponse.id,
            name: fieldsResponse.Title || fieldsResponse.FileLeafRef || itemResponse.name,
            webUrl: itemResponse.webUrl,
            downloadUrl: itemResponse["@microsoft.graph.downloadUrl"],
            size: itemResponse.size || 0,
            mimeType: itemResponse.file?.mimeType || "application/octet-stream",
            createdDateTime: new Date(
              fieldsResponse.Created || fieldsResponse.createdDateTime || itemResponse.createdDateTime,
            ),
            lastModifiedDateTime: new Date(
              fieldsResponse.Modified || fieldsResponse.lastModifiedDateTime || itemResponse.lastModifiedDateTime,
            ),
            assessmentStatus: (fieldsResponse.AssessmentStatus as AssessmentStatus) || AssessmentStatus.Pending,
            assessorFeedback: fieldsResponse.AssessorFeedback || "",
            assessorName: fieldsResponse.AssessorName || "",
            assessmentDate: fieldsResponse.AssessmentDate ? new Date(fieldsResponse.AssessmentDate) : "",
            criteriaCode: fieldsResponse.CriteriaCode || extractedCriteriaCode || "",
            unitCode: fieldsResponse.UnitCode || extractedUnitCode || "",
            description: fieldsResponse.Description || "",
          }

          return metadata
        } catch (fieldsError) {
          console.warn("Failed to get listItem fields, using basic metadata:", fieldsError)

          return {
            id: itemResponse.id,
            name: itemResponse.name,
            webUrl: itemResponse.webUrl,
            downloadUrl: itemResponse["@microsoft.graph.downloadUrl"],
            size: itemResponse.size || 0,
            mimeType: itemResponse.file?.mimeType || "application/octet-stream",
            createdDateTime: new Date(itemResponse.createdDateTime),
            lastModifiedDateTime: new Date(itemResponse.lastModifiedDateTime),
            assessmentStatus: AssessmentStatus.Pending,
            criteriaCode: this.extractFromPath(webUrl, "criteria"),
            unitCode: this.extractFromPath(webUrl, "unit"),
          }
        }
      } catch (itemError) {
        console.error("Error fetching file item:", itemError)
        throw new Error(
          "Failed to find file in SharePoint: " + (itemError instanceof Error ? itemError.message : "Unknown error"),
        )
      }
    } catch (error) {
      console.error("Failed to fetch evidence metadata:", error)
      throw new Error(
        "Failed to fetch evidence metadata: " + (error instanceof Error ? error.message : "Unknown error"),
      )
    }
  }

  private async createFolder(): Promise<void> {
    throw new Error("Method not implemented in this simplified version")
  }

  private getRelativePath(url: string): string {
    try {
      if (!url || url.trim() === "") {
        console.warn("Empty or invalid URL provided to getRelativePath")
        return ""
      }

      const urlObj = new URL(url)
      console.log("Extracting relative path from URL:", url)

      if (urlObj.pathname.includes("/_layouts/15/Doc.asp")) {
        const sourceUrl = urlObj.searchParams.get("sourcedoc")
        const source = urlObj.searchParams.get("source")

        if (sourceUrl) {
          console.log("Found sourcedoc parameter:", sourceUrl)
          try {
            const decoded = decodeURIComponent(sourceUrl)
            const parts = decoded.split("/")
            const fileName = parts[parts.length - 1]

            console.log("Looking for file with sourcedoc ID:", fileName)

            const fileId = sourceUrl.replace(/[{}]/g, "")
            return `sourcedoc:${fileId}`
          } catch (e) {
            console.log("Could not decode sourceUrl parameter")
          }
        }

        const fileNameMatch = url.match(/([^/&]+\.(xlsx|pdf|docx|pptx|txt|jpg|jpeg|png|gif|bmp|webp))/i)
        if (fileNameMatch && fileNameMatch[1]) {
          const fileName = fileNameMatch[1]
          console.log("Extracted filename from URL:", fileName)
          return `Evidence/${fileName}`
        }

        if (source) {
          try {
            const decoded = decodeURIComponent(source)
            if (decoded.includes("Evidence")) {
              const evidenceIdx = decoded.indexOf("Evidence")
              const pathPart = decoded.substring(evidenceIdx)
              console.log("Extracted path from source parameter:", pathPart)
              return pathPart
            }
          } catch (e) {
            console.log("Could not decode source parameter")
          }
        }

        const fileIdFromUrl = this.extractFileIdFromUrl(url)
        if (fileIdFromUrl) {
          console.log("Found file ID in URL:", fileIdFromUrl)
          return `id:${fileIdFromUrl}`
        }
      }

      const candidates = ["/Shared Documents/", "/Shared%20Documents/"]
      for (const sitePath of candidates) {
        const idx = urlObj.pathname.indexOf(sitePath)
        if (idx !== -1) {
          const rel = urlObj.pathname.substring(idx + sitePath.length)
          return decodeURIComponent(rel)
        }
      }

      const rootMatch = urlObj.pathname.match(/root:(.*):/)
      if (rootMatch && rootMatch[1]) {
        return decodeURIComponent(rootMatch[1])
      }

      const sitesMatch = urlObj.pathname.match(/\/sites\/[^/]+\/([^?]+)/)
      if (sitesMatch && sitesMatch[1]) {
        const path = decodeURIComponent(sitesMatch[1])
        if (path.includes("Evidence")) {
          const evidenceIdx = path.indexOf("Evidence")
          return path.substring(evidenceIdx)
        }
        return path
      }

      if (url.includes("Evidence")) {
        const evidenceIdx = url.indexOf("Evidence")
        const pathCandidate = url.substring(evidenceIdx)
        const endIdx = Math.min(
          pathCandidate.indexOf("?") > -1 ? pathCandidate.indexOf("?") : Number.POSITIVE_INFINITY,
          pathCandidate.indexOf("#") > -1 ? pathCandidate.indexOf("#") : Number.POSITIVE_INFINITY,
        )
        if (endIdx !== Number.POSITIVE_INFINITY) {
          return pathCandidate.substring(0, endIdx)
        }
        return pathCandidate
      }

      console.error("Could not determine relative path from URL:", url)
      throw new Error("Could not determine relative path from URL")
    } catch (e) {
      console.error("Error in getRelativePath:", e, url)
      return ""
    }
  }

  private readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      console.log(`SharePointService: Reading file ${file.name}, size: ${file.size} bytes`)

      if (file.size === 0) {
        console.error(`SharePointService: File ${file.name} has 0 bytes - this will result in an empty file`)
      }

      const reader = new FileReader()

      reader.onload = (event) => {
        const result = event.target?.result as ArrayBuffer
        console.log(`SharePointService: Successfully read ${result ? result.byteLength : 0} bytes from file`)
        resolve(result)
      }

      reader.onerror = (error) => {
        console.error(`SharePointService: Error reading file: ${error}`)
        reject(error)
      }

      try {
        reader.readAsArrayBuffer(file)
      } catch (error) {
        console.error(`SharePointService: Exception reading file: ${error}`)
        reject(error)
      }
    })
  }

  public async getEvidence(): Promise<Evidence[]> {
    if (!this.isAuthenticated()) {
      await this.authenticate()
    }

    try {
      const driveId = await this.getDriveId()
      console.log(`SharePointService: Fetching evidence items from drive ${driveId}`)

      const siteUrl = this.getProfileSiteUrl()
      if (!siteUrl) {
        throw new Error("SharePoint site URL not configured")
      }

      const evidenceItems: Evidence[] = []

      try {
        try {
          await this.client!.api(`/drives/${driveId}/root:/Evidence`).get()
        } catch (error) {
          console.warn("Evidence folder not found:", error)
          return []
        }

        const unitFoldersResponse = await this.client!.api(`/drives/${driveId}/root:/Evidence:/children`).get()

        const unitFolders = unitFoldersResponse.value?.filter((item: any) => item.folder) || []
        console.log(`SharePointService: Found ${unitFolders.length} unit folders in Evidence folder`)

        for (const unitFolder of unitFolders) {
          try {
            console.log(`SharePointService: Processing unit folder ${unitFolder.name}`)

            const criteriaFoldersResponse = await this.client!.api(
              `/drives/${driveId}/items/${unitFolder.id}/children`,
            ).get()

            console.log(
              `SharePointService: Found ${criteriaFoldersResponse.value?.length || 0} criteria folders/items in unit ${unitFolder.name}`,
            )

            for (const criteriaItem of criteriaFoldersResponse.value || []) {
              try {
                if (criteriaItem.folder) {
                  const filesResponse = await this.client!.api(
                    `/drives/${driveId}/items/${criteriaItem.id}/children`,
                  ).get()

                  const files = filesResponse.value?.filter((item: any) => !item.folder) || []
                  console.log(`SharePointService: Found ${files.length} files in criteria folder ${criteriaItem.name}`)

                  for (const file of files) {
                    if (file.webUrl) {
                      try {
                        const metadata = await this.fetchEvidenceMetadata(file.webUrl)

                        const unitCode = unitFolder.name.replace(/_/g, ".")
                        const criteriaCode = criteriaItem.name.replace(/_/g, ".")

                        evidenceItems.push({
                          id: file.id,
                          title: metadata.name || file.name || "Untitled Evidence",
                          dateUploaded: file.createdDateTime
                            ? new Date(file.createdDateTime).toISOString()
                            : new Date().toISOString(),
                          webUrl: file.webUrl,
                          downloadUrl: file["@microsoft.graph.downloadUrl"] || file.webUrl,
                          assessmentStatus: metadata.assessmentStatus || AssessmentStatus.Pending,
                          assessorFeedback: metadata.assessorFeedback || "",
                          assessorName: metadata.assessorName || "",
                          assessmentDate: metadata.assessmentDate
                            ? typeof metadata.assessmentDate === "string"
                              ? metadata.assessmentDate
                              : metadata.assessmentDate.toISOString()
                            : undefined,
                          criteriaCode: metadata.criteriaCode || criteriaCode,
                          unitCode: metadata.unitCode || unitCode,
                          description: metadata.description || "",
                        })
                      } catch (metadataError) {
                        console.warn(
                          `SharePointService: Error processing metadata for file ${file.name}:`,
                          metadataError,
                        )
                        evidenceItems.push({
                          id: file.id,
                          title: file.name || "Untitled Evidence",
                          dateUploaded: file.createdDateTime
                            ? new Date(file.createdDateTime).toISOString()
                            : new Date().toISOString(),
                          webUrl: file.webUrl,
                          downloadUrl: file["@microsoft.graph.downloadUrl"] || file.webUrl,
                          assessmentStatus: AssessmentStatus.Pending,
                          criteriaCode: criteriaItem.name.replace(/_/g, "."),
                          unitCode: unitFolder.name.replace(/_/g, "."),
                          description: "",
                        })
                      }
                    }
                  }
                } else if (criteriaItem.webUrl) {
                  try {
                    const metadata = await this.fetchEvidenceMetadata(criteriaItem.webUrl)

                    const unitCode = unitFolder.name.replace(/_/g, ".")
                    let criteriaCode = metadata.criteriaCode || ""

                    if (!criteriaCode) {
                      const match = criteriaItem.name.match(/\d+\.\d+/)
                      if (match) {
                        criteriaCode = match[0]
                      }
                    }

                    evidenceItems.push({
                      id: criteriaItem.id,
                      title: metadata.name || criteriaItem.name || "Untitled Evidence",
                      dateUploaded: criteriaItem.createdDateTime
                        ? new Date(criteriaItem.createdDateTime).toISOString()
                        : new Date().toISOString(),
                      webUrl: criteriaItem.webUrl,
                      downloadUrl: criteriaItem["@microsoft.graph.downloadUrl"] || criteriaItem.webUrl,
                      assessmentStatus: metadata.assessmentStatus || AssessmentStatus.Pending,
                      assessorFeedback: metadata.assessorFeedback || "",
                      assessorName: metadata.assessorName || "",
                      assessmentDate: metadata.assessmentDate
                        ? typeof metadata.assessmentDate === "string"
                          ? metadata.assessmentDate
                          : metadata.assessmentDate.toISOString()
                        : undefined,
                      criteriaCode: criteriaCode,
                      unitCode: metadata.unitCode || unitCode,
                      description: metadata.description || "",
                    })
                  } catch (metadataError) {
                    console.warn(
                      `SharePointService: Error processing metadata for file ${criteriaItem.name}:`,
                      metadataError,
                    )
                    evidenceItems.push({
                      id: criteriaItem.id,
                      title: criteriaItem.name || "Untitled Evidence",
                      dateUploaded: criteriaItem.createdDateTime
                        ? new Date(criteriaItem.createdDateTime).toISOString()
                        : new Date().toISOString(),
                      webUrl: criteriaItem.webUrl,
                      downloadUrl: criteriaItem["@microsoft.graph.downloadUrl"] || criteriaItem.webUrl,
                      assessmentStatus: AssessmentStatus.Pending,
                      criteriaCode: "",
                      unitCode: unitFolder.name.replace(/_/g, "."),
                      description: "",
                    })
                  }
                }
              } catch (criteriaError) {
                console.warn(`SharePointService: Error processing criteria item ${criteriaItem.name}:`, criteriaError)
                continue
              }
            }
          } catch (unitError) {
            console.warn(`SharePointService: Error processing unit folder ${unitFolder.name}:`, unitError)
            continue
          }
        }
      } catch (graphError) {
        console.warn("SharePointService: Error using Graph API to get evidence, trying REST API fallback:", graphError)
      }

      if (evidenceItems.length > 0) {
        console.log(`SharePointService: Successfully collected ${evidenceItems.length} evidence items using Graph API`)
        return evidenceItems
      }

      console.log(`SharePointService: Trying REST API fallback to get evidence items`)

      try {
        const accessToken = await this.getAccessToken()

        const url = new URL(siteUrl)
        const siteServerRelativeUrl = url.pathname

        const restUrl = `${siteUrl}/_api/web/lists/getbytitle('Documents')/items?$filter=startswith(FileRef, '${siteServerRelativeUrl}/Shared Documents/Evidence')&$top=1000`

        const response = await fetch(restUrl, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/json;odata=verbose",
          },
        })

        if (!response.ok) {
          throw new Error(`REST API query failed: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()
        const items = data.d.results || []

        console.log(`SharePointService: Found ${items.length} items via REST API`)

        for (const item of items) {
          if (item.FileSystemObjectType === 1) {
            continue
          }

          const pathParts = item.FileRef.split("/")
          const fileName = pathParts[pathParts.length - 1]

          let unitCode = ""
          let criteriaCode = ""

          const evidenceIndex = pathParts.findIndex((p: string) => p.toLowerCase() === "evidence")
          if (evidenceIndex !== -1 && pathParts.length > evidenceIndex + 1) {
            unitCode = pathParts[evidenceIndex + 1].replace(/_/g, ".")
            if (pathParts.length > evidenceIndex + 2) {
              criteriaCode = pathParts[evidenceIndex + 2].replace(/_/g, ".")
            }
          }

          const evidenceItem: Evidence = {
            id: item.GUID || item.UniqueId || crypto.randomUUID(),
            title: item.Title || fileName || "Untitled Evidence",
            dateUploaded: item.Created || item.TimeCreated || new Date().toISOString(),
            webUrl: item.FileRef
              ? `${siteUrl}/Shared%20Documents${item.FileRef.substring(item.FileRef.indexOf("/Shared Documents") + 16)}`
              : "",
            downloadUrl: item.FileRef
              ? `${siteUrl}/_layouts/15/download.aspx?SourceUrl=${encodeURIComponent(item.FileRef)}`
              : "",
            assessmentStatus: (item.AssessmentStatus as AssessmentStatus) || AssessmentStatus.Pending,
            assessorFeedback: item.AssessorFeedback || "",
            assessorName: item.AssessorName || "",
            assessmentDate: item.AssessmentDate || "",
            criteriaCode: item.CriteriaCode || criteriaCode,
            unitCode: item.UnitCode || unitCode,
            description: item.Description || "",
          }

          evidenceItems.push(evidenceItem)
        }

        console.log(
          `SharePointService: Successfully collected ${evidenceItems.length} evidence items using REST API fallback`,
        )
      } catch (restError) {
        console.error("SharePointService: REST API fallback also failed:", restError)
      }

      return evidenceItems
    } catch (error) {
      console.error("Failed to get evidence:", error)
      throw new Error("Failed to get evidence: " + (error instanceof Error ? error.message : "Unknown error"))
    }
  }

  private extractFromPath(webUrl: string, type: "unit" | "criteria"): string {
    try {
      const path = this.getRelativePath(webUrl)
      if (!path) return ""

      console.log(`Extracting ${type} from path: ${path}`)

      const parts = path.split("/")

      if (parts.length < 3 || parts[0].toLowerCase() !== "evidence") {
        return ""
      }

      if (type === "unit" && parts.length > 1) {
        return parts[1].replace(/_/g, ".")
      } else if (type === "criteria" && parts.length > 2) {
        if (parts[2].includes("_")) {
          const criteriaSegments = parts[2].split("_")
          if (criteriaSegments.length >= 2) {
            return `${criteriaSegments[0]}.${criteriaSegments[1]}`
          }
        }

        return parts[2].replace(/_/g, ".")
      }

      return ""
    } catch (error) {
      console.error(`Failed to extract ${type} from path:`, webUrl, error)
      return ""
    }
  }

  private extractFileIdFromUrl(url: string): string | null {
    try {
      if (!url || url.trim() === "") {
        return null
      }

      const urlObj = new URL(url)

      if (urlObj.pathname.includes("/_layouts/15/Doc.asp")) {
        const sourcedoc = urlObj.searchParams.get("sourcedoc")
        if (sourcedoc) {
          const cleanId = sourcedoc.replace(/[{}]/g, "")
          console.log("Extracted sourcedoc ID:", cleanId)
          return cleanId
        }

        const id = urlObj.searchParams.get("id")
        if (id) {
          console.log("Extracted ID parameter:", id)
          return id
        }
      }

      const guidMatch = url.match(/(\{[0-9a-f-]{36}\}|[0-9a-f-]{36})/i)
      if (guidMatch) {
        const guid = guidMatch[1].replace(/[{}]/g, "")
        console.log("Extracted GUID from URL:", guid)
        return guid
      }

      const itemIdMatch = url.match(/\b([0-9a-z]{15,})\b/i)
      if (itemIdMatch) {
        console.log("Extracted SharePoint item ID from URL:", itemIdMatch[1])
        return itemIdMatch[1]
      }

      const paramNames = Array.from(urlObj.searchParams.keys())
      for (const key of paramNames) {
        if (key.toLowerCase().includes("id")) {
          const value = urlObj.searchParams.get(key)
          if (value && value.length > 5) {
            console.log(`Extracted ${key} parameter:`, value)
            return value
          }
        }
      }

      return null
    } catch (e) {
      console.warn("Error extracting file ID from URL:", e)
      return null
    }
  }

  private extractFilenameFromUrl(url: string): string {
    try {
      const fileMatch = url.match(/([^/&]+\.(xlsx|pdf|docx|pptx|txt|jpg|jpeg|png|gif|bmp|webp|tiff|svg))/i)
      if (fileMatch) {
        return decodeURIComponent(fileMatch[1])
      }

      const urlObj = new URL(url)
      if (urlObj.pathname.includes("/_layouts/15/Doc.asp")) {
        const file = urlObj.searchParams.get("file")
        if (file) {
          return decodeURIComponent(file)
        }

        const name = urlObj.searchParams.get("name") || urlObj.searchParams.get("filename")
        if (name) {
          return decodeURIComponent(name)
        }
      }

      const pathParts = urlObj.pathname.split("/")
      const lastPart = pathParts[pathParts.length - 1]
      if (lastPart && lastPart !== "" && !lastPart.includes(".asp")) {
        return decodeURIComponent(lastPart)
      }

      const sourceDoc = urlObj.searchParams.get("sourcedoc")
      if (sourceDoc) {
        try {
          const decoded = decodeURIComponent(sourceDoc)
          const parts = decoded.split("/")
          return parts[parts.length - 1] || "Unknown File"
        } catch (e) {
          console.warn("Error decoding sourcedoc parameter:", e)
        }
      }

      const title = urlObj.searchParams.get("title")
      if (title) {
        if (!title.includes(".")) {
          const contentType = urlObj.searchParams.get("contenttype")
          if (contentType) {
            if (contentType.includes("png")) return `${title}.png`
            if (contentType.includes("jpeg") || contentType.includes("jpg")) return `${title}.jpg`
            if (contentType.includes("pdf")) return `${title}.pdf`
            if (contentType.includes("word")) return `${title}.docx`
            if (contentType.includes("excel") || contentType.includes("sheet")) return `${title}.xlsx`
        }
        return title
      }

      const guidMatch = url.match(/(\{[0-9a-f-]{36}\}|[0-9a-f-]{36})/i)
      if (guidMatch) {
        return `File-${guidMatch[1].replace(/[{}]/g, "")}`
      }

      return "Unknown File"
    } catch (e) {
      console.warn("Error extracting filename from URL:", e)
      return "Unknown File"
    }
  }

  public async uploadPngFile(file: File, folderPath: string, fileName: string): Promise<EvidenceMetadata> {
    try {
      console.log(`SharePointService: Using SharePoint REST API for PNG upload: ${fileName} (size: ${file.size} bytes)`)

      if (!this.isAuthenticated()) {
        await this.authenticate()
      }

      let finalFileName = fileName
      if (!finalFileName.toLowerCase().endsWith(".png")) {
        finalFileName = finalFileName.replace(/\.[^/.]+$/, "") + ".png"
      }

      if (!folderPath.startsWith("Evidence/")) {
        folderPath = folderPath.includes("Evidence")
          ? folderPath.substring(folderPath.indexOf("Evidence"))
          : `Evidence/${folderPath}`
      }

      const accessToken = await this.getAccessToken()
      const siteUrl = this.getProfileSiteUrl()
      if (!siteUrl) {
        throw new Error("SharePoint site URL not configured")
      }

      console.log(`SharePointService: Using site URL: ${siteUrl}`)

      const driveId = await this.getDriveId()

      console.log(`SharePointService: Creating folder structure for ${folderPath} in drive ${driveId}`)

      const folderSegments = folderPath.split("/").filter(Boolean)
      let currentPath = ""
      let folderId: string | undefined = undefined

      for (const segment of folderSegments) {
        currentPath = currentPath ? `${currentPath}/${segment}` : segment

        try {
          const folderResponse = await this.client!.api(`/drives/${driveId}/root:/${currentPath}`).get()
          folderId = folderResponse.id
          console.log(`SharePointService: Folder exists: ${currentPath} (${folderId})`)
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
              console.log(`SharePointService: Created folder: ${currentPath} (${folderId})`)
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

      console.log(`SharePointService: Using direct SharePoint REST API to upload PNG file`)

      const url = new URL(siteUrl)
      const siteServerRelativeUrl = url.pathname

      const targetFolderUrl = `${siteServerRelativeUrl}/Shared Documents/${folderPath}`
      console.log(`SharePointService: Target folder URL: ${targetFolderUrl}`)

      const fileArrayBuffer = await file.arrayBuffer()

      const digestResponse = await fetch(`${siteUrl}/_api/contextinfo`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json;odata=verbose",
        },
      })

      if (!digestResponse.ok) {
        throw new Error(`Failed to get form digest: ${digestResponse.status} ${digestResponse.statusText}`)
      }

      const digestData = await digestResponse.json()
      const formDigestValue = digestData.d.GetContextWebInformation.FormDigestValue
      console.log(`SharePointService: Got form digest value for REST API operation`)

      const uploadUrl = `${siteUrl}/_api/web/getfolderbyserverrelativeurl('${encodeURIComponent(targetFolderUrl)}')/Files/add(url='${encodeURIComponent(finalFileName)}',overwrite=true)`
      console.log(`SharePointService: Uploading to REST API URL: ${uploadUrl}`)

      const uploadResponse = await fetch(uploadUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "image/png",
          Accept: "application/json;odata=verbose",
          "X-RequestDigest": formDigestValue,
        },
        body: new Blob([fileArrayBuffer], { type: "image/png" }),
      })

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text()
        console.error(`SharePointService: REST API upload failed: ${uploadResponse.status}`, errorText)
        throw new Error(`SharePoint REST API upload failed: ${uploadResponse.status} ${uploadResponse.statusText}`)
      }

      const uploadResult = await uploadResponse.json()
      console.log(`SharePointService: REST API upload successful:`, uploadResult.d.ServerRelativeUrl)

      const fileServerRelativeUrl = uploadResult.d.ServerRelativeUrl
      const fileWebUrl = `${siteUrl}/Shared%20Documents/${folderPath}/${encodeURIComponent(finalFileName)}`

      try {
        console.log(`SharePointService: Adding assessment metadata to file`)

        const listItemUrl = `${siteUrl}/_api/web/getfilebyserverrelativeurl('${encodeURIComponent(fileServerRelativeUrl)}')/ListItemAllFields`
        const listItemResponse = await fetch(listItemUrl, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/json;odata=verbose",
          },
        })

        if (!listItemResponse.ok) {
          console.warn(`SharePointService: Failed to get list item: ${listItemResponse.status}`)
        } else {
          const listItem = await listItemResponse.json()
          const listItemId = listItem.d.Id

          const pathSegments = folderPath.split("/")
          let unitCode = ""
          let criteriaCode = ""

          if (pathSegments.length >= 2 && pathSegments[0].toLowerCase() === "evidence") {
            unitCode = pathSegments[1].replace(/_/g, ".")
            if (pathSegments.length >= 3) {
              criteriaCode = pathSegments[2].replace(/_/g, ".")
            }
          }

          const updateUrl = `${siteUrl}/_api/web/lists/getbytitle('Documents')/items(${listItemId})`
          const updateResponse = await fetch(updateUrl, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json;odata=verbose",
              Accept: "application/json;odata=verbose",
              "X-RequestDigest": formDigestValue,
              "X-HTTP-Method": "MERGE",
              "IF-MATCH": "*",
            },
            body: JSON.stringify({
              __metadata: { type: "SP.Data.DocumentsItem" },
              Title: finalFileName,
              UnitCode: unitCode,
              CriteriaCode: criteriaCode,
              AssessmentStatus: "pending",
            }),
          })

          if (!updateResponse.ok) {
            console.warn(`SharePointService: Failed to update metadata: ${updateResponse.status}`)
          } else {
            console.log(`SharePointService: Updated metadata successfully`)
          }
        }
      } catch (metadataError) {
        console.warn(`SharePointService: Error setting metadata (non-critical):`, metadataError)
      }

      const evidenceMetadata: EvidenceMetadata = {
        id: uploadResult.d.UniqueId || crypto.randomUUID(),
        name: finalFileName,
        webUrl: fileWebUrl,
        downloadUrl: fileWebUrl,
        size: file.size,
        mimeType: "image/png",
        createdDateTime: new Date(),
        lastModifiedDateTime: new Date(),
        assessmentStatus: AssessmentStatus.Pending,
        criteriaCode: folderPath.split("/")[2]?.replace(/_/g, ".") || "",
        unitCode: folderPath.split("/")[1]?.replace(/_/g, ".") || "",
        description: "",
      }

      console.log(`SharePointService: Returning evidence metadata:`, evidenceMetadata)
      return evidenceMetadata
    } catch (error) {
      console.error("SharePointService: Failed to upload PNG file with REST API:", error)
      throw new Error("Failed to upload PNG file: " + (error instanceof Error ? error.message : "Unknown error"))
    }
  }

  public async uploadImageFile(file: File, folderPath: string, fileName: string): Promise<EvidenceMetadata> {
    try {
      console.log(
        `SharePointService: Using specialized image file upload for ${fileName} (${file.type}, size: ${file.size} bytes)`,
      )

      if (file.type === "image/png" || fileName.toLowerCase().endsWith(".png")) {
        console.log(`SharePointService: Detected PNG file, using PNG-specific uploader`)
        return await this.uploadPngFile(file, folderPath, fileName)
      }

      let finalFileName = fileName
      if (file.type === "image/jpeg" && !finalFileName.toLowerCase().match(/\.(jpg|jpeg)$/)) {
        finalFileName = finalFileName.replace(/\.[^/.]+$/, "") + ".jpg"
      } else if (file.type === "image/gif" && !finalFileName.toLowerCase().endsWith(".gif")) {
        finalFileName = finalFileName.replace(/\.[^/.]+$/, "") + ".gif"
      }

      if (!this.isAuthenticated()) {
        await this.authenticate()
      }

      if (!folderPath.startsWith("Evidence/")) {
        folderPath = folderPath.includes("Evidence")
          ? folderPath.substring(folderPath.indexOf("Evidence"))
          : `Evidence/${folderPath}`
      }

      const driveId = await this.getDriveId()
      console.log(`SharePointService: Creating folder structure for ${folderPath}`)
      const folderSegments = folderPath.split("/").filter(Boolean)
      let currentPath = ""
      let folderId: string | undefined = undefined

      for (const segment of folderSegments) {
        currentPath = currentPath ? `${currentPath}/${segment}` : segment

        try {
          const folderResponse = await this.client!.api(`/drives/${driveId}/root:/${currentPath}`).get()
          folderId = folderResponse.id
        } catch (err: any) {
          if (err.statusCode === 404 || (err.code && err.code === "itemNotFound")) {
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
            } catch (createErr: any) {
              console.error(`SharePointService: Error creating folder ${segment}:`, createErr)
              throw new Error(`Failed to create folder: ${createErr.message || JSON.stringify(createErr)}`)
            }
          } else {
            throw err
          }
        }
      }

      if (!folderId) {
        throw new Error("Failed to create or access folder structure")
      }

      const fileArrayBuffer = await file.arrayBuffer()

      const accessToken = await this.getAccessToken()
      const encodedFileName = encodeURIComponent(finalFileName)

      try {
        const endpoint = `https://graph.microsoft.com/v1.0/drives/${driveId}/items/${folderId}:/${encodedFileName}:/content`

        const response = await fetch(endpoint, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": file.type || "application/octet-stream",
          },
          body: new Blob([fileArrayBuffer], { type: file.type }),
        })

        if (!response.ok) {
          const responseText = await response.text()
          console.error(
            `SharePointService: Direct upload failed: ${response.status} ${response.statusText}`,
            responseText,
          )
          throw new Error(`Direct upload failed: ${response.status} ${response.statusText}`)
        }

        const responseData = await response.json()
        console.log(`SharePointService: Direct upload successful, item ID: ${responseData.id}`)

        return {
          id: responseData.id,
          name: responseData.name,
          webUrl: responseData.webUrl,
          downloadUrl: responseData["@microsoft.graph.downloadUrl"],
          size: responseData.size,
          mimeType: file.type,
          createdDateTime: responseData.createdDateTime,
          lastModifiedDateTime: responseData.lastModifiedDateTime,
          assessmentStatus: AssessmentStatus.Pending,
          criteriaCode: this.extractFromPath(responseData.webUrl, "criteria"),
          unitCode: this.extractFromPath(responseData.webUrl, "unit"),
        }
      } catch (error) {
        console.error("SharePointService: Failed to upload image file:", error)
        throw new Error("Failed to upload image file: " + (error instanceof Error ? error.message : "Unknown error"))
      }
    } catch (error) {
      console.error("Failed to upload image file:", error)
      throw new Error("Failed to upload image file: " + (error instanceof Error ? error.message : "Unknown error"))
    }
  }

  public async deleteFile(fileUrl: string): Promise<void> {
    if (!this.isAuthenticated()) {
      await this.authenticate()
    }

    try {
      console.log(`SharePointService: Deleting file at URL: ${fileUrl}`)
      const driveId = await this.getDriveId()

      const filePath = this.getRelativePath(fileUrl)
      if (!filePath) {
        throw new Error("Could not determine file path from URL")
      }

      console.log(`SharePointService: Extracted relative path: ${filePath}`)

      try {
        await this.client!.api(`/drives/${driveId}/root:/${filePath}`).delete()
        console.log(`SharePointService: Successfully deleted file using Graph API`)
        return
      } catch (graphError) {
        console.warn("SharePointService: Failed to delete using Graph API, trying REST API:", graphError)
      }

      try {
        const siteUrl = this.getProfileSiteUrl()
        if (!siteUrl) {
          throw new Error("SharePoint site URL not configured")
        }

        const accessToken = await this.getAccessToken()
        const digestResponse = await fetch(`${siteUrl}/_api/contextinfo`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/json;odata=verbose",
          },
        })

        if (!digestResponse.ok) {
          throw new Error(`Failed to get form digest: ${digestResponse.status}`)
        }

        const digestData = await digestResponse.json()
        const formDigestValue = digestData.d.GetContextWebInformation.FormDigestValue

        const serverRelativeUrl = this.extractServerRelativeUrl(fileUrl)
        if (!serverRelativeUrl) {
          throw new Error("Could not determine server-relative URL")
        }

        const deleteResponse = await fetch(
          `${siteUrl}/_api/web/getfilebyserverrelativeurl('${encodeURIComponent(serverRelativeUrl)}')`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              Accept: "application/json;odata=verbose",
              "X-RequestDigest": formDigestValue,
              "X-HTTP-Method": "DELETE",
            },
          },
        )

        if (!deleteResponse.ok) {
          const errorText = await deleteResponse.text()
          throw new Error(`REST API delete failed: ${deleteResponse.status} - ${errorText}`)
        }

        console.log(`SharePointService: Successfully deleted file using REST API`)
      } catch (restError) {
        console.error("SharePointService: REST API delete also failed:", restError)
        throw restError
      }
    } catch (error) {
      console.error("SharePointService: Failed to delete file:", error)
      throw new Error("Failed to delete file: " + (error instanceof Error ? error.message : "Unknown error"))
    }
  }

  private extractServerRelativeUrl(url: string): string | null {
    try {
      if (!url) return null

      const urlObj = new URL(url)
      const hostname = urlObj.hostname

      if (url.includes("/Shared%20Documents/") || url.includes("/Shared Documents/")) {
        const sharedDocsIndex = url.indexOf("/Shared Documents/")
        if (sharedDocsIndex !== -1) {
          return url.substring(sharedDocsIndex)
        }

        const encodedDocsIndex = url.indexOf("/Shared%20Documents/")
        if (encodedDocsIndex !== -1) {
          return decodeURIComponent(url.substring(encodedDocsIndex))
        }
      }

      if (url.includes("/sites/")) {
        const sitesIndex = url.indexOf("/sites/")
        if (sitesIndex !== -1) {
          return url.substring(sitesIndex)
        }
      }

      if (url.includes("/teams/")) {
        const teamsIndex = url.indexOf("/teams/")
        if (teamsIndex !== -1) {
          return url.substring(teamsIndex)
        }
      }

      if (url.includes("/_layouts/")) {
        const urlObj = new URL(url)
        const sourceDoc = urlObj.searchParams.get("sourcedoc")
        if (sourceDoc) {
          return `/Shared Documents/Evidence/${sourceDoc.replace(/[{}]/g, "")}`
        }
      }

      return urlObj.pathname
    } catch (error) {
      console.error("Error extracting server-relative URL:", error)
      return null
    }
  }

  public async createFolderIfNeeded(folderPath: string): Promise<string> {
    if (!this.isAuthenticated()) {
      await this.authenticate()
    }

    try {
      const driveId = await this.getDriveId()
      console.log(`SharePointService: Creating folder if needed: ${folderPath} in drive ${driveId}`)

      try {
        const response = await this.client!.api(`/drives/${driveId}/root:/${folderPath}`).get()

        console.log(`SharePointService: Folder ${folderPath} already exists with ID: ${response.id}`)
        return response.id
      } catch (error: any) {
        if (error.statusCode === 404 || (error.response && error.response.status === 404)) {
          console.log(`SharePointService: Folder ${folderPath} not found, creating it`)

          const folderSegments = folderPath.split("/").filter(Boolean)

          if (folderSegments.length > 1) {
            let currentPath = ""
            let currentFolderId = ""

            for (const segment of folderSegments) {
              currentPath = currentPath ? `${currentPath}/${segment}` : segment
              console.log(`SharePointService: Creating folder segment: ${currentPath}`)

              try {
                const folderResponse = await this.client!.api(`/drives/${driveId}/root:/${currentPath}`).get()

                currentFolderId = folderResponse.id
                console.log(
                  `SharePointService: Folder segment ${currentPath} already exists with ID: ${currentFolderId}`,
                )
              } catch (segmentError: any) {
                if (
                  segmentError.statusCode === 404 ||
                  (segmentError.response && segmentError.response.status === 404)
                ) {
                  const parentPath = currentPath.substring(0, currentPath.lastIndexOf("/")) || ""
                  const createEndpoint = parentPath
                    ? `/drives/${driveId}/root:/${parentPath}:/children`
                    : `/drives/${driveId}/root/children`

                  const createResponse = await this.client!.api(createEndpoint).post({
                    name: segment,
                    folder: {},
                    "@microsoft.graph.conflictBehavior": "replace",
                  })

                  currentFolderId = createResponse.id
                  console.log(`SharePointService: Created folder segment ${currentPath} with ID: ${currentFolderId}`)
                } else {
                  console.error(`SharePointService: Error checking folder segment ${currentPath}:`, segmentError)
                  throw segmentError
                }
              }
            }

            return currentFolderId
          } else {
            const createResponse = await this.client!.api(`/drives/${driveId}/root/children`).post({
              name: folderSegments[0],
              folder: {},
              "@microsoft.graph.conflictBehavior": "replace",
            })

            console.log(`SharePointService: Created folder ${folderPath} with ID: ${createResponse.id}`)
            return createResponse.id
          }
        } else {
          console.error(`SharePointService: Error checking folder ${folderPath}:`, error)
          throw error
        }
      }
    } catch (error) {
      console.error(`SharePointService: Failed to create folder ${folderPath}:`, error)
      throw new Error(`Failed to create folder: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  public async getAllAccessibleSites(): Promise<any[]> {
    try {
      await this.authenticate()

      if (!this.client) {
        throw new Error("Graph client is not initialized")
      }

      console.log("SharePointService: Fetching all accessible sites...")

      let sites: any[] = []

      try {
        const response = await this.client.api("/me/sites").get()
        sites = response.value || []
        console.log("SharePointService: /me/sites returned", sites.length, "sites")
      } catch (error) {
        console.warn("SharePointService: /me/sites failed:", error)
      }

      if (sites.length === 0) {
        try {
          console.log("SharePointService: Trying tenant-wide site search...")
          const tenantResponse = await this.client.api("/sites").get()
          sites = tenantResponse.value || []
          console.log("SharePointService: /sites returned", sites.length, "sites")
        } catch (error) {
          console.warn("SharePointService: /sites failed:", error)
        }
      }

      if (sites.length === 0) {
        try {
          console.log("SharePointService: Trying organization sites...")
          const orgResponse = await this.client.api("/sites?search=*").get()
          sites = orgResponse.value || []
          console.log("SharePointService: /sites?search=* returned", sites.length, "sites")
        } catch (error) {
          console.warn("SharePointService: /sites?search=* failed:", error)
        }
      }

      console.log("SharePointService: Final sites found:", sites.length)

      return sites
    } catch (error: any) {
      console.error("SharePointService: Failed to get accessible sites:", error)

      if (error.statusCode === 403 || error.code === "Forbidden") {
        throw new Error(
          "Access denied. You need Sites.Read.All or Sites.ReadWrite.All permissions to access SharePoint sites.",
        )
      } else if (error.statusCode === 401 || error.code === "Unauthorized") {
        throw new Error("Authentication failed. Please sign in again.")
      } else if (error.message && error.message.includes("AADSTS900144")) {
        throw new Error("Authentication configuration error. Please check your Azure AD settings.")
      } else {
        throw new Error(`Failed to get accessible sites: ${error.message || "Unknown error"}`)
      }
    }
  }

  public async getAllSitesFromTenant(tenantUrl: string): Promise<any[]> {
    try {
      await this.authenticate()

      if (!this.client) {
        throw new Error("Graph client is not initialized")
      }

      console.log("SharePointService: Fetching all sites from tenant:", tenantUrl)

      const url = new URL(tenantUrl)
      const tenantDomain = url.hostname

      const response = await this.client.api(`/sites?search=${tenantDomain}`).get()

      console.log("SharePointService: Found sites in tenant:", response.value.length)

      return response.value
    } catch (error) {
      console.error("SharePointService: Failed to get sites from tenant:", error)
      throw new Error("Failed to get sites from tenant")
    }
  }

  public async checkSiteForEvidence(siteUrl: string): Promise<{
    hasEvidence: boolean
    evidenceCount: number
    lastActivity: Date | null
    candidateName: string
  }> {
    try {
      await this.authenticate()

      if (!this.client) {
        throw new Error("Graph client is not initialized")
      }

      console.log("SharePointService: Checking site for evidence:", siteUrl)

      const candidateName = this.extractCandidateNameFromSiteUrl(siteUrl)

      let siteId: string
      try {
        const siteResponse = await this.client.api(`/sites/${siteUrl}:/`).get()
        siteId = siteResponse.id
        console.log("SharePointService: Found site ID:", siteId)
      } catch (siteError) {
        console.warn("SharePointService: Could not get site ID for:", siteUrl, siteError)
        return {
          hasEvidence: false,
          evidenceCount: 0,
          lastActivity: null,
          candidateName: candidateName,
        }
      }

      const driveResponse = await this.client.api(`/sites/${siteId}/drives`).get()

      if (!driveResponse.value || driveResponse.value.length === 0) {
        console.log("SharePointService: No drives found in site")
        return {
          hasEvidence: false,
          evidenceCount: 0,
          lastActivity: null,
          candidateName: candidateName,
        }
      }

      const driveId = driveResponse.value[0].id
      console.log("SharePointService: Using drive ID:", driveId)

      try {
        const evidenceFolderResponse = await this.client.api(`/drives/${driveId}/root:/Evidence:/children`).get()

        if (evidenceFolderResponse.value && evidenceFolderResponse.value.length > 0) {
          let evidenceCount = 0
          let lastActivity: Date | null = null

          for (const item of evidenceFolderResponse.value) {
            if (item.folder) {
              try {
                const unitFilesResponse = await this.client.api(`/drives/${driveId}/items/${item.id}/children`).get()
                evidenceCount += unitFilesResponse.value.filter((file: any) => !file.folder).length

                for (const file of unitFilesResponse.value) {
                  if (file.lastModifiedDateTime) {
                    const fileDate = new Date(file.lastModifiedDateTime)
                    if (!lastActivity || fileDate > lastActivity) {
                      lastActivity = fileDate
                    }
                  }
                }
              } catch (unitError) {
                console.warn("SharePointService: Error checking unit folder:", unitError)
              }
            } else {
              evidenceCount++
              if (item.lastModifiedDateTime) {
                const fileDate = new Date(item.lastModifiedDateTime)
                if (!lastActivity || fileDate > lastActivity) {
                  lastActivity = fileDate
                }
              }
            }
          }

          console.log(`SharePointService: Found ${evidenceCount} evidence items in site ${candidateName}`)

          return {
            hasEvidence: evidenceCount > 0,
            evidenceCount,
            lastActivity,
            candidateName: candidateName,
          }
        }
      } catch (evidenceError) {
        console.log("SharePointService: No Evidence folder found in site, trying alternative locations...")

        const alternativeFolders = ["Portfolio", "Documents", "Files", "Evidence"]

        for (const folderName of alternativeFolders) {
          try {
            const folderResponse = await this.client.api(`/drives/${driveId}/root:/${folderName}:/children`).get()

            if (folderResponse.value && folderResponse.value.length > 0) {
              console.log(`SharePointService: Found ${folderName} folder with ${folderResponse.value.length} items`)

              let evidenceCount = 0
              let lastActivity: Date | null = null

              for (const item of folderResponse.value) {
                if (!item.folder) {
                  evidenceCount++
                  if (item.lastModifiedDateTime) {
                    const fileDate = new Date(item.lastModifiedDateTime)
                    if (!lastActivity || fileDate > lastActivity) {
                      lastActivity = fileDate
                    }
                  }
                }
              }

              if (evidenceCount > 0) {
                console.log(`SharePointService: Found ${evidenceCount} evidence items in ${folderName} folder`)
                return {
                  hasEvidence: true,
                  evidenceCount,
                  lastActivity,
                  candidateName: candidateName,
                }
              }
            }
          } catch (folderError) {
            console.log(`SharePointService: ${folderName} folder not found`)
          }
        }
      }

      console.log("SharePointService: No evidence found in any location")
      return {
        hasEvidence: false,
        evidenceCount: 0,
        lastActivity: null,
        candidateName: candidateName,
      }
    } catch (error: any) {
      console.error("SharePointService: Failed to check site for evidence:", error)

      return {
        hasEvidence: false,
        evidenceCount: 0,
        lastActivity: null,
        candidateName: this.extractCandidateNameFromSiteUrl(siteUrl),
      }
    }
  }

  private extractCandidateNameFromSiteUrl(siteUrl: string): string {
    try {
      const url = new URL(siteUrl)
      const pathParts = url.pathname.split("/")

      const siteIndex = pathParts.findIndex((part) => part === "sites")
      if (siteIndex !== -1 && pathParts[siteIndex + 1]) {
        const siteName = pathParts[siteIndex + 1]
        return siteName
          .replace(/-/g, " ")
          .replace(/_/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase())
          .trim()
      }

      return "Unknown Candidate"
    } catch {
      return "Unknown Candidate"
    }
  }

  private async getSiteIdFromUrl(siteUrl: string): Promise<string> {
    try {
      if (!this.client) {
        throw new Error("Graph client is not initialized")
      }

      const response = await this.client.api(`/sites/${siteUrl}:/`).get()
      return response.id
    } catch (error) {
      console.error("SharePointService: Failed to get site ID from URL:", error)
      throw new Error("Failed to get site ID from URL")
    }
  }

  static async uploadFile(file: File, folderPath = ""): Promise<SharePointFile> {
    const accessToken = await this.getAccessToken()

    // Mock implementation - replace with actual SharePoint API calls
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: `file_${Date.now()}`,
          name: file.name,
          size: file.size,
          lastModified: new Date().toISOString(),
          downloadUrl: `https://mock-sharepoint.com/download/${file.name}`,
          webUrl: `https://mock-sharepoint.com/view/${file.name}`,
        })
      }, 1000)
    })
  }

  static async getFiles(folderPath = ""): Promise<SharePointFile[]> {
    const accessToken = await this.getAccessToken()

    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: "file_1",
            name: "electrical_diagram.pdf",
            size: 2048576,
            lastModified: "2024-01-10T10:30:00Z",
            downloadUrl: "https://mock-sharepoint.com/download/electrical_diagram.pdf",
            webUrl: "https://mock-sharepoint.com/view/electrical_diagram.pdf",
          },
          {
            id: "file_2",
            name: "safety_certificate.jpg",
            size: 1024000,
            lastModified: "2024-01-08T14:15:00Z",
            downloadUrl: "https://mock-sharepoint.com/download/safety_certificate.jpg",
            webUrl: "https://mock-sharepoint.com/view/safety_certificate.jpg",
          },
        ])
      }, 800)
    })
  }

  static async getFolders(parentPath = ""): Promise<SharePointFolder[]> {
    const accessToken = await this.getAccessToken()

    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: "folder_1",
            name: "Unit 1 - Electrical Safety",
            itemCount: 5,
            webUrl: "https://mock-sharepoint.com/folder/unit1",
          },
          {
            id: "folder_2",
            name: "Unit 2 - Wiring Systems",
            itemCount: 8,
            webUrl: "https://mock-sharepoint.com/folder/unit2",
          },
        ])
      }, 600)
    })
  }

  static async deleteFile(fileId: string): Promise<void> {
    const accessToken = await this.getAccessToken()

    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve()
      }, 500)
    })
  }

  static async createFolder(name: string, parentPath = ""): Promise<SharePointFolder> {
    const accessToken = await this.getAccessToken()

    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: `folder_${Date.now()}`,
          name: name,
          itemCount: 0,
          webUrl: `https://mock-sharepoint.com/folder/${name.toLowerCase().replace(/\s+/g, "-")}`,
        })
      }, 700)
    })
  }

  private async ensureInitialized(): Promise<void> {
    if (!this.isInitialized) {
      await this.initializeMsal()
    }
  }
}

export function mapSharePointDataToEvidence(item: any): Evidence {
  return {
    id: item.id || item.ID || generateId(),
    criteriaCode: item.criteriaCode || item.CriteriaCode || "",
    unitCode: item.unitCode || item.UnitCode || "",
    title: item.title || item.Title || item.name || item.Name || "Untitled Evidence",
    description: item.description || item.Description || "",
    dateUploaded: new Date(
      item.dateUploaded || item.DateUploaded || item.createdDateTime || item.Created || new Date(),
    ).toISOString(),
    webUrl: item.webUrl || item.WebUrl || "",
    downloadUrl: item.downloadUrl || item.DownloadUrl || "",
    assessmentStatus: item.assessmentStatus || item.AssessmentStatus || AssessmentStatus.Pending,
    assessorFeedback: item.assessorFeedback || item.AssessorFeedback || "",
    assessorName: item.assessorName || item.AssessorName || "",
    assessmentDate: item.assessmentDate ? new Date(item.assessmentDate).toISOString() : undefined,
  }
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

export default SharePointService
