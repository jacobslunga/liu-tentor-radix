import { type FC } from "react";
import PdfRenderer from "./PdfRenderer";

interface Props {
  pdfUrl: string | null;
}

const ExamPdf: FC<Props> = ({ pdfUrl }) => {
  return <PdfRenderer pdfUrl={pdfUrl} />;
};

export default ExamPdf;
