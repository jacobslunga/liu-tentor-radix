import { Document, Page, pdfjs } from "react-pdf";
import { FC, useState } from "react";

import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

interface PDFViewerProps {
  pdfUrl: string;
  scale: number;
  rotation: number;
  onLoadSuccess: ({ numPages }: { numPages: number }) => void;
  numPages?: number;
}

const PDFViewer: FC<PDFViewerProps> = ({
  pdfUrl,
  rotation: userRotation,
  onLoadSuccess,
  numPages,
  scale,
}) => {
  const { effectiveTheme } = useTheme();
  const { language } = useLanguage();

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

  if (!pdfUrl) {
    return (
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
            {language === "sv" ? "Laddar tenta..." : "Loading exam..."}
          </div>
        </div>
      </div>
    );
  }

  const isDark = effectiveTheme === "dark";

  return (
    <div
      className="w-full h-full overscroll-auto"
      style={{
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      <div
        className="w-full h-full flex flex-col items-center justify-start space-y-5"
        style={{
          filter: isDark ? "invert(0.98) brightness(1) contrast(0.8)" : "none",
          backgroundColor: "transparent",
        }}
      >
        <Document
          file={pdfUrl}
          onLoadSuccess={onLoadSuccess}
          className="w-full h-full flex items-center justify-start space-y-5 flex-col"
        >
          {Array.from({ length: numPages || 0 }, (_, i) => (
            <Page
              key={i + 1}
              pageNumber={i + 1}
              rotate={(pageRotations[i + 1] || 0) + userRotation}
              scale={scale}
              onLoadSuccess={(page) => handlePageLoadSuccess(page, i + 1)}
              className="pdf-page"
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
          ))}
        </Document>
      </div>
    </div>
  );
};

export default PDFViewer;
