import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useLanguage } from "@/context/LanguageContext";
import { FC, useState, useEffect, useRef } from "react";
import { Exam } from "../data-table/columns";
import { Button } from "../ui/button";
import { filterExamsByDate, isFacit } from "./utils";
import {
  BookOpenIcon,
  Download,
  Minus,
  Plus,
  RotateCcw,
  RotateCw,
} from "lucide-react";
import { motion } from "framer-motion";

interface FacitToolbarProps {
  onFacitZoomIn: () => void;
  onFacitZoomOut: () => void;
  onRotateFacitClockwise: () => void;
  onRotateFacitCounterClockwise: () => void;
  facitPdfUrl: string | null;
  selectedExam: Exam;
  exams: Exam[];
  setSelectedFacit: React.Dispatch<React.SetStateAction<Exam | null>>;
}

const FacitToolbar: FC<FacitToolbarProps> = ({
  onFacitZoomIn,
  onFacitZoomOut,
  onRotateFacitClockwise,
  selectedExam,
  onRotateFacitCounterClockwise,
  facitPdfUrl,
  exams,
  setSelectedFacit,
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

  const { language } = useLanguage();

  const getTooltip = (key: string) => {
    const tooltips = {
      zoomIn: language === "sv" ? "Zooma in (+)" : "Zoom In (+)",
      zoomOut: language === "sv" ? "Zooma ut (-)" : "Zoom Out (-)",
      rotateLeft: language === "sv" ? "Rotera vänster (R)" : "Rotate Left (R)",
      rotateRight: language === "sv" ? "Rotera höger (L)" : "Rotate Right (L)",
      download: language === "sv" ? "Ladda ner facit" : "Download Solution",
      selectFacit: language === "sv" ? "Välj facit" : "Select Solution",
    };
    return tooltips[key as keyof typeof tooltips] || "";
  };

  const facitExams = exams?.filter((exam) => isFacit(exam.tenta_namn));
  const filteredFacitExams = filterExamsByDate(selectedExam, facitExams);

  const ToolbarButton = ({
    icon: Icon,
    onClick,
    tooltip,
    className,
    disabled = false,
  }: any) => (
    <TooltipProvider delayDuration={500}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClick}
            className={`transition-all duration-200 ${className}`}
            disabled={disabled}
          >
            <Icon size={14} />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p className="text-xs">{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  const ToolbarGroup = ({ children }: { children: React.ReactNode }) => (
    <div className="flex flex-col space-y-1">{children}</div>
  );

  return (
    <motion.div
      className="absolute top-2 right-5 z-40"
      onMouseEnter={() => {
        setIsHovering(true);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      }}
      onMouseLeave={() => {
        setIsHovering(false);
      }}
      initial={{ opacity: 0, x: 20 }}
      animate={{
        opacity: isMouseActive || isHovering ? 1 : 0,
        x: isMouseActive || isHovering ? 0 : 20,
      }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <div className="flex flex-col space-y-1 bg-background/80 backdrop-blur-sm border border-border/50 rounded-lg p-2 shadow-lg">
        {/* Zoom Controls */}
        <ToolbarGroup>
          <ToolbarButton
            icon={Plus}
            onClick={onFacitZoomIn}
            tooltip={getTooltip("zoomIn")}
            className="h-8 w-8 hover:bg-muted/80"
          />
          <ToolbarButton
            icon={Minus}
            onClick={onFacitZoomOut}
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
            onClick={onRotateFacitCounterClockwise}
            tooltip={getTooltip("rotateLeft")}
            className="h-8 w-8 hover:bg-muted/80"
          />
          <ToolbarButton
            icon={RotateCw}
            onClick={onRotateFacitClockwise}
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
              if (facitPdfUrl) {
                const link = document.createElement("a");
                link.href = facitPdfUrl;
                const examName = selectedExam.tenta_namn.replace(".pdf", "");
                link.download = `${examName}_facit.pdf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }
            }}
            tooltip={getTooltip("download")}
            disabled={!facitPdfUrl}
            className={`h-8 w-8 ${
              !facitPdfUrl
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-muted/80"
            }`}
          />

          {/* Facit Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <TooltipProvider delayDuration={500}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-muted/80 transition-all duration-200"
                    >
                      <BookOpenIcon size={14} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    <p className="text-xs">{getTooltip("selectFacit")}</p>
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
        </ToolbarGroup>
      </div>
    </motion.div>
  );
};

export default FacitToolbar;
