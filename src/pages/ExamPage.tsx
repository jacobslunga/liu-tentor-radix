import { FC, useEffect, useCallback } from "react";

import { Button } from "@/components/ui/button";
import ChatWindow from "@/components/AI/chat/ChatWindow";
import ExamOnlyView from "@/components/PDF/Views/ExamOnlyView";
import ExamWithFacitView from "@/components/PDF/Views/ExamWithFacitView";
import { Loader2 } from "lucide-react";
import MobilePdfView from "@/components/PDF/Views/MobilePdfView";
import { formatExamDate } from "@/util/formatExamDate";
import { useCourseExams, useExamDetail } from "@/api";
import useLayoutMode from "@/stores/LayoutModeStore";
import { useMetadata } from "@/hooks/useMetadata";
import { useParams } from "react-router-dom";
import { useHotkeys } from "react-hotkeys-hook";
import { useChatWindow } from "@/context/ChatWindowContext";
import { ChatProvider } from "@/context/ChatContext";
import { ExamSidebar } from "@/components/ExamSidebar";

const ExamPage: FC = () => {
  const { layoutMode } = useLayoutMode();
  const { showChatWindow, setShowChatWindow } = useChatWindow();

  const { courseCode = "", examId = "" } = useParams<{
    courseCode: string;
    examId: string;
  }>();

  const handleCloseChat = () => {
    setShowChatWindow(false);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    setShowChatWindow(false);
  }, [examId, setShowChatWindow]);

  const handleToggleChat = useCallback(() => {
    setShowChatWindow((prev) => !prev);
  }, [setShowChatWindow]);

  useHotkeys(
    "mod+c",
    (e) => {
      e.preventDefault();
      handleToggleChat();
    },
    { preventDefault: true, enableOnFormTags: true },
    [handleToggleChat],
  );

  const {
    courseData,
    isLoading: examsLoading,
    isError: examsError,
  } = useCourseExams(courseCode);

  const {
    examDetail,
    isLoading: detailLoading,
    isError: detailError,
  } = useExamDetail(Number(examId));

  const pageTitle =
    examDetail && courseData
      ? `${courseCode} - Tenta ${formatExamDate(examDetail.exam.exam_date)} | ${
          courseData.courseName
        }`
      : `${courseCode} - Tenta ${examId}`;

  const pageDescription =
    examDetail && courseData
      ? `Se tenta för ${courseCode} från ${formatExamDate(
          examDetail.exam.exam_date,
        )} - ${courseData.courseName}`
      : `Tenta för ${courseCode}`;

  useMetadata({
    title: pageTitle,
    description: pageDescription,
    keywords: `${courseCode}, tenta, Linköpings Universitet, kurs, LiU, liu, Liu ${
      courseData?.courseName || ""
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
    <div className="flex h-screen flex-col lg:flex-row items-center justify-center w-screen overflow-hidden bg-background">
      <ChatProvider examDetail={examDetail}>
        {/* Sidebar */}
        <div className="hidden lg:block h-full z-50">
          <ExamSidebar
            exams={courseData.exams}
            showChat={showChatWindow}
            onToggleChat={handleToggleChat}
          />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 w-full h-full relative overflow-hidden hidden lg:block">
          {showChatWindow ? (
            <ChatWindow
              examDetail={examDetail}
              isOpen={true}
              onClose={handleCloseChat}
              variant="fullscreen"
            />
          ) : (
            <div className="w-full h-full relative">
              {layoutMode === "exam-only" ? (
                <ExamOnlyView examDetail={examDetail} />
              ) : (
                <ExamWithFacitView examDetail={examDetail} />
              )}
            </div>
          )}
        </div>

        {/* Mobile View */}
        <MobilePdfView examDetail={examDetail} />
      </ChatProvider>
    </div>
  );
};

export default ExamPage;

const LoadingState = () => {
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center gap-2">
      <Loader2 className="w-10 h-10 animate-spin" />
      <p className="font-normal text-foreground/70">Laddar tenta...</p>
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
