import "@/lib/pdfWorker";

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
import { AnimatePresence, motion } from "framer-motion";
// Icons
import {
  Maximize,
  Minimize,
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  Timer,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { ExamModeManager } from "@/lib/examMode";
import LoadingSpinner from "@/components/LoadingSpinnger";
import PDFViewer from "@/components/PDF/PDFViewer";
import { pdfjs } from "react-pdf";
import { useExamDetails } from "@/hooks/useExamDetail";
import { useLanguage } from "@/context/LanguageContext";
import { useMetadata } from "@/hooks/useMetadata";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const ExamModePage: React.FC = () => {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const { language } = useLanguage();

  const [session] = useState(ExamModeManager.getCurrentSession());
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showFinishDialog, setShowFinishDialog] = useState(false);
  const [showTimeUpDialog, setShowTimeUpDialog] = useState(false);

  const [numPages, setNumPages] = useState<number>();
  const [scale, setScale] = useState<number>(1.3);
  const [rotation, setRotation] = useState<number>(0);

  const [showControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const {
    examDetail,
    isLoading: detailLoading,
    isError: detailError,
  } = useExamDetails(Number(examId));

  useMetadata({
    title: `LiU Tentor | ${language === "sv" ? "Tentamode" : "Exam Mode"}${
      examDetail ? ` - ${examDetail.exam.course_code}` : ""
    }`,
    description:
      language === "sv"
        ? "Genomför tentamode med tidtagning och riktiga tentaförhållanden för att testa dina kunskaper."
        : "Take exam mode with timing and real exam conditions to test your knowledge.",
    keywords:
      "tentamode, exam mode, timed exam, practice exam, Linköpings Universitet, LiU, tenta",
    ogTitle: `LiU Tentor | ${language === "sv" ? "Tentamode" : "Exam Mode"}${
      examDetail ? ` - ${examDetail.exam.course_code}` : ""
    }`,
    ogDescription:
      language === "sv"
        ? "Genomför tentamode med tidtagning och riktiga tentaförhållanden för att testa dina kunskaper."
        : "Take exam mode with timing and real exam conditions to test your knowledge.",
    ogType: "website",
    twitterCard: "summary",
    twitterTitle: `LiU Tentor | ${
      language === "sv" ? "Tentamode" : "Exam Mode"
    }${examDetail ? ` - ${examDetail.exam.course_code}` : ""}`,
    twitterDescription:
      language === "sv"
        ? "Genomför tentamode med tidtagning och riktiga tentaförhållanden för att testa dina kunskaper."
        : "Take exam mode with timing and real exam conditions to test your knowledge.",
    robots: "noindex, nofollow",
  });

  useEffect(() => {
    if (!session || session.examId !== examId) {
      navigate("/", { replace: true });
    }
  }, [session, examId, navigate]);

  useEffect(() => {
    if (!session) return;

    const updateTimer = () => {
      const remaining = ExamModeManager.getTimeRemaining();
      setTimeRemaining(remaining);

      if (remaining <= 0) {
        setShowTimeUpDialog(true);
        ExamModeManager.handleExpiredSession(session);
      }
    };

    updateTimer();
    setIsPaused(ExamModeManager.isPaused());

    timerRef.current = setInterval(updateTimer, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [session, navigate]);

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

  if (detailError) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-2xl font-medium mb-4">Error</h2>
          <p className="text-white/70">
            {detailError || "Failed to load exam"}
          </p>
        </div>
      </div>
    );
  }

  if (!session || detailLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-hidden">
      <AnimatePresence>
        {isPaused && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/70 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <div className="text-center">
              <h2 className="text-4xl font-bold mb-4">{t.paused}</h2>
              <Button onClick={handlePauseResume} size="lg">
                <Play className="w-5 h-5 mr-2" />
                {t.resume}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-0 left-0 right-0 z-40 bg-background/90 backdrop-blur-sm border-b"
          >
            <div className="flex items-center justify-between p-4">
              {/* Timer */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Timer className="w-5 h-5" />
                  <span className="ibm-plex-mono text-lg font-medium">
                    {formatTime(timeRemaining)}
                  </span>
                </div>
                <div className="text-foreground/60 text-sm">
                  {t.timeRemaining}
                </div>
              </div>

              {/* PDF Controls */}
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={zoomOut}>
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={zoomIn}>
                  <ZoomIn className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={rotateCounterClockwise}
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={rotateClockwise}>
                  <RotateCw className="w-4 h-4" />
                </Button>
                <div className="w-px h-6 bg-white/20 mx-2" />
                <Button variant="ghost" size="sm" onClick={toggleFullscreen}>
                  {isFullscreen ? (
                    <Minimize className="w-4 h-4" />
                  ) : (
                    <Maximize className="w-4 h-4" />
                  )}
                </Button>
              </div>

              {/* Session Controls */}
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={handlePauseResume}>
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

      <div className="flex-1 flex items-center justify-center p-8 pt-24 overflow-hidden">
        <div className={`w-full max-w-5xl h-full rounded-t-2xl`}>
          <div className="h-full p-4 overflow-auto">
            {examDetail ? (
              <div className="h-full w-full flex justify-center overflow-auto">
                <PDFViewer
                  pdfUrl={examDetail.exam.pdf_url}
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
            <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={confirmFinishExam}
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
