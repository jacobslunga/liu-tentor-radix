import { FC, useEffect } from "react";

import ExamHeader from "@/components/ExamHeader";
import LoadingSpinner from "@/components/LoadingSpinnger";
import PDFView from "@/components/PDFView";
import { useCourseExams } from "@/hooks/useCourseExams";
import { useExamDetails } from "@/hooks/useExamDetail";
import { useParams } from "react-router-dom";

const TentaPage: FC = () => {
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

  if (examsLoading || detailLoading) {
    return <LoadingSpinner />;
  }

  if (!courseData || !examDetail || examsError || detailError) {
    return <div>Error loading data</div>;
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center w-screen overflow-y-hidden">
      <ExamHeader exams={courseData.exams} />
      <PDFView examDetail={examDetail} />
    </div>
  );
};

export default TentaPage;
