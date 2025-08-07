import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';
import { ewaUnits } from '../data/ewaUnits';
import { nvqUnits, rplUnits, allUnits } from '../data/units';

import { Unit, LearningOutcome, PerformanceCriteria, UnitModel, UnitType } from '../models/Unit';
import BottomNavigation from '../components/BottomNavigation';
import { useMsalAuth } from '../lib/useMsalAuth';
import { useEvidence } from '../hooks/useEvidence';
import { SharePointService } from '../services/SharePointService';
import { PerformanceCriteriaTable } from '../components/PerformanceCriteriaTable';

function EvidenceModal({
  open,
  onClose,
  onUpload,
  selectedCount,
  isUploading
}: {
  open: boolean;
  onClose: () => void;
  onUpload: (type: string, files: FileList | null) => void;
  selectedCount: number;
  isUploading: boolean;
}) {
  const fileInputRef = {
    photo: useRef<HTMLInputElement>(null),
    video: useRef<HTMLInputElement>(null),
    document: useRef<HTMLInputElement>(null),
  };

  const handleButtonClick = (type: 'photo' | 'video' | 'document') => {
    fileInputRef[type].current?.click();
  };

  const handleFileChange = (type: string, e: React.ChangeEvent<HTMLInputElement>) => {
    onUpload(type, e.target.files);
    e.target.value = '';
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-neutral-900 rounded-2xl shadow-xl p-8 w-full max-w-md flex flex-col items-center">
        <div className="text-lg font-bold mb-4 text-white">
          Upload Evidence for {selectedCount} Criteria
        </div>
        <div className="w-full flex flex-col gap-4 mb-6">
          <button
            className="w-full bg-blue-600 text-white font-semibold rounded-xl px-6 py-3 flex items-center justify-center gap-2 hover:bg-blue-700 transition disabled:opacity-50"
            onClick={() => handleButtonClick('photo')}
            disabled={isUploading}
          >
            <span role="img" aria-label="camera">📷</span> Upload Photos
          </button>
          <input
            type="file"
            ref={fileInputRef.photo}
            accept="image/*"
            multiple
            style={{ display: 'none' }}
            onChange={e => handleFileChange('photo', e)}
            disabled={isUploading}
          />
          <button
            className="w-full bg-green-500 text-white font-semibold rounded-xl px-6 py-3 flex items-center justify-center gap-2 hover:bg-green-600 transition disabled:opacity-50"
            onClick={() => handleButtonClick('video')}
            disabled={isUploading}
          >
            <span role="img" aria-label="video">🎥</span> Upload Video
          </button>
          <input
            type="file"
            ref={fileInputRef.video}
            accept="video/*"
            multiple
            style={{ display: 'none' }}
            onChange={e => handleFileChange('video', e)}
            disabled={isUploading}
          />
          <button
            className="w-full bg-yellow-400 text-white font-semibold rounded-xl px-6 py-3 flex items-center justify-center gap-2 hover:bg-yellow-500 transition disabled:opacity-50"
            onClick={() => handleButtonClick('document')}
            disabled={isUploading}
          >
            <span role="img" aria-label="document">📄</span> Upload Document
          </button>
          <input
            type="file"
            ref={fileInputRef.document}
            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,text/plain,application/pdf"
            multiple
            style={{ display: 'none' }}
            onChange={e => handleFileChange('document', e)}
            disabled={isUploading}
          />
        </div>
        {isUploading && (
          <div className="mb-4 text-blue-400">
            Uploading... Please wait.
          </div>
        )}
        <button
          onClick={onClose}
          className="w-full bg-neutral-700 text-white font-semibold rounded-xl px-6 py-3 hover:bg-neutral-600 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

// Client-side only component
function CriteriaClient() {
  const router = useRouter();
  const { unit: unitCode, type: qualificationType } = router.query;
  const { account, loading: msalLoading, error } = useMsalAuth();
  const [selectedCriteria, setSelectedCriteria] = useState<Set<string>>(new Set());
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [currentUnit, setCurrentUnit] = useState<Unit | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Get the appropriate units based on qualification type
  const getUnits = (): Unit[] => {
    switch (qualificationType) {
      case UnitType.EWA:
        return ewaUnits;
      case UnitType.NVQ:
        return nvqUnits;
      case UnitType.RPL:
        return rplUnits;
      default:
        return allUnits;
    }
  };

  useEffect(() => {
    if (unitCode && typeof unitCode === 'string') {
      const units = getUnits();
      const unit = units.find(u => u.code === unitCode);
      setCurrentUnit(unit || null);
    }
  }, [unitCode, qualificationType]);

  const handleCheckboxChange = (outcomeIndex: number, criteriaIndex: number) => {
    const criteria = currentUnit?.learningOutcomes?.[outcomeIndex]?.performanceCriteria[criteriaIndex];
    if (!criteria) return;

    const criteriaKey = `${criteria.code}`;
    const newSelected = new Set(selectedCriteria);
    
    if (newSelected.has(criteriaKey)) {
      newSelected.delete(criteriaKey);
    } else {
      newSelected.add(criteriaKey);
    }
    
    setSelectedCriteria(newSelected);
  };

  const handleModalClose = () => {
    setShowUploadModal(false);
  };

  const handleEvidenceUpload = async (type: string, files: FileList | null) => {
    if (!files || files.length === 0 || !currentUnit) return;

    setIsUploading(true);
    try {
      // Convert FileList to array and upload each file
      const fileArray = Array.from(files);
      for (const file of fileArray) {
        // Upload logic would go here
        console.log(`Uploading ${file.name} for criteria: ${Array.from(selectedCriteria).join(', ')}`);
      }
      
      setSelectedCriteria(new Set());
      setShowUploadModal(false);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  if (msalLoading) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg">Loading authentication...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
        <div className="text-center max-w-lg mx-auto px-4">
          <div className="text-red-500 text-xl mb-4">Authentication Error</div>
          <p className="text-gray-400">{String(error)}</p>
        </div>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg">Signing in...</p>
        </div>
      </div>
    );
  }

  if (!currentUnit) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg">Unit not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="max-w-4xl mx-auto px-4 py-8 pb-safe">
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => router.back()}
            className="text-blue-400 hover:text-blue-300"
          >
            ← Back to Units
          </button>
        </div>

        <h1 className="text-3xl font-bold mb-8">{currentUnit.code} {currentUnit.title}</h1>

        <div className="space-y-8">
          {currentUnit.learningOutcomes?.map((outcome, outcomeIndex) => (
            <div key={outcomeIndex} className="bg-neutral-900 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">
                Learning Outcome {outcomeIndex + 1}: {outcome.title}
              </h2>
              
              <div className="space-y-4">
                {outcome.performanceCriteria.map((criteria, criteriaIndex) => (
                  <div key={criteriaIndex} className="border border-neutral-700 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={selectedCriteria.has(criteria.code)}
                        onChange={() => handleCheckboxChange(outcomeIndex, criteriaIndex)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">
                          {criteria.code}: {criteria.description}
                        </h3>
                        <p className="text-gray-400 mb-3">{criteria.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {selectedCriteria.size > 0 && (
          <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-40">
            <button
              onClick={() => setShowUploadModal(true)}
              disabled={isUploading}
              className="bg-blue-600 text-white font-semibold rounded-xl px-8 py-4 flex items-center gap-2 hover:bg-blue-700 transition disabled:opacity-50"
            >
              <span role="img" aria-label="upload">📤</span>
              Upload Evidence for {selectedCriteria.size} Criteria
            </button>
          </div>
        )}
      </div>

      <EvidenceModal
        open={showUploadModal}
        onClose={handleModalClose}
        onUpload={handleEvidenceUpload}
        selectedCount={selectedCriteria.size}
        isUploading={isUploading}
      />
      
      <BottomNavigation />
    </div>
  );
}

// Export as dynamic component with SSR disabled
export default dynamic(() => Promise.resolve(CriteriaClient), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
      <div className="text-center">
        <p className="text-lg">Loading...</p>
      </div>
    </div>
  )
}); 