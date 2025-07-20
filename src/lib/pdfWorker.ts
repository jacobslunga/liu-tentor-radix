import { pdfjs } from 'react-pdf';

// Configure PDF.js worker
export const configurePdfWorker = () => {
  // Use CDN as primary source for better reliability
  pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
  
  // Fallback for development
  if (import.meta.env.DEV) {
    // Alternative CDN
    try {
      pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
    } catch (error) {
      console.warn('Failed to load PDF worker from CDN, using fallback');
    }
  }
};

// Initialize worker configuration
configurePdfWorker();
