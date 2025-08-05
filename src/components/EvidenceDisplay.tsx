import React, { useState } from 'react';
import { Evidence, AssessmentStatus } from '../models/Evidence';

interface EvidenceDisplayProps {
  evidence: Evidence[];
  onDeleteEvidence?: (evidenceId: string) => Promise<void>;
  onRefreshEvidence?: () => Promise<void>;
  siteUrl?: string;
}

// Function to determine file icon based on filename or URL
const getFileIcon = (filename: string, url?: string): string => {
  const lowerFilename = filename.toLowerCase();
  
  if (lowerFilename.endsWith('.pdf')) {
    return '/file-icons/pdf.png';
  } else if (lowerFilename.endsWith('.doc') || lowerFilename.endsWith('.docx')) {
    return '/file-icons/doc.png';
  } else if (lowerFilename.endsWith('.xls') || lowerFilename.endsWith('.xlsx')) {
    return '/file-icons/xls.png';
  } else if (lowerFilename.endsWith('.ppt') || lowerFilename.endsWith('.pptx')) {
    return '/file-icons/ppt.png';
  } else if (lowerFilename.match(/\.(jpg|jpeg|png|gif|bmp|webp)$/)) {
    // For images, try to use the actual image as thumbnail if we have URL
    return url || '/file-icons/image.png';
  } else if (lowerFilename.match(/\.(mp4|mov|avi|wmv|mpg|mpeg|webm|mkv|3gp)$/)) {
    return '/file-icons/video.png';
  } else if (lowerFilename.endsWith('.html') || lowerFilename.endsWith('.htm')) {
    return '/file-icons/generic.png'; // HTML files
  } else if (lowerFilename.endsWith('.txt')) {
    return '/file-icons/generic.png'; // Text files
  } else {
    return '/file-icons/generic.png';
  }
};

// Function to truncate long criteria codes for display
const truncateCriteriaCode = (criteriaCode: string, maxLength: number = 50): string => {
  if (criteriaCode.length <= maxLength) {
    return criteriaCode;
  }
  return criteriaCode.substring(0, maxLength) + '...';
};

export const EvidenceDisplay: React.FC<EvidenceDisplayProps> = ({
  evidence,
  onDeleteEvidence,
  onRefreshEvidence,
  siteUrl
}) => {
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (!onRefreshEvidence) return;
    
    try {
      setIsRefreshing(true);
      await onRefreshEvidence();
    } catch (error) {
      console.error('Failed to refresh evidence:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const getStatusBadge = (status: AssessmentStatus) => {
    switch(status) {
      case AssessmentStatus.Approved:
        return (
          <div className="flex items-center space-x-1">
            <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-green-500 font-medium">Approved</span>
          </div>
        );
      case AssessmentStatus.Rejected:
        return (
          <div className="flex items-center space-x-1">
            <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <span className="text-red-500 font-medium">Rejected</span>
          </div>
        );
      case AssessmentStatus.Pending:
        return (
          <div className="flex items-center space-x-1">
            <div className="w-5 h-5 rounded-full bg-yellow-500 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-yellow-500 font-medium">Pending</span>
          </div>
        );
      case AssessmentStatus.NeedsRevision:
        return (
          <div className="flex items-center space-x-1">
            <div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <span className="text-orange-500 font-medium">Needs Revision</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center space-x-1">
            <div className="w-5 h-5 rounded-full bg-gray-500 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-gray-500 font-medium">Not Started</span>
          </div>
        );
    }
  };

  // Handle delete evidence
  const handleDeleteEvidence = async (evidenceId: string) => {
    if (!onDeleteEvidence) return;
    
    try {
      await onDeleteEvidence(evidenceId);
      setConfirmDelete(null);
    } catch (error) {
      console.error('Failed to delete evidence:', error);
      alert('Failed to delete evidence. Please try again.');
    }
  };

  if (evidence.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No evidence found. Upload evidence for your qualifications through the Progress tab or Criteria page.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Evidence</h2>
        {onRefreshEvidence && (
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        )}
      </div>

      <div className="space-y-4">
        {evidence.map((item) => (
          <div key={item.id} className="bg-neutral-900 rounded-2xl overflow-hidden shadow-lg">
            <div className="flex flex-col md:flex-row">
              {/* File thumbnail/preview */}
              <div className="md:w-1/4 p-4 flex items-center justify-center bg-neutral-800">
                <div className="w-24 h-24 flex items-center justify-center">
                  <img 
                    src={getFileIcon(item.title, item.fileUrl)} 
                    alt={item.title}
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => {
                      // Fallback if image fails to load
                      e.currentTarget.src = '/file-icons/generic.png';
                    }}
                  />
                </div>
              </div>

              {/* Evidence details */}
              <div className="flex-1 p-4">
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-2 gap-2">
                  <div className="flex-1 min-w-0"> {/* min-w-0 allows text truncation */}
                    <h3 className="text-lg font-semibold break-words">{item.title}</h3>
                    
                    {/* Unit and criteria reference - like iOS app */}
                    <div className="mt-2">
                      <p className="text-sm text-gray-400 break-words">
                        Unit {item.unitCode} - {truncateCriteriaCode(item.criteriaCode)}
                      </p>
                    </div>
                    
                    {item.description && (
                      <p className="text-sm text-gray-400 mt-2 break-words">{item.description}</p>
                    )}
                  </div>
                  <div className="flex-shrink-0"> {/* Prevent status badge from shrinking */}
                    {getStatusBadge(item.assessmentStatus)}
                  </div>
                </div>

                {/* Assessment Info - like iOS app */}
                {item.assessmentStatus !== AssessmentStatus.NotStarted && (
                  <div className="mt-4 space-y-2">
                    {item.assessmentDate && (
                      <p className="text-sm text-gray-400">
                        Assessed {new Date(item.assessmentDate).toLocaleDateString()}
                      </p>
                    )}
                    
                    {item.assessorName && (
                      <p className="text-sm text-gray-400">
                        Assessor: {item.assessorName}
                      </p>
                    )}
                    
                    {item.assessorFeedback && (
                      <div className="mt-2 bg-neutral-800 p-3 rounded">
                        <p className="text-xs text-gray-400 mb-1">Feedback:</p>
                        <p className="text-sm">{item.assessorFeedback}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Upload Date */}
                <div className="mt-4">
                  <p className="text-sm text-gray-400">
                    Uploaded {new Date(item.dateUploaded).toLocaleDateString()}
                  </p>
                </div>

                {/* Action buttons */}
                <div className="mt-4 flex justify-end space-x-2">
                  {item.fileUrl && (
                    <a 
                      href={item.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Download
                    </a>
                  )}
                  
                  {item.sharePointUrl && (
                    <a 
                      href={item.sharePointUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 text-sm bg-neutral-800 rounded hover:bg-neutral-700"
                    >
                      View in SharePoint
                    </a>
                  )}
                  
                  {onDeleteEvidence && (
                    <button
                      onClick={() => setConfirmDelete(item.id)}
                      className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete confirmation modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-neutral-900 p-6 rounded-lg max-w-md">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="mb-6">Are you sure you want to delete this evidence? This action cannot be undone.</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 bg-neutral-800 rounded hover:bg-neutral-700"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteEvidence(confirmDelete)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
