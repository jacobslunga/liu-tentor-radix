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
import translations from "@/util/translations";
import { FC, useState } from "react";
import { Exam } from "../data-table/columns";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { filterExamsByDate, isFacit } from "./utils";
import {
  BookOpenIcon,
  ChevronDown,
  ChevronLeft,
  Download,
  Minus,
  Plus,
  RotateCcw,
  RotateCw,
} from "lucide-react";

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
  const [isFacitToolbarOpen, setIsFacitToolbarOpen] = useState(true);
  const toggleFacitToolbar = () => setIsFacitToolbarOpen((prev) => !prev);

  const { language } = useLanguage();

  const getTranslation = (
    key: keyof (typeof translations)[typeof language]
  ) => {
    return translations[language][key];
  };

  const facitExams = exams?.filter((exam) => isFacit(exam.tenta_namn));
  const filteredFacitExams = filterExamsByDate(selectedExam, facitExams);

  const ToolbarButton = ({
    icon: Icon,
    onClick,
    tooltip,
    href,
    download,
  }: any) => (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild className="z-40">
          {href ? (
            <a href={href} download={download}>
              <Button variant="secondary" size="icon" onClick={onClick}>
                <Icon size={17} />
              </Button>
            </a>
          ) : (
            <Button variant="secondary" size="icon" onClick={onClick}>
              <Icon size={17} />
            </Button>
          )}
        </TooltipTrigger>
        <TooltipContent autoFocus={false} side="right">
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  const FacitToolbar = () => (
    <div className="flex flex-col items-end justify-end space-y-2">
      <ToolbarButton
        icon={isFacitToolbarOpen ? ChevronDown : ChevronLeft}
        onClick={toggleFacitToolbar}
        tooltip={getTranslation(
          isFacitToolbarOpen ? "hideFacitToolbar" : "showFacitToolbar"
        )}
      />

      {isFacitToolbarOpen && (
        <div className="flex flex-col items-start space-y-2">
          <ToolbarButton
            icon={Plus}
            onClick={onFacitZoomIn}
            tooltip={getTranslation("zoomIn")}
          />

          <ToolbarButton
            icon={Minus}
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
            icon={Download}
            href={facitPdfUrl}
            download
            tooltip={getTranslation("downloadFacit")}
          />
        </div>
      )}
    </div>
  );

  return (
    <div className="flex absolute top-2 flex-col items-end right-0 justify-end bg-transparent px-5 py-2">
      <div className="flex flex-col items-end justify-end space-y-2">
        <FacitToolbar />

        {isFacitToolbarOpen && (
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild className="z-50">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild className="z-50">
                    <Button variant="secondary" size="icon">
                      <BookOpenIcon size={17} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    side="right"
                    className="max-h-60 overflow-y-auto"
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
              </TooltipTrigger>
              <TooltipContent autoFocus={false} side="right">
                <p>{getTranslation("chooseFacit")}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </div>
  );
};

export default FacitToolbar;
