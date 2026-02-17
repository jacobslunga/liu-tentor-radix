import { type FC } from "react";
import PdfRenderer from "./PdfRenderer";

interface Props {
  pdfUrl: string;
}

const SolutionPdf: FC<Props> = ({ pdfUrl }) => {
  return (
    <>
      <PdfRenderer pdfUrl={pdfUrl} />
    </>
  );
};

export default SolutionPdf;
