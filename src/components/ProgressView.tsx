import React from 'react';
import { Evidence, AssessmentStatus } from '../models/Evidence';

interface ProgressViewProps {
  evidence: Evidence[];
  unitCode: string;
  criteriaCount: number;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  evidence,
  unitCode,
  criteriaCount
}) => {
  // Add debugging to see what's coming in
  console.log("ProgressView received:", {
    unitCode, 
    criteriaCount,
    evidence: evidence.map(e => ({
      id: e.id.substring(0, 8), // Only show part of ID for brevity
      unitCode: e.unitCode,
      criteriaCode: e.criteriaCode,
      status: e.assessmentStatus
    })),
    approvedCount: evidence.filter(e => e.assessmentStatus === AssessmentStatus.Approved).length
  });

  // Case-insensitive filter for unit code matching
  const unitEvidence = evidence.filter(e => 
    e.unitCode && e.unitCode.toLowerCase() === unitCode.toLowerCase()
  );
  
  console.log("After unit filtering:", {
    filteredCount: unitEvidence.length,
    approvedCount: unitEvidence.filter(e => e.assessmentStatus === AssessmentStatus.Approved).length
  });

  // Calculate progress metrics - fix case sensitivity issues
  const approvedCount = unitEvidence.filter(e => 
    e.assessmentStatus && e.assessmentStatus.toLowerCase() === AssessmentStatus.Approved.toLowerCase()
  ).length;
  const pendingCount = unitEvidence.filter(e => 
    e.assessmentStatus && e.assessmentStatus.toLowerCase() === AssessmentStatus.Pending.toLowerCase()
  ).length;
  const needsRevisionCount = unitEvidence.filter(e => 
    e.assessmentStatus && e.assessmentStatus.toLowerCase() === AssessmentStatus.NeedsRevision.toLowerCase()
  ).length;
  const rejectedCount = unitEvidence.filter(e => 
    e.assessmentStatus && e.assessmentStatus.toLowerCase() === AssessmentStatus.Rejected.toLowerCase()
  ).length;

  // Calculate percentages
  const approvedPercentage = criteriaCount > 0 ? (approvedCount / criteriaCount) * 100 : 0;
  const pendingPercentage = criteriaCount > 0 ? (pendingCount / criteriaCount) * 100 : 0;
  const needsRevisionPercentage = criteriaCount > 0 ? (needsRevisionCount / criteriaCount) * 100 : 0;
  const rejectedPercentage = criteriaCount > 0 ? (rejectedCount / criteriaCount) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Progress Summary */}
      <div className="bg-neutral-900 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Progress Summary</h2>
        
        {/* Progress Bar */}
        <div className="relative h-8 bg-neutral-800 rounded-full overflow-hidden">
          {/* Approved (Green) */}
          <div 
            className="absolute h-full bg-green-500"
            style={{ width: `${approvedPercentage}%` }}
          />
          
          {/* Pending (Yellow) */}
          <div 
            className="absolute h-full bg-yellow-500"
            style={{ 
              width: `${pendingPercentage}%`,
              left: `${approvedPercentage}%`
            }}
          />
          
          {/* Needs Revision (Orange) */}
          <div 
            className="absolute h-full bg-orange-500"
            style={{ 
              width: `${needsRevisionPercentage}%`,
              left: `${approvedPercentage + pendingPercentage}%`
            }}
          />
          
          {/* Rejected (Red) */}
          <div 
            className="absolute h-full bg-red-500"
            style={{ 
              width: `${rejectedPercentage}%`,
              left: `${approvedPercentage + pendingPercentage + needsRevisionPercentage}%`
            }}
          />
        </div>

        {/* Progress Stats */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-neutral-800 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-sm text-gray-400">Approved</span>
            </div>
            <p className="text-2xl font-semibold mt-2">{approvedCount}</p>
            <p className="text-sm text-gray-400">{approvedPercentage.toFixed(1)}%</p>
          </div>

          <div className="bg-neutral-800 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <span className="text-sm text-gray-400">Pending</span>
            </div>
            <p className="text-2xl font-semibold mt-2">{pendingCount}</p>
            <p className="text-sm text-gray-400">{pendingPercentage.toFixed(1)}%</p>
          </div>

          <div className="bg-neutral-800 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-orange-500" />
              <span className="text-sm text-gray-400">Needs Revision</span>
            </div>
            <p className="text-2xl font-semibold mt-2">{needsRevisionCount}</p>
            <p className="text-sm text-gray-400">{needsRevisionPercentage.toFixed(1)}%</p>
          </div>

          <div className="bg-neutral-800 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-sm text-gray-400">Rejected</span>
            </div>
            <p className="text-2xl font-semibold mt-2">{rejectedCount}</p>
            <p className="text-sm text-gray-400">{rejectedPercentage.toFixed(1)}%</p>
          </div>
        </div>

        {/* Overall Progress */}
        <div className="mt-6 pt-6 border-t border-neutral-800">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Overall Progress</h3>
            <span className="text-2xl font-bold text-green-500">
              {approvedPercentage.toFixed(1)}%
            </span>
          </div>
          <div className="mt-2 h-2 bg-neutral-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-500 transition-all duration-500"
              style={{ width: `${approvedPercentage}%` }}
            />
          </div>
          <p className="text-sm text-gray-400 mt-2">
            {approvedCount} of {criteriaCount} criteria completed
          </p>
        </div>
      </div>
    </div>
  );
}; 