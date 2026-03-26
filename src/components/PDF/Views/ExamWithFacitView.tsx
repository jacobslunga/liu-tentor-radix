import { FC, useRef, useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import { Button } from "@/components/ui/button";
import { UploadSimpleIcon } from "@phosphor-icons/react";
import ExamPdf from "../ExamPdf";
import { ImperativePanelHandle } from "react-resizable-panels";
import { Link } from "react-router-dom";
import SolutionOverlay from "../SolutionOverlay";
import SolutionPdf from "../SolutionPdf";
import { useResizeHotkeys } from "@/hooks/useResizeHotkeys";
import { useTranslation } from "@/hooks/useTranslation";
import type { ExamDetailPayload } from "@/api";

interface Props {
  examDetail: ExamDetailPayload;
}

const ExamWithFacitView: FC<Props> = ({ examDetail }) => {
  const { t } = useTranslation();

  const leftPanelRef = useRef<ImperativePanelHandle>(null);
  const rightPanelRef = useRef<ImperativePanelHandle>(null);

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
        className="bg-background"
      >
        <ExamPdf
          pdfUrl={examDetail.exam.pdf_url}
          layoutMode="exam-with-facit"
        />
      </ResizablePanel>

      <ResizableHandle withHandle />

      <ResizablePanel
        ref={rightPanelRef}
        defaultSize={45}
        minSize={20}
        className="bg-background"
      >
        {examDetail.solution ? (
          <SolutionPanel pdfUrl={examDetail.solution.pdf_url} />
        ) : (
          <div className="flex h-full items-center justify-center p-6">
            <div className="group relative w-full max-w-sm">
              {/* Dashed border container */}
              <div className="rounded-2xl border-2 border-dashed border-border/60 px-8 py-10 transition-colors group-hover:border-primary/30">
                <div className="flex flex-col items-center text-center">
                  {/* Animated icon area */}
                  <div className="relative mb-5">
                    <div className="absolute inset-0 -m-2 rounded-full bg-primary/5 blur-xl transition-opacity group-hover:opacity-100 opacity-0" />
                    <div className="relative flex size-12 items-center justify-center rounded-2xl bg-muted/60 transition-colors group-hover:bg-primary/10">
                      <UploadSimpleIcon
                        weight="bold"
                        className="size-6 text-muted-foreground transition-colors group-hover:text-primary"
                      />
                    </div>
                  </div>

                  {/* Text */}
                  <p className="font-light text-foreground/80">
                    {t("noFacitAvailable")}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground/70 max-w-[220px]">
                    {t("noFacitAvailableDescription")}
                  </p>

                  {/* Action */}
                  <Button size="sm" variant="outline" asChild className="mt-5">
                    <Link to="/upload-exams" viewTransition>
                      <UploadSimpleIcon weight="bold" className="size-3.5" />
                      {t("uploadButton")}
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default ExamWithFacitView;

const SolutionPanel: FC<{ pdfUrl: string }> = ({ pdfUrl }) => {
  const [isBlurred, setIsBlurred] = useState(true);

  return (
    <div
      className="relative h-full bg-background"
      onMouseEnter={() => setIsBlurred(false)}
      onMouseLeave={() => setIsBlurred(true)}
    >
      <SolutionPdf pdfUrl={pdfUrl} layoutMode="exam-with-facit" />
      <SolutionOverlay isBlurred={isBlurred} className="pointer-events-none" />
    </div>
  );
};
