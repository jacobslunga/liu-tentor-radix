import { FC, useState } from "react";
import { ArrowLeft, BookOpen, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/useTranslation";
import type { ExamDetailPayload } from "@/api";
import { useNavigate, useParams } from "react-router-dom";

interface Props {
  examDetail: ExamDetailPayload;
}

const MobilePdfView: FC<Props> = ({ examDetail }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { courseCode = "" } = useParams<{ courseCode: string }>();
  const [showSolution, setShowSolution] = useState(false);
  const hasSolution = examDetail.solution !== null;

  const pdfParams = "#toolbar=0&navpanes=0&scrollbar=0";

  return (
    <div className="flex lg:hidden flex-col h-screen w-full bg-background relative overflow-hidden">
      <div className="shrink-0 h-14 w-full flex items-center justify-between px-4">
        <Button
          size="icon"
          variant="outline"
          onClick={() => navigate(`/search/${courseCode}`)}
          aria-label={t("goBack")}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>

        <div className="flex-1 px-3 min-w-0 text-center">
          <p className="text-sm font-semibold truncate">
            {courseCode} {examDetail.exam.exam_date}
          </p>
        </div>

        <div className="w-10" />
      </div>

      <div className="flex-1 w-full h-full bg-white dark:bg-background">
        <iframe
          src={`${examDetail.exam.pdf_url}${pdfParams}`}
          className="w-full h-full border-none dark:pdf-invert"
          title="Exam PDF"
        />
      </div>

      {hasSolution && !showSolution && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40">
          <button
            onClick={() => setShowSolution(true)}
            className="bg-primary text-primary-foreground shadow-2xl hover:scale-105 active:scale-95 transition-all rounded-full px-6 py-3 flex items-center gap-2 border border-primary/20"
          >
            <BookOpen className="w-5 h-5" />
            <span className="font-semibold">{t("facit")}</span>
          </button>
        </div>
      )}

      {showSolution && examDetail.solution && (
        <div className="fixed inset-0 z-50 bg-background flex flex-col animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="flex items-center justify-between px-4 py-3 border-b bg-background/80 backdrop-blur-md">
            <h3 className="font-medium text-foreground">
              {t("facit") || "Solution"}
            </h3>
            <button
              onClick={() => setShowSolution(false)}
              className="p-2 hover:bg-accent rounded-full transition-colors"
              aria-label="Close"
            >
              <X className="w-6 h-6 text-foreground" />
            </button>
          </div>

          <div className="flex-1 w-full h-full bg-white dark:bg-background">
            <iframe
              src={`${examDetail.solution.pdf_url}${pdfParams}`}
              className="w-full h-full border-none dark:pdf-invert"
              title="Solution PDF"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MobilePdfView;
