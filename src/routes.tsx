import FAQPage from "@/pages/FaqPage";
import FeedbackPage from "@/pages/FeedbackPage";
import HomePage from "@/pages/HomePage";
import InfoPageLayout from "@/layouts/InfoPageLayout";
import MainLayout from "@/layouts/MainLayout";
import NotFoundPage from "@/pages/NotFoundPage";
import OmOss from "@/pages/AboutUs";
import PrivacyPolicyPage from "@/pages/PrivacyPolicyPage";
import { RouteObject } from "react-router-dom";
import SearchLayout from "@/layouts/SearchLayout";
import StatsSearchPage from "@/pages/StatsSearchPage";
import TentaPage from "@/pages/ExamPage";
import TentaSearchPage from "@/pages/ExamSearchPage";
import UploadExamPage from "@/pages/UploadExamPage";
import UpdatesPage from "@/pages/UpdatesPage";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "*", element: <NotFoundPage /> },
      {
        path: "search",
        element: <SearchLayout />,
        children: [
          { path: ":courseCode", element: <TentaSearchPage /> },
          { path: ":courseCode/stats", element: <StatsSearchPage /> },
          { path: ":courseCode/:examId", element: <TentaPage /> },
        ],
      },
      {
        element: <InfoPageLayout />,
        children: [
          { path: "updates", element: <UpdatesPage /> },
          { path: "feedback", element: <FeedbackPage /> },
          { path: "privacy-policy", element: <PrivacyPolicyPage /> },
          { path: "upload-exams", element: <UploadExamPage /> },
          { path: "faq", element: <FAQPage /> },
          { path: "om-oss", element: <OmOss /> },
        ],
      },
    ],
  },
];

export default routes;
