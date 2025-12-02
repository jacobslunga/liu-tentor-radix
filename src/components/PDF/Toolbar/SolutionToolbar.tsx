import { FC, useEffect, useRef, useState } from "react";
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

import { motion } from "framer-motion";
import usePdf from "@/hooks/usePdf";
import useTranslation from "@/hooks/useTranslation";
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
  icon: any;
  onClick: () => void;
  tooltip: string;
  className?: string;
}) => (
  <TooltipProvider delayDuration={0}>
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="secondary"
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
  const [isMouseActive, setIsMouseActive] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isHoveringRef = useRef(isHovering);

  const { t } = useTranslation();
  const { zoomIn, zoomOut, rotateLeft, rotateRight } = usePdf("solution");

  useEffect(() => {
    isHoveringRef.current = isHovering;
  }, [isHovering]);

  useEffect(() => {
    const handleMouseMove = () => {
      setIsMouseActive(true);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        if (!isHoveringRef.current) {
          setIsMouseActive(false);
        }
      }, 1000);
    };

    handleMouseMove();

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <motion.div
      className="fixed top-20 right-5 flex flex-col space-y-2 z-40"
      onMouseEnter={() => {
        setIsHovering(true);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      }}
      onMouseLeave={() => {
        setIsHovering(false);
      }}
      initial={{ opacity: 1 }}
      animate={{ opacity: isMouseActive || isHovering ? 1 : 0 }}
      transition={{ duration: 0.3 }}
    >
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
    </motion.div>
  );
};

export default SolutionToolbar;
