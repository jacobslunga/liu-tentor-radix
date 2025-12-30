import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

import { Document, Page, pdfjs } from "react-pdf";
import { useState, type FC } from "react";
import { useTheme } from "@/context/ThemeContext";
import { Loader2 } from "lucide-react";

interface PdfRendererProps {
  pdfUrl: string | null;
  scale: number;
  rotation: number;
  numPages: number;
  onLoadSuccess: ({ numPages }: { numPages: number }) => void;
}

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const PdfRenderer: FC<PdfRendererProps> = ({
  pdfUrl,
  scale = 1,
  rotation = 1,
  numPages,
  onLoadSuccess,
}) => {
  if (!pdfUrl) {
    return null;
  }

  const { effectiveTheme } = useTheme();

  const [pageRotations, setPageRotations] = useState<Record<number, number>>(
    {}
  );

  const handlePageLoadSuccess = (
    page: pdfjs.PDFPageProxy,
    pageNumber: number
  ) => {
    const nativeRotation = page.rotate || 0;
    setPageRotations((prev) => ({ ...prev, [pageNumber]: nativeRotation }));
  };

  return (
    <div
      className="w-full h-full bg-background overflow-hidden"
      data-theme={effectiveTheme}
    >
      <Document
        file={pdfUrl}
        onLoadSuccess={onLoadSuccess}
        className="w-full h-full overflow-auto bg-background flex flex-col items-start"
        loading={() => (
          <div className="w-full h-full flex items-center justify-center">
            <Loader2 className="animate-spin w-5 h-5" />
          </div>
        )}
      >
        <div className="flex flex-col items-start gap-4 py-4 w-fit origin-top-left px-4">
          {Array.from({ length: numPages || 0 }, (_, i) => (
            <Page
              key={i + 1}
              pageNumber={i + 1}
              rotate={(pageRotations[i + 1] || 0) + rotation}
              scale={scale}
              onLoadSuccess={(page) => handlePageLoadSuccess(page, i + 1)}
              renderTextLayer={true}
              renderAnnotationLayer={true}
              loading={() => (
                <div className="w-full h-64 flex items-center justify-center">
                  <Loader2 className="animate-spin w-5 h-5" />
                </div>
              )}
            />
          ))}
        </div>
      </Document>
    </div>
  );
};

export default PdfRenderer;
