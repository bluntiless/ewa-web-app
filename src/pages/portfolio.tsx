import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { SharePointService, Evidence as SharePointServiceEvidence, EvidenceMetadata } from '../services/SharePointService';
import { PortfolioCompilationService } from '../services/PortfolioCompilationService';
import BottomNavigation from '../components/BottomNavigation';
import { Evidence as ModelEvidence, AssessmentStatus } from '../models/Evidence';
import { EvidenceDisplay } from '../components/EvidenceDisplay';
import { useEvidence } from '../hooks/useEvidence';
import { UnitProgress } from '../components/UnitProgress';
import React from 'react';
import { Unit, LearningOutcome, PerformanceCriteria } from '../models/Unit';
import { ProgressView } from '../components/ProgressView';

// Helper function to convert SharePointService.Evidence to Model.Evidence
const toModelEvidence = (spEvidence: SharePointServiceEvidence): ModelEvidence => {
  return {
    id: spEvidence.id || '',
    title: spEvidence.title || 'Unknown',
    description: spEvidence.description || '',
    dateUploaded: new Date(spEvidence.dateUploaded || Date.now()),
    assessmentStatus: spEvidence.assessmentStatus,
    assessorFeedback: spEvidence.assessorFeedback || '',
    assessorName: spEvidence.assessorName || '',
    assessmentDate: spEvidence.assessmentDate ? new Date(spEvidence.assessmentDate) : undefined,
    criteriaCode: spEvidence.criteriaCode || '',
    unitCode: spEvidence.unitCode || '',
    sharePointUrl: spEvidence.webUrl,
    fileUrl: spEvidence.downloadUrl
  };
};

// Helper to convert EvidenceMetadata (from useEvidence hook) to Model.Evidence for PendingEvidenceView
const metadataToModelEvidence = (metadata: EvidenceMetadata): ModelEvidence => {
  console.log('Converting evidence metadata to model:', metadata);
  
  // Create cleaner title from webUrl if name is missing
  let title = metadata.name || '';
  if (!title && metadata.webUrl) {
    try {
      const url = new URL(metadata.webUrl);
      const pathParts = url.pathname.split('/');
      title = pathParts[pathParts.length - 1] || 'Unknown';
      // Remove URL encoding
      title = decodeURIComponent(title);
    } catch (e) {
      console.warn('Failed to extract filename from URL:', e);
      title = 'Unknown';
    }
  }
  
  return {
    id: metadata.id || '',
    title: title,
    description: metadata.description || '',
    dateUploaded: metadata.createdDateTime 
      ? new Date(metadata.createdDateTime) 
      : new Date(),
    assessmentStatus: metadata.assessmentStatus || AssessmentStatus.Pending,
    assessorFeedback: metadata.assessorFeedback || '',
    assessorName: metadata.assessorName || '',
    assessmentDate: metadata.assessmentDate 
      ? new Date(metadata.assessmentDate) 
      : undefined,
    criteriaCode: metadata.criteriaCode || '',
    unitCode: metadata.unitCode || '',
    sharePointUrl: metadata.webUrl || '',
    fileUrl: metadata.downloadUrl || ''
  };
};

// Helper to create dynamic unit objects from evidence data
const createDynamicUnits = (evidence: EvidenceMetadata[]): Unit[] => {
  // Group evidence by unit code
  const unitMap = new Map<string, EvidenceMetadata[]>();
  
  evidence.forEach(item => {
    if (item.unitCode) {
      if (!unitMap.has(item.unitCode)) {
        unitMap.set(item.unitCode, []);
      }
      unitMap.get(item.unitCode)!.push(item);
    }
  });
  
  // Convert to units array
  return Array.from(unitMap.entries()).map(([unitCode, unitEvidence]) => {
    // Group evidence by criteria code
    const criteriaMap = new Map<string, EvidenceMetadata[]>();
    
    unitEvidence.forEach(item => {
      if (item.criteriaCode) {
        if (!criteriaMap.has(item.criteriaCode)) {
          criteriaMap.set(item.criteriaCode, []);
        }
        criteriaMap.get(item.criteriaCode)!.push(item);
      }
    });
    
    // Create performance criteria
    const performanceCriteria: PerformanceCriteria[] = Array.from(criteriaMap.entries()).map(([criteriaCode, criteriaEvidence]) => {
      // Determine status based on evidence
      const hasApproved = criteriaEvidence.some(e => e.assessmentStatus === AssessmentStatus.Approved);
      const hasPending = criteriaEvidence.some(e => e.assessmentStatus === AssessmentStatus.Pending);
      
      let status: 'not-started' | 'pending' | 'approved' = 'not-started';
      if (hasApproved) status = 'approved';
      else if (hasPending) status = 'pending';
      
      return {
        code: criteriaCode,
        description: `Evidence for criteria ${criteriaCode}`,
        status
      };
    });
    
    // Group criteria by learning outcome (assuming criteria codes are formatted as LO.PC, e.g., "1.1")
    const learningOutcomeMap = new Map<string, PerformanceCriteria[]>();
    
    performanceCriteria.forEach(pc => {
      const parts = pc.code.split('.');
      const loNumber = parts[0] || '1';
      
      if (!learningOutcomeMap.has(loNumber)) {
        learningOutcomeMap.set(loNumber, []);
      }
      learningOutcomeMap.get(loNumber)!.push(pc);
    });
    
    // Create learning outcomes
    const learningOutcomes: LearningOutcome[] = Array.from(learningOutcomeMap.entries()).map(([loNumber, loCriteria]) => {
      return {
        number: loNumber,
        title: `Learning Outcome ${loNumber}`,
        performanceCriteria: loCriteria
      };
    });
    
    return {
      id: unitCode,
      code: unitCode,
      displayCode: unitCode,
      reference: unitCode,
      title: `Unit ${unitCode}`,
      type: 'ewa' as any,
      learningOutcomes
    };
  });
};

export default function PortfolioPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [evidenceItems, setEvidenceItems] = useState<ModelEvidence[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isCompiling, setIsCompiling] = useState(false);
  const [portfolioUrl, setPortfolioUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'evidence' | 'progress'>('evidence');
  
  const siteUrl = typeof window !== 'undefined' ? localStorage.getItem('sharepointSiteUrl') || undefined : undefined;

  const { evidence, isLoading: evidenceLoading, error: evidenceError, uploadEvidence, refreshEvidence, deleteEvidence } = useEvidence({
    unitCode: 'ALL',
    criteriaCode: 'ALL',
    siteUrl
  });

  // Create dynamic units based on evidence
  const dynamicUnits = React.useMemo(() => {
    return createDynamicUnits(evidence);
  }, [evidence]);

  // Get the actual units with evidence
  const unitsWithEvidence = React.useMemo(() => {
    return dynamicUnits;
  }, [dynamicUnits]);
  
  // Selected unit state
  const [selectedUnitCode, setSelectedUnitCode] = useState<string | null>(null);
  
  // Get the selected unit or first unit with evidence
  const selectedUnit = React.useMemo(() => {
    if (selectedUnitCode) {
      return dynamicUnits.find(u => u.code === selectedUnitCode) || null;
    }
    return dynamicUnits.length > 0 ? dynamicUnits[0] : null;
  }, [selectedUnitCode, dynamicUnits]);

  // Add state for viewing evidence details
  const [selectedEvidenceForView, setSelectedEvidenceForView] = useState<ModelEvidence | null>(null);

  useEffect(() => {
    const loadEvidence = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Convert evidence from hook to ModelEvidence format
        const modelEvidence = evidence.map(metadataToModelEvidence);
        setEvidenceItems(modelEvidence);
      } catch (err) {
        console.error('Portfolio: Error processing evidence:', err);
        setError(err instanceof Error ? err.message : 'Failed to process evidence');
      } finally {
        setIsLoading(false);
      }
    };

    // Only load evidence when the hook's evidence is available and not loading
    if (!evidenceLoading && evidence.length >= 0) { // Changed from > 0 to >= 0
      loadEvidence();
    }
  }, [evidence, evidenceLoading]);

  // Show loading state while evidence is being fetched
  if (evidenceLoading || isLoading) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg">Loading evidence...</p>
        </div>
      </div>
    );
  }

  // Check if SharePoint URL is configured
  const sharePointUrl = typeof window !== 'undefined' ? localStorage.getItem('sharepointSiteUrl') : null;
  if (!sharePointUrl) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
        <div className="text-center max-w-lg mx-auto px-4">
          <div className="text-yellow-500 text-xl mb-4">SharePoint URL Not Configured</div>
          <p className="text-gray-400 mb-4">
            You need to configure your SharePoint site URL in the Profile section before you can view evidence.
          </p>
          <button 
            onClick={() => router.push('/profile')}
            className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
          >
            Go to Profile
          </button>
        </div>
      </div>
    );
  }

  // Show error state if there's an error
  if (evidenceError || error) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
        <div className="text-center max-w-lg mx-auto px-4">
          <div className="text-red-500 text-xl mb-4">Error loading evidence</div>
          <p className="text-gray-400">{evidenceError || error}</p>
          <button 
            onClick={() => refreshEvidence()}
            className="mt-4 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="max-w-4xl mx-auto px-4 py-8 pb-safe"> {/* Using pb-safe utility class */}
        <h1 className="text-2xl font-bold mb-6">Portfolio</h1>
        
        {/* Tab Navigation */}
        <div className="flex space-x-4 mb-6">
          <button
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'evidence'
                ? 'bg-blue-600 text-white'
                : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
            }`}
            onClick={() => {
              setActiveTab('evidence');
              // Refresh evidence data when switching to Evidence tab
              refreshEvidence();
            }}
          >
            Evidence
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'progress'
                ? 'bg-blue-600 text-white'
                : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
            }`}
            onClick={() => setActiveTab('progress')}
          >
            Progress
          </button>
        </div>

        {/* Evidence viewing modal */}
        {selectedEvidenceForView && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-neutral-900 rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-bold mb-4">{selectedEvidenceForView.title}</h3>
              
              {selectedEvidenceForView.description && (
                <div className="mb-4">
                  <p className="text-sm text-gray-300">{selectedEvidenceForView.description}</p>
                </div>
              )}
              
              <div className="mb-4">
                <p className="text-sm text-gray-400">Uploaded: {new Date(selectedEvidenceForView.dateUploaded).toLocaleDateString()}</p>
                <p className="text-sm text-gray-400">Unit: {selectedEvidenceForView.unitCode}</p>
                <p className="text-sm text-gray-400">Criteria: {selectedEvidenceForView.criteriaCode}</p>
                
                {selectedEvidenceForView.assessmentStatus !== 'not-started' && (
                  <p className="text-sm text-gray-400 mt-2">
                    Status: {selectedEvidenceForView.assessmentStatus.charAt(0).toUpperCase() + selectedEvidenceForView.assessmentStatus.slice(1)}
                  </p>
                )}
                
                {selectedEvidenceForView.assessorFeedback && (
                  <div className="mt-2 bg-neutral-800 p-2 rounded">
                    <p className="text-xs text-gray-400">Feedback:</p>
                    <p className="text-sm">{selectedEvidenceForView.assessorFeedback}</p>
                  </div>
                )}
              </div>
              
              <div className="flex justify-between">
                <div>
                  {selectedEvidenceForView.fileUrl && (
                    <a 
                      href={selectedEvidenceForView.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 mr-4"
                    >
                      Download
                    </a>
                  )}
                  
                  {selectedEvidenceForView.sharePointUrl && (
                    <a 
                      href={selectedEvidenceForView.sharePointUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300"
                    >
                      View in SharePoint
                    </a>
                  )}
                </div>
                <button
                  onClick={() => setSelectedEvidenceForView(null)}
                  className="px-4 py-2 bg-neutral-700 rounded hover:bg-neutral-600"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content */}
              <div className="bg-neutral-900 rounded-2xl shadow-lg p-6">
        {activeTab === 'evidence' ? (
          <div>
            <h2 className="text-xl font-semibold mb-4">Evidence</h2>
            {evidenceLoading ? (
              <div className="text-center py-8 text-gray-500">Loading evidence...</div>
            ) : evidenceError ? (
              <div className="text-center py-8 text-red-500">Error: {evidenceError}</div>
            ) : evidenceItems.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No evidence found. Upload evidence for your qualifications through the Progress tab or Criteria page.
              </div>
            ) : (
              <EvidenceDisplay
                evidence={evidenceItems}
                onDeleteEvidence={async (evidenceId: string) => {
                  try {
                    // Use the deleteEvidence function from the useEvidence hook
                    await deleteEvidence(evidenceId);
                    
                    // Update local evidenceItems state after deletion
                    setEvidenceItems(prev => prev.filter(item => item.id !== evidenceId));
                    
                    // Show success message
                    setError(null);
                  } catch (err) {
                    setError(err instanceof Error ? err.message : 'Failed to delete evidence');
                  }
                }}
                siteUrl={siteUrl}
              />
            )}
          </div>
        ) : (
            <div>
              <h2 className="text-xl font-semibold mb-4">Progress</h2>
              
              {unitsWithEvidence.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No units with evidence found. Upload evidence for your qualifications to track your progress.
                </div>
              ) : (
                <>
                  {/* Unit selector */}
                  {unitsWithEvidence.length > 1 && (
                    <div className="mb-4">
                      <label className="block text-sm text-gray-400 mb-1">Select Unit:</label>
                      <select 
                        className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2"
                        value={selectedUnit?.code || ''}
                        onChange={(e) => setSelectedUnitCode(e.target.value)}
                      >
                        {unitsWithEvidence.map(unit => (
                          <option key={unit.code} value={unit.code}>
                            {unit.displayCode} - {unit.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  
                  {/* Display selected unit progress */}
                  {selectedUnit && selectedUnit.learningOutcomes ? (
                    <div>
                      <UnitProgress 
                        unitCode={selectedUnit.code} 
                        learningOutcomes={selectedUnit.learningOutcomes.map(lo => ({
                          ...lo,
                          number: typeof lo.number === 'string' ? parseInt(lo.number, 10) : Number(lo.number),
                          performanceCriteria: lo.performanceCriteria.map(pc => ({
                            ...pc,
                          }))
                        }))}
                        onCriteriaClick={(criteriaCode) => {
                          // Find evidence for this criteria
                          const matchingEvidence = evidenceItems.filter(item => 
                            item.unitCode === selectedUnit.code && 
                            item.criteriaCode === criteriaCode
                          );
                          
                          // If evidence exists, show it instead of opening upload dialog
                          if (matchingEvidence.length > 0) {
                            // Show the first item (could be enhanced to show all)
                            setSelectedEvidenceForView(matchingEvidence[0]);
                          }
                        }}
                      />
                      
                      {/* Optional upload button for progress view */}
                      <div className="mt-6 flex justify-end">
                        <button
                          className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
                          onClick={() => router.push(`/criteria?unit=${selectedUnit.code}`)}
                        >
                          Add More Evidence
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      Selected unit has no learning outcomes defined.
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {activeTab === 'progress' && selectedUnit && (
          <div className="mt-6">
            <ProgressView 
              evidence={evidenceItems.filter(e => {
                // Case-insensitive unit code comparison
                if (!e.unitCode || !selectedUnit.code) return false;
                
                // Do case-insensitive comparison of unit codes
                const unitMatches = e.unitCode.toLowerCase() === selectedUnit.code.toLowerCase();
                
                return unitMatches;
              })}
              unitCode={selectedUnit.code}
              criteriaCount={selectedUnit.learningOutcomes?.reduce(
                (count, lo) => count + lo.performanceCriteria.length, 0
              ) || 0}
            />
          </div>
        )}

        {/* Compilation Button */}
        <div className="mt-6">
          <button
            className="w-full bg-blue-600 text-white font-semibold rounded-xl px-8 py-3 shadow-lg text-lg active:scale-95 transition-all disabled:opacity-50"
            onClick={async () => {
              setIsCompiling(true);
              try {
                const compilationService = PortfolioCompilationService.getInstance();
                const portfolioBlob = await compilationService.compilePortfolio(evidenceItems);
                const url = await compilationService.uploadPortfolioToSharePoint(evidenceItems, portfolioBlob);
                setPortfolioUrl(url);
              } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to compile portfolio');
              } finally {
                setIsCompiling(false);
              }
            }}
            disabled={isCompiling || evidenceItems.length === 0}
          >
            {isCompiling ? 'Compiling...' : 'Compile Portfolio'}
          </button>
        </div>

        {error && (
          <div className="mt-4 bg-red-100 text-red-700 px-4 py-2 rounded">
            {error}
          </div>
        )}

        {portfolioUrl && (
          <div className="mt-4">
            <a
              href={portfolioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300"
            >
              View Compiled Portfolio
            </a>
          </div>
        )}
      </div>
      
      <BottomNavigation />
    </div>
  );
} 