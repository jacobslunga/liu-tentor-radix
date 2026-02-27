import { type FC, useMemo } from "react";

interface PdfRendererProps {
  pdfUrl: string | null;
}

const PdfRenderer: FC<PdfRendererProps> = ({ pdfUrl }) => {
  if (!pdfUrl) return null;

  const isFirefox = useMemo(() => {
    return typeof window !== "undefined" && navigator.userAgent.toLowerCase().includes("firefox");
  }, []);

  /**
   * Parameters breakdown:
   * toolbar=0: Hide the top bar
   * navpanes=0: Hide the side thumbnail/outline gallery
   * scrollbar=0: Hide the scrollbar (browser dependent)
   */
  const pdfParams = "#toolbar=0&navpanes=0&scrollbar=0";

  return (
    <div className="w-full h-full bg-white dark:bg-background overflow-hidden relative">
      <iframe
        src={`${pdfUrl}${pdfParams}`}
        className={`
          border-none block pdf-invert w-full
          ${isFirefox ? "h-[calc(100%+56px)] -mt-[56px]" : "h-full"}
        `}
        title="PDF Document"
        style={{ colorScheme: "light" }}
      />

      <div className="absolute inset-0 pointer-events-none" />
    </div>
  );
};

export default PdfRenderer;
