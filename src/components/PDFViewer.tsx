import { useState, useEffect } from 'react';
import { SharePointService } from '../services/SharePointService';

interface PDFViewerProps {
  fileUrl?: string;
  fileName: string;
}

export default function PDFViewer({ fileUrl, fileName }: PDFViewerProps) {
  const [pdfUrl, setPdfUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const loadPDF = async () => {
      if (!fileUrl) {
        setError('No file URL provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');

        // For now, use the direct URL
        setPdfUrl(fileUrl);
      } catch (err) {
        console.error('Error loading PDF:', err);
        setError('Unable to load PDF. You can open it externally.');
      } finally {
        setLoading(false);
      }
    };

    loadPDF();
  }, [fileUrl]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading PDF...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="text-4xl mb-4">📄</div>
          <p className="text-gray-600 mb-2">{fileName}</p>
          <p className="text-red-600 text-sm mb-4">{error}</p>
          <button
            onClick={() => fileUrl && window.open(fileUrl, '_blank')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Open PDF Externally
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-96 w-full">
      <iframe
        src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
        className="w-full h-full border-0"
        title={fileName}
        onError={() => {
          console.log('PDF iframe failed, showing fallback');
          setError('PDF preview not available. You can open it externally.');
        }}
      />
    </div>
  );
}
