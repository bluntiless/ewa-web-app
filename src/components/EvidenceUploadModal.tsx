import React, { useState, useCallback } from 'react';
import { useEvidence } from '../hooks/useEvidence';
import { AssessmentStatus } from '../services/SharePointService';

interface EvidenceUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  unitCode: string;
  criteriaCodes: string[];
  siteUrl?: string;
}

export const EvidenceUploadModal: React.FC<EvidenceUploadModalProps> = ({
  isOpen,
  onClose,
  unitCode,
  criteriaCodes,
  siteUrl
}) => {


  const [selectedFiles, setSelectedFiles] = useState<{ [key: string]: File }>({});
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [error, setError] = useState<string | null>(null);
  const [titles, setTitles] = useState<{ [key: string]: string }>({});
  const [narratives, setNarratives] = useState<{ [key: string]: string }>({});

  const { uploadEvidence, isLoading } = useEvidence({
    unitCode,
    criteriaCode: criteriaCodes[0],
    siteUrl
  });

  const handleFileSelect = useCallback((criteriaCode: string, file: File) => {
    setSelectedFiles(prev => ({ ...prev, [criteriaCode]: file }));
    setUploadProgress(prev => ({ ...prev, [criteriaCode]: 0 }));
  }, []);

  const handleTitleChange = (criteriaCode: string, value: string) => {
    setTitles(prev => ({ ...prev, [criteriaCode]: value }));
  };

  const handleNarrativeChange = (criteriaCode: string, value: string) => {
    setNarratives(prev => ({ ...prev, [criteriaCode]: value }));
  };

  const handleUpload = useCallback(async () => {
    try {
      setError(null);
      
      const uploadPromises = Object.entries(selectedFiles).map(async ([criteriaCodeFromFile, file]) => {
        try {
          // Optionally, rename the file to include the title
          let uploadFile = file;
          if (titles[criteriaCodeFromFile]) {
            const ext = file.name.split('.').pop();
            const newName = `${titles[criteriaCodeFromFile].replace(/[^a-zA-Z0-9-_]/g, '_')}.${ext}`;
            
            // Create a proper File object - important to preserve the content!
            const blob = file.slice(0, file.size, file.type);
            uploadFile = new File([blob], newName, { type: file.type });
          }

          // Use the hook's upload function
          await uploadEvidence(
            uploadFile,
            unitCode,
            criteriaCodeFromFile,
            titles[criteriaCodeFromFile],
            narratives[criteriaCodeFromFile]
          );
          
          setUploadProgress(prev => ({
            ...prev,
            [criteriaCodeFromFile]: 100
          }));
        } catch (err) {
          setError(`Error uploading ${file.name}: ${err instanceof Error ? err.message : 'Unknown error'}`);
          return false;
        }
        return true;
      });

      const results = await Promise.all(uploadPromises);
      
      if (results.every(Boolean)) {
        // All uploads successful
        onClose();
      }
    } catch (err) {
      setError(`Upload failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }, [selectedFiles, titles, narratives, uploadEvidence, unitCode, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-4">Upload Evidence</h2>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        <div className="space-y-4">
          {criteriaCodes.map(criteriaCode => (
            <div key={criteriaCode} className="border rounded p-4">
              <h3 className="font-semibold mb-2">Criteria {criteriaCode}</h3>
              
              {/* Enhanced Evidence Details Section */}
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <h4 className="text-blue-800 font-medium mb-2">Evidence Details</h4>
                <div className="mb-3">
                  <label className="block text-gray-700 mb-1 font-medium">Title</label>
                  <input
                    type="text"
                    value={titles[criteriaCode] || ''}
                    onChange={e => handleTitleChange(criteriaCode, e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded px-3 py-2"
                    placeholder="Enter a descriptive title for this evidence"
                    disabled={isLoading}
                  />
                </div>
                <div className="mb-2">
                  <label className="block text-gray-700 mb-1 font-medium">Description</label>
                  <textarea
                    value={narratives[criteriaCode] || ''}
                    onChange={e => handleNarrativeChange(criteriaCode, e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded px-3 py-2"
                    placeholder="Add details about this evidence and how it demonstrates your competence"
                    rows={3}
                    disabled={isLoading}
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileSelect(criteriaCode, file);
                  }}
                  className="flex-1"
                  disabled={isLoading}
                />
                {selectedFiles[criteriaCode] && (
                  <span className="text-sm text-gray-600">
                    {selectedFiles[criteriaCode].name}
                  </span>
                )}
              </div>
              {uploadProgress[criteriaCode] > 0 && (
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${uploadProgress[criteriaCode]}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={isLoading || Object.keys(selectedFiles).length === 0}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </div>
    </div>
  );
}; 