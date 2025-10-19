import { FC, useRef, useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import ExamPdf from "../ExamPdf";
import { ExamWithSolutions } from "@/types/exam";
import { FileQuestion } from "lucide-react";
import { ImperativePanelHandle } from "react-resizable-panels";
import { Link } from "react-router-dom";
import SolutionOverlay from "../SolutionOverlay";
import SolutionPdf from "../SolutionPdf";
import { usePanelScaling } from "@/hooks/usePanelScaling";
import { useResizeHotkeys } from "@/hooks/useResizeHotkeys";
import useTranslation from "@/hooks/useTranslation";

interface Props {
  examDetail: ExamWithSolutions;
}

const ExamWithFacitView: FC<Props> = ({ examDetail }) => {
  const { t } = useTranslation();
  const [isFacitBlurred, setIsFacitBlurred] = useState(true);

  const leftPanelRef = useRef<ImperativePanelHandle>(null);
  const rightPanelRef = useRef<ImperativePanelHandle>(null);
  const updateExamScale = usePanelScaling("exam");
  const updateSolutionScale = usePanelScaling("solution");

  useResizeHotkeys(leftPanelRef);

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="w-full h-full bg-background"
    >
      <ResizablePanel
        ref={leftPanelRef}
        defaultSize={55}
        minSize={20}
        onResize={updateExamScale}
        className="bg-background"
      >
        <ExamPdf pdfUrl={examDetail.exam.pdf_url} />
      </ResizablePanel>

      <ResizableHandle withHandle />

      <ResizablePanel
        ref={rightPanelRef}
        defaultSize={45}
        minSize={20}
        onResize={updateSolutionScale}
        className="relative bg-background"
        onMouseEnter={() => setIsFacitBlurred(false)}
        onMouseLeave={() => setIsFacitBlurred(true)}
      >
        {examDetail.solutions.length > 0 ? (
          <>
            <SolutionPdf pdfUrl={examDetail.solutions[0]?.pdf_url} />
            <SolutionOverlay isBlurred={isFacitBlurred} />
          </>
        ) : (
          <Empty className="h-full">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FileQuestion />
              </EmptyMedia>
              <EmptyTitle>{t("noFacitAvailable")}</EmptyTitle>
              <EmptyDescription>
                {t("noFacitAvailableDescription")}
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button asChild>
                <Link to="/upload-exams">{t("uploadButton")}</Link>
              </Button>
            </EmptyContent>
            <Button
              variant="link"
              asChild
              className="text-muted-foreground"
              size="sm"
            >
              <Link to="/faq">
                {t("learnMore")} <ArrowUpRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </Empty>
        )}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default ExamWithFacitView;
