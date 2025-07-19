import { useState, useEffect } from 'react';

interface FileViewerProps {
  fileUrl?: string;
  fileName: string;
  fileType?: string;
}

export default function FileViewer({ fileUrl, fileName, fileType }: FileViewerProps) {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!fileUrl) {
      setError('No file URL provided');
      setLoading(false);
      return;
    }

    const loadFileContent = async () => {
      try {
        setLoading(true);
        setError('');

        // Determine file type from extension
        const extension = fileName.split('.').pop()?.toLowerCase();
        
        if (extension === 'pdf') {
          // For PDFs, use an iframe to display
          setContent(fileUrl);
        } else if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension || '')) {
          // For images, display directly
          setContent(fileUrl);
        } else if (['txt', 'md', 'json', 'xml', 'html', 'css', 'js', 'ts', 'jsx', 'tsx'].includes(extension || '')) {
          // For text files, fetch and display content
          try {
            // For SharePoint files, we need to use the Microsoft Graph API with authentication
            // For now, we'll show the external link option for text files
            console.log('Text file detected, showing external link option');
            setError('Text preview not available for SharePoint files. You can open the file externally.');
          } catch (fetchError) {
            console.warn('Could not fetch text content, showing external link:', fetchError);
            setError('Text preview not available. You can open the file externally.');
          }
        } else {
          // For other file types, show a preview with download option
          setContent(fileUrl);
        }
      } catch (err) {
        console.error('Error loading file:', err);
        setError('Unable to load file content. You can still open the file externally.');
      } finally {
        setLoading(false);
      }
    };

    loadFileContent();
  }, [fileUrl, fileName]);

  const extension = fileName.split('.').pop()?.toLowerCase();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading file...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-4xl mb-4">📄</div>
          <p className="text-gray-600 mb-2">{fileName}</p>
          <p className="text-red-600 text-sm mb-4">{error}</p>
          <button
            onClick={() => fileUrl && window.open(fileUrl, '_blank')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Open File Externally
          </button>
        </div>
      </div>
    );
  }

  // PDF Viewer
  if (extension === 'pdf') {
    return (
      <div className="h-96 w-full">
        <iframe
          src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`}
          className="w-full h-full border-0"
          title={fileName}
          onError={() => setError('Failed to load PDF. You can open it externally.')}
        />
      </div>
    );
  }

  // Image Viewer
  if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension || '')) {
    return (
      <div className="h-96 w-full flex items-center justify-center bg-gray-50">
        <img
          src={fileUrl}
          alt={fileName}
          className="max-w-full max-h-full object-contain"
          onError={() => setError('Failed to load image. You can open it externally.')}
        />
      </div>
    );
  }

  // Text Viewer
  if (['txt', 'md', 'json', 'xml', 'html', 'css', 'js', 'ts', 'jsx', 'tsx'].includes(extension || '')) {
    return (
      <div className="h-96 w-full bg-gray-900 text-green-400 p-4 overflow-auto font-mono text-sm">
        <pre className="whitespace-pre-wrap">{content}</pre>
      </div>
    );
  }

  // Default viewer for other file types
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="text-6xl mb-4">📄</div>
        <p className="text-gray-600 mb-2">{fileName}</p>
        <p className="text-gray-500 text-sm mb-4">Preview not available for this file type</p>
        <button
          onClick={() => fileUrl && window.open(fileUrl, '_blank')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Open File
        </button>
      </div>
    </div>
  );
} 