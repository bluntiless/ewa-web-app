import dynamic from 'next/dynamic';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { SharePointService, EvidenceMetadata } from '../services/SharePointService';
import { AssessmentService } from '../services/AssessmentService';
import BottomNavigation from '../components/BottomNavigation';
import { useMsalAuth } from '../lib/useMsalAuth';

const ASSESSMENT_STATUSES = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  NEEDS_REVISION: 'needs_revision'
} as const;

type AssessmentStatus = typeof ASSESSMENT_STATUSES[keyof typeof ASSESSMENT_STATUSES];

interface PendingEvidence {
  id: string;
  name: string;
  candidateName: string;
  candidateSiteUrl: string;
  dateSubmitted: Date;
  status: AssessmentStatus;
  description?: string;
}

interface Candidate {
  id: string;
  name: string;
  siteId: string;
  siteUrl: string;
  pendingEvidence: number;
  totalEvidence: number;
  lastActivity?: Date;
}

// Client-side only component
function AssessorReviewClient() {
  const { account, loading, error: msalError } = useMsalAuth();

  // Session-level cache for dashboard data
  const getSessionCache = () => {
    try {
      const sessionData = sessionStorage.getItem('assessor-dashboard-data');
      return sessionData ? JSON.parse(sessionData) : null;
    } catch {
      return null;
    }
  };

  const setSessionCache = (data: { candidates: Candidate[], pendingEvidence: PendingEvidence[], timestamp: number }) => {
    try {
      sessionStorage.setItem('assessor-dashboard-data', JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save session cache:', error);
    }
  };

  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [pendingEvidence, setPendingEvidence] = useState<PendingEvidence[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'evidence-queue'>('dashboard');
  const router = useRouter();

  // Cache for storing scan results with localStorage persistence
  const getCacheFromStorage = (): {[key: string]: { evidence: PendingEvidence[], timestamp: number }} => {
    try {
      const stored = localStorage.getItem('assessor-evidence-cache');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  };

  const setCacheToStorage = (cache: {[key: string]: { evidence: PendingEvidence[], timestamp: number }}) => {
    try {
      localStorage.setItem('assessor-evidence-cache', JSON.stringify(cache));
    } catch (error) {
      console.warn('Failed to save cache to localStorage:', error);
    }
  };

  const [scanCache, setScanCache] = useState<{[key: string]: { evidence: PendingEvidence[], timestamp: number }}>(getCacheFromStorage());
  const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes
  const SESSION_CACHE_DURATION = 60 * 60 * 1000; // 1 hour for session cache

  // Update localStorage when cache changes
  useEffect(() => {
    setCacheToStorage(scanCache);
  }, [scanCache]);

  // Load data with session caching
  useEffect(() => {
    if (account) {
      loadDataWithCache();
    }
  }, [account]);

  const loadDataWithCache = async () => {
    const sessionCache = getSessionCache();
    const now = Date.now();

    if (sessionCache && (now - sessionCache.timestamp) < SESSION_CACHE_DURATION) {
      console.log('Using session cache for dashboard data');
      setCandidates(sessionCache.candidates);
      setPendingEvidence(sessionCache.pendingEvidence);
      setIsLoading(false);
      return;
    }

    await loadData();
  };

  const refreshData = () => {
    loadData();
  };

  const extractCandidateName = (siteId: string): string => {
    // Extract candidate name from site ID or return a default
    if (siteId.includes('EWANVQLevel3ElectroTechnical')) {
      return 'EWA NVQ Level 3 ElectroTechnical';
    }
    if (siteId.includes('Trialcandidatea')) {
      return 'Trial candidate a';
    }
    if (siteId.includes('CandidateaEportfolioofevidence')) {
      return 'Candidate a E portfolio of evidence';
    }
    if (siteId.includes('PrivateCandidate')) {
      return 'Private Candidate';
    }
    if (siteId.includes('AshleyClark')) {
      return 'Ashley Clark';
    }
    if (siteId.includes('WayneWright')) {
      return 'Wayne Wright';
    }
    if (siteId.includes('JohnSmith')) {
      return 'John Smith';
    }
    if (siteId.includes('CameronTait')) {
      return 'Cameron Tait';
    }
    if (siteId.includes('GrantPreston')) {
      return 'Grant Preston';
    }
    if (siteId.includes('EdmundBotchway')) {
      return 'Edmund Botchway';
    }
    if (siteId.includes('LewisSlater')) {
      return 'Lewis Slater';
    }
    if (siteId.includes('JonnyRingo')) {
      return 'Jonny Ringo';
    }
    
    return 'Unknown Candidate';
  };

  const loadCandidates = async (): Promise<Candidate[]> => {
    try {
      const spService = SharePointService.getInstance();
      await spService.authenticate();

      const sites = await spService.getAllAccessibleSites();
      const candidates: Candidate[] = [];

      for (const site of sites) {
        try {
          const siteInfo = await spService.checkSiteForEvidence(site.webUrl);
          
          if (siteInfo.hasEvidence) {
            const candidate: Candidate = {
              id: site.id,
              name: siteInfo.candidateName,
              siteId: site.id,
              siteUrl: site.webUrl,
              pendingEvidence: siteInfo.evidenceCount,
              totalEvidence: siteInfo.evidenceCount,
              lastActivity: siteInfo.lastActivity || undefined
            };
            candidates.push(candidate);
          }
        } catch (error) {
          console.warn(`Failed to check site ${site.webUrl}:`, error);
        }
      }

      return candidates.sort((a, b) => (b.lastActivity?.getTime() || 0) - (a.lastActivity?.getTime() || 0));
    } catch (error) {
      console.error('Failed to load candidates:', error);
      throw error;
    }
  };

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [candidatesData, pendingEvidenceData] = await Promise.all([
        loadCandidates(),
        loadPendingEvidence()
      ]);

      setCandidates(candidatesData);
      setPendingEvidence(pendingEvidenceData);

      // Cache the results
      const cacheData = {
        candidates: candidatesData,
        pendingEvidence: pendingEvidenceData,
        timestamp: Date.now()
      };
      setSessionCache(cacheData);

    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const isCandidateSite = (siteName: string, siteUrl: string): boolean => {
    // Check if this looks like a candidate site
    const candidatePatterns = [
      /candidate/i,
      /student/i,
      /learner/i,
      /trainee/i,
      /apprentice/i,
      /evidence/i,
      /portfolio/i
    ];

    const urlPatterns = [
      /candidate/i,
      /student/i,
      /learner/i,
      /trainee/i,
      /apprentice/i,
      /evidence/i,
      /portfolio/i
    ];

    // Check site name patterns
    for (const pattern of candidatePatterns) {
      if (pattern.test(siteName)) {
        return true;
      }
    }

    // Check URL patterns
    for (const pattern of urlPatterns) {
      if (pattern.test(siteUrl)) {
        return true;
      }
    }

    // Check for evidence folders or files
    if (siteName.toLowerCase().includes('evidence') || siteUrl.toLowerCase().includes('evidence')) {
      return true;
    }

    return false;
  };

  const loadPendingEvidence = async () => {
    try {
      const spService = SharePointService.getInstance();
      await spService.authenticate();

      const sites = await spService.getAllAccessibleSites();
      const allPendingEvidence: PendingEvidence[] = [];

      for (const site of sites) {
        try {
          // Check if this site has evidence
          const siteInfo = await spService.checkSiteForEvidence(site.webUrl);
          
          if (siteInfo.hasEvidence) {
            // Get evidence from this site
            const siteEvidence = await fetchPendingEvidenceFromSite(site.id, site.name, spService);
            allPendingEvidence.push(...siteEvidence);
          }
        } catch (error) {
          console.warn(`Failed to load evidence from site ${site.webUrl}:`, error);
        }
      }

      return allPendingEvidence.sort((a, b) => b.dateSubmitted.getTime() - a.dateSubmitted.getTime());
    } catch (error) {
      console.error('Failed to load pending evidence:', error);
      throw error;
    }
  };

  const fetchPendingEvidenceFromSite = async (siteId: string, siteName: string, spService: SharePointService): Promise<PendingEvidence[]> => {
    try {
      // Check cache first
      const cacheKey = `${siteId}-evidence`;
      const cached = scanCache[cacheKey];
      const now = Date.now();

      if (cached && (now - cached.timestamp) < CACHE_DURATION) {
        console.log(`Using cached evidence for site ${siteId}`);
        return cached.evidence;
      }

      // Scan for evidence using common structures
      const evidence = await scanCommonEvidenceStructures(siteId, siteName, spService);

      // Update cache
      setScanCache(prev => ({
        ...prev,
        [cacheKey]: {
          evidence,
          timestamp: now
        }
      }));

      return evidence;
    } catch (error) {
      console.error(`Failed to fetch evidence from site ${siteId}:`, error);
      return [];
    }
  };

  const scanCommonEvidenceStructures = async (siteId: string, siteName: string, spService: SharePointService): Promise<PendingEvidence[]> => {
    const evidence: PendingEvidence[] = [];
    const commonPaths = [
      '/Evidence',
      '/Portfolio',
      '/Assessment',
      '/Units',
      '/NETP3',
      '/NETP3-01',
      '/NETP3-02',
      '/NETP3-03',
      '/NETP3-04',
      '/NETP3-05',
      '/NETP3-06'
    ];

    for (const path of commonPaths) {
      try {
        const pathEvidence = await getEvidenceFromPath(siteId, path, spService);
        evidence.push(...pathEvidence);
      } catch (error) {
        console.warn(`Failed to scan path ${path} in site ${siteId}:`, error);
      }
    }

    return evidence;
  };

  const getEvidenceFromPath = async (siteId: string, path: string, spService: SharePointService, maxDepth: number = 3, currentDepth: number = 0): Promise<PendingEvidence[]> => {
    if (currentDepth >= maxDepth) return [];

    const evidence: PendingEvidence[] = [];

    try {
      const client = spService['client'];
      if (!client) return [];

      const driveId = await spService['getDriveId']();
      const items = await client.api(`/drives/${driveId}/root:${path}:/children`).get();

      for (const item of items.value) {
        if (item.file) {
          // This is a file - check if it's evidence
          if (isNETP3EvidenceItem(item, siteId)) {
            const status = await getAssessmentStatus(item, siteId, spService);
            
            if (status === ASSESSMENT_STATUSES.PENDING) {
              const evidenceItem: PendingEvidence = {
                id: item.id,
                name: item.name,
                candidateName: extractCandidateName(siteId),
                candidateSiteUrl: `https://${siteId}.sharepoint.com`,
                dateSubmitted: new Date(item.lastModifiedDateTime),
                status: status,
                description: item.description || ''
              };
              evidence.push(evidenceItem);
            }
          }
        } else if (item.folder && currentDepth < maxDepth - 1) {
          // This is a folder - recursively scan
          const subPath = `${path}/${item.name}`;
          const subEvidence = await getEvidenceFromPath(siteId, subPath, spService, maxDepth, currentDepth + 1);
          evidence.push(...subEvidence);
        }
      }
    } catch (error) {
      console.warn(`Failed to scan path ${path} at depth ${currentDepth}:`, error);
    }

    return evidence;
  };

  const getAllItemsFromSite = async (siteId: string, spService: SharePointService): Promise<any[]> => {
    try {
      const client = spService['client'];
      if (!client) return [];

      const driveId = await spService['getDriveId']();
      const allItems: any[] = [];

      const scanFolder = async (folderId: string, depth: number = 0): Promise<void> => {
        if (depth > 3) return; // Limit depth to prevent infinite recursion

        try {
          const items = await client.api(`/drives/${driveId}/items/${folderId}/children`).get();
          
          for (const item of items.value) {
            allItems.push(item);
            
            if (item.folder && depth < 3) {
              await scanFolder(item.id, depth + 1);
            }
          }
        } catch (error) {
          console.warn(`Failed to scan folder ${folderId}:`, error);
        }
      };

      // Start scanning from root
      const root = await client.api(`/drives/${driveId}/root`).get();
      await scanFolder(root.id);

      return allItems;
    } catch (error) {
      console.error(`Failed to get all items from site ${siteId}:`, error);
      return [];
    }
  };

  const isNETP3UnitFile = (item: any): boolean => {
    if (!item.name) return false;
    
    const fileName = item.name.toLowerCase();
    const netp3Patterns = [
      /netp3/i,
      /evidence/i,
      /assessment/i,
      /portfolio/i,
      /unit/i,
      /criteria/i
    ];

    return netp3Patterns.some(pattern => pattern.test(fileName));
  };

  const isNETP3EvidenceItem = (item: any, siteName: string): boolean => {
    if (!item.file) return false;
    
    // Check if it's a file (not a folder)
    if (item.folder) return false;
    
    // Check file extensions
    const fileName = item.name.toLowerCase();
    const evidenceExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.mp4', '.mov', '.avi', '.wmv'];
    
    const hasEvidenceExtension = evidenceExtensions.some(ext => fileName.endsWith(ext));
    
    if (!hasEvidenceExtension) return false;
    
    // Check if it's in a NETP3-related folder or has NETP3-related naming
    return isNETP3UnitFile(item);
  };

  const getAssessmentStatus = async (item: any, siteId: string, spService: SharePointService): Promise<AssessmentStatus> => {
    try {
      const client = spService['client'];
      if (!client) return ASSESSMENT_STATUSES.PENDING;

      const driveId = await spService['getDriveId']();
      const listItem = await client.api(`/drives/${driveId}/items/${item.id}/listItem/fields`).get();
      
      const status = getValueFromPath(listItem, 'AssessmentStatus');
      
      if (status === 'approved') return ASSESSMENT_STATUSES.APPROVED;
      if (status === 'rejected') return ASSESSMENT_STATUSES.REJECTED;
      if (status === 'needs_revision') return ASSESSMENT_STATUSES.NEEDS_REVISION;
      
      return ASSESSMENT_STATUSES.PENDING;
    } catch (error) {
      console.warn(`Failed to get assessment status for item ${item.id}:`, error);
      return ASSESSMENT_STATUSES.PENDING;
    }
  };

  const getValueFromPath = (obj: any, path: string): any => {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : null;
    }, obj);
  };

  const isEvidenceFile = (item: any): boolean => {
    if (!item.file) return false;
    
    const fileName = item.name.toLowerCase();
    const evidenceExtensions = [
      '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff',
      '.pdf', '.doc', '.docx', '.xls', '.xlsx',
      '.ppt', '.pptx', '.mp4', '.mov', '.avi', '.wmv',
      '.mp3', '.wav', '.txt', '.rtf'
    ];
    
    return evidenceExtensions.some(ext => fileName.endsWith(ext));
  };

  const getItemsFromPath = async (siteId: string, itemPath: string, spService: SharePointService): Promise<any[]> => {
    try {
      const client = spService['client'];
      if (!client) return [];

      const driveId = await spService['getDriveId']();
      const items = await client.api(`/drives/${driveId}/root:${itemPath}:/children`).get();
      
      return items.value || [];
    } catch (error) {
      console.warn(`Failed to get items from path ${itemPath}:`, error);
      return [];
    }
  };

  const extractUnitCode = (fileName: string): string => {
    const patterns = [
      /netp3[_-]?(\d{2})/i,
      /unit[_-]?(\d{2})/i,
      /(\d{2})/i
    ];
    
    for (const pattern of patterns) {
      const match = fileName.match(pattern);
      if (match) {
        return match[1];
      }
    }
    
    return '';
  };

  const extractCriteriaCode = (fileName: string): string => {
    const patterns = [
      /(\d+\.\d+[a-z]?)/i,
      /criteria[_-]?(\d+)/i,
      /(\d+[a-z]?)/i
    ];
    
    for (const pattern of patterns) {
      const match = fileName.match(pattern);
      if (match) {
        return match[1];
      }
    }
    
    return '';
  };

  const handleEvidenceClick = (evidence: PendingEvidence) => {
    // Navigate to evidence review page
    router.push({
      pathname: '/assessor-evidence-review',
      query: {
        evidenceId: evidence.id,
        candidateName: evidence.candidateName,
        unitCode: extractUnitCode(evidence.name),
        criteriaCode: extractCriteriaCode(evidence.name)
      }
    });
  };

  const handleCandidateClick = async (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setActiveTab('evidence-queue');
    
    // Load evidence for this specific candidate
    try {
      const spService = SharePointService.getInstance();
      const evidence = await fetchPendingEvidenceFromSite(candidate.siteId, candidate.name, spService);
      setPendingEvidence(evidence);
    } catch (error) {
      console.error('Failed to load candidate evidence:', error);
    }
  };

  if (loading) return <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
      <p className="text-lg">Loading authentication...</p>
    </div>
  </div>;

  if (msalError) return <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
    <div className="text-center max-w-lg mx-auto px-4">
      <div className="text-red-500 text-xl mb-4">Authentication Error</div>
      <p className="text-gray-400">{String(msalError)}</p>
    </div>
  </div>;

  if (!account) return <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
    <div className="text-center">
      <p className="text-lg">Signing in...</p>
    </div>
  </div>;

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="max-w-4xl mx-auto px-4 py-8 pb-safe">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Assessor Dashboard</h1>
          <button
            onClick={refreshData}
            disabled={isLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {error && (
          <div className="bg-red-900 text-white p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'dashboard'
                ? 'bg-blue-600 text-white'
                : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('evidence-queue')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'evidence-queue'
                ? 'bg-blue-600 text-white'
                : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
            }`}
          >
            Evidence Queue ({pendingEvidence.length})
          </button>
        </div>

        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {candidates.map((candidate) => (
                <div
                  key={candidate.id}
                  onClick={() => handleCandidateClick(candidate)}
                  className="bg-neutral-900 rounded-xl p-6 cursor-pointer hover:bg-neutral-800 transition"
                >
                  <h3 className="text-lg font-semibold mb-2">{candidate.name}</h3>
                  <div className="text-sm text-gray-400 space-y-1">
                    <p>Pending Evidence: {candidate.pendingEvidence}</p>
                    <p>Total Evidence: {candidate.totalEvidence}</p>
                    {candidate.lastActivity && (
                      <p>Last Activity: {candidate.lastActivity.toLocaleDateString()}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'evidence-queue' && (
          <div className="space-y-4">
            {pendingEvidence.map((evidence) => (
              <div
                key={evidence.id}
                onClick={() => handleEvidenceClick(evidence)}
                className="bg-neutral-900 rounded-xl p-4 cursor-pointer hover:bg-neutral-800 transition"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{evidence.name}</h3>
                    <p className="text-sm text-gray-400">{evidence.candidateName}</p>
                    <p className="text-sm text-gray-400">
                      Submitted: {evidence.dateSubmitted.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block bg-yellow-600 text-white px-2 py-1 rounded text-xs">
                      Pending Review
                    </span>
                  </div>
                </div>
              </div>
            ))}
            
            {pendingEvidence.length === 0 && (
              <div className="text-center text-gray-400 py-8">
                No pending evidence found.
              </div>
            )}
          </div>
        )}
      </div>
      
      <BottomNavigation />
    </div>
  );
}

// Export as dynamic component with SSR disabled
export default dynamic(() => Promise.resolve(AssessorReviewClient), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
      <div className="text-center">
        <p className="text-lg">Loading...</p>
      </div>
    </div>
  )
}); 