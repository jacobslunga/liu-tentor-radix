import { Exam } from "@/components/data-table/columns";
import { DataTable } from "@/components/data-table/exams-data-table";
import { findFacitForExam, isFacit } from "@/components/PDF/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLanguage } from "@/context/LanguageContext";
import { fetchExamsByCourseCode } from "@/lib/fetchers";
import translations from "@/util/translations";
import { ArrowRight } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import { Link, useParams } from "react-router-dom";
import useSWR from "swr";
import MobileExamList from "@/components/MobileExamList";
import LoadingSpinner from "@/components/LoadingSpinnger";
import { getClosestCourseCodes } from "@/util/helperFunctions";
import { kurskodArray } from "@/data/kurskoder";

export const extractDateFromName = (name: string): Date | null => {
  const lower = name.toLowerCase();
  const monthMap: Record<string, string> = {
    januari: "01",
    februari: "02",
    mars: "03",
    april: "04",
    maj: "05",
    juni: "06",
    juli: "07",
    augusti: "08",
    september: "09",
    oktober: "10",
    november: "11",
    december: "12",
  };

  // Försök med direkta datumformat
  const directPatterns = [
    /(\d{4})[-_/](\d{2})[-_/](\d{2})/, // 2024-08-01
    /(\d{2})[-_/](\d{2})[-_/](\d{4})/, // 01-08-2024
    /(\d{4})(\d{2})(\d{2})/, // 20240801
    /t(\d{2})(\d{2})(\d{2})/i, // T240601
  ];

  for (const pattern of directPatterns) {
    const match = lower.match(pattern);
    if (match) {
      const [_, a, b, c] = match;
      const y = a.length === 4 ? a : `20${a}`;
      const m = a.length === 4 ? b : a;
      const d = a.length === 4 ? c : b;
      const date = new Date(`${y}-${m}-${d}`);
      if (!isNaN(date.getTime())) return date;
    }
  }

  // HT/VT format
  const termMatch = lower.match(/(ht|vt)(\d{2})/);
  if (termMatch) {
    const [_, term, year] = termMatch;
    const month = term === "ht" ? "12" : "01";
    return new Date(`20${year}-${month}-01`);
  }

  // Svenska månadsnamn format: "1 augusti 2024"
  const swedishMonthMatch = lower.match(
    /(\d{1,2})\s+(januari|februari|mars|april|maj|juni|juli|augusti|september|oktober|november|december)\s+(\d{4})/
  );
  if (swedishMonthMatch) {
    const [_, day, month, year] = swedishMonthMatch;
    return new Date(`${year}-${monthMap[month]}-${day.padStart(2, "0")}`);
  }

  // Fallback med Date.parse
  const fallback = Date.parse(name);
  if (!isNaN(fallback)) return new Date(fallback);

  return null;
};

const formatDate = (name: string) => {
  const date = extractDateFromName(name);
  return date
    ? new Intl.DateTimeFormat("sv-SE", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(date)
    : "-";
};

const SearchPage: React.FC = () => {
  const { courseCode } = useParams<{ courseCode: string }>();
  const { language } = useLanguage();
  const { data: exams, error } = useSWR(courseCode, fetchExamsByCourseCode);

  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [courseStats, setCourseStats] = useState<any>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  const getTranslation = (key: keyof (typeof translations)[typeof language]) =>
    translations[language][key];

  useEffect(() => {
    const fetchStats = async () => {
      if (!courseCode) return;
      setLoadingStats(true);

      try {
        const res = await fetch(
          `https://liutentor.lukasabbe.com/api/courses/${courseCode.toUpperCase()}`
        );
        if (!res.ok) throw new Error("Failed to fetch stats");
        const data = await res.json();
        setCourseStats(data);
      } catch (err) {
        console.error("Error fetching course stats:", err);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchStats();
  }, [courseCode]);

  console.log("Course Stats:", courseStats);

  const formattedExams = useMemo(() => {
    if (!exams || !courseStats) return [];

    return exams
      .map((e: Exam) => {
        const fallbackDate = new Date(e.created_at || Date.now());
        const parsedDate = extractDateFromName(e.tenta_namn) || fallbackDate;

        const toIso = (date: Date) =>
          `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
            2,
            "0"
          )}-${String(date.getDate()).padStart(2, "0")}`;

        const isoDate = toIso(parsedDate);

        const moduleStats = courseStats.modules?.find((m: any) =>
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
          /(solutions|lösningar|svar|exam \+ solutions|exam and solutions)/.test(
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
      .sort((a, b) => {
        if (a.hasFacit !== b.hasFacit) return a.hasFacit ? -1 : 1;
        return sortOrder === "desc"
          ? b.rawDate.getTime() - a.rawDate.getTime()
          : a.rawDate.getTime() - b.rawDate.getTime();
      });
  }, [exams, courseStats, sortOrder]);

  const pageTitle = `${courseCode?.toUpperCase()} - ${getTranslation(
    "searchResultsForCourseCode"
  )} - LiU Tentor`;
  const pageDescription = `${getTranslation(
    "examsAvailable"
  )} ${courseCode?.toUpperCase()}`;

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

  if (!exams || loadingStats) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-5rem)]">
        <LoadingSpinner />
      </div>
    );
  }

  if (formattedExams.length === 0) {
    const closest = getClosestCourseCodes(courseCode || "", kurskodArray);
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Helmet>
          <title>No Results | LiU Tentor</title>
        </Helmet>
        <div className="flex flex-col mb-40 items-center justify-center">
          <h2 className="text-2xl font-bold">
            {getTranslation("notFound")}: {courseCode}
          </h2>
          <p className="mt-5">{getTranslation("didYouMean")}:</p>
          <div className="flex flex-col items-start space-y-2 mt-4">
            {closest.map((course) => (
              <Link
                key={course}
                to={`/search/${course}`}
                onMouseEnter={() => setHoveredLink(course)}
                onMouseLeave={() => setHoveredLink(null)}
                className={`${
                  hoveredLink === course ? "text-primary" : "text-primary/50"
                } hover:underline`}
              >
                {course}
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex-grow flex justify-start bottom-0 items-center flex-col px-4 md:px-8 lg:px-12">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
      </Helmet>

      <div className="md:hidden w-full mt-6 mb-8 px-5">
        <MobileExamList
          exams={formattedExams}
          title={`${courseCode?.toUpperCase()} - ${getTranslation(
            "searchResultsForCourseCode"
          )}`}
          description={pageDescription}
        />
      </div>

      <div className="hidden md:block max-w-full min-w-[50%]">
        <DataTable
          data={formattedExams}
          courseCode={courseCode?.toUpperCase() ?? ""}
          courseNameSwe={courseStats?.courseNameSwe ?? ""}
          courseNameEng={courseStats?.courseNameEng ?? ""}
          description={pageDescription}
          onSortChange={() =>
            setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"))
          }
        />
      </div>

      <div className="sticky bottom-0 mt-10 mb-10 w-screen h-20 bg-gradient-to-t from-background to-transparent flex items-center justify-center">
        <Link to="/upload-exams">
          <Button variant="outline" className="flex items-center gap-2">
            <p>{getTranslation("uploadExamsOrFacit")}</p>
            <ArrowRight className="rotate-[-45deg] w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default SearchPage;
