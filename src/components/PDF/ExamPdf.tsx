import { memo, type FC } from 'react';
import PdfRenderer from './PdfRenderer';

interface Props {
  pdfUrl: string | null;
  layoutMode?: 'exam-only' | 'exam-with-facit' | 'default';
}

const ExamPdfComponent: FC<Props> = ({ pdfUrl, layoutMode = 'default' }) => {
  return <PdfRenderer pdfUrl={pdfUrl} layoutMode={layoutMode} />;
};

const ExamPdf = memo(ExamPdfComponent);

export default ExamPdf;
