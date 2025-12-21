import { FC, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CheckCircleIcon,
  XCircleIcon,
  FilePdfIcon,
  ChartBarIcon,
  FunnelIcon,
  SortAscendingIcon,
  SortDescendingIcon,
} from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Exam } from "@/types/exam";
import { ExamStatsDialog } from "@/components/ExamStatsDialog";
import { useLanguage } from "@/context/LanguageContext";
import { ChartBar } from "lucide-react";

interface Props {
  data: Exam[];
  courseCode: string;
  courseNameSwe?: string;
  courseNameEng?: string;
  onSortChange: () => void;
  sortOrder: "asc" | "desc";
}

export const ExamSearchResults: FC<Props> = ({
  data,
  courseCode,
  courseNameSwe,
  courseNameEng,
  onSortChange,
  sortOrder,
}) => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [selectedExamType, setSelectedExamType] = useState<string | null>(null);

  const examTypes = useMemo(
    () => Array.from(new Set(data.map((exam) => exam.exam_name.split(" ")[0]))),
    [data]
  );

  const filteredData = useMemo(() => {
    if (!selectedExamType || selectedExamType === "all") return data;
    return data.filter((exam) => exam.exam_name.startsWith(selectedExamType));
  }, [data, selectedExamType]);

  const stats = useMemo(() => {
    if (!data.length) return { avg: 0, count: 0 };
    const total = data.reduce((acc, curr) => acc + (curr.pass_rate || 0), 0);
    const withSolution = data.filter((e) => e.has_solution).length;
    return { avg: total / data.length, count: withSolution };
  }, [data]);

  return (
    <div className="w-full max-w-4xl space-y-8 animate-in fade-in duration-500">
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>LiU Tentor</span>
          <span className="text-muted-foreground/40">›</span>
          <span className="font-medium text-foreground">{courseCode}</span>
        </div>

        <div>
          <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-foreground">
            {language === "sv" ? courseNameSwe : courseNameEng}
          </h1>
          <p className="text-muted-foreground mt-2 text-base">
            {language === "sv"
              ? `Hittade ${data.length} tentor (${stats.count} med facit)`
              : `Found ${data.length} exams (${stats.count} with solutions)`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Select onValueChange={(v) => setSelectedExamType(v)}>
            <SelectTrigger className="w-[140px] h-9 bg-secondary/50 border-transparent hover:bg-secondary transition-colors">
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <FunnelIcon weight="bold" />
                <SelectValue placeholder="Typ" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alla typer</SelectItem>
              {examTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onSortChange}
            className="h-9 text-muted-foreground hover:text-foreground"
          >
            {sortOrder === "desc" ? (
              <SortDescendingIcon className="mr-2 h-4 w-4" />
            ) : (
              <SortAscendingIcon className="mr-2 h-4 w-4" />
            )}
            {language === "sv" ? "Datum" : "Date"}
          </Button>

          <div className="flex-1" />

          {/* Stats Link */}
          <Link to={`/search/${courseCode}/stats`}>
            <Button
              variant="link"
              className="text-muted-foreground hover:text-primary p-0 h-auto"
            >
              <ChartBarIcon className="mr-2 h-4 w-4" />
              {language === "sv"
                ? "Visa kursstatistik"
                : "View course statistics"}
            </Button>
          </Link>
        </div>
      </div>

      <Separator className="opacity-50" />

      {/* --- RESULTS LIST --- */}
      <div className="flex flex-col gap-8 pb-10">
        {filteredData.length > 0 ? (
          filteredData.map((exam) => (
            <SearchResultItem
              key={exam.id}
              exam={exam}
              courseCode={courseCode}
              navigate={navigate}
            />
          ))
        ) : (
          <div className="py-12 text-center text-muted-foreground">
            No exams found matching your filter.
          </div>
        )}
      </div>
    </div>
  );
};

// --- INDIVIDUAL RESULT ITEM ---
const SearchResultItem = ({
  exam,
  courseCode,
  navigate,
}: {
  exam: Exam;
  courseCode: string;
  navigate: any;
}) => {
  const { language } = useLanguage();

  // Formatting Date
  const dateStr = new Intl.DateTimeFormat(
    language === "sv" ? "sv-SE" : "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  ).format(new Date(exam.exam_date));

  // Pass Rate Color Logic
  const getPassRateColor = (rate: number | null) => {
    if (!rate) return "text-muted-foreground";
    if (rate < 30) return "text-red-500 font-medium";
    if (rate < 50) return "text-amber-500 font-medium";
    return "text-emerald-500 font-medium";
  };

  return (
    <div
      className="group flex flex-col gap-1 cursor-pointer"
      onClick={() => navigate(`/search/${courseCode}/${exam.id}`)}
    >
      {/* Top Meta Line (URL style) */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-0.5">
        <div className="flex items-center gap-1 bg-secondary px-2 py-0.5 rounded-full">
          <FilePdfIcon size={12} weight="fill" className="text-foreground/70" />
          <span className="font-mono font-medium">
            {exam.exam_name.split(" ")[0]}
          </span>
        </div>
        <span>•</span>
        <span>{dateStr}</span>
      </div>

      {/* Main Title Link */}
      <div className="block group-hover:underline decoration-blue-500/50 underline-offset-4 transition-all">
        <h3 className="text-xl text-blue-500 dark:text-blue-400 font-medium leading-tight">
          {exam.exam_name}
        </h3>
      </div>

      {/* Rich Snippet / Description */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-1 text-sm text-muted-foreground">
        {/* Solution Status */}
        <div className="flex items-center gap-1.5">
          {exam.has_solution ? (
            <>
              <CheckCircleIcon
                size={16}
                weight="fill"
                className="text-emerald-500"
              />
              <span className="text-foreground/80">
                {language === "sv" ? "Facit finns" : "Solution available"}
              </span>
            </>
          ) : (
            <>
              <XCircleIcon
                size={16}
                weight="bold"
                className="text-muted-foreground/50"
              />
              <span className="text-muted-foreground/70">
                {language === "sv" ? "Inget facit" : "No solution"}
              </span>
            </>
          )}
        </div>

        {/* Pass Rate Snippet */}
        {exam.pass_rate && (
          <div className="flex items-center gap-1.5">
            <span className="text-muted-foreground/40">•</span>
            <span>
              {language === "sv" ? "Godkända: " : "Pass rate: "}
              <span className={getPassRateColor(exam.pass_rate)}>
                {exam.pass_rate.toFixed(1)}%
              </span>
            </span>

            {/* Interactive Stats Dialog Trigger */}
            <div onClick={(e) => e.stopPropagation()} className="ml-1">
              <ExamStatsDialog
                statistics={exam.statistics || {}}
                date={exam.exam_date}
                trigger={
                  <ChartBar className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" />
                }
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
