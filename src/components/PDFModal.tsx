import { Exam } from '@/components/data-table/columns';
import FacitViewer from '@/components/PDF/FacitViewer';
import PDFViewer from '@/components/PDF/PDFViewer';
import { fetcher, findFacitForExam } from '@/components/PDF/utils';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { useLanguage } from '@/context/LanguageContext';
import translations from '@/util/translations';
import { motion } from 'framer-motion';
import Cookies from 'js-cookie';
import { MousePointerClick } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { pdfjs } from 'react-pdf';
import { ImperativePanelHandle } from 'react-resizable-panels';
import useSWR from 'swr';
import Toolbar from './PDF/Toolbar';
import { IconLayoutColumns, IconLayoutSidebarRight } from '@tabler/icons-react';

import { retryFetch } from '@/components/PDF/utils';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import FacitToolbar from './PDF/FacitToolbar';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GradientIndicator from '@/components/GradientIndicator';
import MobilePDFView from '@/components/MobilePdfViewer';
import { ShowGlobalSearchContext } from '@/context/ShowGlobalSearchContext';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

interface PDFModalProps {
  exams?: Exam[];
  tenta_id: string;
  showAIDrawer: boolean;
  setShowAIDrawer: React.Dispatch<React.SetStateAction<boolean>>;
  pdfUrl: string | null;
  setPdfUrl: React.Dispatch<React.SetStateAction<string | null>>;
  facitPdfUrl: string | null;
  setFacitPdfUrl: React.Dispatch<React.SetStateAction<string | null>>;
}

const PDFModal: FC<PDFModalProps> = ({
  exams,
  tenta_id,
  showAIDrawer,
  pdfUrl,
  setPdfUrl,
  facitPdfUrl,
  setFacitPdfUrl,
}) => {
  const { language } = useLanguage();
  const { showGlobalSearch } = useContext(ShowGlobalSearchContext);

  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number>();
  const [facitNumPages, setFacitNumPages] = useState<number>();
  const [facitScale, setFacitScale] = useState<number>(1.2);
  const [rotation, setRotation] = useState<number>(0);
  const [facitRotation, setFacitRotation] = useState<number>(0);
  const [selectedFacit, setSelectedFacit] = useState<Exam | null>(null);
  const [isBlurred, setIsBlurred] = useState<boolean>(true);
  const [isMouseOver, setIsMouseOver] = useState<boolean>(false);
  const [isMiddleMouseDown, setIsMiddleMouseDown] = useState(false);
  const [loadingFacit, setLoadingFacit] = useState(true);
  const [layoutMode, setLayoutMode] = useState<string>(() => {
    const savedLayoutMode = Cookies.get('layoutMode');
    return savedLayoutMode || 'exam-with-facit';
  });
  const [scale, setScale] = useState<number>(
    layoutMode === 'exam-only' ? 1.5 : 1.2
  );
  const facitPanelRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const [isToggled, setIsToggled] = useState<boolean>(false);

  const [leftPanelWidth, setLeftPanelWidth] = useState<number>(50);
  const [rightPanelWidth, setRightPanelWidth] = useState<number>(50);

  const leftPanelRef = useRef<ImperativePanelHandle>(null);
  const rightPanelRef = useRef<ImperativePanelHandle>(null);

  const getTranslation = (
    key: keyof (typeof translations)[typeof language]
  ) => {
    return translations[language][key];
  };

  const handleToggleBlur = useCallback(() => setIsBlurred((prev) => !prev), []);
  const handleMouseEnter = () => setIsMouseOver(true);
  const handleMouseLeave = () => setIsMouseOver(false);

  const MIN_SCALE = 0.5;
  const MAX_SCALE = 3.0;

  const zoomIn = useCallback(() => {
    setScale((prev) => {
      if (prev < MAX_SCALE) {
        return prev + 0.1;
      }
      return prev;
    });
  }, []);

  const zoomOut = useCallback(() => {
    setScale((prev) => {
      if (prev > MIN_SCALE) {
        return prev - 0.1;
      }
      return prev;
    });
  }, []);

  const zoomInFacit = useCallback(() => {
    setFacitScale((prev) => {
      if (prev < MAX_SCALE) {
        return prev + 0.1;
      }
      return prev;
    });
  }, []);

  const zoomOutFacit = useCallback(() => {
    setFacitScale((prev) => {
      if (prev > MIN_SCALE) {
        return prev - 0.1;
      }
      return prev;
    });
  }, []);

  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      if (event.button === 1) {
        setIsMiddleMouseDown(true);
      }
    };

    const handleMouseUp = (event: MouseEvent) => {
      if (event.button === 1) {
        setIsMiddleMouseDown(false);
      }
    };

    const handleWheel = (event: WheelEvent) => {
      if (isMiddleMouseDown) {
        event.preventDefault();
        if (event.deltaY < 0) {
          zoomIn();
          zoomInFacit();
        } else {
          zoomOut();
          zoomOutFacit();
        }
      }
    };

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('wheel', handleWheel);
    };
  }, [isMiddleMouseDown, zoomIn, zoomOut, zoomInFacit, zoomOutFacit]);

  const rotateClockwise = useCallback(
    () => setRotation((prev) => prev + 90),
    []
  );
  const rotateCounterClockwise = useCallback(
    () => setRotation((prev) => prev - 90),
    []
  );
  const rotateFacitClockwise = useCallback(
    () => setFacitRotation((prev) => prev + 90),
    []
  );
  const rotateFacitCounterClockwise = useCallback(
    () => setFacitRotation((prev) => prev - 90),
    []
  );

  const onDocumentLoadSuccess = useCallback(
    ({ numPages }: { numPages: number }) => setNumPages(numPages),
    []
  );
  const onFacitDocumentLoadSuccess = useCallback(
    ({ numPages }: { numPages: number }) => setFacitNumPages(numPages),
    []
  );

  const handlePanelResize = useCallback(() => {
    if (leftPanelRef.current && rightPanelRef.current) {
      const leftSize = leftPanelRef.current.getSize();
      const rightSize = rightPanelRef.current.getSize();

      const newScale = (leftSize / leftPanelWidth) * scale;
      const newFacitScale = (rightSize / rightPanelWidth) * facitScale;

      setScale(Math.min(Math.max(newScale, 0.5), 3.0));
      setFacitScale(Math.min(Math.max(newFacitScale, 0.5), 3.0));

      setLeftPanelWidth(leftSize);
      setRightPanelWidth(rightSize);
    }
  }, [leftPanelWidth, rightPanelWidth, scale, facitScale]);

  useEffect(() => {
    handlePanelResize();
  }, [leftPanelWidth, rightPanelWidth, handlePanelResize]);

  const handleArrowKeyPress = useCallback((event: KeyboardEvent) => {
    if (showGlobalSearch) return;

    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      const leftPanel = leftPanelRef.current;
      const rightPanel = rightPanelRef.current;
      if (leftPanel && rightPanel) {
        const leftSize = leftPanel.getSize();
        const increment = event.key === 'ArrowLeft' ? -5 : 5;
        const newLeftSize = Math.max(0, Math.min(100, leftSize + increment));
        leftPanel.resize(newLeftSize);
        rightPanel.resize(100 - newLeftSize);
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleArrowKeyPress);
    return () => {
      window.removeEventListener('keydown', handleArrowKeyPress);
    };
  }, [handleArrowKeyPress]);

  useEffect(() => {
    if (showAIDrawer || showGlobalSearch) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 't') {
        handleToggleBlur();
      }
      if (event.key === '+') {
        zoomIn();
        zoomInFacit();
      }
      if (event.key === '-') {
        zoomOut();
        zoomOutFacit();
      }
      if (event.key === 'l') {
        rotateClockwise();
        rotateFacitClockwise();
      }
      if (event.key === 'r') {
        rotateCounterClockwise();
        rotateFacitCounterClockwise();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    handleToggleBlur,
    zoomIn,
    zoomOut,
    zoomInFacit,
    zoomOutFacit,
    rotateClockwise,
    rotateCounterClockwise,
    rotateFacitClockwise,
    rotateFacitCounterClockwise,
    showAIDrawer,
    showGlobalSearch,
  ]);

  const {
    data: examData,
    error: fetchError,
    isLoading,
  } = useSWR(`exam:${tenta_id}`, fetcher);

  const detectedFacit = useMemo(() => {
    if (!selectedExam || !exams) return null;
    return findFacitForExam(selectedExam, exams);
  }, [selectedExam, exams]);

  useEffect(() => {
    const fetchExamData = async () => {
      try {
        setNumPages(0);
        setLoadingFacit(true);
        if (examData) {
          setSelectedExam(examData);

          const pdfData = await retryFetch(() =>
            fetcher(`pdf:${examData.document_id}`)
          );
          setPdfUrl(pdfData);
        }
      } catch (error) {
        setError('Failed to load the main PDF. Please try again later.');
      } finally {
        setLoadingFacit(false);
      }
    };

    if (examData) {
      fetchExamData();
    }
  }, [examData]);

  useEffect(() => {
    if (!selectedFacit && detectedFacit) {
      setSelectedFacit(detectedFacit);
    }
  }, [detectedFacit, selectedFacit]);

  useEffect(() => {
    if (!selectedFacit) return;

    const fetchFacitData = async () => {
      try {
        setFacitNumPages(0);
        setLoadingFacit(true);

        if (selectedFacit.document_id) {
          const pdfData = await retryFetch(() =>
            fetcher(`pdf:${selectedFacit.document_id}`)
          );
          setFacitPdfUrl(pdfData);
        } else {
          setFacitPdfUrl(null);
        }
      } catch (error) {
        console.error('Failed to load the Facit PDF:', error);
        setError('Failed to load the Facit PDF. Please try again later.');
      } finally {
        setLoadingFacit(false);
      }
    };

    fetchFacitData();
  }, [selectedFacit]);

  const handleMouseMove = (event: MouseEvent) => {
    const facitPanel = facitPanelRef.current;
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    if (facitPanel) {
      const rect = facitPanel.getBoundingClientRect();
      const isOverFacit =
        mouseX >= rect.left &&
        mouseX <= rect.right &&
        mouseY >= rect.top &&
        mouseY <= rect.bottom;

      if (isOverFacit || mouseX > window.innerWidth * 0.95) {
        setIsHovering(true);
      } else if (!isOverFacit) {
        setIsHovering(false);
      }
    }
  };

  useEffect(() => {
    if (showAIDrawer || layoutMode !== 'exam-only' || showGlobalSearch) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'e') {
        setIsToggled((prev) => {
          if (prev && isHovering) {
            setIsHovering(false);
          }
          return !prev;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showAIDrawer, setIsToggled, layoutMode, showGlobalSearch, isHovering]);

  const changeLayoutMode = (mode: string) => {
    setLayoutMode(mode);
    Cookies.set('layoutMode', mode, { expires: 365 });
  };

  const facitVariants = {
    hidden: {
      x: '100%',
      opacity: 0,
    },
    visible: {
      x: '0%',
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
        opacity: { duration: 0.3 },
        filter: { duration: 0.2, delay: 0.1 },
      },
    },
    exit: {
      x: '100%',
      opacity: 0,
      transition: {
        duration: 0.2,
        ease: [0.4, 0, 1, 1],
      },
    },
  };

  useEffect(() => {
    if (layoutMode === 'exam-only') {
      window.addEventListener('mousemove', handleMouseMove);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [layoutMode]);

  if (fetchError) return <p>{fetchError.message}</p>;

  if (!selectedExam || isLoading) {
    return null;
  }

  return (
    <div className='w-full bg-background relative h-full flex flex-col items-center justify-center overflow-hidden'>
      {error ? (
        <div className='flex flex-col items-center justify-center w-full h-full'>
          <h2 className='text-2xl font-bold'>Error</h2>
          <p>{error}</p>
          <p>
            Please try refreshing the page or contact support if the issue
            persists.
          </p>
        </div>
      ) : (
        <>
          <Toolbar
            facitScale={facitScale}
            isBlurred={isBlurred}
            onRotateClockwise={rotateClockwise}
            onRotateCounterClockwise={rotateCounterClockwise}
            onRotateFacitClockwise={rotateFacitClockwise}
            onRotateFacitCounterClockwise={rotateFacitCounterClockwise}
            toggleBlur={handleToggleBlur}
            onZoomIn={zoomIn}
            onZoomOut={zoomOut}
            onFacitZoomIn={zoomInFacit}
            onFacitZoomOut={zoomOutFacit}
            facitPdfUrl={facitPdfUrl}
            pdfUrl={pdfUrl}
            selectedExam={selectedExam}
            exams={exams as Exam[]}
            layoutMode={layoutMode}
            setSelectedFacit={setSelectedFacit}
          />
          <div className='flex flex-col w-full h-full overflow-hidden'>
            <div className='flex-grow hidden md:flex w-full h-full overflow-hidden'>
              {layoutMode === 'exam-only' ? (
                <>
                  <div
                    className={`w-full h-full pdf-container ${
                      isToggled ? 'overflow-hidden' : 'overflow-auto'
                    } flex items-center justify-center`}
                  >
                    <PDFViewer
                      pdfUrl={pdfUrl!}
                      scale={scale}
                      rotation={rotation}
                      numPages={numPages}
                      onLoadSuccess={onDocumentLoadSuccess}
                    />
                  </div>
                  {facitPdfUrl && (
                    <motion.div
                      className='absolute bg-background/80 backdrop-blur-sm border-l right-0 top-0 w-[50%] h-full z-40 facit-panel'
                      variants={facitVariants}
                      initial='hidden'
                      animate={isHovering || isToggled ? 'visible' : 'hidden'}
                      ref={facitPanelRef}
                    >
                      <FacitToolbar
                        onRotateFacitClockwise={rotateFacitClockwise}
                        onRotateFacitCounterClockwise={
                          rotateFacitCounterClockwise
                        }
                        onFacitZoomIn={zoomInFacit}
                        onFacitZoomOut={zoomOutFacit}
                        facitPdfUrl={facitPdfUrl}
                        exams={exams as Exam[]}
                        setSelectedFacit={setSelectedFacit}
                        selectedExam={selectedExam}
                      />
                      <FacitViewer
                        facitPdfUrl={facitPdfUrl}
                        facitScale={facitScale}
                        facitRotation={facitRotation}
                        facitNumPages={facitNumPages}
                        handleMouseEnter={handleMouseEnter}
                        handleMouseLeave={handleMouseLeave}
                        onFacitDocumentLoadSuccess={onFacitDocumentLoadSuccess}
                        selectedFacit={selectedFacit}
                        loadingFacit={loadingFacit}
                        getTranslation={getTranslation}
                        setFacitScale={setFacitScale}
                      />
                    </motion.div>
                  )}

                  {!isHovering && (
                    <GradientIndicator
                      detectedFacit={detectedFacit}
                      facitPdfUrl={facitPdfUrl}
                      getTranslation={getTranslation}
                    />
                  )}
                </>
              ) : (
                <ResizablePanelGroup
                  direction='horizontal'
                  className='w-full h-full'
                >
                  <ResizablePanel
                    defaultSize={55}
                    minSize={20}
                    ref={leftPanelRef}
                    onResize={handlePanelResize}
                  >
                    <div className='w-full h-full pdf-container overflow-auto z-50 flex items-start justify-start'>
                      <PDFViewer
                        pdfUrl={pdfUrl!}
                        scale={scale}
                        rotation={rotation}
                        numPages={numPages}
                        onLoadSuccess={onDocumentLoadSuccess}
                      />
                    </div>
                  </ResizablePanel>
                  <ResizableHandle withHandle />
                  <ResizablePanel
                    defaultSize={45}
                    minSize={20}
                    ref={rightPanelRef}
                    className='relative'
                    onResize={handlePanelResize}
                  >
                    {selectedFacit && facitPdfUrl && (
                      <div
                        className={`flex h-full w-full top-0 absolute flex-col items-center justify-center transition-all duration-300 ${
                          isBlurred && !isMouseOver
                            ? 'backdrop-blur-md bg-background/50 z-30'
                            : 'bg-transparent z-[-10]'
                        }`}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                      >
                        <p className='font-medium'>
                          {getTranslation('mouseOverDescription')}
                        </p>
                        <MousePointerClick
                          className='w-7 h-7 mt-2'
                          onClick={() => setIsBlurred(false)}
                        />
                      </div>
                    )}
                    <div className='w-full h-full pdf-container flex flex-col items-center justify-start overflow-auto z-20'>
                      <FacitViewer
                        facitPdfUrl={facitPdfUrl}
                        facitScale={facitScale}
                        facitRotation={facitRotation}
                        facitNumPages={facitNumPages}
                        handleMouseEnter={handleMouseEnter}
                        handleMouseLeave={handleMouseLeave}
                        onFacitDocumentLoadSuccess={onFacitDocumentLoadSuccess}
                        selectedFacit={selectedFacit}
                        loadingFacit={loadingFacit}
                        getTranslation={getTranslation}
                        setFacitScale={setFacitScale}
                      />
                    </div>
                  </ResizablePanel>
                </ResizablePanelGroup>
              )}
            </div>
            {/* Small pdf */}
            <div className='overflow-x-auto flex md:hidden h-full'>
              <MobilePDFView
                facitPdfUrl={facitPdfUrl}
                facitRotation={facitRotation}
                onFacitLoadSuccess={onFacitDocumentLoadSuccess}
                onLoadSuccess={onDocumentLoadSuccess}
                pdfUrl={pdfUrl}
                rotation={rotation}
                scale={scale}
                facitScale={facitScale}
                facitNumPages={facitNumPages}
                numPages={numPages}
                getTranslation={getTranslation}
                onFacitZoomIn={zoomInFacit}
                onFacitZoomOut={zoomOutFacit}
                onRotateClockwise={rotateClockwise}
                onRotateCounterClockwise={rotateCounterClockwise}
                onRotateFacitClockwise={rotateFacitClockwise}
                onRotateFacitCounterClockwise={rotateFacitCounterClockwise}
                onZoomIn={zoomIn}
                onZoomOut={zoomOut}
              />
            </div>
          </div>
        </>
      )}

      {/* Change Layout Buttons */}
      <div className='fixed z-40 bottom-10 left-5 hidden md:flex space-x-2'>
        <Tabs
          defaultValue={layoutMode}
          className='fixed z-40 bottom-10 left-5 w-auto'
        >
          <TabsList>
            <TabsTrigger
              value='exam-with-facit'
              onClick={() => {
                changeLayoutMode('exam-with-facit');
                setScale(1.2);
              }}
              className='transition-all duration-200 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground'
            >
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild className='z-40'>
                    <IconLayoutColumns />
                  </TooltipTrigger>
                  <TooltipContent autoFocus={false}>
                    <p>{getTranslation('examAndFacit')}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </TabsTrigger>
            <TabsTrigger
              value='exam-only'
              onClick={() => {
                changeLayoutMode('exam-only');
                setScale(1.4);
              }}
              className='transition-all text-xs duration-200 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground'
            >
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild className='z-40'>
                    <IconLayoutSidebarRight />
                  </TooltipTrigger>
                  <TooltipContent autoFocus={false}>
                    <p>{getTranslation('examOnly')}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};

export default PDFModal;
