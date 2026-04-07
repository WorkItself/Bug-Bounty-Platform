/**
 * File utility functions for handling file uploads and embeds
 */

export interface FileUploadResult {
  success: boolean;
  file?: File;
  error?: string;
}

/**
 * Validate and handle PDF file uploads
 * Only allows PDF files
 */
export const validatePDFFile = (file: File): FileUploadResult => {
  const maxSizeMB = 10;
  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  // Check file type
  if (file.type !== 'application/pdf') {
    return {
      success: false,
      error: 'Only PDF files are allowed. Please upload a valid PDF document.'
    };
  }

  // Check file size
  if (file.size > maxSizeBytes) {
    return {
      success: false,
      error: `File size exceeds ${maxSizeMB}MB limit. Please upload a smaller PDF.`
    };
  }

  return {
    success: true,
    file
  };
};

/**
 * Convert PDF file to base64 string for storage/transmission
 */
export const pdfToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]); // Remove data:application/pdf;base64, prefix
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Get file download URL from base64 string
 */
export const getBase64PDFUrl = (base64String: string): string => {
  return `data:application/pdf;base64,${base64String}`;
};

/**
 * Handle PDF file upload with validation
 */
export const handlePDFUpload = async (file: File): Promise<FileUploadResult> => {
  const validation = validatePDFFile(file);
  if (!validation.success) {
    return validation;
  }

  try {
    await pdfToBase64(file);
    return {
      success: true,
      file
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to process PDF file'
    };
  }
};
