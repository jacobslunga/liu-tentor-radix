import { FC, useEffect } from "react";

import { Button } from "@/components/ui/button";
import ExamHeader from "@/components/ExamHeader";
import ExamOnlyView from "@/components/PDF/Views/ExamOnlyView";
import ExamWithFacitView from "@/components/PDF/Views/ExamWithFacitView";
import LayoutSwitcher from "@/components/PDF/LayoutSwitcher";
import { Loader2 } from "lucide-react";
import MobilePdfView from "@/components/PDF/Views/MobilePdfView";
import { formatExamDate } from "@/util/formatExamDate";
import { useCourseExams } from "@/hooks/useCourseExams";
import { useExamDetails } from "@/hooks/useExamDetail";
import useLayoutMode from "@/stores/LayoutModeStore";
import { useMetadata } from "@/hooks/useMetadata";
import { useParams } from "react-router-dom";

const ExamPage: FC = () => {
  const { layoutMode } = useLayoutMode();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { courseCode = "", examId = "" } = useParams<{
    courseCode: string;
    examId: string;
  }>();

  const {
    courseData,
    isLoading: examsLoading,
    isError: examsError,
  } = useCourseExams(courseCode);
  const {
    examDetail,
    isLoading: detailLoading,
    isError: detailError,
  } = useExamDetails(Number(examId));

  const pageTitle =
    examDetail && courseData
      ? `${courseCode} - Tenta ${formatExamDate(examDetail.exam.exam_date)} | ${
          courseData.course_name_swe
        }`
      : `${courseCode} - Tenta ${examId}`;

  const pageDescription =
    examDetail && courseData
      ? `Se tenta för ${courseCode} från ${formatExamDate(
          examDetail.exam.exam_date
        )} - ${courseData.course_name_eng}`
      : `Tenta för ${courseCode}`;

  useMetadata({
    title: pageTitle,
    description: pageDescription,
    keywords: `${courseCode}, tenta, Linköpings Universitet, kurs, LiU, liu, Liu ${
      courseData?.course_name_eng || ""
    }`,
    ogTitle: pageTitle,
    ogDescription: pageDescription,
    ogType: "article",
    twitterCard: "summary",
    twitterTitle: pageTitle,
    twitterDescription: pageDescription,
    robots: "noindex, nofollow",
    canonical: `${window.location.origin}/exam/${courseCode}/${examId}`,
  });

  if (examsLoading || detailLoading) {
    return <LoadingState />;
  }

  if (!courseData || !examDetail || examsError || detailError) {
    return <ErrorState />;
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center w-screen overflow-y-hidden">
      <ExamHeader exams={courseData.exams} />

      {/** Desktop/Laptop view */}
      <div className="w-full mt-0 h-screen md:mt-14 md:max-h-[calc(100vh-3.5rem)] relative bg-background hidden lg:flex flex-row items-center justify-center overflow-hidden">
        {layoutMode === "exam-only" ? (
          <ExamOnlyView examDetail={examDetail} />
        ) : (
          <ExamWithFacitView examDetail={examDetail} />
        )}
        <LayoutSwitcher />
      </div>

      {/** Mobile view */}
      <MobilePdfView examDetail={examDetail} />
    </div>
  );
};

export default ExamPage;

const LoadingState = () => {
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center gap-2">
      <Loader2 className="w-10 h-10 animate-spin" />
      <p className="font-medium text-foreground/70">Laddar tenta...</p>
    </div>
  );
};

const ErrorState = () => {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center gap-2">
      <p className="text-4xl text-foreground/80">Något gick fel!</p>
      <p className="text-sm text-foreground/50">
        Ibland fungerar det att bara ladda om sidan :)
      </p>

      <Button onClick={() => window.location.reload()} variant="secondary">
        Ladda om
      </Button>
    </div>
  );
};
