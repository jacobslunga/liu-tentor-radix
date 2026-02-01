import { useCallback, useEffect, useRef, useState } from "react";

import ExamPdf from "@/components/PDF/ExamPdf";
import GradientIndicator from "@/components/GradientIndicator";
import SolutionPdf from "@/components/PDF/SolutionPdf";
import { motion } from "framer-motion";
import { useHotkeys } from "react-hotkeys-hook";
import { useChatWindow } from "@/context/ChatWindowContext";
import type { ExamDetailPayload } from "@/api";

interface Props {
  examDetail: ExamDetailPayload;
}

const ExamOnlyView = ({ examDetail }: Props) => {
  const { showChatWindow } = useChatWindow();
  const [isFacitVisible, setIsFacitVisible] = useState(false);
  const [isManual, setIsManual] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const facitVariants = {
    hidden: { x: "100%", opacity: 0 },
    visible: { x: "0%", opacity: 1 },
  };

  const hasFacit = examDetail.solution !== null;

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!hasFacit || isManual || showChatWindow) return;

      const w = window.innerWidth;
      const threshold = w * 0.9;
      const topSafeZone = 120;

      if (isFacitVisible && panelRef.current) {
        const rect = panelRef.current.getBoundingClientRect();
        const isInsidePanel =
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom;

        if (isInsidePanel) {
          return;
        }
      }

      if (e.clientX > threshold) {
        if (!isFacitVisible) {
          if (e.clientY < topSafeZone) {
            return;
          }
        }

        setIsFacitVisible(true);
        return;
      }

      setIsFacitVisible(false);
    },
    [hasFacit, isManual, showChatWindow, isFacitVisible],
  );

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  useEffect(() => {
    if (showChatWindow) {
      setIsFacitVisible(false);
    }
  }, [showChatWindow, setIsFacitVisible]);

  useHotkeys("e", () => {
    setIsFacitVisible((prev) => !prev);
    setIsManual((prev) => !prev);
  });

  useHotkeys("esc", () => {
    setIsManual(false);
    setIsFacitVisible(false);
  });

  return (
    <div className="w-full h-full relative max-w-full bg-background">
      <div className="w-full h-full bg-background overflow-auto">
        <ExamPdf pdfUrl={examDetail.exam.pdf_url} />
      </div>

      {hasFacit && (
        <motion.div
          ref={panelRef}
          className="absolute right-0 top-0 w-1/2 h-full bg-background border-l z-40 overflow-auto"
          variants={facitVariants}
          initial="hidden"
          animate={isFacitVisible ? "visible" : "hidden"}
          transition={{
            x: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
          }}
        >
          <SolutionPdf pdfUrl={examDetail.solution!.pdf_url} />
        </motion.div>
      )}

      {hasFacit && !isFacitVisible && !showChatWindow && (
        <GradientIndicator facitPdfUrl={examDetail.solution!.pdf_url} />
      )}
    </div>
  );
};

export default ExamOnlyView;
