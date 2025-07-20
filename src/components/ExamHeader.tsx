import { Exam } from "@/components/data-table/columns";
import { useLanguage } from "@/context/LanguageContext";
import translations from "@/util/translations";
import Cookies from "js-cookie";
import {
  CheckIcon,
  ArrowLeftIcon,
  ChevronDownIcon,
} from "@primer/octicons-react";
import { FC, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { findFacitForExam, isFacit } from "./PDF/utils";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SettingsDialog from "@/components/SettingsDialog";
import { ShowGlobalSearchContext } from "@/context/ShowGlobalSearchContext";
import { Badge } from "./ui/badge";

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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [completedExams] = useState<Record<number, boolean>>(() => {
    const cookieConsent = Cookies.get("cookieConsent");
    if (cookieConsent === "true") {
      const stored = Cookies.get("completedExams");
      return stored ? JSON.parse(stored) : {};
    }
    return {};
  });
  const navigate = useNavigate();

  const { setShowGlobalSearch } = useContext(ShowGlobalSearchContext);
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    const platform = window.navigator.platform.toLowerCase();
    setIsMac(platform.includes("mac"));
  }, []);

  const modifierKey = isMac ? "⌘" : "Ctrl";

  // Sort exams by date
  const sortedExams = useMemo(() => {
    if (!exams) return [];
    return [...exams]
      .map((exam) => ({
        ...exam,
        date: extractDate(exam.tenta_namn),
      }))
      .filter((exam) => !isFacit(exam.tenta_namn))
      .sort((a, b) => {
        if (!a.date && !b.date) return 0;
        if (!a.date) return 1;
        if (!b.date) return -1;
        return b.date.localeCompare(a.date);
      });
  }, [exams]);

  // Scroll to center the selected exam when dropdown opens
  useEffect(() => {
    if (isDropdownOpen && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const selectedIndex = sortedExams.findIndex(
        (exam) => exam.id.toString() === currentExamId.toString()
      );

      if (selectedIndex !== -1) {
        const itemHeight = 60; // Approximate height of each item
        const containerHeight = container.clientHeight;
        const scrollTop =
          selectedIndex * itemHeight - containerHeight / 2 + itemHeight / 2;

        container.scrollTo({
          top: Math.max(0, scrollTop),
        });
      }
    }
  }, [isDropdownOpen, sortedExams, currentExamId]);

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
    <div
      className={`hidden md:flex z-[60] fixed w-full flex-row items-center top-0 left-0 right-0 justify-between px-5 h-14 bg-background border-b`}
    >
      <div className="flex flex-row items-center justify-center space-x-5">
        <Button
          size="icon"
          variant="outline"
          onClick={() => {
            navigate(`/search/${courseCode}`);
          }}
          aria-label={getTranslation("goBack")}
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </Button>

        {/* Exam selector */}
        <DropdownMenu onOpenChange={setIsDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex flex-row items-center space-x-2 h-9 px-3 hover:bg-muted transition-colors max-w-[300px]"
            >
              <span className="font-medium truncate text-sm">
                {displayName.length > 25
                  ? `${displayName.slice(0, 25)}...`
                  : displayName}
              </span>
              <ChevronDownIcon className="w-4 h-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-80 max-h-96 overflow-hidden"
            align="start"
            sideOffset={4}
          >
            {/* Simple header */}
            <div className="px-3 py-2 text-xs font-medium text-muted-foreground border-b">
              {language === "sv" ? "Välj tenta" : "Select Exam"} (
              {sortedExams.length})
            </div>

            {/* Scrollable content */}
            <div ref={scrollContainerRef} className="max-h-80 overflow-y-auto">
              {sortedExams.map((exam) => {
                const isSelected =
                  exam.id.toString() === currentExamId.toString();
                const hasFacit = findFacitForExam(exam, allExams);
                const isCompleted = completedExams[exam.id];

                return (
                  <DropdownMenuItem
                    key={exam.id}
                    onClick={() => handleExamChange(exam)}
                    className={`
                      flex items-center justify-between px-3 py-3 cursor-pointer text-sm
                      ${
                        isSelected
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-muted/50"
                      }
                    `}
                  >
                    <div className="flex-1 min-w-0 pr-3">
                      <div className="font-medium truncate">
                        {exam.tenta_namn.replace(".pdf", "").replace(/_/g, " ")}
                      </div>
                      {exam.date && (
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {formatDisplayDate(exam.date)}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {hasFacit && (
                        <Badge
                          variant="outline"
                          className="text-xs px-1.5 py-0 bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                        >
                          {language === "sv" ? "Facit" : "Sol"}
                        </Badge>
                      )}
                      {isCompleted && (
                        <CheckIcon className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                  </DropdownMenuItem>
                );
              })}
            </div>

            {/* Empty state */}
            {sortedExams.length === 0 && (
              <div className="p-4 text-center text-muted-foreground text-sm">
                {language === "sv"
                  ? "Inga tentor tillgängliga"
                  : "No exams available"}
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex flex-row items-center justify-center space-x-3 min-w-fit">
        <div
          className="relative group hidden sm:flex items-center"
          role="search"
        >
          <div
            className="group font-medium hover:cursor-text hover:border-primary/70 transition-all duration-200 w-[300px] bg-foreground/5 border py-2 px-3 rounded-md"
            onClick={() => {
              setShowGlobalSearch(true);
            }}
            aria-label={getTranslation("searchCoursePlaceholder")}
          >
            <p className="text-xs text-foreground/50">
              {getTranslation("searchCoursePlaceholder")}
            </p>
          </div>
          <kbd className="text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-foreground/10 px-2 py-1 rounded-sm text-foreground/50 absolute right-5">
            {modifierKey} K
          </kbd>
        </div>

        <SettingsDialog />
      </div>
    </div>
  );
};

export default ExamHeader;
