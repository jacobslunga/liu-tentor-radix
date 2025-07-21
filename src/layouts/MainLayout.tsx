import CookieBanner from "@/components/CookieBanner";
import Footer from "@/components/Footer";
import GlobalCourseSearch from "@/components/GlobalCourseSearch";
import LockInModeOverlay from "@/components/LockInModeOverlay";
import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { ShowGlobalSearchContext } from "@/context/ShowGlobalSearchContext";
import { ExamModeManager } from "@/lib/examMode";

const MainLayout: React.FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [isExam, setIsExam] = useState(false);
  const [isCustomPage, setIsCustomPage] = useState(false);
  const [isExamMode, setIsExamMode] = useState(false);
  const { setShowGlobalSearch, showGlobalSearch } = useContext(
    ShowGlobalSearchContext
  );

  // Check for active exam sessions and handle redirects
  useEffect(() => {
    const checkSession = () => {
      const activeSession = ExamModeManager.initializeExamMode();

      if (activeSession) {
        // There's an active exam session
        const examModePattern = /^\/exam-mode\/[0-9]+$/;

        // Set body background to black for exam mode
        document.body.style.backgroundColor = "black";

        // If not already on exam mode page, redirect to it
        if (!examModePattern.test(pathname)) {
          navigate(`/exam-mode/${activeSession.examId}`, { replace: true });
          return;
        }

        setIsExamMode(true);
      } else {
        // No active session - restore normal background
        document.body.style.backgroundColor = "";

        const examModePattern = /^\/exam-mode\/[0-9]+$/;

        // If trying to access exam mode without session, redirect to home
        if (examModePattern.test(pathname)) {
          navigate("/", { replace: true });
          return;
        }

        setIsExamMode(false);
      }

      // Clean up old history entries periodically
      ExamModeManager.cleanupHistory();
    };

    // Check immediately
    checkSession();

    // Handle when tab becomes visible (for new tabs or tab switching)
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

  // Listen for storage changes from other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "examMode") {
        if (e.newValue) {
          // Another tab started an exam session
          const newSession = JSON.parse(e.newValue);
          navigate(`/exam-mode/${newSession.examId}`, { replace: true });
        } else {
          // Exam session ended in another tab
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

  // Update activity on user interaction (only in exam mode)
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

  useEffect(() => {
    const examPattern = /^\/search\/[A-Z0-9]+\/[0-9]+$/;
    setIsExam(examPattern.test(pathname));

    // Check if current page uses CustomPagesLayout
    const customPagePaths = [
      "/faq",
      "/om-oss",
      "/feedback",
      "/privacy-policy",
      "/upload-info",
    ];
    setIsCustomPage(customPagePaths.some((path) => pathname.startsWith(path)));
  }, [pathname]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer - hide in exam mode and custom pages */}
      {!isExam && !isCustomPage && !isExamMode && (
        <div className="mt-auto">
          <Footer />
        </div>
      )}

      {/* Cookie Banner - hide in exam mode */}
      {!isExamMode && <CookieBanner />}

      {/* Lock-in Mode Overlay - show only when not in exam mode */}
      {!isExamMode && <LockInModeOverlay />}

      {/* Global Search Overlay - hide in exam mode */}
      {!isExamMode && (
        <GlobalCourseSearch
          open={showGlobalSearch}
          setOpen={setShowGlobalSearch}
        />
      )}
    </div>
  );
};

export default MainLayout;
