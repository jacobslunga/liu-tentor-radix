import { pdfjs } from "react-pdf";

// Configure PDF.js worker using local file to avoid CORS issues
export const configurePdfWorker = () => {
  if (import.meta.env.DEV) {
    // For development, use local worker file served from public directory
    pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
  } else {
    // For production, use CDN with CORS support
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
  }
};

// Initialize worker configuration
configurePdfWorker();
