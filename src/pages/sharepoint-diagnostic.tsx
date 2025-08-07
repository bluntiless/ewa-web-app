import dynamic from 'next/dynamic';
import React, { useState, useEffect } from 'react';
import { SharePointService } from '../services/SharePointService';
import { AssessmentService } from '../services/AssessmentService';
import { useMsalAuth } from '../lib/useMsalAuth';
import BottomNavigation from '../components/BottomNavigation';

interface DiagnosticResult {
  test: string;
  status: 'success' | 'error' | 'warning';
  message: string;
  details?: any;
}

// Client-side only component
function SharePointDiagnosticClient() {
  const { account, loading, error: msalError } = useMsalAuth();
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runDiagnostics = async () => {
    setIsRunning(true);
    setResults([]);

    const newResults: DiagnosticResult[] = [];

    try {
      // Test 1: MSAL Authentication
      try {
        if (!account) {
          newResults.push({
            test: 'MSAL Authentication',
            status: 'error',
            message: 'No authenticated account found'
          });
        } else {
          newResults.push({
            test: 'MSAL Authentication',
            status: 'success',
            message: `Authenticated as ${account.username}`,
            details: account
          });
        }
      } catch (error) {
        newResults.push({
          test: 'MSAL Authentication',
          status: 'error',
          message: `Authentication failed: ${error}`
        });
      }

      // Test 2: SharePoint Service Initialization
      try {
        const spService = SharePointService.getInstance();
        newResults.push({
          test: 'SharePoint Service',
          status: 'success',
          message: 'SharePoint service initialized successfully'
        });
      } catch (error) {
        newResults.push({
          test: 'SharePoint Service',
          status: 'error',
          message: `SharePoint service initialization failed: ${error}`
        });
      }

      // Test 3: SharePoint Authentication
      try {
        const spService = SharePointService.getInstance();
        await spService.authenticate();
        newResults.push({
          test: 'SharePoint Authentication',
          status: 'success',
          message: 'Successfully authenticated with SharePoint'
        });
      } catch (error) {
        newResults.push({
          test: 'SharePoint Authentication',
          status: 'error',
          message: `SharePoint authentication failed: ${error}`
        });
      }

      // Test 4: Get Accessible Sites
      try {
        const spService = SharePointService.getInstance();
        const sites = await spService.getAllAccessibleSites();
        newResults.push({
          test: 'Accessible Sites',
          status: 'success',
          message: `Found ${sites.length} accessible sites`,
          details: sites
        });
      } catch (error) {
        newResults.push({
          test: 'Accessible Sites',
          status: 'error',
          message: `Failed to get accessible sites: ${error}`
        });
      }

      // Test 5: Assessment Service
      try {
        const assessmentService = AssessmentService.getInstance();
        newResults.push({
          test: 'Assessment Service',
          status: 'success',
          message: 'Assessment service initialized successfully'
        });
      } catch (error) {
        newResults.push({
          test: 'Assessment Service',
          status: 'error',
          message: `Assessment service initialization failed: ${error}`
        });
      }

      // Test 6: Evidence Retrieval
      try {
        const assessmentService = AssessmentService.getInstance();
        const evidence = await assessmentService.getEvidenceForCriteria('ALL', 'ALL');
        newResults.push({
          test: 'Evidence Retrieval',
          status: 'success',
          message: `Retrieved ${evidence.length} evidence items`,
          details: evidence
        });
      } catch (error) {
        newResults.push({
          test: 'Evidence Retrieval',
          status: 'error',
          message: `Failed to retrieve evidence: ${error}`
        });
      }

      // Test 7: Site Evidence Check
      try {
        const spService = SharePointService.getInstance();
        const sites = await spService.getAllAccessibleSites();
        let totalEvidence = 0;
        let sitesWithEvidence = 0;

        for (const site of sites) {
          try {
            const siteInfo = await spService.checkSiteForEvidence(site.webUrl);
            if (siteInfo.hasEvidence) {
              sitesWithEvidence++;
              totalEvidence += siteInfo.evidenceCount;
            }
          } catch (error) {
            console.warn(`Failed to check site ${site.webUrl}:`, error);
          }
        }

        newResults.push({
          test: 'Site Evidence Check',
          status: 'success',
          message: `Found evidence in ${sitesWithEvidence} sites with ${totalEvidence} total items`
        });
      } catch (error) {
        newResults.push({
          test: 'Site Evidence Check',
          status: 'error',
          message: `Failed to check site evidence: ${error}`
        });
      }

    } catch (error) {
      newResults.push({
        test: 'Overall Diagnostics',
        status: 'error',
        message: `Diagnostics failed: ${error}`
      });
    }

    setResults(newResults);
    setIsRunning(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg">Loading authentication...</p>
        </div>
      </div>
    );
  }

  if (msalError) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
        <div className="text-center max-w-lg mx-auto px-4">
          <div className="text-red-500 text-xl mb-4">Authentication Error</div>
          <p className="text-gray-400">{String(msalError)}</p>
        </div>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg">Signing in...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="max-w-4xl mx-auto px-4 py-8 pb-safe">
        <h1 className="text-3xl font-bold mb-8">SharePoint Diagnostic Tool</h1>
        
        <div className="mb-6">
          <button
            onClick={runDiagnostics}
            disabled={isRunning}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isRunning ? 'Running Diagnostics...' : 'Run Diagnostics'}
          </button>
        </div>

        {results.length > 0 && (
          <div className="space-y-4">
            {results.map((result, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  result.status === 'success'
                    ? 'bg-green-900 border-green-700'
                    : result.status === 'error'
                    ? 'bg-red-900 border-red-700'
                    : 'bg-yellow-900 border-yellow-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{result.test}</h3>
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      result.status === 'success'
                        ? 'bg-green-700 text-green-100'
                        : result.status === 'error'
                        ? 'bg-red-700 text-red-100'
                        : 'bg-yellow-700 text-yellow-100'
                    }`}
                  >
                    {result.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm mt-2">{result.message}</p>
                {result.details && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-sm text-gray-400">
                      View Details
                    </summary>
                    <pre className="mt-2 text-xs bg-black p-2 rounded overflow-auto">
                      {JSON.stringify(result.details, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      <BottomNavigation />
    </div>
  );
}

// Export as dynamic component with SSR disabled
export default dynamic(() => Promise.resolve(SharePointDiagnosticClient), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
      <div className="text-center">
        <p className="text-lg">Loading...</p>
      </div>
    </div>
  )
}); 