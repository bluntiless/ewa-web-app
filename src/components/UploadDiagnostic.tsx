import React, { useState, useEffect } from 'react';
import { SharePointService } from '../services/SharePointService';

interface UploadDiagnosticProps {
  unitCode: string;
  criteriaCode: string;
}

export const UploadDiagnostic: React.FC<UploadDiagnosticProps> = ({ unitCode, criteriaCode }) => {
  const [diagnosticResults, setDiagnosticResults] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const addResult = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setDiagnosticResults(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  const runDiagnostic = async () => {
    setIsRunning(true);
    setDiagnosticResults([]);
    
    try {
      addResult('Starting upload diagnostic...');
      
      // 1. Check authentication
      addResult('1. Testing authentication...');
      const spService = SharePointService.getInstance();
      
      try {
        await spService.authenticate();
        addResult('✅ Authentication successful');
      } catch (error) {
        addResult(`❌ Authentication failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        return;
      }

      // 2. Check site access
      addResult('2. Testing site access...');
      try {
        // Use environment variable for site URL
        const siteUrl = process.env.NEXT_PUBLIC_SHAREPOINT_SITE_URL || 'https://wrightspark625.sharepoint.com/sites/EWANVQLevel3ElectroTechnical';
        addResult(`Site URL: ${siteUrl}`);
        
        const isValid = await spService.validateSiteUrl(siteUrl);
        if (isValid) {
          addResult('✅ Site access successful');
        } else {
          addResult('❌ Site access failed');
          return;
        }
      } catch (error) {
        addResult(`❌ Site access failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        return;
      }

      // 3. Check drive access
      addResult('3. Testing drive access...');
      try {
        // Test drive access by trying to get evidence
        const evidence = await spService.getEvidence();
        addResult(`✅ Drive access successful - found ${evidence.length} evidence items`);
      } catch (error) {
        addResult(`❌ Drive access failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        return;
      }

      // 4. Test folder creation
      addResult('4. Testing folder creation...');
      try {
        const folderPath = `Evidence/${unitCode.replace(/\./g, '_')}/${criteriaCode.replace(/\./g, '_')}`;
        addResult(`Testing folder path: ${folderPath}`);
        
        const folderId = await spService.createFolderIfNeeded(folderPath);
        addResult(`✅ Folder creation successful: ${folderId}`);
      } catch (error) {
        addResult(`❌ Folder creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        return;
      }

      // 5. Test file upload
      addResult('5. Testing file upload...');
      try {
        // Create a test file
        const testContent = 'This is a test file for diagnostic purposes';
        const testFile = new File([testContent], 'test-diagnostic.txt', { type: 'text/plain' });
        
        const folderPath = `Evidence/${unitCode.replace(/\./g, '_')}/${criteriaCode.replace(/\./g, '_')}`;
        await spService.uploadEvidence(testFile, folderPath, 'test-diagnostic.txt');
        addResult('✅ File upload successful');
      } catch (error) {
        addResult(`❌ File upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        return;
      }

      addResult('🎉 All diagnostic tests passed! Upload functionality should work.');
      
    } catch (error) {
      addResult(`❌ Diagnostic failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Upload Diagnostic</h3>
      
      <button
        onClick={runDiagnostic}
        disabled={isRunning}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 mb-4"
      >
        {isRunning ? 'Running Diagnostic...' : 'Run Diagnostic'}
      </button>

      {diagnosticResults.length > 0 && (
        <div className="bg-white p-4 rounded border">
          <h4 className="font-semibold mb-2">Diagnostic Results:</h4>
          <div className="space-y-1 text-sm">
            {diagnosticResults.map((result, index) => (
              <div key={index} className="font-mono">
                {result}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}; 