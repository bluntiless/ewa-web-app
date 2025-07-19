import { SharePointService, AssessmentStatus, EvidenceMetadata } from './SharePointService';

export interface AssessmentUpdate {
  status: AssessmentStatus;
  feedback?: string;
  assessorName: string;
}

export class AssessmentService {
  private static instance: AssessmentService;
  private sharePointService: SharePointService;

  private constructor() {
    this.sharePointService = SharePointService.getInstance();
  }

  public static getInstance(): AssessmentService {
    if (!AssessmentService.instance) {
      AssessmentService.instance = new AssessmentService();
    }
    return AssessmentService.instance;
  }

  public async updateAssessmentStatus(
    evidenceUrl: string,
    update: AssessmentUpdate,
    siteUrl?: string
  ): Promise<EvidenceMetadata> {
    try {
      // Make sure we're authenticated first
      await this.sharePointService.authenticate();
      
      const driveId = await this.sharePointService['getDriveId']();
      const filePath = this.sharePointService['getRelativePath'](evidenceUrl);
      
      // Check for null client
      const client = this.sharePointService['client'];
      if (!client) {
        throw new Error('Graph client is not initialized');
      }

      await client
        .api(`/drives/${driveId}/root:/${filePath}:/listItem/fields`)
        .patch({
          AssessmentStatus: update.status,
          AssessorFeedback: update.feedback || '',
          AssessorName: update.assessorName,
          ModifiedDateTime: new Date().toISOString()
        });

      return await this.sharePointService.fetchEvidenceMetadata(evidenceUrl);
    } catch (error) {
      console.error('Failed to update assessment status:', error);
      throw new Error('Failed to update assessment status');
    }
  }

  public async getAssessmentStatus(evidenceUrl: string): Promise<EvidenceMetadata> {
    return await this.sharePointService.fetchEvidenceMetadata(evidenceUrl);
  }

  public async getEvidenceForCriteria(
    unitCode: string,
    criteriaCode: string
  ): Promise<EvidenceMetadata[]> {
    try {
      // Make sure we're authenticated first
      await this.sharePointService.authenticate();
      
      // Check for null client
      const client = this.sharePointService['client'];
      if (!client) {
        throw new Error('Graph client is not initialized');
      }
      
      const driveId = await this.sharePointService['getDriveId']();
      
      // Default to ALL if criteriaCode is empty
      if (!criteriaCode) {
        criteriaCode = 'ALL';
        console.log('AssessmentService: Empty criteria code, defaulting to ALL');
      }
      
      // Normalize the unit code for SharePoint compatibility - replace dots and hyphens with underscores
      const sanitizedUnitCode = unitCode.replace(/[.-]/g, '_');
      // Also try the original format for flexibility
      const alternateUnitCode = unitCode;
      
      // Log what we're looking for to help with debugging
      console.log(`AssessmentService: Looking for evidence for unit ${unitCode} (${sanitizedUnitCode}) with criteria ${criteriaCode}`);
      
      // If requesting ALL evidence, use a simpler approach to fetch everything from the unit folder
      if (criteriaCode === 'ALL') {
        console.log('AssessmentService: Fetching all evidence for unit', unitCode);
        
        // Get the Evidence folder first to see if it exists
        try {
          await client.api(`/drives/${driveId}/root:/Evidence`).get();
          
          // Get all items from the Evidence folder
          const response = await client.api(`/drives/${driveId}/root:/Evidence:/children`).get();
          
          // Find matching unit folders - try both sanitized and original format
          const unitFolders = response.value.filter((item: any) => 
            item.folder && (
              item.name === sanitizedUnitCode || 
              item.name === alternateUnitCode ||
              // Also check normalized forms without hyphens
              item.name === unitCode.replace(/-/g, '') ||
              // Try case-insensitive comparison for robustness
              item.name.toLowerCase() === sanitizedUnitCode.toLowerCase() ||
              item.name.toLowerCase() === alternateUnitCode.toLowerCase()
            )
          );
          
          console.log(`AssessmentService: Found ${unitFolders.length} matching unit folders:`, 
            unitFolders.map((f: any) => f.name).join(', '));
          
          if (unitFolders.length === 0) {
            console.log(`AssessmentService: No folders found for unit ${unitCode}`);
            return [];
          }
          
          // Collect all evidence files from all matching unit folders
          const evidencePromises: Promise<EvidenceMetadata[]>[] = [];
          
          for (const unitFolder of unitFolders) {
            try {
              console.log(`AssessmentService: Processing unit folder ${unitFolder.name}`);
              
              // Get all items from the unit folder
              const unitItems = await client.api(`/drives/${driveId}/items/${unitFolder.id}/children`).get();
              
              // Process each criteria folder
              const criteriaFolders = unitItems.value.filter((item: any) => item.folder);
              console.log(`AssessmentService: Found ${criteriaFolders.length} criteria folders in unit ${unitFolder.name}`);
              
              for (const criteriaFolder of criteriaFolders) {
                try {
                  console.log(`AssessmentService: Processing criteria folder ${criteriaFolder.name}`);
                  
                  // Get files in this criteria folder
                  const filesResponse = await client.api(`/drives/${driveId}/items/${criteriaFolder.id}/children`).get();
                  
                  // Process each file (filter locally for non-folder items)
                  const filePromises = filesResponse.value
                    .filter((item: any) => !item.folder)
                    .map((file: any) => {
                      if (file.webUrl) {
                        console.log(`AssessmentService: Found file ${file.name} in ${criteriaFolder.name}`);
                        return this.sharePointService.fetchEvidenceMetadata(file.webUrl);
                      }
                      return null;
                    })
                    .filter((p: Promise<EvidenceMetadata> | null) => p !== null);
                  
                  if (filePromises.length > 0) {
                    evidencePromises.push(Promise.all(filePromises));
                  }
                } catch (e) {
                  console.warn(`AssessmentService: Error processing criteria folder ${criteriaFolder.name}:`, e);
                }
              }
              
              // Also look for files directly in the unit folder (not in a criteria subfolder)
              const directFiles = unitItems.value.filter((item: any) => !item.folder && item.webUrl);
              if (directFiles.length > 0) {
                console.log(`AssessmentService: Found ${directFiles.length} files directly in unit folder ${unitFolder.name}`);
                const directFilePromises = directFiles.map((file: any) => {
                  return this.sharePointService.fetchEvidenceMetadata(file.webUrl);
                });
                
                if (directFilePromises.length > 0) {
                  evidencePromises.push(Promise.all(directFilePromises));
                }
              }
            } catch (unitError) {
              console.warn(`AssessmentService: Error processing unit folder ${unitFolder.name}:`, unitError);
            }
          }
          
          // Flatten and combine all evidence items
          if (evidencePromises.length === 0) {
            console.log('AssessmentService: No evidence promises collected');
            return [];
          }
          
          const allEvidenceArrays = await Promise.all(evidencePromises);
          const flattenedEvidence = allEvidenceArrays.flat();
          console.log(`AssessmentService: Retrieved ${flattenedEvidence.length} evidence items for unit ${unitCode}`);
          return flattenedEvidence;
        } catch (error) {
          console.error('AssessmentService: Error fetching evidence from Evidence folder:', error);
          return [];
        }
      }
      
      // For specific criteria code
      const sanitizedCriteriaCode = criteriaCode.replace(/\./g, '_');
      console.log(`AssessmentService: Looking for evidence with criteria code: ${criteriaCode} (${sanitizedCriteriaCode})`);
      
      try {
        // First get the unit folder if it exists
        const unitFolderResponse = await client.api(`/drives/${driveId}/root:/Evidence:/children`).get();
        
        // Find matching unit folders - try both sanitized and original format
        const unitFolder = unitFolderResponse.value.find((item: any) => 
          item.folder && (
            item.name === sanitizedUnitCode || 
            item.name === alternateUnitCode ||
            // Also check normalized forms without hyphens
            item.name === unitCode.replace(/-/g, '') ||
            // Try case-insensitive comparison for robustness
            item.name.toLowerCase() === sanitizedUnitCode.toLowerCase() ||
            item.name.toLowerCase() === alternateUnitCode.toLowerCase()
          )
        );
        
        if (!unitFolder) {
          console.log(`AssessmentService: No folder found for unit ${unitCode}`);
          return [];
        }
        
        console.log(`AssessmentService: Found unit folder: ${unitFolder.name}`);
        
        // Get criteria folders within the unit folder
        const criteriaFoldersResponse = await client.api(`/drives/${driveId}/items/${unitFolder.id}/children`).get();
        
        // Find criteria folders that contain this criteria (either exact match or part of a combined folder)
        const criteriaFolders = criteriaFoldersResponse.value.filter((item: any) => 
          item.folder && (
            item.name === sanitizedCriteriaCode || 
            item.name.includes(sanitizedCriteriaCode + '_') || 
            item.name.includes('_' + sanitizedCriteriaCode) ||
            // For combined criteria codes, check if this criteria is part of it
            item.name.split('_').includes(sanitizedCriteriaCode)
          )
        );
        
        if (criteriaFolders.length === 0) {
          console.log(`AssessmentService: No folders found containing criteria ${criteriaCode}`);
          return [];
        }
        
        console.log(`AssessmentService: Found ${criteriaFolders.length} criteria folders containing ${criteriaCode}:`, 
          criteriaFolders.map((f: any) => f.name).join(', '));
        
        // Get evidence from all matching folders
        const evidencePromises: Promise<EvidenceMetadata>[] = [];
        
        for (const folder of criteriaFolders) {
          try {
            console.log(`AssessmentService: Getting files from criteria folder ${folder.name}`);
            const filesResponse = await client.api(`/drives/${driveId}/items/${folder.id}/children`).get();
            
            // Add file evidence from this folder (filter locally)
            const files = filesResponse.value.filter((item: any) => !item.folder);
            console.log(`AssessmentService: Found ${files.length} files in criteria folder ${folder.name}`);
            
            for (const file of files) {
              if (file.webUrl) {
                console.log(`AssessmentService: Processing file ${file.name}`);
                evidencePromises.push(
                  this.sharePointService.fetchEvidenceMetadata(file.webUrl)
                );
              }
            }
          } catch (e) {
            console.warn(`AssessmentService: Error processing folder ${folder.name}:`, e);
          }
        }
        
        const result = await Promise.all(evidencePromises);
        console.log(`AssessmentService: Retrieved ${result.length} evidence items for unit ${unitCode} and criteria ${criteriaCode}`);
        return result;
      } catch (error) {
        console.error('AssessmentService: Error fetching criteria evidence:', error);
        return [];
      }
    } catch (error) {
      console.error('AssessmentService: Failed to get evidence for criteria:', error);
      throw new Error('Failed to get evidence for criteria: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  }
} 