import React, { useState, useEffect } from 'react';

interface InlineFileViewerProps {
  fileUrl: string;
  fileName: string;
  onClose?: () => void;
}

export const InlineFileViewer: React.FC<InlineFileViewerProps> = ({
  fileUrl,
  fileName,
  onClose
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string>('');

  useEffect(() => {
    // Determine file type based on extension
    const extension = fileName.toLowerCase().split('.').pop() || '';
    setFileType(extension);
    setIsLoading(false);
  }, [fileName]);

  const renderFileContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-500 mb-2">{error}</p>
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-400 underline"
            >
              Open externally
            </a>
          </div>
        </div>
      );
    }

    // Handle different file types
    switch (fileType) {
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'webp':
      case 'bmp':
        return (
          <div className="flex items-center justify-center">
            <img
              src={fileUrl}
              alt={fileName}
              className="max-w-full max-h-96 object-contain rounded-lg"
              onError={() => setError('Failed to load image')}
            />
          </div>
        );

      case 'pdf':
        return (
          <div className="w-full h-96">
            <iframe
              src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`}
              className="w-full h-full border-0 rounded-lg"
              title={fileName}
              onError={() => setError('Failed to load PDF')}
            />
          </div>
        );

      case 'mp4':
      case 'mov':
      case 'avi':
      case 'wmv':
      case 'webm':
        return (
          <div className="flex items-center justify-center">
            <video
              controls
              className="max-w-full max-h-96 rounded-lg"
              onError={() => setError('Failed to load video')}
            >
              <source src={fileUrl} type={`video/${fileType}`} />
              Your browser does not support the video tag.
            </video>
          </div>
        );

      case 'mp3':
      case 'wav':
      case 'ogg':
        return (
          <div className="flex items-center justify-center">
            <audio
              controls
              className="w-full max-w-md"
              onError={() => setError('Failed to load audio')}
            >
              <source src={fileUrl} type={`audio/${fileType}`} />
              Your browser does not support the audio tag.
            </audio>
          </div>
        );

      case 'txt':
      case 'md':
        return (
          <div className="w-full h-96 overflow-auto bg-neutral-800 p-4 rounded-lg">
            <pre className="text-sm text-white whitespace-pre-wrap">
              <FileContentLoader url={fileUrl} />
            </pre>
          </div>
        );

      case 'html':
      case 'htm':
        return (
          <div className="w-full h-96">
            <iframe
              src={fileUrl}
              className="w-full h-full border-0 rounded-lg"
              title={fileName}
              onError={() => setError('Failed to load HTML')}
            />
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-gray-400 mb-4">
                Preview not available for {fileType.toUpperCase()} files
              </p>
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-400 underline"
              >
                Open externally
              </a>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-neutral-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-700">
          <h3 className="text-lg font-semibold text-white truncate">{fileName}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-auto max-h-[calc(90vh-80px)]">
          {renderFileContent()}
        </div>
      </div>
    </div>
  );
};

// Component to load text file content
const FileContentLoader: React.FC<{ url: string }> = ({ url }) => {
  const [content, setContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to load file');
        }
        const text = await response.text();
        setContent(text);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load file');
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [url]);

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (error) {
    return <span className="text-red-500">{error}</span>;
  }

  return <span>{content}</span>;
}; 