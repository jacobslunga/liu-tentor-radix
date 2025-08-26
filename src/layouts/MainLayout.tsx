import { Outlet, useLocation, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";

import CookieBanner from "@/components/banners/CookieBanner";
import { ExamModeManager } from "@/lib/examMode";
import Footer from "@/components/Footer";
import SystemUpdateBanner from "@/components/banners/SystemUpdatebanner";

const MainLayout: React.FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [isExamMode, setIsExamMode] = useState(false);

  const customPagePaths = [
    "/faq",
    "/om-oss",
    "/feedback",
    "/privacy-policy",
    "/upload-exams",
  ];

  const isExamPage = /^\/search\/[A-Z0-9]+\/[0-9]+$/.test(pathname);
  const isCustomPage = customPagePaths.some((path) =>
    pathname.startsWith(path)
  );

  useEffect(() => {
    const checkSession = () => {
      const activeSession = ExamModeManager.initializeExamMode();

      if (activeSession) {
        const examModePattern = /^\/exam-mode\/[0-9]+$/;

        if (!examModePattern.test(pathname)) {
          navigate(`/exam-mode/${activeSession.examId}`, { replace: true });
          return;
        }

        setIsExamMode(true);
      } else {
        const examModePattern = /^\/exam-mode\/[0-9]+$/;

        if (examModePattern.test(pathname)) {
          navigate("/", { replace: true });
          return;
        }

        setIsExamMode(false);
      }

      ExamModeManager.cleanupHistory();
    };

    checkSession();

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        checkSession();
      }
    };

    const handleFocus = () => {
      checkSession();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, [pathname, navigate]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "examMode") {
        if (e.newValue) {
          const newSession = JSON.parse(e.newValue);
          navigate(`/exam-mode/${newSession.examId}`, { replace: true });
        } else {
          const examModePattern = /^\/exam-mode\/[0-9]+$/;
          if (examModePattern.test(pathname)) {
            navigate("/", { replace: true });
          }
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [navigate, pathname]);

  useEffect(() => {
    if (!isExamMode) return;

    const updateActivity = () => {
      ExamModeManager.updateActivity();
    };

    const events = ["mousedown", "keydown", "scroll", "touchstart"];
    events.forEach((event) => {
      document.addEventListener(event, updateActivity, { passive: true });
    });

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, updateActivity);
      });
    };
  }, [isExamMode]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="grow">
        <Outlet />
      </main>

      {!isExamPage && !isCustomPage && !isExamMode && (
        <div className="mt-auto">
          <Footer />
        </div>
      )}

      {!isExamMode && <SystemUpdateBanner />}
      {!isExamMode && <CookieBanner />}
    </div>
  );
};

export default MainLayout;
