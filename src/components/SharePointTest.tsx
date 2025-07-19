import { useState } from 'react';
import { SharePointService } from '../services/SharePointService';

export default function SharePointTest() {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isTesting, setIsTesting] = useState(false);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testSharePointAPI = async () => {
    setIsTesting(true);
    setTestResults([]);
    
    try {
      const spService = SharePointService.getInstance();
      addResult('Starting SharePoint API tests...');
      
      // Test 1: Get current user
      try {
        const userResponse = await spService['client']?.api('/me').get();
        addResult(`✅ User info: ${userResponse?.displayName || 'Unknown'}`);
      } catch (error) {
        addResult(`❌ User info failed: ${(error as any)?.message}`);
      }
      
      // Test 2: Get sites
      try {
        const sitesResponse = await spService['client']?.api('/sites').get();
        addResult(`✅ Sites available: ${sitesResponse?.value?.length || 0}`);
      } catch (error) {
        addResult(`❌ Sites failed: ${(error as any)?.message}`);
      }
      
      // Test 3: Test specific site
      try {
        const siteId = 'wrightspark625.sharepoint.com:/sites/EWANVQ'; // Replace with actual site ID
        const siteResponse = await spService['client']?.api(`/sites/${siteId}`).get();
        addResult(`✅ Site access: ${siteResponse?.displayName || 'Unknown'}`);
      } catch (error) {
        addResult(`❌ Site access failed: ${(error as any)?.message}`);
      }
      
      // Test 4: Test lists
      try {
        const siteId = 'wrightspark625.sharepoint.com:/sites/EWANVQ';
        const listsResponse = await spService['client']?.api(`/sites/${siteId}/lists`).get();
        addResult(`✅ Lists available: ${listsResponse?.value?.length || 0}`);
        if (listsResponse?.value) {
          listsResponse.value.forEach((list: any) => {
            addResult(`  - ${list.displayName} (${list.name})`);
          });
        }
      } catch (error) {
        addResult(`❌ Lists failed: ${(error as any)?.message}`);
      }
      
      addResult('SharePoint API tests completed.');
    } catch (error) {
      addResult(`❌ Test failed: ${(error as any)?.message}`);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-4">SharePoint API Test</h3>
      
      <button
        onClick={testSharePointAPI}
        disabled={isTesting}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {isTesting ? 'Testing...' : 'Test SharePoint API'}
      </button>
      
      {testResults.length > 0 && (
        <div className="mt-4">
          <h4 className="font-medium mb-2">Test Results:</h4>
          <div className="bg-white p-3 rounded border max-h-64 overflow-y-auto">
            {testResults.map((result, index) => (
              <div key={index} className="text-sm font-mono">
                {result}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 