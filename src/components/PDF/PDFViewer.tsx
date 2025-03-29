import { useTheme } from '@/context/ThemeContext';
import { LoaderCircle } from 'lucide-react';
import { FC, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

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

  if (!pdfUrl) {
    return (
      <div className='w-full h-full items-center justify-center flex'>
        <LoaderCircle
          className='w-10 h-10 animate-spin'
          style={{
            zIndex: 5000,
          }}
        />
      </div>
    );
  }

  const getPdfStyles = () => {
    switch (effectiveTheme) {
      case 'dark':
        return {
          backgroundColor: 'var(--background)',
          color: 'var(--foreground)',
          filter: 'invert(1) brightness(1) contrast(0.8)',
        };
      case 'paper-dark':
        return {
          backgroundColor: 'var(--background)',
          color: 'var(--foreground)',
          filter: 'invert(0.95) brightness(1) contrast(0.85)',
        };
      case 'paper-light':
        return {
          backgroundColor: 'var(--background)',
          color: 'var(--foreground)',
          filter: 'invert(0.02) brightness(1) contrast(1)',
        };
      default:
        return {
          backgroundColor: 'var(--background)',
          color: 'var(--foreground)',
          filter: 'none',
        };
    }
  };

  return (
    <div
      className='w-full h-full overscroll-auto'
      style={{
        backgroundColor: 'var(--background)',
        color: 'var(--foreground)',
      }}
    >
      <div style={getPdfStyles()}>
        <Document
          file={pdfUrl}
          onLoadSuccess={onLoadSuccess}
          className='w-full h-full flex items-center justify-start space-y-5 flex-col'
        >
          {Array.from({ length: numPages || 0 }, (_, i) => (
            <Page
              key={i + 1}
              pageNumber={i + 1}
              rotate={(pageRotations[i + 1] || 0) + userRotation}
              scale={scale}
              onLoadSuccess={(page) => handlePageLoadSuccess(page, i + 1)}
              className='pdf-page'
            />
          ))}
        </Document>
      </div>
    </div>
  );
};

export default PDFViewer;
