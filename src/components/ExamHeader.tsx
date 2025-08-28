import { ArrowLeftIcon, CheckIcon } from "@primer/octicons-react";
import { ChartColumnIncreasing, ChevronRight, Coffee } from "lucide-react";
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
import { Exam } from "@/types/exam";
import { ExamModeDialog } from "@/components/ExamModeDialog";
import { ExamModeManager } from "@/lib/examMode";
import { ExamStatsDialog } from "./ExamStatsDialog";
import SettingsDialog from "@/components/SettingsDialog";
import translations from "@/util/translations";
import { useLanguage } from "@/context/LanguageContext";

interface Props {
  exams: Exam[];
}

const ExamHeader: FC<Props> = ({ exams }) => {
  const { language } = useLanguage();
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
          new Date(b.exam_date).getTime() - new Date(a.exam_date).getTime()
      ),
    [exams]
  );

  useEffect(() => {
    const sel = sorted.find((e) => e.id.toString() === examId);
    if (sel) {
      setSelectedExam(sel);
    }
  }, [sorted, examId]);

  useEffect(() => {
    if (isDropdownOpen && scrollRef.current) {
      const idx = sorted.findIndex((e) => e.id.toString() === examId);
      if (idx >= 0) {
        const itemHeight = 60;
        const containerHeight = scrollRef.current.clientHeight;
        scrollRef.current.scrollTo({
          top: idx * itemHeight - containerHeight / 2 + itemHeight / 2,
          behavior: "auto",
        });
      }
    }
  }, [isDropdownOpen, sorted, examId]);

  const t = (k: keyof (typeof translations)["sv"]) => translations[language][k];

  const completed = useMemo<Record<number, boolean>>(() => {
    if (Cookies.get("cookieConsent") !== "true") return {};
    const c = Cookies.get("completedExams");
    return c ? JSON.parse(c) : {};
  }, []);

  const changeExam = (e: Exam) => {
    setSelectedExam(e);
    navigate(`/search/${courseCode}/${e.id}`);
    setIsDropdownOpen(false);
  };

  const handleStartExamMode = (duration: string) => {
    const currentExam = exams.find((exam) => exam.id.toString() === examId);
    if (currentExam) {
      const durationMinutes = parseFloat(duration);
      ExamModeManager.startExamSession(currentExam, durationMinutes);
      navigate(`/exam-mode/${examId}`);
    }
  };

  return (
    <div className="hidden md:flex z-20 fixed w-full flex-row items-center top-0 left-0 right-0 justify-between px-5 h-14 bg-background border-b">
      <div className="flex items-center space-x-5">
        <Button
          size="icon"
          variant="outline"
          onClick={() => navigate(`/search/${courseCode}`)}
          aria-label={t("goBack")}
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </Button>

        {/* Enhanced Exam Information */}
        <div className="flex items-center space-x-4">
          {selectedExam && (
            <DropdownMenu onOpenChange={setIsDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex flex-row items-center px-3 transition-colors group"
                >
                  <span>
                    <span className="font-medium">
                      {selectedExam.exam_name.length > 20
                        ? `${selectedExam.exam_name
                            .slice(0, 20)
                            .replace(selectedExam.exam_date, "")}...`
                        : selectedExam.exam_name.replace(
                            selectedExam.exam_date,
                            ""
                          )}
                    </span>
                    <span className="font-normal">
                      {selectedExam.exam_date}
                    </span>
                  </span>
                  <ChevronRight
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
                        className={`
                      flex items-center mt-2 justify-between px-3 py-3 cursor-pointer text-sm
                      ${
                        sel ? "bg-primary/10 text-primary" : "hover:bg-muted/50"
                      }
                    `}
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
                              {language === "sv" ? "Facit" : "Sol"}
                            </Badge>
                          )}
                          {done && (
                            <CheckIcon className="w-4 h-4 text-green-500" />
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
      <div className="flex items-center space-x-3">
        {selectedExam && (
          <ExamStatsDialog
            statistics={{
              "3": selectedExam.statistics["3"] || 0,
              "4": selectedExam.statistics["4"] || 0,
              "5": selectedExam.statistics["5"] || 0,
              U: selectedExam.statistics.U || 0,
              G: selectedExam.statistics.G || 0,
              pass_rate: selectedExam.pass_rate,
            }}
            date={selectedExam.exam_date}
            trigger={
              <Button size="sm" variant="ghost">
                <ChartColumnIncreasing />
                {language === "sv" ? "Statistik" : "Statistics"}
              </Button>
            }
          />
        )}

        <ExamModeDialog
          trigger={
            <Button variant="secondary" size="sm">
              <Coffee />
              Lock in
            </Button>
          }
          onStartExam={handleStartExamMode}
        />
        <SettingsDialog />
      </div>
    </div>
  );
};

export default ExamHeader;
