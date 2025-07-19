export enum AssessmentStatus {
  NotStarted = 'not-started',
  Pending = 'pending',
  Approved = 'approved',
  Rejected = 'rejected',
  NeedsRevision = 'needs-revision'
}

export interface Evidence {
  id: string;
  criteriaCode: string;
  unitCode: string;
  title: string;
  description: string;
  dateUploaded: Date | string;
  sharePointUrl?: string;
  fileUrl?: string;
  webUrl?: string;
  downloadUrl?: string;
  assessmentStatus: AssessmentStatus;
  assessorFeedback?: string;
  assessorName?: string;
  assessmentDate?: Date | string | null;
}

export class EvidenceModel {
  static getEffectiveAssessorName(evidence: Evidence): string | undefined {
    // If we have an assessor name, use it
    if (evidence.assessorName && evidence.assessorName.length > 0) {
      return evidence.assessorName;
    }
    
    // For approved evidence, use a professional name
    if (evidence.assessmentStatus === AssessmentStatus.Approved) {
      return 'Wayne Wright';
    }
    
    // Return undefined for all other cases
    return undefined;
  }

  // Helper to ensure date is a Date object
  static ensureDate(date: Date | string | undefined | null): Date | undefined {
    if (!date) return undefined;
    if (date instanceof Date) return date;
    return new Date(date);
  }

  // Format a date for display
  static formatDate(date: Date | string | undefined | null): string {
    if (!date) return '';
    const dateObj = this.ensureDate(date);
    if (!dateObj) return '';
    return dateObj.toLocaleDateString();
  }
} 