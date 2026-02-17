import {
  ArrowLeftIcon,
  CaretRightIcon,
  ChatDotsIcon,
  CheckIcon,
} from "@phosphor-icons/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";
import type { Exam } from "@/api";
import SettingsDialog from "@/components/SettingsDialog";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "@/hooks/useTranslation";
import { LockInMenu } from "./lock-in-mode/LockInMenu";
import { LockInModeManager } from "@/lib/lockInMode";
import { useChatState } from "@/hooks/useChatState";
import { Loader2 } from "lucide-react";

interface Props {
  exams: Exam[];
  setIsChatOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onToggleChat?: () => void;
}

const ExamHeader: FC<Props> = ({ exams, setIsChatOpen, onToggleChat }) => {
  const { language } = useLanguage();
  const { t } = useTranslation();
  const { courseCode = "", examId = "" } = useParams<{
    courseCode: string;
    examId: string;
  }>();
  const navigate = useNavigate();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const sorted = useMemo(
    () =>
      [...exams].sort(
        (a, b) =>
          new Date(b.exam_date).getTime() - new Date(a.exam_date).getTime(),
      ),
    [exams],
  );

  useEffect(() => {
    const sel = sorted.find((e) => e.id.toString() === examId);
    if (sel) setSelectedExam(sel);
  }, [sorted, examId]);

  useEffect(() => {
    if (!isDropdownOpen) return;
    const tryScroll = () => {
      const container = scrollRef.current;
      if (!container) return;
      const el = container.querySelector(
        '[data-current="true"]',
      ) as HTMLElement | null;
      if (el) {
        el.scrollIntoView({ block: "center" });
      }
    };
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(tryScroll);
    });
    return () => cancelAnimationFrame(id);
  }, [isDropdownOpen, sorted, examId]);

  const completed = useMemo<Record<number, boolean>>(() => {
    const c = Cookies.get("completedExams");
    return c ? JSON.parse(c) : {};
  }, []);

  const changeExam = (e: Exam) => {
    setSelectedExam(e);
    navigate(`/search/${courseCode}/${e.id}`);
    setIsDropdownOpen(false);
  };

  const handleStartLockIn = (durationStr: string) => {
    if (!selectedExam) return;

    const duration = parseInt(durationStr);
    const session = LockInModeManager.startExamSession(selectedExam, duration);

    navigate(`/lock-in-mode/${session.examId}`);
  };

  let isLoading = false;
  try {
    const chatState = useChatState();
    isLoading = chatState.isLoading;
  } catch (e) {
    console.error("Failed to get chat state:", e);
    isLoading = false;
  }

  return (
    <div className="hidden lg:flex z-50 fixed w-full flex-row items-center top-0 left-0 right-0 justify-between px-5 h-14 bg-transparent">
      <div className="flex items-center space-x-5">
        <Button
          size="icon"
          variant="outline"
          onClick={() => navigate(`/search/${courseCode}`)}
          aria-label={t("goBack")}
        >
          <ArrowLeftIcon weight="bold" className="w-5 h-5" />
        </Button>

        <div className="flex items-center space-x-4">
          {selectedExam && (
            <DropdownMenu onOpenChange={setIsDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex flex-row items-center px-3 transition-colors group"
                >
                  <span>
                    <span className="font-semibold">
                      {selectedExam.exam_name.length > 20
                        ? `${selectedExam.exam_name
                            .slice(0, 20)
                            .replace(selectedExam.exam_date, "")}...`
                        : selectedExam.exam_name.replace(
                            selectedExam.exam_date,
                            "",
                          )}
                    </span>
                    <span className="font-normal">
                      {selectedExam.exam_date}
                    </span>
                  </span>
                  <CaretRightIcon
                    weight="bold"
                    className={`w-4 h-4 text-muted-foreground group-hover:rotate-90 ${
                      isDropdownOpen ? "rotate-90" : "rotate-0"
                    } transition-transform duration-200`}
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                sideOffset={4}
                className="w-80 max-h-96 overflow-hidden"
              >
                <div className="px-3 py-2 text-xs text-muted-foreground border-b">
                  {language === "sv" ? "Välj tenta" : "Select Exam"} (
                  {sorted.length})
                </div>
                <div ref={scrollRef} className="max-h-80 overflow-y-auto">
                  {sorted.map((e) => {
                    const sel = e.id.toString() === examId;
                    const done = completed[e.id];
                    return (
                      <DropdownMenuItem
                        key={e.id}
                        onClick={() => changeExam(e)}
                        data-current={sel ? "true" : undefined}
                        className={`flex items-center mt-2 justify-between px-3 py-3 cursor-pointer text-sm ${
                          sel
                            ? "bg-primary/10 text-primary"
                            : "hover:bg-muted/50"
                        }`}
                      >
                        <div className="flex-1 min-w-0 pr-3">
                          <div className="font-medium truncate">
                            {e.exam_name.replace(e.exam_date, "")}{" "}
                            <span className="font-normal">{e.exam_date}</span>
                          </div>
                          {e.exam_date && (
                            <div className="text-xs text-muted-foreground mt-0.5">
                              {new Intl.DateTimeFormat("sv-SE", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }).format(new Date(e.exam_date))}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {e.has_solution && (
                            <Badge
                              variant="outline"
                              className="text-xs px-1.5 py-0 bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                            >
                              {t("facit")}
                            </Badge>
                          )}
                          {done && (
                            <CheckIcon
                              weight="bold"
                              className="w-4 h-4 text-green-500"
                            />
                          )}
                        </div>
                      </DropdownMenuItem>
                    );
                  })}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          onClick={onToggleChat || (() => setIsChatOpen(true))}
          variant="outline"
          size="sm"
          className="hidden lg:flex gap-2 rounded-full transition-all duration-200"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{language === "sv" ? "Tänker..." : "Thinking..."}</span>
            </>
          ) : (
            <>
              <ChatDotsIcon weight="bold" />
              {language === "sv" ? "Fråga Chatten" : "Ask Chat"}
            </>
          )}
        </Button>

        <LockInMenu disabled={!selectedExam} onStartExam={handleStartLockIn} />

        <SettingsDialog />
      </div>
    </div>
  );
};

export default ExamHeader;
