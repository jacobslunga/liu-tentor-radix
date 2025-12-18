import { FC, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table/exams-data-table";
import SponsorBanner from "@/components/sponsors/SponsorBanner";
import { getClosestCourseCodes } from "@/util/helperFunctions";
import { kurskodArray } from "@/data/kurskoder";
import { useCourseExams } from "@/hooks/useCourseExams";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "@/hooks/useTranslation";
import { useMetadata } from "@/hooks/useMetadata";
import { sponsors } from "@/components/sponsors/sponsorsData";
import { ExamUploader } from "@/components/upload/ExamUploader";

const LoadingSpinner = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
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

  const texts = {
    title:
      language === "sv" ? "Inga tentor hittades för" : "No exams found for",
    didYouMean: language === "sv" ? "Menade du:" : "Did you mean:",
    beFirstTitle:
      language === "sv"
        ? "Var den första att ladda upp!"
        : "Be the first to upload!",
    beFirstDesc:
      language === "sv"
        ? "Hjälp framtida studenter genom att ladda upp tentor för denna kurs."
        : "Help future students by uploading exams for this course.",
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-8 animate-in fade-in duration-500">
      <div className="text-center space-y-4 mb-10">
        <h1 className="text-2xl font-medium text-foreground tracking-tight">
          {texts.title}{" "}
          <span className="font-bold text-primary">"{courseCode}"</span>
        </h1>

        {suggestions.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-muted-foreground">
            <span>{texts.didYouMean}</span>
            {suggestions.map((code) => (
              <Link key={code} to={`/search/${code}`}>
                <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-secondary hover:opacity-70 text-foreground font-mono font-medium transition-opacity cursor-pointer">
                  {code}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="relative group rounded-2xl border-2 border-dashed border-muted-foreground/15 bg-card/50 p-8 sm:p-10 transition-all hover:border-primary/20 hover:bg-card/80">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <span className="bg-background px-4 py-1 text-xs font-semibold uppercase tracking-wider text-primary border rounded-full shadow-sm">
            {language === "sv" ? "Bidra" : "Contribute"}
          </span>
        </div>

        <div className="text-center mb-8 max-w-lg mx-auto">
          <h2 className="text-xl font-semibold mb-2">{texts.beFirstTitle}</h2>
          <p className="text-muted-foreground">{texts.beFirstDesc}</p>
        </div>

        <div className="max-w-xl mx-auto">
          <ExamUploader prefilledCourseCode={courseCode} />
        </div>
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

  const formattedExams = useMemo(() => {
    if (!courseData?.exams) return [];

    return [...courseData.exams].sort((a, b) => {
      return sortOrder === "desc"
        ? new Date(b.exam_date).getTime() - new Date(a.exam_date).getTime()
        : new Date(a.exam_date).getTime() - new Date(b.exam_date).getTime();
    });
  }, [courseData, sortOrder]);

  const closest = useMemo(
    () => getClosestCourseCodes(courseCode || "", kurskodArray, 5),
    [courseCode]
  );

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

  const showNotFound = !isLoading && (isError || formattedExams.length === 0);

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

        {showNotFound && (
          <div>
            <NotFoundState
              courseCode={courseCode || ""}
              suggestions={closest}
            />
          </div>
        )}

        {!isLoading && !isError && formattedExams.length > 0 && (
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_auto_1fr] w-full">
            <div className="hidden lg:block"></div>

            <div className="flex flex-col gap-4 order-2 lg:order-0">
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

            <div className="self-start lg:sticky top-20 lg:w-80 mt-6 lg:mt-0 order-1 lg:order-0">
              <div className="mb-2">
                <span className="text-xs font-medium opacity-60">Sponsor</span>
              </div>
              <SponsorBanner
                sponsor={sponsors[0]}
                description="Sök till Exsitecs traineeprogram"
                subtitle="Börja din karriär med vårt stora och långsiktiga traineeprogram där du får utbildning, stöd från en mentor och ansvar direkt inom IT"
                courseCode={courseCode || ""}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamSearchPage;
