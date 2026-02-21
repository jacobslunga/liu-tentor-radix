import { useRef, useState } from "react";
import { BookOpen, X } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import ExamPdf from "@/components/PDF/ExamPdf";
import SolutionPdf from "@/components/PDF/SolutionPdf";
import { motion, AnimatePresence } from "framer-motion";
import { useHotkeys } from "react-hotkeys-hook";
import type { ExamDetailPayload } from "@/api";
import { useLanguage } from "@/context/LanguageContext";

interface Props {
  examDetail: ExamDetailPayload;
}

const ExamOnlyView = ({ examDetail }: Props) => {
  const { language } = useLanguage();
  const { t } = useTranslation();
  const [isFacitVisible, setIsFacitVisible] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const hasFacit = examDetail.solution !== null;

  useHotkeys("e", () => {
    if (hasFacit) setIsFacitVisible((prev) => !prev);
  });

  useHotkeys("esc", () => {
    setIsFacitVisible(false);
  });

  return (
    <div className="w-full h-full relative max-w-full bg-background overflow-hidden">
      <div className="w-full h-full bg-background overflow-auto">
        <ExamPdf pdfUrl={examDetail.exam.pdf_url} />
      </div>

      <AnimatePresence>
        {hasFacit && isFacitVisible && (
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-background z-50 flex flex-col"
          >
            <div className="flex-1 w-full overflow-hidden bg-muted">
              <SolutionPdf pdfUrl={examDetail.solution!.pdf_url} />
            </div>
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50">
              <button
                onClick={() => setIsFacitVisible(false)}
                className="bg-secondary cursor-pointer text-secondary-foreground shadow-2xl hover:scale-105 active:scale-95 transition-all rounded-full px-8 py-3.5 flex items-center gap-3 border border-primary/20 group"
              >
                <X className="w-5 h-5" />
                <span className="font-bold tracking-tight">
                  {language === "sv" ? "Stäng" : "Close"}
                </span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {hasFacit && !isFacitVisible && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40">
          <button
            onClick={() => setIsFacitVisible(true)}
            className="bg-primary cursor-pointer text-primary-foreground shadow-2xl hover:scale-105 active:scale-95 transition-all rounded-full px-8 py-3.5 flex items-center gap-3 border border-primary/20 group"
          >
            <BookOpen className="w-5 h-5" />
            <span className="font-bold tracking-tight">{t("facit")}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ExamOnlyView;
