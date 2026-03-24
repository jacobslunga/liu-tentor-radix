import { FC, useState, useMemo, useRef, useEffect } from "react";
import { X } from "lucide-react";
import { ArrowLeftIcon, BookOpenIcon } from "@phosphor-icons/react";
import { useNavigate, useParams } from "react-router-dom";
import ExamPdf from "../ExamPdf";
import SolutionPdf from "../SolutionPdf";
import { useTranslation } from "@/hooks/useTranslation";
import { AnimatePresence, motion } from "framer-motion";
import { formatExamDate } from "@/util/formatExamDate";
import type { ExamDetailPayload } from "@/api";

interface Props {
  examDetail: ExamDetailPayload;
}

const MobilePdfView: FC<Props> = ({ examDetail }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const { courseCode = "" } = useParams<{ courseCode: string }>();
  const [showSolution, setShowSolution] = useState(false);
  const hasSolution = examDetail.solution !== null;

  useEffect(() => {
    containerRef.current?.scrollTo({ top: 0 });
  }, []);

  const examDate = useMemo(
    () => formatExamDate(examDetail.exam.exam_date),
    [examDetail.exam.exam_date],
  );

  return (
    <div
      className="flex lg:hidden flex-col h-screen w-full bg-background relative"
      ref={containerRef}
    >
      <div className="sticky top-0 z-40 flex items-center gap-3 px-3 h-12 border-b border-border bg-background/90 backdrop-blur-md">
        <button
          onClick={() =>
            navigate(`/search/${courseCode}`, { viewTransition: true })
          }
          className="shrink-0 inline-flex items-center justify-center h-8 w-8 rounded-lg border border-border bg-background text-foreground active:scale-95 transition-transform"
          aria-label={t("goBack")}
        >
          <ArrowLeftIcon weight="bold" className="w-4 h-4" />
        </button>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground truncate leading-tight">
            {courseCode}
          </p>
          <p className="text-xs text-muted-foreground truncate leading-tight">
            {examDate}
          </p>
        </div>
        {hasSolution && (
          <button
            onClick={() => setShowSolution(true)}
            className="shrink-0 inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-border bg-background text-foreground text-xs font-medium active:scale-95 transition-transform"
            aria-expanded={showSolution}
            aria-controls="solution-panel"
          >
            <BookOpenIcon weight="bold" className="w-3.5 h-3.5 text-primary" />
            {t("facit")}
          </button>
        )}
      </div>

      <div className="flex-1 w-full h-full overflow-hidden">
        <ExamPdf pdfUrl={examDetail.exam.pdf_url} />
      </div>

      <AnimatePresence>
        {showSolution && (
          <motion.section
            key="solution-panel"
            id="solution-panel"
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 h-screen w-screen bg-background flex flex-col overflow-hidden"
            initial={{ opacity: 0, y: 24, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.99 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <div className="flex items-center gap-3 px-3 h-12 border-b border-border bg-background/90 backdrop-blur-md">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground truncate leading-tight">
                  {t("facit")}
                </p>
                <p className="text-xs text-muted-foreground truncate leading-tight">
                  {courseCode} - {examDate}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowSolution(false)}
                className="shrink-0 inline-flex items-center justify-center h-8 w-8 rounded-lg border border-border bg-background text-foreground active:scale-95 transition-transform"
                aria-label={t("closeDialog")}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 min-h-0 overflow-hidden bg-background">
              {examDetail.solution && (
                <SolutionPdf pdfUrl={examDetail.solution.pdf_url} />
              )}
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobilePdfView;
