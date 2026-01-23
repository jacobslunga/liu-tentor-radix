import { Outlet, useLocation, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useTextSize } from "@/context/TextSizeContext";
import { LockInModeManager } from "@/lib/lockInMode";
import Footer from "@/components/Footer";

const MainLayout: React.FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { textSize } = useTextSize();
  const [isExamMode, setIsExamMode] = useState(false);

  const isStandardExamPage = /^\/search\/[A-Z0-9]+\/[0-9]+$/.test(pathname);

  useEffect(() => {
    const root = document.documentElement;

    if (textSize === "stor") {
      root.style.fontSize = "115%";
    } else if (textSize === "liten") {
      root.style.fontSize = "87.5%";
    } else {
      root.style.removeProperty("font-size");
    }

    const storageKey = "liutentor_anonymous_id";
    const existingId = localStorage.getItem(storageKey);

    if (!existingId) {
      const newId = crypto.randomUUID();
      localStorage.setItem(storageKey, newId);
    }
  }, [textSize]);

  useEffect(() => {
    const checkSession = () => {
      const activeSession = LockInModeManager.initializeExamMode();

      const lockInModePattern = /^\/lock-in-mode\/.+$/;
      const isLockInRoute = lockInModePattern.test(pathname);

      if (activeSession) {
        if (!isLockInRoute) {
          navigate(`/lock-in-mode/${activeSession.examId}`, { replace: true });
          return;
        }
        setIsExamMode(true);
      } else {
        if (isLockInRoute) {
          navigate("/", { replace: true });
          return;
        }
        setIsExamMode(false);
      }

      LockInModeManager.cleanupHistory();
    };

    checkSession();

    const handleVisibilityChange = () => {
      if (!document.hidden) checkSession();
    };
    const handleFocus = () => checkSession();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "examMode") {
        checkSession();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [pathname, navigate]);

  useEffect(() => {
    if (!isExamMode) return;

    const updateActivity = () => {
      LockInModeManager.updateActivity();
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
    <div className="flex flex-col max-w-full min-h-screen bg-background">
      <main className="grow">
        <Outlet />
      </main>
      {!isStandardExamPage && !isExamMode && <Footer />}
    </div>
  );
};

export default MainLayout;
