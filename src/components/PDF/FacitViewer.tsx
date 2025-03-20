import { Exam } from '@/components/data-table/columns';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/context/ThemeContext';
import { LoaderCircle } from 'lucide-react';
import { FC, useState, useEffect } from 'react';
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
  getTranslation: any;
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
  getTranslation,
}) => {
  const { effectiveTheme } = useTheme();
  const [isPdfLoaded, setIsPdfLoaded] = useState(false);
  const [pageRotations, setPageRotations] = useState<Record<number, number>>(
    {}
  );

  useEffect(() => {
    setIsPdfLoaded(false);
  }, [facitPdfUrl]);

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
      style={getPdfStyles()}
    >
      {/* Placeholder för att undvika "No PDF file specified" */}
      {!isPdfLoaded && (
        <div className='w-full h-full flex items-center justify-center'>
          <LoaderCircle className='w-10 h-10 animate-spin' />
        </div>
      )}

      {/* PDF Viewer */}
      <div style={{ display: isPdfLoaded ? 'block' : 'none' }}>
        <Document
          file={facitPdfUrl}
          onLoadSuccess={(data) => {
            onFacitDocumentLoadSuccess(data);
            setIsPdfLoaded(true);
          }}
          renderMode='canvas'
          className='w-full h-full flex flex-col items-center space-y-10 justify-start'
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {facitNumPages &&
            facitNumPages > 0 &&
            Array.from({ length: facitNumPages }, (_, i) => (
              <Page
                key={i + 1}
                pageNumber={i + 1}
                scale={facitScale}
                rotate={(pageRotations[i + 1] || 0) + facitRotation}
                onLoadSuccess={(page) => handlePageLoadSuccess(page, i + 1)}
                className='pdf-page'
              />
            ))}
        </Document>
      </div>
    </div>
  );
};

export default FacitViewer;
