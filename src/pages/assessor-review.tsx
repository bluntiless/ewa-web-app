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

export default function AssessorDashboard() {
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
    try {
      setIsLoading(true);
      setError(null);

      // Check session cache first
      const sessionData = getSessionCache();
      if (sessionData && (Date.now() - sessionData.timestamp) < SESSION_CACHE_DURATION) {
        console.log('💾 Using session cached dashboard data');
        setCandidates(sessionData.candidates);
        setPendingEvidence(sessionData.pendingEvidence);
        setIsLoading(false);
        return;
      }

      console.log('🔄 Session cache expired or missing, loading fresh data...');
      
      const spService = SharePointService.getInstance();
      
      // Test authentication and basic access
      await spService.authenticate();
      console.log('AssessorDashboard: Authentication successful, testing basic access...');
      
      const testResponse = await spService['client']?.api('/me').get();
      if (testResponse) {
        console.log('AssessorDashboard: Basic access test successful');
      }
      
      console.log('AssessorDashboard: Authentication successful, loading data...');
      
      // Load candidates first
      const discoveredCandidates = await loadCandidates();
      console.log('📊 Discovered candidates:', discoveredCandidates.length);
      
      // Then load pending evidence for each candidate
      const allPendingEvidence: PendingEvidence[] = [];
      const candidatesWithEvidence: Candidate[] = [];
      
      // Process candidates in smaller batches for better performance
      const batchSize = 3;
      for (let i = 0; i < discoveredCandidates.length; i += batchSize) {
        const batch = discoveredCandidates.slice(i, i + batchSize);
        
        const batchResults = await Promise.all(
          batch.map(async (candidate) => {
            console.log(`🔍 Scanning evidence for candidate: ${candidate.name} (${i + 1}/${discoveredCandidates.length})`);
            
            try {
              const candidateEvidence = await scanCommonEvidenceStructures(candidate.siteId, candidate.name, spService);
              console.log(`✅ Found ${candidateEvidence.length} pending evidence items for ${candidate.name}`);
              
              return {
                candidate: {
                  ...candidate,
                  pendingEvidence: candidateEvidence.length,
                  totalEvidence: candidateEvidence.length
                },
                evidence: candidateEvidence
              };
            } catch (error) {
              console.warn(`⚠️ Failed to scan evidence for ${candidate.name}:`, error);
              
              return {
                candidate: {
                  ...candidate,
                  pendingEvidence: 0,
                  totalEvidence: 0
                },
                evidence: []
              };
            }
          })
        );
        
        // Process batch results
        batchResults.forEach(result => {
          candidatesWithEvidence.push(result.candidate);
          allPendingEvidence.push(...result.evidence);
        });
        
        // Update UI progressively
        setCandidates([...candidatesWithEvidence]);
        setPendingEvidence([...allPendingEvidence]);
        
        console.log(`📊 Batch ${Math.ceil((i + 1) / batchSize)} complete. Total evidence: ${allPendingEvidence.length}`);
      }
      
      console.log('📊 Total evidence found across all candidates:', allPendingEvidence.length);
      
      // Save to session cache
      const sessionCacheData = {
        candidates: candidatesWithEvidence,
        pendingEvidence: allPendingEvidence,
        timestamp: Date.now()
      };
      setSessionCache(sessionCacheData);
      
      setCandidates(candidatesWithEvidence);
      setPendingEvidence(allPendingEvidence);
      setIsLoading(false);
    } catch (error) {
      console.error('AssessorDashboard: Failed to load data:', error);
      setError('Failed to load dashboard data. Please try again.');
      setIsLoading(false);
    }
  };

  const refreshData = () => {
    // Clear session cache and reload
    sessionStorage.removeItem('assessor-dashboard-data');
    loadDataWithCache();
  };

  const loadCandidates = async (): Promise<Candidate[]> => {
    try {
      const spService = SharePointService.getInstance();
      
      console.log('AssessorDashboard: Starting candidate discovery using iOS app approach...');
      
      // Approach 1: Search for individual candidate sites across the tenant
      let allCandidates: Candidate[] = [];
      
      try {
        console.log('AssessorDashboard: Searching for individual candidate sites across the tenant...');
        
        // Get all sites in the tenant
        const sitesResponse = await spService['client']?.api('/sites').get();
        console.log('AssessorDashboard: Found', sitesResponse?.value?.length || 0, 'total sites in tenant');
        
        if (sitesResponse?.value) {
          for (const site of sitesResponse.value) {
            console.log('🔍 Checking site:', site.displayName, '(URL:', site.webUrl + ')');
            
            if (isCandidateSite(site.displayName, site.webUrl)) {
              console.log('✅ Found individual candidate site:', site.displayName);
              
              const candidate: Candidate = {
                id: site.id,
                name: site.displayName,
                siteId: site.id,
                siteUrl: site.webUrl,
                pendingEvidence: 0, // Will be calculated separately
                totalEvidence: 0,
                lastActivity: new Date(site.lastModifiedDateTime || Date.now())
              };
              
              allCandidates.push(candidate);
              console.log('✅ Added individual candidate site:', site.displayName);
            }
          }
        }
      } catch (error) {
        console.warn('AssessorDashboard: Failed to fetch sites:', error);
      }
      
      // Approach 1.2: Try getAllSites endpoint for more comprehensive site discovery
      try {
        console.log('AssessorDashboard: Searching for all sites using getAllSites endpoint...');
        
        const getAllSitesResponse = await spService['client']?.api('/getAllSites').get();
        console.log('AssessorDashboard: Found', getAllSitesResponse?.value?.length || 0, 'total sites via getAllSites');
        
        if (getAllSitesResponse?.value) {
          for (const site of getAllSitesResponse.value) {
            console.log('AssessorDashboard: Checking getAllSites site:', site.displayName, 'URL:', site.webUrl);
            
            if (isCandidateSite(site.displayName, site.webUrl)) {
              console.log('✅ Found candidate site via getAllSites:', site.displayName);
              
              const siteAsCandidate: Candidate = {
                id: site.id,
                name: site.displayName,
                siteId: site.id,
                siteUrl: site.webUrl,
                pendingEvidence: 0,
                totalEvidence: 0,
                lastActivity: new Date(site.lastModifiedDateTime || Date.now())
              };
              
              allCandidates.push(siteAsCandidate);
              console.log('✅ Added candidate site via getAllSites:', site.displayName);
            }
          }
        }
      } catch (error) {
        console.warn('AssessorDashboard: Failed to fetch getAllSites:', error);
      }
      
      // Approach 1.5: Try Microsoft Graph search API for sites
      try {
        console.log('AssessorDashboard: Searching for candidate sites using Microsoft Graph search API...');
        
        const searchBody = {
          requests: [{
            entityTypes: ['site'],
            query: {
              queryString: 'candidate OR evidence OR portfolio OR nvq OR qualification OR ewa OR group OR site'
            },
            from: 0,
            size: 100
          }]
        };
        
        const searchResponse = await spService['client']?.api('/search/query').post(searchBody);
        console.log('AssessorDashboard: Search API returned results');
        
        if (searchResponse?.value) {
          for (const siteData of searchResponse.value) {
            if (siteData.hitsContainers) {
              for (const container of siteData.hitsContainers) {
                if (container.hits) {
                  for (const hit of container.hits) {
                    if (hit.resource) {
                      const resource = hit.resource;
                      const displayName = resource.displayName;
                      const webUrl = resource.webUrl;
                      
                      console.log('AssessorDashboard: Search found site:', displayName, 'URL:', webUrl);
                      
                      if (isCandidateSite(displayName, webUrl)) {
                        const siteAsCandidate: Candidate = {
                          id: resource.id || crypto.randomUUID(),
                          name: displayName,
                          siteId: resource.id || crypto.randomUUID(),
                          siteUrl: webUrl,
                          pendingEvidence: 0,
                          totalEvidence: 0,
                          lastActivity: new Date()
                        };
                        
                        allCandidates.push(siteAsCandidate);
                        console.log('✅ Added candidate site from search:', displayName);
                      }
                    }
                  }
                }
              }
            }
          }
        }
      } catch (error) {
        console.warn('AssessorDashboard: Failed to search sites:', error);
      }
      
      // Approach 2: Search for subsites within the main site
      try {
        console.log('AssessorDashboard: Searching for subsites within the main site...');
        
        const subsitesResponse = await spService['client']?.api('/sites/root/sites').get();
        console.log('AssessorDashboard: Found', subsitesResponse?.value?.length || 0, 'subsites');
        
        if (subsitesResponse?.value) {
          for (const subsite of subsitesResponse.value) {
            console.log('AssessorDashboard: Checking subsite:', subsite.displayName, 'URL:', subsite.webUrl);
            
            if (isCandidateSite(subsite.displayName, subsite.webUrl)) {
              console.log('✅ Found candidate subsite:', subsite.displayName);
              
              const subsiteAsCandidate: Candidate = {
                id: subsite.id,
                name: subsite.displayName,
                siteId: subsite.id,
                siteUrl: subsite.webUrl,
                pendingEvidence: 0,
                totalEvidence: 0,
                lastActivity: new Date(subsite.lastModifiedDateTime || Date.now())
              };
              
              allCandidates.push(subsiteAsCandidate);
              console.log('✅ Added candidate subsite:', subsite.displayName);
            }
          }
        }
      } catch (error) {
        console.warn('AssessorDashboard: Failed to fetch subsites:', error);
      }
      
      // Remove duplicates based on site URL
      const uniqueCandidates = allCandidates.filter((candidate, index, self) => 
        index === self.findIndex(c => c.siteUrl === candidate.siteUrl)
      );
      
      console.log('AssessorDashboard: Final unique candidates found:', uniqueCandidates.length);
      
      // If no candidates found from direct site discovery, try the evidence-based approach
      if (uniqueCandidates.length === 0) {
        console.log('AssessorDashboard: No candidates found from direct site discovery, trying evidence-based approach...');
        
        const assessmentService = AssessmentService.getInstance();
        const allEvidence = await assessmentService.getEvidenceForCriteria('ALL', 'ALL');
        
        console.log('AssessorDashboard: Total evidence found:', allEvidence.length);
        
        if (allEvidence.length === 0) {
          console.log('AssessorDashboard: No evidence found, creating default candidate');
          const defaultCandidate = {
            id: 'default-candidate',
            name: 'Default Candidate',
            siteId: 'default-site',
            siteUrl: 'https://wrightspark625.sharepoint.com/sites/default',
            pendingEvidence: 0,
            totalEvidence: 0,
            lastActivity: new Date()
          };
          return [defaultCandidate];
        }
        
        // Group evidence by site to identify candidates
        const evidenceGroups = new Map<string, EvidenceMetadata[]>();
        
        allEvidence.forEach(ev => {
          if (ev.webUrl) {
            // Extract site name from URL
            let siteName = 'Unknown Site';
            try {
              const url = new URL(ev.webUrl);
              const pathParts = url.pathname.split('/');
              const siteIndex = pathParts.findIndex(part => part === 'sites');
              if (siteIndex !== -1 && pathParts[siteIndex + 1]) {
                siteName = pathParts[siteIndex + 1]
                  .replace(/-/g, ' ')
                  .replace(/_/g, ' ')
                  .replace(/\b\w/g, l => l.toUpperCase());
              }
            } catch {
              siteName = 'Unknown Site';
            }
            
            if (!evidenceGroups.has(siteName)) {
              evidenceGroups.set(siteName, []);
            }
            evidenceGroups.get(siteName)!.push(ev);
          }
        });
        
        console.log('AssessorDashboard: Evidence groups:', Array.from(evidenceGroups.entries()));
        
        const candidatesFromEvidence = Array.from(evidenceGroups.entries()).map(([siteName, evidence]) => ({
          id: `evidence-${siteName}`,
          name: siteName,
          siteId: `evidence-${siteName}`,
          siteUrl: `https://wrightspark625.sharepoint.com/sites/${siteName.toLowerCase().replace(/\s+/g, '-')}`,
          pendingEvidence: evidence.filter(ev => ev.assessmentStatus === ASSESSMENT_STATUSES.PENDING).length,
          totalEvidence: evidence.length,
          lastActivity: new Date(Math.max(...evidence.map(ev => new Date(ev.createdDateTime).getTime())))
        }));
        
        console.log('AssessorDashboard: Candidates from evidence:', candidatesFromEvidence);
        return candidatesFromEvidence;
    } else {
        // Calculate pending evidence counts for candidates found from direct site access
        const candidatesWithPendingCounts = await Promise.all(
          uniqueCandidates.map(async (candidate) => {
            try {
              console.log(`AssessorDashboard: Calculating pending evidence for candidate:`, candidate.name);
              
              const assessmentService = AssessmentService.getInstance();
              const allEvidence = await assessmentService.getEvidenceForCriteria('ALL', 'ALL');
              
              console.log(`AssessorDashboard: Total evidence found:`, allEvidence.length);
              
              // Filter evidence from this candidate's site
              const candidateEvidence = allEvidence.filter(ev => {
                const isFromCandidate = ev.webUrl && ev.webUrl.includes(candidate.siteUrl.split('/sites/')[1]);
                console.log(`AssessorDashboard: Evidence ${ev.name} from candidate ${candidate.name}:`, isFromCandidate);
                return isFromCandidate;
              });
              
              const pendingEvidence = candidateEvidence.filter(ev => 
                ev.assessmentStatus === ASSESSMENT_STATUSES.PENDING
              );
              
              console.log(`AssessorDashboard: Candidate ${candidate.name} has ${candidateEvidence.length} total evidence and ${pendingEvidence.length} pending`);
              
              return {
                ...candidate,
                pendingEvidence: pendingEvidence.length,
                totalEvidence: candidateEvidence.length
              };
            } catch (error) {
              console.warn('AssessorDashboard: Error calculating pending evidence for', candidate.name, error);
              return candidate;
            }
          })
        );
        
        console.log('AssessorDashboard: Final candidates with pending counts:', candidatesWithPendingCounts);
        return candidatesWithPendingCounts;
      }
      
    } catch (err) {
      console.error('Failed to load candidates:', err);
      return [];
    }
  };
  
  // iOS app's intelligent candidate detection logic
  const isCandidateSite = (siteName: string, siteUrl: string): boolean => {
    const name = siteName.toLowerCase();
    const url = siteUrl.toLowerCase();
    
    // Skip system sites but NOT the main EWANVQ site (since candidates are within it)
    if (url.includes('communication') || 
        url.includes('team') || 
        url.includes('group') ||
        url.includes('system')) {
      return false;
    }
    
    // Check if it's a candidate site by URL pattern
    // Candidate sites should be at: https://wrightspark625.sharepoint.com/sites/[CandidateName]
    if (url.includes('wrightspark625.sharepoint.com/sites/')) {
      // Extract the site name from the URL
      const siteNameFromUrl = url.split('/sites/')[1];
      if (siteNameFromUrl) {
        const cleanSiteName = siteNameFromUrl.replace('wrightspark625.sharepoint.com', '')
          .replace('/', '')
          .toLowerCase();
        
        // Skip if it's empty or contains system keywords
        if (cleanSiteName && 
            !cleanSiteName.includes('communication') &&
            !cleanSiteName.includes('team') &&
            !cleanSiteName.includes('group') &&
            !cleanSiteName.includes('system') &&
            !cleanSiteName.includes('shared')) {
          console.log('✅ Found candidate site by URL pattern:', siteName, '(', cleanSiteName, ')');
          return true;
        }
      }
    }
    
    // Check for candidate-related keywords in the site name
    const candidateKeywords = [
      'candidate', 'evidence', 'portfolio', 'nvq', 'qualification', 'test', 'trial', 'ewa'
    ];
    
    for (const keyword of candidateKeywords) {
      if (name.includes(keyword)) {
        console.log('✅ Found candidate site by keyword:', siteName, '(contains:', keyword, ')');
        return true;
      }
    }
    
    // Check for specific candidate names from the screenshot (temporary for testing)
    const specificCandidateNames = [
      'ashley clark', 'cameron tait', 'lewis slater', 'edmund botchway', 
      'jonny ringo', 'wayne wright', 'trial candidate', 'ewademo1'
    ];
    
    for (const candidateName of specificCandidateNames) {
      if (name.includes(candidateName)) {
        console.log('✅ Found candidate site by specific name:', siteName, '(matches:', candidateName, ')');
        return true;
      }
    }
    
    // Check if it's a person's name (contains spaces and doesn't look like a system site)
    const words = name.split(' ');
    if (words.length >= 2 && !name.includes('communication') && !name.includes('team') && !name.includes('group')) {
      console.log('✅ Found candidate site by name pattern:', siteName);
      return true;
    }
    
    // Check if it looks like a candidate name (not a system site)
    const systemKeywords = ['communication', 'team', 'group', 'system', 'shared', 'document'];
    const hasSystemKeyword = systemKeywords.some(keyword => name.includes(keyword));
    
    if (!hasSystemKeyword && name.length > 3) {
      console.log('✅ Found candidate site by exclusion:', siteName);
      return true;
    }
    
    // NEW: Intelligent candidate detection based on site patterns
    // Look for sites that are likely individual candidate sites
    if (url.includes('wrightspark625.sharepoint.com/sites/')) {
      // Extract the site name from the URL path
      const siteNameFromUrl = url.split('/sites/')[1];
      if (siteNameFromUrl) {
        const cleanSiteName = siteNameFromUrl.replace('wrightspark625.sharepoint.com', '')
          .replace('/', '')
          .toLowerCase();
        
        // Skip if it's empty or contains system keywords
        if (cleanSiteName && 
            !cleanSiteName.includes('communication') &&
            !cleanSiteName.includes('team') &&
            !cleanSiteName.includes('group') &&
            !cleanSiteName.includes('system') &&
            !cleanSiteName.includes('shared') &&
            !cleanSiteName.includes('ewanvqlevel3electrotechnical')) {
          
          // Check if it looks like a person's name (contains letters and possibly spaces)
          const nameWords = cleanSiteName.split(/[^a-zA-Z0-9]/);
          const filteredWords = nameWords.filter(word => word.length > 0);
          
          // If it has multiple words or looks like a name, it's likely a candidate
          if (filteredWords.length >= 2 || (cleanSiteName.length > 3 && !cleanSiteName.includes('.'))) {
            console.log('✅ Found candidate site by intelligent URL pattern:', siteName, '(', cleanSiteName, ')');
            return true;
          }
        }
      }
    }
    
    // Check for sites that are not the main EWANVQ site but are within the same tenant
    if (url.includes('wrightspark625.sharepoint.com') && 
        !url.includes('ewanvqlevel3electrotechnical') &&
        !url.includes('communication') &&
        !url.includes('team') &&
        !url.includes('group') &&
        !url.includes('system')) {
      
      // If it's a separate site in the tenant, it's likely a candidate
      console.log('✅ Found candidate site by tenant pattern:', siteName);
      return true;
    }
    
    // Check if it contains EWA unit numbers
    const ewaUnits = ['netp3', '18ed3'];
    for (const unit of ewaUnits) {
      if (name.includes(unit)) {
        console.log('✅ Found candidate site by EWA unit:', siteName, '(contains:', unit, ')');
        return true;
      }
    }
    
    return false;
  };

  const loadPendingEvidence = async () => {
    try {
      const spService = SharePointService.getInstance();
      
      console.log('AssessorDashboard: Starting comprehensive scan for pending evidence...');
      
      let allPendingEvidence: PendingEvidence[] = [];
      
      // Use the same comprehensive approach as iOS app
      console.log('AssessorDashboard: Using iOS app-style comprehensive site discovery...');
      
      // Approach 1: Search for individual candidate sites across the tenant
      try {
        console.log('AssessorDashboard: Searching for individual candidate sites across the tenant...');
        
        const sitesResponse = await spService['client']?.api('/sites').get();
        console.log('AssessorDashboard: Found', sitesResponse?.value?.length || 0, 'total sites in tenant');
        
        if (sitesResponse?.value) {
          for (const site of sitesResponse.value) {
            console.log('AssessorDashboard: Checking site:', site.displayName, 'URL:', site.webUrl);
            
            if (isCandidateSite(site.displayName, site.webUrl)) {
              console.log('✅ Found individual candidate site:', site.displayName);
              
              try {
                const siteEvidence = await fetchPendingEvidenceFromSite(
                  site.id,
                  site.displayName,
                  spService
                );
                
                allPendingEvidence.push(...siteEvidence);
                console.log('✅ Found', siteEvidence.length, 'pending evidence items in', site.displayName);
                
              } catch (error) {
                console.warn('AssessorDashboard: Failed to fetch evidence from', site.displayName, error);
                continue;
              }
            }
          }
        }
      } catch (error) {
        console.warn('AssessorDashboard: Failed to fetch sites:', error);
      }
      
      // Approach 2: Try getAllSites endpoint for more comprehensive site discovery
      try {
        console.log('AssessorDashboard: Searching for all sites using getAllSites endpoint...');
        
        const getAllSitesResponse = await spService['client']?.api('/getAllSites').get();
        console.log('AssessorDashboard: Found', getAllSitesResponse?.value?.length || 0, 'total sites via getAllSites');
        
        if (getAllSitesResponse?.value) {
          for (const site of getAllSitesResponse.value) {
            console.log('AssessorDashboard: Checking getAllSites site:', site.displayName, 'URL:', site.webUrl);
            
            if (isCandidateSite(site.displayName, site.webUrl)) {
              console.log('✅ Found candidate site via getAllSites:', site.displayName);
              
              try {
                const siteEvidence = await fetchPendingEvidenceFromSite(
                  site.id,
                  site.displayName,
                  spService
                );
                
                allPendingEvidence.push(...siteEvidence);
                console.log('✅ Found', siteEvidence.length, 'pending evidence items in', site.displayName);
                
              } catch (error) {
                console.warn('AssessorDashboard: Failed to fetch evidence from', site.displayName, error);
                continue;
              }
            }
          }
        }
      } catch (error) {
        console.warn('AssessorDashboard: Failed to fetch getAllSites:', error);
      }
      
      // Approach 3: Try Microsoft Graph search API for sites
      try {
        console.log('AssessorDashboard: Searching for candidate sites using Microsoft Graph search API...');
        
        const searchBody = {
          requests: [{
            entityTypes: ['site'],
            query: {
              queryString: 'candidate OR evidence OR portfolio OR nvq OR qualification OR ewa OR group OR site'
            },
            from: 0,
            size: 100
          }]
        };
        
        const searchResponse = await spService['client']?.api('/search/query').post(searchBody);
        console.log('AssessorDashboard: Search API returned results');
        
        if (searchResponse?.value) {
          for (const siteData of searchResponse.value) {
            if (siteData.hitsContainers) {
              for (const container of siteData.hitsContainers) {
                if (container.hits) {
                  for (const hit of container.hits) {
                    if (hit.resource) {
                      const resource = hit.resource;
                      const displayName = resource.displayName;
                      const webUrl = resource.webUrl;
                      
                      console.log('AssessorDashboard: Search found site:', displayName, 'URL:', webUrl);
                      
                      if (isCandidateSite(displayName, webUrl)) {
                        const siteId = resource.id || crypto.randomUUID();
                        console.log('✅ Found candidate site from search:', displayName);
                        
                        try {
                          const siteEvidence = await fetchPendingEvidenceFromSite(
                            siteId,
                            displayName,
                            spService
                          );
                          
                          allPendingEvidence.push(...siteEvidence);
                          console.log('✅ Found', siteEvidence.length, 'pending evidence items in', displayName);
                          
                        } catch (error) {
                          console.warn('AssessorDashboard: Failed to fetch evidence from', displayName, error);
                          continue;
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      } catch (error) {
        console.warn('AssessorDashboard: Failed to search sites:', error);
      }
      
      // Approach 4: Search for subsites within the main site
      try {
        console.log('AssessorDashboard: Searching for subsites within the main site...');
        
        const subsitesResponse = await spService['client']?.api('/sites/root/sites').get();
        console.log('AssessorDashboard: Found', subsitesResponse?.value?.length || 0, 'subsites');
        
        if (subsitesResponse?.value) {
          for (const subsite of subsitesResponse.value) {
            console.log('AssessorDashboard: Checking subsite:', subsite.displayName, 'URL:', subsite.webUrl);
            
            if (isCandidateSite(subsite.displayName, subsite.webUrl)) {
              console.log('✅ Found candidate subsite:', subsite.displayName);
              
              try {
                const siteEvidence = await fetchPendingEvidenceFromSite(
                  subsite.id,
                  subsite.displayName,
                  spService
                );
                
                allPendingEvidence.push(...siteEvidence);
                console.log('✅ Found', siteEvidence.length, 'pending evidence items in', subsite.displayName);
                
              } catch (error) {
                console.warn('AssessorDashboard: Failed to fetch evidence from', subsite.displayName, error);
                continue;
              }
            }
          }
        }
      } catch (error) {
        console.warn('AssessorDashboard: Failed to fetch subsites:', error);
      }
      
      console.log('📊 Total pending evidence found:', allPendingEvidence.length);
      
      // If still no evidence found, try the main site as fallback
      if (allPendingEvidence.length === 0) {
        console.log('⚠️ No evidence found in candidate sites, trying main site as fallback...');
        
        try {
          const accessibleSites = await spService.getAllAccessibleSites();
          if (accessibleSites.length > 0) {
            const mainSiteId = accessibleSites[0].id;
            const mainSiteEvidence = await fetchPendingEvidenceFromSite(
              mainSiteId,
              'Main Site',
              spService
            );
          
          allPendingEvidence.push(...mainSiteEvidence);
          console.log('✅ Found', mainSiteEvidence.length, 'pending evidence items in main site');
        }
        } catch (error) {
          console.warn('AssessorDashboard: Failed to fetch evidence from main site:', error);
        }
      }
      
      // If still no evidence found, return empty array instead of test items
      if (allPendingEvidence.length === 0) {
        console.log('⚠️ No pending evidence found in any candidate sites');
        console.log('💡 This could mean:');
        console.log('   - All evidence has been assessed');
        console.log('   - No candidates have uploaded evidence yet');
        console.log('   - Evidence is in different locations than expected');
      }
      
      setPendingEvidence(allPendingEvidence);
      
    } catch (err) {
      console.error('Failed to load pending evidence:', err);
      setError(err instanceof Error ? err.message : 'Failed to load pending evidence');
    }
  };
  
  // iOS app's comprehensive evidence fetching from a single site
  const fetchPendingEvidenceFromSite = async (siteId: string, siteName: string, spService: SharePointService): Promise<PendingEvidence[]> => {
    const pendingEvidence: PendingEvidence[] = [];
    
    console.log('🔍 Scanning site:', siteName, '(ID:', siteId, ')');
    
    // First, try to scan common evidence folder structures
    console.log('🔍 Looking for common evidence folder structures...');
    const commonStructureEvidence = await scanCommonEvidenceStructures(
      siteId,
      siteName,
      spService
    );
    pendingEvidence.push(...commonStructureEvidence);
    
    // Then do a comprehensive scan of all items
    console.log('🔍 Performing comprehensive scan of all items...');
    const allItems = await getAllItemsFromSite(siteId, spService);
    
    console.log('📁 Found', allItems.length, 'total items in', siteName);
    
    // Specifically look for NETP3 unit files
    console.log('🔍 Specifically scanning for NETP3 unit files...');
    for (const item of allItems) {
      if (isNETP3UnitFile(item)) {
        console.log('🔍 Found NETP3 unit file:', item.name);
        
        // Check if this item needs assessment
        const assessmentStatus = await getAssessmentStatus(item, siteId, spService);
        
        console.log('📊 Assessment status for', item.name + ':', assessmentStatus);
        
        if (assessmentStatus === ASSESSMENT_STATUSES.PENDING) {
          const pendingItem: PendingEvidence = {
            id: item.id,
            name: item.name,
            candidateName: siteName,
            candidateSiteUrl: `https://wrightspark625.sharepoint.com/sites/${siteName}`,
            dateSubmitted: new Date(item.lastModifiedDateTime || Date.now()),
            status: assessmentStatus,
            description: item.description || ''
          };
          
          pendingEvidence.push(pendingItem);
          console.log('✅ Added pending NETP3 unit evidence:', item.name);
        }
      }
    }
    
    // Also check for other evidence items
    for (const item of allItems) {
      if (isNETP3EvidenceItem(item, siteName) && !isNETP3UnitFile(item)) {
        console.log('🔍 Checking other evidence item:', item.name);
        
        // Check if this item needs assessment
        const assessmentStatus = await getAssessmentStatus(item, siteId, spService);
        
        console.log('📊 Assessment status for', item.name + ':', assessmentStatus);
        
        if (assessmentStatus === ASSESSMENT_STATUSES.PENDING) {
          const pendingItem: PendingEvidence = {
            id: item.id,
            name: item.name,
            candidateName: siteName,
            candidateSiteUrl: `https://wrightspark625.sharepoint.com/sites/${siteName}`,
            dateSubmitted: new Date(item.lastModifiedDateTime || Date.now()),
            status: assessmentStatus,
            description: item.description || ''
          };
          
          pendingEvidence.push(pendingItem);
          console.log('✅ Added pending evidence:', item.name);
        }
      }
    }
    
    console.log('📊 Found', pendingEvidence.length, 'pending NETP3 evidence items in', siteName);
    return pendingEvidence;
  };
  
  // iOS app's common evidence structure scanning
  const scanCommonEvidenceStructures = async (siteId: string, siteName: string, spService: SharePointService): Promise<PendingEvidence[]> => {
    // Check cache first
    const cacheKey = `candidate-${siteId}`;
    const cached = scanCache[cacheKey];
    if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
      console.log(`💾 Using cached results for candidate: ${siteName} (${cached.evidence.length} items)`);
      return cached.evidence;
    }

    const pendingEvidence: PendingEvidence[] = [];
    console.log('🔍 Scanning evidence for site:', siteName);
    
    // Try multiple base paths in order of likelihood
    const basePaths = [
      'Documents/Evidence',
      'Evidence',
      'Shared Documents/Evidence',
      'Documents',
      'Shared Documents'
    ];
    
    // Scan with more generous depth for better coverage
    for (const basePath of basePaths) {
      try {
        console.log(`🔍 Trying base path: ${basePath}`);
        const items = await getEvidenceFromPath(siteId, basePath, spService, 3, 0); // Increased to 3 levels
        
        if (items.length > 0) {
          pendingEvidence.push(...items);
          console.log(`✅ Found ${items.length} evidence items in ${basePath}`);
          // Continue checking other paths to get comprehensive results
        } else {
          console.log(`📭 No evidence found in ${basePath}`);
        }
      } catch (error) {
        console.warn(`⚠️ Could not scan base path ${basePath}:`, error);
      }
    }
    
    // Cache the results
    const newCache = {
      ...scanCache,
      [cacheKey]: {
        evidence: pendingEvidence,
        timestamp: Date.now()
      }
    };
    setScanCache(newCache);
    
    console.log(`📊 Total pending evidence found for ${siteName}: ${pendingEvidence.length}`);
    return pendingEvidence;
  };

  const getEvidenceFromPath = async (siteId: string, path: string, spService: SharePointService, maxDepth: number = 3, currentDepth: number = 0): Promise<PendingEvidence[]> => {
    try {
      // Check if we've reached max depth
      if (currentDepth >= maxDepth) {
        console.log(`📏 Max depth (${maxDepth}) reached for path: ${path}`);
        return [];
      }

      console.log(`🔍 Scanning path: ${path} (depth: ${currentDepth}/${maxDepth})`);
      
      // Check cache first
      const cacheKey = `${siteId}-${path}-${currentDepth}`;
      const cached = scanCache[cacheKey];
      if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
        console.log(`💾 Using cached results for ${path}`);
        return cached.evidence;
      }
      
      // Get items from the specific path
      const response = await spService['client']?.api(`/sites/${siteId}/drive/root:/${path}:/children`).get();
      
      if (!response?.value) {
        console.log(`📁 No items found in ${path}`);
        return [];
      }

      const pendingItems: PendingEvidence[] = [];
      console.log(`📁 Found ${response.value.length} items in ${path}`);
      
      // Process items with better error handling
      for (const item of response.value) {
        try {
          if (item.folder && currentDepth < maxDepth - 1) {
            // This is a folder - scan deeper
            const subPath = `${path}/${item.name}`;
            const subItems = await getEvidenceFromPath(siteId, subPath, spService, maxDepth, currentDepth + 1);
            pendingItems.push(...subItems);
            if (subItems.length > 0) {
              console.log(`✅ Found ${subItems.length} evidence items in subfolder: ${item.name}`);
            }
          } else if (!item.folder) {
            // This is a file - check if it's evidence
            if (isEvidenceFile(item)) {
              try {
                // Try to get assessment status with timeout
                const timeoutPromise = new Promise((_, reject) => 
                  setTimeout(() => reject(new Error('Timeout')), 2000)
                );
                
                const metadataPromise = spService['client']?.api(`/sites/${siteId}/drive/items/${item.id}/listItem/fields`).get();
                
                const listItemResponse = await Promise.race([metadataPromise, timeoutPromise]);
                
                const assessmentStatus = (listItemResponse as any)?.Assessment || 
                                       (listItemResponse as any)?.AssessmentStatus || 
                                       'Pending Assessment';

                const statusLower = assessmentStatus.toString().toLowerCase();
                if (statusLower.includes('pending') || statusLower.includes('submitted') || assessmentStatus === 'Pending Assessment') {
                  const evidenceItem: PendingEvidence = {
                    id: item.id,
                    name: item.name,
                    candidateName: extractCandidateName(siteId),
                    candidateSiteUrl: `https://wrightspark625.sharepoint.com/sites/${siteId}`,
                    dateSubmitted: new Date(item.createdDateTime),
                    status: ASSESSMENT_STATUSES.PENDING,
                    description: `Path: ${path}/${item.name}`
                  };
                  
                  pendingItems.push(evidenceItem);
                }
              } catch (error) {
                // If metadata fails, assume evidence file is pending
                const evidenceItem: PendingEvidence = {
                  id: item.id,
                  name: item.name,
                  candidateName: extractCandidateName(siteId),
                  candidateSiteUrl: `https://wrightspark625.sharepoint.com/sites/${siteId}`,
                  dateSubmitted: new Date(item.createdDateTime),
                  status: ASSESSMENT_STATUSES.PENDING,
                  description: `Path: ${path}/${item.name} | Status unknown`
                };
                
                pendingItems.push(evidenceItem);
              }
            }
          }
        } catch (error) {
          console.warn(`⚠️ Error processing item ${item.name}:`, error);
        }
      }
      
      // Cache the results
      const newCache = {
        ...scanCache,
        [cacheKey]: {
          evidence: pendingItems,
          timestamp: Date.now()
        }
      };
      setScanCache(newCache);
      
      return pendingItems;
    } catch (error) {
      console.warn(`⚠️ Error accessing path ${path}:`, error);
      return [];
    }
  };

  const extractCandidateName = (siteId: string): string => {
    // Create a mapping from site IDs to candidate names
    const siteIdToNameMap: { [key: string]: string } = {
      'wrightspark625.sharepoint.com,77f748ac-6618-4f8d-ae7b-1e927fad2fea,f7a8aba3-0493-4888-8d22-00685d8072ae': 'EWA NVQ Level 3 ElectroTechnical'
    };
    
    // Try the mapping first
    if (siteIdToNameMap[siteId]) {
      return siteIdToNameMap[siteId];
    }
    
    // Try to extract from URL patterns
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

  // iOS app's comprehensive item scanning
  const getAllItemsFromSite = async (siteId: string, spService: SharePointService): Promise<any[]> => {
    const allItems: any[] = [];
    
    console.log('🔍 Starting comprehensive scan of site:', siteId);
    
    // Start with root items
    const rootItems = await getItemsFromPath(siteId, 'root', spService);
    console.log('📁 Found', rootItems.length, 'root items');
    allItems.push(...rootItems);
    
    // Recursively scan folders with depth tracking
    const scannedFolders = new Set<string>();
    const maxDepth = 5; // Prevent infinite recursion
    
    const scanFolder = async (folderId: string, depth: number = 0): Promise<void> => {
      if (depth > maxDepth || scannedFolders.has(folderId)) {
        return;
      }
      
      scannedFolders.add(folderId);
      
      try {
        const folderItems = await spService['client']?.api(`/sites/${siteId}/drive/items/${folderId}/children`).get();
        
        if (folderItems?.value) {
          console.log('📁 Found', folderItems.value.length, 'items in folder at depth', depth);
          
          for (const item of folderItems.value) {
            allItems.push(item);
            
            // Recursively scan subfolders
            if (item.folder && depth < maxDepth) {
              await scanFolder(item.id, depth + 1);
            }
          }
        }
      } catch (error) {
        console.warn('⚠️ Could not scan folder:', folderId, '-', error);
      }
    };
    
    // Scan all root folders
    for (const item of rootItems) {
      if (item.folder) {
        await scanFolder(item.id, 1);
      }
    }
    
    console.log('📊 Total items found in comprehensive scan:', allItems.length);
    return allItems;
  };
  
  // iOS app's NETP3 unit file detection
  const isNETP3UnitFile = (item: any): boolean => {
    if (item.folder) return false; // Only check files, not folders
    
    const fileName = item.name.toLowerCase();
    
    // Check for NETP3 unit patterns
    const netp3Patterns = [
      'netp3_01', 'netp3_02', 'netp3_03', 'netp3_04', 'netp3_05', 'netp3_06', 'netp3_07',
      'netp3-01', 'netp3-02', 'netp3-03', 'netp3-04', 'netp3-05', 'netp3-06', 'netp3-07',
      'unit_01', 'unit_02', 'unit_03', 'unit_04', 'unit_05', 'unit_06', 'unit_07',
      'unit-01', 'unit-02', 'unit-03', 'unit-04', 'unit-05', 'unit-06', 'unit-07'
    ];
    
    for (const pattern of netp3Patterns) {
      if (fileName.includes(pattern)) {
        return true;
      }
    }
    
    // Check for evidence-related keywords
    const evidenceKeywords = ['evidence', 'portfolio', 'assessment', 'criteria'];
    for (const keyword of evidenceKeywords) {
      if (fileName.includes(keyword)) {
        return true;
      }
    }
    
    return false;
  };
  
  // iOS app's NETP3 evidence item detection
  const isNETP3EvidenceItem = (item: any, siteName: string): boolean => {
    if (item.folder) return false; // Only check files, not folders
    
    const fileName = item.name.toLowerCase();
    const siteNameLower = siteName.toLowerCase();
    
    // Check if it's a NETP3 unit file
    if (isNETP3UnitFile(item)) {
      return true;
    }
    
    // Check for evidence-related keywords
    const evidenceKeywords = ['evidence', 'portfolio', 'assessment', 'criteria', 'netp3', 'ewa'];
    for (const keyword of evidenceKeywords) {
      if (fileName.includes(keyword)) {
        return true;
      }
    }
    
    // Check if the site name contains candidate-related keywords
    const candidateKeywords = ['candidate', 'evidence', 'portfolio', 'nvq', 'qualification', 'test', 'trial', 'ewa'];
    for (const keyword of candidateKeywords) {
      if (siteNameLower.includes(keyword)) {
        return true;
      }
    }
    
    return false;
  };
  
  const getAssessmentStatus = async (item: any, siteId: string, spService: SharePointService): Promise<AssessmentStatus> => {
    try {
      const metadataResponse = await spService['client']?.api(`/sites/${siteId}/drive/items/${item.id}/listItem/fields`).get();
      
      // Check assessment status from metadata
      const status = metadataResponse?.AssessmentStatus || ASSESSMENT_STATUSES.PENDING;
      return status as AssessmentStatus;
    } catch (error: any) {
      console.warn('⚠️ Could not fetch assessment status for', item.name, '-', error);
      return ASSESSMENT_STATUSES.PENDING;
    }
  };
  
  // Helper function to get value from nested object path
  const getValueFromPath = (obj: any, path: string): any => {
    const components = path.split('.');
    let current = obj;
    
    for (const component of components) {
      if (current && typeof current === 'object' && component in current) {
        current = current[component];
      } else {
        return null;
      }
    }
    
    return current;
  };
  
  const isEvidenceFile = (item: any): boolean => {
    // Check if the item is a file (not a folder)
    if (!item.file) {
      return false;
    }

    // Check file name patterns that indicate evidence
    const evidencePatterns = [
      /evidence/i,
      /portfolio/i,
      /assessment/i,
      /NETP3/i,
      /\.pdf$/i,
      /\.doc$/i,
      /\.docx$/i,
      /\.jpg$/i,
      /\.jpeg$/i,
      /\.png$/i,
      /\.mp4$/i
    ];

    return evidencePatterns.some(pattern => pattern.test(item.name));
  };

  // Helper function to get items from a specific path
  const getItemsFromPath = async (siteId: string, itemPath: string, spService: SharePointService): Promise<any[]> => {
    try {
      // Use batch request to get drive and items in one call
      const batch = spService['client']?.api('$batch').post({
        requests: [
          {
            id: '1',
            method: 'GET',
            url: `/sites/${siteId}/drive`
          },
          {
            id: '2',
            method: 'GET',
            url: `/sites/${siteId}/drive/root:/${itemPath}:/children`
          }
        ]
      });

      const batchResponse = await batch;
      const [driveResponse, itemsResponse] = batchResponse.responses;

      if (driveResponse.status === 200) {
        console.log('📁 Found drive:', driveResponse.body.id);
      }

      if (itemsResponse.status === 200) {
        console.log('📁 Found', itemsResponse.body.value?.length || 0, 'items in path:', itemPath);
        return itemsResponse.body.value || [];
      } else if (itemsResponse.status === 404) {
        console.warn('⚠️ Path not found:', itemPath);
        return [];
      }

      return [];
    } catch (error: any) {
      console.warn('⚠️ Could not access path:', itemPath, '-', error);
      return [];
    }
  };
  
  // Helper functions to extract unit and criteria codes from filenames
  const extractUnitCode = (fileName: string): string => {
    const name = fileName.toLowerCase();
    
    // Look for NETP3 unit patterns
    const netp3Match = name.match(/netp3[_-]?(\d{2})/);
    if (netp3Match) {
      return `NETP3_${netp3Match[1]}`;
    }
    
    // Look for unit patterns
    const unitMatch = name.match(/unit[_-]?(\d{2})/);
    if (unitMatch) {
      return `UNIT_${unitMatch[1]}`;
    }
    
    return 'UNKNOWN';
  };
  
  const extractCriteriaCode = (fileName: string): string => {
    const name = fileName.toLowerCase();
    
    // Look for criteria patterns like 1_1, 2_1, 3_1a, etc.
    const criteriaMatch = name.match(/(\d+)[_-](\d+[a-z]?)/);
    if (criteriaMatch) {
      return `${criteriaMatch[1]}_${criteriaMatch[2]}`;
    }
    
    return 'UNKNOWN';
  };

  const handleEvidenceClick = (evidence: PendingEvidence) => {
    // Navigate to evidence review page with evidence details
    router.push({
      pathname: '/assessor-evidence-review',
      query: { 
        evidenceId: evidence.id,
        candidateName: evidence.candidateName,
        unitCode: evidence.dateSubmitted.toISOString(), // Assuming dateSubmitted is the uploadedDate
        criteriaCode: evidence.dateSubmitted.toISOString() // Assuming dateSubmitted is the uploadedDate
      }
    });
  };

  const handleCandidateClick = async (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    // Navigate to the candidate's evidence view with the correct site ID
    router.push(`/candidate-evidence/${encodeURIComponent(candidate.siteId)}`);
  };

  if (loading) return <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
      <p className="text-lg">Loading assessor dashboard...</p>
    </div>
  </div>;

  if (msalError) return <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
    <div className="text-center max-w-lg mx-auto px-4">
      <div className="text-red-500 text-xl mb-4">MSAL Authentication Error</div>
      <p className="text-gray-400 mb-4">{String(msalError)}</p>
      <button 
        onClick={() => window.location.reload()}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        Retry Authentication
      </button>
    </div>
  </div>;

  if (error) return <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
    <div className="text-center max-w-lg mx-auto px-4">
      <div className="text-red-500 text-xl mb-4">SharePoint Error</div>
      <p className="text-gray-400 mb-4">{error}</p>
      <button 
        onClick={() => window.location.reload()}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        Retry
      </button>
    </div>
  </div>;

  if (!account) return <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
      <p className="text-lg">Signing in to Microsoft...</p>
    </div>
  </div>;

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="max-w-6xl mx-auto px-4 py-8 pb-safe">
        <h1 className="text-3xl font-bold mb-8">Assessor Dashboard</h1>
        
        {/* Tab Navigation */}
        <div className="flex space-x-4 mb-6">
          <button
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'dashboard'
                ? 'bg-blue-600 text-white'
                : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
            }`}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'evidence-queue'
                ? 'bg-blue-600 text-white'
                : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
            }`}
            onClick={() => setActiveTab('evidence-queue')}
          >
            Evidence Queue ({pendingEvidence.length})
          </button>
        </div>

        {activeTab === 'dashboard' ? (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-neutral-900 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-2">Total Candidates</h3>
                <p className="text-3xl font-bold text-blue-500">{candidates.length}</p>
              </div>
              <div className="bg-neutral-900 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-2">Pending Evidence</h3>
                <p className="text-3xl font-bold text-yellow-500">{pendingEvidence.length}</p>
              </div>
              <div className="bg-neutral-900 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-2">Active Today</h3>
                <p className="text-3xl font-bold text-green-500">
                  {candidates.filter(c => 
                    c.lastActivity && 
                    c.lastActivity instanceof Date && 
                    c.lastActivity.toDateString() === new Date().toDateString()
                  ).length}
                </p>
              </div>
            </div>

            {/* Debug Information */}
            <div className="bg-neutral-900 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">Debug Information</h2>
                <button
                  onClick={refreshData}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  disabled={isLoading}
                >
                  {isLoading ? 'Refreshing...' : '🔄 Refresh Data'}
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-300">Authentication Status:</span>
                  <span className="ml-2 text-green-400">Authenticated</span>
                </div>
                <div>
                  <span className="font-medium text-gray-300">Loading Status:</span>
                  <span className={`ml-2 ${isLoading ? 'text-yellow-400' : 'text-green-400'}`}>
                    {isLoading ? 'Loading...' : 'Complete'}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-300">Error Status:</span>
                  <span className="ml-2 text-green-400">No errors</span>
                </div>
                <div>
                  <span className="font-medium text-gray-300">Cache Status:</span>
                  <span className="ml-2 text-blue-400">
                    {getSessionCache() ? 'Cached (Fast Load)' : 'Fresh Scan'}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-300">Candidates Found:</span>
                  <span className="ml-2 font-semibold text-white">{candidates.length}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-300">Pending Evidence Found:</span>
                  <span className="ml-2 font-semibold text-white">{pendingEvidence.length}</span>
                </div>
              </div>
              
              <div className="mt-4 flex space-x-2">
                <button
                  onClick={() => {
                    // Clear all caches
                    sessionStorage.removeItem('assessor-dashboard-data');
                    localStorage.removeItem('assessor-evidence-cache');
                    refreshData();
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  🗑️ Clear All Cache
                </button>
              </div>
            </div>

            {/* Candidates List */}
            <div className="bg-neutral-900 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Candidates</h2>
        {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <p className="text-gray-500">Scanning SharePoint sites for candidates...</p>
                </div>
              ) : candidates.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No candidates found.</p>
                  <p className="text-sm mt-2">The system will scan all accessible SharePoint sites for evidence folders.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {candidates.map((candidate) => (
                    <div 
                      key={candidate.id}
                      className="bg-neutral-800 rounded-lg p-4 cursor-pointer hover:bg-neutral-700 transition-colors"
                      onClick={() => handleCandidateClick(candidate)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-lg font-semibold text-white">{candidate.name}</h3>
                          <p className="text-sm text-gray-400">
                            Last activity: {
                              candidate.lastActivity && candidate.lastActivity instanceof Date 
                                ? candidate.lastActivity.toLocaleDateString() 
                                : 'Unknown'
                            }
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-yellow-500">{candidate.pendingEvidence}</div>
                          <div className="text-sm text-gray-400">Pending</div>
                        </div>
                      </div>
                      <div className="mt-2 flex justify-between text-sm text-gray-400">
                        <span>Total evidence: {candidate.totalEvidence}</span>
                        <span>Site: {candidate.siteUrl.split('/').pop()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-neutral-900 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Evidence Queue (Chronological Order)</h2>
            {isLoading ? (
              <div className="text-center py-8 text-gray-500">Loading evidence...</div>
            ) : pendingEvidence.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No pending evidence found.</div>
            ) : (
              <div className="space-y-4">
                {pendingEvidence.map((evidence) => (
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
                        {evidence.description && (
                          <p className="text-sm text-gray-500 mt-1">{evidence.description}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-400">
                          {evidence.dateSubmitted.toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {evidence.dateSubmitted.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 flex justify-between items-center">
                      <span className="text-sm text-yellow-500">Pending Review</span>
                      <button className="text-blue-400 hover:text-blue-300 text-sm">
                        Review Evidence →
                    </button>
                    </div>
                  </div>
              ))}
              </div>
            )}
          </div>
        )}
      </div>
      
      <BottomNavigation />
    </div>
  );
} 