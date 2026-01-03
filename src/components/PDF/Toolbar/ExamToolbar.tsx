import { FC } from "react";
import {
  DownloadIcon,
  PlusIcon,
  MinusIcon,
  ArrowClockwiseIcon,
  ArrowCounterClockwiseIcon,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import usePdf from "@/hooks/usePdf";
import { downloadFile } from "@/lib/utils";

interface Props {
  pdfUrl: string | null;
}

const ToolbarButton = ({
  icon: Icon,
  onClick,
  tooltip,
  className,
}: {
  icon: any;
  onClick: () => void;
  tooltip: string;
  className?: string;
}) => (
  <TooltipProvider delayDuration={0}>
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          onClick={onClick}
          className={className}
        >
          <Icon weight="bold" size={17} />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="right">
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

const ExamToolbar: FC<Props> = ({ pdfUrl }) => {
  const { zoomIn, zoomOut, rotateLeft, rotateRight } = usePdf("exam");

  return (
    <div className="fixed top-1/2 -translate-y-1/2 left-5 flex flex-col space-y-2 z-40 opacity-20 hover:opacity-100 transition-opacity duration-300">
      <ToolbarButton icon={PlusIcon} onClick={zoomIn} tooltip="Zooma in" />
      <ToolbarButton icon={MinusIcon} onClick={zoomOut} tooltip="Zooma ut" />
      <Separator />
      <ToolbarButton
        icon={ArrowCounterClockwiseIcon}
        onClick={rotateLeft}
        tooltip="Rotera vänster"
      />
      <ToolbarButton
        icon={ArrowClockwiseIcon}
        onClick={rotateRight}
        tooltip="Rotera höger"
      />
      <Separator />
      <ToolbarButton
        icon={DownloadIcon}
        onClick={() => pdfUrl && downloadFile(pdfUrl)}
        tooltip="Ladda ner tenta"
      />
    </div>
  );
};

export default ExamToolbar;
