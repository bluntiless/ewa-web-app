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
          className="mt-2 text-neutral-400 hover:text-white underline"
          onClick={onClose}
          disabled={isUploading}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default function Criteria() {
  const router = useRouter();
  const [unit, setUnit] = useState<Unit | null>(null);
  const [learningOutcomes, setLearningOutcomes] = useState<LearningOutcome[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCriteria, setSelectedCriteria] = useState<{ outcomeIdx: number; criteriaIdx: number }[]>([]);
  const [uploadingCriteria, setUploadingCriteria] = useState<{ outcomeIdx: number; criteriaIdx: number }[]>([]);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [uploadError, setUploadError] = useState<string | null>(null);
  const { account, loading: msalLoading, error } = useMsalAuth();
  const [localIsUploading, setLocalIsUploading] = useState(false);
  const [showTableView, setShowTableView] = useState(false);
  const [evidence, setEvidence] = useState<any[]>([]);

  // Get SharePoint site URL from localStorage
  const siteUrl = typeof window !== 'undefined' ? localStorage.getItem('sharepointSiteUrl') || undefined : undefined;

  // Use the hook for evidence upload
  const { uploadEvidence, isLoading: hookIsLoading } = useEvidence({
    unitCode: unit?.code || '',
    criteriaCode: '', // This will be specified during the upload call
    siteUrl
  });

  // Fetch evidence for the table view
  const { evidence: evidenceData, refreshEvidence } = useEvidence({
    unitCode: unit?.code || '',
    criteriaCode: '',
    siteUrl
  });

  useEffect(() => {
    // Get unit code from query string
    const unitCode = router.query.unit as string;
    const unitType = router.query.type as string;
    
    if (unitCode) {
      // Find the unit based on the type or from all units
      let selectedUnit: Unit | undefined;
      
      if (unitType) {
        // Search in the specific unit type array
        switch(unitType) {
          case 'ewa':
            selectedUnit = ewaUnits.find(u => u.code === unitCode);
            break;
          case 'nvq':
            selectedUnit = nvqUnits.find(u => u.code === unitCode);
            break;
          case 'rpl':
            selectedUnit = rplUnits.find(u => u.code === unitCode);
            break;

          default:
            selectedUnit = allUnits.find(u => u.code === unitCode);
        }
      } else {
        // Search in all units if type is not specified
        selectedUnit = allUnits.find(u => u.code === unitCode);
        

      }
      
      if (selectedUnit) {
        setUnit(selectedUnit);
        
        // Get learning outcomes from unit data
        const outcomes = selectedUnit.learningOutcomes || [];
        setLearningOutcomes(outcomes);
      }
      setLoading(false);
    }
  }, [router.query]);

  // Update evidence state when evidence data changes
  useEffect(() => {
    if (evidenceData) {
      setEvidence(evidenceData);
    }
  }, [evidenceData]);

  const handleCheckboxChange = (outcomeIndex: number, criteriaIndex: number) => {
    const key = `${outcomeIndex}-${criteriaIndex}`;
    const alreadySelected = selectedCriteria.some(sel => sel.outcomeIdx === outcomeIndex && sel.criteriaIdx === criteriaIndex);
    if (alreadySelected) {
      setSelectedCriteria(selectedCriteria.filter(sel => !(sel.outcomeIdx === outcomeIndex && sel.criteriaIdx === criteriaIndex)));
    } else {
      setSelectedCriteria([...selectedCriteria, { outcomeIdx: outcomeIndex, criteriaIdx: criteriaIndex }]);
    }
  };

  const handleModalClose = () => {
    if (localIsUploading) return; // Prevent closing while uploading
    setModalOpen(false);
    setSelectedCriteria([]);
    setUploadError(null);
  };

  const handleEvidenceUpload = async (type: string, files: FileList | null) => {
    if (!files || files.length === 0 || !unit) {
      return;
    }

    setUploadError(null);
    setLocalIsUploading(true);
    console.log(`Criteria: Starting upload of ${files.length} files of type ${type} for ${selectedCriteria.length} criteria`);
    
    try {
      // Keep track of which criteria are being uploaded
      setUploadingCriteria([...selectedCriteria]);
      
      // Convert FileList to array to make it easier to work with
      const fileArray = Array.from(files);
      
      // Collect all criteria codes for use in folder name
      const selectedCriteriaCodes = selectedCriteria.map(criteriaInfo => {
        const criteria = learningOutcomes[criteriaInfo.outcomeIdx].performanceCriteria[criteriaInfo.criteriaIdx];
        return criteria.code;
      });
      
      // Sort criteria codes to ensure consistent folder naming
      const sortedCriteriaCodes = [...selectedCriteriaCodes].sort();
      
      // Create a combined folder name with all selected criteria
      const combinedCriteriaCode = sortedCriteriaCodes.join('_');
      console.log(`Criteria: Using combined criteria code for folder: ${combinedCriteriaCode}`);
      
      // Upload each file once with the combined criteria code
      for (let fileIndex = 0; fileIndex < fileArray.length; fileIndex++) {
        const file = fileArray[fileIndex];
        
        if (!file) {
          console.error(`Criteria: No file available for upload`);
          setUploadError(`No file available for upload`);
          continue;
        }
        
        try {
          console.log(`Criteria: Uploading ${file.name} for combined criteria: ${combinedCriteriaCode}`);
          
          // Create a title that includes all criteria info
          const title = `${unit.code}_${combinedCriteriaCode}_evidence`;
          const description = `Evidence for ${unit.displayCode || unit.code} ${unit.title} - Criteria: ${sortedCriteriaCodes.join(', ')}`;
          
          // Create a new file with the same content to prevent consumption issues
          const newFile = new File(
            [await file.arrayBuffer()],
            file.name,
            { type: file.type }
          );
          
          // Upload the file once with the combined criteria code
          await uploadEvidence(newFile, unit.code, combinedCriteriaCode, title, description);
          
          console.log(`Criteria: Successfully uploaded evidence for combined criteria: ${combinedCriteriaCode}`);
          
          // Update the status for all selected criteria to reflect the upload
          const updatedOutcomes = [...learningOutcomes];
          
          // Mark all selected criteria as pending
          selectedCriteria.forEach(criteriaInfo => {
            const updatedCriteria = updatedOutcomes[criteriaInfo.outcomeIdx].performanceCriteria[criteriaInfo.criteriaIdx];
            updatedCriteria.status = 'pending';
          });
          
          setLearningOutcomes(updatedOutcomes);
        } catch (error) {
          console.error(`Criteria: Failed to upload evidence:`, error);
          setUploadError(`Failed to upload evidence: ${error instanceof Error ? error.message : 'Unknown error'}`);
          return; // Exit on first error
        }
      }
      
      // Force refresh the evidence for this unit to make sure it shows up in the portfolio
      try {
        // Import the services directly to force a refresh of all evidence
        const assessmentService = await import('../services/AssessmentService').then(
          module => module.AssessmentService.getInstance()
        );
        
        // Force refresh for ALL criteria for this unit
        await assessmentService.getEvidenceForCriteria(unit.code, 'ALL');
        console.log(`Criteria: Forced evidence refresh for unit ${unit.code}`);
      } catch (refreshError) {
        console.warn('Failed to force evidence refresh:', refreshError);
      }
      
      // All uploads successful, clear selected criteria and close modal
      setSelectedCriteria([]);
      setModalOpen(false);
      
    } catch (error) {
      console.error('Criteria: Overall upload process failed:', error);
      setUploadError(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLocalIsUploading(false);
      setUploadingCriteria([]);
    }
  };

  if (msalLoading) return <div>Loading authentication...</div>;
  if (error) return <div>Error: {String(error)}</div>;
  if (!account) return <div>Signing in...</div>;

  if (loading) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>;
  }

  if (!unit) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <div>Unit not found</div>
        <button className="text-blue-400 mt-4" onClick={() => router.push('/units')}>Return to Units</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <EvidenceModal
        open={modalOpen}
        onClose={handleModalClose}
        onUpload={handleEvidenceUpload}
        selectedCount={selectedCriteria.length}
        isUploading={localIsUploading}
      />
      <div className="max-w-lg mx-auto pt-8 pb-24 px-4">
        <button className="text-blue-400 mb-4" onClick={() => router.back()}>&larr; Back</button>
        <h1 className="text-3xl font-extrabold mb-8">Unit {unit.displayCode || unit.code}</h1>
        <div className="bg-neutral-900 rounded-2xl shadow-lg px-6 py-5 mb-8">
          <div className="text-base text-neutral-400 mb-1">{unit.displayCode || unit.code} {unit.title}</div>
        </div>
        
        {/* View Toggle Button */}
        <div className="mb-6 flex justify-center">
          <div className="bg-neutral-800 rounded-xl p-1 flex">
            <button
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                !showTableView 
                  ? 'bg-blue-600 text-white' 
                  : 'text-neutral-400 hover:text-white'
              }`}
              onClick={() => setShowTableView(false)}
            >
              Standard View
            </button>
            <button
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                showTableView 
                  ? 'bg-blue-600 text-white' 
                  : 'text-neutral-400 hover:text-white'
              }`}
              onClick={() => setShowTableView(true)}
            >
              Assessment Table
            </button>
          </div>
        </div>
        
        {uploadError && (
          <div className="mb-6 bg-red-900 text-white p-4 rounded-lg">
            {uploadError}
          </div>
        )}
        

        
        {selectedCriteria.length > 0 && (
          <div className="mb-6 flex justify-start">
            <button
              className="bg-blue-600 text-white font-semibold rounded-xl px-6 py-3 flex items-center gap-2 hover:bg-blue-700 transition shadow-lg"
              onClick={() => setModalOpen(true)}
            >
              <span role="img" aria-label="upload">⬆️</span> Upload Evidence for {selectedCriteria.length} Criteria
            </button>
          </div>
        )}
        {learningOutcomes.length > 0 ? (
          showTableView ? (
            // Assessment Table View
            <PerformanceCriteriaTable
              unitCode={unit.code}
              learningOutcomes={learningOutcomes}
              evidence={evidence}
              onCriteriaClick={(criteriaCode) => {
                // Handle criteria click in table view - could open evidence details
                console.log('Criteria clicked in table view:', criteriaCode);
              }}
            />
          ) : (
            // Standard View
            <div className="space-y-8">
              {learningOutcomes.map((outcome, outcomeIndex) => (
                <div key={outcome.number} className="space-y-4">
                  <div className="font-bold text-lg text-blue-400">Learning Outcome {outcome.number}: {outcome.title}</div>
                  {outcome.performanceCriteria && UnitModel.getSortedPerformanceCriteria(outcome.performanceCriteria).map((criteria, criteriaIndex) => {
                    let checkboxColor = 'text-neutral-400';
                    let textColor = 'text-white';
                    let descriptionColor = 'text-neutral-300';
                    
                    if (criteria.status === 'approved') {
                      checkboxColor = 'text-green-400';
                      textColor = 'text-green-400'; // Light green for completed criteria
                      descriptionColor = 'text-green-500'; // Slightly darker green for description
                    } else if (criteria.status === 'pending') {
                      checkboxColor = 'text-yellow-400';
                    }
                    
                    const isSelected = selectedCriteria.some(sel => sel.outcomeIdx === outcomeIndex && sel.criteriaIdx === criteriaIndex);
                    return (
                    <div key={criteria.code} className={`bg-neutral-900 rounded-xl px-4 py-3 flex items-center gap-3 ${criteria.status === 'approved' ? 'opacity-80' : ''}`}>
                      <input 
                        type="checkbox" 
                          checked={isSelected}
                        onChange={() => handleCheckboxChange(outcomeIndex, criteriaIndex)}
                          className={`form-checkbox h-5 w-5 bg-neutral-800 border-neutral-700 rounded focus:ring-blue-500 ${checkboxColor}`}
                          style={{ accentColor: criteria.status === 'approved' ? '#22c55e' : criteria.status === 'pending' ? '#facc15' : undefined }}
                          disabled={criteria.status === 'approved' || criteria.status === 'pending'}
                      />
                      <div>
                        <div className={`font-semibold ${textColor}`}>Criteria {criteria.code}</div>
                        <div className={`text-sm ${descriptionColor}`}>{criteria.description}</div>
                          {criteria.status === 'pending' && (
                            <div className="text-yellow-400 text-xs mt-1">Evidence uploaded, awaiting assessment</div>
                          )}
                          {criteria.status === 'approved' && (
                            <div className="text-green-400 text-xs mt-1">✓ Approved - No further action needed</div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="text-center text-neutral-400 py-8">
            No learning outcomes found for this unit.
          </div>
        )}
      </div>
      
      <BottomNavigation />
    </div>
  );
} 