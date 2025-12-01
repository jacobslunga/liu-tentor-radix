import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FC, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Loader2, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table/exams-data-table";
import SponsorBanner from "@/components/sponsors/SponsorBanner";
import { getClosestCourseCodes } from "@/util/helperFunctions";
import { kurskodArray } from "@/data/kurskoder";
import { useCourseExams } from "@/hooks/useCourseExams";
import { useLanguage } from "@/context/LanguageContext";
import { useMetadata } from "@/hooks/useMetadata";
import { useTranslation } from "@/hooks/useTranslation";
import { sponsors } from "@/components/sponsors/sponsorsData";

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

const ExamSearchPage: FC = () => {
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

  if (courseCode === "TFYA86") {
    return (
      <div className="h-screen w-screen flex flex-col gap-3 items-center justify-center">
        <h2 className="text-foreground text-2xl font-medium">
          Borttaget på begäran!
        </h2>
        <p className="text-base max-w-2xl text-center">
          Kursen TFYA86 har tagits bort. Tentor och facit har tagits bort på
          begäran av examinatorn.
        </p>
        <Link to="/">
          <Button>Hitta andra kurser</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-background w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {isLoading && (
          <div className="flex items-center justify-center">
            <div className="flex flex-col items-center justify-center min-h-[60vh] px-6">
              <LoadingSpinner />
            </div>
          </div>
        )}
        {!isLoading && isError && (
          <div className="flex items-center justify-center">
            <div className="flex items-center justify-center min-h-[60vh] px-4">
              <ErrorCard
                title={t("courseCodeNotFound")}
                message={`${t("courseCodeNotFoundMessage")} "${courseCode}".`}
                showUploadButton={true}
              />
            </div>
          </div>
        )}
        {!isLoading && !isError && formattedExams.length === 0 && (
          <div className="flex items-center justify-center">
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
          </div>
        )}

        {!isLoading && !isError && formattedExams.length > 0 && (
          <div className="w-full flex flex-col lg:flex-row gap-6 items-start justify-center">
            {/* Table section - left side on desktop */}
            <div className="w-auto flex flex-col gap-4">
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
            {/* Sponsor banner - top on mobile, sticky right on desktop */}
            <div className="w-full sticky top-20 lg:w-80 order-1 lg:order-2">
              <div className="mb-2">
                <span className="text-xs font-medium opacity-60">Sponsor</span>
              </div>
              <SponsorBanner
                sponsor={sponsors[0]}
                description="Sök till Exsitecs traineeprogram"
                subtitle="Börja din karriär med vårt stora och långsiktiga traineeprogram där du får utbildning, stöd från en mentor och ansvar direkt inom IT"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamSearchPage;
