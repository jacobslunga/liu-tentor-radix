import { FC, useMemo, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Loader2,
  Upload as UploadIcon,
  BarChart as ChartIcon,
} from "lucide-react";
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
import { CardsThreeIcon } from "@phosphor-icons/react";

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
        <span className="font-medium text-primary">"{courseCode}"</span>
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
  const contentRef = useRef<HTMLDivElement>(null);

  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const sortedExams = useMemo(() => {
    const exams = courseData?.exams ?? [];
    if (exams.length === 0) return [];
    return [...exams].sort((a, b) => {
      return sortOrder === "desc"
        ? new Date(b.exam_date).getTime() - new Date(a.exam_date).getTime()
        : new Date(a.exam_date).getTime() - new Date(b.exam_date).getTime();
    });
  }, [courseData?.exams, sortOrder]);

  const closest = useMemo(
    () => getClosestCourseCodes(courseCode || "", kurskodArray, 5),
    [courseCode],
  );

  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set());

  const prefixes = useMemo(() => {
    const all = (courseData?.exams ?? []).map((e) => e.exam_name.split(" ")[0]);
    return [...new Set(all)];
  }, [courseData?.exams]);

  const pageTitle = courseData
    ? `${courseCode} - ${courseData.courseName} | Tentor`
    : `${courseCode} | Tentor`;

  useMetadata({
    title: pageTitle,
    description: `Plugga ${sortedExams.length} tentor för ${courseCode}`,
    keywords: `${courseCode}, tentor`,
    ogTitle: pageTitle,
    canonical: `${window.location.origin}/course/${courseCode}`,
  });

  const courseName =
    courseData?.courseName ??
    (language === "sv" ? "Inget kursnamn hittades" : "No course name found");

  if (courseCode === "TFYA86")
    return <div className="p-20 text-center">Borttaget på begäran</div>;

  const showNotFound = !isLoading && (isError || sortedExams.length === 0);

  return (
    <div className="bg-background min-h-screen w-full">
      <div className="container mx-auto px-4 md:px-8 py-8 max-w-[1400px]">
        {isLoading && <LoadingSpinner />}
        {showNotFound && (
          <NotFoundState courseCode={courseCode || ""} suggestions={closest} />
        )}

        {!isLoading && !isError && sortedExams.length > 0 && (
          <div className="flex flex-col items-center justify-center pb-4">
            <div
              ref={contentRef}
              className="flex flex-col gap-5 w-full lg:w-auto min-w-0"
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground/70">
                  <span className="font-medium text-foreground/80">
                    {courseCode}
                  </span>
                  <span>/</span>
                  <span>Tentor</span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-semibold text-foreground max-w-3xl leading-tight">
                  {courseName.split(" och ").map((part, i, arr) => (
                    <span key={i}>
                      {part}
                      {i < arr.length - 1 && (
                        <>
                          <span> och</span>
                          <br />
                        </>
                      )}
                    </span>
                  ))}
                </h1>
              </div>

              {prefixes.length > 1 && (
                <div className="flex flex-wrap gap-2">
                  {prefixes.map((p) => (
                    <button
                      key={p}
                      onClick={() =>
                        setActiveFilters((prev) => {
                          const next = new Set(prev);
                          next.has(p) ? next.delete(p) : next.add(p);
                          return next;
                        })
                      }
                      className={`text-xs cursor-pointer px-3 py-1 rounded-md border transition-colors font-mono ${
                        activeFilters.has(p)
                          ? "bg-foreground text-background border-foreground"
                          : "border-border decoration-dashed border-dashed text-muted-foreground hover:border-border hover:text-foreground"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}

              <DataTable
                data={sortedExams}
                activeFilters={activeFilters}
                onSortChange={() =>
                  setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"))
                }
              />

              <div className="sticky bottom-0 z-50 max-w-full">
                <div className="bg-linear-to-t from-background to-transparent w-full overflow-hidden">
                  <div className="flex items-center justify-center h-24 gap-4 scrollbar-none">
                    <div className="flex items-center gap-2 shrink-0">
                      <Link to="/upload-exams" viewTransition>
                        <Button variant="default">
                          <UploadIcon className="h-4 w-4" />
                          {t("uploadMore")}
                        </Button>
                      </Link>

                      <Link to={`/search/${courseCode}/stats`} viewTransition>
                        <Button variant="outline">
                          <ChartIcon className="h-4 w-4" />
                          {language === "sv" ? "Statistik" : "Statistics"}
                        </Button>
                      </Link>

                      <Link
                        to={`/quiz/${courseCode}`}
                        viewTransition
                        className="relative"
                      >
                        <Button variant="outline">
                          <CardsThreeIcon weight="bold" className="h-4 w-4" />
                          Quiz
                        </Button>
                        <div className="bg-red-500 text-white text-[9px] font-medium px-1.5 py-0.5 rounded-full absolute -top-2 -right-2">
                          <span>Nyhet</span>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamSearchPage;
