import { FC, useState, useEffect, useRef } from "react";
import { RotateCcw, RotateCw, Square } from "lucide-react";
import {
  DownloadIcon,
  PlusIcon,
  DashIcon,
  CheckIcon,
} from "@primer/octicons-react";
import { Button } from "@/components/ui/button";
import { Exam } from "@/components/data-table/columns";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Cookies from "js-cookie";
import { motion } from "framer-motion";

interface Props {
  selectedExam: Exam;
  pdfUrl: string | null;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onRotateClockwise: () => void;
  onRotateCounterClockwise: () => void;
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
          <Icon size={17} />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="right">
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

const TentaToolbar: FC<Props> = ({
  selectedExam,
  pdfUrl,
  onZoomIn,
  onZoomOut,
  onRotateClockwise,
  onRotateCounterClockwise,
}) => {
  const [completedExams, setCompletedExams] = useState<Record<number, boolean>>(
    () => {
      const stored = Cookies.get("completedExams");
      return stored ? JSON.parse(stored) : {};
    }
  );

  const [isMouseActive, setIsMouseActive] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isHoveringRef = useRef(isHovering);

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

  const toggleCompleted = () => {
    const id = selectedExam.id;
    setCompletedExams((prev) => {
      const newCompleted = !prev[id];
      const updated = { ...prev, [id]: newCompleted };

      Cookies.set("completedExams", JSON.stringify(updated), {
        secure: true,
        sameSite: "Lax",
        expires: 365 * 100,
        domain:
          window.location.hostname === "liutentor.se"
            ? ".liutentor.se"
            : undefined,
      });

      return updated;
    });
  };

  return (
    <motion.div
      className="fixed top-16 left-5 flex flex-col space-y-2 z-40"
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
      {/* Själva knapparna */}
      <ToolbarButton icon={PlusIcon} onClick={onZoomIn} tooltip="Zooma in" />
      <ToolbarButton icon={DashIcon} onClick={onZoomOut} tooltip="Zooma ut" />
      <Separator />
      <ToolbarButton
        icon={RotateCcw}
        onClick={onRotateCounterClockwise}
        tooltip="Rotera vänster"
      />
      <ToolbarButton
        icon={RotateCw}
        onClick={onRotateClockwise}
        tooltip="Rotera höger"
      />
      <Separator />
      <ToolbarButton
        icon={DownloadIcon}
        onClick={() => window.open(pdfUrl || "#")}
        tooltip="Ladda ner tenta"
      />
      <ToolbarButton
        icon={completedExams[selectedExam.id] ? CheckIcon : Square}
        onClick={toggleCompleted}
        tooltip="Markera som klar"
        className={completedExams[selectedExam.id] ? "text-primary" : ""}
      />
    </motion.div>
  );
};

export default TentaToolbar;
