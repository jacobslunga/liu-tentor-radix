import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Maximize,
  Minimize,
  Pause,
  Play,
  RotateCw,
  Timer,
  ZoomIn,
  ZoomOut,
  Loader2,
} from "lucide-react";

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

import PdfRenderer from "@/components/PDF/PdfRenderer";
import { LockInModeManager } from "@/lib/lockInMode";
import { useExamDetails } from "@/hooks/useExamDetail";
import { useLanguage } from "@/context/LanguageContext";
import { useMetadata } from "@/hooks/useMetadata";

const LockInModePage: React.FC = () => {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const { language } = useLanguage();

  // Session State
  const [session] = useState(LockInModeManager.getCurrentSession());
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Dialog State
  const [showFinishDialog, setShowFinishDialog] = useState(false);
  const [showTimeUpDialog, setShowTimeUpDialog] = useState(false);

  // PDF State
  const [numPages, setNumPages] = useState<number>(0);
  const [scale, setScale] = useState<number>(1.2);
  const [rotation, setRotation] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const {
    examDetail,
    isLoading: detailLoading,
    isError: detailError,
  } = useExamDetails(Number(examId));

  useMetadata({
    title: `Locked In | ${examDetail ? examDetail.exam.course_code : "Exam"}`,
    robots: "noindex, nofollow",
  });

  const returnToNormalExam = () => {
    const currentSession = LockInModeManager.getCurrentSession() || session;

    if (currentSession?.courseCode && currentSession?.examId) {
      navigate(
        `/search/${currentSession.courseCode}/${currentSession.examId}`,
        {
          replace: true,
        },
      );
    } else {
      navigate("/", { replace: true });
    }
  };

  useEffect(() => {
    if (!session || session.examId !== examId) {
      returnToNormalExam();
    }
  }, [session, examId, navigate]);

  useEffect(() => {
    if (!session) return;

    const updateTimer = () => {
      const remaining = LockInModeManager.getTimeRemaining();
      setTimeRemaining(remaining);

      const managerPausedState = LockInModeManager.isPaused();
      if (managerPausedState !== isPaused) {
        setIsPaused(managerPausedState);
      }

      if (remaining <= 0) {
        setShowTimeUpDialog(true);
        if (timerRef.current) clearInterval(timerRef.current);
      }
    };

    updateTimer();

    timerRef.current = setInterval(updateTimer, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [session, isPaused]);

  const zoomIn = useCallback(
    () => setScale((p) => Math.min(p + 0.15, 3.0)),
    [],
  );
  const zoomOut = useCallback(
    () => setScale((p) => Math.max(p - 0.15, 0.5)),
    [],
  );
  const rotateCw = useCallback(() => setRotation((p) => p + 90), []);

  const onDocumentLoadSuccess = useCallback(
    ({ numPages }: { numPages: number }) => setNumPages(numPages),
    [],
  );

  const handlePauseResume = () => {
    if (isPaused) {
      LockInModeManager.resumeSession();
    } else {
      LockInModeManager.pauseSession();
    }

    setIsPaused(!isPaused);
  };

  const confirmFinishExam = () => {
    LockInModeManager.completeSession();
    returnToNormalExam();
  };

  const handleTimeUp = () => {
    if (session) {
      LockInModeManager.handleExpiredSession(session);
    }
    setShowTimeUpDialog(false);
    returnToNormalExam();
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

  const formatTime = (ms: number): string => {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const t = {
    paused: language === "sv" ? "PAUSAD" : "PAUSED",
    resume: language === "sv" ? "Återuppta" : "Resume",
    finishTitle: language === "sv" ? "Avsluta Tenta?" : "Finish Exam?",
    finishDesc:
      language === "sv"
        ? "Är du säker på att du vill lämna in? Du har tid kvar."
        : "Are you sure you want to finish? You still have time remaining.",
    timeUpTitle: language === "sv" ? "Tiden är ute!" : "Time's Up!",
    timeUpDesc:
      language === "sv"
        ? "Bra jobbat! Din session har avslutats."
        : "Good job! Your session has ended.",
    cancel: language === "sv" ? "Avbryt" : "Cancel",
    confirm: language === "sv" ? "Avsluta" : "Finish",
    home: language === "sv" ? "Till startsidan" : "Go Home",
  };

  if (detailLoading || !session) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-2">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-muted-foreground">
          {language === "sv"
            ? "Initierar Lock In-läge..."
            : "Initializing Lock In Mode..."}
        </p>
      </div>
    );
  }

  if (detailError || !examDetail) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <p className="text-destructive font-medium">Failed to load exam.</p>
        <Button onClick={() => navigate("/")} variant="outline">
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-background flex flex-col">
      {/* --- Top Control Bar --- */}
      <div className="absolute top-0 left-0 right-0 z-40 px-4 py-2 flex items-center justify-center pointer-events-none">
        <div className="bg-background border shadow-md rounded-full px-4 py-2 flex items-center gap-6 pointer-events-auto">
          {/* Left: PDF Tools */}
          <div className="flex items-center gap-1 border-r pr-4 mr-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={zoomOut}
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={zoomIn}
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={rotateCw}
            >
              <RotateCw className="w-4 h-4" />
            </Button>
          </div>

          {/* Center: Timer */}
          <div className="flex items-center gap-3 min-w-[120px] justify-center">
            <Timer
              className={`w-5 h-5 ${timeRemaining < 300000 ? "text-red-500 animate-pulse" : "text-primary"}`}
            />
            <span className="font-mono text-xl font-bold tracking-widest tabular-nums">
              {formatTime(timeRemaining)}
            </span>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 border-l pl-4 ml-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={toggleFullscreen}
            >
              {isFullscreen ? (
                <Minimize className="w-4 h-4" />
              ) : (
                <Maximize className="w-4 h-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 rounded-full ${isPaused ? "text-yellow-500 bg-yellow-500/10" : ""}`}
              onClick={handlePauseResume}
            >
              {isPaused ? (
                <Play className="w-4 h-4 fill-current" />
              ) : (
                <Pause className="w-4 h-4 fill-current" />
              )}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="h-8 rounded-full px-3 ml-2"
              onClick={() => setShowFinishDialog(true)}
            >
              {t.confirm}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full h-full pt-12 pb-4 px-4 overflow-hidden">
        <div className="w-full h-full rounded-xl overflow-hidden shadow-2xl border bg-background/50">
          <PdfRenderer
            pdfUrl={examDetail.exam.pdf_url}
            scale={scale}
            rotation={rotation}
            numPages={numPages}
            onLoadSuccess={onDocumentLoadSuccess}
          />
        </div>
      </div>

      <AnimatePresence>
        {isPaused && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-background/60 backdrop-blur-xl flex flex-col items-center justify-center gap-6"
          >
            <div className="p-4 rounded-full bg-yellow-500/10 mb-2">
              <Pause className="w-16 h-16 text-yellow-500 fill-current" />
            </div>
            <h2 className="text-4xl font-bold tracking-tight">{t.paused}</h2>
            <div className="flex flex-col items-center gap-2">
              <p className="text-muted-foreground text-lg">
                {examDetail.exam.course_code}
              </p>
              <p className="font-mono text-2xl">
                {formatTime(timeRemaining)}{" "}
                {language === "sv" ? "återstår" : "remaining"}
              </p>
            </div>

            <Button
              onClick={handlePauseResume}
              size="lg"
              className="rounded-full px-8 h-12 text-lg gap-2 mt-4"
            >
              <Play className="w-5 h-5 fill-current" />
              {t.resume}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <AlertDialog open={showFinishDialog} onOpenChange={setShowFinishDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.finishTitle}</AlertDialogTitle>
            <AlertDialogDescription>{t.finishDesc}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={confirmFinishExam}
            >
              {t.confirm}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showTimeUpDialog} onOpenChange={() => {}}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.timeUpTitle}</AlertDialogTitle>
            <AlertDialogDescription>{t.timeUpDesc}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleTimeUp}>
              {t.home}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default LockInModePage;
