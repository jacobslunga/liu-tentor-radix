import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { FC, useRef, useState } from "react";
import { ImperativePanelHandle } from "react-resizable-panels";
import ExamPdf from "../ExamPdf";
import SolutionPdf from "../SolutionPdf";
import { usePanelScaling } from "@/hooks/usePanelScaling";
import { ExamWithSolutions } from "@/types/exam";
import SolutionOverlay from "../SolutionOverlay";
import { useResizeHotkeys } from "@/hooks/useResizeHotkeys";

interface Props {
  examDetail: ExamWithSolutions;
}

const ExamWithFacitView: FC<Props> = ({ examDetail }) => {
  const [isFacitBlurred, setIsFacitBlurred] = useState(true);

  const leftPanelRef = useRef<ImperativePanelHandle>(null);
  const rightPanelRef = useRef<ImperativePanelHandle>(null);
  const updateExamScale = usePanelScaling("exam", 800);
  const updateSolutionScale = usePanelScaling("solution", 700);

  useResizeHotkeys(leftPanelRef);

  return (
    <ResizablePanelGroup direction="horizontal" className="w-full h-full">
      <ResizablePanel
        ref={leftPanelRef}
        defaultSize={55}
        minSize={20}
        onResize={updateExamScale}
      >
        <ExamPdf pdfUrl={examDetail.exam.pdf_url} />
      </ResizablePanel>

      <ResizableHandle withHandle />

      <ResizablePanel
        ref={rightPanelRef}
        defaultSize={45}
        minSize={20}
        onResize={updateSolutionScale}
        className="relative"
        onMouseEnter={() => setIsFacitBlurred(false)}
        onMouseLeave={() => setIsFacitBlurred(true)}
      >
        <SolutionPdf pdfUrl={examDetail.solutions[0]?.pdf_url} />
        <SolutionOverlay isBlurred={isFacitBlurred} />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default ExamWithFacitView;
