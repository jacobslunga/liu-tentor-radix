import { Exam } from "@/components/data-table/columns";
import { useLanguage } from "@/context/LanguageContext";
import translations from "@/util/translations";
import Cookies from "js-cookie";
import {
  CheckIcon,
  ArrowLeftIcon,
  ChevronDownIcon,
} from "@primer/octicons-react";
import { FC, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { findFacitForExam } from "./PDF/utils";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SettingsDialog from "@/components/SettingsDialog";
import CourseSearchDropdown from "@/components/CourseSearchDropdown";
import { Badge } from "@/components/ui/badge";

const normalizeName = (name: string): string => {
  return name.toLowerCase().replace(/[^a-z0-9-_]/g, "");
};

const extractDate = (name: string): string | null => {
  const normalized = normalizeName(name);
  const match = normalized.match(/(\d{4}[-_]\d{2}[-_]\d{2}|\d{8}|\d{6})/);
  if (!match) return null;
  const dateStr = match[0];
  let year, month, day;
  if (dateStr.includes("-") || dateStr.includes("_")) {
    [year, month, day] = dateStr.split(/[-_]/);
  } else if (dateStr.length === 8) {
    year = dateStr.substring(0, 4);
    month = dateStr.substring(4, 6);
    day = dateStr.substring(6, 8);
  } else if (dateStr.length === 6) {
    year = `20${dateStr.substring(0, 2)}`;
    month = dateStr.substring(2, 4);
    day = dateStr.substring(4, 6);
  } else {
    return null;
  }
  if (
    parseInt(month, 10) < 1 ||
    parseInt(month, 10) > 12 ||
    parseInt(day, 10) < 1 ||
    parseInt(day, 10) > 31
  ) {
    return null;
  }
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
};

interface ExamHeaderProps {
  tenta_namn: string;
  exams: any[] | undefined;
  allExams: Exam[];
  courseCode: any;
  setSelectedExam: (exam: Exam) => void;
  showAIDrawer: boolean;
  setShowAIDrawer: React.Dispatch<React.SetStateAction<boolean>>;
  pdfUrl: string | null;
  facitPdfUrl: string | null;
  currentExamId: string;
}

const ExamHeader: FC<ExamHeaderProps> = ({
  tenta_namn,
  exams,
  allExams,
  setSelectedExam,
  courseCode,
  currentExamId,
  // setShowAIDrawer,
  // showAIDrawer,
  // pdfUrl,
  // facitPdfUrl,
}) => {
  const { language } = useLanguage();
  const [selectedExamName, setSelectedExamName] = useState(tenta_namn);
  const [completedExams] = useState<Record<number, boolean>>(() => {
    const cookieConsent = Cookies.get("cookieConsent");
    if (cookieConsent === "true") {
      const stored = Cookies.get("completedExams");
      return stored ? JSON.parse(stored) : {};
    }
    return {};
  });
  const navigate = useNavigate();

  // Sort exams by date
  const sortedExams = useMemo(() => {
    if (!exams) return [];
    return [...exams]
      .map((exam) => ({
        ...exam,
        date: extractDate(exam.tenta_namn),
      }))
      .sort((a, b) => {
        if (!a.date && !b.date) return 0;
        if (!a.date) return 1;
        if (!b.date) return -1;
        return b.date.localeCompare(a.date);
      });
  }, [exams]);

  const getTranslation = (
    key: keyof (typeof translations)[typeof language]
  ) => {
    return translations[language][key];
  };

  const handleExamChange = (exam: Exam) => {
    setSelectedExamName(exam.tenta_namn);
    setSelectedExam(exam);
    navigate(`/search/${courseCode}/${exam.id}`);
    window.location.reload();
  };

  let displayName = selectedExamName.replace(".pdf", "");

  // Format date for better display
  const formatDisplayDate = (dateStr: string | null) => {
    if (!dateStr) return null;
    try {
      return new Date(dateStr).toLocaleDateString(
        language === "sv" ? "sv-SE" : "en-US",
        {
          year: "numeric",
          month: "short",
          day: "numeric",
        }
      );
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="hidden md:flex z-[60] fixed w-full flex-row items-center top-0 left-0 right-0 justify-between px-6 h-14 bg-background/95 backdrop-blur-lg border-b border-border/40">
      {/* Left section */}
      <div className="flex flex-row items-center space-x-3.5">
        <Button
          size="icon"
          variant="ghost"
          onClick={() => {
            navigate(`/search/${courseCode}`);
          }}
          className="hover:bg-muted transition-colors"
          aria-label={getTranslation("goBack")}
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </Button>

        {/* Course code badge */}
        <Badge
          variant="secondary"
          className="font-mono text-sm px-3 py-1 font-medium"
        >
          {courseCode}
        </Badge>

        <div className="h-6 w-px bg-border" />

        {/* Exam selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex flex-row items-center space-x-2 h-9 hover:bg-muted transition-colors max-w-[300px]"
            >
              <span className="font-medium truncate">
                {displayName.length > 25
                  ? `${displayName.slice(0, 25)}...`
                  : displayName}
              </span>
              <ChevronDownIcon className="w-4 h-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-80 max-h-96 overflow-y-auto"
            align="start"
          >
            <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground border-b mb-1">
              {language === "sv" ? "Välj tenta" : "Select Exam"} (
              {sortedExams.length})
            </div>
            {sortedExams.map((exam) => (
              <DropdownMenuItem
                key={exam.id}
                onClick={() => handleExamChange(exam)}
                className={`flex flex-col items-start px-3 py-3 cursor-pointer ${
                  exam.id.toString() === currentExamId.toString()
                    ? "bg-primary/10 border-l-2 border-l-primary"
                    : ""
                }`}
              >
                <div className="flex items-center w-full gap-3">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span
                      className={`font-medium truncate ${
                        exam.id.toString() === currentExamId.toString()
                          ? "text-primary"
                          : "text-foreground"
                      }`}
                    >
                      {exam.tenta_namn.replace(".pdf", "")}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {findFacitForExam(exam, allExams) && (
                      <Badge
                        variant="outline"
                        className="text-xs bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                      >
                        {getTranslation("withFacit")}
                      </Badge>
                    )}
                    {completedExams[exam.id] && (
                      <CheckIcon className="w-4 h-4 text-green-500" />
                    )}
                  </div>
                </div>

                {exam.date && (
                  <div className="text-xs text-muted-foreground mt-1">
                    {formatDisplayDate(exam.date)}
                  </div>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Right section */}
      <div className="flex flex-row items-center space-x-3.5">
        {/* Course search dropdown */}
        <CourseSearchDropdown
          className="w-60"
          placeholder={getTranslation("searchCoursePlaceholder")}
        />

        <div className="h-6 w-px bg-border" />

        <SettingsDialog />
      </div>
    </div>
  );
};

export default ExamHeader;
