import { ExamWithSolutions } from "@/types/exam";
import { FC, useState } from "react";
import { motion } from "framer-motion";
import { FileText, BookOpen } from "lucide-react";
import ExamPdf from "../ExamPdf";
import SolutionPdf from "../SolutionPdf";
import { useTranslation } from "@/hooks/useTranslation";

interface Props {
  examDetail: ExamWithSolutions;
}

const MobilePdfView: FC<Props> = ({ examDetail }) => {
  const { t } = useTranslation();
  const [showSolution, setShowSolution] = useState(false);
  const hasSolution = examDetail.solutions.length > 0;

  const modes = [
    {
      value: false,
      label: t("exam"),
      icon: <FileText className="w-4 h-4" />,
    },
    {
      value: true,
      label: t("facit"),
      icon: <BookOpen className="w-4 h-4" />,
    },
  ];

  return (
    <div className="flex lg:hidden flex-col items-center justify-center h-screen overflow-hidden w-full relative">
      {/* PDF Content */}
      {showSolution && hasSolution ? (
        <SolutionPdf pdfUrl={examDetail.solutions[0].pdf_url} />
      ) : (
        <ExamPdf pdfUrl={examDetail.exam.pdf_url} />
      )}

      {/* Mobile Switcher - Only show if there are solutions */}
      {hasSolution && (
        <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 z-40 lg:hidden bg-background/90 backdrop-blur-md rounded-full border p-1 flex">
          {modes.map((mode) => {
            const isActive = showSolution === mode.value;
            return (
              <button
                key={mode.value.toString()}
                onClick={() => setShowSolution(mode.value)}
                className="relative px-4 py-2 text-sm flex items-center gap-2 rounded-full cursor-pointer min-w-[100px] justify-center"
              >
                {isActive && (
                  <motion.div
                    layoutId="active-mobile-pill"
                    className="absolute inset-0 bg-primary rounded-full z-0"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span
                  className={`relative z-10 flex items-center gap-2 ${
                    isActive
                      ? "text-primary-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {mode.icon}
                  {mode.label}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MobilePdfView;
