import React, { useMemo, useState, useEffect, useRef } from "react";
import { Page, pdfjs } from "react-pdf";
import { LoaderCircle } from "lucide-react";

interface VirtualizedPDFPagesProps {
  numPages: number;
  scale: number;
  rotation: number;
  pageRotations: Record<number, number>;
  onPageLoadSuccess?: (page: pdfjs.PDFPageProxy, pageNumber: number) => void;
  className?: string;
  containerHeight?: number;
  estimatedPageHeight?: number;
}

const VirtualizedPDFPages: React.FC<VirtualizedPDFPagesProps> = ({
  numPages,
  scale,
  rotation,
  pageRotations,
  onPageLoadSuccess,
  className = "pdf-page shadow-lg",
  containerHeight = 600,
  estimatedPageHeight = 800,
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  const [containerElement, setContainerElement] =
    useState<HTMLDivElement | null>(null);
  const scrollElementRef = useRef<HTMLDivElement>(null);

  // Calculate which pages should be visible
  const visiblePages = useMemo(() => {
    if (!containerElement) return [];

    const startIndex = Math.floor(scrollTop / (estimatedPageHeight * scale));
    const endIndex = Math.min(
      numPages - 1,
      startIndex +
        Math.ceil(containerHeight / (estimatedPageHeight * scale)) +
        1
    );

    return Array.from(
      { length: Math.max(0, endIndex - startIndex + 1) },
      (_, i) => startIndex + i + 1
    ).filter((pageNumber) => pageNumber >= 1 && pageNumber <= numPages);
  }, [
    scrollTop,
    numPages,
    containerHeight,
    estimatedPageHeight,
    scale,
    containerElement,
  ]);

  // Handle scroll events
  useEffect(() => {
    const element = scrollElementRef.current;
    if (!element) return;

    const handleScroll = () => {
      setScrollTop(element.scrollTop);
    };

    element.addEventListener("scroll", handleScroll, { passive: true });
    return () => element.removeEventListener("scroll", handleScroll);
  }, []);

  // Set up intersection observer for better performance
  useEffect(() => {
    const element = scrollElementRef.current;
    if (!element) return;

    setContainerElement(element);
  }, []);

  // Total height calculation
  const totalHeight = numPages * estimatedPageHeight * scale;

  return (
    <div
      ref={scrollElementRef}
      style={{ height: containerHeight, overflow: "auto" }}
      className="pdf-container"
    >
      <div style={{ height: totalHeight, position: "relative" }}>
        {visiblePages.map((pageNumber) => {
          const top = (pageNumber - 1) * estimatedPageHeight * scale;

          return (
            <div
              key={`page_${pageNumber}_${scale}_${rotation}`}
              style={{
                position: "absolute",
                top,
                left: "50%",
                transform: "translateX(-50%)",
                width: "fit-content",
              }}
            >
              <Page
                pageNumber={pageNumber}
                rotate={(pageRotations[pageNumber] || 0) + rotation}
                scale={scale}
                onLoadSuccess={(page) => onPageLoadSuccess?.(page, pageNumber)}
                onLoadError={(error) =>
                  console.warn(`Page ${pageNumber} load error:`, error)
                }
                className={className}
                loading={
                  <div className="flex items-center justify-center w-full h-96 bg-muted/20 rounded">
                    <LoaderCircle className="w-6 h-6 animate-spin text-muted-foreground" />
                  </div>
                }
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VirtualizedPDFPages;
