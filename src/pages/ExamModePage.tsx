import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import useSWR from "swr";

// PDF imports
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "@/lib/pdfWorker";

// Components
import PDFViewer from "@/components/PDF/PDFViewer";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Icons
import {
  Timer,
  Pause,
  Play,
  ZoomIn,
  ZoomOut,
  RotateCw,
  RotateCcw,
  Maximize,
  Minimize,
  X,
} from "lucide-react";

// Utils and contexts
import { useLanguage } from "@/context/LanguageContext";
import { ExamModeManager } from "@/lib/examMode";
import { fetcher, retryFetch } from "@/components/PDF/utils";
import { useTheme } from "@/context/ThemeContext";

const ExamModePage: React.FC = () => {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { theme } = useTheme();

  // Session state
  const [session] = useState(ExamModeManager.getCurrentSession());
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showFinishDialog, setShowFinishDialog] = useState(false);
  const [showTimeUpDialog, setShowTimeUpDialog] = useState(false);

  // PDF state
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number>();
  const [scale, setScale] = useState<number>(1.3);
  const [rotation, setRotation] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  // UI state
  const [showControls] = useState(true); // Always show controls
  const [isFullscreen, setIsFullscreen] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch exam data
  const {
    data: examData,
    error: fetchError,
    isLoading,
  } = useSWR(examId ? `exam:${examId}` : null, fetcher);

  // Redirect if no session
  useEffect(() => {
    if (!session || session.examId !== examId) {
      navigate("/", { replace: true });
    }
  }, [session, examId, navigate]);

  // Set body background black for exam mode
  useEffect(() => {
    const originalBackground = document.body.style.backgroundColor;

    document.body.style.backgroundColor = "black";

    return () => {
      document.body.style.backgroundColor = originalBackground;
    };
  }, []);

  // Timer logic
  useEffect(() => {
    if (!session) return;

    const updateTimer = () => {
      const remaining = ExamModeManager.getTimeRemaining();
      setTimeRemaining(remaining);

      if (remaining <= 0) {
        // Time expired
        setShowTimeUpDialog(true);
        ExamModeManager.handleExpiredSession(session);
      }
    };

    // Update immediately
    updateTimer();
    setIsPaused(ExamModeManager.isPaused());

    // Update every second
    timerRef.current = setInterval(updateTimer, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [session, navigate]);

  // Load PDF
  useEffect(() => {
    const fetchExamData = async () => {
      try {
        if (examData) {
          const pdfData = await retryFetch(() =>
            fetcher(`pdf:${examData.document_id}`)
          );
          setPdfUrl(pdfData);
        }
      } catch {
        setError("Failed to load the exam PDF.");
      }
    };

    if (examData) fetchExamData();
  }, [examData]);

  // PDF controls
  const zoomIn = useCallback(() => setScale((p) => Math.min(p + 0.1, 3.0)), []);
  const zoomOut = useCallback(
    () => setScale((p) => Math.max(p - 0.1, 0.5)),
    []
  );
  const rotateClockwise = useCallback(() => setRotation((p) => p + 90), []);
  const rotateCounterClockwise = useCallback(
    () => setRotation((p) => p - 90),
    []
  );

  const onDocumentLoadSuccess = useCallback(
    ({ numPages }: { numPages: number }) => setNumPages(numPages),
    []
  );

  // Session controls
  const handlePauseResume = () => {
    if (isPaused) {
      ExamModeManager.resumeSession();
      setIsPaused(false);
    } else {
      ExamModeManager.pauseSession();
      setIsPaused(true);
    }
  };

  const handleFinishExam = () => {
    setShowFinishDialog(true);
  };

  const confirmFinishExam = () => {
    ExamModeManager.completeSession();
    navigate("/", { replace: true });
  };

  const cancelExamMode = () => {
    navigate("/", { replace: true });
  };

  const handleTimeUp = () => {
    setShowTimeUpDialog(false);
    navigate("/", { replace: true });
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Format time
  const formatTime = (ms: number): string => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const translations = {
    sv: {
      examMode: "Exam Mode",
      paused: "PAUSAD",
      resume: "Fortsätt",
      pause: "Pausa",
      finish: "Avsluta",
      finishConfirm: "Är du säker på att du vill avsluta examen?",
      timeRemaining: "Tid kvar",
      cancel: "Avbryt",
      confirmFinish: "Ja, avsluta",
      timeUp: "Tiden är ute!",
      timeUpMessage: "Din tentatid har gått ut. Vi hoppas att det gick bra!",
      backToHome: "Tillbaka till startsidan",
    },
    en: {
      examMode: "Exam Mode",
      paused: "PAUSED",
      resume: "Resume",
      pause: "Pause",
      finish: "Finish",
      finishConfirm: "Are you sure you want to finish the exam?",
      timeRemaining: "Time remaining",
      cancel: "Cancel",
      confirmFinish: "Yes, finish",
      timeUp: "Time's up!",
      timeUpMessage: "Your exam time has expired. We hope it went well!",
      backToHome: "Back to home",
    },
  } as const;

  const t = translations[language as keyof typeof translations];

  if (fetchError || error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-2xl font-medium mb-4">Error</h2>
          <p className="text-white/70">{error || "Failed to load exam"}</p>
        </div>
      </div>
    );
  }

  if (!session || isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col overflow-hidden">
      <Helmet>
        <title>
          {t.examMode} - {session.examName}
        </title>
      </Helmet>

      {/* Pause Overlay */}
      <AnimatePresence>
        {isPaused && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <div className="text-center text-white">
              <h2 className="text-4xl font-bold mb-4">{t.paused}</h2>
              <Button
                onClick={handlePauseResume}
                size="lg"
                className="bg-white text-black hover:bg-white/90"
              >
                <Play className="w-5 h-5 mr-2" />
                {t.resume}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls Header */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-0 left-0 right-0 z-40 bg-black/90 backdrop-blur-sm border-b border-white/10"
          >
            <div className="flex items-center justify-between p-4">
              {/* Timer */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-white">
                  <Timer className="w-5 h-5" />
                  <span className="ibm-plex-mono text-lg font-medium">
                    {formatTime(timeRemaining)}
                  </span>
                </div>
                <div className="text-white/60 text-sm">{t.timeRemaining}</div>
              </div>

              {/* PDF Controls */}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={zoomOut}
                  className="text-white hover:bg-white/10 bg-transparent hover:text-white"
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={zoomIn}
                  className="text-white hover:bg-white/10 bg-transparent hover:text-white"
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={rotateCounterClockwise}
                  className="text-white hover:bg-white/10 bg-transparent hover:text-white"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={rotateClockwise}
                  className="text-white hover:bg-white/10 bg-transparent hover:text-white"
                >
                  <RotateCw className="w-4 h-4" />
                </Button>
                <div className="w-px h-6 bg-white/20 mx-2" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleFullscreen}
                  className="text-white hover:bg-white/10 bg-transparent hover:text-white"
                >
                  {isFullscreen ? (
                    <Minimize className="w-4 h-4" />
                  ) : (
                    <Maximize className="w-4 h-4" />
                  )}
                </Button>
              </div>

              {/* Session Controls */}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePauseResume}
                  className="text-white hover:bg-white/10 bg-transparent hover:text-white"
                >
                  {isPaused ? (
                    <Play className="w-4 h-4" />
                  ) : (
                    <Pause className="w-4 h-4" />
                  )}
                  <span>{t.pause}</span>
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleFinishExam}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <X className="w-4 h-4" />
                  {t.finish}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex items-center justify-center p-8 pt-24 overflow-hidden">
        <div
          className={`w-full max-w-5xl h-full rounded-t-2xl overflow-hidden`}
        >
          <div className="h-full p-4 overflow-auto">
            {pdfUrl ? (
              <div className="h-full w-full flex justify-center">
                <PDFViewer
                  pdfUrl={pdfUrl}
                  scale={scale}
                  rotation={rotation}
                  numPages={numPages}
                  onLoadSuccess={onDocumentLoadSuccess}
                />
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading exam...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Finish Confirmation Dialog */}
      <AlertDialog open={showFinishDialog} onOpenChange={setShowFinishDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.finish}</AlertDialogTitle>
            <AlertDialogDescription>
              {t.finishConfirm}
              <br />
              <span className="font-medium">
                {t.timeRemaining}: {formatTime(timeRemaining)}
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelExamMode}>
              {t.cancel}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmFinishExam}
              className="bg-red-600 hover:bg-red-700"
            >
              {t.confirmFinish}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Time Up Dialog */}
      <AlertDialog open={showTimeUpDialog} onOpenChange={() => {}}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center text-2xl">
              {t.timeUp}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-lg">
              {t.timeUpMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="justify-center">
            <AlertDialogAction onClick={handleTimeUp} className="px-8">
              {t.backToHome}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ExamModePage;
