import { useState, useEffect } from 'react';
import FileViewer from './FileViewer';

interface EvidenceAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  evidenceItem: {
    id: string;
    name: string;
    webUrl?: string;
    status: string;
    assessorFeedback?: string;
  } | null;
  onAssessmentUpdate: (status: string, feedback: string) => Promise<void>;
}

export default function EvidenceAssessmentModal({
  isOpen,
  onClose,
  evidenceItem,
  onAssessmentUpdate
}: EvidenceAssessmentModalProps) {
  const [selectedStatus, setSelectedStatus] = useState(evidenceItem?.status || 'Pending');
  const [feedback, setFeedback] = useState(evidenceItem?.assessorFeedback || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Update local state when evidenceItem changes
  useEffect(() => {
    if (evidenceItem) {
      console.log('EvidenceAssessmentModal: Updating with new evidence item:', evidenceItem);
      setSelectedStatus(evidenceItem.status || 'Pending');
      setFeedback(evidenceItem.assessorFeedback || '');
      setSaveSuccess(false); // Reset success state
    }
  }, [evidenceItem]);

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
  };

  const handleSave = async () => {
    if (!evidenceItem) return;
    
    setIsUpdating(true);
    setSaveSuccess(false);
    try {
      await onAssessmentUpdate(selectedStatus, feedback);
      setSaveSuccess(true);
      // Show success message briefly before closing
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Failed to update assessment:', error);
      alert('Failed to save assessment. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleFeedbackBank = () => {
    setShowFeedbackModal(true);
  };

  const insertFeedbackTemplate = (template: string) => {
    setFeedback(template);
    setShowFeedbackModal(false);
  };

  if (!isOpen || !evidenceItem) return null;

  return (
    <>
      {/* Main Assessment Modal */}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-gray-800"
            >
              Done
            </button>
            <h2 className="text-lg font-semibold">{evidenceItem.name}</h2>
            <button
              onClick={() => evidenceItem.webUrl && window.open(evidenceItem.webUrl, '_blank')}
              className="text-blue-600 hover:text-blue-800"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex flex-col h-full">
            {/* File Preview Area */}
            <div className="flex-1 p-4 bg-gray-50">
              <div className="bg-white rounded-lg h-full overflow-hidden">
                <FileViewer
                  fileUrl={evidenceItem.webUrl}
                  fileName={evidenceItem.name}
                />
              </div>
            </div>

            {/* Assessment Section */}
            <div className="p-4 border-t">
              <h3 className="text-lg font-semibold mb-4">Assessment Status</h3>
              
              {/* Status Picker */}
              <div className="flex space-x-4 mb-6">
                <button
                  onClick={() => handleStatusChange('Approved')}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                    selectedStatus === 'Approved'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Approve</span>
                  </div>
                </button>

                <button
                  onClick={() => handleStatusChange('Rejected')}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                    selectedStatus === 'Rejected'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span>Reject</span>
                  </div>
                </button>

                <button
                  onClick={() => handleStatusChange('Pending')}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                    selectedStatus === 'Pending'
                      ? 'bg-gray-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Pending</span>
                  </div>
                </button>
              </div>

              {/* Feedback Section */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    ASSESSMENT FEEDBACK
                  </label>
                  <button
                    onClick={handleFeedbackBank}
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span>Feedback Bank</span>
                  </button>
                </div>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Enter your assessment feedback..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={4}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isUpdating}
                  className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                    saveSuccess 
                      ? 'bg-green-600 text-white' 
                      : isUpdating 
                        ? 'bg-blue-600 text-white opacity-50' 
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isUpdating ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Saving...</span>
                    </>
                  ) : saveSuccess ? (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Saved!</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <span>Save</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Bank Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="flex items-center justify-between p-4 border-b">
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <h3 className="text-lg font-semibold">Assessment Feedback</h3>
              <div className="w-8"></div>
            </div>
            
            <div className="p-4">
              <div className="space-y-3">
                <button
                  onClick={() => insertFeedbackTemplate('The supplied evidence meets the assessment criteria selected.')}
                  className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="font-medium text-gray-900">Approved - Meets Criteria</div>
                  <div className="text-sm text-gray-600">The supplied evidence meets the assessment criteria selected.</div>
                </button>
                
                <button
                  onClick={() => insertFeedbackTemplate('The evidence provided does not meet the required assessment criteria. Additional information or clarification is needed.')}
                  className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="font-medium text-gray-900">Rejected - Insufficient Evidence</div>
                  <div className="text-sm text-gray-600">The evidence provided does not meet the required assessment criteria.</div>
                </button>
                
                <button
                  onClick={() => insertFeedbackTemplate('Evidence is under review. Assessment will be completed once all criteria have been evaluated.')}
                  className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="font-medium text-gray-900">Pending - Under Review</div>
                  <div className="text-sm text-gray-600">Evidence is under review. Assessment will be completed once all criteria have been evaluated.</div>
                </button>
                
                <button
                  onClick={() => insertFeedbackTemplate('The evidence demonstrates good understanding but requires minor revisions to fully meet the assessment criteria.')}
                  className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="font-medium text-gray-900">Needs Revision - Minor Changes</div>
                  <div className="text-sm text-gray-600">The evidence demonstrates good understanding but requires minor revisions.</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
