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

/**
 * Responsible for rendering any PDF based on pdfUrl
 * @param pdfUrl        - External link or base64 representation
 * @param scale         - Initial scale of the PDF
 * @param rotation      - Initial rotation of the PDF
 * @param rotation      - Number of pages in the PDF
 * @param onLoadSuccess - Callback after rendering the PDF
 */
const PdfRenderer: FC<PdfRendererProps> = ({
  pdfUrl,
  scale = 1,
  rotation = 1,
  numPages,
  onLoadSuccess,
}) => {
  if (!pdfUrl) {
    return <PdfError error="no-url" />;
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

  const isDark = effectiveTheme === "dark";

  return (
    <div
      className="w-full h-full overflow-auto"
      style={{
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
        filter: isDark ? "invert(0.98) brightness(1) contrast(0.8)" : "none",
      }}
    >
      <Document
        file={pdfUrl}
        onLoadSuccess={onLoadSuccess}
        className="w-full h-full flex items-center justify-start space-y-5 flex-col"
        loading={() => (
          <div className="w-full h-full flex items-center justify-center">
            <Loader2 className="animate-spin w-5 h-5" />
          </div>
        )}
      >
        {Array.from({ length: numPages || 0 }, (_, i) => (
          <Page
            key={i + 1}
            pageNumber={i + 1}
            rotate={(pageRotations[i + 1] || 0) + rotation}
            scale={scale}
            onLoadSuccess={(page) => handlePageLoadSuccess(page, i + 1)}
            className="pdf-page"
            renderTextLayer={true}
            renderAnnotationLayer={true}
            loading={() => (
              <div className="w-full h-full flex items-center justify-center">
                <Loader2 className="animate-spin w-5 h-5" />
              </div>
            )}
          />
        ))}
      </Document>
    </div>
  );
};

type PdfError = "no-url" | "no-load";

interface PdfErrorProps {
  error: PdfError;
}

const PdfError: FC<PdfErrorProps> = ({ error }) => {
  return <div>{error}</div>;
};

export default PdfRenderer;
