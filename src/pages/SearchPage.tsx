import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link, useParams } from "react-router-dom";
import React, { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table/exams-data-table";
import { Loader2 } from "lucide-react";
import { getClosestCourseCodes } from "@/util/helperFunctions";
import { kurskodArray } from "@/data/kurskoder";
import translations from "@/util/translations";
import { useCourseExams } from "@/hooks/useCourseExams";
import { useLanguage } from "@/context/LanguageContext";

const LoadingSpinner = ({ language }: { language: any }) => (
  <div className="flex flex-col items-center justify-center min-h-[400px]">
    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-2" />
    <p className="text-sm text-muted-foreground">
      {language === "sv" ? "Laddar tentor..." : "Loading exams..."}
    </p>
  </div>
);

const ErrorCard: React.FC<{ title: string; message: string }> = ({
  title,
  message,
}) => (
  <Card className="w-full max-w-lg mt-10">
    <CardHeader>
      <CardTitle className={title === "Error" ? "text-destructive" : ""}>
        {title}
      </CardTitle>
      <CardDescription>{message}</CardDescription>
    </CardHeader>
  </Card>
);

const SearchPage: React.FC = () => {
  const { courseCode } = useParams<{ courseCode: string }>();
  const { language } = useLanguage();
  const { courseData, isLoading, isError } = useCourseExams(courseCode || "");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const getTranslation = (key: keyof (typeof translations)[typeof language]) =>
    translations[language][key];

  const formattedExams = useMemo(() => {
    if (!courseData?.exams) return [];

    return [...courseData.exams].sort((a, b) => {
      return sortOrder === "desc"
        ? new Date(b.exam_date).getTime() - new Date(a.exam_date).getTime()
        : new Date(a.exam_date).getTime() - new Date(b.exam_date).getTime();
    });
  }, [courseData, sortOrder]);

  const closest = getClosestCourseCodes(courseCode || "", kurskodArray);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {isLoading && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] px-6">
            <LoadingSpinner language={language} />
          </div>
        )}

        {!isLoading && isError && (
          <div className="flex items-center justify-center min-h-[60vh]">
            <ErrorCard
              title="Error"
              message={`${getTranslation("notFound")}: ${courseCode}`}
            />
          </div>
        )}

        {!isLoading && !isError && formattedExams.length === 0 && (
          <div className="flex items-center justify-center min-h-[60vh]">
            <ErrorCard
              title="No Exams Found"
              message={`${getTranslation("notFound")}: ${courseCode}. ${
                closest.length > 0 ? `Did you mean: ${closest.join(", ")}?` : ""
              }`}
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
