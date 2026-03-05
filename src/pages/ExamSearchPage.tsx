import { FC, useMemo, useState, useRef, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Loader2, Upload as UploadIcon, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table/exams-data-table";
import { ExamUploader } from "@/components/upload/ExamUploader";
import { getClosestCourseCodes } from "@/util/helperFunctions";
import { kurskodArray } from "@/data/kurskoder";
import { useCourseExams } from "@/api";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "@/hooks/useTranslation";
import { useMetadata } from "@/hooks/useMetadata";
import { useLayout } from "@/context/LayoutContext";

const LoadingSpinner = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-2" />
      <p className="text-sm text-muted-foreground">{t("loadingExams")}</p>
    </div>
  );
};

const NotFoundState: React.FC<{
  courseCode: string;
  suggestions: string[];
}> = ({ courseCode, suggestions }) => {
  const { language } = useLanguage();
  return (
    <div className="w-full max-w-2xl mx-auto mt-12 text-center">
      <h1 className="text-2xl font-medium mb-4">
        {language === "sv" ? "Inga tentor hittades för" : "No exams found for"}{" "}
        <span className="font-semibold text-primary">"{courseCode}"</span>
      </h1>
      {suggestions.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2 text-sm text-muted-foreground mb-10">
          <span>{language === "sv" ? "Menade du:" : "Did you mean:"}</span>
          {suggestions.map((code) => (
            <Link key={code} to={`/search/${code}`}>
              <Badge
                variant="secondary"
                className="hover:opacity-70 cursor-pointer"
              >
                {code}
              </Badge>
            </Link>
          ))}
        </div>
      )}
      <div className="p-8 border-2 border-dashed rounded-2xl bg-card/50">
        <ExamUploader prefilledCourseCode={courseCode} />
      </div>
    </div>
  );
};

const ExamSearchPage: FC = () => {
  const { courseCode } = useParams<{ courseCode: string }>();
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { courseData, isLoading, isError } = useCourseExams(courseCode || "");
  const { setHeaderSearchAlignX } = useLayout();
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updatePosition = () => {
      if (contentRef.current) {
        const rect = contentRef.current.getBoundingClientRect();
        setHeaderSearchAlignX(rect.left);
      }
    };

    updatePosition();

    let timeoutId: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updatePosition, 100);
    };

    window.addEventListener("resize", handleResize);

    const observer = new ResizeObserver(() => {
      requestAnimationFrame(updatePosition);
    });

    if (contentRef.current) {
      observer.observe(contentRef.current);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      observer.disconnect();
      clearTimeout(timeoutId);
    };
  }, [setHeaderSearchAlignX, isLoading]);

  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedExamType, setSelectedExamType] = useState<string | null>(null);

  const sortedExams = useMemo(() => {
    const exams = courseData?.exams ?? [];
    if (exams.length === 0) return [];
    return [...exams].sort((a, b) => {
      return sortOrder === "desc"
        ? new Date(b.exam_date).getTime() - new Date(a.exam_date).getTime()
        : new Date(a.exam_date).getTime() - new Date(b.exam_date).getTime();
    });
  }, [courseData?.exams, sortOrder]);

  const filteredExams = useMemo(() => {
    if (!selectedExamType || selectedExamType === "all") return sortedExams;
    return sortedExams.filter(
      (exam) => exam.exam_name.split(" ")[0] === selectedExamType,
    );
  }, [sortedExams, selectedExamType]);

  const examTypes = useMemo(
    () => new Set(sortedExams.map((exam) => exam.exam_name.split(" ")[0])),
    [sortedExams],
  );

  const stats = useMemo(() => {
    if (sortedExams.length === 0) return { avgPassRate: 0, withSolutions: 0 };
    const totalPass = sortedExams.reduce(
      (acc, e) => acc + (e.pass_rate || 0),
      0,
    );
    const withSol = sortedExams.filter((e) => e.has_solution).length;
    return {
      avgPassRate: (totalPass / sortedExams.length).toFixed(1),
      withSolutions: withSol,
      total: sortedExams.length,
    };
  }, [sortedExams]);

  const closest = useMemo(
    () => getClosestCourseCodes(courseCode || "", kurskodArray, 5),
    [courseCode],
  );

  const pageTitle = courseData
    ? `${courseCode} - ${courseData.courseName} | Tentor`
    : `${courseCode} | Tentor`;

  useMetadata({
    title: pageTitle,
    description: `Plugga ${stats.total} tentor för ${courseCode}`,
    keywords: `${courseCode}, tentor`,
    ogTitle: pageTitle,
    canonical: `${window.location.origin}/course/${courseCode}`,
  });

  const courseName = courseData?.courseName;

  if (courseCode === "TFYA86")
    return <div className="p-20 text-center">Borttaget på begäran</div>;

  const showNotFound = !isLoading && (isError || sortedExams.length === 0);

  return (
    <div className="bg-background min-h-screen w-full">
      <div className="container mx-auto px-4 md:px-8 py-8 max-w-350">
        {isLoading && <LoadingSpinner />}
        {showNotFound && (
          <NotFoundState courseCode={courseCode || ""} suggestions={closest} />
        )}

        {!isLoading && !isError && sortedExams.length > 0 && (
          <div className="flex flex-col lg:flex-row gap-10 items-center justify-center">
            <div
              ref={contentRef}
              className="flex flex-col gap-6 w-full lg:w-auto min-w-0"
            >
              <div className="flex flex-col">
                <span className="font-semibold text-xs">{courseCode}</span>

                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <h1 className="text-2xl sm:text-3xl font-medium text-foreground wrap-break-word max-w-3xl leading-tight text-balance">
                    {courseName}
                  </h1>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-2">
                <div className="flex gap-2">
                  <Select
                    onValueChange={(v) =>
                      setSelectedExamType(v === "all" ? null : v)
                    }
                  >
                    <SelectTrigger className="h-8 w-35 bg-background text-xs">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Filter className="h-3 w-3" />
                        <SelectValue
                          placeholder={language === "sv" ? "Alla" : "All"}
                        />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        {language === "sv" ? "Alla typer" : "All types"}
                      </SelectItem>
                      {[...examTypes].map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Link to="/upload-exams">
                    <Button variant="default" size="sm">
                      <UploadIcon className="h-4 w-4" />
                      <span className="hidden sm:inline">
                        {t("uploadMore")}
                      </span>
                      <span className="sm:hidden">Ladda upp</span>
                    </Button>
                  </Link>
                </div>
              </div>

              <DataTable
                data={filteredExams}
                onSortChange={() =>
                  setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"))
                }
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamSearchPage;
