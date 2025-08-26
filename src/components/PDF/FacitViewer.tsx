import { Document, Page } from "react-pdf";
import { FC, useEffect, useState } from "react";

import { pdfjs } from "react-pdf";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

interface FacitViewerProps {
  facitPdfUrl: string | null;
  facitScale: number;
  facitRotation: number;
  facitNumPages: number | undefined;
  handleMouseEnter: () => void;
  handleMouseLeave: () => void;
  onFacitDocumentLoadSuccess: ({ numPages }: { numPages: number }) => void;
}

const FacitViewer: FC<FacitViewerProps> = ({
  facitPdfUrl,
  facitScale,
  facitRotation,
  facitNumPages,
  handleMouseEnter,
  handleMouseLeave,
  onFacitDocumentLoadSuccess,
}) => {
  const { effectiveTheme } = useTheme();
  const { language } = useLanguage();
  const [isPdfLoaded, setIsPdfLoaded] = useState(false);
  const [pageRotations, setPageRotations] = useState<Record<number, number>>(
    {}
  );

  useEffect(() => {
    setIsPdfLoaded(false);
  }, [facitPdfUrl]);

  const handlePageLoadSuccess = (
    page: pdfjs.PDFPageProxy,
    pageNumber: number
  ) => {
    const nativeRotation = page.rotate || 0;
    setPageRotations((prev) => ({
      ...prev,
      [pageNumber]: nativeRotation,
    }));
  };

  const isDark = effectiveTheme === "dark";

  return (
    <div
      className="w-full h-full overscroll-auto"
      style={{
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      {!isPdfLoaded && (
        <div className="w-full h-full flex items-center justify-center">
          <div className="flex flex-col items-center space-y-3">
            <img
              src={
                effectiveTheme === "dark"
                  ? "/liutentorrounddark.svg"
                  : "/liutentorroundlight.svg"
              }
              alt="Loading"
              className="w-8 h-8 animate-pulse"
            />
            <div className="text-xs text-muted-foreground">
              {language === "sv" ? "Laddar facit..." : "Loading facit..."}
            </div>
          </div>
        </div>
      )}

      {/* PDF Viewer */}
      <div
        className="w-full h-full flex flex-col items-center justify-start space-y-5"
        style={{
          filter: isDark ? "invert(0.98) brightness(1) contrast(0.8)" : "none",
          backgroundColor: "transparent",
        }}
      >
        <Document
          file={facitPdfUrl}
          onLoadSuccess={(data) => {
            onFacitDocumentLoadSuccess(data);
            setIsPdfLoaded(true);
          }}
          className="w-full h-full flex flex-col items-center space-y-5 justify-start"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {facitNumPages &&
            facitNumPages > 0 &&
            Array.from({ length: facitNumPages }, (_, i) => (
              <Page
                key={i + 1}
                pageNumber={i + 1}
                scale={facitScale}
                rotate={(pageRotations[i + 1] || 0) + facitRotation}
                onLoadSuccess={(page) => handlePageLoadSuccess(page, i + 1)}
                className="pdf-page"
              />
            ))}
        </Document>
      </div>
    </div>
  );
};

export default FacitViewer;
