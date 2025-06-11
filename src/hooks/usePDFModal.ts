import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { Exam } from "@/components/data-table/columns";
import { fetcher, findFacitForExam, retryFetch } from "@/components/PDF/utils";
import Cookies from "js-cookie";
import useSWR from "swr";

interface UsePDFModalProps {
  tenta_id: string;
  exams?: Exam[];
  setPdfUrl: React.Dispatch<React.SetStateAction<string | null>>;
  setFacitPdfUrl: React.Dispatch<React.SetStateAction<string | null>>;
}

export const usePDFModal = ({
  tenta_id,
  exams,
  setPdfUrl,
  setFacitPdfUrl,
}: UsePDFModalProps) => {
  // Layout and UI state
  const [layoutMode, setLayoutMode] = useState<string>(() => {
    const savedLayoutMode = Cookies.get("layoutMode");
    return savedLayoutMode || "exam-with-facit";
  });

  // PDF state
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [selectedFacit, setSelectedFacit] = useState<Exam | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingFacit, setLoadingFacit] = useState(true);

  // Page state
  const [numPages, setNumPages] = useState<number>();
  const [facitNumPages, setFacitNumPages] = useState<number>();

  // Zoom and rotation state
  const [scale, setScale] = useState<number>(1.2);
  const [facitScale, setFacitScale] = useState<number>(1.3);
  const [rotation, setRotation] = useState<number>(0);
  const [facitRotation, setFacitRotation] = useState<number>(0);

  // Interaction state
  const [isBlurred, setIsBlurred] = useState<boolean>(true);
  const [isMouseOverFacitViewer, setIsMouseOverFacitViewer] =
    useState<boolean>(false);
  const [isMiddleMouseDown, setIsMiddleMouseDown] = useState(false);
  const [isMouseActive, setIsMouseActive] = useState(true);
  const [isHoveringTabs, setIsHoveringTabs] = useState(false);
  const [isHoveringFacitPanel, setIsHoveringFacitPanel] =
    useState<boolean>(false);
  const [isToggled, setIsToggled] = useState<boolean>(false);

  // Panel state
  const [leftPanelWidth, setLeftPanelWidth] = useState<number>(50);
  const [rightPanelWidth, setRightPanelWidth] = useState<number>(50);

  // Refs
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isHoveringFacitPanelRef = useRef(isHoveringFacitPanel);
  const isHoveringTabsRef = useRef(isHoveringTabs);
  const containerRef = useRef<HTMLDivElement>(null);
  const leftPanelRef = useRef<any>(null);
  const rightPanelRef = useRef<any>(null);

  // Update refs when state changes
  useEffect(() => {
    isHoveringFacitPanelRef.current = isHoveringFacitPanel;
  }, [isHoveringFacitPanel]);

  useEffect(() => {
    isHoveringTabsRef.current = isHoveringTabs;
  }, [isHoveringTabs]);

  // Fetch exam data
  const {
    data: examData,
    error: fetchError,
    isLoading,
  } = useSWR(`exam:${tenta_id}`, fetcher);

  // Memoize detected facit
  const detectedFacit = useMemo(() => {
    if (!selectedExam || !exams) return null;
    return findFacitForExam(selectedExam, exams);
  }, [selectedExam, exams]);

  // Layout mode handler
  const changeLayoutMode = useCallback((mode: string) => {
    setLayoutMode(mode);
    Cookies.set("layoutMode", mode, { expires: 365 });
  }, []);

  // Zoom handlers with constraints
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

  // Rotation handlers
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

  // Document load handlers
  const onDocumentLoadSuccess = useCallback(
    ({ numPages }: { numPages: number }) => setNumPages(numPages),
    []
  );
  const onFacitDocumentLoadSuccess = useCallback(
    ({ numPages }: { numPages: number }) => setFacitNumPages(numPages),
    []
  );

  // Blur toggle
  const handleToggleBlur = useCallback(() => setIsBlurred((prev) => !prev), []);

  // Mouse handlers
  const handleMouseEnterFacitViewer = useCallback(
    () => setIsMouseOverFacitViewer(true),
    []
  );
  const handleMouseLeaveFacitViewer = useCallback(
    () => setIsMouseOverFacitViewer(false),
    []
  );

  // Scale adjustment based on layout
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

  // Panel resize handler
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

  // Facit panel hover logic
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

  // Auto-set facit when detected
  useEffect(() => {
    if (!selectedFacit && detectedFacit) setSelectedFacit(detectedFacit);
  }, [detectedFacit, selectedFacit]);

  // Load exam data
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
      } catch {
        setError("Failed to load the main PDF.");
      } finally {
        setLoadingFacit(false);
      }
    };
    if (examData) fetchExamData();
  }, [examData, setPdfUrl]);

  // Load facit data
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
      } catch {
        setError("Failed to load the Facit PDF.");
      } finally {
        setLoadingFacit(false);
      }
    };
    fetchFacitData();
  }, [selectedFacit, setFacitPdfUrl]);

  // Set up facit panel mouse move listener
  useEffect(() => {
    if (layoutMode === "exam-only") {
      window.addEventListener("mousemove", handleFacitPanelMouseMove);
      return () =>
        window.removeEventListener("mousemove", handleFacitPanelMouseMove);
    }
  }, [layoutMode, handleFacitPanelMouseMove]);

  return {
    // State
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
    isMiddleMouseDown,
    isMouseActive,
    isHoveringTabs,
    isHoveringFacitPanel,
    isToggled,
    leftPanelWidth,
    rightPanelWidth,

    // Refs
    timeoutRef,
    containerRef,
    leftPanelRef,
    rightPanelRef,

    // Handlers
    changeLayoutMode,
    setSelectedFacit,
    setIsBlurred,
    setIsMouseActive,
    setIsHoveringTabs,
    setIsHoveringFacitPanel,
    setIsToggled,
    setIsMiddleMouseDown,
    setScale,
    setFacitScale,

    // Zoom/rotation
    zoomIn,
    zoomOut,
    zoomInFacit,
    zoomOutFacit,
    rotateClockwise,
    rotateCounterClockwise,
    rotateFacitClockwise,
    rotateFacitCounterClockwise,

    // Document handlers
    onDocumentLoadSuccess,
    onFacitDocumentLoadSuccess,
    handleToggleBlur,
    handleMouseEnterFacitViewer,
    handleMouseLeaveFacitViewer,
    handlePanelResize,
    handleFacitPanelMouseMove,

    // Computed values
    detectedFacit,
    shouldFacitPanelBeVisible: isHoveringFacitPanel || isToggled,

    // SWR data
    fetchError,
    isLoading,
  };
};
