import { memo, type FC } from 'react';
import PdfRenderer from './PdfRenderer';

interface Props {
  pdfUrl: string;
  layoutMode?: 'exam-only' | 'exam-with-facit' | 'default';
}

const SolutionPdfComponent: FC<Props> = ({
  pdfUrl,
  layoutMode = 'default',
}) => {
  return <PdfRenderer pdfUrl={pdfUrl} layoutMode={layoutMode} />;
};

const SolutionPdf = memo(SolutionPdfComponent);

export default SolutionPdf;
