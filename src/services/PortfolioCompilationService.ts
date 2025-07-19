import { Evidence } from '../models/Evidence';
import { SharePointService } from './SharePointService';

export class PortfolioCompilationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PortfolioCompilationError';
  }
}

export class PortfolioCompilationService {
  private static instance: PortfolioCompilationService;
  private sharePointService: SharePointService;

  private constructor() {
    this.sharePointService = SharePointService.getInstance();
  }

  static getInstance(): PortfolioCompilationService {
    if (!PortfolioCompilationService.instance) {
      PortfolioCompilationService.instance = new PortfolioCompilationService();
    }
    return PortfolioCompilationService.instance;
  }

  private generatePreviewHTML(evidence: Evidence[], unitCode: string): string {
    const evidenceHtml = evidence.map(e => `
      <div class="evidence-item">
        <h3>${e.title}</h3>
        <p><strong>Criteria Code:</strong> ${e.criteriaCode}</p>
        <p><strong>Description:</strong> ${e.description}</p>
        <p><strong>Status:</strong> ${e.assessmentStatus}</p>
        ${e.assessorFeedback ? `<p><strong>Feedback:</strong> ${e.assessorFeedback}</p>` : ''}
        ${e.assessorName ? `<p><strong>Assessor:</strong> ${e.assessorName}</p>` : ''}
        ${e.assessmentDate ? `<p><strong>Assessment Date:</strong> ${typeof e.assessmentDate === 'object' ? e.assessmentDate.toLocaleDateString() : e.assessmentDate}</p>` : ''}
      </div>
    `).join('');

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Portfolio - ${unitCode}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .evidence-item { border: 1px solid #ddd; padding: 15px; margin-bottom: 15px; border-radius: 5px; }
            h3 { margin-top: 0; color: #333; }
          </style>
        </head>
        <body>
          <h1>Portfolio for Unit ${unitCode}</h1>
          ${evidenceHtml}
        </body>
      </html>
    `;
  }

  async compilePortfolio(evidence: Evidence[]): Promise<Blob> {
    try {
      // Group evidence by unit code
      const groupedEvidence = evidence.reduce((acc, curr) => {
        if (!acc[curr.unitCode]) {
          acc[curr.unitCode] = [];
        }
        acc[curr.unitCode].push(curr);
        return acc;
      }, {} as Record<string, Evidence[]>);

      // Generate HTML for each unit
      const unitHtmls = Object.entries(groupedEvidence).map(([unitCode, unitEvidence]) => 
        this.generatePreviewHTML(unitEvidence, unitCode)
      );

      // Combine all unit HTMLs
      const combinedHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Complete Portfolio</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .unit-section { margin-bottom: 40px; }
              h1 { color: #333; }
            </style>
          </head>
          <body>
            <h1>Complete Portfolio</h1>
            ${unitHtmls.join('<hr>')}
          </body>
        </html>
      `;

      return new Blob([combinedHtml], { type: 'text/html' });
    } catch (error: any) {
      throw new PortfolioCompilationError(`Failed to compile portfolio: ${error?.message || 'Unknown error'}`);
    }
  }

  async uploadPortfolioToSharePoint(evidence: Evidence[], portfolioBlob: Blob): Promise<string> {
    try {
      // Create "IQA Reviews" folder if it doesn't exist
      await this.sharePointService.createFolderIfNeeded('IQA Reviews');

      // Format portfolio file name with date
      const dateString = new Date().toISOString().split('T')[0];
      const portfolioFileName = `Portfolio_${dateString}.html`;

      // Create upload session
      const uploadSession = await this.sharePointService.createUploadSession(
        portfolioFileName,
        'IQA Reviews'
      );

      // Upload the portfolio file
      await this.sharePointService.uploadFile(
        portfolioBlob,
        uploadSession.uploadUrl,
        portfolioFileName,
        (progress) => console.log(`Upload progress: ${progress}%`)
      );

      return uploadSession.webUrl;
    } catch (error: any) {
      throw new PortfolioCompilationError(`Failed to upload portfolio: ${error?.message || 'Unknown error'}`);
    }
  }
} 