import { FC, useRef, useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import { Button } from "@/components/ui/button";
import ExamPdf from "../ExamPdf";
import { ExamWithSolutions } from "@/types/exam";
import { ImperativePanelHandle } from "react-resizable-panels";
import { Link } from "react-router-dom";
import SolutionOverlay from "../SolutionOverlay";
import SolutionPdf from "../SolutionPdf";
import { usePanelScaling } from "@/hooks/usePanelScaling";
import { useResizeHotkeys } from "@/hooks/useResizeHotkeys";

interface Props {
  examDetail: ExamWithSolutions;
}

const ExamWithFacitView: FC<Props> = ({ examDetail }) => {
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
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <p className="text-3xl font-medium">Inget facit</p>
            <p>Vissa tentor har inget facit eller så finns det inte hos oss.</p>
            <Link to="/upload-exams">
              <Button>Ladda upp</Button>
            </Link>
          </div>
        )}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default ExamWithFacitView;
