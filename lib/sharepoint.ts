import { ConfidentialClientApplication } from "@azure/msal-node"

// SharePoint configuration from environment variables
const SHAREPOINT_CONFIG = {
  tenantId: process.env.SHAREPOINT_TENANT_ID || "",
  clientId: process.env.SHAREPOINT_CLIENT_ID || "",
  clientSecret: process.env.SHAREPOINT_CLIENT_SECRET || "",
  siteId: process.env.SHAREPOINT_SITE_ID || "",
  driveId: process.env.SHAREPOINT_DRIVE_ID || "",
}

// MSAL configuration
const msalConfig = {
  auth: {
    clientId: SHAREPOINT_CONFIG.clientId,
    authority: `https://login.microsoftonline.com/${SHAREPOINT_CONFIG.tenantId}`,
    clientSecret: SHAREPOINT_CONFIG.clientSecret,
  },
}

export function isSharePointConfigured(): boolean {
  return !!(
    SHAREPOINT_CONFIG.tenantId &&
    SHAREPOINT_CONFIG.clientId &&
    SHAREPOINT_CONFIG.clientSecret &&
    SHAREPOINT_CONFIG.siteId
  )
}

async function getAccessToken(): Promise<string> {
  if (!isSharePointConfigured()) {
    throw new Error("SharePoint is not configured. Please set the required environment variables.")
  }

  const cca = new ConfidentialClientApplication(msalConfig)

  const result = await cca.acquireTokenByClientCredential({
    scopes: ["https://graph.microsoft.com/.default"],
  })

  if (!result || !result.accessToken) {
    throw new Error("Failed to acquire access token")
  }

  return result.accessToken
}

export async function uploadToSharePoint(
  folderPath: string,
  fileName: string,
  fileContent: Buffer | Uint8Array,
  contentType: string
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const accessToken = await getAccessToken()

    // Clean up folder path
    const cleanPath = folderPath.startsWith("/") ? folderPath.slice(1) : folderPath
    const encodedPath = encodeURIComponent(`${cleanPath}/${fileName}`)

    // Upload using Microsoft Graph API
    const uploadUrl = SHAREPOINT_CONFIG.driveId
      ? `https://graph.microsoft.com/v1.0/sites/${SHAREPOINT_CONFIG.siteId}/drives/${SHAREPOINT_CONFIG.driveId}/root:/${encodedPath}:/content`
      : `https://graph.microsoft.com/v1.0/sites/${SHAREPOINT_CONFIG.siteId}/drive/root:/${encodedPath}:/content`

    const response = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": contentType,
      },
      body: fileContent,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("SharePoint upload error:", errorData)
      return {
        success: false,
        error: errorData.error?.message || `Upload failed with status ${response.status}`,
      }
    }

    const data = await response.json()

    return {
      success: true,
      url: data.webUrl || data["@microsoft.graph.downloadUrl"],
    }
  } catch (error) {
    console.error("SharePoint upload error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

export async function checkFolderExists(folderPath: string): Promise<boolean> {
  try {
    const accessToken = await getAccessToken()

    const cleanPath = folderPath.startsWith("/") ? folderPath.slice(1) : folderPath
    const encodedPath = encodeURIComponent(cleanPath)

    const url = SHAREPOINT_CONFIG.driveId
      ? `https://graph.microsoft.com/v1.0/sites/${SHAREPOINT_CONFIG.siteId}/drives/${SHAREPOINT_CONFIG.driveId}/root:/${encodedPath}`
      : `https://graph.microsoft.com/v1.0/sites/${SHAREPOINT_CONFIG.siteId}/drive/root:/${encodedPath}`

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    return response.ok
  } catch {
    return false
  }
}

export async function createFolder(folderPath: string): Promise<{ success: boolean; error?: string }> {
  try {
    const accessToken = await getAccessToken()

    const pathParts = folderPath.split("/").filter(Boolean)
    const folderName = pathParts.pop()
    const parentPath = pathParts.join("/")

    const parentUrl = parentPath
      ? SHAREPOINT_CONFIG.driveId
        ? `https://graph.microsoft.com/v1.0/sites/${SHAREPOINT_CONFIG.siteId}/drives/${SHAREPOINT_CONFIG.driveId}/root:/${encodeURIComponent(parentPath)}:/children`
        : `https://graph.microsoft.com/v1.0/sites/${SHAREPOINT_CONFIG.siteId}/drive/root:/${encodeURIComponent(parentPath)}:/children`
      : SHAREPOINT_CONFIG.driveId
        ? `https://graph.microsoft.com/v1.0/sites/${SHAREPOINT_CONFIG.siteId}/drives/${SHAREPOINT_CONFIG.driveId}/root/children`
        : `https://graph.microsoft.com/v1.0/sites/${SHAREPOINT_CONFIG.siteId}/drive/root/children`

    const response = await fetch(parentUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: folderName,
        folder: {},
        "@microsoft.graph.conflictBehavior": "replace",
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return {
        success: false,
        error: errorData.error?.message || `Failed to create folder: ${response.status}`,
      }
    }

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
