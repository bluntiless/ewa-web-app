import React, { useState } from 'react';
import { Evidence, AssessmentStatus } from '../models/Evidence';

interface PendingEvidenceViewProps {
  evidence: Evidence[];
  onAssessmentUpdate: (evidenceId: string, status: AssessmentStatus, feedback?: string) => void;
  onDeleteEvidence?: (evidenceId: string) => Promise<void>;
  siteUrl?: string;
}

// Helper function to safely format a SharePoint Person field
const formatPersonField = (personField: any): string => {
  if (!personField) return '';
  
  // If it's already a string, return it
  if (typeof personField === 'string') return personField;
  
  // If it's a SharePoint person object with LookupValue
  if (personField.LookupValue) return personField.LookupValue;
  
  // If it has Email property
  if (personField.Email) return personField.Email;
  
  // If it's another type of object, convert to string representation
  if (typeof personField === 'object') {
    // Try to extract a useful property or stringify
    return personField.Title || personField.DisplayName || personField.Name || 
           personField.UserName || 'Unknown User';
  }
  
  // Default fallback
  return 'Unknown';
};

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
  } else {
    return '/file-icons/generic.png';
  }
};

export const PendingEvidenceView: React.FC<PendingEvidenceViewProps> = ({
  evidence,
  onAssessmentUpdate,
  onDeleteEvidence,
  siteUrl
}) => {
  const [feedbackTexts, setFeedbackTexts] = useState<{[key: string]: string}>({});
  const [viewMode, setViewMode] = useState<'all' | 'pending' | 'hidden'>('all');
  const [hiddenItems, setHiddenItems] = useState<Set<string>>(new Set());
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  
  // Filter evidence based on view mode and hidden state
  const filteredEvidence = evidence.filter(e => {
    // Skip hidden items when not in 'hidden' mode
    if (viewMode !== 'hidden' && hiddenItems.has(e.id)) return false;
    
    // When in 'hidden' mode, only show hidden items
    if (viewMode === 'hidden') return hiddenItems.has(e.id);
    
    // When in 'pending' mode, only show pending items
    if (viewMode === 'pending') return e.assessmentStatus === AssessmentStatus.Pending;
    
    // In 'all' mode, show everything except hidden items
    return true;
  });

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

  // Helper function to check if we should show assessment controls
  // Only show if not already approved
  const shouldShowAssessmentControls = (status: AssessmentStatus): boolean => {
    return status !== AssessmentStatus.Approved;
  };

  // Handle assessment update with feedback
  const handleAssessmentUpdate = (evidenceId: string, status: AssessmentStatus) => {
    const feedback = feedbackTexts[evidenceId] || '';
    onAssessmentUpdate(evidenceId, status, feedback);
    
    // Clear feedback after submission
    setFeedbackTexts(prev => {
      const newFeedback = {...prev};
      delete newFeedback[evidenceId];
      return newFeedback;
    });
  };
  
  // Handle hiding an evidence item
  const toggleHideItem = (evidenceId: string) => {
    setHiddenItems(prev => {
      const newHidden = new Set(prev);
      if (newHidden.has(evidenceId)) {
        newHidden.delete(evidenceId);
      } else {
        newHidden.add(evidenceId);
      }
      return newHidden;
    });
  };
  
  // Handle delete evidence
  const handleDeleteEvidence = async (evidenceId: string) => {
    if (!onDeleteEvidence) return;
    
    try {
      await onDeleteEvidence(evidenceId);
      setConfirmDelete(null);
      // After deletion, hide the item as well
      setHiddenItems(prev => {
        const newHidden = new Set(prev);
        newHidden.add(evidenceId);
        return newHidden;
      });
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

  const hiddenCount = hiddenItems.size;
  const pendingCount = evidence.filter(e => e.assessmentStatus === AssessmentStatus.Pending).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Evidence {viewMode !== 'all' && `(${viewMode})`}</h2>
        <div className="flex space-x-2">
          <button 
            className={`px-3 py-1 text-sm rounded ${viewMode === 'all' ? 'bg-blue-600' : 'bg-neutral-800'}`}
            onClick={() => setViewMode('all')}
          >
            All ({evidence.length - hiddenCount})
          </button>
          <button 
            className={`px-3 py-1 text-sm rounded ${viewMode === 'pending' ? 'bg-blue-600' : 'bg-neutral-800'}`}
            onClick={() => setViewMode('pending')}
          >
            Pending ({pendingCount})
          </button>
          <button 
            className={`px-3 py-1 text-sm rounded ${viewMode === 'hidden' ? 'bg-blue-600' : 'bg-neutral-800'}`}
            onClick={() => setViewMode('hidden')}
          >
            Hidden ({hiddenCount})
          </button>
        </div>
      </div>

      {filteredEvidence.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No {viewMode} evidence found
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEvidence.map((item) => (
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
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-semibold">{item.title}</h3>
                      <p className="text-sm text-gray-400">{item.description}</p>
                    </div>
                    {getStatusBadge(item.assessmentStatus)}
                  </div>

                  {/* Assessment controls */}
                  {shouldShowAssessmentControls(item.assessmentStatus) && (
                    <div className="mt-4 space-y-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleAssessmentUpdate(item.id, AssessmentStatus.Approved)}
                          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleAssessmentUpdate(item.id, AssessmentStatus.Rejected)}
                          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => handleAssessmentUpdate(item.id, AssessmentStatus.NeedsRevision)}
                          className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
                        >
                          Needs Revision
                        </button>
                      </div>

                      {/* Feedback textarea */}
                      <div>
                        <textarea
                          value={feedbackTexts[item.id] || ''}
                          onChange={(e) => setFeedbackTexts(prev => ({...prev, [item.id]: e.target.value}))}
                          placeholder="Add feedback..."
                          className="w-full p-2 bg-neutral-800 rounded text-white"
                          rows={3}
                        />
                      </div>
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="mt-4 flex justify-end space-x-2">
                    <button
                      onClick={() => toggleHideItem(item.id)}
                      className="px-3 py-1 text-sm bg-neutral-800 rounded hover:bg-neutral-700"
                    >
                      {hiddenItems.has(item.id) ? 'Unhide' : 'Hide'}
                    </button>
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
      )}

      {/* Delete confirmation modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
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
