import { useState, useCallback, useEffect } from 'react';
import { Evidence } from '../models/Evidence';
import { SharePointService, EvidenceMetadata, AssessmentStatus } from '../services/SharePointService';
import { AssessmentService, AssessmentUpdate } from '../services/AssessmentService';

interface UseEvidenceProps {
  unitCode: string;
  criteriaCode: string;
  siteUrl?: string;
}

interface UseEvidenceReturn {
  evidence: EvidenceMetadata[];
  isLoading: boolean;
  error: string | null;
  uploadEvidence: (file: File, currentUnitCode: string, currentCriteriaCode: string, title?: string, description?: string) => Promise<void>;
  updateAssessment: (evidenceId: string, update: AssessmentUpdate) => Promise<void>;
  refreshEvidence: () => Promise<void>;
  deleteEvidence: (evidenceId: string) => Promise<void>;
}

export function useEvidence({ unitCode, criteriaCode, siteUrl }: UseEvidenceProps): UseEvidenceReturn {
  const [evidence, setEvidence] = useState<EvidenceMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Start with true
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const sharePointService = SharePointService.getInstance();
  const assessmentService = AssessmentService.getInstance();

  const refreshEvidence = useCallback(async () => {
    console.log('useEvidence: refreshEvidence called, isInitialized:', isInitialized);
    if (!isInitialized) {
      console.log('useEvidence: Not initialized, returning early');
      return; // Don't refresh if not initialized
    }

    try {
      console.log('useEvidence: Setting loading to true');
      setIsLoading(true);
      setError(null);
      
      const effectiveCriteriaCode = !criteriaCode || criteriaCode.trim() === '' ? 'ALL' : criteriaCode;
      
      console.log(`useEvidence: Refreshing evidence for unit=${unitCode}, criteria=${effectiveCriteriaCode}`);
      
      let evidenceList: EvidenceMetadata[] = [];
      
      // Try to get evidence from AssessmentService first
      try {
        console.log('useEvidence: Trying AssessmentService...');
        evidenceList = await assessmentService.getEvidenceForCriteria(unitCode, effectiveCriteriaCode);
        console.log(`useEvidence: Found ${evidenceList.length} items via AssessmentService`);
        
        evidenceList = evidenceList.map(item => ({
          ...item,
          createdDateTime: item.createdDateTime instanceof Date ? item.createdDateTime : new Date(item.createdDateTime),
          lastModifiedDateTime: item.lastModifiedDateTime instanceof Date ? item.lastModifiedDateTime : new Date(item.lastModifiedDateTime),
          assessmentStatus: item.assessmentStatus || AssessmentStatus.Pending,
          assessorFeedback: item.assessorFeedback || '',
          assessorName: item.assessorName || '',
          assessmentDate: item.assessmentDate || undefined
        }));
      } catch (err) {
        console.warn('useEvidence: Failed to fetch evidence from AssessmentService:', err);
        // Don't set error here, try SharePoint fallback
      }

      // If AssessmentService failed, try SharePoint
      if (evidenceList.length === 0) {
        try {
          console.log('useEvidence: Trying SharePoint service...');
          const spEvidence = await sharePointService.getEvidence();
          console.log(`useEvidence: Found ${spEvidence.length} items via SharePoint`);
          evidenceList = spEvidence.map(item => ({
            id: item.id,
            name: item.title,
            webUrl: item.webUrl,
            downloadUrl: item.downloadUrl,
            size: 0,
            mimeType: getMimeTypeFromFileName(item.title),
            createdDateTime: new Date(item.dateUploaded),
            lastModifiedDateTime: new Date(item.dateUploaded),
            assessmentStatus: item.assessmentStatus || AssessmentStatus.Pending,
            assessorFeedback: item.assessorFeedback || '',
            assessorName: item.assessorName || '',
            assessmentDate: item.assessmentDate ? new Date(item.assessmentDate) : undefined,
            criteriaCode: item.criteriaCode,
            unitCode: item.unitCode,
            description: item.description || ''
          }));
        } catch (spErr) {
          console.error('useEvidence: SharePoint evidence fetch failed:', spErr);
          throw spErr; // Let the error propagate
        }
      }

      console.log('useEvidence: Setting evidence with', evidenceList.length, 'items');
      setEvidence(evidenceList);
    } catch (err) {
      console.error('useEvidence: Error in refreshEvidence:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch evidence');
    } finally {
      console.log('useEvidence: Setting loading to false');
      setIsLoading(false);
    }
  }, [unitCode, criteriaCode, siteUrl, isInitialized]);

  // Initialize on mount
  useEffect(() => {
    const initialize = async () => {
      try {
        console.log('useEvidence: Starting initialization...');
        
        // Add a timeout to prevent infinite loading
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Authentication timeout')), 30000); // 30 second timeout
        });
        
        const authPromise = sharePointService.authenticate();
        
        await Promise.race([authPromise, timeoutPromise]);
        
        console.log('useEvidence: Authentication successful, setting initialized to true');
        setIsInitialized(true);
      } catch (err) {
        console.error('useEvidence: Initialization failed:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize - please check your authentication');
        setIsLoading(false);
      }
    };
    initialize();
  }, []);

  // Fetch evidence when initialized or dependencies change
  useEffect(() => {
    console.log('useEvidence: Effect triggered, isInitialized:', isInitialized);
    if (isInitialized) {
      console.log('useEvidence: Calling refreshEvidence...');
      refreshEvidence();
    }
  }, [refreshEvidence, isInitialized]);

  // Add a fallback timeout to prevent infinite loading
  useEffect(() => {
    if (isLoading && isInitialized) {
      const timeout = setTimeout(() => {
        console.log('useEvidence: Loading timeout reached, setting empty evidence');
        setEvidence([]);
        setIsLoading(false);
      }, 15000); // 15 second timeout for evidence loading
      
      return () => clearTimeout(timeout);
    }
  }, [isLoading, isInitialized]);

  // Helper to determine MIME type from filename
  const getMimeTypeFromFileName = (filename: string): string => {
    if (!filename) return 'application/octet-stream';
    
    const extension = filename.toLowerCase().split('.').pop();
    
    switch (extension) {
      case 'png':
        return 'image/png';
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'gif':
        return 'image/gif';
      case 'pdf':
        return 'application/pdf';
      case 'doc':
        return 'application/msword';
      case 'docx':
        return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      case 'xls':
        return 'application/vnd.ms-excel';
      case 'xlsx':
        return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      case 'ppt':
        return 'application/vnd.ms-powerpoint';
      case 'pptx':
        return 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
      case 'txt':
        return 'text/plain';
      // Add video file formats with proper MIME types
      case 'mp4':
        return 'video/mp4';
      case 'mov':
        return 'video/quicktime';
      case 'avi':
        return 'video/x-msvideo';
      case 'wmv':
        return 'video/x-ms-wmv';
      case 'mpg':
      case 'mpeg':
        return 'video/mpeg';
      case 'webm':
        return 'video/webm';
      case 'mkv':
        return 'video/x-matroska';
      case '3gp':
        return 'video/3gpp';
      default:
        return 'application/octet-stream';
    }
  };

  const uploadEvidence = useCallback(async (file: File, currentUnitCode: string, currentCriteriaCode: string, title?: string, description?: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Validate file content with better logging
      console.log(`File validation: name=${file.name}, type=${file.type}, size=${file.size} bytes`);
      
      if (!file) {
        setError("No file provided");
        throw new Error("No file provided");
      }
      
      // Only check size if it's actually zero - some browsers might report inaccurate sizes initially
      if (file.size === 0) {
        console.warn("File appears to be empty, attempting to read it to verify");
        
        // Try to actually read the file to verify if it's really empty
        try {
          const reader = new FileReader();
          const fileDataPromise = new Promise<boolean>((resolve) => {
            reader.onload = () => {
              const result = reader.result;
              const hasContent = result && 
                ((typeof result === 'string' && result.length > 0) || 
                (result instanceof ArrayBuffer && result.byteLength > 0));
              resolve(!!hasContent); // Ensure we always resolve with a boolean
            };
            reader.onerror = () => resolve(false);
          });
          
          // Start reading a small slice of the file
          reader.readAsArrayBuffer(file.slice(0, 1024));
          
          // Wait for the result
          const hasContent = await fileDataPromise;
          if (!hasContent) {
            setError("Cannot upload empty file");
            throw new Error("File is empty");
          } else {
            console.log("File contains data despite zero size, proceeding with upload");
          }
        } catch (readError) {
          console.error("Error reading file:", readError);
          // Continue anyway, let the server decide if it's valid
        }
      }
      
      console.log('useEvidence: starting uploadEvidence', {
        file: file.name,
        type: file.type,
        size: file.size,
        unitCode: currentUnitCode, 
        criteriaCode: currentCriteriaCode, 
        title, 
        description
      });
      
      // Build the folder path structure for this file
      // Create individual criteria folders instead of combined folders
      // Evidence/Unit_Code/Criteria_Code
      const sanitizedUnitCode = currentUnitCode.replace(/\./g, '_');
      
      // For individual criteria codes, use the exact criteria code
      // For combined criteria (e.g. "1.1_1.2_1.3"), create a folder for each criteria
      const criteriaCodes = currentCriteriaCode.split('_').filter(code => code.trim());
      
      // Use the first criteria code for the folder name (most common case)
      // This ensures assessors can find evidence in the expected structure
      const primaryCriteriaCode = criteriaCodes[0] || currentCriteriaCode;
      const sanitizedCriteriaCode = primaryCriteriaCode.replace(/\./g, '_');
      
      // Ensure the file goes into the Evidence folder structure with the proper nesting
      // Make sure the folder path starts with "Evidence" folder and has the unit and criteria subfolders
      const folderPath = `Evidence/${sanitizedUnitCode}/${sanitizedCriteriaCode}`;
      console.log('useEvidence: uploading to folder path:', folderPath);
      console.log('useEvidence: criteria codes:', criteriaCodes, 'using primary:', primaryCriteriaCode);
      
      // Validate and prepare the file name and MIME type
      let finalFileName = file.name;
      
      // For PNG files, ensure the extension is correct
      const isPNG = file.type === 'image/png' || file.name.toLowerCase().endsWith('.png');
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/') || 
                     ['.mp4', '.mov', '.avi', '.wmv', '.mpg', '.mpeg', '.webm', '.mkv', '.3gp']
                     .some(ext => file.name.toLowerCase().endsWith(ext));
      
      // Ensure proper file extension for common formats
      if (isPNG && !finalFileName.toLowerCase().endsWith('.png')) {
        finalFileName = finalFileName.replace(/\.[^/.]+$/, '') + '.png';
        console.log('useEvidence: fixed PNG filename to', finalFileName);
      }
      
      // For JPEG files, ensure the extension is correct
      if (file.type === 'image/jpeg' && !finalFileName.toLowerCase().match(/\.(jpg|jpeg)$/)) {
        finalFileName = finalFileName.replace(/\.[^/.]+$/, '') + '.jpg';
        console.log('useEvidence: fixed JPEG filename to', finalFileName);
      }
      
      // For video files, ensure the correct MIME type and extension
      let fileType = file.type;
      if (isVideo && !fileType.startsWith('video/')) {
        // Determine MIME type from file extension if browser didn't detect it
        fileType = getMimeTypeFromFileName(finalFileName);
        console.log('useEvidence: updated video MIME type to', fileType);
      }
      
      try {
        let uploadedFileMetadata: EvidenceMetadata;
        
        // Use the appropriate upload method based on file type
        if (isVideo) {
          console.log('useEvidence: using chunked upload for video file:', finalFileName);
          
          // Create a copy of the file with the correct MIME type if needed
          let videoFile = file;
          if (file.type !== fileType) {
            videoFile = new File([await file.arrayBuffer()], finalFileName, { type: fileType });
          }
          
          // Use direct chunked upload via session approach for videos
          const sharePointService = SharePointService.getInstance();
          
          // First create the folder structure and get an upload session
          const uploadSession = await sharePointService.createUploadSession(finalFileName, folderPath);
          
          // Then upload the file in chunks
          console.log('useEvidence: uploading video in chunks via session:', uploadSession.uploadUrl);
          await sharePointService.uploadFile(videoFile, uploadSession.uploadUrl, finalFileName, 
            (progress) => console.log(`Video upload progress: ${progress.toFixed(0)}%`));
          
          // After successful upload, get the metadata
          console.log('useEvidence: video upload completed, fetching metadata');
          uploadedFileMetadata = await sharePointService.fetchEvidenceMetadata(uploadSession.webUrl);
          
          // Add any missing fields
          uploadedFileMetadata = {
            ...uploadedFileMetadata,
            name: uploadedFileMetadata.name || finalFileName,
            size: uploadedFileMetadata.size || file.size,
            mimeType: uploadedFileMetadata.mimeType || fileType,
            criteriaCode: currentCriteriaCode,
            unitCode: currentUnitCode
          };
          
          console.log('useEvidence: video upload metadata:', uploadedFileMetadata);
        } else if (isImage) {
          console.log('useEvidence: using specialized image upload for', finalFileName);
          uploadedFileMetadata = await sharePointService.uploadImageFile(file, folderPath, finalFileName);
          console.log('useEvidence: image upload completed successfully with metadata:', uploadedFileMetadata);
        } else {
          // For non-image, non-video files, use the standard approach
          console.log('useEvidence: using standard upload for', finalFileName);
          await sharePointService.uploadEvidence(file, folderPath, finalFileName);
          
          // When creating evidence metadata, fix the date format
          const evidenceMetadata: EvidenceMetadata = {
            id: crypto.randomUUID(),
            name: finalFileName,
            size: file.size,
            mimeType: file.type,
            createdDateTime: new Date(),
            lastModifiedDateTime: new Date(),
            assessmentStatus: AssessmentStatus.Pending,
            criteriaCode: currentCriteriaCode,
            unitCode: currentUnitCode,
            description: description || ''
          };
          
          // Add to local state for immediate display
          setEvidence(prev => [...prev, evidenceMetadata]);
          
          console.log('useEvidence: added evidence to local state:', evidenceMetadata);
          
          // Wait a moment to ensure the file is fully processed by SharePoint
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // Refresh to get the updated evidence after upload
          await refreshEvidence();
        }
      } catch (uploadError) {
        console.error('useEvidence: upload failed:', uploadError);
        
        // Try again with PNG-specific method for PNG files
        if (isPNG) {
          try {
            console.log('useEvidence: trying PNG-specific upload as fallback');
            const uploadedFileMetadata = await sharePointService.uploadPngFile(file, folderPath, finalFileName);
            
            // Add the evidence to local state
            const evidenceItem: EvidenceMetadata = {
              ...uploadedFileMetadata,
              name: title || finalFileName,
              criteriaCode: currentCriteriaCode,
              unitCode: currentUnitCode,
              description: description || '',
              assessmentStatus: AssessmentStatus.Pending
            };
            
            setEvidence(prev => [...prev, evidenceItem]);
            
            console.log('useEvidence: PNG-specific upload succeeded:', evidenceItem);
            
            // Wait and refresh
            await new Promise(resolve => setTimeout(resolve, 2000));
            await refreshEvidence();
            return;
          } catch (pngError) {
            console.error('useEvidence: PNG-specific upload also failed:', pngError);
            setError('Failed to upload PNG file: ' + (pngError instanceof Error ? pngError.message : 'Unknown error'));
            throw pngError;
          }
        }
        
        // Check if this is a 429 error (too many requests)
        if (uploadError instanceof Error && uploadError.message.includes('429')) {
          setError('SharePoint is currently rate limiting requests. Please wait a moment and try again.');
        } else {
          setError(uploadError instanceof Error ? uploadError.message : 'Upload failed');
        }
        
        throw uploadError;
      }
    } catch (error) {
      console.error('useEvidence: failed to upload evidence:', error);
      setError(error instanceof Error ? error.message : 'Unknown error occurred during upload');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [refreshEvidence]);

  const updateAssessment = useCallback(async (evidenceId: string, update: AssessmentUpdate) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const evidenceToUpdate = evidence.find(e => e.id === evidenceId);
      if (!evidenceToUpdate?.webUrl) {
        throw new Error('Evidence not found or not uploaded to SharePoint');
      }

      const updatedEvidence = await assessmentService.updateAssessmentStatus(
        evidenceToUpdate.webUrl,
        {
          ...update,
          assessorName: update.assessorName || 'Unknown Assessor'
        }
      );

      // Update the local state with the new assessment status
      setEvidence(prev => prev.map(e => 
        e.id === evidenceId ? { ...e, ...updatedEvidence } : e
      ));
      
      // Also refresh to make sure we have the latest data
      await refreshEvidence();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update assessment');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [evidence, refreshEvidence]);

  const deleteEvidence = useCallback(async (evidenceId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Find the evidence item in the current state
      const evidenceToDelete = evidence.find(e => e.id === evidenceId);
      if (!evidenceToDelete?.webUrl) {
        throw new Error('Evidence not found or not uploaded to SharePoint');
      }

      console.log(`useEvidence: Deleting evidence ${evidenceId} at URL ${evidenceToDelete.webUrl}`);
      
      // Call the SharePoint service to delete the file
      await sharePointService.deleteFile(evidenceToDelete.webUrl);
      
      // Remove the deleted evidence from local state
      setEvidence(prev => prev.filter(e => e.id !== evidenceId));
      
      console.log(`useEvidence: Successfully deleted evidence ${evidenceId}`);
    } catch (err) {
      console.error('useEvidence: Failed to delete evidence:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete evidence');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [evidence]);

  return {
    evidence,
    isLoading,
    error,
    uploadEvidence,
    updateAssessment,
    refreshEvidence,
    deleteEvidence
  };
} 