import { FC, useState, useEffect, useRef } from "react";
import { RotateCcw, RotateCw, Square, Download } from "lucide-react";
import { PlusIcon, DashIcon, CheckIcon } from "@primer/octicons-react";
import { Button } from "@/components/ui/button";
import { Exam } from "@/components/data-table/columns";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Cookies from "js-cookie";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

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
  variant = "ghost",
  size = "icon",
  disabled = false,
}: {
  icon: any;
  onClick: () => void;
  tooltip: string;
  className?: string;
  variant?: "secondary" | "outline" | "ghost";
  size?: "icon" | "sm";
  disabled?: boolean;
}) => (
  <TooltipProvider delayDuration={500}>
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={variant}
          size={size}
          onClick={onClick}
          className={`transition-all duration-200 ${className}`}
          disabled={disabled}
        >
          <Icon size={14} />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="right">
        <p className="text-xs">{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

const ToolbarGroup = ({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) => (
  <div className="flex flex-col space-y-1">
    {title && (
      <div className="px-2 py-1">
        <span className="text-xs font-medium text-muted-foreground">
          {title}
        </span>
      </div>
    )}
    <div className="flex flex-col space-y-1">{children}</div>
  </div>
);

const TentaToolbar: FC<Props> = ({
  selectedExam,
  pdfUrl,
  onZoomIn,
  onZoomOut,
  onRotateClockwise,
  onRotateCounterClockwise,
}) => {
  const { language } = useLanguage();
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
      }, 1000); // Faster hide after 1 second
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

  const isCompleted = completedExams[selectedExam.id];

  const getTooltip = (key: string) => {
    const tooltips = {
      zoomIn: language === "sv" ? "Zooma in (+)" : "Zoom In (+)",
      zoomOut: language === "sv" ? "Zooma ut (-)" : "Zoom Out (-)",
      rotateLeft: language === "sv" ? "Rotera vänster (R)" : "Rotate Left (R)",
      rotateRight: language === "sv" ? "Rotera höger (L)" : "Rotate Right (L)",
      download: language === "sv" ? "Ladda ner PDF" : "Download PDF",
      toggleComplete: isCompleted
        ? language === "sv"
          ? "Markera som ej klar"
          : "Mark as incomplete"
        : language === "sv"
        ? "Markera som klar"
        : "Mark as complete",
    };
    return tooltips[key as keyof typeof tooltips] || "";
  };

  return (
    <motion.div
      className="fixed top-20 left-4 z-40"
      onMouseEnter={() => {
        setIsHovering(true);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      }}
      onMouseLeave={() => {
        setIsHovering(false);
      }}
      initial={{ opacity: 0, x: -20 }}
      animate={{
        opacity: isMouseActive || isHovering ? 1 : 0,
        x: isMouseActive || isHovering ? 0 : -20,
      }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <div className="flex flex-col space-y-1 bg-background/80 backdrop-blur-sm border border-border/50 rounded-lg p-2 shadow-lg">
        {/* Zoom Controls */}
        <ToolbarGroup>
          <ToolbarButton
            icon={PlusIcon}
            onClick={onZoomIn}
            tooltip={getTooltip("zoomIn")}
            className="h-8 w-8 hover:bg-muted/80"
          />
          <ToolbarButton
            icon={DashIcon}
            onClick={onZoomOut}
            tooltip={getTooltip("zoomOut")}
            className="h-8 w-8 hover:bg-muted/80"
          />
        </ToolbarGroup>

        {/* Separator */}
        <div className="h-px bg-border/50 my-1" />

        {/* Rotation Controls */}
        <ToolbarGroup>
          <ToolbarButton
            icon={RotateCcw}
            onClick={onRotateCounterClockwise}
            tooltip={getTooltip("rotateLeft")}
            className="h-8 w-8 hover:bg-muted/80"
          />
          <ToolbarButton
            icon={RotateCw}
            onClick={onRotateClockwise}
            tooltip={getTooltip("rotateRight")}
            className="h-8 w-8 hover:bg-muted/80"
          />
        </ToolbarGroup>

        {/* Separator */}
        <div className="h-px bg-border/50 my-1" />

        {/* Actions */}
        <ToolbarGroup>
          <ToolbarButton
            icon={Download}
            onClick={() => {
              if (pdfUrl) {
                const link = document.createElement("a");
                link.href = pdfUrl;
                link.download = `${selectedExam.tenta_namn.replace(
                  ".pdf",
                  ""
                )}.pdf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }
            }}
            tooltip={getTooltip("download")}
            disabled={!pdfUrl}
            className={`h-8 w-8 ${
              !pdfUrl ? "opacity-50 cursor-not-allowed" : "hover:bg-muted/80"
            }`}
          />
          <ToolbarButton
            icon={isCompleted ? CheckIcon : Square}
            onClick={toggleCompleted}
            tooltip={getTooltip("toggleComplete")}
            className={`h-8 w-8 ${
              isCompleted
                ? "text-green-600 bg-green-50 dark:bg-green-900/30 dark:text-green-400"
                : "hover:bg-muted/80"
            }`}
          />
        </ToolbarGroup>
      </div>
    </motion.div>
  );
};

export default TentaToolbar;
