import React, { useState, useEffect } from 'react';
import { SharePointService } from '../services/SharePointService';
import { AssessmentService } from '../services/AssessmentService';
import { useMsalAuth } from '../lib/useMsalAuth';

export default function SharePointDiagnostic() {
  const { account, loading, error: msalError } = useMsalAuth();
  const [diagnosticData, setDiagnosticData] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runDiagnostics = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setDiagnosticData({});

      const spService = SharePointService.getInstance();
      await spService.authenticate();

      const results: any = {};

      // Test 1: Basic authentication
      try {
        const meResponse = await spService['client']?.api('/me').get();
        results.basicAuth = { success: true, data: meResponse };
        console.log('Diagnostic: Basic auth successful', meResponse);
      } catch (error) {
        results.basicAuth = { success: false, error: error };
        console.error('Diagnostic: Basic auth failed', error);
      }

      // Test 2: Get user's sites
      try {
        const sitesResponse = await spService['client']?.api('/me/sites').get();
        results.userSites = { success: true, data: sitesResponse };
        console.log('Diagnostic: User sites', sitesResponse);
      } catch (error) {
        results.userSites = { success: false, error: error };
        console.error('Diagnostic: User sites failed', error);
      }

      // Test 3: Get all sites
      try {
        const allSitesResponse = await spService['client']?.api('/sites').get();
        results.allSites = { success: true, data: allSitesResponse };
        console.log('Diagnostic: All sites', allSitesResponse);
      } catch (error) {
        results.allSites = { success: false, error: error };
        console.error('Diagnostic: All sites failed', error);
      }

      // Test 4: Get user's drive
      try {
        const driveResponse = await spService['client']?.api('/me/drive').get();
        results.userDrive = { success: true, data: driveResponse };
        console.log('Diagnostic: User drive', driveResponse);
      } catch (error) {
        results.userDrive = { success: false, error: error };
        console.error('Diagnostic: User drive failed', error);
      }

      // Test 5: Get drive items
      try {
        const driveItemsResponse = await spService['client']?.api('/me/drive/root/children').get();
        results.driveItems = { success: true, data: driveItemsResponse };
        console.log('Diagnostic: Drive items', driveItemsResponse);
      } catch (error) {
        results.driveItems = { success: false, error: error };
        console.error('Diagnostic: Drive items failed', error);
      }

      // Test 6: Try to get evidence using AssessmentService
      try {
        const assessmentService = AssessmentService.getInstance();
        const evidence = await assessmentService.getEvidenceForCriteria('ALL', 'ALL');
        results.evidence = { success: true, data: evidence };
        console.log('Diagnostic: Evidence found', evidence);
      } catch (error) {
        results.evidence = { success: false, error: error };
        console.error('Diagnostic: Evidence failed', error);
      }

      setDiagnosticData(results);

    } catch (err) {
      console.error('Diagnostic failed:', err);
      setError(err instanceof Error ? err.message : 'Diagnostic failed');
    } finally {
      setIsLoading(false);
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
      <div className="text-red-500 text-xl mb-4">MSAL Authentication Error</div>
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
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">SharePoint Diagnostic</h1>
        
        <button
          onClick={runDiagnostics}
          disabled={isLoading}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 mb-8"
        >
          {isLoading ? 'Running Diagnostics...' : 'Run Diagnostics'}
        </button>

        {error && (
          <div className="bg-red-900 text-white p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {Object.keys(diagnosticData).length > 0 && (
          <div className="space-y-6">
            {Object.entries(diagnosticData).map(([testName, result]: [string, any]) => (
              <div key={testName} className="bg-neutral-900 rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4 capitalize">{testName.replace(/([A-Z])/g, ' $1')}</h2>
                
                {result.success ? (
                  <div>
                    <div className="text-green-500 mb-2">✓ Success</div>
                    <pre className="bg-neutral-800 p-4 rounded-lg overflow-auto text-sm">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </div>
                ) : (
                  <div>
                    <div className="text-red-500 mb-2">✗ Failed</div>
                    <pre className="bg-neutral-800 p-4 rounded-lg overflow-auto text-sm">
                      {JSON.stringify(result.error, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
