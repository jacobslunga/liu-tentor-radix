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
import LoadingSpinner from "@/components/LoadingSpinnger";
import { getClosestCourseCodes } from "@/util/helperFunctions";
import { kurskodArray } from "@/data/kurskoder";

export const extractDateFromName = (name: string) => {
  const patterns = [
    /(\d{4})-(\d{2})-(\d{2})/, // YYYY-MM-DD
    /(\d{4})(\d{2})(\d{2})/, // YYYYMMDD
    /(\d{2})(\d{2})(\d{2})/, // YYMMDD
    /(\d{2})_(\d{2})_(\d{2})/, // YY_MM_DD
    /(\d{4})_(\d{2})_(\d{2})/, // YYYY_MM_DD
    /(\d{1,2})[-/](\d{1,2})[-/](\d{4})/, // D-M-YYYY or D/M/YYYY
    /(\d{4})[-/](\d{1,2})[-/](\d{1,2})/, // YYYY-M-D or YYYY/M/D
    /(?:jan|feb|mar|apr|maj|jun|jul|aug|sep|okt|nov|dec)[a-z]*[-_](\d{2,4})/, // month-YY[YY]
    /(\d{2,4})[-_](?:jan|feb|mar|apr|maj|jun|jul|aug|sep|okt|nov|dec)[a-z]*/, // YY[YY]-month
    /T?(\d{1,2})[-_](\d{4})/, // T1-2024 or 1-2024 (term format)
    /HT(\d{2})/, // HT23 (fall term)
    /VT(\d{2})/, // VT24 (spring term)
  ];

  const monthMap: Record<string, string> = {
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
        if (monthMap[month]) month = monthMap[month];
      }

      if (!year || !month || !day) continue;

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
          onSortChange={() =>
            setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"))
          }
        />
      </div>

      <div className="sticky bottom-0 mb-10 w-screen h-20 bg-gradient-to-t from-background to-transparent flex items-center justify-center"></div>
    </div>
  );
};

export default SearchPage;
