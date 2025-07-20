import React, { useMemo } from 'react';
import { AssessmentStatus } from '../services/SharePointService';
import { LearningOutcome } from '../models/Unit';

interface PerformanceCriteriaTableProps {
  unitCode: string;
  learningOutcomes: LearningOutcome[];
  evidence: any[];
  onCriteriaClick?: (criteriaCode: string) => void;
}

export const PerformanceCriteriaTable: React.FC<PerformanceCriteriaTableProps> = ({
  unitCode,
  learningOutcomes,
  evidence,
  onCriteriaClick
}) => {
  // Check if this unit requires two occasions
  const requiresTwoOccasions = ["NETP3-01", "NETP3-03", "NETP3-04", "NETP3-06", "NETP3-07"].includes(unitCode);

  const getCriteriaEvidence = (criteriaCode: string) => {
    return evidence.filter(e => 
      e.criteriaCode === criteriaCode || e.webUrl?.includes(criteriaCode.replace(/\./g, '_'))
    ).sort((a, b) => {
      // Sort by assessment date if available, otherwise by upload date
      const dateA = a.assessmentDate ? new Date(a.assessmentDate) : new Date(a.dateUploaded);
      const dateB = b.assessmentDate ? new Date(b.assessmentDate) : new Date(b.dateUploaded);
      return dateA.getTime() - dateB.getTime();
    });
  };

  const getOccasionStatus = (criteriaCode: string, occasion: 1 | 2) => {
    const criteriaEvidence = getCriteriaEvidence(criteriaCode);
    const evidenceItem = criteriaEvidence[occasion - 1]; // First evidence is occasion 1, second is occasion 2
    
    if (!evidenceItem) {
      return {
        status: 'no-evidence' as const,
        text: 'No Evidence',
        className: 'text-gray-500'
      };
    }

    const status = evidenceItem.assessmentStatus;
    switch (status) {
      case AssessmentStatus.Approved:
        return {
          status: 'approved' as const,
          text: 'Approved',
          className: 'text-green-500 font-semibold'
        };
      case AssessmentStatus.Pending:
        return {
          status: 'pending' as const,
          text: 'Pending',
          className: 'text-yellow-500 font-semibold'
        };
      case AssessmentStatus.Rejected:
        return {
          status: 'rejected' as const,
          text: 'Rejected',
          className: 'text-red-500 font-semibold'
        };
      case AssessmentStatus.NeedsRevision:
        return {
          status: 'needs-revision' as const,
          text: 'Needs Revision',
          className: 'text-orange-500 font-semibold'
        };
      default:
        return {
          status: 'unknown' as const,
          text: 'Unknown',
          className: 'text-gray-400'
        };
    }
  };

  const isCriteriaComplete = (criteriaCode: string) => {
    if (!requiresTwoOccasions) {
      // For units that don't require two occasions, any approved evidence is sufficient
      const criteriaEvidence = getCriteriaEvidence(criteriaCode);
      return criteriaEvidence.some(e => e.assessmentStatus === AssessmentStatus.Approved);
    } else {
      // For units that require two occasions, both first and second must be approved
      const firstStatus = getOccasionStatus(criteriaCode, 1);
      const secondStatus = getOccasionStatus(criteriaCode, 2);
      return firstStatus.status === 'approved' && secondStatus.status === 'approved';
    }
  };

  const handleCriteriaClick = (criteriaCode: string) => {
    if (onCriteriaClick) {
      onCriteriaClick(criteriaCode);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-gray-400 text-lg font-medium uppercase mb-4">
        PERFORMANCE CRITERIA ASSESSMENT
      </div>

      {learningOutcomes.map(lo => (
        <div key={lo.number} className="bg-neutral-900 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-neutral-800">
            <h3 className="font-bold text-lg">
              Learning Outcome {lo.number}: {lo.title}
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-neutral-800">
                  <th className="p-4 text-left font-semibold text-sm">Criteria</th>
                  <th className="p-4 text-left font-semibold text-sm">Description</th>
                  <th className="p-4 text-left font-semibold text-sm">
                    First Occasion
                    <br />
                    <span className="text-xs text-gray-400">(includes location)</span>
                  </th>
                  {requiresTwoOccasions && (
                    <th className="p-4 text-left font-semibold text-sm">
                      Second Occasion
                      <br />
                      <span className="text-xs text-gray-400">(includes location)</span>
                    </th>
                  )}
                  <th className="p-4 text-left font-semibold text-sm">Complete</th>
                </tr>
              </thead>
              <tbody>
                {lo.performanceCriteria.map(pc => {
                  const firstOccasion = getOccasionStatus(pc.code, 1);
                  const secondOccasion = requiresTwoOccasions ? getOccasionStatus(pc.code, 2) : null;
                  const isComplete = isCriteriaComplete(pc.code);
                  
                  return (
                    <tr 
                      key={pc.code}
                      className={`border-b border-neutral-800 hover:bg-neutral-800/50 cursor-pointer ${
                        isComplete ? 'bg-green-900/20' : ''
                      }`}
                      onClick={() => handleCriteriaClick(pc.code)}
                    >
                      <td className="p-4 font-mono text-sm">{pc.code}</td>
                      <td className="p-4 text-sm">{pc.description}</td>
                      <td className="p-4">
                        <div className={firstOccasion.className}>
                          {firstOccasion.text}
                        </div>
                        {firstOccasion.status !== 'no-evidence' && (
                          <div className="text-xs text-blue-400 mt-1">
                            📁 SharePoint
                          </div>
                        )}
                      </td>
                      {requiresTwoOccasions && (
                        <td className="p-4">
                          <div className={secondOccasion.className}>
                            {secondOccasion.text}
                          </div>
                          {secondOccasion.status !== 'no-evidence' && (
                            <div className="text-xs text-blue-400 mt-1">
                              📁 SharePoint
                            </div>
                          )}
                        </td>
                      )}
                      <td className="p-4">
                        {isComplete && (
                          <span className="text-green-500 font-bold text-lg">✓</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}; 