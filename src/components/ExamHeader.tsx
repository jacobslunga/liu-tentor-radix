import { Exam } from "@/components/data-table/columns";
import { useLanguage } from "@/context/LanguageContext";
import translations from "@/util/translations";
import Cookies from "js-cookie";
import {
  CheckIcon,
  ArrowLeftIcon,
  ChevronDownIcon,
} from "@primer/octicons-react";
import { FC, useContext, useEffect, useMemo, useState } from "react";
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
import { ShowGlobalSearchContext } from "@/context/ShowGlobalSearchContext";

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

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex flex-row items-center justify-center space-x-1"
            >
              <p className="flex-1 text-left">
                {displayName.length > 20
                  ? `${displayName.slice(0, 20)}...`
                  : displayName}
              </p>
              <ChevronDownIcon className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="max-h-80 ml-16 space-y-1 overflow-y-auto w-[280px] self-end [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {sortedExams.map((exam) => (
              <DropdownMenuItem
                key={exam.id}
                onClick={() => handleExamChange(exam)}
                className={`flex flex-col px-3 py-2 ${
                  exam.id.toString() === currentExamId.toString()
                    ? "bg-primary/10"
                    : ""
                }`}
              >
                <div className="flex items-center w-full gap-2">
                  {exam.id.toString() === currentExamId.toString() && (
                    <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  )}
                  <span
                    className={`flex-1 font-medium truncate ${
                      exam.id.toString() === currentExamId.toString()
                        ? "text-primary"
                        : ""
                    }`}
                  >
                    {exam.tenta_namn.replace(".pdf", "")}
                  </span>
                  {completedExams[exam.id] && (
                    <CheckIcon className="w-4 h-4 text-green-500 shrink-0" />
                  )}
                </div>
                <div className="flex items-start w-full space-x-2 text-xs text-muted-foreground">
                  {exam.date && <span>{exam.date}</span>}
                  {findFacitForExam(exam, allExams) && (
                    <>
                      <span>•</span>
                      <span className="text-green-500">
                        {getTranslation("withFacit")}
                      </span>
                    </>
                  )}
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex flex-row items-center justify-center space-x-3 min-w-fit">
        <div
          className="relative group hidden sm:flex items-center"
          role="search"
        >
          <div
            className="group font-normal hover:cursor-text hover:border-primary/70 transition-all duration-200 w-[300px] bg-foreground/5 border py-2 px-3 rounded-2xl"
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
