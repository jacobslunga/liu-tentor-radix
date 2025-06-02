import { FC, useEffect, useRef, useState } from "react";
import { RotateCcw, RotateCw, BookOpenIcon } from "lucide-react";
import {
  PlusIcon,
  DashIcon,
  DownloadIcon,
  EyeIcon,
  EyeClosedIcon,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/context/LanguageContext";
import translations from "@/util/translations";
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
      <TooltipContent side="left">
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
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

  const getTranslation = (key: keyof (typeof translations)[typeof language]) =>
    translations[language][key];

  const facitExams = exams?.filter((exam) => isFacit(exam.tenta_namn));
  const filteredFacitExams = filterExamsByDate(selectedExam, facitExams);

  return (
    <motion.div
      className="fixed top-16 right-5 flex flex-col space-y-2 z-40"
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
      <ToolbarButton
        icon={PlusIcon}
        onClick={onFacitZoomIn}
        tooltip={getTranslation("zoomIn")}
      />
      <ToolbarButton
        icon={DashIcon}
        onClick={onFacitZoomOut}
        tooltip={getTranslation("zoomOut")}
      />
      <Separator />
      <ToolbarButton
        icon={RotateCcw}
        onClick={onRotateFacitCounterClockwise}
        tooltip={getTranslation("rotateLeft")}
      />
      <ToolbarButton
        icon={RotateCw}
        onClick={onRotateFacitClockwise}
        tooltip={getTranslation("rotateRight")}
      />
      <Separator />
      <ToolbarButton
        icon={DownloadIcon}
        onClick={() => window.open(facitPdfUrl || "#", "_blank")}
        tooltip={getTranslation("downloadFacit")}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon">
            <BookOpenIcon size={17} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="left"
          className="max-h-60 overflow-y-auto z-50"
        >
          {filteredFacitExams.map((exam) => (
            <DropdownMenuItem
              key={exam.tenta_namn}
              onClick={() => setSelectedFacit(exam)}
            >
              {exam.tenta_namn}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <ToolbarButton
        icon={isBlurred ? EyeClosedIcon : EyeIcon}
        onClick={onToggleBlur}
        tooltip={getTranslation(isBlurred ? "showFacit" : "hideFacit")}
      />
    </motion.div>
  );
};

export default TentaFacitToolbar;
