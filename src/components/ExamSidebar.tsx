import { FC, useMemo } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import {
  ChatTextIcon,
  GearSixIcon,
  LockIcon,
  BookOpenIcon,
  SquareHalfIcon,
  SquareSplitHorizontalIcon,
  CheckIcon,
} from "@phosphor-icons/react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "@/hooks/useTranslation";
import { useLanguage } from "@/context/LanguageContext";
import useLayoutMode from "@/stores/LayoutModeStore";
import { Exam } from "@/api";
import SettingsDialog from "@/components/SettingsDialog";
import { LockInMenu } from "./lock-in-mode/LockInMenu";
import { LockInModeManager } from "@/lib/lockInMode";
import Cookies from "js-cookie";
import { useChatState } from "@/hooks/useChatState";

interface ExamSidebarProps {
  exams: Exam[];
  showChat: boolean;
  onToggleChat: () => void;
  className?: string;
}

export const ExamSidebar: FC<ExamSidebarProps> = ({
  exams,
  showChat,
  onToggleChat,
  className,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { courseCode = "", examId = "" } = useParams<{
    courseCode: string;
    examId: string;
  }>();

  let isLoading = false;
  try {
    const chatState = useChatState();
    isLoading = chatState.isLoading;
  } catch (e) {
    console.error(e);
  }

  const { layoutMode, setLayoutMode } = useLayoutMode();

  // Sorting exams
  const sortedExams = useMemo(
    () =>
      [...exams].sort(
        (a, b) =>
          new Date(b.exam_date).getTime() - new Date(a.exam_date).getTime(),
      ),
    [exams],
  );

  const selectedExam = useMemo(
    () => sortedExams.find((e) => e.id.toString() === examId),
    [sortedExams, examId],
  );

  const completed = useMemo<Record<number, boolean>>(() => {
    const c = Cookies.get("completedExams");
    return c ? JSON.parse(c) : {};
  }, []);

  const handleStartLockIn = (durationStr: string) => {
    if (!selectedExam) return;
    const duration = parseInt(durationStr);
    const session = LockInModeManager.startExamSession(selectedExam, duration);
    navigate(`/lock-in-mode/${session.examId}`);
  };

  const changeExam = (e: Exam) => {
    navigate(`/search/${courseCode}/${e.id}`);
  };

  return (
    <div
      className={`w-16 h-full border-r bg-background flex flex-col items-center py-4 z-50 ${className}`}
    >
      {/* 1. Back Button */}
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 mb-6 rounded-full bg-muted/50 hover:bg-muted"
              onClick={() => navigate(`/search/${courseCode}`)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>{t("goBack")}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Separator className="w-8 mb-6" />

      {/* 2. Exam Selector */}
      <DropdownMenu>
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button
                  variant={!showChat ? "secondary" : "ghost"}
                  size="sm"
                  className={`h-10 w-10 mb-6 rounded-full transition-all`}
                  onClick={() => {
                    if (showChat) onToggleChat();
                  }}
                >
                  <BookOpenIcon weight="bold" className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{language === "sv" ? "Välj tenta" : "Select Exam"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <DropdownMenuContent
          align="start"
          side="right"
          className="w-72 max-h-[80vh]"
        >
          <DropdownMenuLabel>
            {language === "sv" ? "Tillgängliga tentor" : "Available Exams"}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <div className="h-[300px] overflow-y-auto">
            {sortedExams.map((e) => {
              const isSelected = e.id.toString() === examId;
              const isDone = completed[e.id];
              return (
                <DropdownMenuItem
                  key={e.id}
                  onClick={() => {
                    changeExam(e);
                    // Also switch back to exam view if in chat
                    if (showChat) onToggleChat();
                  }}
                  className="flex items-center justify-between cursor-pointer p-3"
                >
                  <div className="flex flex-col gap-1">
                    <span
                      className={`font-medium ${isSelected ? "text-primary" : ""}`}
                    >
                      {e.exam_date}
                    </span>
                    <span className="text-xs text-muted-foreground truncate max-w-[180px]">
                      {e.exam_name.replace(e.exam_date, "").trim() ||
                        (language === "sv"
                          ? "Ordinarie tenta"
                          : "Regular Exam")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {e.has_solution && (
                      <Badge
                        variant="outline"
                        className="text-[10px] px-1 h-5 text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800"
                      >
                        Facit
                      </Badge>
                    )}
                    {isDone && (
                      <CheckIcon
                        weight="bold"
                        className="h-3 w-3 text-green-500"
                      />
                    )}
                  </div>
                </DropdownMenuItem>
              );
            })}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* 3. Layout Modes (Only show if NOT in chat mode) */}
      <div className="flex flex-col items-center bg-muted/80 rounded-full p-1 gap-1 mb-6">
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => {
                  setLayoutMode("exam-only");
                  if (showChat) onToggleChat();
                }}
                className={`p-2 cursor-pointer rounded-full transition-all ${
                  layoutMode === "exam-only" && !showChat
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                }`}
              >
                <SquareHalfIcon
                  weight={layoutMode === "exam-only" ? "fill" : "bold"}
                  className="h-5 w-5"
                />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{t("examOnly")}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => {
                  setLayoutMode("exam-with-facit");
                  if (showChat) onToggleChat();
                }}
                className={`p-2 cursor-pointer rounded-full transition-all ${
                  layoutMode === "exam-with-facit" && !showChat
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                }`}
              >
                <SquareSplitHorizontalIcon
                  weight={layoutMode === "exam-with-facit" ? "fill" : "bold"}
                  className="h-5 w-5"
                />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{t("examAndFacit")}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* 4. Chat Toggle */}
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={showChat ? "secondary" : "ghost"}
              size="icon"
              className={`h-10 w-10 mb-6 rounded-full transition-all ${showChat ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted/50"}`}
              onClick={() => {
                onToggleChat();
              }}
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              ) : (
                <ChatTextIcon
                  weight={showChat ? "fill" : "bold"}
                  className="h-5 w-5"
                />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>
              {language === "sv"
                ? "AI Assistent (⌘/Ctrl + C)"
                : "AI Assistant (⌘/Ctrl + C)"}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <div className="flex-1" />

      {/* 5. Tools (Lock-in, Settings) */}
      <div className="flex flex-col gap-4 mb-4 items-center">
        {selectedExam && (
          <LockInMenu
            disabled={!selectedExam}
            onStartExam={handleStartLockIn}
            trigger={
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full text-muted-foreground hover:text-foreground"
              >
                <LockIcon weight="bold" className="h-5 w-5" />
              </Button>
            }
          />
        )}

        <SettingsDialog
          trigger={
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full text-muted-foreground hover:text-foreground"
            >
              <GearSixIcon weight="bold" className="h-5 w-5" />
            </Button>
          }
        />
      </div>
    </div>
  );
};
