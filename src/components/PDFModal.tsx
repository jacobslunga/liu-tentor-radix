import { Exam } from "@/components/data-table/columns";
import FacitViewer from "@/components/PDF/FacitViewer";
import PDFViewer from "@/components/PDF/PDFViewer";
import { fetcher, findFacitForExam } from "@/components/PDF/utils";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useLanguage } from "@/context/LanguageContext";
import translations from "@/util/translations";
import { AnimatePresence, motion } from "framer-motion";
import Cookies from "js-cookie";
import { Columns2, MousePointerClick, PanelRight } from "lucide-react";
import {
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { pdfjs } from "react-pdf";
import { ImperativePanelHandle } from "react-resizable-panels";
import useSWR from "swr";

import { retryFetch } from "@/components/PDF/utils";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import FacitToolbar from "./PDF/FacitToolbar";
import TentaFacitToolbar from "./PDF/Toolbar/TentaFacitToolbar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GradientIndicator from "@/components/GradientIndicator";
import MobilePDFView from "@/components/MobilePdfViewer";
import { ShowGlobalSearchContext } from "@/context/ShowGlobalSearchContext";
import TentaToolbar from "./PDF/Toolbar/TentaToolbar";
import { LogoIcon } from "./LogoIcon";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
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
  const [facitScale, setFacitScale] = useState<number>(1.3);
  const [rotation, setRotation] = useState<number>(0);
  const [facitRotation, setFacitRotation] = useState<number>(0);
  const [selectedFacit, setSelectedFacit] = useState<Exam | null>(null);
  const [isBlurred, setIsBlurred] = useState<boolean>(true);
  const [isMouseOverFacitViewer, setIsMouseOverFacitViewer] =
    useState<boolean>(false);
  const [isMiddleMouseDown, setIsMiddleMouseDown] = useState(false);
  const [loadingFacit, setLoadingFacit] = useState(true);
  const [layoutMode, setLayoutMode] = useState<string>(() => {
    const savedLayoutMode = Cookies.get("layoutMode");
    return savedLayoutMode || "exam-with-facit";
  });
  const [isMouseActive, setIsMouseActive] = useState(true);
  const [scale, setScale] = useState<number>(1.2);

  const facitPanelRef = useRef<HTMLDivElement>(null);
  const [isHoveringFacitPanel, setIsHoveringFacitPanel] =
    useState<boolean>(false);
  const [isToggled, setIsToggled] = useState<boolean>(false);

  const [leftPanelWidth, setLeftPanelWidth] = useState<number>(50);
  const [rightPanelWidth, setRightPanelWidth] = useState<number>(50);

  const leftPanelRef = useRef<ImperativePanelHandle>(null);
  const rightPanelRef = useRef<ImperativePanelHandle>(null);

  const [isHoveringTabs, setIsHoveringTabs] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isHoveringFacitPanelRef = useRef(isHoveringFacitPanel);
  const isHoveringTabsRef = useRef(isHoveringTabs);

  useEffect(() => {
    const screenWidth = window.innerWidth;
    console.log(screenWidth);
    let baseScale = 1.3;
    if (screenWidth >= 1600) baseScale = 1.6;
    else if (screenWidth <= 1280) baseScale = 1.0;
    const newExamScale =
      layoutMode === "exam-only" ? baseScale + 0.2 : baseScale;
    setScale(newExamScale);
    setFacitScale(baseScale);
  }, [layoutMode]);

  useEffect(() => {
    const handleMouseMove = () => {
      setIsMouseActive(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        if (!isHoveringFacitPanelRef.current && !isHoveringTabsRef.current) {
          setIsMouseActive(false);
        }
      }, 1000);
    };
    handleMouseMove();
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const getTranslation = (
    key: keyof (typeof translations)[typeof language]
  ) => {
    return translations[language][key];
  };

  const handleToggleBlur = useCallback(() => setIsBlurred((prev) => !prev), []);
  const handleMouseEnterFacitViewer = () => setIsMouseOverFacitViewer(true);
  const handleMouseLeaveFacitViewer = () => setIsMouseOverFacitViewer(false);

  const MIN_SCALE = 0.5;
  const MAX_SCALE = 3.0;

  const zoomIn = useCallback(
    () => setScale((p) => Math.min(p + 0.1, MAX_SCALE)),
    []
  );
  const zoomOut = useCallback(
    () => setScale((p) => Math.max(p - 0.1, MIN_SCALE)),
    []
  );
  const zoomInFacit = useCallback(
    () => setFacitScale((p) => Math.min(p + 0.1, MAX_SCALE)),
    []
  );
  const zoomOutFacit = useCallback(
    () => setFacitScale((p) => Math.max(p - 0.1, MIN_SCALE)),
    []
  );

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 1) setIsMiddleMouseDown(true);
    };
    const handleMouseUp = (e: MouseEvent) => {
      if (e.button === 1) setIsMiddleMouseDown(false);
    };
    const handleWheel = (e: WheelEvent) => {
      if (isMiddleMouseDown) {
        e.preventDefault();
        if (e.deltaY < 0) {
          zoomIn();
          zoomInFacit();
        } else {
          zoomOut();
          zoomOutFacit();
        }
      }
    };
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("wheel", handleWheel);
    };
  }, [isMiddleMouseDown, zoomIn, zoomOut, zoomInFacit, zoomOutFacit]);

  const rotateClockwise = useCallback(() => setRotation((p) => p + 90), []);
  const rotateCounterClockwise = useCallback(
    () => setRotation((p) => p - 90),
    []
  );
  const rotateFacitClockwise = useCallback(
    () => setFacitRotation((p) => p + 90),
    []
  );
  const rotateFacitCounterClockwise = useCallback(
    () => setFacitRotation((p) => p - 90),
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

  const handleArrowKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (showGlobalSearch) return;
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        const leftPanel = leftPanelRef.current;
        const rightPanel = rightPanelRef.current;
        if (leftPanel && rightPanel) {
          const leftSize = leftPanel.getSize();
          const increment = e.key === "ArrowLeft" ? -5 : 5;
          const newLeftSize = Math.max(0, Math.min(100, leftSize + increment));
          leftPanel.resize(newLeftSize);
          rightPanel.resize(100 - newLeftSize);
        }
      }
    },
    [showGlobalSearch]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleArrowKeyPress);
    return () => window.removeEventListener("keydown", handleArrowKeyPress);
  }, [handleArrowKeyPress]);

  useEffect(() => {
    if (showAIDrawer || showGlobalSearch) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "t") handleToggleBlur();
      if (e.key === "+") {
        zoomIn();
        zoomInFacit();
      }
      if (e.key === "-") {
        zoomOut();
        zoomOutFacit();
      }
      if (e.key === "l") {
        rotateClockwise();
        rotateFacitClockwise();
      }
      if (e.key === "r") {
        rotateCounterClockwise();
        rotateFacitCounterClockwise();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
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
        setError("Failed to load the main PDF.");
      } finally {
        setLoadingFacit(false);
      }
    };
    if (examData) fetchExamData();
  }, [examData, setPdfUrl]);

  useEffect(() => {
    if (!selectedFacit && detectedFacit) setSelectedFacit(detectedFacit);
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
        console.error("Failed to load Facit PDF:", error);
        setError("Failed to load the Facit PDF.");
      } finally {
        setLoadingFacit(false);
      }
    };
    fetchFacitData();
  }, [selectedFacit, setFacitPdfUrl]);

  const containerRef = useRef<HTMLDivElement>(null);

  const facitVariants = {
    hidden: { x: "100%", opacity: 0, filter: "blur(8px)" },
    visible: { x: "0%", opacity: 1, filter: "blur(0px)" },
  };
  const shouldFacitPanelBeVisible = isHoveringFacitPanel || isToggled;
  const facitPanelOpacity = shouldFacitPanelBeVisible ? 1 : 0;

  const OPEN_THRESHOLD = 0.95;
  const CLOSE_THRESHOLD = 0.5;

  const isVisibleRef = useRef(false);

  const handleFacitPanelMouseMove = useCallback((e: MouseEvent) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    if (
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom
    ) {
      setIsHoveringFacitPanel(false);
      isVisibleRef.current = false;
      return;
    }

    const pct = (e.clientX - rect.left) / rect.width;

    if (!isVisibleRef.current && pct >= OPEN_THRESHOLD) {
      setIsHoveringFacitPanel(true);
      isVisibleRef.current = true;
    } else if (isVisibleRef.current && pct <= CLOSE_THRESHOLD) {
      setIsHoveringFacitPanel(false);
      isVisibleRef.current = false;
    }
  }, []);

  useEffect(() => {
    if (showAIDrawer || layoutMode !== "exam-only" || showGlobalSearch) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "e") {
        setIsToggled((prev) => {
          if (prev && isHoveringFacitPanel) setIsHoveringFacitPanel(false);
          return !prev;
        });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    showAIDrawer,
    setIsToggled,
    layoutMode,
    showGlobalSearch,
    isHoveringFacitPanel,
  ]);

  const changeLayoutMode = (mode: string) => {
    setLayoutMode(mode);
    Cookies.set("layoutMode", mode, { expires: 365 });
  };

  useEffect(() => {
    if (layoutMode === "exam-only") {
      window.addEventListener("mousemove", handleFacitPanelMouseMove);
      return () =>
        window.removeEventListener("mousemove", handleFacitPanelMouseMove);
    }
  }, [layoutMode, handleFacitPanelMouseMove]);

  if (fetchError) return <p>{fetchError.message}</p>;
  if (!selectedExam || isLoading) return null;

  return (
    <div
      ref={containerRef}
      style={{
        maxHeight: "calc(100vh - 4rem)",
        marginTop: "4rem",
      }}
      className="w-full relative bg-background flex flex-col items-center justify-center overflow-hidden"
    >
      {error ? (
        <div className="flex flex-col items-center justify-center w-full h-full">
          <h2 className="text-2xl font-medium">Error</h2> <p>{error}</p>
          <p>Please try refreshing the page or contact support.</p>
        </div>
      ) : (
        <>
          <TentaToolbar
            pdfUrl={pdfUrl}
            onZoomIn={zoomIn}
            onZoomOut={zoomOut}
            onRotateClockwise={rotateClockwise}
            onRotateCounterClockwise={rotateCounterClockwise}
            selectedExam={selectedExam}
          />
          {layoutMode !== "exam-only" && (
            <TentaFacitToolbar
              facitPdfUrl={facitPdfUrl}
              selectedExam={selectedExam}
              exams={exams as Exam[]}
              onFacitZoomIn={zoomInFacit}
              onFacitZoomOut={zoomOutFacit}
              onRotateFacitClockwise={rotateFacitClockwise}
              onRotateFacitCounterClockwise={rotateFacitCounterClockwise}
              onToggleBlur={handleToggleBlur}
              isBlurred={isBlurred}
              setSelectedFacit={setSelectedFacit}
            />
          )}
          <div className="flex flex-col w-full h-full overflow-hidden">
            <div className="flex-grow hidden md:flex w-full h-full overflow-hidden">
              {layoutMode === "exam-only" ? (
                <>
                  <div
                    className={`w-full h-full pdf-container ${
                      isToggled ? "overflow-hidden" : "overflow-auto"
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
                  <AnimatePresence>
                    {facitPdfUrl &&
                      (shouldFacitPanelBeVisible || isToggled) && (
                        <motion.div
                          className="absolute bg-background/80 backdrop-blur-sm border-l right-0 top-0 w-[50%] h-full z-40 facit-panel"
                          ref={facitPanelRef}
                          variants={facitVariants}
                          initial="hidden"
                          animate={
                            shouldFacitPanelBeVisible ? "visible" : "hidden"
                          }
                          exit="hidden"
                          style={{
                            pointerEvents:
                              shouldFacitPanelBeVisible && facitPanelOpacity > 0
                                ? "auto"
                                : "none",
                          }}
                          transition={{
                            x: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
                            opacity: { duration: 0.3 },
                            filter: { duration: 0.3 },
                          }}
                          onHoverStart={() => setIsHoveringFacitPanel(true)}
                          onHoverEnd={() => setIsHoveringFacitPanel(false)}
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
                            handleMouseEnter={handleMouseEnterFacitViewer}
                            handleMouseLeave={handleMouseLeaveFacitViewer}
                            onFacitDocumentLoadSuccess={
                              onFacitDocumentLoadSuccess
                            }
                            selectedFacit={selectedFacit}
                            loadingFacit={loadingFacit}
                            getTranslation={getTranslation}
                            setFacitScale={setFacitScale}
                          />
                        </motion.div>
                      )}
                  </AnimatePresence>
                  {!isHoveringFacitPanel && !isToggled && (
                    <GradientIndicator
                      detectedFacit={detectedFacit}
                      facitPdfUrl={facitPdfUrl}
                      getTranslation={getTranslation}
                    />
                  )}
                </>
              ) : (
                <ResizablePanelGroup
                  direction="horizontal"
                  className="w-full h-full"
                >
                  <ResizablePanel
                    defaultSize={55}
                    minSize={20}
                    ref={leftPanelRef}
                    onResize={handlePanelResize}
                  >
                    <div className="w-full h-full pdf-container overflow-auto z-50 flex items-start justify-start">
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
                    className="relative"
                    onResize={handlePanelResize}
                  >
                    {selectedFacit && facitPdfUrl && (
                      <div
                        className={`flex h-full w-full top-0 absolute flex-col items-center justify-center transition-all duration-300 ${
                          isBlurred && !isMouseOverFacitViewer
                            ? "backdrop-blur-md bg-background/20 z-30"
                            : "bg-transparent z-[-10]"
                        }`}
                        onMouseEnter={handleMouseEnterFacitViewer}
                        onMouseLeave={handleMouseLeaveFacitViewer}
                      >
                        <p className="font-normal">
                          {getTranslation("mouseOverDescription")}
                        </p>
                        <MousePointerClick
                          className="w-7 h-7 mt-2"
                          onClick={() => setIsBlurred(false)}
                        />
                      </div>
                    )}
                    <div className="w-full h-full pdf-container flex flex-col items-center justify-start overflow-auto z-20">
                      <FacitViewer
                        facitPdfUrl={facitPdfUrl}
                        facitScale={facitScale}
                        facitRotation={facitRotation}
                        facitNumPages={facitNumPages}
                        handleMouseEnter={handleMouseEnterFacitViewer}
                        handleMouseLeave={handleMouseLeaveFacitViewer}
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
            <div className="overflow-x-auto flex md:hidden h-full">
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

      <motion.div
        className="fixed z-40 bottom-10 left-5 hidden md:flex space-x-2"
        initial={{ opacity: 1 }}
        animate={{ opacity: isMouseActive || isHoveringTabs ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{
          pointerEvents: isMouseActive || isHoveringTabs ? "auto" : "none",
        }}
        onMouseEnter={() => {
          setIsHoveringTabs(true);
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
        }}
        onMouseLeave={() => {
          setIsHoveringTabs(false);
        }}
      >
        <Tabs defaultValue={layoutMode} className="w-auto">
          <TabsList>
            <TabsTrigger
              value="exam-with-facit"
              onClick={() => changeLayoutMode("exam-with-facit")}
              className="transition-all text-xs duration-200 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Columns2 className="w-5 h-5" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{getTranslation("examAndFacit")}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </TabsTrigger>
            <TabsTrigger
              value="exam-only"
              onClick={() => changeLayoutMode("exam-only")}
              className="transition-all text-xs duration-200 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <PanelRight className="w-5 h-5" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{getTranslation("examOnly")}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </motion.div>

      <p className="text-lg text-foreground/50 font-logo select-none tracking-tight flex items-center space-x-1 fixed z-40 bottom-10 right-5">
        <LogoIcon className="w-7 h-7" />
        <span>{getTranslation("homeTitle")}</span>
      </p>
    </div>
  );
};

export default PDFModal;
