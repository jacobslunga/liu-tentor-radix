import { Exam } from "@/components/data-table/columns";
import FacitViewer from "@/components/PDF/FacitViewer";
import PDFViewer from "@/components/PDF/PDFViewer";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useLanguage } from "@/context/LanguageContext";
import translations from "@/util/translations";
import { motion } from "framer-motion";
import { Columns2, MousePointerClick, PanelRight } from "lucide-react";
import { FC, useContext } from "react";
import { pdfjs } from "react-pdf";

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
import { usePDFModal } from "@/hooks/usePDFModal";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useMouseInteractions } from "@/hooks/useMouseInteractions";

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

  // Use the custom hook for PDF modal state management
  const pdfModalState = usePDFModal({
    tenta_id,
    exams,
    setPdfUrl,
    setFacitPdfUrl,
  });

  const {
    layoutMode,
    selectedExam,
    selectedFacit,
    error,
    loadingFacit,
    numPages,
    facitNumPages,
    scale,
    facitScale,
    rotation,
    facitRotation,
    isBlurred,
    isMouseOverFacitViewer,
    isMouseActive,
    isHoveringTabs,
    isHoveringFacitPanel,
    isToggled,
    timeoutRef,
    containerRef,
    leftPanelRef,
    rightPanelRef,
    changeLayoutMode,
    setSelectedFacit,
    setIsMouseActive,
    setIsHoveringTabs,
    setIsHoveringFacitPanel,
    setIsToggled,
    setIsMiddleMouseDown,
    zoomIn,
    zoomOut,
    zoomInFacit,
    zoomOutFacit,
    rotateClockwise,
    rotateCounterClockwise,
    rotateFacitClockwise,
    rotateFacitCounterClockwise,
    onDocumentLoadSuccess,
    onFacitDocumentLoadSuccess,
    handleToggleBlur,
    handleMouseEnterFacitViewer,
    handleMouseLeaveFacitViewer,
    handlePanelResize,
    detectedFacit,
    shouldFacitPanelBeVisible,
    fetchError,
    isLoading,
  } = pdfModalState;

  // Use keyboard shortcuts hook
  useKeyboardShortcuts({
    showAIDrawer,
    showGlobalSearch,
    layoutMode,
    isHoveringFacitPanel,
    handleToggleBlur,
    zoomIn,
    zoomOut,
    zoomInFacit,
    zoomOutFacit,
    rotateClockwise,
    rotateCounterClockwise,
    rotateFacitClockwise,
    rotateFacitCounterClockwise,
    setIsToggled,
    setIsHoveringFacitPanel,
    leftPanelRef,
    rightPanelRef,
  });

  // Use mouse interactions hook
  useMouseInteractions({
    zoomIn,
    zoomOut,
    zoomInFacit,
    zoomOutFacit,
    setIsMouseActive,
    setIsMiddleMouseDown,
    isHoveringFacitPanel,
    isHoveringTabs,
    timeoutRef,
  });

  const getTranslation = (
    key: keyof (typeof translations)[typeof language]
  ) => {
    return translations[language][key];
  };

  const facitVariants = {
    hidden: { x: "100%", opacity: 0, filter: "blur(8px)" },
    visible: { x: "0%", opacity: 1, filter: "blur(0px)" },
  };

  if (fetchError) return <p>{fetchError.message}</p>;
  if (!selectedExam || isLoading) return null;

  return (
    <div
      ref={containerRef}
      className="w-full h-screen bg-background flex flex-col overflow-hidden"
    >
      {error ? (
        <div className="flex flex-col items-center justify-center w-full h-full">
          <h2 className="text-2xl font-medium">Error</h2>
          <p>{error}</p>
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
          <div className="flex flex-col w-full h-full overflow-hidden pt-14">
            <div className="flex-grow hidden md:flex w-full h-full overflow-hidden">
              {layoutMode === "exam-only" ? (
                <>
                  <div
                    className={`w-full h-full pdf-container ${
                      isToggled ? "overflow-hidden" : "overflow-auto"
                    } flex items-start justify-center`}
                  >
                    <PDFViewer
                      pdfUrl={pdfUrl!}
                      scale={scale}
                      rotation={rotation}
                      numPages={numPages}
                      onLoadSuccess={onDocumentLoadSuccess}
                    />
                  </div>
                  <motion.div
                    className="absolute bg-background/80 backdrop-blur-sm border-l right-0 top-0 w-[50%] h-full z-40 facit-panel"
                    variants={facitVariants}
                    initial="hidden"
                    animate={shouldFacitPanelBeVisible ? "visible" : "hidden"}
                    style={{
                      pointerEvents: shouldFacitPanelBeVisible
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
                      onFacitDocumentLoadSuccess={onFacitDocumentLoadSuccess}
                      selectedFacit={selectedFacit}
                      loadingFacit={loadingFacit}
                      getTranslation={getTranslation}
                      setFacitScale={pdfModalState.setFacitScale}
                    />
                  </motion.div>
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
                    <div className="w-full h-full pdf-container overflow-auto flex items-start justify-center">
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
                          onClick={() => pdfModalState.setIsBlurred(false)}
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
                        setFacitScale={pdfModalState.setFacitScale}
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
