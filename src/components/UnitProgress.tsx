import React, { useState, useCallback, useMemo } from 'react';
import { useEvidence } from '../hooks/useEvidence';
import { EvidenceUploadModal } from './EvidenceUploadModal';
import { AssessmentStatus } from '../services/SharePointService';

interface UnitProgressProps {
  unitCode: string;
  learningOutcomes: {
    number: number;
    title: string;
    performanceCriteria: {
      code: string;
      description: string;
    }[];
  }[];
  onCriteriaClick?: (criteriaCode: string) => void;
}

export const UnitProgress: React.FC<UnitProgressProps> = ({
  unitCode,
  learningOutcomes,
  onCriteriaClick
}) => {
  const [selectedCriteria, setSelectedCriteria] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedOutcome, setExpandedOutcome] = useState<number | null>(null);
  
  console.log('UnitProgress rendered with unitCode:', unitCode);
  console.log('UnitProgress has learningOutcomes:', learningOutcomes.length);
  
  const { evidence, isLoading, refreshEvidence } = useEvidence({
    unitCode,
    criteriaCode: selectedCriteria[0] || ''
  });

  console.log('UnitProgress evidence from hook:', evidence.length);

  const getCriteriaStatus = useCallback((criteriaCode: string): AssessmentStatus => {
    // Get evidence for this criteria
    const criteriaEvidence = evidence.filter(e => 
      e.criteriaCode === criteriaCode || e.webUrl?.includes(criteriaCode.replace(/\./g, '_'))
    );

    // Log evidence only when there's something to report
    if (criteriaEvidence.length > 0) {
      console.log(`Found ${criteriaEvidence.length} evidence items for criteria ${criteriaCode}:`, 
        criteriaEvidence.map(e => ({
          status: e.assessmentStatus,
          assessor: e.assessorName,
          date: e.assessmentDate
        }))
      );
    }

    if (criteriaEvidence.length === 0) {
      return AssessmentStatus.NotStarted;
    }

    const hasApproved = criteriaEvidence.some(e => 
      e.assessmentStatus === AssessmentStatus.Approved
    );

    // Check if this unit requires two occasions
    const requiresTwoOccasions = ["NETP3-01", "NETP3-03", "NETP3-04", "NETP3-06", "NETP3-07"].includes(unitCode);
    
    if (hasApproved) {
      if (requiresTwoOccasions) {
        // For units that require two occasions, we need at least 2 approved evidence items
        const approvedEvidence = criteriaEvidence.filter(e => e.assessmentStatus === AssessmentStatus.Approved);
        if (approvedEvidence.length >= 2) {
          return AssessmentStatus.Approved;
        } else {
          // Has some approved evidence but not enough for two occasions
          return AssessmentStatus.Pending;
        }
      } else {
        // For other units, any approved evidence is sufficient
        return AssessmentStatus.Approved;
      }
    }

    const hasPending = criteriaEvidence.some(e => 
      e.assessmentStatus === AssessmentStatus.Pending
    );

    const hasRejected = criteriaEvidence.some(e => 
      e.assessmentStatus === AssessmentStatus.Rejected
    );

    const hasNeedsRevision = criteriaEvidence.some(e => 
      e.assessmentStatus === AssessmentStatus.NeedsRevision
    );

    if (hasRejected) {
      return AssessmentStatus.Rejected;
    }

    if (hasNeedsRevision) {
      return AssessmentStatus.NeedsRevision;
    }

    return hasPending ? AssessmentStatus.Pending : AssessmentStatus.NotStarted;
  }, [evidence, unitCode]);

  const handleCriteriaSelect = useCallback((criteriaCode: string) => {
    console.log('Criteria selected:', criteriaCode);
    
    // Check if criteria already has evidence
    const status = getCriteriaStatus(criteriaCode);
    
    // If criteria has any type of evidence and a click handler is provided, use that
    if ((status !== AssessmentStatus.NotStarted) && onCriteriaClick) {
      console.log('Criteria has evidence, calling onCriteriaClick');
      onCriteriaClick(criteriaCode);
      return;
    }
    
    // Otherwise handle selection for uploading
    setSelectedCriteria(prev => {
      if (prev.includes(criteriaCode)) {
        console.log('Removing criteria from selection:', criteriaCode);
        return prev.filter(code => code !== criteriaCode);
      }
      console.log('Adding criteria to selection:', criteriaCode);
      return [...prev, criteriaCode];
    });
  }, [onCriteriaClick, getCriteriaStatus]);

  const handleUploadClick = useCallback(() => {
    console.log('Upload button clicked, selected criteria:', selectedCriteria);
    if (selectedCriteria.length > 0) {
      setIsModalOpen(true);
      console.log('Modal should be open now:', true);
    }
  }, [selectedCriteria]);

  const handleModalClose = useCallback(() => {
    console.log('Modal closed');
    setIsModalOpen(false);
    refreshEvidence();
  }, [refreshEvidence]);

  const toggleOutcome = useCallback((outcomeNumber: number) => {
    setExpandedOutcome(current => current === outcomeNumber ? null : outcomeNumber);
  }, []);

  // Calculate progress for each learning outcome
  const outcomesWithProgress = useMemo(() => {
    return learningOutcomes.map(lo => {
      const totalCriteria = lo.performanceCriteria.length;
      const approvedCriteria = lo.performanceCriteria.filter(pc => 
        getCriteriaStatus(pc.code) === AssessmentStatus.Approved
      ).length;
      const pendingCriteria = lo.performanceCriteria.filter(pc => 
        getCriteriaStatus(pc.code) === AssessmentStatus.Pending || 
        getCriteriaStatus(pc.code) === AssessmentStatus.NeedsRevision || 
        getCriteriaStatus(pc.code) === AssessmentStatus.Rejected
      ).length;
      
      const percentComplete = totalCriteria > 0 ? Math.round((approvedCriteria / totalCriteria) * 100) : 0;
      
      return {
        ...lo,
        progress: percentComplete,
        approved: approvedCriteria,
        pending: pendingCriteria,
        total: totalCriteria
      };
    });
  }, [learningOutcomes, getCriteriaStatus]);

  // Calculate overall unit progress
  const unitProgress = useMemo(() => {
    const totalCriteria = learningOutcomes.reduce((sum, lo) => sum + lo.performanceCriteria.length, 0);
    const approvedCriteria = evidence.filter(e => e.assessmentStatus === AssessmentStatus.Approved).length;
    
    return totalCriteria > 0 ? Math.round((approvedCriteria / totalCriteria) * 100) : 0;
  }, [learningOutcomes, evidence]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Progress</h2>
        {selectedCriteria.length > 0 && (
          <button
            onClick={handleUploadClick}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
          >
            Upload Evidence ({selectedCriteria.length})
          </button>
        )}
      </div>
      
      {/* EXPERIENCED WORKER ASSESSMENT label */}
      <div className="text-gray-400 text-lg font-medium uppercase mb-2">
        EXPERIENCED WORKER ASSESSMENT
      </div>

      <div className="space-y-6">
        {/* Unit with progress bar (like iOS app) */}
        <div className="bg-neutral-900 rounded-xl p-6">
          <div className="mb-2">
            <h3 className="text-xl font-bold">{unitCode} {unitCode.includes("NETP") ? "Organise and Oversee the Electrical Work Environment" : ""}</h3>
          </div>
          
          <div className="flex items-center">
            <div className="flex-1 mr-4">
              <div className="bg-neutral-800 rounded-lg h-4 overflow-hidden">
                <div 
                  className="bg-green-500 h-full"
                  style={{ width: `${unitProgress}%` }}
                />
              </div>
            </div>
            <span className="text-xl font-bold">{unitProgress}%</span>
          </div>
        </div>
        
        {/* Learning outcomes accordion sections */}
        {outcomesWithProgress.map(lo => (
          <div key={lo.number} className="bg-neutral-900 rounded-xl overflow-hidden">
            {/* Learning Outcome header - always visible */}
            <div 
              className="p-6 cursor-pointer"
              onClick={() => toggleOutcome(lo.number)}
            >
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <h3 className="font-bold text-lg">
                    {lo.title}
                  </h3>
                </div>
                <div className="ml-4">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-6 w-6 transition-transform duration-300 ${expandedOutcome === lo.number ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Performance Criteria - only shown when expanded */}
            {expandedOutcome === lo.number && (
              <div className="px-6 pb-6 border-t border-neutral-800">
                <div className="mt-4 space-y-4">
                  {lo.performanceCriteria.map(pc => {
                    const status = getCriteriaStatus(pc.code);
                    const isSelected = selectedCriteria.includes(pc.code);
                    const hasEvidence = status === AssessmentStatus.Approved || 
                                         status === AssessmentStatus.Pending || 
                                         status === AssessmentStatus.Rejected || 
                                         status === AssessmentStatus.NeedsRevision;
                    
                    let statusColor = 'bg-gray-600'; // default
                    let statusText = '';
                    let textColor = 'text-white';
                    let descriptionColor = 'text-gray-400';
                    
                    if (status === AssessmentStatus.Approved) {
                      statusColor = 'bg-green-500';
                      statusText = 'Approved - Click to view';
                      textColor = 'text-green-400'; // Light green for completed criteria
                      descriptionColor = 'text-green-500'; // Slightly darker green for description
                    } else if (status === AssessmentStatus.Pending) {
                      statusColor = 'bg-yellow-500';
                      statusText = 'Evidence uploaded - Click to view';
                    } else if (status === AssessmentStatus.Rejected) {
                      statusColor = 'bg-red-500';
                      statusText = 'Rejected - Click to view feedback';
                    } else if (status === AssessmentStatus.NeedsRevision) {
                      statusColor = 'bg-orange-500';
                      statusText = 'Needs revision - Click to view feedback';
                    }

                    return (
                      <div
                        key={pc.code}
                        className={`flex items-start p-4 rounded-xl cursor-pointer transition-colors duration-200 ${
                          isSelected ? 'bg-blue-900/30 border border-blue-500/50' : 'bg-neutral-800'
                        } ${status === AssessmentStatus.Approved ? 'opacity-80' : ''}`}
                        onClick={() => {
                          if (hasEvidence && onCriteriaClick) {
                            onCriteriaClick(pc.code);
                          } else {
                            handleCriteriaSelect(pc.code);
                          }
                        }}
                      >
                        <div className="mr-3 mt-1">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleCriteriaSelect(pc.code)}
                            className="h-5 w-5 rounded border-gray-500 text-blue-600 focus:ring-blue-500"
                            disabled={hasEvidence} // Disable checkbox if there's already evidence
                            onClick={(e) => e.stopPropagation()} // Prevent row click from triggering
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center">
                            <span className={`font-medium text-base ${textColor}`}>{pc.code}</span>
                            <div className={`ml-2 w-3 h-3 rounded-full ${statusColor}`} />
                          </div>
                          <p className={`text-sm mt-1 ${descriptionColor}`}>{pc.description || `Performance criteria ${pc.code}`}</p>
                          {hasEvidence && (
                            <p className="text-xs text-blue-400 mt-1">
                              {statusText}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <EvidenceUploadModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        unitCode={unitCode}
        criteriaCodes={selectedCriteria}
      />
    </div>
  );
}; 