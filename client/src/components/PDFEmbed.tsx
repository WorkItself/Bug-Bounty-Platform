import React, { useState } from 'react';
import { handlePDFUpload } from '../utils/fileUtils';

interface PDFEmbedProps {
  onFileSelect?: (file: File) => void;
  onError?: (error: string) => void;
  pdfUrl?: string;
  allowDownload?: boolean;
}

const PDFEmbed: React.FC<PDFEmbedProps> = ({
  onFileSelect,
  onError,
  pdfUrl,
  allowDownload = true
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError('');

    const result = await handlePDFUpload(file);
    
    if (result.success && result.file) {
      setSelectedFile(result.file);
      onFileSelect?.(result.file);
    } else {
      const errorMsg = result.error || 'Failed to process PDF file';
      setError(errorMsg);
      onError?.(errorMsg);
    }
    
    setLoading(false);
  };

  const handleDownload = () => {
    if (pdfUrl) {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = 'document.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #1B3A57 0%, #0C1A30 100%)',
      padding: '1.5rem',
      borderRadius: '0.75rem',
      border: '1px solid #009B77'
    }}>
      <h3 style={{ color: '#FFFFFF', marginBottom: '1rem', fontSize: '1.1rem', fontWeight: '600' }}>
        📄 PDF Document Upload
      </h3>

      <div style={{
        border: '2px dashed #009B77',
        borderRadius: '0.5rem',
        padding: '1.5rem',
        textAlign: 'center',
        background: '#0C1A30',
        marginBottom: '1rem'
      }}>
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          disabled={loading}
          style={{
            opacity: 0,
            position: 'absolute',
            width: 0,
            height: 0
          }}
          id="pdf-file-input"
        />
        <label
          htmlFor="pdf-file-input"
          style={{
            display: 'block',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1
          }}
        >
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📑</div>
          <div style={{ color: '#FFFFFF', fontWeight: '600', marginBottom: '0.5rem' }}>
            {loading ? 'Processing...' : 'Click to upload PDF or drag and drop'}
          </div>
          <div style={{ color: '#A2DFF7', fontSize: '0.9rem' }}>
            Maximum file size: 10 MB
          </div>
        </label>
      </div>

      {error && (
        <div style={{
          background: '#ff4d4d',
          color: '#FFFFFF',
          padding: '0.75rem',
          borderRadius: '0.5rem',
          marginBottom: '1rem',
          fontSize: '0.9rem'
        }}>
          ❌ {error}
        </div>
      )}

      {selectedFile && (
        <div style={{
          background: '#1e2a3a',
          padding: '1rem',
          borderRadius: '0.5rem',
          marginBottom: '1rem',
          borderLeft: '3px solid #4caf50'
        }}>
          <div style={{ color: '#4caf50', fontWeight: '600', marginBottom: '0.25rem' }}>
            ✓ File Selected
          </div>
          <div style={{ color: '#FFFFFF', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
            {selectedFile.name}
          </div>
          <div style={{ color: '#A2DFF7', fontSize: '0.85rem' }}>
            Size: {(selectedFile.size / 1024).toFixed(2)} KB
          </div>
        </div>
      )}

      {pdfUrl && allowDownload && (
        <button
          onClick={handleDownload}
          style={{
            width: '100%',
            padding: '0.75rem',
            background: '#009B77',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            fontWeight: '600',
            transition: 'opacity 0.2s ease'
          }}
          onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.opacity = '0.8'}
          onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.opacity = '1'}
        >
          ⬇️ Download PDF
        </button>
      )}
    </div>
  );
};

export default PDFEmbed;
