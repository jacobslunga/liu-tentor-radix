import { useCallback, useEffect, useMemo, type FC } from "react";
import PdfRenderer from "./PdfRenderer";
import usePdf from "@/hooks/usePdf";
import ExamToolbar from "./Toolbar/ExamToolbar";
import { useHotkeys } from "react-hotkeys-hook";

interface Props {
  pdfUrl: string | null;
}

const ExamPdf: FC<Props> = ({ pdfUrl }) => {
  const {
    numPages,
    scale,
    rotation,
    setNumPages,
    zoomIn,
    zoomOut,
    rotateLeft,
    rotateRight,
  } = usePdf("exam");

  const onLoadSuccess = useCallback(
    ({ numPages }: { numPages: number }) => setNumPages(numPages),
    []
  );

  // Key handling for + and - requires custom logic
  const keyboardActions = useMemo(
    () => ({
      "+": () => {
        zoomIn();
      },
      "-": () => {
        zoomOut();
      },
    }),
    [zoomIn, zoomOut]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const action = keyboardActions[e.key as keyof typeof keyboardActions];
      if (action) action();
    };
    window.addEventListener("keydown", handleKeyDown, { passive: true });
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [keyboardActions]);

  useHotkeys("l", rotateLeft);
  useHotkeys("r", rotateRight);

  return (
    <>
      <ExamToolbar pdfUrl={pdfUrl} />
      <PdfRenderer
        scale={scale}
        rotation={rotation}
        onLoadSuccess={onLoadSuccess}
        numPages={numPages}
        pdfUrl={pdfUrl}
      />
    </>
  );
};

export default ExamPdf;
