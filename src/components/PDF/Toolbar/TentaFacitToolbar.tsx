import { FC, useEffect, useRef, useState } from "react";
import { RotateCcw, RotateCw, BookOpen, Download } from "lucide-react";
import {
  PlusIcon,
  DashIcon,
  EyeIcon,
  EyeClosedIcon,
} from "@primer/octicons-react";
import { Button } from "@/components/ui/button";
import { Exam } from "@/components/data-table/columns";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/context/LanguageContext";
import { filterExamsByDate, isFacit } from "@/components/PDF/utils";
import { motion } from "framer-motion";

interface Props {
  facitPdfUrl: string | null;
  selectedExam: Exam;
  onFacitZoomIn: () => void;
  onFacitZoomOut: () => void;
  onRotateFacitClockwise: () => void;
  onRotateFacitCounterClockwise: () => void;
  onToggleBlur: () => void;
  isBlurred: boolean;
  setSelectedFacit: (exam: Exam) => void;
  exams: Exam[];
}

const ToolbarButton = ({
  icon: Icon,
  onClick,
  tooltip,
  className,
  variant = "secondary",
  disabled = false,
}: {
  icon: any;
  onClick: () => void;
  tooltip: string;
  className?: string;
  variant?: "secondary" | "outline" | "ghost";
  disabled?: boolean;
}) => (
  <TooltipProvider delayDuration={300}>
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={variant}
          size="icon"
          onClick={onClick}
          className={`transition-all duration-200 ${className}`}
          disabled={disabled}
        >
          <Icon size={16} />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="left">
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

const ToolbarGroup = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col space-y-1">{children}</div>
);

const TentaFacitToolbar: FC<Props> = ({
  facitPdfUrl,
  selectedExam,
  onFacitZoomIn,
  onFacitZoomOut,
  onRotateFacitClockwise,
  onRotateFacitCounterClockwise,
  onToggleBlur,
  isBlurred,
  setSelectedFacit,
  exams,
}) => {
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
      }, 1500);
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

  const { language } = useLanguage();

  const getTooltip = (key: string) => {
    const tooltips = {
      zoomIn: language === "sv" ? "Zooma in (+)" : "Zoom In (+)",
      zoomOut: language === "sv" ? "Zooma ut (-)" : "Zoom Out (-)",
      rotateLeft: language === "sv" ? "Rotera vänster (R)" : "Rotate Left (R)",
      rotateRight: language === "sv" ? "Rotera höger (L)" : "Rotate Right (L)",
      download: language === "sv" ? "Ladda ner facit" : "Download Solution",
      selectFacit: language === "sv" ? "Välj facit" : "Select Solution",
      toggleBlur: isBlurred
        ? language === "sv"
          ? "Visa facit (T)"
          : "Show Solution (T)"
        : language === "sv"
        ? "Dölj facit (T)"
        : "Hide Solution (T)",
    };
    return tooltips[key as keyof typeof tooltips] || "";
  };

  const facitExams = exams?.filter((exam) => isFacit(exam.tenta_namn));
  const filteredFacitExams = filterExamsByDate(selectedExam, facitExams);

  return (
    <motion.div
      className="fixed top-16 right-6 z-40"
      onMouseEnter={() => {
        setIsHovering(true);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      }}
      onMouseLeave={() => {
        setIsHovering(false);
      }}
      initial={{ x: 10 }}
      animate={{
        x: isMouseActive || isHovering ? 0 : 10,
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="flex flex-col space-y-2">
        {/* Zoom Controls */}
        <ToolbarGroup>
          <ToolbarButton
            icon={PlusIcon}
            onClick={onFacitZoomIn}
            tooltip={getTooltip("zoomIn")}
            className="bg-background border border-border hover:bg-accent hover:text-primary shadow-sm"
            variant="outline"
          />
          <ToolbarButton
            icon={DashIcon}
            onClick={onFacitZoomOut}
            tooltip={getTooltip("zoomOut")}
            className="bg-background border border-border hover:bg-accent hover:text-primary shadow-sm"
            variant="outline"
          />
        </ToolbarGroup>

        {/* Rotation Controls */}
        <ToolbarGroup>
          <ToolbarButton
            icon={RotateCcw}
            onClick={onRotateFacitCounterClockwise}
            tooltip={getTooltip("rotateLeft")}
            className="bg-background border border-border hover:bg-accent hover:text-blue-600 shadow-sm"
            variant="outline"
          />
          <ToolbarButton
            icon={RotateCw}
            onClick={onRotateFacitClockwise}
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
              if (facitPdfUrl) {
                const link = document.createElement("a");
                link.href = facitPdfUrl;
                // Extract filename from selectedExam and add "_facit" suffix
                const examName = selectedExam.tenta_namn.replace(".pdf", "");
                link.download = `${examName}_facit.pdf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }
            }}
            tooltip={getTooltip("download")}
            disabled={!facitPdfUrl}
            className={`shadow-sm ${
              !facitPdfUrl
                ? "opacity-50 cursor-not-allowed bg-background border border-border"
                : "bg-background border border-border hover:bg-accent hover:text-green-600"
            }`}
            variant="outline"
          />

          {/* Facit Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="bg-background border border-border hover:bg-accent hover:text-purple-600 shadow-sm transition-all duration-200"
                    >
                      <BookOpen size={16} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    <p>{getTooltip("selectFacit")}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="left"
              className="w-64 max-h-60 overflow-y-auto"
            >
              <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground border-b mb-1">
                {language === "sv" ? "Välj facit" : "Select Solution"} (
                {filteredFacitExams.length})
              </div>
              {filteredFacitExams.map((exam) => (
                <DropdownMenuItem
                  key={exam.tenta_namn}
                  onClick={() => setSelectedFacit(exam)}
                  className="cursor-pointer"
                >
                  <span className="truncate">
                    {exam.tenta_namn.replace(".pdf", "")}
                  </span>
                </DropdownMenuItem>
              ))}
              {filteredFacitExams.length === 0 && (
                <div className="px-2 py-3 text-xs text-muted-foreground text-center">
                  {language === "sv"
                    ? "Inga facit tillgängliga"
                    : "No solutions available"}
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <ToolbarButton
            icon={isBlurred ? EyeClosedIcon : EyeIcon}
            onClick={onToggleBlur}
            tooltip={getTooltip("toggleBlur")}
            className={`shadow-sm ${
              !isBlurred
                ? "bg-orange-50 text-orange-600 border border-orange-200 dark:bg-orange-900/50 dark:text-orange-400 dark:border-orange-700"
                : "bg-background border border-border hover:bg-accent hover:text-orange-600"
            }`}
            variant="outline"
          />
        </ToolbarGroup>
      </div>
    </motion.div>
  );
};

export default TentaFacitToolbar;
