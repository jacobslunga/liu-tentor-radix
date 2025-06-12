import { Exam } from "@/components/data-table/columns";
import { DataTable } from "@/components/data-table/exams-data-table";
import { findFacitForExam, isFacit } from "@/components/PDF/utils";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLanguage } from "@/context/LanguageContext";
import { fetchExamsByCourseCode } from "@/lib/fetchers";
import translations from "@/util/translations";
import React, { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import useSWR from "swr";
import MobileExamList from "@/components/MobileExamList";
import { getClosestCourseCodes } from "@/util/helperFunctions";
import { kurskodArray } from "@/data/kurskoder";
import FontSizeSelector from "@/components/FontSizeSelector";
import { Button } from "@/components/ui/button";
import { AlertCircle, FileText, AlertTriangle, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// Array of courses that examiners have requested to be removed
// When a course code matches any of these (case-insensitive),
// a warning banner will be displayed to users indicating that
// the course has been removed at the examiner's request.
// To add new removed courses, simply add the course code to this array.
const REMOVED_COURSES = ["TFYA86"];

// Array of courses with student-uploaded content
// When a course code matches any of these (case-insensitive),
// a warning banner will be displayed above the exam table to inform
// users that the content is student-uploaded and may vary in quality.
const STUDENT_UPLOADED_COURSES = [
  "TDDE35",
  "TDIU11",
  "TMMV04",
  "TATA16",
  "TATA67",
  "TATA41",
  // Add more course codes as needed
];

export const extractDateFromName = (name: string) => {
  const patterns = [
    /(\d{4})-(\d{2})-(\d{2})/,
    /(\d{4})(\d{2})(\d{2})/,
    /(\d{2})(\d{2})(\d{2})/,
    /(\d{2})_(\d{2})_(\d{2})/,
    /(\d{4})_(\d{2})_(\d{2})/,
    /(\d{1,2})[-/](\d{1,2})[-/](\d{4})/,
    /(\d{4})[-/](\d{1,2})[-/](\d{1,2})/,
    /(?:jan|feb|mar|apr|maj|jun|jul|aug|sep|okt|nov|dec)[a-z]*[-_](\d{2,4})/,
    /(\d{2,4})[-_](?:jan|feb|mar|apr|maj|jun|jul|aug|sep|okt|nov|dec)[a-z]*/,
    /T?(\d{1,2})[-_](\d{4})/,
    /HT(\d{2})/,
    /VT(\d{2})/,
  ];
  const monthMap = {
    jan: "01",
    feb: "02",
    mar: "03",
    apr: "04",
    maj: "05",
    jun: "06",
    jul: "07",
    aug: "08",
    sep: "09",
    okt: "10",
    nov: "11",
    dec: "12",
  };

  for (const pattern of patterns) {
    const match = name.toLowerCase().match(pattern);
    if (!match) continue;
    try {
      let year, month, day;
      if (match[0].startsWith("ht")) {
        year = `20${match[1]}`;
        month = "12";
        day = "01";
      } else if (match[0].startsWith("vt")) {
        year = `20${match[1]}`;
        month = "01";
        day = "01";
      } else if (match[0].includes("t")) {
        year = match[2];
        month = match[1] === "1" ? "01" : "06";
        day = "01";
      } else {
        year = match[1];
        month = match[2];
        day = match[3];
        if (year.length === 2) year = `20${year}`;
        if (month in monthMap) month = monthMap[month as keyof typeof monthMap];
      }
      const monthNum = parseInt(month);
      const dayNum = parseInt(day);
      if (monthNum < 1 || monthNum > 12 || dayNum < 1 || dayNum > 31) continue;
      const date = new Date(parseInt(year), monthNum - 1, dayNum);
      if (!isNaN(date.getTime())) return date;
    } catch {
      continue;
    }
  }
  return null;
};

const formatDate = (name: string) => {
  const date = extractDateFromName(name);
  if (!date) return "-";
  return new Intl.DateTimeFormat("sv-SE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
};

const SearchPage: React.FC = () => {
  const { courseCode } = useParams<{ courseCode: string }>();
  const { language } = useLanguage();
  const {
    data: exams,
    error,
    isLoading: isExamsLoading,
  } = useSWR(courseCode, fetchExamsByCourseCode);

  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [courseStats, setCourseStats] = useState<any>(null);
  const [isStatsLoading, setIsStatsLoading] = useState(false);
  const [, setStatsError] = useState<string | null>(null);
  const [statsAttempted, setStatsAttempted] = useState(false);

  const getTranslation = (key: keyof (typeof translations)[typeof language]) =>
    translations[language][key];

  // Check if current course is in the removed courses list
  const isCourseRemoved =
    courseCode?.toUpperCase() &&
    REMOVED_COURSES.includes(courseCode.toUpperCase());

  // Check if current course has student-uploaded content
  const hasStudentUploads =
    courseCode?.toUpperCase() &&
    STUDENT_UPLOADED_COURSES.includes(courseCode.toUpperCase());

  // Fetch course stats with better error handling and loading states
  useEffect(() => {
    if (!courseCode || !exams || exams.length === 0) return;

    setIsStatsLoading(true);
    setStatsError(null);
    setStatsAttempted(false);

    const abortController = new AbortController();

    fetch(
      `https://liutentor.lukasabbe.com/api/courses/${courseCode.toUpperCase()}`,
      { signal: abortController.signal }
    )
      .then((res) => {
        if (!res.ok) {
          if (res.status === 404) {
            // Course stats not available, but that's okay
            setCourseStats(null);
            setStatsError(null);
          } else {
            throw new Error(`Failed to fetch stats: ${res.status}`);
          }
        } else {
          return res.json();
        }
      })
      .then((data) => {
        if (data) setCourseStats(data);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error("Error fetching course stats:", err);
          setStatsError(err.message);
          setCourseStats(null);
        }
      })
      .finally(() => {
        setIsStatsLoading(false);
        setStatsAttempted(true);
      });

    return () => abortController.abort();
  }, [courseCode, exams]);

  // Show initial loading only when exams are loading
  const isInitialLoading = isExamsLoading || exams === undefined;

  const formattedExams = useMemo(() => {
    if (!exams) return [];
    return exams
      .map((e: Exam) => {
        const fallbackDate = new Date(e.created_at || Date.now());
        const parsedDate = extractDateFromName(e.tenta_namn) || fallbackDate;
        const isoDate = `${parsedDate.getFullYear()}-${String(
          parsedDate.getMonth() + 1
        ).padStart(2, "0")}-${String(parsedDate.getDate()).padStart(2, "0")}`;
        const moduleStats = courseStats?.modules?.find((m: any) =>
          m.date?.startsWith(isoDate)
        );
        const grades = moduleStats?.grades || [];
        const total = grades.reduce(
          (acc: any, g: { quantity: any }) => acc + g.quantity,
          0
        );
        const approved = grades
          .filter((g: { grade: string }) => ["3", "4", "5"].includes(g.grade))
          .reduce((acc: any, g: { quantity: any }) => acc + g.quantity, 0);
        const approvalRate =
          total > 0
            ? parseFloat(((approved / total) * 100).toFixed(1))
            : undefined;
        const includesFacit =
          /(sol|solutions?|lösningar|svar|exam \+ solutions|exam and solutions)/.test(
            e.tenta_namn.toLowerCase()
          );
        const facit = includesFacit ? e : findFacitForExam(e, exams);
        return {
          ...e,
          created_at: formatDate(e.tenta_namn),
          rawDate: parsedDate,
          hasFacit: includesFacit || !!facit,
          isFacit: isFacit(e.tenta_namn),
          tenta_namn: e.tenta_namn.replace(/_/g, " ").replace(".pdf", ""),
          passedCount: approvalRate,
          gradeDistribution: grades.reduce(
            (acc: any, g: { grade: any; quantity: any }) => ({
              ...acc,
              [g.grade]: g.quantity,
            }),
            {}
          ),
        };
      })
      .filter((e) => !e.isFacit)
      .sort((a, b) =>
        a.hasFacit !== b.hasFacit
          ? a.hasFacit
            ? -1
            : 1
          : sortOrder === "desc"
          ? b.rawDate.getTime() - a.rawDate.getTime()
          : a.rawDate.getTime() - b.rawDate.getTime()
      );
  }, [exams, courseStats, sortOrder]);

  const pageTitle = `${courseCode?.toUpperCase()} - ${getTranslation(
    "searchResultsForCourseCode"
  )} - LiU Tentor`;
  const pageDescription = `${getTranslation(
    "examsAvailable"
  )} ${courseCode?.toUpperCase()}`;

  // Calculate exam stats
  const examStats = {
    total: formattedExams.length,
    withSolutions: formattedExams.filter((exam) => exam.hasFacit).length,
    passRateAvg:
      formattedExams.reduce((acc, exam) => acc + (exam.passedCount || 0), 0) /
        formattedExams.length || 0,
  };

  // Loading states with skeleton UI
  if (error) {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center p-4">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
            <CardDescription>
              Failed to load exams: {error.message}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (isInitialLoading) {
    return (
      <div className="w-full min-h-screen px-4 md:px-8 lg:px-12 py-3 md:py-6">
        <Helmet>
          <title>Loading... | LiU Tentor</title>
        </Helmet>

        {/* Mobile loading */}
        <div className="md:hidden w-full mb-4 space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-start gap-4">
                  <Skeleton className="h-12 w-12 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                    <div className="flex gap-2">
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-5 w-12" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop loading */}
        <div className="hidden md:block">
          <div className="max-w-7xl mx-auto">
            <div className="flex gap-6">
              {/* Sidebar skeleton */}
              <aside className="w-80 flex-shrink-0">
                <div className="sticky top-28 bg-background/60 backdrop-blur-sm border border-border/50 rounded-lg p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-8 w-20" />
                    <div className="text-right space-y-1">
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-4 w-12" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                  <div className="space-y-2">
                    {[...Array(3)].map((_, i) => (
                      <Skeleton key={i} className="h-8 w-full" />
                    ))}
                  </div>
                </div>
              </aside>

              {/* Table skeleton */}
              <main className="flex-1 min-w-0">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-8 w-32" />
                    <Skeleton className="h-8 w-24" />
                  </div>
                  <div className="border rounded-lg overflow-hidden">
                    {[...Array(8)].map((_, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-4 p-4 border-b last:border-b-0"
                      >
                        <Skeleton className="h-4 w-8" />
                        <Skeleton className="h-4 flex-1" />
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-8 w-20" />
                      </div>
                    ))}
                  </div>
                </div>
              </main>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (exams.length === 0) {
    const closest = getClosestCourseCodes(courseCode || "", kurskodArray);
    return (
      <div className="flex flex-col items-center min-h-screen px-4 md:px-8 lg:px-12">
        <Helmet>
          <title>No Results | LiU Tentor</title>
        </Helmet>

        <div className="flex flex-col mb-40 items-center justify-center flex-grow">
          {isCourseRemoved ? (
            // Show different content for removed courses
            <div className="text-center max-w-2xl space-y-6">
              <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-6">
                <div className="flex items-center justify-center mb-4">
                  <AlertCircle className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                </div>
                <h2 className="text-xl font-semibold text-orange-800 dark:text-orange-200 mb-2">
                  {getTranslation("courseRemovedTitle")}
                </h2>
                <p className="text-orange-700 dark:text-orange-300 text-sm">
                  {getTranslation("courseRemovedMessage")}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/">
                  <Button>{getTranslation("backToHome")}</Button>
                </Link>
              </div>
            </div>
          ) : (
            // Show normal "not found" content for regular courses
            <>
              <div className="text-center mb-8">
                <FileText className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {getTranslation("notFound")}: {courseCode}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {language === "sv"
                    ? "Vi kunde inte hitta några tentor för denna kurskod."
                    : "We couldn't find any exams for this course code."}
                </p>
              </div>

              <div className="text-center">
                <p className="text-gray-700 dark:text-gray-300 mb-4 font-medium">
                  {getTranslation("didYouMean")}:
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  {closest.map((course) => (
                    <Link
                      key={course}
                      to={`/search/${course}`}
                      onMouseEnter={() => setHoveredLink(course)}
                      onMouseLeave={() => setHoveredLink(null)}
                      className={`px-4 py-2 rounded-lg border transition-all duration-200 ${
                        hoveredLink === course
                          ? "bg-primary text-white border-primary shadow-md transform scale-105"
                          : "bg-background border-border hover:border-primary/50 text-foreground"
                      }`}
                    >
                      {course}
                    </Link>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen px-4 md:px-8 lg:px-12 py-3 md:py-6">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
      </Helmet>

      {/* Removed Course Banner */}
      {isCourseRemoved && (
        <div className="max-w-7xl mx-auto mt-3 md:mt-6">
          <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/20">
            <CardHeader>
              <CardTitle className="text-orange-800 dark:text-orange-200 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                {getTranslation("courseRemovedTitle")}
              </CardTitle>
              <CardDescription className="text-orange-700 dark:text-orange-300">
                {getTranslation("courseRemovedMessage")}
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      )}

      {/* Student Upload Warning Banner */}
      {hasStudentUploads && (
        <div className="max-w-7xl mx-auto mt-3 md:mt-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-3 md:mb-6">
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 dark:bg-blue-900/40 rounded-lg p-2">
                <AlertTriangle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-blue-800 dark:text-blue-200 font-semibold text-sm mb-1">
                  {getTranslation("studentUploadedTitle")}
                </h4>
                <p className="text-blue-700 dark:text-blue-300 text-sm">
                  {getTranslation("studentUploadedMessage")}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Exam List */}
      <div className="md:hidden w-full mb-4 md:mb-8 px-1">
        <MobileExamList
          exams={formattedExams}
          title={`${courseCode?.toUpperCase()} - ${getTranslation(
            "searchResultsForCourseCode"
          )}`}
          description={pageDescription}
        />
        {/* Mobile Student Upload Warning */}
        {hasStudentUploads && (
          <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
              <div>
                <p className="text-blue-800 dark:text-blue-200 font-medium text-sm">
                  {getTranslation("studentUploadedTitle")}
                </p>
                <p className="text-blue-700 dark:text-blue-300 text-xs mt-0.5">
                  {getTranslation("studentUploadedMessage")}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Desktop Layout with Sticky Sidebar */}
      <div className="hidden md:block">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-6">
            {/* Left Sidebar - Course Information (Sticky) */}
            <aside className="w-80 flex-shrink-0">
              <div className="sticky top-24 bg-background/60 backdrop-blur-sm border border-border/50 rounded-lg p-6">
                <div className="space-y-4">
                  {/* Course Header */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="bg-primary/10 border border-primary/20 rounded-lg px-3 py-1.5">
                        <span className="font-mono text-sm font-semibold text-primary">
                          {courseCode}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">
                          {language === "sv" ? "Genomsnitt" : "Avg Pass Rate"}
                        </div>
                        {isStatsLoading && !statsAttempted ? (
                          <Skeleton className="h-4 w-12" />
                        ) : (
                          <div className="text-sm font-bold text-foreground">
                            {examStats.passRateAvg.toFixed(0)}%
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h1 className="text-xl font-bold text-foreground leading-tight">
                        {language === "sv"
                          ? courseStats?.courseNameSwe
                          : courseStats?.courseNameEng}
                      </h1>
                      {courseStats?.courseNameSwe &&
                        courseStats?.courseNameEng && (
                          <p className="text-muted-foreground text-sm mt-1">
                            {language === "sv"
                              ? courseStats?.courseNameEng
                              : courseStats?.courseNameSwe}
                          </p>
                        )}
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-foreground">
                      {language === "sv" ? "Översikt" : "Overview"}
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between bg-muted/30 rounded-md px-3 py-2">
                        <span className="text-sm text-muted-foreground">
                          {translations[language].exams}
                        </span>
                        <span className="text-sm font-semibold text-foreground">
                          {examStats.total}
                        </span>
                      </div>
                      <div className="flex items-center justify-between bg-muted/30 rounded-md px-3 py-2">
                        <span className="text-sm text-muted-foreground">
                          {language === "sv" ? "Lösningar" : "Solutions"}
                        </span>
                        <span className="text-sm font-semibold text-green-600">
                          {examStats.withSolutions}
                        </span>
                      </div>
                      <div className="flex items-center justify-between bg-muted/30 rounded-md px-3 py-2">
                        <span className="text-sm text-muted-foreground">
                          {language === "sv" ? "Genomsnitt" : "Avg Pass Rate"}
                        </span>
                        {isStatsLoading && !statsAttempted ? (
                          <Skeleton className="h-4 w-12" />
                        ) : (
                          <span className="text-sm font-semibold text-foreground">
                            {examStats.passRateAvg.toFixed(0)}%
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-foreground">
                      {language === "sv" ? "Inställningar" : "Settings"}
                    </h3>
                    <FontSizeSelector />
                    <Link to="/upload-exams" className="group block">
                      <Button className="w-full">
                        <Plus className="h-4 w-4" />
                        <span>{getTranslation("uploadExamsOrFacit")}</span>
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </aside>

            {/* Right Side - Data Table */}
            <main className="flex-1 min-w-0">
              <DataTable
                data={formattedExams}
                courseCode={courseCode?.toUpperCase() ?? ""}
                onSortChange={() =>
                  setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"))
                }
              />
            </main>
          </div>
        </div>
      </div>

      <div className="h-20"></div>
    </div>
  );
};

export default SearchPage;
