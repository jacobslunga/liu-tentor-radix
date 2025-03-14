import { Exam } from '@/components/data-table/columns';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/context/ThemeContext';
import { LoaderCircle } from 'lucide-react';
import { FC, useState } from 'react';
import { Document, Page } from 'react-pdf';
import { Link } from 'react-router-dom';
import { pdfjs } from 'react-pdf';

interface FacitViewerProps {
  facitPdfUrl: string | null;
  facitScale: number;
  facitRotation: number;
  facitNumPages: number | undefined;
  handleMouseEnter: () => void;
  handleMouseLeave: () => void;
  onFacitDocumentLoadSuccess: ({ numPages }: { numPages: number }) => void;
  selectedFacit: Exam | null;
  loadingFacit: boolean;
  getTranslation: (key: any) => string;
  setFacitScale: React.Dispatch<React.SetStateAction<number>>;
}

const FacitViewer: FC<FacitViewerProps> = ({
  facitPdfUrl,
  facitScale,
  facitRotation,
  facitNumPages,
  handleMouseEnter,
  handleMouseLeave,
  onFacitDocumentLoadSuccess,
  selectedFacit,
  loadingFacit,
  getTranslation,
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

  if (loadingFacit) {
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

  return !selectedFacit ? (
    <div className='w-full h-full flex flex-col items-center justify-center space-y-4'>
      <p className='font-medium'>{getTranslation('noFacitAvailable')}</p>
      <p className='text-sm text-center text-primary/50 max-w-full md:max-w-[70%]'>
        {getTranslation('noFacitAvailableDescription')}
      </p>

      <Link to='/upload-exams'>
        <Button>{getTranslation('moreExamsBtn')}</Button>
      </Link>
    </div>
  ) : (
    <div
      className='w-full h-full overscroll-auto overflow-auto'
      style={{
        backgroundColor: 'var(--background)',
        color: 'var(--foreground)',
      }}
    >
      <div style={getPdfStyles()}>
        <Document
          file={facitPdfUrl}
          onLoadSuccess={onFacitDocumentLoadSuccess}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className='w-full h-full flex flex-col items-center justify-start'
        >
          {facitNumPages &&
            facitNumPages > 0 &&
            Array.from({ length: facitNumPages || 0 }, (_, i) => (
              <Page
                key={i + 1}
                pageNumber={i + 1}
                scale={facitScale}
                rotate={(pageRotations[i + 1] || 0) + facitRotation}
                onLoadSuccess={(page) => handlePageLoadSuccess(page, i + 1)}
              />
            ))}
        </Document>
      </div>
    </div>
  );
};

export default FacitViewer;
