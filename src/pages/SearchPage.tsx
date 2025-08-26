import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link, useParams } from "react-router-dom";
import { Loader2, Upload } from "lucide-react";
import React, { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table/exams-data-table";
import { getClosestCourseCodes } from "@/util/helperFunctions";
import { kurskodArray } from "@/data/kurskoder";
import { useCourseExams } from "@/hooks/useCourseExams";
import { useLanguage } from "@/context/LanguageContext";
import { useMetadata } from "@/hooks/useMetaData";

const LoadingSpinner = ({ language }: { language: any }) => (
  <div className="flex flex-col items-center justify-center min-h-[400px]">
    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-2" />
    <p className="text-sm text-muted-foreground">
      {language === "sv" ? "Laddar tentor..." : "Loading exams..."}
    </p>
  </div>
);

const ErrorCard: React.FC<{
  title: string;
  message: string;
  showUploadButton?: boolean;
  language: string;
}> = ({ title, message, showUploadButton = false, language }) => (
  <Card className="w-full max-w-2xl mx-auto">
    <CardHeader className="text-center">
      <CardTitle className="text-foreground text-xl">{title}</CardTitle>
      <CardDescription className="text-base">{message}</CardDescription>
    </CardHeader>
    {showUploadButton && (
      <CardContent className="pt-0 pb-6">
        <div className="flex flex-col items-center space-y-3">
          <p className="text-sm text-muted-foreground text-center">
            {language === "sv"
              ? "Har du tentor för den här kursen? Hjälp andra studenter genom att ladda upp dem!"
              : "Do you have exams for this course? Help other students by uploading them!"}
          </p>
          <Link to="/upload-exams">
            <Button className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              {language === "sv" ? "Ladda upp tentor" : "Upload exams"}
            </Button>
          </Link>
        </div>
      </CardContent>
    )}
  </Card>
);

const SearchPage: React.FC = () => {
  const { courseCode } = useParams<{ courseCode: string }>();
  const { language } = useLanguage();
  const { courseData, isLoading, isError } = useCourseExams(courseCode || "");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const formattedExams = useMemo(() => {
    if (!courseData?.exams) return [];

    return [...courseData.exams].sort((a, b) => {
      return sortOrder === "desc"
        ? new Date(b.exam_date).getTime() - new Date(a.exam_date).getTime()
        : new Date(a.exam_date).getTime() - new Date(b.exam_date).getTime();
    });
  }, [courseData, sortOrder]);

  const closest = getClosestCourseCodes(courseCode || "", kurskodArray);

  const pageTitle = courseData
    ? `${courseCode} - ${
        language === "sv"
          ? courseData.course_name_swe
          : courseData.course_name_eng
      } | Tentor`
    : `${courseCode} | Tentor`;

  const pageDescription = courseData
    ? `Plugga ${formattedExams.length} tentor för ${courseCode} - ${
        language === "sv"
          ? courseData.course_name_swe
          : courseData.course_name_eng
      }`
    : `Search for exams in course ${courseCode}`;

  useMetadata({
    title: pageTitle,
    description: pageDescription,
    keywords: `${courseCode}, tentor, tenta, Linköpings Universitet, LiU, liu, ${
      courseData?.course_name_eng || ""
    }`,
    ogTitle: pageTitle,
    ogDescription: pageDescription,
    ogType: "website",
    twitterCard: "summary",
    twitterTitle: pageTitle,
    twitterDescription: pageDescription,
    canonical: `${window.location.origin}/course/${courseCode}`,
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {isLoading && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] px-6">
            <LoadingSpinner language={language} />
          </div>
        )}

        {!isLoading && isError && (
          <div className="flex items-center justify-center min-h-[60vh] px-4">
            <ErrorCard
              title={
                language === "sv"
                  ? "Kurskoden hittades inte"
                  : "Course code not found"
              }
              message={
                language === "sv"
                  ? `Kurskoden "${courseCode}" finns inte i vår databas. Kontrollera stavningen eller prova en annan kurskod.`
                  : `The course code "${courseCode}" was not found in our database. Please check the spelling or try another course code.`
              }
              showUploadButton={true}
              language={language}
            />
          </div>
        )}

        {!isLoading && !isError && formattedExams.length === 0 && (
          <div className="flex items-center justify-center min-h-[60vh] px-4">
            <ErrorCard
              title={
                language === "sv" ? "Inga tentor hittades" : "No exams found"
              }
              message={
                language === "sv"
                  ? `Inga tentor hittades för kurskoden "${courseCode}".${
                      closest.length > 0
                        ? ` Menade du: ${closest.join(", ")}?`
                        : ""
                    }`
                  : `No exams found for course code "${courseCode}".${
                      closest.length > 0
                        ? ` Did you mean: ${closest.join(", ")}?`
                        : ""
                    }`
              }
              showUploadButton={true}
              language={language}
            />
          </div>
        )}

        {!isLoading && !isError && formattedExams.length > 0 && (
          <div className="w-full max-w-none">
            <div className="overflow-x-auto">
              <DataTable
                data={formattedExams}
                courseCode={courseCode?.toUpperCase() ?? ""}
                courseNameSwe={courseData?.course_name_swe || ""}
                courseNameEng={courseData?.course_name_eng || ""}
                onSortChange={() =>
                  setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"))
                }
              />

              <Link to="/upload-exams">
                <Button className="w-full z-50">
                  {language === "sv" ? "Ladda upp mer" : "Upload more"}
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
