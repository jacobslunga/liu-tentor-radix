import { useCallback, useEffect, useRef, useState } from "react";

import ExamPdf from "@/components/PDF/ExamPdf";
import GradientIndicator from "@/components/GradientIndicator";
import SolutionPdf from "@/components/PDF/SolutionPdf";
import { motion } from "framer-motion";
import { useHotkeys } from "react-hotkeys-hook";

const ExamOnlyView = ({ examDetail }: { examDetail: any }) => {
  const [isFacitVisible, setIsFacitVisible] = useState(false);
  const [isManual, setIsManual] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const facitVariants = {
    hidden: { x: "100%", opacity: 0, filter: "blur(8px)" },
    visible: { x: "0%", opacity: 1, filter: "blur(0px)" },
  };

  const hasFacit = examDetail.solutions.length > 0;

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!hasFacit || isManual) return;

      const w = window.innerWidth;
      const threshold = w * 0.9;

      if (e.clientX > threshold) {
        setIsFacitVisible(true);
        return;
      }

      if (panelRef.current) {
        const rect = panelRef.current.getBoundingClientRect();
        if (
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom
        ) {
          return;
        }
      }

      setIsFacitVisible(false);
    },
    [hasFacit, isManual]
  );

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  useHotkeys("e", () => {
    setIsFacitVisible((prev) => !prev);
    setIsManual((prev) => !prev);
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
            x: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
            opacity: { duration: 0.3 },
            filter: { duration: 0.3 },
          }}
        >
          <SolutionPdf pdfUrl={examDetail.solutions[0].pdf_url} />
        </motion.div>
      )}

      {hasFacit && !isFacitVisible && (
        <GradientIndicator facitPdfUrl={examDetail.solutions[0]?.pdf_url} />
      )}
    </div>
  );
};

export default ExamOnlyView;
