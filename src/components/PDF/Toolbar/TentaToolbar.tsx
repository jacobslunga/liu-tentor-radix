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
  variant = "secondary",
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
  <TooltipProvider delayDuration={300}>
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={variant}
          size={size}
          onClick={onClick}
          className={`transition-all duration-200 ${className}`}
          disabled={disabled}
        >
          <Icon size={16} />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="right">
        <p>{tooltip}</p>
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
      }, 1500); // Slightly longer delay
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
      className="fixed top-16 left-6 z-40"
      onMouseEnter={() => {
        setIsHovering(true);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      }}
      onMouseLeave={() => {
        setIsHovering(false);
      }}
      initial={{ x: -10 }}
      animate={{
        x: isMouseActive || isHovering ? 0 : -10,
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="flex flex-col space-y-2">
        {/* Zoom Controls */}
        <ToolbarGroup>
          <ToolbarButton
            icon={PlusIcon}
            onClick={onZoomIn}
            tooltip={getTooltip("zoomIn")}
            className="bg-background border border-border hover:bg-accent hover:text-primary shadow-sm"
            variant="outline"
          />
          <ToolbarButton
            icon={DashIcon}
            onClick={onZoomOut}
            tooltip={getTooltip("zoomOut")}
            className="bg-background border border-border hover:bg-accent hover:text-primary shadow-sm"
            variant="outline"
          />
        </ToolbarGroup>

        {/* Rotation Controls */}
        <ToolbarGroup>
          <ToolbarButton
            icon={RotateCcw}
            onClick={onRotateCounterClockwise}
            tooltip={getTooltip("rotateLeft")}
            className="bg-background border border-border hover:bg-accent hover:text-blue-600 shadow-sm"
            variant="outline"
          />
          <ToolbarButton
            icon={RotateCw}
            onClick={onRotateClockwise}
            tooltip={getTooltip("rotateRight")}
            className="bg-background border border-border hover:bg-accent hover:text-blue-600 shadow-sm"
            variant="outline"
          />
        </ToolbarGroup>

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
            className={`shadow-sm ${
              !pdfUrl
                ? "opacity-50 cursor-not-allowed bg-background border border-border"
                : "bg-background border border-border hover:bg-accent hover:text-green-600"
            }`}
            variant="outline"
          />
          <ToolbarButton
            icon={isCompleted ? CheckIcon : Square}
            onClick={toggleCompleted}
            tooltip={getTooltip("toggleComplete")}
            className={`shadow-sm ${
              isCompleted
                ? "bg-green-50 text-green-600 border border-green-200 dark:bg-green-900/50 dark:text-green-400 dark:border-green-700"
                : "bg-background border border-border hover:bg-accent hover:text-green-600"
            }`}
            variant="outline"
          />
        </ToolbarGroup>
      </div>
    </motion.div>
  );
};

export default TentaToolbar;
