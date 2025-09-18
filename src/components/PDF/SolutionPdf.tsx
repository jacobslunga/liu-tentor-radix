import { useCallback, type FC } from "react";
import PdfRenderer from "./PdfRenderer";
import usePdf from "@/hooks/usePdf";
import SolutionToolbar from "./Toolbar/SolutionToolbar";

interface Props {
  pdfUrl: string;
}

const SolutionPdf: FC<Props> = ({ pdfUrl }) => {
  const { numPages, scale, rotation, setNumPages } = usePdf("solution");

  const onLoadSuccess = useCallback(
    ({ numPages }: { numPages: number }) => setNumPages(numPages),
    []
  );

  return (
    <>
      <SolutionToolbar pdfUrl={pdfUrl} />
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

export default SolutionPdf;
