import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

import { Columns2, MousePointerClick, PanelRight } from "lucide-react";
import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import Cookies from "js-cookie";
import { ExamWithSolutions } from "@/types/exam";
import FacitToolbar from "./PDF/FacitToolbar";
import FacitViewer from "@/components/PDF/FacitViewer";
import GradientIndicator from "@/components/GradientIndicator";
import { ImperativePanelHandle } from "react-resizable-panels";
import MobilePDFView from "@/components/MobilePdfViewer";
import PDFViewer from "@/components/PDF/PDFViewer";
import TentaFacitToolbar from "./PDF/Toolbar/SolutionToolbar";
import TentaToolbar from "./PDF/Toolbar/ExamToolbar";
import { motion } from "framer-motion";
import { pdfjs } from "react-pdf";
import translations from "@/util/translations";
import { useLanguage } from "@/context/LanguageContext";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

interface PDFViewProps {
  examDetail: ExamWithSolutions | null;
}

const PDFView: FC<PDFViewProps> = ({ examDetail }) => {
  const pdfUrls = useMemo(
    () => ({
      examPdfUrl: examDetail?.exam.pdf_url || null,
      facitPdfUrl:
        examDetail?.solutions && examDetail.solutions.length > 0
          ? examDetail.solutions[0].pdf_url
          : null,
    }),
    [examDetail?.exam.pdf_url, examDetail?.solutions]
  );

  const { language } = useLanguage();

  const [numPages, setNumPages] = useState<number>();
  const [facitNumPages, setFacitNumPages] = useState<number>();
  const [facitScale, setFacitScale] = useState<number>(1.3);
  const [rotation, setRotation] = useState<number>(0);
  const [facitRotation, setFacitRotation] = useState<number>(0);
  const [isBlurred, setIsBlurred] = useState<boolean>(true);
  const [isMouseOverFacitViewer, setIsMouseOverFacitViewer] =
    useState<boolean>(false);
  const [isMiddleMouseDown, setIsMiddleMouseDown] = useState(false);

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

  // Funktionen för att byta layout-läge
  const changeLayoutMode = (mode: string) => {
    setLayoutMode(mode);
    Cookies.set("layoutMode", mode, { expires: 365 });
  };

  useEffect(() => {
    const screenWidth = window.innerWidth;
    let baseScale = 1.2;
    if (screenWidth >= 1600) baseScale = 1.6;
    else if (screenWidth <= 1280) baseScale = 1.0;
    const newExamScale =
      layoutMode === "exam-only" ? baseScale + 0.2 : baseScale;
    setScale(newExamScale);
    setFacitScale(baseScale);
  }, [layoutMode]);

  // Optimized mouse move handler with throttling to improve performance
  useEffect(() => {
    let rafId: number | null = null;

    const handleMouseMove = () => {
      if (rafId) return; // Throttle using requestAnimationFrame

      rafId = requestAnimationFrame(() => {
        setIsMouseActive(true);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          if (!isHoveringFacitPanelRef.current && !isHoveringTabsRef.current) {
            setIsMouseActive(false);
          }
        }, 1000);
        rafId = null;
      });
    };

    handleMouseMove();
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  // Memoize translation function to avoid recreating on every render
  const getTranslation = useMemo(() => {
    return (key: keyof (typeof translations)[typeof language]) => {
      return translations[language][key];
    };
  }, [language]);

  // Optimized mouse event handlers with useCallback
  const handleToggleBlur = useCallback(() => setIsBlurred((prev) => !prev), []);
  const handleMouseEnterFacitViewer = useCallback(
    () => setIsMouseOverFacitViewer(true),
    []
  );
  const handleMouseLeaveFacitViewer = useCallback(
    () => setIsMouseOverFacitViewer(false),
    []
  );

  // Memoize scale constants
  const scaleConfig = useMemo(
    () => ({
      MIN_SCALE: 0.5,
      MAX_SCALE: 3.0,
      ZOOM_STEP: 0.1,
    }),
    []
  );

  // Optimized zoom functions with memoized scale config
  const zoomIn = useCallback(
    () =>
      setScale((p) =>
        Math.min(p + scaleConfig.ZOOM_STEP, scaleConfig.MAX_SCALE)
      ),
    [scaleConfig]
  );
  const zoomOut = useCallback(
    () =>
      setScale((p) =>
        Math.max(p - scaleConfig.ZOOM_STEP, scaleConfig.MIN_SCALE)
      ),
    [scaleConfig]
  );
  const zoomInFacit = useCallback(
    () =>
      setFacitScale((p) =>
        Math.min(p + scaleConfig.ZOOM_STEP, scaleConfig.MAX_SCALE)
      ),
    [scaleConfig]
  );
  const zoomOutFacit = useCallback(
    () =>
      setFacitScale((p) =>
        Math.max(p - scaleConfig.ZOOM_STEP, scaleConfig.MIN_SCALE)
      ),
    [scaleConfig]
  );

  // Optimized mouse/wheel events with better performance
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
        // Throttle zoom actions
        if (e.deltaY < 0) {
          zoomIn();
          zoomInFacit();
        } else {
          zoomOut();
          zoomOutFacit();
        }
      }
    };

    window.addEventListener("mousedown", handleMouseDown, { passive: true });
    window.addEventListener("mouseup", handleMouseUp, { passive: true });
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

  // Optimized panel resize handler with throttling
  const handlePanelResize = useCallback(() => {
    if (leftPanelRef.current && rightPanelRef.current) {
      const leftSize = leftPanelRef.current.getSize();
      const rightSize = rightPanelRef.current.getSize();
      const newScale = (leftSize / leftPanelWidth) * scale;
      const newFacitScale = (rightSize / rightPanelWidth) * facitScale;
      setScale(
        Math.min(
          Math.max(newScale, scaleConfig.MIN_SCALE),
          scaleConfig.MAX_SCALE
        )
      );
      setFacitScale(
        Math.min(
          Math.max(newFacitScale, scaleConfig.MIN_SCALE),
          scaleConfig.MAX_SCALE
        )
      );
      setLeftPanelWidth(leftSize);
      setRightPanelWidth(rightSize);
    }
  }, [leftPanelWidth, rightPanelWidth, scale, facitScale, scaleConfig]);

  // Remove the unnecessary useEffect that calls handlePanelResize immediately
  // as it's already handled by the panel resize events

  const handleArrowKeyPress = useCallback((e: KeyboardEvent) => {
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
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleArrowKeyPress);
    return () => window.removeEventListener("keydown", handleArrowKeyPress);
  }, [handleArrowKeyPress]);

  // Optimized keyboard handler with memoized actions
  const keyboardActions = useMemo(
    () => ({
      t: handleToggleBlur,
      "+": () => {
        zoomIn();
        zoomInFacit();
      },
      "-": () => {
        zoomOut();
        zoomOutFacit();
      },
      l: () => {
        rotateClockwise();
        rotateFacitClockwise();
      },
      r: () => {
        rotateCounterClockwise();
        rotateFacitCounterClockwise();
      },
    }),
    [
      handleToggleBlur,
      zoomIn,
      zoomOut,
      zoomInFacit,
      zoomOutFacit,
      rotateClockwise,
      rotateCounterClockwise,
      rotateFacitClockwise,
      rotateFacitCounterClockwise,
    ]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const action = keyboardActions[e.key as keyof typeof keyboardActions];
      if (action) action();
    };
    window.addEventListener("keydown", handleKeyDown, { passive: true });
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [keyboardActions]);

  const containerRef = useRef<HTMLDivElement>(null);

  // Memoize animation variants to prevent recreation
  const facitVariants = useMemo(
    () => ({
      hidden: { x: "100%", opacity: 0, filter: "blur(8px)" },
      visible: { x: "0%", opacity: 1, filter: "blur(0px)" },
    }),
    []
  );

  // Memoize thresholds
  const thresholds = useMemo(
    () => ({
      OPEN_THRESHOLD: 0.95,
      CLOSE_THRESHOLD: 0.5,
    }),
    []
  );

  const shouldFacitPanelBeVisible = isHoveringFacitPanel || isToggled;
  const isVisibleRef = useRef(false);

  // Optimized facit panel mouse move handler with throttling
  const handleFacitPanelMouseMove = useCallback(
    (e: MouseEvent) => {
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

      if (!isVisibleRef.current && pct >= thresholds.OPEN_THRESHOLD) {
        setIsHoveringFacitPanel(true);
        isVisibleRef.current = true;
      } else if (isVisibleRef.current && pct <= thresholds.CLOSE_THRESHOLD) {
        setIsHoveringFacitPanel(false);
        isVisibleRef.current = false;
      }
    },
    [thresholds]
  );

  useEffect(() => {
    if (layoutMode !== "exam-only") return;
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
  }, [setIsToggled, layoutMode, isHoveringFacitPanel]);

  // Add throttling to the mouse move event for better performance
  useEffect(() => {
    if (layoutMode !== "exam-only") return;

    let rafId: number | null = null;
    const throttledMouseMove = (e: MouseEvent) => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        handleFacitPanelMouseMove(e);
        rafId = null;
      });
    };

    window.addEventListener("mousemove", throttledMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", throttledMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [layoutMode, handleFacitPanelMouseMove]);

  if (!examDetail) return null;

  return (
    <div
      ref={containerRef}
      className="w-full mt-0 h-screen md:mt-14 md:max-h-[calc(100vh - 3.5rem)] relative bg-background flex flex-col items-center justify-center overflow-hidden"
    >
      {!examDetail ? (
        <div className="flex flex-col items-center justify-center w-full h-full">
          <h2 className="text-2xl font-medium">Error</h2>
          <p>Please try refreshing the page or contact support.</p>
        </div>
      ) : (
        <>
          <TentaToolbar
            pdfUrl={pdfUrls.examPdfUrl}
            onZoomIn={zoomIn}
            onZoomOut={zoomOut}
            onRotateClockwise={rotateClockwise}
            onRotateCounterClockwise={rotateCounterClockwise}
          />
          {layoutMode !== "exam-only" && (
            <TentaFacitToolbar
              facitPdfUrl={pdfUrls.facitPdfUrl}
              onFacitZoomIn={zoomInFacit}
              onFacitZoomOut={zoomOutFacit}
              onRotateFacitClockwise={rotateFacitClockwise}
              onRotateFacitCounterClockwise={rotateFacitCounterClockwise}
              onToggleBlur={handleToggleBlur}
              isBlurred={isBlurred}
            />
          )}

          {/** Desktop view */}
          <div className="grow hidden md:flex w-full relative h-full">
            {layoutMode === "exam-only" ? (
              <>
                <div
                  className={`w-full h-full pdf-container ${
                    isToggled ? "" : "overflow-auto"
                  } flex items-center justify-center`}
                >
                  <PDFViewer
                    pdfUrl={examDetail.exam.pdf_url}
                    scale={scale}
                    rotation={rotation}
                    numPages={numPages}
                    onLoadSuccess={onDocumentLoadSuccess}
                  />
                </div>
                <motion.div
                  className="absolute overflow-auto bg-background/80 backdrop-blur-sm border-l right-0 top-0 w-[50%] h-full z-40 facit-panel"
                  ref={facitPanelRef}
                  variants={facitVariants}
                  initial="hidden"
                  animate={shouldFacitPanelBeVisible ? "visible" : "hidden"}
                  style={{
                    pointerEvents: shouldFacitPanelBeVisible ? "auto" : "none",
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
                    onRotateFacitCounterClockwise={rotateFacitCounterClockwise}
                    onFacitZoomIn={zoomInFacit}
                    onFacitZoomOut={zoomOutFacit}
                    facitPdfUrl={examDetail.solutions[0]?.pdf_url || null}
                  />
                  <FacitViewer
                    facitPdfUrl={examDetail.solutions[0]?.pdf_url || null}
                    facitScale={facitScale}
                    facitRotation={facitRotation}
                    facitNumPages={facitNumPages}
                    handleMouseEnter={handleMouseEnterFacitViewer}
                    handleMouseLeave={handleMouseLeaveFacitViewer}
                    onFacitDocumentLoadSuccess={onFacitDocumentLoadSuccess}
                  />
                </motion.div>
                {!isHoveringFacitPanel && !isToggled && (
                  <GradientIndicator
                    facitPdfUrl={examDetail.solutions[0]?.pdf_url || null}
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
                      pdfUrl={examDetail.exam.pdf_url}
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
                  {examDetail.exam.pdf_url && (
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
                  <div className="w-full h-full pdf-container flex flex-col items-center justify-start z-20">
                    <FacitViewer
                      facitPdfUrl={
                        examDetail.solutions.length > 0
                          ? examDetail.solutions[0].pdf_url
                          : null
                      }
                      facitScale={facitScale}
                      facitRotation={facitRotation}
                      facitNumPages={facitNumPages}
                      handleMouseEnter={handleMouseEnterFacitViewer}
                      handleMouseLeave={handleMouseLeaveFacitViewer}
                      onFacitDocumentLoadSuccess={onFacitDocumentLoadSuccess}
                    />
                  </div>
                </ResizablePanel>
              </ResizablePanelGroup>
            )}
          </div>

          {/** Mobile View */}
          <div className="overflow-x-auto flex md:hidden h-full">
            <MobilePDFView
              facitPdfUrl={
                examDetail.solutions.length > 0
                  ? examDetail.solutions[0].pdf_url
                  : null
              }
              facitRotation={facitRotation}
              onFacitLoadSuccess={onFacitDocumentLoadSuccess}
              onLoadSuccess={onDocumentLoadSuccess}
              pdfUrl={examDetail.exam.pdf_url}
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
              <Columns2 />
            </TabsTrigger>
            <TabsTrigger
              value="exam-only"
              onClick={() => changeLayoutMode("exam-only")}
              className="transition-all text-xs duration-200 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <PanelRight />
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default PDFView;
