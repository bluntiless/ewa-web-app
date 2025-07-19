import { Client } from '@microsoft/microsoft-graph-client';
import { PublicClientApplication, AccountInfo, BrowserAuthError } from '@azure/msal-browser';
import { msalConfig } from '../lib/msalInstance';

export interface UploadSession {
  uploadUrl: string;
  webUrl: string;
}

export interface Evidence {
  id: string;
  criteriaCode: string;
  unitCode: string;
  title: string;
  description: string;
  dateUploaded: string;
  assessmentStatus: AssessmentStatus;
  assessorFeedback?: string;
  assessorName?: string;
  assessmentDate?: string;
  webUrl: string;
  downloadUrl?: string;
}

export interface EvidenceMetadata {
  id: string;
  name: string;
  webUrl?: string;
  downloadUrl?: string;
  size: number;
  mimeType: string;
  createdDateTime: Date;
  lastModifiedDateTime: Date;
  assessmentStatus?: AssessmentStatus;
  assessorFeedback?: string;
  assessorName?: string;
  assessmentDate?: Date | string | null;
  criteriaCode?: string;
  unitCode?: string;
  description?: string;
}

export enum AssessmentStatus {
  NotStarted = 'not-started',
  Pending = 'pending',
  Approved = 'approved',
  Rejected = 'rejected',
  NeedsRevision = 'needs-revision'
}

// Required scopes for SharePoint access
const REQUIRED_SCOPES = [
  'Files.ReadWrite.All',
  'Sites.ReadWrite.All',
  'Sites.FullControl.All',
  'User.Read',
  'User.Read.All'
];

export class SharePointService {
  private static instance: SharePointService;
  private msalInstance: PublicClientApplication | null = null;
  private client: Client | null = null;
  private account: AccountInfo | null = null;
  private isInitialized = false;
  private authLoading: boolean = false;
  private siteUrl: string = '';

  public isAuthLoading(): boolean {
    return this.authLoading;
  }

  private constructor() {
    // Initialize MSAL immediately in browser environment
    if (typeof window !== 'undefined') {
      console.log('SharePointService: Constructing and initializing MSAL...');
      this.initializeMsal().catch(err => {
        console.error('Failed to initialize MSAL during construction:', err);
      });
    }
  }

  public static getInstance(): SharePointService {
    if (!SharePointService.instance) {
      SharePointService.instance = new SharePointService();
    }
    return SharePointService.instance;
  }

  /**
   * Utility method to retry operations with exponential backoff
   * @param operation Function that performs the operation to retry
   * @param maxRetries Maximum number of retry attempts
   * @param isRetryable Optional function to determine if an error is retryable
   * @returns Result of the operation
   */
  private async retryWithBackoff<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    isRetryable: (error: any) => boolean = (error) => {
      // Default retry logic - retry on 429 and 503 errors
      return error && 
        (error.statusCode === 429 || 
         (error.response && error.response.status === 429) ||
         error.statusCode === 503 || 
         (error.response && error.response.status === 503) ||
         error.message && (error.message.includes('429') || error.message.includes('503')));
    }
  ): Promise<T> {
    let retries = 0;
    
    while (true) {
      try {
        return await operation();
      } catch (error) {
        if (retries >= maxRetries || !isRetryable(error)) {
          throw error;
        }
        
        // Exponential backoff with jitter to avoid thundering herd
        const backoffTime = Math.pow(2, retries) * 1000 + Math.random() * 1000;
        console.log(`SharePointService: Retrying operation after ${Math.round(backoffTime)}ms (retry ${retries + 1}/${maxRetries})`, error);
        
        await new Promise(resolve => setTimeout(resolve, backoffTime));
        retries++;
      }
    }
  }

  // Initialize MSAL instance
  private async initializeMsal(): Promise<void> {
    try {
      if (typeof window === 'undefined') {
        throw new Error('Cannot initialize MSAL in server environment');
      }
      
      if (this.isInitialized && this.msalInstance) {
        console.log('SharePointService: MSAL already initialized');
        return;
      }

      console.log('SharePointService: Initializing MSAL with config:', JSON.stringify({
        clientId: msalConfig.auth.clientId,
        authority: msalConfig.auth.authority,
        redirectUri: msalConfig.auth.redirectUri
      }));
      
      // Check browser compatibility
      this.checkBrowserCompatibility();
      
      // Create new instance with proper config
      try {
        this.msalInstance = new PublicClientApplication(msalConfig);
        // Initialize the MSAL instance
        await this.msalInstance.initialize();
        console.log('SharePointService: MSAL instance initialized');
      } catch (error: any) {
        console.error('SharePointService: Error creating MSAL instance:', error);
        throw new Error(`Failed to initialize authentication: ${error.message}`);
      }
      
      // Handle any redirect response
      try {
        console.log('SharePointService: Checking for redirect response...');
        const response = await this.msalInstance.handleRedirectPromise();

        console.log('SharePointService: Redirect response:', response);

        if (response && response.account) {
          console.log('SharePointService: Received account after redirect:', response.account.username);
          this.account = response.account;

          // Restore previous location if saved
          const returnUrl = sessionStorage.getItem('postLoginRedirect');
          if (returnUrl) {
            console.log('SharePointService: Redirecting back to saved URL:', returnUrl);
            sessionStorage.removeItem('postLoginRedirect');
            window.location.href = returnUrl;
            return;
          }
        } else {
          console.log('SharePointService: No redirect response found');
        }
      } catch (redirectError) {
        console.warn('SharePointService: Error handling redirect (this may be normal on first load):', redirectError);
        // Continue despite redirect errors - this is often normal
      }
      
      // Check for existing accounts
      const accounts = this.msalInstance.getAllAccounts();
      if (accounts.length > 0) {
        this.account = accounts[0];
        console.log('SharePointService: Found existing account:', this.account.username);
      }
      
      this.isInitialized = true;
      
      if (accounts.length > 0) {
        this.initializeGraphClient();
      }
      
      console.log('SharePointService: MSAL initialized successfully');
      
      // Add event handler for login failure to detect errors early
      if (this.msalInstance) {
        this.msalInstance.addEventCallback((event) => {
          if (event.eventType.includes('LOGIN_FAILURE')) {
            console.error('SharePointService: Login failure event:', event.error);
          } else if (event.eventType.includes('LOGIN_SUCCESS')) {
            console.log('SharePointService: Login success event');
          }
        });
      }
    } catch (error) {
      console.error('SharePointService: Failed to initialize MSAL:', error);
      this.isInitialized = false;
      this.msalInstance = null;
      throw error;
    }
  }

  // Helper to check browser compatibility
  private checkBrowserCompatibility(): void {
    // Check for localStorage/sessionStorage support
    try {
      if (typeof window !== 'undefined') {
        // Test if sessionStorage is available
        const testKey = 'msal-test';
        window.sessionStorage.setItem(testKey, 'test');
        window.sessionStorage.removeItem(testKey);
        
        // Test if cookies are enabled
        const testCookie = 'msal-test=test';
        document.cookie = testCookie;
        const cookiesEnabled = document.cookie.indexOf(testCookie) !== -1;
        if (!cookiesEnabled) {
          console.warn('SharePointService: Cookies appear to be disabled. This may cause authentication issues.');
          throw new Error('Cookies are disabled in your browser. MSAL authentication requires cookies to be enabled.');
        }
        
        // Check for third-party cookie blocking
        this.checkThirdPartyCookies();
      }
    } catch (storageError) {
      console.error('SharePointService: Browser storage not available:', storageError);
      throw new Error('Authentication requires session storage and cookies to be enabled in your browser.');
    }
    
    // Check if running in private browsing mode (which may cause issues)
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const testKey = 'msal-test';
        window.localStorage.setItem(testKey, 'test');
        window.localStorage.removeItem(testKey);
      }
    } catch (privateError) {
      console.warn('SharePointService: Private browsing mode detected. This may affect authentication persistence.');
    }
  }
  
  // Check for third-party cookie blocking
  private checkThirdPartyCookies(): void {
    try {
      const now = new Date();
      const expires = new Date(now.getTime() + 1000).toUTCString();
      
      // Create cookie attributes that are strict
      const secureCookie = 'msal-test-secure=test; expires=' + expires + '; path=/; secure; SameSite=None';
      document.cookie = secureCookie;
      
      // Check if secure cookie was set
      const secureEnabled = document.cookie.indexOf('msal-test-secure=') !== -1;
      if (!secureEnabled) {
        console.warn('SharePointService: Browser appears to be blocking third-party/secure cookies. This may cause authentication issues.');
      }
      
      // Clean up test cookie
      document.cookie = 'msal-test-secure=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;';
    } catch (error) {
      console.warn('SharePointService: Error checking third-party cookies:', error);
    }
  }

  // Initialize Graph client
  private initializeGraphClient(): void {
    if (!this.msalInstance) {
      throw new Error('MSAL instance must be initialized before creating Graph client');
    }
    
    try {
      this.client = Client.init({
        authProvider: async (callback) => {
          try {
            const token = await this.getAccessToken();
            callback(null, token);
          } catch (error) {
            callback(error as Error, null);
          }
        }
      });
      console.log('SharePointService: Graph client initialized');
    } catch (error) {
      console.error('SharePointService: Failed to initialize Graph client:', error);
      throw error;
    }
  }

  // Get token for Graph API
  private async getAccessToken(): Promise<string> {
    // Always ensure MSAL is initialized before any MSAL API usage
    if (!this.isInitialized || !this.msalInstance) {
      await this.initializeMsal();
      if (!this.isInitialized || !this.msalInstance) {
        throw new Error('MSAL is not initialized');
      }
    }
    try {
      // Get accounts
      const accounts = this.msalInstance.getAllAccounts();
      if (accounts.length === 0) {
        throw new Error('No authenticated accounts found');
      }
      // Acquire token silently
      const response = await this.msalInstance.acquireTokenSilent({
        scopes: REQUIRED_SCOPES,
        account: accounts[0]
      });
      return response.accessToken;
    } catch (error) {
      console.error('SharePointService: Failed to get access token:', error);
      throw error;
    }
  }

  // Helper to get the candidate's SharePoint site URL from localStorage/profile
  private getProfileSiteUrl(siteUrl?: string): string {
    if (siteUrl) return siteUrl;
    try {
      if (typeof window !== 'undefined') {
        const profile = JSON.parse(localStorage.getItem('profile') || '{}');
        return profile.sharePointUrl || '';
      }
      return '';
    } catch {
      return '';
    }
  }
  
  /**
   * Validates the SharePoint site URL format and site existence
   * @param siteUrl The SharePoint site URL to validate
   * @returns True if valid, throws error with details if invalid
   */
  public async validateSiteUrl(siteUrl: string): Promise<boolean> {
    try {
      if (!siteUrl || typeof siteUrl !== 'string') {
        throw new Error('Invalid SharePoint site URL: URL is empty or invalid');
      }

      // Validate URL format
      try {
        const url = new URL(siteUrl);
        
        // Check if it's a SharePoint URL
        if (!url.hostname.includes('sharepoint.com')) {
          throw new Error('Invalid SharePoint site URL: Not a SharePoint domain');
        }
        
        // Check if it has a site path
        if (!url.pathname.includes('/sites/')) {
          throw new Error('Invalid SharePoint site URL: Missing site path (/sites/sitename)');
        }
      } catch (urlError: any) {
        throw new Error(`Invalid SharePoint site URL format: ${urlError.message}`);
      }
      
      // Try to get the site info to validate it exists and we have access
      if (!this.isAuthenticated()) {
        await this.authenticate();
      }
      
      try {
        // Extract the hostname and path from the URL
        const url = new URL(siteUrl);
        const hostname = url.hostname;
        const path = url.pathname;
        
        // Get the site ID using the hostname and path
        await this.client!.api(`/sites/${hostname}:${path}`)
          .get();
          
        return true;
      } catch (error: any) {
        console.error('Failed to validate site URL:', error);
        
        // If it's a 403 Forbidden, that means the site exists but we don't have access
        if (error.statusCode === 403 || (error.response && error.response.status === 403)) {
          throw new Error('Access denied to SharePoint site. Please check your permissions or try a different site.');
        }
        
        // If it's a 404 Not Found, that means the site doesn't exist
        if (error.statusCode === 404 || (error.response && error.response.status === 404)) {
          throw new Error(`SharePoint site not found at "${siteUrl}". Please check the URL and try again.`);
        }
        
        throw new Error(`Failed to validate SharePoint site: ${error.message || 'Unknown error'}`);
      }
    } catch (error: any) {
      console.error('Site URL validation failed:', error);
      throw error;
    }
  }
  
  /**
   * Checks if the user is currently authenticated
   */
  public isAuthenticated(): boolean {
    return this.account !== null && this.client !== null;
  }

  /**
   * Authenticates with SharePoint using the stored credentials
   */
  public async authenticate(): Promise<void> {
    if (this.isAuthenticated()) {
      return;
    }

    try {
      if (!this.msalInstance) {
        await this.initializeMsal();
      }

      if (!this.msalInstance) {
        throw new Error('Failed to initialize MSAL');
      }

      // Try to get token silently first
      try {
        const accounts = this.msalInstance.getAllAccounts();
        if (accounts.length > 0) {
          this.account = accounts[0];
          await this.getAccessToken();
          this.initializeGraphClient();
          return;
        }
      } catch (silentError) {
        console.log('Silent token acquisition failed, will try interactive login');
      }

      // If silent token acquisition fails, try interactive login
      const loginResponse = await this.msalInstance.loginPopup({
        scopes: REQUIRED_SCOPES
      });

      if (loginResponse.account) {
        this.account = loginResponse.account;
        await this.getAccessToken();
        this.initializeGraphClient();
      } else {
        throw new Error('No account returned from login');
      }
    } catch (error) {
      console.error('Authentication failed:', error);
      throw new Error('Authentication failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  }

  /**
   * Gets the drive ID for the current SharePoint site
   */
  private async getDriveId(siteUrl?: string): Promise<string> {
    return this.retryWithBackoff(async () => {
      if (!this.isAuthenticated()) {
        await this.authenticate();
      }

      try {
        // Get the site ID first
        const siteId = await this.getSiteId();
        
        // Then get the default document library (drive)
        const response = await this.client!.api(`/sites/${siteId}/drives`)
          .get();
        
        if (!response.value || response.value.length === 0) {
          throw new Error('No drives found in the SharePoint site');
        }
        
        // Return the ID of the default document library
        return response.value[0].id;
      } catch (error) {
        console.error('Failed to get drive ID:', error);
        throw new Error('Failed to get drive ID: ' + (error instanceof Error ? error.message : 'Unknown error'));
      }
    });
  }

  /**
   * Gets the site ID for the current SharePoint site
   */
  private async getSiteId(): Promise<string> {
    return this.retryWithBackoff(async () => {
      if (!this.isAuthenticated()) {
        await this.authenticate();
      }

      try {
        const siteUrl = this.getProfileSiteUrl();
        if (!siteUrl) {
          throw new Error('SharePoint site URL not configured');
        }

        // Extract the hostname and path from the URL
        const url = new URL(siteUrl);
        const hostname = url.hostname;
        const path = url.pathname;

        // Get the site ID using the hostname and path
        const response = await this.client!.api(`/sites/${hostname}:${path}`)
          .get();

        return response.id;
      } catch (error) {
        console.error('Failed to get site ID:', error);
        throw new Error('Failed to get site ID: ' + (error instanceof Error ? error.message : 'Unknown error'));
      }
    });
  }

  /**
   * Uploads evidence to SharePoint (matches iOS app logic)
   * @param file The file to upload (must be a File, not a folder)
   * @param folderPath The folder path to upload to (e.g., Evidence/NETP3_01/1_1_1_2_1_3_1_3a)
   * @param fileName The name to give the file
   */
  public async uploadEvidence(file: File, folderPath: string, fileName: string): Promise<void> {
    if (!this.isAuthenticated()) {
      await this.authenticate();
    }

    try {
      const driveId = await this.getDriveId();
      console.log(`SharePointService: Starting upload of ${fileName} (type: ${file.type}) to ${folderPath} in drive ${driveId}`);

      // Make sure folderPath is properly formatted
      if (!folderPath.startsWith('Evidence/')) {
        console.warn('SharePointService: folderPath does not start with Evidence/, correcting...');
        folderPath = folderPath.includes('Evidence') 
          ? folderPath.substring(folderPath.indexOf('Evidence'))
          : `Evidence/${folderPath}`;
      }

      // 1. Ensure folder structure exists (create each segment if needed)
      const folderSegments = folderPath.split('/').filter(Boolean);
      let currentPath = '';
      let folderId: string | undefined = undefined;
      
      console.log(`SharePointService: Creating folder structure: ${folderSegments.join(' > ')}`);
      
      for (const segment of folderSegments) {
        currentPath = currentPath ? `${currentPath}/${segment}` : segment;
        // Try to get or create the folder
        console.log(`SharePointService: Checking/creating folder: ${currentPath}`);
        
        try {
          // First try to get the folder
          const folderResponse = await this.client!.api(`/drives/${driveId}/root:/${currentPath}`).get();
          folderId = folderResponse.id;
          console.log(`SharePointService: Folder exists: ${currentPath} with ID: ${folderId}`);
        } catch (err: any) {
          if ((err.statusCode === 404) || (err.code && err.code === 'itemNotFound')) {
            // Folder does not exist, create it
            console.log(`SharePointService: Folder ${currentPath} not found, creating it`);
            const parentPath = currentPath.substring(0, currentPath.lastIndexOf('/')) || '';
            console.log(`SharePointService: Creating folder ${segment} in parent path: ${parentPath || 'root'}`);
            
            try {
              // Create the folder under its parent
              const createEndpoint = parentPath 
                ? `/drives/${driveId}/root:/${parentPath}:/children` 
                : `/drives/${driveId}/root/children`;
              
              const createResp = await this.client!.api(createEndpoint).post({
                name: segment,
                folder: {},
                '@microsoft.graph.conflictBehavior': 'replace'
              });
              
              folderId = createResp.id;
              console.log(`SharePointService: Folder created with id: ${folderId}`);
            } catch (createErr: any) {
              console.error(`SharePointService: Error creating folder ${segment} in ${parentPath}:`, createErr);
              // If we can't create the folder, try a more direct approach
              throw new Error(`Failed to create folder: ${createErr.message || JSON.stringify(createErr)}`);
            }
          } else {
            console.error(`SharePointService: Error checking folder ${currentPath}:`, err);
            throw err;
          }
        }
      }
      
      if (!folderId) {
        console.error('SharePointService: Failed to get a valid folder ID');
        throw new Error('Failed to create or access folder structure');
      }

      // Check if this is an image file that should use direct upload
      const isImage = file.type.startsWith('image/');
      const isPNG = file.type === 'image/png' || fileName.toLowerCase().endsWith('.png');
      const isSmallFile = file.size < 4 * 1024 * 1024; // Less than 4MB
      
      if ((isImage || isPNG) && isSmallFile) {
        console.log(`SharePointService: Using direct upload approach for ${isPNG ? 'PNG' : 'image'} file`);
        
        try {
          // 1. Create a simple upload URL
          const encodedFileName = encodeURIComponent(fileName);
          console.log(`SharePointService: Creating direct upload for file: ${encodedFileName} in folder: ${folderId}`);
          
          // For simple upload of small files like images, we'll use a different API approach
          const response = await this.client!
            .api(`/drives/${driveId}/items/${folderId}:/${encodedFileName}:/content`)
            .put(file);
            
          console.log(`SharePointService: Direct upload completed, item ID: ${response.id}`);
          return;
        } catch (directError: any) {
          console.warn(`SharePointService: Direct upload failed, falling back to session upload: ${directError.message}`);
          // Fall back to session upload
        }
      }

      // 2. Create upload session for the file in the folder
      const encodedFileName = encodeURIComponent(fileName);
      console.log(`SharePointService: Creating upload session for file: ${encodedFileName} in folder: ${folderId}`);
      
      // Use the folder ID we obtained to create an upload session
      const uploadSessionResp = await this.client!
        .api(`/drives/${driveId}/items/${folderId}:/${encodedFileName}:/createUploadSession`)
        .post({
          item: {
            '@microsoft.graph.conflictBehavior': 'replace'
          }
        });
        
      const uploadUrl = uploadSessionResp.uploadUrl;
      console.log(`SharePointService: Upload session created, URL: ${uploadUrl ? 'Success (URL hidden for logs)' : 'Failed'}`);
      if (!uploadUrl) throw new Error('Failed to create upload session');

      // 3. Upload the file using the session URL (chunked, always)
      await this.uploadFile(file, uploadUrl, fileName, (progress) => {
        console.log(`SharePointService: Upload progress: ${progress.toFixed(0)}%`);
      });
      
      console.log(`SharePointService: File upload completed successfully`);
    } catch (error) {
      console.error('Failed to upload evidence:', error);
      throw new Error('Failed to upload evidence: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  }

  /**
   * Creates an upload session for a file
   */
  public async createUploadSession(fileName: string, folderPath: string): Promise<UploadSession> {
    if (!this.isAuthenticated()) {
      await this.authenticate();
    }

    try {
      const driveId = await this.getDriveId();
      
      // Make sure folderPath is properly formatted
      if (!folderPath.startsWith('Evidence/')) {
        console.warn('SharePointService: folderPath does not start with Evidence/, correcting...');
        folderPath = folderPath.includes('Evidence') 
          ? folderPath.substring(folderPath.indexOf('Evidence'))
          : `Evidence/${folderPath}`;
      }
      
      console.log(`SharePointService: Creating upload session for ${fileName} in ${folderPath}`);
      
      // First, ensure the folder structure exists
      const folderSegments = folderPath.split('/').filter(Boolean);
      let currentPath = '';
      let folderId: string | undefined = undefined;
      
      // Create each folder in the path if it doesn't exist
      for (const segment of folderSegments) {
        currentPath = currentPath ? `${currentPath}/${segment}` : segment;
        console.log(`SharePointService: Checking/creating folder: ${currentPath}`);
        
        try {
          // Try to get the folder
          const folderResponse = await this.client!.api(`/drives/${driveId}/root:/${currentPath}`).get();
          folderId = folderResponse.id;
          console.log(`SharePointService: Folder exists: ${currentPath}`);
        } catch (err: any) {
          if ((err.statusCode === 404) || (err.code && err.code === 'itemNotFound')) {
      // Folder doesn't exist, create it
            console.log(`SharePointService: Folder ${currentPath} not found, creating it`);
            const parentPath = currentPath.substring(0, currentPath.lastIndexOf('/')) || '';
            
            try {
              // Create the folder under its parent
              const createEndpoint = parentPath 
                ? `/drives/${driveId}/root:/${parentPath}:/children` 
                : `/drives/${driveId}/root/children`;
              
              const createResp = await this.client!.api(createEndpoint).post({
                name: segment,
        folder: {},
        '@microsoft.graph.conflictBehavior': 'replace'
      });
              
              folderId = createResp.id;
              console.log(`SharePointService: Folder created with id: ${folderId}`);
            } catch (createErr: any) {
              console.error(`SharePointService: Error creating folder ${segment}:`, createErr);
              throw new Error(`Failed to create folder: ${createErr.message || JSON.stringify(createErr)}`);
            }
          } else {
            console.error(`SharePointService: Error checking folder ${currentPath}:`, err);
            throw err;
          }
        }
      }
      
      if (!folderId) {
        throw new Error('Failed to create or access folder structure');
      }
      
      // Now create the upload session using the folder ID
      console.log(`SharePointService: Creating upload session for file: ${fileName} in folder ID: ${folderId}`);
      const response = await this.client!.api(`/drives/${driveId}/items/${folderId}:/${encodeURIComponent(fileName)}:/createUploadSession`)
      .post({
        item: {
          '@microsoft.graph.conflictBehavior': 'replace'
        }
      });

    return {
        uploadUrl: response.uploadUrl,
        webUrl: response.webUrl
      };
    } catch (error) {
      console.error('Failed to create upload session:', error);
      throw new Error('Failed to create upload session: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  }

  /**
   * Uploads a file using an upload session
   */
  public async uploadFile(
    file: File | Blob,
    uploadUrl: string,
    fileName: string,
    onProgress?: (progress: number) => void
  ): Promise<void> {
    try {
      console.log(`SharePointService: Uploading file ${fileName} with MIME type: ${file.type}`);
      
      // Check if this is an image file (including PNG)
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      const isSmallFile = file.size < 4 * 1024 * 1024; // Less than 4MB
      
      // For small image files, use a single upload instead of chunking to avoid corruption
      if (isImage && isSmallFile) {
        console.log(`SharePointService: Using direct upload for image file: ${fileName}`);
        
        const response = await fetch(uploadUrl, {
          method: 'PUT',
          headers: {
            'Content-Type': file.type,
            'Content-Length': file.size.toString(),
            'Content-Range': `bytes 0-${file.size - 1}/${file.size}`
          },
          body: file
        });
        
        if (!response.ok) {
          console.error(`SharePointService: Direct upload failed:`, response.status, response.statusText);
          const responseText = await response.text();
          console.error(`SharePointService: Response:`, responseText);
          throw new Error(`Failed to upload file: ${response.status} ${response.statusText}`);
        }
        
        console.log(`SharePointService: Direct upload completed successfully`);
        if (onProgress) {
          onProgress(100);
        }
        return;
      }
      
      // For larger files or non-images, use chunked upload
      const fileBuffer = await this.readFileAsArrayBuffer(file as File);
      const fileSize = fileBuffer.byteLength;
      
      // Calculate optimal chunk size based on file type and size
      let chunkSize = 4 * 1024 * 1024; // Default 4MB chunks
      
      if (isVideo) {
        // Videos can use larger chunks to speed up uploads where possible
        if (fileSize > 100 * 1024 * 1024) { // For files > 100MB
          chunkSize = 10 * 1024 * 1024; // Use 10MB chunks
        } else if (fileSize > 50 * 1024 * 1024) { // For files > 50MB
          chunkSize = 8 * 1024 * 1024; // Use 8MB chunks
        } else {
          chunkSize = 6 * 1024 * 1024; // Use 6MB chunks for smaller videos
        }
      }
      
      console.log(`SharePointService: Using ${(chunkSize/1024/1024).toFixed(1)}MB chunks for ${isVideo ? 'video' : 'file'} upload of ${(fileSize/1024/1024).toFixed(1)}MB`);
      
    let offset = 0;
      let retryCount = 0;
      const maxRetries = 5;
      
      // Upload chunks with retry logic
      while (offset < fileSize) {
        const chunk = fileBuffer.slice(offset, offset + chunkSize);
        const contentRange = `bytes ${offset}-${offset + chunk.byteLength - 1}/${fileSize}`;
        
        console.log(`SharePointService: Uploading chunk: ${contentRange}`);
        
        try {
      const response = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
              'Content-Type': 'application/octet-stream',
              'Content-Length': chunk.byteLength.toString(),
              'Content-Range': contentRange
        },
        body: chunk
          });
          
          if (response.status === 429) {
            // Handle rate limiting with exponential backoff
            if (retryCount < maxRetries) {
              retryCount++;
              const backoffTime = Math.pow(2, retryCount) * 1000; // Exponential backoff: 2s, 4s, 8s, 16s, 32s
              console.log(`SharePointService: Rate limited (429). Retrying chunk after ${backoffTime}ms (retry ${retryCount}/${maxRetries})`);
              
              // Wait for backoff period before retrying
              await new Promise(resolve => setTimeout(resolve, backoffTime));
              continue; // Retry this chunk without incrementing offset
            } else {
              console.error(`SharePointService: Maximum retries (${maxRetries}) exceeded for rate limiting`);
              throw new Error('Upload failed due to persistent rate limiting. Please try again later.');
            }
          } else if (!response.ok) {
            // Handle other errors
            console.error(`SharePointService: Chunk upload failed:`, response.status, response.statusText);
            
            // Try to get response text for better error information
            let responseText = '';
            try {
              responseText = await response.text();
            } catch (e) {
              responseText = 'Could not read error response';
            }
            
            console.error(`SharePointService: Response:`, responseText);
            
            // Retry on server errors (5xx), not on client errors (4xx except 429)
            if (response.status >= 500 && retryCount < maxRetries) {
              retryCount++;
              const backoffTime = Math.pow(2, retryCount) * 1000; 
              console.log(`SharePointService: Server error (${response.status}). Retrying chunk after ${backoffTime}ms (retry ${retryCount}/${maxRetries})`);
              
              await new Promise(resolve => setTimeout(resolve, backoffTime));
              continue; // Retry this chunk without incrementing offset
            }
            
            throw new Error(`Failed to upload chunk: ${response.status} ${response.statusText}`);
          }
          
          // Success - reset retry counter and move to next chunk
          retryCount = 0;
          offset += chunk.byteLength;
          
          if (onProgress) {
            onProgress(Math.min(100, (offset / fileSize) * 100));
          }
        } catch (error) {
          // Handle network or other exceptions
          if (retryCount < maxRetries) {
            retryCount++;
            const backoffTime = Math.pow(2, retryCount) * 1000;
            console.log(`SharePointService: Error during upload: ${error}. Retrying chunk after ${backoffTime}ms (retry ${retryCount}/${maxRetries})`);
            
            await new Promise(resolve => setTimeout(resolve, backoffTime));
            continue; // Retry this chunk without incrementing offset
          } else {
            console.error(`SharePointService: Maximum retries (${maxRetries}) exceeded for chunk upload`);
            throw error;
          }
        }
      }
      
      console.log(`SharePointService: Chunked upload completed successfully`);
    } catch (error) {
      console.error('Failed to upload file:', error);
      throw new Error('Failed to upload file: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  }

  /**
   * Fetches metadata for an evidence file from SharePoint.
   * @param webUrl The web URL of the evidence file.
   * @param siteUrl Optional custom site URL.
   * @returns The evidence metadata.
   */
  public async fetchEvidenceMetadata(webUrl: string, siteUrl?: string): Promise<EvidenceMetadata> {
    if (!this.isAuthenticated()) {
      await this.authenticate();
    }

    try {
      const driveId = await this.getDriveId(siteUrl);
      const filePath = this.getRelativePath(webUrl);
      
      if (!filePath) {
        console.warn('Unable to determine relative path from URL, using direct API approach:', webUrl);
        
        // Try a different approach - extract ID from URL if possible
        const fileId = this.extractFileIdFromUrl(webUrl);
        if (fileId) {
          console.log('Found file ID from URL:', fileId);
          try {
            // Get the item directly by ID
            const itemResponse = await this.client!
              .api(`/drives/${driveId}/items/${fileId}`)
              .get();
              
            console.log('Successfully retrieved file by ID:', itemResponse.id);
            
            // Try to get metadata fields
            try {
              const fieldsResponse = await this.client!
                .api(`/drives/${driveId}/items/${itemResponse.id}/listItem/fields`)
                .get();
                
              // Create metadata from available information
              return {
                id: itemResponse.id,
                name: fieldsResponse.Title || fieldsResponse.FileLeafRef || itemResponse.name,
                webUrl: itemResponse.webUrl,
                downloadUrl: itemResponse['@microsoft.graph.downloadUrl'],
                size: itemResponse.size || 0,
                mimeType: itemResponse.file?.mimeType || 'application/octet-stream',
                createdDateTime: new Date(fieldsResponse.Created || fieldsResponse.createdDateTime || itemResponse.createdDateTime),
                lastModifiedDateTime: new Date(fieldsResponse.Modified || fieldsResponse.lastModifiedDateTime || itemResponse.lastModifiedDateTime),
                assessmentStatus: (fieldsResponse.AssessmentStatus as AssessmentStatus) || AssessmentStatus.Pending,
                assessorFeedback: fieldsResponse.AssessorFeedback || '',
                assessorName: fieldsResponse.AssessorName || '',
                assessmentDate: fieldsResponse.AssessmentDate ? new Date(fieldsResponse.AssessmentDate) : '',
                criteriaCode: fieldsResponse.CriteriaCode || '',
                unitCode: fieldsResponse.UnitCode || '',
                description: fieldsResponse.Description || ''
              };
            } catch (fieldsError) {
              console.warn('Failed to get listItem fields for file ID, using basic metadata:', fieldsError);
              // Return basic metadata without the listItem fields
              return {
                id: itemResponse.id,
                name: itemResponse.name,
                webUrl: itemResponse.webUrl,
                downloadUrl: itemResponse['@microsoft.graph.downloadUrl'],
                size: itemResponse.size || 0,
                mimeType: itemResponse.file?.mimeType || 'application/octet-stream',
                createdDateTime: new Date(itemResponse.createdDateTime),
                lastModifiedDateTime: new Date(itemResponse.lastModifiedDateTime),
                assessmentStatus: AssessmentStatus.Pending
              };
            }
          } catch (idError) {
            console.error('Failed to get file by ID:', idError);
          }
        }
        
        // If we can't get by path or ID, create a minimal metadata object from the URL
        const fileName = this.extractFilenameFromUrl(webUrl);
        console.log('Creating minimal metadata from URL with filename:', fileName);
        return {
          id: crypto.randomUUID(),
          name: fileName || 'Unknown File',
          webUrl: webUrl,
          size: 0,
          mimeType: 'application/octet-stream',
          createdDateTime: new Date(),
          lastModifiedDateTime: new Date(),
          assessmentStatus: AssessmentStatus.Pending
        };
      }

      // Handle special path formats
      if (filePath.startsWith('sourcedoc:')) {
        const fileId = filePath.substring('sourcedoc:'.length);
        console.log(`SharePointService: Searching for file with sourcedoc ID: ${fileId}`);
        
        try {
          // Try to find items by the source document ID
          // First try searching in the drive
          const searchResults = await this.client!
            .api(`/drives/${driveId}/root/search(q='${fileId}')`)
            .get();
            
          if (searchResults.value && searchResults.value.length > 0) {
            const bestMatch = searchResults.value[0]; // Take the first match
            console.log(`SharePointService: Found file by sourcedoc search: ${bestMatch.name}`);
            
            // Then get the metadata fields
            try {
              const fieldsResponse = await this.client!
                .api(`/drives/${driveId}/items/${bestMatch.id}/listItem/fields`)
                .get();
                
              console.log('Fetched fields for file from sourcedoc search');
              
              // Extract unit and criteria codes from file path if not in metadata
              const extractedUnitCode = this.extractFromPath(bestMatch.webUrl, 'unit');
              const extractedCriteriaCode = this.extractFromPath(bestMatch.webUrl, 'criteria');
              
              // Create the metadata object with all available information
              const metadata: EvidenceMetadata = {
                id: bestMatch.id,
                name: fieldsResponse.Title || fieldsResponse.FileLeafRef || bestMatch.name,
                webUrl: bestMatch.webUrl,
                downloadUrl: bestMatch['@microsoft.graph.downloadUrl'],
                size: bestMatch.size || 0,
                mimeType: bestMatch.file?.mimeType || 'application/octet-stream',
                createdDateTime: new Date(fieldsResponse.Created || fieldsResponse.createdDateTime || bestMatch.createdDateTime),
                lastModifiedDateTime: new Date(fieldsResponse.Modified || fieldsResponse.lastModifiedDateTime || bestMatch.lastModifiedDateTime),
                assessmentStatus: (fieldsResponse.AssessmentStatus as AssessmentStatus) || AssessmentStatus.Pending,
                assessorFeedback: fieldsResponse.AssessorFeedback || '',
                assessorName: fieldsResponse.AssessorName || '',
                assessmentDate: fieldsResponse.AssessmentDate ? new Date(fieldsResponse.AssessmentDate) : '',
                criteriaCode: fieldsResponse.CriteriaCode || extractedCriteriaCode || '',
                unitCode: fieldsResponse.UnitCode || extractedUnitCode || '',
                description: fieldsResponse.Description || ''
              };
              
              return metadata;
            } catch (fieldsError) {
              console.warn('Failed to get listItem fields for sourcedoc search result, using basic metadata:', fieldsError);
              
              // Return basic metadata without the listItem fields
              return {
                id: bestMatch.id,
                name: bestMatch.name,
                webUrl: bestMatch.webUrl,
                downloadUrl: bestMatch['@microsoft.graph.downloadUrl'],
                size: bestMatch.size || 0,
                mimeType: bestMatch.file?.mimeType || 'application/octet-stream',
                createdDateTime: new Date(bestMatch.createdDateTime),
                lastModifiedDateTime: new Date(bestMatch.lastModifiedDateTime),
                assessmentStatus: AssessmentStatus.Pending,
                criteriaCode: this.extractFromPath(bestMatch.webUrl, 'criteria'),
                unitCode: this.extractFromPath(bestMatch.webUrl, 'unit'),
              };
            }
          }
        } catch (searchError) {
          console.warn('Failed to search for file by sourcedoc ID:', searchError);
        }
        
        // If we get here, the search didn't find the file, try to get it by ID directly
        try {
          const itemResponse = await this.client!
            .api(`/drives/${driveId}/items/${fileId}`)
            .get();
            
          console.log('Found file directly by sourcedoc ID:', itemResponse.id);
          
          // Return basic metadata
          return {
            id: itemResponse.id,
            name: itemResponse.name,
            webUrl: itemResponse.webUrl,
            downloadUrl: itemResponse['@microsoft.graph.downloadUrl'],
            size: itemResponse.size || 0,
            mimeType: itemResponse.file?.mimeType || 'application/octet-stream',
            createdDateTime: new Date(itemResponse.createdDateTime),
            lastModifiedDateTime: new Date(itemResponse.lastModifiedDateTime),
            assessmentStatus: AssessmentStatus.Pending
          };
        } catch (directError) {
          console.warn('Failed to get file directly by sourcedoc ID:', directError);
        }
        
        // If we get here, fall back to creating minimal metadata
        console.log('Creating minimal metadata from sourcedoc ID');
        return {
          id: fileId,
          name: `File ${fileId}`,
          webUrl: webUrl,
          size: 0,
          mimeType: 'application/octet-stream',
          createdDateTime: new Date(),
          lastModifiedDateTime: new Date(),
          assessmentStatus: AssessmentStatus.Pending
        };
      }
      
      // Handle id: prefix
      if (filePath.startsWith('id:')) {
        const fileId = filePath.substring('id:'.length);
        console.log(`SharePointService: Fetching file directly by ID: ${fileId}`);
        
        try {
          const itemResponse = await this.client!
            .api(`/drives/${driveId}/items/${fileId}`)
            .get();
            
          console.log('Found file by direct ID:', itemResponse.id);
          
          // Try to get metadata fields
          try {
            const fieldsResponse = await this.client!
              .api(`/drives/${driveId}/items/${itemResponse.id}/listItem/fields`)
              .get();
              
            // Extract unit and criteria codes from file path if not in metadata
            const extractedUnitCode = this.extractFromPath(itemResponse.webUrl, 'unit');
            const extractedCriteriaCode = this.extractFromPath(itemResponse.webUrl, 'criteria');
            
            return {
              id: itemResponse.id,
              name: fieldsResponse.Title || fieldsResponse.FileLeafRef || itemResponse.name,
              webUrl: itemResponse.webUrl,
              downloadUrl: itemResponse['@microsoft.graph.downloadUrl'],
              size: itemResponse.size || 0,
              mimeType: itemResponse.file?.mimeType || 'application/octet-stream',
              createdDateTime: new Date(fieldsResponse.Created || fieldsResponse.createdDateTime || itemResponse.createdDateTime),
              lastModifiedDateTime: new Date(fieldsResponse.Modified || fieldsResponse.lastModifiedDateTime || itemResponse.lastModifiedDateTime),
              assessmentStatus: (fieldsResponse.AssessmentStatus as AssessmentStatus) || AssessmentStatus.Pending,
              assessorFeedback: fieldsResponse.AssessorFeedback || '',
              assessorName: fieldsResponse.AssessorName || '',
              assessmentDate: fieldsResponse.AssessmentDate ? new Date(fieldsResponse.AssessmentDate) : '',
              criteriaCode: fieldsResponse.CriteriaCode || extractedCriteriaCode || '',
              unitCode: fieldsResponse.UnitCode || extractedUnitCode || '',
              description: fieldsResponse.Description || ''
            };
          } catch (fieldsError) {
            console.warn('Failed to get listItem fields for direct ID, using basic metadata:', fieldsError);
            
            // Return basic metadata without the listItem fields
            return {
              id: itemResponse.id,
              name: itemResponse.name,
              webUrl: itemResponse.webUrl,
              downloadUrl: itemResponse['@microsoft.graph.downloadUrl'],
              size: itemResponse.size || 0,
              mimeType: itemResponse.file?.mimeType || 'application/octet-stream',
              createdDateTime: new Date(itemResponse.createdDateTime),
              lastModifiedDateTime: new Date(itemResponse.lastModifiedDateTime),
              assessmentStatus: AssessmentStatus.Pending,
              criteriaCode: this.extractFromPath(itemResponse.webUrl, 'criteria'),
              unitCode: this.extractFromPath(itemResponse.webUrl, 'unit'),
            };
          }
        } catch (idError) {
          console.error('Failed to get file by direct ID:', idError);
          
          // Return minimal metadata
          return {
            id: fileId,
            name: `File ${fileId}`,
            webUrl: webUrl,
            size: 0,
            mimeType: 'application/octet-stream',
            createdDateTime: new Date(),
            lastModifiedDateTime: new Date(),
            assessmentStatus: AssessmentStatus.Pending
          };
        }
      }

      console.log(`SharePointService: Fetching metadata for file at path: ${filePath}`);

      try {
        // First attempt - try to get the item directly
        const itemResponse = await this.client!
          .api(`/drives/${driveId}/root:/${filePath}`)
          .get();
          
        console.log('Found file item:', itemResponse.id);
        
        // Then get the metadata fields
        try {
          const fieldsResponse = await this.client!
            .api(`/drives/${driveId}/items/${itemResponse.id}/listItem/fields`)
            .get();
            
          console.log('Fetched fields for file:', webUrl);

          // Extract unit and criteria codes from file path if not in metadata
          const extractedUnitCode = this.extractFromPath(webUrl, 'unit');
          const extractedCriteriaCode = this.extractFromPath(webUrl, 'criteria');

          // Create the metadata object with all available information
          const metadata: EvidenceMetadata = {
            id: itemResponse.id,
            name: fieldsResponse.Title || fieldsResponse.FileLeafRef || itemResponse.name,
            webUrl: itemResponse.webUrl,
            downloadUrl: itemResponse['@microsoft.graph.downloadUrl'],
            size: itemResponse.size || 0,
            mimeType: itemResponse.file?.mimeType || 'application/octet-stream',
            createdDateTime: new Date(fieldsResponse.Created || fieldsResponse.createdDateTime || itemResponse.createdDateTime),
            lastModifiedDateTime: new Date(fieldsResponse.Modified || fieldsResponse.lastModifiedDateTime || itemResponse.lastModifiedDateTime),
            assessmentStatus: (fieldsResponse.AssessmentStatus as AssessmentStatus) || AssessmentStatus.Pending,
            assessorFeedback: fieldsResponse.AssessorFeedback || '',
            assessorName: fieldsResponse.AssessorName || '',
            assessmentDate: fieldsResponse.AssessmentDate ? new Date(fieldsResponse.AssessmentDate) : '',
            // Get criteria and unit codes from metadata or extract from path
            criteriaCode: fieldsResponse.CriteriaCode || extractedCriteriaCode || '',
            unitCode: fieldsResponse.UnitCode || extractedUnitCode || '',
            description: fieldsResponse.Description || ''
          };

          return metadata;
        } catch (fieldsError) {
          console.warn('Failed to get listItem fields, using basic metadata:', fieldsError);
          
          // Return basic metadata without the listItem fields
          return {
            id: itemResponse.id,
            name: itemResponse.name,
            webUrl: itemResponse.webUrl,
            downloadUrl: itemResponse['@microsoft.graph.downloadUrl'],
            size: itemResponse.size || 0,
            mimeType: itemResponse.file?.mimeType || 'application/octet-stream',
            createdDateTime: new Date(itemResponse.createdDateTime),
            lastModifiedDateTime: new Date(itemResponse.lastModifiedDateTime),
            assessmentStatus: AssessmentStatus.Pending,
            criteriaCode: this.extractFromPath(webUrl, 'criteria'),
            unitCode: this.extractFromPath(webUrl, 'unit'),
          };
        }
      } catch (itemError) {
        console.error('Error fetching file item:', itemError);
        throw new Error('Failed to find file in SharePoint: ' + (itemError instanceof Error ? itemError.message : 'Unknown error'));
      }
    } catch (error) {
      console.error('Failed to fetch evidence metadata:', error);
      throw new Error('Failed to fetch evidence metadata: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  }
  
  private async createFolder(): Promise<void> {
    throw new Error('Method not implemented in this simplified version');
  }
  
  private getRelativePath(url: string): string {
    try {
      // Skip invalid or empty URLs
      if (!url || url.trim() === '') {
        console.warn('Empty or invalid URL provided to getRelativePath');
        return '';
      }
      
      const urlObj = new URL(url);
      console.log('Extracting relative path from URL:', url);
      
      // Handle the _layouts/15/Doc.asp format (web view URLs)
      if (urlObj.pathname.includes('/_layouts/15/Doc.asp')) {
        // Extract file path from the query parameters
        const sourceUrl = urlObj.searchParams.get('sourcedoc');
        const source = urlObj.searchParams.get('source');
        
        if (sourceUrl) {
          console.log('Found sourcedoc parameter:', sourceUrl);
          // Extract file name from the base64-encoded or escaped path
          try {
            // The sourceUrl can be base64 encoded in some cases
            const decoded = decodeURIComponent(sourceUrl);
            const parts = decoded.split('/');
            const fileName = parts[parts.length - 1];
            
            // First try to get the real file by searching in the drive
            console.log('Looking for file with sourcedoc ID:', fileName);
            
            // Instead of just using the GUID, let's try to get the actual file path
            // This will be retrieved from the drive in fetchEvidenceMetadata
            const fileId = sourceUrl.replace(/[{}]/g, ''); // Remove curly braces
            return `sourcedoc:${fileId}`;
          } catch (e) {
            console.log('Could not decode sourceUrl parameter');
          }
        }
        
        // Try to extract filename from the path including common image formats
        const fileNameMatch = url.match(/([^\/&]+\.(xlsx|pdf|docx|pptx|txt|jpg|jpeg|png|gif|bmp|webp))/i);
        if (fileNameMatch && fileNameMatch[1]) {
          const fileName = fileNameMatch[1];
          console.log('Extracted filename from URL:', fileName);
          // Return a best-effort path
          return `Evidence/${fileName}`;
        }
        
        // Try to extract from the 'source' parameter which might contain the file path
        if (source) {
          try {
            const decoded = decodeURIComponent(source);
            if (decoded.includes('Evidence')) {
              const evidenceIdx = decoded.indexOf('Evidence');
              const pathPart = decoded.substring(evidenceIdx);
              console.log('Extracted path from source parameter:', pathPart);
              return pathPart;
            }
          } catch (e) {
            console.log('Could not decode source parameter');
          }
        }
        
        // Look for a file ID format in the URL that might help identify the file
        const fileIdFromUrl = this.extractFileIdFromUrl(url);
        if (fileIdFromUrl) {
          console.log('Found file ID in URL:', fileIdFromUrl);
          return `id:${fileIdFromUrl}`;
        }
      }
      
      // Try standard SharePoint document library patterns
      const candidates = ['/Shared Documents/', '/Shared%20Documents/'];
      for (const sitePath of candidates) {
        const idx = urlObj.pathname.indexOf(sitePath);
        if (idx !== -1) {
          const rel = urlObj.pathname.substring(idx + sitePath.length);
          return decodeURIComponent(rel);
        }
      }
      
      // Fallback: try to extract after /root:/
      const rootMatch = urlObj.pathname.match(/root:(.*):/);
      if (rootMatch && rootMatch[1]) {
        return decodeURIComponent(rootMatch[1]);
      }
      
      // Additional fallbacks for other SharePoint URL formats
      
      // Try to extract from /sites/sitename/path format
      const sitesMatch = urlObj.pathname.match(/\/sites\/[^\/]+\/([^?]+)/);
      if (sitesMatch && sitesMatch[1]) {
        // Check if this path includes 'Evidence'
        const path = decodeURIComponent(sitesMatch[1]);
        if (path.includes('Evidence')) {
          const evidenceIdx = path.indexOf('Evidence');
          return path.substring(evidenceIdx);
        }
        return path;
      }
      
      // Last resort - try to extract just the filename and folder structure if we can find "Evidence" in the URL
      if (url.includes('Evidence')) {
        const evidenceIdx = url.indexOf('Evidence');
        const pathCandidate = url.substring(evidenceIdx);
        // Cut off at first ? or # if present
        const endIdx = Math.min(
          pathCandidate.indexOf('?') > -1 ? pathCandidate.indexOf('?') : Infinity,
          pathCandidate.indexOf('#') > -1 ? pathCandidate.indexOf('#') : Infinity
        );
        if (endIdx !== Infinity) {
          return pathCandidate.substring(0, endIdx);
        }
        return pathCandidate;
      }
      
      // Log and throw if not found
      console.error('Could not determine relative path from URL:', url);
      throw new Error('Could not determine relative path from URL');
    } catch (e) {
      console.error('Error in getRelativePath:', e, url);
      // Instead of throwing, return an empty string and handle gracefully
      return '';
    }
  }
  
  private readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      console.log(`SharePointService: Reading file ${file.name}, size: ${file.size} bytes`);
      
      if (file.size === 0) {
        console.error(`SharePointService: File ${file.name} has 0 bytes - this will result in an empty file`);
      }
      
      const reader = new FileReader();
      
      reader.onload = (event) => {
        const result = event.target?.result as ArrayBuffer;
        console.log(`SharePointService: Successfully read ${result ? result.byteLength : 0} bytes from file`);
        resolve(result);
      };
      
      reader.onerror = (error) => {
        console.error(`SharePointService: Error reading file: ${error}`);
        reject(error);
      };
      
      try {
        // Start reading the file as an ArrayBuffer
        reader.readAsArrayBuffer(file);
      } catch (error) {
        console.error(`SharePointService: Exception reading file: ${error}`);
        reject(error);
      }
    });
  }

  /**
   * Gets all evidence items from SharePoint
   */
  public async getEvidence(): Promise<Evidence[]> {
    if (!this.isAuthenticated()) {
      await this.authenticate();
    }

    try {
      const driveId = await this.getDriveId();
      console.log(`SharePointService: Fetching evidence items from drive ${driveId}`);
      
      // Get site URL for REST API fallback if needed
      const siteUrl = this.getProfileSiteUrl();
      if (!siteUrl) {
        throw new Error('SharePoint site URL not configured');
      }
      
      // First try using Graph API to get the evidence folder contents
      const evidenceItems: Evidence[] = [];
      
      try {
        // First check if the Evidence folder exists
        try {
          await this.client!.api(`/drives/${driveId}/root:/Evidence`).get();
        } catch (error) {
          console.warn('Evidence folder not found:', error);
          return []; // Return empty array if the folder doesn't exist yet
        }
        
        // First, get the subfolders (unit folders) in the Evidence folder
        const unitFoldersResponse = await this.client!.api(`/drives/${driveId}/root:/Evidence:/children`)
          .get();
        
        // Filter locally instead of with API $filter
        const unitFolders = unitFoldersResponse.value?.filter((item: any) => item.folder) || [];
        console.log(`SharePointService: Found ${unitFolders.length} unit folders in Evidence folder`);
        
        // For each unit folder, get its criteria folders and files
        for (const unitFolder of unitFolders) {
          try {
            console.log(`SharePointService: Processing unit folder ${unitFolder.name}`);
            
            // Get criteria folders within this unit folder
            const criteriaFoldersResponse = await this.client!.api(`/drives/${driveId}/items/${unitFolder.id}/children`)
              .get();
            
            console.log(`SharePointService: Found ${criteriaFoldersResponse.value?.length || 0} criteria folders/items in unit ${unitFolder.name}`);
            
            // Process each criteria folder to find evidence files
            for (const criteriaItem of criteriaFoldersResponse.value || []) {
              try {
                if (criteriaItem.folder) {
                  // This is a criteria folder, get files inside it
                  const filesResponse = await this.client!.api(`/drives/${driveId}/items/${criteriaItem.id}/children`)
                    .get();
                  
                  // Filter locally for non-folder items
                  const files = filesResponse.value?.filter((item: any) => !item.folder) || [];
                  console.log(`SharePointService: Found ${files.length} files in criteria folder ${criteriaItem.name}`);
                  
                  // Process each file
                  for (const file of files) {
                    if (file.webUrl) {
                      try {
                        // Get metadata for this file
                        const metadata = await this.fetchEvidenceMetadata(file.webUrl);
                        
                        // Unit code is the folder name
                        const unitCode = unitFolder.name.replace(/_/g, '.');
                        // Criteria code is the folder name
                        const criteriaCode = criteriaItem.name.replace(/_/g, '.');
                        
                        evidenceItems.push({
                          id: file.id,
                          title: metadata.name || file.name || 'Untitled Evidence',
                          dateUploaded: (file.createdDateTime ? new Date(file.createdDateTime).toISOString() : new Date().toISOString()),
                          webUrl: file.webUrl,
                          downloadUrl: file['@microsoft.graph.downloadUrl'] || file.webUrl,
                          assessmentStatus: metadata.assessmentStatus || AssessmentStatus.Pending,
                          assessorFeedback: metadata.assessorFeedback || '',
                          assessorName: metadata.assessorName || '',
                          assessmentDate: metadata.assessmentDate ? (typeof metadata.assessmentDate === 'string' ? metadata.assessmentDate : metadata.assessmentDate.toISOString()) : undefined,
                          criteriaCode: metadata.criteriaCode || criteriaCode,
                          unitCode: metadata.unitCode || unitCode,
                          description: metadata.description || ''
                        });
                      } catch (metadataError) {
                        console.warn(`SharePointService: Error processing metadata for file ${file.name}:`, metadataError);
                        // Add with minimal info anyway to ensure we don't miss files
                        evidenceItems.push({
                          id: file.id,
                          title: file.name || 'Untitled Evidence',
                          dateUploaded: (file.createdDateTime ? new Date(file.createdDateTime).toISOString() : new Date().toISOString()),
                          webUrl: file.webUrl,
                          downloadUrl: file['@microsoft.graph.downloadUrl'] || file.webUrl,
                          assessmentStatus: AssessmentStatus.Pending,
                          criteriaCode: criteriaItem.name.replace(/_/g, '.'),
                          unitCode: unitFolder.name.replace(/_/g, '.'),
                          description: ''
                        });
                      }
                    }
                  }
                } else if (criteriaItem.webUrl) {
                  // This is a file directly in the unit folder, not in a criteria subfolder
                  try {
                    // Get metadata for this file
                    const metadata = await this.fetchEvidenceMetadata(criteriaItem.webUrl);
                    
                    // Unit code is the folder name
                    const unitCode = unitFolder.name.replace(/_/g, '.');
                    // No criteria folder, try to extract from metadata or filename
                    let criteriaCode = metadata.criteriaCode || '';
                    
                    if (!criteriaCode) {
                      // Try to extract from filename (e.g., "evidence_1.1.pdf")
                      const match = criteriaItem.name.match(/\d+\.\d+/);
                      if (match) {
                        criteriaCode = match[0];
                      }
                    }
                    
                    evidenceItems.push({
                      id: criteriaItem.id,
                      title: metadata.name || criteriaItem.name || 'Untitled Evidence',
                      dateUploaded: (criteriaItem.createdDateTime ? new Date(criteriaItem.createdDateTime).toISOString() : new Date().toISOString()),
                      webUrl: criteriaItem.webUrl,
                      downloadUrl: criteriaItem['@microsoft.graph.downloadUrl'] || criteriaItem.webUrl,
                      assessmentStatus: metadata.assessmentStatus || AssessmentStatus.Pending,
                      assessorFeedback: metadata.assessorFeedback || '',
                      assessorName: metadata.assessorName || '',
                      assessmentDate: metadata.assessmentDate ? (typeof metadata.assessmentDate === 'string' ? metadata.assessmentDate : metadata.assessmentDate.toISOString()) : undefined,
                      criteriaCode: criteriaCode,
                      unitCode: metadata.unitCode || unitCode,
                      description: metadata.description || ''
                    });
                  } catch (metadataError) {
                    console.warn(`SharePointService: Error processing metadata for file ${criteriaItem.name}:`, metadataError);
                    // Add with minimal info anyway
                    evidenceItems.push({
                      id: criteriaItem.id,
                      title: criteriaItem.name || 'Untitled Evidence',
                      dateUploaded: (criteriaItem.createdDateTime ? new Date(criteriaItem.createdDateTime).toISOString() : new Date().toISOString()),
                      webUrl: criteriaItem.webUrl,
                      downloadUrl: criteriaItem['@microsoft.graph.downloadUrl'] || criteriaItem.webUrl,
                      assessmentStatus: AssessmentStatus.Pending,
                      criteriaCode: '',
                      unitCode: unitFolder.name.replace(/_/g, '.'),
                      description: ''
                    });
                  }
                }
              } catch (criteriaError) {
                console.warn(`SharePointService: Error processing criteria item ${criteriaItem.name}:`, criteriaError);
                continue; // Skip this item and continue with the next one
              }
            }
          } catch (unitError) {
            console.warn(`SharePointService: Error processing unit folder ${unitFolder.name}:`, unitError);
            continue; // Skip this folder and continue with the next one
          }
        }
      } catch (graphError) {
        console.warn('SharePointService: Error using Graph API to get evidence, trying REST API fallback:', graphError);
      }
      
      // If we have evidence items from Graph API, return them
      if (evidenceItems.length > 0) {
        console.log(`SharePointService: Successfully collected ${evidenceItems.length} evidence items using Graph API`);
        return evidenceItems;
      }
      
      // Fallback to SharePoint REST API if Graph API didn't return any items
      console.log(`SharePointService: Trying REST API fallback to get evidence items`);
      
      try {
        // Get access token
        const accessToken = await this.getAccessToken();
        
        // Get site relative URL
        const url = new URL(siteUrl);
        const siteServerRelativeUrl = url.pathname;
        
        // Query the Documents library for all items in Evidence folder
        const restUrl = `${siteUrl}/_api/web/lists/getbytitle('Documents')/items?$filter=startswith(FileRef, '${siteServerRelativeUrl}/Shared Documents/Evidence')&$top=1000`;
        
        const response = await fetch(restUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json;odata=verbose'
          }
      });

      if (!response.ok) {
          throw new Error(`REST API query failed: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        const items = data.d.results || [];
        
        console.log(`SharePointService: Found ${items.length} items via REST API`);
        
        // Convert REST API items to Evidence objects
        for (const item of items) {
          // Skip folders
          if (item.FileSystemObjectType === 1) {
            continue;
          }
          
          // Extract path components from FileRef (server relative URL)
          const pathParts = item.FileRef.split('/');
          const fileName = pathParts[pathParts.length - 1];
          
          // Extract unit and criteria codes from path
          let unitCode = '';
          let criteriaCode = '';
          
          // Path structure should be /sites/xxx/Shared Documents/Evidence/Unit_Code/Criteria_Code/filename
          const evidenceIndex = pathParts.findIndex((p: string) => p.toLowerCase() === 'evidence');
          if (evidenceIndex !== -1 && pathParts.length > evidenceIndex + 1) {
            unitCode = pathParts[evidenceIndex + 1].replace(/_/g, '.');
            if (pathParts.length > evidenceIndex + 2) {
              criteriaCode = pathParts[evidenceIndex + 2].replace(/_/g, '.');
            }
          }
          
          // Create evidence item
          const evidenceItem: Evidence = {
            id: item.GUID || item.UniqueId || crypto.randomUUID(),
            title: item.Title || fileName || 'Untitled Evidence',
            dateUploaded: item.Created || item.TimeCreated || new Date().toISOString(),
            webUrl: item.FileRef ? `${siteUrl}/Shared%20Documents${item.FileRef.substring(item.FileRef.indexOf('/Shared Documents') + 16)}` : '',
            downloadUrl: item.FileRef ? `${siteUrl}/_layouts/15/download.aspx?SourceUrl=${encodeURIComponent(item.FileRef)}` : '',
            assessmentStatus: (item.AssessmentStatus as AssessmentStatus) || AssessmentStatus.Pending,
            assessorFeedback: item.AssessorFeedback || '',
            assessorName: item.AssessorName || '',
            assessmentDate: item.AssessmentDate || '',
            criteriaCode: item.CriteriaCode || criteriaCode,
            unitCode: item.UnitCode || unitCode,
            description: item.Description || ''
          };
          
          evidenceItems.push(evidenceItem);
        }
        
        console.log(`SharePointService: Successfully collected ${evidenceItems.length} evidence items using REST API fallback`);
      } catch (restError) {
        console.error('SharePointService: REST API fallback also failed:', restError);
        // If both Graph and REST API failed, we'll return whatever we collected (may be empty)
      }
      
      return evidenceItems;
    } catch (error) {
      console.error('Failed to get evidence:', error);
      throw new Error('Failed to get evidence: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  }

  // Helper to attempt to extract unit/criteria from path if not in metadata
  private extractFromPath(webUrl: string, type: 'unit' | 'criteria'): string {
    try {
      const path = this.getRelativePath(webUrl);
      if (!path) return '';
      
      console.log(`Extracting ${type} from path: ${path}`);
      
      // Files are stored in "Evidence/UnitCode/CriteriaCode/filename.ext" 
      // Or in combined folders like "Evidence/UnitCode/1_1_1_2_1_3/filename.ext"
      const parts = path.split('/');
      
      // We need at least 3 parts: Evidence, UnitCode, CriteriaCode or filename
      if (parts.length < 3 || parts[0].toLowerCase() !== 'evidence') {
        return '';
      }
      
      // Extract the unit code (second part)
      if (type === 'unit' && parts.length > 1) {
        // Convert "_" back to "." for unit codes
        return parts[1].replace(/_/g, '.');
      } 
      // Extract the criteria code (third part or from combined folder name)
      else if (type === 'criteria' && parts.length > 2) {
        // Check if this is a combined folder with multiple criteria codes
        if (parts[2].includes('_')) {
          // This is a combined folder like "1_1_1_2_1_3"
          // For now, just return the first criteria code
          const criteriaSegments = parts[2].split('_');
          if (criteriaSegments.length >= 2) {
            // Try to reconstruct the first criteria code (e.g., "1_1" -> "1.1")
            return `${criteriaSegments[0]}.${criteriaSegments[1]}`;
          }
        }
        
        // Not a combined folder or couldn't parse, just replace _ with .
        return parts[2].replace(/_/g, '.');
      }
      
      return '';
    } catch (error) {
      console.error(`Failed to extract ${type} from path:`, webUrl, error);
      return '';
    }
  }

  // Helper to extract a SharePoint file ID from a URL if available
  private extractFileIdFromUrl(url: string): string | null {
    try {
      // Skip invalid URLs
      if (!url || url.trim() === '') {
        return null;
      }
      
      const urlObj = new URL(url);
      
      // For _layouts/15/Doc.asp URLs, extract sourcedoc parameter
      if (urlObj.pathname.includes('/_layouts/15/Doc.asp')) {
        // First check for sourcedoc parameter which often contains the ID
        const sourcedoc = urlObj.searchParams.get('sourcedoc');
        if (sourcedoc) {
          // Remove any curly braces
          const cleanId = sourcedoc.replace(/[{}]/g, '');
          console.log('Extracted sourcedoc ID:', cleanId);
          return cleanId;
        }
        
        // Try to find the ID in other parameters
        const id = urlObj.searchParams.get('id');
        if (id) {
          console.log('Extracted ID parameter:', id);
          return id;
        }
      }
      
      // Look for SharePoint item ID patterns in the URL
      // IDs can be in various formats:
      // - GUIDs like {094F5F61-8294-4462-B0B3-E5F0477FFE55}
      // - GUIDs without braces like 094F5F61-8294-4462-B0B3-E5F0477FFE55
      // - Alphanumeric IDs like 01CJFGYG6CW2FGHRXRFVC2KZKYYDS3DSK5
      
      // Try to match GUID pattern with or without braces
      const guidMatch = url.match(/(\{[0-9a-f-]{36}\}|[0-9a-f-]{36})/i);
      if (guidMatch) {
        const guid = guidMatch[1].replace(/[{}]/g, '');
        console.log('Extracted GUID from URL:', guid);
        return guid;
      }
      
      // Try to match SharePoint item ID pattern (usually alphanumeric, at least 15 chars)
      const itemIdMatch = url.match(/\b([0-9a-z]{15,})\b/i);
      if (itemIdMatch) {
        console.log('Extracted SharePoint item ID from URL:', itemIdMatch[1]);
        return itemIdMatch[1];
      }
      
      // Check if there's an ID parameter in the URL - using a more compatible approach
      // Get all parameter names
      const paramNames = Array.from(urlObj.searchParams.keys());
      for (const key of paramNames) {
        if (key.toLowerCase().includes('id')) {
          const value = urlObj.searchParams.get(key);
          if (value && value.length > 5) {
            console.log(`Extracted ${key} parameter:`, value);
            return value;
          }
        }
      }
      
      return null;
    } catch (e) {
      console.warn('Error extracting file ID from URL:', e);
      return null;
    }
  }
  
  // Helper to extract just a filename from a URL
  private extractFilenameFromUrl(url: string): string {
    try {
      // Try to match common file extensions including image formats
      const fileMatch = url.match(/([^\/&]+\.(xlsx|pdf|docx|pptx|txt|jpg|jpeg|png|gif|bmp|webp|tiff|svg))/i);
      if (fileMatch) {
        return decodeURIComponent(fileMatch[1]);
      }
      
      // Special handling for _layouts/15/Doc.asp URLs
      const urlObj = new URL(url);
      if (urlObj.pathname.includes('/_layouts/15/Doc.asp')) {
        // Try to get the filename from the File query parameter
        const file = urlObj.searchParams.get('file');
        if (file) {
          return decodeURIComponent(file);
        }
        
        // Check if there's a name or filename parameter
        const name = urlObj.searchParams.get('name') || urlObj.searchParams.get('filename');
        if (name) {
          return decodeURIComponent(name);
        }
      }
      
      // Try URL's pathname
      const pathParts = urlObj.pathname.split('/');
      const lastPart = pathParts[pathParts.length - 1];
      if (lastPart && lastPart !== '' && !lastPart.includes('.asp')) {
        return decodeURIComponent(lastPart);
      }
      
      // Extract from query params
      const sourceDoc = urlObj.searchParams.get('sourcedoc');
      if (sourceDoc) {
        try {
          const decoded = decodeURIComponent(sourceDoc);
          const parts = decoded.split('/');
          return parts[parts.length - 1] || 'Unknown File';
        } catch (e) {
          console.warn('Error decoding sourcedoc parameter:', e);
        }
      }
      
      // If we have a title in the URL, try to use that
      const title = urlObj.searchParams.get('title');
      if (title) {
        // If it doesn't have an extension, try to guess one from content-type
        if (!title.includes('.')) {
          const contentType = urlObj.searchParams.get('contenttype');
          if (contentType) {
            if (contentType.includes('png')) return `${title}.png`;
            if (contentType.includes('jpeg') || contentType.includes('jpg')) return `${title}.jpg`;
            if (contentType.includes('pdf')) return `${title}.pdf`;
            if (contentType.includes('word')) return `${title}.docx`;
            if (contentType.includes('excel') || contentType.includes('sheet')) return `${title}.xlsx`;
          }
        }
        return title;
      }
      
      // Fallback - extract GUID from URL if available
      const guidMatch = url.match(/(\{[0-9a-f-]{36}\}|[0-9a-f-]{36})/i);
      if (guidMatch) {
        return `File-${guidMatch[1].replace(/[{}]/g, '')}`;
      }
      
      // Absolute last resort
      return 'Unknown File';
    } catch (e) {
      console.warn('Error extracting filename from URL:', e);
      return 'Unknown File';
    }
  }

  /**
   * Special method specifically for PNG files using SharePoint REST API directly
   * This bypasses Graph API completely which has known issues with binary files
   */
  public async uploadPngFile(file: File, folderPath: string, fileName: string): Promise<EvidenceMetadata> {
    try {
      console.log(`SharePointService: Using SharePoint REST API for PNG upload: ${fileName} (size: ${file.size} bytes)`);
      
      // Ensure we're authenticated
      if (!this.isAuthenticated()) {
        await this.authenticate();
      }

      // Ensure file has .png extension
      let finalFileName = fileName;
      if (!finalFileName.toLowerCase().endsWith('.png')) {
        finalFileName = finalFileName.replace(/\.[^/.]+$/, '') + '.png';
      }

      // Make sure folderPath is properly formatted
      if (!folderPath.startsWith('Evidence/')) {
        folderPath = folderPath.includes('Evidence') 
          ? folderPath.substring(folderPath.indexOf('Evidence'))
          : `Evidence/${folderPath}`;
      }
      
      // Get access token and site URL
      const accessToken = await this.getAccessToken();
      const siteUrl = this.getProfileSiteUrl();
      if (!siteUrl) {
        throw new Error('SharePoint site URL not configured');
      }
      
      console.log(`SharePointService: Using site URL: ${siteUrl}`);
      
      // First, ensure folder structure exists using standard Graph API
      const driveId = await this.getDriveId();
      console.log(`SharePointService: Creating folder structure for ${folderPath} in drive ${driveId}`);
      
      const folderSegments = folderPath.split('/').filter(Boolean);
      let currentPath = '';
      let folderId: string | undefined = undefined;
      
      for (const segment of folderSegments) {
        currentPath = currentPath ? `${currentPath}/${segment}` : segment;
        
        try {
          // Try to get the folder
          const folderResponse = await this.client!.api(`/drives/${driveId}/root:/${currentPath}`).get();
          folderId = folderResponse.id;
          console.log(`SharePointService: Found existing folder: ${currentPath} (${folderId})`);
        } catch (err: any) {
          if ((err.statusCode === 404) || (err.code && err.code === 'itemNotFound')) {
            // Folder doesn't exist, create it
            console.log(`SharePointService: Folder ${currentPath} not found, creating it`);
            const parentPath = currentPath.substring(0, currentPath.lastIndexOf('/')) || '';
            
            try {
              // Create the folder under its parent
              const createEndpoint = parentPath 
                ? `/drives/${driveId}/root:/${parentPath}:/children` 
                : `/drives/${driveId}/root/children`;
              
              const createResp = await this.client!.api(createEndpoint).post({
                name: segment,
                folder: {},
                '@microsoft.graph.conflictBehavior': 'replace'
              });
              
              folderId = createResp.id;
              console.log(`SharePointService: Created folder: ${currentPath} (${folderId})`);
            } catch (createErr: any) {
              console.error(`SharePointService: Error creating folder ${segment}:`, createErr);
              throw new Error(`Failed to create folder: ${createErr.message || JSON.stringify(createErr)}`);
            }
          } else {
            console.error(`SharePointService: Error checking folder ${currentPath}:`, err);
            throw err;
          }
        }
      }

      // Now use direct SharePoint REST API to upload the PNG file
      console.log(`SharePointService: Using direct SharePoint REST API to upload PNG file`);
      
      // Extract the server-relative URL
      const url = new URL(siteUrl);
      const siteServerRelativeUrl = url.pathname;
      
      // Construct the target folder server-relative URL
      const targetFolderUrl = `${siteServerRelativeUrl}/Shared Documents/${folderPath}`;
      console.log(`SharePointService: Target folder URL: ${targetFolderUrl}`);
      
      // Read file as ArrayBuffer
      const fileArrayBuffer = await file.arrayBuffer();
      
      // Get digest (form digest value) for POST request
      const digestResponse = await fetch(`${siteUrl}/_api/contextinfo`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json;odata=verbose'
        }
      });
      
      if (!digestResponse.ok) {
        throw new Error(`Failed to get form digest: ${digestResponse.status} ${digestResponse.statusText}`);
      }
      
      const digestData = await digestResponse.json();
      const formDigestValue = digestData.d.GetContextWebInformation.FormDigestValue;
      console.log(`SharePointService: Got form digest value for REST API operation`);
      
      // Upload file to SharePoint using REST API
      const uploadUrl = `${siteUrl}/_api/web/getfolderbyserverrelativeurl('${encodeURIComponent(targetFolderUrl)}')/Files/add(url='${encodeURIComponent(finalFileName)}',overwrite=true)`;
      console.log(`SharePointService: Uploading to REST API URL: ${uploadUrl}`);
      
      const uploadResponse = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'image/png',
          'Accept': 'application/json;odata=verbose',
          'X-RequestDigest': formDigestValue
        },
        body: new Blob([fileArrayBuffer], {type: 'image/png'})
      });
      
      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        console.error(`SharePointService: REST API upload failed: ${uploadResponse.status}`, errorText);
        throw new Error(`SharePoint REST API upload failed: ${uploadResponse.status} ${uploadResponse.statusText}`);
      }
      
      const uploadResult = await uploadResponse.json();
      console.log(`SharePointService: REST API upload successful:`, uploadResult.d.ServerRelativeUrl);
      
      // Get the file's web URL and server-relative URL
      const fileServerRelativeUrl = uploadResult.d.ServerRelativeUrl;
      const fileWebUrl = `${siteUrl}/Shared%20Documents/${folderPath}/${encodeURIComponent(finalFileName)}`;
      
      // Add the assessment metadata using REST API
      try {
        console.log(`SharePointService: Adding assessment metadata to file`);
        
        // Get file list item to set metadata
        const listItemUrl = `${siteUrl}/_api/web/getfilebyserverrelativeurl('${encodeURIComponent(fileServerRelativeUrl)}')/ListItemAllFields`;
        const listItemResponse = await fetch(listItemUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json;odata=verbose'
          }
        });
        
        if (!listItemResponse.ok) {
          console.warn(`SharePointService: Failed to get list item: ${listItemResponse.status}`);
          // Continue anyway, metadata is not critical
        } else {
          const listItem = await listItemResponse.json();
          const listItemId = listItem.d.Id;
          
          // Extract unit code and criteria code from folder path
          const pathSegments = folderPath.split('/');
          let unitCode = '';
          let criteriaCode = '';
          
          if (pathSegments.length >= 2 && pathSegments[0].toLowerCase() === 'evidence') {
            unitCode = pathSegments[1].replace(/_/g, '.');
            if (pathSegments.length >= 3) {
              criteriaCode = pathSegments[2].replace(/_/g, '.');
            }
          }
          
          // Update the list item metadata
          const updateUrl = `${siteUrl}/_api/web/lists/getbytitle('Documents')/items(${listItemId})`;
          const updateResponse = await fetch(updateUrl, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json;odata=verbose',
              'Accept': 'application/json;odata=verbose',
              'X-RequestDigest': formDigestValue,
              'X-HTTP-Method': 'MERGE',
              'IF-MATCH': '*'
            },
            body: JSON.stringify({
              __metadata: { type: 'SP.Data.DocumentsItem' },
              Title: finalFileName,
              UnitCode: unitCode,
              CriteriaCode: criteriaCode,
              AssessmentStatus: 'pending'
            })
          });
          
          if (!updateResponse.ok) {
            console.warn(`SharePointService: Failed to update metadata: ${updateResponse.status}`);
            // Continue anyway, metadata update is not critical
          } else {
            console.log(`SharePointService: Updated metadata successfully`);
          }
        }
      } catch (metadataError) {
        console.warn(`SharePointService: Error setting metadata (non-critical):`, metadataError);
        // Continue anyway, metadata is not critical for file viewing
      }
      
      // Return evidence metadata
      const evidenceMetadata: EvidenceMetadata = {
        id: uploadResult.d.UniqueId || crypto.randomUUID(),
        name: finalFileName,
        webUrl: fileWebUrl,
        downloadUrl: fileWebUrl,
        size: file.size,
        mimeType: 'image/png',
        createdDateTime: new Date(),
        lastModifiedDateTime: new Date(),
        assessmentStatus: AssessmentStatus.Pending,
        criteriaCode: folderPath.split('/')[2]?.replace(/_/g, '.') || '',
        unitCode: folderPath.split('/')[1]?.replace(/_/g, '.') || '',
        description: ''
      };
      
      console.log(`SharePointService: Returning evidence metadata:`, evidenceMetadata);
      return evidenceMetadata;
    } catch (error) {
      console.error('SharePointService: Failed to upload PNG file with REST API:', error);
      throw new Error('Failed to upload PNG file: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  }

  /**
   * Special method for direct upload of image files like PNG
   * This uses a simpler, direct approach that's less prone to corruption
   */
  public async uploadImageFile(file: File, folderPath: string, fileName: string): Promise<EvidenceMetadata> {
    try {
      console.log(`SharePointService: Using specialized image file upload for ${fileName} (${file.type}, size: ${file.size} bytes)`);
      
      // For PNG files, use our specialized PNG upload method
      if (file.type === 'image/png' || fileName.toLowerCase().endsWith('.png')) {
        console.log(`SharePointService: Detected PNG file, using PNG-specific uploader`);
        return await this.uploadPngFile(file, folderPath, fileName);
      }
      
      // For other image files, use a direct approach
      
      // Ensure correct extension for common image types
      let finalFileName = fileName;
      if (file.type === 'image/jpeg' && !finalFileName.toLowerCase().match(/\.(jpg|jpeg)$/)) {
        finalFileName = finalFileName.replace(/\.[^/.]+$/, '') + '.jpg';
      } else if (file.type === 'image/gif' && !finalFileName.toLowerCase().endsWith('.gif')) {
        finalFileName = finalFileName.replace(/\.[^/.]+$/, '') + '.gif';
      }
      
      // Ensure we're authenticated
      if (!this.isAuthenticated()) {
        await this.authenticate();
      }
      
      // Make sure folderPath is properly formatted
      if (!folderPath.startsWith('Evidence/')) {
        folderPath = folderPath.includes('Evidence') 
          ? folderPath.substring(folderPath.indexOf('Evidence'))
          : `Evidence/${folderPath}`;
      }
      
      // Create folder structure (similar to PNG method)
      const driveId = await this.getDriveId();
      console.log(`SharePointService: Creating folder structure for ${folderPath}`);
      const folderSegments = folderPath.split('/').filter(Boolean);
      let currentPath = '';
      let folderId: string | undefined = undefined;
      
      for (const segment of folderSegments) {
        currentPath = currentPath ? `${currentPath}/${segment}` : segment;
        
        try {
          // Try to get the folder
          const folderResponse = await this.client!.api(`/drives/${driveId}/root:/${currentPath}`).get();
          folderId = folderResponse.id;
        } catch (err: any) {
          if ((err.statusCode === 404) || (err.code && err.code === 'itemNotFound')) {
            // Folder doesn't exist, create it
            const parentPath = currentPath.substring(0, currentPath.lastIndexOf('/')) || '';
            
            try {
              // Create the folder under its parent
              const createEndpoint = parentPath 
                ? `/drives/${driveId}/root:/${parentPath}:/children` 
                : `/drives/${driveId}/root/children`;
              
              const createResp = await this.client!.api(createEndpoint).post({
                name: segment,
                folder: {},
                '@microsoft.graph.conflictBehavior': 'replace'
              });
              
              folderId = createResp.id;
            } catch (createErr: any) {
              console.error(`SharePointService: Error creating folder ${segment}:`, createErr);
              throw new Error(`Failed to create folder: ${createErr.message || JSON.stringify(createErr)}`);
            }
          } else {
            throw err;
          }
        }
      }
      
      if (!folderId) {
        throw new Error('Failed to create or access folder structure');
      }
      
      // Get file as ArrayBuffer
      const fileArrayBuffer = await file.arrayBuffer();
      
      // Get access token
      const accessToken = await this.getAccessToken();
      const encodedFileName = encodeURIComponent(finalFileName);
      
      // Direct upload via REST API
      try {
        const endpoint = `https://graph.microsoft.com/v1.0/drives/${driveId}/items/${folderId}:/${encodedFileName}:/content`;
        
        const response = await fetch(endpoint, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': file.type || 'application/octet-stream'
          },
          body: new Blob([fileArrayBuffer], {type: file.type})
        });
        
        if (!response.ok) {
          const responseText = await response.text();
          console.error(`SharePointService: Direct upload failed: ${response.status} ${response.statusText}`, responseText);
          throw new Error(`Direct upload failed: ${response.status} ${response.statusText}`);
        }
        
        const responseData = await response.json();
        console.log(`SharePointService: Direct upload successful, item ID: ${responseData.id}`);
        
        // Return the file metadata
        return {
          id: responseData.id,
          name: responseData.name,
          webUrl: responseData.webUrl,
          downloadUrl: responseData['@microsoft.graph.downloadUrl'],
          size: responseData.size,
          mimeType: file.type,
          createdDateTime: responseData.createdDateTime,
          lastModifiedDateTime: responseData.lastModifiedDateTime,
          assessmentStatus: AssessmentStatus.Pending,
          criteriaCode: this.extractFromPath(responseData.webUrl, 'criteria'),
          unitCode: this.extractFromPath(responseData.webUrl, 'unit')
        };
      } catch (error) {
        console.error('SharePointService: Failed to upload image file:', error);
        throw new Error('Failed to upload image file: ' + (error instanceof Error ? error.message : 'Unknown error'));
      }
    } catch (error) {
      console.error('Failed to upload image file:', error);
      throw new Error('Failed to upload image file: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  }

  /**
   * Deletes a file from SharePoint
   * @param fileUrl The URL of the file to delete
   */
  public async deleteFile(fileUrl: string): Promise<void> {
    if (!this.isAuthenticated()) {
      await this.authenticate();
    }

    try {
      console.log(`SharePointService: Deleting file at URL: ${fileUrl}`);
      const driveId = await this.getDriveId();
      
      // Extract the relative path from the URL
      const filePath = this.getRelativePath(fileUrl);
      if (!filePath) {
        throw new Error('Could not determine file path from URL');
      }
      
      console.log(`SharePointService: Extracted relative path: ${filePath}`);
      
      // First try using Graph API to delete the file
      try {
        await this.client!.api(`/drives/${driveId}/root:/${filePath}`).delete();
        console.log(`SharePointService: Successfully deleted file using Graph API`);
        return;
      } catch (graphError) {
        console.warn('SharePointService: Failed to delete using Graph API, trying REST API:', graphError);
      }
      
      // Fallback to REST API if Graph API fails
      try {
        // Get site URL
        const siteUrl = this.getProfileSiteUrl();
        if (!siteUrl) {
          throw new Error('SharePoint site URL not configured');
        }
        
        // Get a digest value for the request
        const accessToken = await this.getAccessToken();
        const digestResponse = await fetch(`${siteUrl}/_api/contextinfo`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json;odata=verbose'
          }
        });
        
        if (!digestResponse.ok) {
          throw new Error(`Failed to get form digest: ${digestResponse.status}`);
        }
        
        const digestData = await digestResponse.json();
        const formDigestValue = digestData.d.GetContextWebInformation.FormDigestValue;
        
        // Extract the server-relative URL
        const serverRelativeUrl = this.extractServerRelativeUrl(fileUrl);
        if (!serverRelativeUrl) {
          throw new Error('Could not determine server-relative URL');
        }
        
        // Delete the file using REST API
        const deleteResponse = await fetch(`${siteUrl}/_api/web/getfilebyserverrelativeurl('${encodeURIComponent(serverRelativeUrl)}')`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json;odata=verbose',
            'X-RequestDigest': formDigestValue,
            'X-HTTP-Method': 'DELETE'
          }
        });
        
        if (!deleteResponse.ok) {
          const errorText = await deleteResponse.text();
          throw new Error(`REST API delete failed: ${deleteResponse.status} - ${errorText}`);
        }
        
        console.log(`SharePointService: Successfully deleted file using REST API`);
      } catch (restError) {
        console.error('SharePointService: REST API delete also failed:', restError);
        throw restError;
      }
    } catch (error) {
      console.error('SharePointService: Failed to delete file:', error);
      throw new Error('Failed to delete file: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  }
  
  /**
   * Helper method to extract a server-relative URL from a full SharePoint URL
   */
  private extractServerRelativeUrl(url: string): string | null {
    try {
      if (!url) return null;
      
      const urlObj = new URL(url);
      const hostname = urlObj.hostname;
      
      // Try to find the server-relative path from the URL
      // Look for standard SharePoint patterns
      
      // For document libraries
      if (url.includes('/Shared%20Documents/') || url.includes('/Shared Documents/')) {
        const sharedDocsIndex = url.indexOf('/Shared Documents/');
        if (sharedDocsIndex !== -1) {
          return url.substring(sharedDocsIndex);
        }
        
        const encodedDocsIndex = url.indexOf('/Shared%20Documents/');
        if (encodedDocsIndex !== -1) {
          // Need to decode the URL path
          return decodeURIComponent(url.substring(encodedDocsIndex));
        }
      }
      
      // For site pages or other content
      if (url.includes('/sites/')) {
        const sitesIndex = url.indexOf('/sites/');
        if (sitesIndex !== -1) {
          return url.substring(sitesIndex);
        }
      }
      
      // For team sites
      if (url.includes('/teams/')) {
        const teamsIndex = url.indexOf('/teams/');
        if (teamsIndex !== -1) {
          return url.substring(teamsIndex);
        }
      }
      
      // For _layouts URLs
      if (url.includes('/_layouts/')) {
        // These are special - we need to extract the source doc
        const urlObj = new URL(url);
        const sourceDoc = urlObj.searchParams.get('sourcedoc');
        if (sourceDoc) {
          return `/Shared Documents/Evidence/${sourceDoc.replace(/[{}]/g, '')}`;
        }
      }
      
      // Fallback - try to get path from URL
      return urlObj.pathname;
    } catch (error) {
      console.error('Error extracting server-relative URL:', error);
      return null;
    }
  }

  /**
   * Creates a folder in SharePoint if it doesn't already exist
   * @param folderPath The folder path to create
   * @returns The folder ID
   */
  public async createFolderIfNeeded(folderPath: string): Promise<string> {
    if (!this.isAuthenticated()) {
      await this.authenticate();
    }

    try {
      const driveId = await this.getDriveId();
      console.log(`SharePointService: Creating folder if needed: ${folderPath} in drive ${driveId}`);
      
      // First try to see if the folder already exists
      try {
        const response = await this.client!.api(`/drives/${driveId}/root:/${folderPath}`)
          .get();
        
        console.log(`SharePointService: Folder ${folderPath} already exists with ID: ${response.id}`);
        return response.id;
      } catch (error: any) {
        // If the folder doesn't exist (404), create it
        if (error.statusCode === 404 || (error.response && error.response.status === 404)) {
          console.log(`SharePointService: Folder ${folderPath} not found, creating it`);
          
          // Check if we need to create parent folders
          const folderSegments = folderPath.split('/').filter(Boolean);
          
          // If this is a nested path, we need to create parent folders
          if (folderSegments.length > 1) {
            let currentPath = '';
            let currentFolderId = '';
            
            for (const segment of folderSegments) {
              currentPath = currentPath ? `${currentPath}/${segment}` : segment;
              console.log(`SharePointService: Creating folder segment: ${currentPath}`);
              
              try {
                // Try to get the folder first
                const folderResponse = await this.client!.api(`/drives/${driveId}/root:/${currentPath}`)
                  .get();
                
                currentFolderId = folderResponse.id;
                console.log(`SharePointService: Folder segment ${currentPath} already exists with ID: ${currentFolderId}`);
              } catch (segmentError: any) {
                if (segmentError.statusCode === 404 || (segmentError.response && segmentError.response.status === 404)) {
                  // Create the folder
                  const parentPath = currentPath.substring(0, currentPath.lastIndexOf('/')) || '';
                  const createEndpoint = parentPath 
                    ? `/drives/${driveId}/root:/${parentPath}:/children` 
                    : `/drives/${driveId}/root/children`;
                  
                  const createResponse = await this.client!.api(createEndpoint)
                    .post({
                      name: segment,
                      folder: {},
                      '@microsoft.graph.conflictBehavior': 'replace'
                    });
                  
                  currentFolderId = createResponse.id;
                  console.log(`SharePointService: Created folder segment ${currentPath} with ID: ${currentFolderId}`);
                } else {
                  console.error(`SharePointService: Error checking folder segment ${currentPath}:`, segmentError);
                  throw segmentError;
                }
              }
            }
            
            return currentFolderId;
          } else {
            // Simple case - just create the folder at the root
            const createResponse = await this.client!.api(`/drives/${driveId}/root/children`)
              .post({
                name: folderSegments[0],
                folder: {},
                '@microsoft.graph.conflictBehavior': 'replace'
              });
            
            console.log(`SharePointService: Created folder ${folderPath} with ID: ${createResponse.id}`);
            return createResponse.id;
          }
        } else {
          console.error(`SharePointService: Error checking folder ${folderPath}:`, error);
          throw error;
        }
      }
    } catch (error) {
      console.error(`SharePointService: Failed to create folder ${folderPath}:`, error);
      throw new Error(`Failed to create folder: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get all SharePoint sites accessible to the current user
   * This is used by assessors to discover candidate sites
   */
  public async getAllAccessibleSites(): Promise<any[]> {
    try {
      await this.authenticate();
      
      if (!this.client) {
        throw new Error('Graph client is not initialized');
      }

      console.log('SharePointService: Fetching all accessible sites...');
      
      // Try multiple approaches to get sites
      let sites: any[] = [];
      
      // Approach 1: Get sites the user has access to
      try {
        const response = await this.client.api('/me/sites').get();
        sites = response.value || [];
        console.log('SharePointService: /me/sites returned', sites.length, 'sites');
      } catch (error) {
        console.warn('SharePointService: /me/sites failed:', error);
      }
      
      // Approach 2: If no sites found, try to get sites from the tenant
      if (sites.length === 0) {
        try {
          console.log('SharePointService: Trying tenant-wide site search...');
          const tenantResponse = await this.client.api('/sites').get();
          sites = tenantResponse.value || [];
          console.log('SharePointService: /sites returned', sites.length, 'sites');
        } catch (error) {
          console.warn('SharePointService: /sites failed:', error);
        }
      }
      
      // Approach 3: If still no sites, try to get sites from the current user's organization
      if (sites.length === 0) {
        try {
          console.log('SharePointService: Trying organization sites...');
          const orgResponse = await this.client.api('/sites?search=*').get();
          sites = orgResponse.value || [];
          console.log('SharePointService: /sites?search=* returned', sites.length, 'sites');
        } catch (error) {
          console.warn('SharePointService: /sites?search=* failed:', error);
        }
      }
      
      console.log('SharePointService: Final sites found:', sites.length);
      
      return sites;
    } catch (error: any) {
      console.error('SharePointService: Failed to get accessible sites:', error);
      
      // Check for specific permission errors
      if (error.statusCode === 403 || error.code === 'Forbidden') {
        throw new Error('Access denied. You need Sites.Read.All or Sites.ReadWrite.All permissions to access SharePoint sites.');
      } else if (error.statusCode === 401 || error.code === 'Unauthorized') {
        throw new Error('Authentication failed. Please sign in again.');
      } else if (error.message && error.message.includes('AADSTS900144')) {
        throw new Error('Authentication configuration error. Please check your Azure AD settings.');
      } else {
        throw new Error(`Failed to get accessible sites: ${error.message || 'Unknown error'}`);
      }
    }
  }

  /**
   * Get all sites from a specific SharePoint tenant
   * This is used by assessors to discover candidate sites
   */
  public async getAllSitesFromTenant(tenantUrl: string): Promise<any[]> {
    try {
      await this.authenticate();
      
      if (!this.client) {
        throw new Error('Graph client is not initialized');
      }

      console.log('SharePointService: Fetching all sites from tenant:', tenantUrl);
      
      // Extract the tenant domain from the URL
      const url = new URL(tenantUrl);
      const tenantDomain = url.hostname;
      
      // Get all sites from the tenant
      const response = await this.client.api(`/sites?search=${tenantDomain}`).get();
      
      console.log('SharePointService: Found sites in tenant:', response.value.length);
      
      return response.value;
    } catch (error) {
      console.error('SharePointService: Failed to get sites from tenant:', error);
      throw new Error('Failed to get sites from tenant');
    }
  }

  /**
   * Check if a site contains evidence folders (indicating it's a candidate site)
   */
  public async checkSiteForEvidence(siteUrl: string): Promise<{
    hasEvidence: boolean;
    evidenceCount: number;
    lastActivity: Date | null;
    candidateName: string;
  }> {
    try {
      await this.authenticate();
      
      if (!this.client) {
        throw new Error('Graph client is not initialized');
      }

      console.log('SharePointService: Checking site for evidence:', siteUrl);
      
      // Extract site name from URL for candidate name
      const candidateName = this.extractCandidateNameFromSiteUrl(siteUrl);
      
      // Try to get the site ID using the site URL
      let siteId: string;
      try {
        const siteResponse = await this.client.api(`/sites/${siteUrl}:/`).get();
        siteId = siteResponse.id;
        console.log('SharePointService: Found site ID:', siteId);
      } catch (siteError) {
        console.warn('SharePointService: Could not get site ID for:', siteUrl, siteError);
        return {
          hasEvidence: false,
          evidenceCount: 0,
          lastActivity: null,
          candidateName: candidateName
        };
      }
      
      // Get the drive ID for this site
      const driveResponse = await this.client.api(`/sites/${siteId}/drives`).get();
      
      if (!driveResponse.value || driveResponse.value.length === 0) {
        console.log('SharePointService: No drives found in site');
        return {
          hasEvidence: false,
          evidenceCount: 0,
          lastActivity: null,
          candidateName: candidateName
        };
      }

      const driveId = driveResponse.value[0].id;
      console.log('SharePointService: Using drive ID:', driveId);
      
      // Check for Evidence folder
      try {
        const evidenceFolderResponse = await this.client.api(`/drives/${driveId}/root:/Evidence:/children`).get();
        
        if (evidenceFolderResponse.value && evidenceFolderResponse.value.length > 0) {
          // Count evidence items
          let evidenceCount = 0;
          let lastActivity: Date | null = null;
          
          for (const item of evidenceFolderResponse.value) {
            if (item.folder) {
              // This is a unit folder, count files inside
              try {
                const unitFilesResponse = await this.client.api(`/drives/${driveId}/items/${item.id}/children`).get();
                evidenceCount += unitFilesResponse.value.filter((file: any) => !file.folder).length;
                
                // Track last activity
                for (const file of unitFilesResponse.value) {
                  if (file.lastModifiedDateTime) {
                    const fileDate = new Date(file.lastModifiedDateTime);
                    if (!lastActivity || fileDate > lastActivity) {
                      lastActivity = fileDate;
                    }
                  }
                }
              } catch (unitError) {
                console.warn('SharePointService: Error checking unit folder:', unitError);
              }
            } else {
              evidenceCount++;
              if (item.lastModifiedDateTime) {
                const fileDate = new Date(item.lastModifiedDateTime);
                if (!lastActivity || fileDate > lastActivity) {
                  lastActivity = fileDate;
                }
              }
            }
          }
          
          console.log(`SharePointService: Found ${evidenceCount} evidence items in site ${candidateName}`);
          
          return {
            hasEvidence: evidenceCount > 0,
            evidenceCount,
            lastActivity,
            candidateName: candidateName
          };
        }
      } catch (evidenceError) {
        console.log('SharePointService: No Evidence folder found in site, trying alternative locations...');
        
        // Try alternative folder names
        const alternativeFolders = ['Portfolio', 'Documents', 'Files', 'Evidence'];
        
        for (const folderName of alternativeFolders) {
          try {
            const folderResponse = await this.client.api(`/drives/${driveId}/root:/${folderName}:/children`).get();
            
            if (folderResponse.value && folderResponse.value.length > 0) {
              console.log(`SharePointService: Found ${folderName} folder with ${folderResponse.value.length} items`);
              
              let evidenceCount = 0;
              let lastActivity: Date | null = null;
              
              for (const item of folderResponse.value) {
                if (!item.folder) {
                  evidenceCount++;
                  if (item.lastModifiedDateTime) {
                    const fileDate = new Date(item.lastModifiedDateTime);
                    if (!lastActivity || fileDate > lastActivity) {
                      lastActivity = fileDate;
                    }
                  }
                }
              }
              
              if (evidenceCount > 0) {
                console.log(`SharePointService: Found ${evidenceCount} evidence items in ${folderName} folder`);
                return {
                  hasEvidence: true,
                  evidenceCount,
                  lastActivity,
                  candidateName: candidateName
                };
              }
            }
          } catch (folderError) {
            console.log(`SharePointService: ${folderName} folder not found`);
          }
        }
      }
      
      console.log('SharePointService: No evidence found in any location');
      return {
        hasEvidence: false,
        evidenceCount: 0,
        lastActivity: null,
        candidateName: candidateName
      };
      
    } catch (error: any) {
      console.error('SharePointService: Failed to check site for evidence:', error);
      
      // Return safe default values instead of throwing
      return {
        hasEvidence: false,
        evidenceCount: 0,
        lastActivity: null,
        candidateName: this.extractCandidateNameFromSiteUrl(siteUrl)
      };
    }
  }

  /**
   * Extract candidate name from SharePoint site URL
   */
  private extractCandidateNameFromSiteUrl(siteUrl: string): string {
    try {
      const url = new URL(siteUrl);
      const pathParts = url.pathname.split('/');
      
      // Look for site name in the path
      const siteIndex = pathParts.findIndex(part => part === 'sites');
      if (siteIndex !== -1 && pathParts[siteIndex + 1]) {
        const siteName = pathParts[siteIndex + 1];
        // Convert site name to readable candidate name
        return siteName
          .replace(/-/g, ' ')
          .replace(/_/g, ' ')
          .replace(/\b\w/g, l => l.toUpperCase())
          .trim();
      }
      
      return 'Unknown Candidate';
    } catch {
      return 'Unknown Candidate';
    }
  }

  /**
   * Get site ID from site URL
   */
  private async getSiteIdFromUrl(siteUrl: string): Promise<string> {
    try {
      if (!this.client) {
        throw new Error('Graph client is not initialized');
      }

      const response = await this.client.api(`/sites/${siteUrl}:/`).get();
      return response.id;
    } catch (error) {
      console.error('SharePointService: Failed to get site ID from URL:', error);
      throw new Error('Failed to get site ID from URL');
    }
  }
}

// Check if the file exists and modify existing methods to ensure assessment data is properly returned
// Add a method to correctly map SharePoint data to Evidence model
export function mapSharePointDataToEvidence(item: any): Evidence {
  return {
    id: item.id || item.ID || generateId(),
    criteriaCode: item.criteriaCode || item.CriteriaCode || '',
    unitCode: item.unitCode || item.UnitCode || '',
    title: item.title || item.Title || item.name || item.Name || 'Untitled Evidence',
    description: item.description || item.Description || '',
    dateUploaded: new Date(item.dateUploaded || item.DateUploaded || item.createdDateTime || item.Created || new Date()).toISOString(),
    webUrl: item.webUrl || item.WebUrl || '',
    downloadUrl: item.downloadUrl || item.DownloadUrl || '',
    assessmentStatus: item.assessmentStatus || item.AssessmentStatus || AssessmentStatus.Pending,
    assessorFeedback: item.assessorFeedback || item.AssessorFeedback || '',
    assessorName: item.assessorName || item.AssessorName || '',
    assessmentDate: item.assessmentDate ? new Date(item.assessmentDate).toISOString() : undefined
  };
}

// Generate a random ID for new evidence items
function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
} 