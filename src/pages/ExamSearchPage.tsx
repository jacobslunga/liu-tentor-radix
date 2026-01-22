import { FC, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Loader2,
  Search as SearchIcon,
  Upload as UploadIcon,
  BarChart as ChartIcon,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/data-table/exams-data-table";
import SponsorBanner from "@/components/sponsors/SponsorBanner";
import { ExamUploader } from "@/components/upload/ExamUploader";
import { getClosestCourseCodes } from "@/util/helperFunctions";
import { kurskodArray } from "@/data/kurskoder";
import { useCourseExams } from "@/hooks/useCourseExams";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "@/hooks/useTranslation";
import { useMetadata } from "@/hooks/useMetadata";
import { sponsors } from "@/components/sponsors/sponsorsData";
import { Separator } from "@/components/ui/separator";

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

  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedExamType, setSelectedExamType] = useState<string | null>(null);

  const sortedExams = useMemo(() => {
    if (!courseData?.exams) return [];
    return [...courseData.exams].sort((a, b) => {
      return sortOrder === "desc"
        ? new Date(b.exam_date).getTime() - new Date(a.exam_date).getTime()
        : new Date(a.exam_date).getTime() - new Date(b.exam_date).getTime();
    });
  }, [courseData, sortOrder]);

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
    ? `${courseCode} - ${language === "sv" ? courseData.course_name_swe : courseData.course_name_eng} | Tentor`
    : `${courseCode} | Tentor`;

  useMetadata({
    title: pageTitle,
    description: `Plugga ${stats.total} tentor för ${courseCode}`,
    keywords: `${courseCode}, tentor`,
    ogTitle: pageTitle,
    canonical: `${window.location.origin}/course/${courseCode}`,
  });

  const courseName = courseData?.course_name_swe;
  const titleFontSize =
    (courseName?.length || 0) > 50
      ? "text-lg"
      : (courseName?.length || 0) > 17
        ? "text-2xl"
        : "text-3xl";

  if (courseCode === "TFYA86")
    return <div className="p-20 text-center">Borttaget på begäran</div>;

  const showNotFound = !isLoading && (isError || sortedExams.length === 0);

  return (
    <div className="bg-background min-h-screen w-full">
      <div className="container mx-auto px-4 py-8">
        {isLoading && <LoadingSpinner />}
        {showNotFound && (
          <NotFoundState courseCode={courseCode || ""} suggestions={closest} />
        )}

        {!isLoading && !isError && sortedExams.length > 0 && (
          <div className="flex flex-col lg:flex-row justify-center items-start gap-10">
            <div className="w-full lg:w-[260px] shrink-0 flex flex-col gap-6 lg:sticky lg:top-24 order-1">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold">{courseCode}</span>
                  <span className="text-xs text-muted-foreground">
                    {stats.total} {t("exams").toLowerCase()}
                  </span>
                </div>

                <h1
                  className={`${titleFontSize} font-semibold leading-snug text-foreground`}
                >
                  {courseName}
                </h1>

                <Separator />

                <div className="flex items-center gap-6 py-2">
                  <div className="flex flex-col">
                    <span className="text-lg font-semibold">
                      {stats.avgPassRate}%
                    </span>
                    <span className="text-[10px] text-muted-foreground font-medium">
                      {t("averagePassRate")}
                    </span>
                  </div>
                  <div className="w-px h-8 bg-border" />
                  <div className="flex flex-col">
                    <span className="text-lg font-semibold">
                      {stats.withSolutions}
                      <span className="text-muted-foreground/60 text-sm font-normal">
                        /{stats.total}
                      </span>
                    </span>
                    <span className="text-[10px] text-muted-foreground font-medium">
                      {t("withSolution")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="relative">
                  <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={language === "sv" ? "Sök..." : "Search..."}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select
                  onValueChange={(v) =>
                    setSelectedExamType(v === "all" ? null : v)
                  }
                >
                  <SelectTrigger className="w-full bg-card">
                    <SelectValue
                      placeholder={
                        language === "sv" ? "Alla typer" : "All types"
                      }
                    />
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
              </div>

              <Separator />

              <div className="flex flex-col gap-2 pt-2">
                <Link to="/upload-exams">
                  <Button variant="default" size="sm" className="w-full">
                    <UploadIcon className="mr-2 h-4 w-4" />
                    {t("uploadMore")}
                  </Button>
                </Link>
                <Link to={`/search/${courseCode}/stats`}>
                  <Button variant="secondary" size="sm" className="w-full">
                    <ChartIcon className="mr-2 h-4 w-4" />
                    {language === "sv" ? "Statistik" : "Statistics"}
                  </Button>
                </Link>
              </div>
            </div>

            <div className="order-2 w-full lg:w-auto min-w-0 max-w-full">
              <DataTable
                data={filteredExams}
                globalFilter={searchQuery}
                onSortChange={() =>
                  setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"))
                }
              />
            </div>

            <div className="w-full lg:w-[300px] shrink-0 flex flex-col gap-4 lg:sticky lg:top-24 order-3">
              <div className="hidden lg:block text-xs font-semibold text-muted-foreground mb-1">
                Sponsorer
              </div>
              {sponsors.map((sponsor) => (
                <SponsorBanner
                  key={sponsor.id}
                  sponsor={sponsor}
                  title={sponsor.title}
                  subtitle={sponsor.subtitle}
                  body={sponsor.body}
                  courseCode={courseCode || ""}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamSearchPage;
