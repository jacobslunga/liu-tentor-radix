import { FC, ComponentType } from "react";
import {
  DownloadIcon,
  PlusIcon,
  MinusIcon,
  ArrowClockwiseIcon,
  ArrowCounterClockwiseIcon,
  IconProps,
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
import { useTranslation } from "@/hooks/useTranslation";
import { downloadFile } from "@/lib/utils";

interface Props {
  pdfUrl: string;
}

const ToolbarButton = ({
  icon: Icon,
  onClick,
  tooltip,
  className,
}: {
  icon: ComponentType<IconProps>;
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
      <TooltipContent side="left">
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

const SolutionToolbar: FC<Props> = ({ pdfUrl }) => {
  const { t } = useTranslation();
  const { zoomIn, zoomOut, rotateLeft, rotateRight } = usePdf("solution");

  return (
    <div className="absolute top-6 right-6 hidden lg:flex flex-col space-y-2 z-40 opacity-20 hover:opacity-100 transition-opacity duration-300">
      <ToolbarButton icon={PlusIcon} onClick={zoomIn} tooltip={t("zoomIn")} />
      <ToolbarButton
        icon={MinusIcon}
        onClick={zoomOut}
        tooltip={t("zoomOut")}
      />
      <Separator />
      <ToolbarButton
        icon={ArrowCounterClockwiseIcon}
        onClick={rotateLeft}
        tooltip={t("rotateLeft")}
      />
      <ToolbarButton
        icon={ArrowClockwiseIcon}
        onClick={rotateRight}
        tooltip={t("rotateRight")}
      />
      <Separator />
      <ToolbarButton
        icon={DownloadIcon}
        onClick={() => downloadFile(pdfUrl)}
        tooltip={t("downloadFacit")}
      />
    </div>
  );
};

export default SolutionToolbar;
