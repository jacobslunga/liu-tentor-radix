import { pdfjs } from "react-pdf";

// Configure PDF.js worker with local file for both dev and production
export const configurePdfWorker = () => {
  // Use local worker file served from public directory for better reliability
  // This avoids CORS issues and external CDN failures
  pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
};

// Initialize worker configuration
configurePdfWorker();
