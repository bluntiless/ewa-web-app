import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { SharePointService } from '../../services/SharePointService';
import EvidenceAssessmentModal from '../../components/EvidenceAssessmentModal';
import TestModal from '../../components/TestModal';
import SharePointTest from '../../components/SharePointTest';

interface EvidenceItem {
  id: string;
  name: string;
  dateSubmitted: Date;
  status: string;
  downloadUrl?: string;
  webUrl?: string;
  isFolder: boolean;
  path: string;
  assessorFeedback?: string;
  assessorName?: string;
  assessmentDate?: string;
}

export default function CandidateEvidencePage() {
  const router = useRouter();
  const { siteId } = router.query;
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<EvidenceItem[]>([]);
  const [candidateName, setCandidateName] = useState('');
  const [currentPath, setCurrentPath] = useState('');
  const [pathHistory, setPathHistory] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvidenceItem, setSelectedEvidenceItem] = useState<EvidenceItem | null>(null);
  const [showAssessmentModal, setShowAssessmentModal] = useState(false);
  const [localAssessments, setLocalAssessments] = useState<Record<string, { status: string; feedback: string; assessor: string; date: string }>>({});

  useEffect(() => {
    const loadItems = async () => {
      if (!siteId || typeof siteId !== 'string') return;

      try {
        setLoading(true);
        const spService = SharePointService.getInstance();
        
        // Get site details first
        const siteResponse = await spService['client']?.api(`/sites/${siteId}`).get();
        if (siteResponse) {
          setCandidateName(siteResponse.displayName);
        }

        // Load local assessments from localStorage
        const localAssessmentsData: Record<string, { status: string; feedback: string; assessor: string; date: string }> = {};
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key?.startsWith('assessment_')) {
            try {
              const data = JSON.parse(localStorage.getItem(key) || '{}');
              const itemId = key.replace('assessment_', '');
              localAssessmentsData[itemId] = data;
            } catch (e) {
              console.warn('Failed to parse local assessment:', e);
            }
          }
        }
        setLocalAssessments(localAssessmentsData);
        console.log('Loaded local assessments:', localAssessmentsData);

        // Try to find the best starting path
        await findBestStartingPath();
      } catch (error) {
        console.error('Failed to load candidate info:', error);
        setError('Failed to load candidate information.');
        setLoading(false);
      }
    };

    loadItems();
  }, [siteId]);

  useEffect(() => {
    if (siteId && currentPath) {
      loadCurrentPath();
    }
  }, [currentPath, siteId]);

  const findBestStartingPath = async () => {
    if (!siteId || typeof siteId !== 'string') return;

    const spService = SharePointService.getInstance();
    
    // Try different possible starting paths
    const possiblePaths = [
      'Documents/Evidence',
      'Evidence',
      'Shared Documents/Evidence',
      'Documents',
      'Shared Documents'
    ];

    for (const path of possiblePaths) {
      try {
        console.log(`Trying starting path: ${path}`);
        const response = await spService['client']?.api(`/sites/${siteId}/drive/root:/${path}:/children`).get();
        
        if (response?.value && response.value.length > 0) {
          console.log(`✅ Found items in ${path}, using as starting path`);
          setCurrentPath(path);
          setPathHistory([path]);
          return;
        }
      } catch (error) {
        console.log(`❌ Path ${path} not accessible`);
      }
    }

    // If no evidence paths work, try root
    try {
      console.log('Trying root path as fallback');
      const response = await spService['client']?.api(`/sites/${siteId}/drive/root/children`).get();
      
      if (response?.value) {
        console.log('✅ Using root path as starting point');
        setCurrentPath('');
        setPathHistory(['']);
        return;
      }
    } catch (error) {
      console.error('Failed to access root path:', error);
    }

    setError('Could not access any folders in this site. You may not have permission.');
    setLoading(false);
  };

  const loadCurrentPath = async () => {
    if (!siteId || typeof siteId !== 'string') return;

    try {
      setLoading(true);
      setError(null);
      const spService = SharePointService.getInstance();

      console.log(`Loading path: "${currentPath}"`);
      
      let response;
      if (currentPath === '' || currentPath === '/') {
        // Load root
        response = await spService['client']?.api(`/sites/${siteId}/drive/root/children`).get();
      } else {
        // Load specific path
        response = await spService['client']?.api(`/sites/${siteId}/drive/root:/${currentPath}:/children`).get();
      }
      
      if (response?.value) {
        const evidenceItems: EvidenceItem[] = [];
        
        // Process each item to get detailed metadata
        for (const item of response.value) {
          let assessmentStatus = 'Unknown';
          let assessorFeedback = '';
          let assessorName = '';
          let assessmentDate = '';
          
          // For files, try to get the SharePoint list item metadata
          if (!item.folder) {
            try {
              console.log(`Getting metadata for file: ${item.name}`);
              
              // Get the list item with all fields
              const listItemResponse = await spService['client']?.api(`/sites/${siteId}/drive/items/${item.id}/listItem`).expand('fields').get();
              
              console.log(`Metadata for ${item.name}:`, listItemResponse);
              
              if (listItemResponse?.fields) {
                const fields = listItemResponse.fields;
                
                // Try different possible field names for assessment status
                assessmentStatus = fields.Assessment || 
                                 fields.AssessmentStatus || 
                                 fields.assessment || 
                                 fields.Assessment_x0020_Status ||
                                 fields['Assessment Status'] ||
                                 'Unknown';
                
                // Get assessor feedback
                assessorFeedback = fields.AssessorFeedback || 
                                 fields.Assessor_x0020_Feedback ||
                                 fields['Assessor Feedback'] ||
                                 fields.AssessorFe ||
                                 '';
                
                // Get assessor name
                assessorName = fields.AssessorName || 
                              fields.Assessor_x0020_Name ||
                              fields['Assessor Name'] ||
                              fields.AssessorNa ||
                              '';
                
                // Get assessment date
                assessmentDate = fields.AssessmentDate || 
                               fields.Assessment_x0020_Date ||
                               fields['Assessment Date'] ||
                               fields.AssessmentDa ||
                               '';
                
                console.log(`📊 ${item.name} - Status: "${assessmentStatus}", Feedback: "${assessorFeedback}", Assessor: "${assessorName}"`);
              }
            } catch (metadataError) {
              console.warn(`⚠️ Could not get metadata for ${item.name}:`, metadataError);
              // For files without metadata access, keep as Unknown
            }
          }
          
          // Check if we have a local assessment for this item
          const localAssessment = localAssessments[item.id];
          if (localAssessment) {
            assessmentStatus = localAssessment.status;
            assessorFeedback = localAssessment.feedback;
            assessorName = localAssessment.assessor;
            assessmentDate = localAssessment.date;
            console.log(`Using local assessment for ${item.name}:`, localAssessment);
          }

          const evidenceItem: EvidenceItem = {
            id: item.id,
            name: item.name,
            dateSubmitted: new Date(item.createdDateTime),
            status: assessmentStatus,
            downloadUrl: item['@microsoft.graph.downloadUrl'],
            webUrl: item.webUrl,
            isFolder: !!item.folder,
            path: currentPath ? `${currentPath}/${item.name}` : item.name,
            assessorFeedback,
            assessorName,
            assessmentDate
          };
          
          evidenceItems.push(evidenceItem);
        }
        
        setItems(evidenceItems);
        setLoading(false);
      } else {
        setError('No items found in this location.');
        setLoading(false);
      }
    } catch (error) {
      console.error('Failed to load path:', error);
      setError(`Failed to load ${currentPath || 'root'}. ${(error as any)?.message || 'Access denied or path not found.'}`);
      setLoading(false);
    }
  };

  const handleItemClick = (item: EvidenceItem) => {
    if (item.isFolder) {
      // Navigate into folder
      setCurrentPath(item.path);
      setPathHistory(prev => [...prev, item.path]);
    } else {
      // For files, show assessment modal instead of opening directly
      console.log('Opening assessment modal for:', item);
      setSelectedEvidenceItem(item);
      setShowAssessmentModal(true);
    }
  };

  const navigateBack = () => {
    if (pathHistory.length > 1) {
      const newHistory = pathHistory.slice(0, -1);
      setPathHistory(newHistory);
      setCurrentPath(newHistory[newHistory.length - 1]);
    }
  };

  const navigateToDashboard = () => {
    router.push('/assessor-review');
  };

  const handleAssessmentUpdate = async (status: string, feedback: string) => {
    if (!selectedEvidenceItem || !siteId || typeof siteId !== 'string') return;

    try {
      const spService = SharePointService.getInstance();
      
      // First authenticate
      await spService.authenticate();
      console.log('✅ Authenticated with SharePoint');
      
      const authenticatedUser = 'Wayne Wright';
      const currentDate = new Date().toISOString();
      
      console.log(`🔄 Updating assessment status for item: ${selectedEvidenceItem.name}`);
      console.log(`📊 New status: ${status}`);
      console.log(`👤 Assessor: ${authenticatedUser}`);
      console.log(`📅 Date: ${currentDate}`);
      console.log(`🏢 Site ID: ${siteId}`);
      
      // Try multiple approaches to update the assessment status (like iOS app)
      let successCount = 0;
      let totalAttempts = 0;
      
      // Approach 1: Update list item fields
      try {
        totalAttempts += 1;
        const listItemEndpoint = `/sites/${siteId}/drive/items/${selectedEvidenceItem.id}/listItem/fields`;
        
        const fieldsToUpdate = {
          AssessmentStatus: status,
          AssessorName: authenticatedUser,
          AssessmentDate: currentDate,
          Status: status,
          Assessor: authenticatedUser,
          AssessmentDateTime: currentDate,
          ContentType: 'Evidence',
          Title: selectedEvidenceItem.name,
          AssessorFeedback: feedback
        };
        
        console.log('🔄 Approach 1: Updating list item fields...');
        await spService['client']?.api(listItemEndpoint).patch(fieldsToUpdate);
        console.log('✅ Successfully updated list item fields');
        successCount += 1;
      } catch (error) {
        console.log('❌ List item update error:', error);
      }
      
      // Approach 2: Update file properties
      try {
        totalAttempts += 1;
        const driveItemEndpoint = `/sites/${siteId}/drive/items/${selectedEvidenceItem.id}`;
        
        const driveItemUpdate = {
          fileSystemInfo: {
            customProperties: {
              AssessmentStatus: status,
              AssessorName: authenticatedUser,
              AssessmentDate: currentDate,
              Status: status,
              Assessor: authenticatedUser,
              AssessorFeedback: feedback
            }
          }
        };
        
        console.log('🔄 Approach 2: Updating file properties...');
        await spService['client']?.api(driveItemEndpoint).patch(driveItemUpdate);
        console.log('✅ Successfully updated file properties');
        successCount += 1;
      } catch (error) {
        console.log('❌ File properties update error:', error);
      }
      
      // Approach 3: Update metadata directly
      try {
        totalAttempts += 1;
        const metadataEndpoint = `/sites/${siteId}/drive/items/${selectedEvidenceItem.id}/listItem`;
        
        const metadataUpdate = {
          fields: {
            AssessmentStatus: status,
            AssessorName: authenticatedUser,
            AssessmentDate: currentDate,
            Status: status,
            Assessor: authenticatedUser,
            AssessmentDateTime: currentDate,
            AssessorFeedback: feedback
          }
        };
        
        console.log('🔄 Approach 3: Updating metadata...');
        await spService['client']?.api(metadataEndpoint).patch(metadataUpdate);
        console.log('✅ Successfully updated metadata');
        successCount += 1;
      } catch (error) {
        console.log('❌ Metadata update error:', error);
      }
      
      // Approach 4: Update custom properties
      try {
        totalAttempts += 1;
        const customPropertyEndpoint = `/sites/${siteId}/drive/items/${selectedEvidenceItem.id}/listItem/fields`;
        
        const customPropertyUpdate = {
          AssessmentStatus: status,
          AssessorName: authenticatedUser,
          AssessmentDate: currentDate,
          AssessorFeedback: feedback
        };
        
        console.log('🔄 Approach 4: Updating custom properties...');
        await spService['client']?.api(customPropertyEndpoint).patch(customPropertyUpdate);
        console.log('✅ Successfully updated custom properties');
        successCount += 1;
      } catch (error) {
        console.log('❌ Custom property update error:', error);
      }
      
      console.log('📊 Assessment update summary:');
      console.log(`   - Total attempts: ${totalAttempts}`);
      console.log(`   - Successful updates: ${successCount}`);
      console.log(`   - Success rate: ${successCount > 0 ? '✅' : '❌'}`);
      
      // If at least one update succeeded, consider it a success
      if (successCount > 0) {
        console.log(`✅ Assessment status update completed for ${selectedEvidenceItem.name}`);
        console.log(`📊 Final status: ${status}`);
        console.log(`👤 Assessor: ${authenticatedUser}`);
        console.log(`📅 Date: ${currentDate}`);
      } else {
        throw new Error('Failed to update assessment status in SharePoint');
      }
      
      // Update local state immediately
      setItems(prevItems => 
        prevItems.map(item => 
          item.id === selectedEvidenceItem.id 
            ? { 
                ...item, 
                status, 
                assessorFeedback: feedback,
                assessorName: authenticatedUser,
                assessmentDate: currentDate
              }
            : item
        )
      );

      // Update the selected evidence item state as well
      setSelectedEvidenceItem(prev => prev ? {
        ...prev,
        status,
        assessorFeedback: feedback,
        assessorName: authenticatedUser,
        assessmentDate: currentDate
      } : null);
      
      // Store in localStorage as backup
      const assessmentData = {
        status,
        feedback,
        assessor: authenticatedUser,
        date: currentDate
      };
      setLocalAssessments(prev => ({
        ...prev,
        [selectedEvidenceItem.id]: assessmentData
      }));
      localStorage.setItem(`assessment_${selectedEvidenceItem.id}`, JSON.stringify(assessmentData));
      
      console.log(`✅ Assessment updated in SharePoint and local storage for ${selectedEvidenceItem.name}`);
      
    } catch (error) {
      console.error('❌ SharePoint update failed:', error);
      
      // Fallback to local storage only
      console.log(`📱 Using local storage fallback for ${selectedEvidenceItem.name}`);
      
      // Update local state immediately
      setItems(prevItems => 
        prevItems.map(item => 
          item.id === selectedEvidenceItem.id 
            ? { 
                ...item, 
                status, 
                assessorFeedback: feedback,
                assessorName: 'Wayne Wright',
                assessmentDate: new Date().toISOString()
              }
            : item
        )
      );

      setSelectedEvidenceItem(prev => prev ? {
        ...prev,
        status,
        assessorFeedback: feedback,
        assessorName: 'Wayne Wright',
        assessmentDate: new Date().toISOString()
      } : null);
      
      // Store in localStorage
      const assessmentData = {
        status,
        feedback,
        assessor: 'Wayne Wright',
        date: new Date().toISOString()
      };
      setLocalAssessments(prev => ({
        ...prev,
        [selectedEvidenceItem.id]: assessmentData
      }));
      localStorage.setItem(`assessment_${selectedEvidenceItem.id}`, JSON.stringify(assessmentData));
      
      console.log(`✅ Local assessment saved for ${selectedEvidenceItem.name}`);
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Loading...</h1>
          <button
            onClick={navigateToDashboard}
            className="px-4 py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Error</h1>
          <button
            onClick={navigateToDashboard}
            className="px-4 py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Back to Dashboard
          </button>
        </div>
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{candidateName}'s Evidence</h1>
        <div className="flex space-x-2">
          <TestModal />
          <SharePointTest />
          <button
            onClick={navigateToDashboard}
            className="px-4 py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="mb-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span>Path:</span>
          <span className="font-mono bg-gray-100 px-2 py-1 rounded">{currentPath}</span>
          {pathHistory.length > 1 && (
            <button
              onClick={navigateBack}
              className="px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
            >
              ← Back
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {items.map(item => (
          <div
            key={item.id}
            className={`bg-white p-4 rounded-lg shadow cursor-pointer hover:bg-gray-50 ${
              item.isFolder ? 'border-l-4 border-blue-500' : ''
            }`}
            onClick={() => handleItemClick(item)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">
                  {item.isFolder ? '📁' : '📄'}
                </span>
                <div className="flex-1">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-gray-500">
                    {item.isFolder ? 'Folder' : `Submitted: ${item.dateSubmitted.toLocaleDateString()}`}
                  </p>
                  {!item.isFolder && item.assessorName && (
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-medium">Assessor:</span> {item.assessorName}
                      {item.assessmentDate && (
                        <span className="ml-2 text-gray-500">
                          • {new Date(item.assessmentDate).toLocaleDateString()}
                        </span>
                      )}
                    </p>
                  )}
                  {!item.isFolder && item.assessorFeedback && (
                    <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                      <span className="font-medium text-gray-700">Feedback:</span>
                      <p className="text-gray-600 mt-1">{item.assessorFeedback}</p>
                    </div>
                  )}
                  {!item.isFolder && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEvidenceItem(item);
                        setShowAssessmentModal(true);
                      }}
                      className="mt-2 px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded hover:bg-blue-200 flex items-center space-x-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <span>Feedback</span>
                    </button>
                  )}
                </div>
              </div>
              {!item.isFolder && (
                <div className="flex flex-col items-end space-y-1">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    item.status.toLowerCase().includes('approved') ? 'bg-green-100 text-green-800' :
                    item.status.toLowerCase().includes('pending') ? 'bg-yellow-100 text-yellow-800' :
                    item.status.toLowerCase().includes('rejected') ? 'bg-red-100 text-red-800' :
                    item.status.toLowerCase().includes('needs') ? 'bg-orange-100 text-orange-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {item.status}
                  </span>
                  {item.assessmentDate && (
                    <span className="text-xs text-gray-500">
                      {new Date(item.assessmentDate).toLocaleTimeString()}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No items found in {currentPath || 'root'}.
          </div>
        )}
      </div>

      {/* Assessment Modal */}
      {showAssessmentModal && (
        <>
          {console.log('Rendering modal with evidence item:', selectedEvidenceItem)}
          <EvidenceAssessmentModal
            isOpen={showAssessmentModal}
            onClose={() => {
              console.log('Closing assessment modal');
              setShowAssessmentModal(false);
              setSelectedEvidenceItem(null);
            }}
            evidenceItem={selectedEvidenceItem}
            onAssessmentUpdate={handleAssessmentUpdate}
          />
        </>
      )}
    </div>
  );
} 