import { useTheme } from "@/context/ThemeContext";
import { LoaderCircle, AlertCircle, RefreshCw } from "lucide-react";
import { FC, useState, useMemo, useCallback } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Button } from "@/components/ui/button";

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
  const [pageRotations, setPageRotations] = useState<Record<number, number>>(
    {}
  );
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  const handlePageLoadSuccess = useCallback(
    (page: pdfjs.PDFPageProxy, pageNumber: number) => {
      const nativeRotation = page.rotate || 0;
      setPageRotations((prev) => ({
        ...prev,
        [pageNumber]: nativeRotation,
      }));
    },
    []
  );

  const handleDocumentLoadSuccess = useCallback(
    (data: { numPages: number }) => {
      setIsLoading(false);
      setLoadingError(null);
      setRetryCount(0);
      onLoadSuccess(data);
    },
    [onLoadSuccess]
  );

  const handleDocumentLoadError = useCallback((error: Error) => {
    setIsLoading(false);
    setLoadingError(error.message || "Failed to load PDF");
    console.error("PDF loading error:", error);
  }, []);

  const handleRetry = useCallback(() => {
    setLoadingError(null);
    setIsLoading(true);
    setRetryCount((prev) => prev + 1);
  }, []);

  // Memoize PDF styles to prevent recalculation
  const pdfStyles = useMemo(() => {
    switch (effectiveTheme) {
      case "dark":
        return {
          backgroundColor: "var(--background)",
          color: "var(--foreground)",
          filter: "invert(1) brightness(1) contrast(0.78)",
        };
      default:
        return {
          backgroundColor: "var(--background)",
          color: "var(--foreground)",
          filter: "none",
        };
    }
  }, [effectiveTheme]);

  const containerStyles = useMemo(
    () => ({
      backgroundColor: "var(--background)",
      color: "var(--foreground)",
    }),
    []
  );

  if (!pdfUrl) {
    return (
      <div className="w-full h-full items-center justify-center flex">
        <LoaderCircle
          className="w-10 h-10 animate-spin text-primary"
          style={{ zIndex: 5000 }}
        />
      </div>
    );
  }

  if (loadingError) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center space-y-4 p-8">
        <AlertCircle className="w-12 h-12 text-destructive" />
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold">Failed to load PDF</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            {loadingError}
          </p>
          {retryCount < 3 && (
            <Button
              onClick={handleRetry}
              variant="outline"
              className="mt-4"
              disabled={isLoading}
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
              />
              Try Again {retryCount > 0 && `(${retryCount}/3)`}
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full overscroll-auto" style={containerStyles}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-50">
          <div className="flex flex-col items-center space-y-2">
            <LoaderCircle className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading PDF...</p>
          </div>
        </div>
      )}

      <div style={pdfStyles}>
        <Document
          file={pdfUrl}
          onLoadSuccess={handleDocumentLoadSuccess}
          onLoadError={handleDocumentLoadError}
          loading={null} // We handle loading state above
          error={null} // We handle errors above
          className="w-full h-full flex items-center justify-start space-y-5 flex-col"
        >
          {Array.from({ length: numPages || 0 }, (_, i) => (
            <Page
              key={`page_${i + 1}_${scale}_${userRotation}`} // Include scale and rotation in key for better updates
              pageNumber={i + 1}
              rotate={(pageRotations[i + 1] || 0) + userRotation}
              scale={scale}
              onLoadSuccess={(page) => handlePageLoadSuccess(page, i + 1)}
              onLoadError={(error) =>
                console.warn(`Page ${i + 1} load error:`, error)
              }
              className="pdf-page shadow-lg"
              loading={
                <div className="flex items-center justify-center w-full h-96 bg-muted/20 rounded">
                  <LoaderCircle className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              }
            />
          ))}
        </Document>
      </div>
    </div>
  );
};

export default PDFViewer;
