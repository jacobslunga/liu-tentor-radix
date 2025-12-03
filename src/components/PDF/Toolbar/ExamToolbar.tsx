import { FC, useState, useEffect, useRef } from "react";
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
          variant="secondary"
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
  const [isMouseActive, setIsMouseActive] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isHoveringRef = useRef(isHovering);

  const { zoomIn, zoomOut, rotateLeft, rotateRight } = usePdf("exam");

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
      className="fixed top-20 left-5 flex flex-col space-y-2 z-40"
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
    </motion.div>
  );
};

export default ExamToolbar;
