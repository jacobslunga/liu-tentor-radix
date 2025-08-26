import { Document, Page, pdfjs } from "react-pdf";
import { FC, useState } from "react";

import { LoaderCircle } from "lucide-react";
import MobilePDFControls from "./PDF/MobilePDFControls";
import { useTheme } from "@/context/ThemeContext";

const MobilePDFView: FC<{
  pdfUrl: string | null;
  facitPdfUrl: string | null;
  scale: number;
  facitScale: number;
  rotation: number;
  facitRotation: number;
  onLoadSuccess: ({ numPages }: { numPages: number }) => void;
  onFacitLoadSuccess: ({ numPages }: { numPages: number }) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onRotateCounterClockwise: () => void;
  onRotateClockwise: () => void;
  onFacitZoomIn: () => void;
  onFacitZoomOut: () => void;
  onRotateFacitCounterClockwise: () => void;
  onRotateFacitClockwise: () => void;
  numPages?: number;
  facitNumPages?: number;
  getTranslation: any;
}> = ({
  pdfUrl,
  facitPdfUrl,
  scale,
  rotation,
  facitScale,
  facitRotation,
  onLoadSuccess,
  onFacitLoadSuccess,
  numPages,
  facitNumPages,
  getTranslation,
  onFacitZoomIn,
  onFacitZoomOut,
  onRotateClockwise,
  onRotateCounterClockwise,
  onRotateFacitClockwise,
  onRotateFacitCounterClockwise,
  onZoomIn,
  onZoomOut,
}) => {
  const { effectiveTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<"exam" | "facit">("exam");
  const [loading, setLoading] = useState(true);
  const [pageRotations, setPageRotations] = useState<Record<number, number>>(
    {}
  );
  const [facitPageRotations, setFacitPageRotations] = useState<
    Record<number, number>
  >({});

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

  const handleFacitPageLoadSuccess = (
    page: pdfjs.PDFPageProxy,
    pageNumber: number
  ) => {
    const nativeRotation = page.rotate || 0;
    setFacitPageRotations((prev) => ({
      ...prev,
      [pageNumber]: nativeRotation,
    }));
  };

  const handleLoadSuccess = (data: { numPages: number }) => {
    setLoading(false);
    if (activeTab === "exam") {
      onLoadSuccess(data);
    } else {
      onFacitLoadSuccess(data);
    }
  };

  const isDark = effectiveTheme === "dark";

  if (!pdfUrl) {
    return (
      <div className="w-full h-full items-center justify-center flex">
        <LoaderCircle
          className="w-10 h-10 animate-spin"
          style={{ zIndex: 5000 }}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full">
      <MobilePDFControls
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onZoomIn={onZoomIn}
        onZoomOut={onZoomOut}
        onRotateLeft={onRotateCounterClockwise}
        onRotateRight={onRotateClockwise}
        onFacitZoomIn={onFacitZoomIn}
        onFacitZoomOut={onFacitZoomOut}
        onFacitRotateLeft={onRotateFacitCounterClockwise}
        onFacitRotateRight={onRotateFacitClockwise}
        facitPdfUrl={facitPdfUrl}
        getTranslation={getTranslation}
      />

      <div
        className="flex-1 overflow-y-auto overscroll-contain pb-safe bg-muted/5"
        style={{
          backgroundColor: "var(--background)",
          color: "var(--foreground)",
        }}
      >
        <div
          className="min-h-full flex flex-col items-center px-2"
          style={{
            filter: isDark
              ? "invert(0.98) brightness(1) contrast(0.8)"
              : "none",
            backgroundColor: "transparent",
          }}
        >
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
              <LoaderCircle className="w-10 h-10 animate-spin" />
            </div>
          )}

          {activeTab === "exam" ? (
            <Document
              file={pdfUrl}
              onLoadSuccess={handleLoadSuccess}
              loading={<LoaderCircle className="w-10 h-10 animate-spin" />}
              className="w-full"
            >
              {Array.from(new Array(numPages), (_, index) => (
                <div
                  key={`page_${index + 1}`}
                  className="mb-4 w-full flex justify-center"
                >
                  <Page
                    key={`page_${index + 1}`}
                    pageNumber={index + 1}
                    scale={scale}
                    rotate={(pageRotations[index + 1] || 0) + rotation}
                    onLoadSuccess={(page) =>
                      handlePageLoadSuccess(page, index + 1)
                    }
                    loading={null}
                    width={window.innerWidth - 16}
                  />
                </div>
              ))}
            </Document>
          ) : facitPdfUrl ? (
            <Document
              file={facitPdfUrl}
              onLoadSuccess={handleLoadSuccess}
              loading={<LoaderCircle className="w-10 h-10 animate-spin" />}
              className="w-full"
            >
              {Array.from(new Array(facitNumPages), (_, index) => (
                <div
                  key={`page_${index + 1}`}
                  className="mb-4 w-full flex justify-center"
                >
                  <Page
                    key={`page_${index + 1}`}
                    pageNumber={index + 1}
                    scale={facitScale}
                    rotate={
                      (facitPageRotations[index + 1] || 0) + facitRotation
                    }
                    onLoadSuccess={(page) =>
                      handleFacitPageLoadSuccess(page, index + 1)
                    }
                    loading={null}
                    width={window.innerWidth - 16}
                  />
                </div>
              ))}
            </Document>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default MobilePDFView;
