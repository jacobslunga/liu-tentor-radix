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
import { useTranslation } from "@/hooks/useTranslation";
import { useMetadata } from "@/hooks/useMetadata";

const LoadingSpinner = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-2" />
      <p className="text-sm text-muted-foreground">{t("loadingExams")}</p>
    </div>
  );
};

const ErrorCard: React.FC<{
  title: string;
  message: string;
  showUploadButton?: boolean;
}> = ({ title, message, showUploadButton = false }) => {
  const { t } = useTranslation();

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-foreground text-xl">{title}</CardTitle>
        <CardDescription className="text-base">{message}</CardDescription>
      </CardHeader>
      {showUploadButton && (
        <CardContent className="pt-0 pb-6">
          <div className="flex flex-col items-center space-y-3">
            <p className="text-sm text-muted-foreground text-center">
              {t("helpOtherStudentsMessage")}
            </p>
            <Link to="/upload-exams">
              <Button className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                {t("uploadExams")}
              </Button>
            </Link>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

const TentaSearchPage: React.FC = () => {
  const { courseCode } = useParams<{ courseCode: string }>();
  const { t } = useTranslation();
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
    <div className="min-h-screen bg-background w-full overflow-x-hidden">
      <div className="container mx-auto flex items-center justify-center px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {isLoading && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] px-6">
            <LoadingSpinner />
          </div>
        )}

        {!isLoading && isError && (
          <div className="flex items-center justify-center min-h-[60vh] px-4">
            <ErrorCard
              title={t("courseCodeNotFound")}
              message={`${t("courseCodeNotFoundMessage")} "${courseCode}".`}
              showUploadButton={true}
            />
          </div>
        )}

        {!isLoading && !isError && formattedExams.length === 0 && (
          <div className="flex items-center justify-center min-h-[60vh] px-4">
            <ErrorCard
              title={t("noExamsFound")}
              message={`${t("noExamsFoundMessage")} "${courseCode}".${
                closest.length > 0
                  ? ` ${t("didYouMean")} ${closest.join(", ")}?`
                  : ""
              }`}
              showUploadButton={true}
            />
          </div>
        )}

        {!isLoading && !isError && formattedExams.length > 0 && (
          <div className="w-full lg:w-auto flex items-center justify-center flex-col">
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
              <Button className="w-full z-50">{t("uploadMore")}</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default TentaSearchPage;
