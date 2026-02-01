import { FC, useState } from "react";
import { BookOpen } from "lucide-react";
import ExamPdf from "../ExamPdf";
import SolutionPdf from "../SolutionPdf";
import { useTranslation } from "@/hooks/useTranslation";
import { Drawer, DrawerContent, DrawerHeader } from "@/components/ui/drawer";
import type { ExamDetailPayload } from "@/api";

interface Props {
  examDetail: ExamDetailPayload;
}

const MobilePdfView: FC<Props> = ({ examDetail }) => {
  const { t } = useTranslation();
  const [showSolution, setShowSolution] = useState(false);
  const hasSolution = examDetail.solution !== null;

  return (
    <div className="flex lg:hidden flex-col h-screen w-full bg-background relative">
      <div className="flex-1 w-full h-full overflow-hidden">
        <ExamPdf pdfUrl={examDetail.exam.pdf_url} />
      </div>
      {hasSolution && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40">
          <button
            onClick={() => setShowSolution(true)}
            className="bg-background/90 backdrop-blur-md border shadow-lg hover:bg-accent/50 transition-all rounded-full px-6 py-3 flex items-center gap-2 group"
          >
            <BookOpen className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
            <span className="font-medium text-foreground">{t("facit")}</span>
          </button>
        </div>
      )}
      <Drawer open={showSolution} onOpenChange={setShowSolution}>
        <DrawerContent className="h-screen flex flex-col">
          <DrawerHeader className="border-b px-4 py-3 flex items-center justify-between bg-background z-50"></DrawerHeader>

          <div className="flex-1 overflow-hidden relative bg-background">
            {examDetail.solution && (
              <SolutionPdf pdfUrl={examDetail.solution.pdf_url} />
            )}
          </div>

          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-50"></div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default MobilePdfView;
