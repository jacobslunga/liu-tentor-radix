import { AlertTriangle, X } from "lucide-react";
import { useEffect, useState } from "react";

import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";

export default function SystemUpdateBanner() {
  const { language } = useLanguage();

  const [isVisible, setIsVisible] = useState(false);
  const [animateEnter, setAnimateEnter] = useState(false);
  const [animateExit, setAnimateExit] = useState(false);

  useEffect(() => {
    const bannerHidden = Cookies.get("hideSystemUpdateBanner");
    if (bannerHidden === "true") {
      return;
    }

    setIsVisible(true);
    const enterTimer = setTimeout(() => {
      setAnimateEnter(true);
    }, 100);

    return () => clearTimeout(enterTimer);
  }, []);

  const handleClose = () => {
    setAnimateExit(true);

    setIsVisible(false);
    Cookies.set("hideSystemUpdateBanner", "true", { expires: 365 });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50
                  overflow-hidden transition-all duration-500 ease-in-out
                  border-b border-gray-200 dark:border-gray-950
                  ${
                    animateExit
                      ? "-translate-y-full opacity-0"
                      : animateEnter
                      ? "translate-y-0 opacity-100"
                      : "-translate-y-full opacity-0"
                  }`}
    >
      <div className="relative py-3 px-4 bg-secondary">
        <div className="relative max-w-6xl mx-auto flex items-center justify-between gap-4 text-sm">
          {/* Icon and Text Container */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="p-1.5 rounded-full shrink-0 bg-muted">
              <AlertTriangle className="w-5 h-5 text-foreground/60" />
            </div>

            <p className="text-center sm:text-left leading-tight font-normal">
              {language === "sv" ? (
                <span>
                  Vi har uppdaterat våra system. Viss kurs- och tentamensdata
                  kan vara felaktig.{" "}
                  <span className="font-medium">
                    Kontakta oss gärna{" "}
                    <Link
                      onClick={handleClose}
                      to="/feedback"
                      className="underline"
                    >
                      här
                    </Link>{" "}
                    om du upptäcker några problem.
                  </span>
                </span>
              ) : (
                <span>
                  We've updated our systems. Some course and exam data may be
                  incorrect.{" "}
                  <span className="font-medium">
                    Please contact us{" "}
                    <a href="/feedback" className="underline">
                      here
                    </a>{" "}
                    if you notice any issues.
                  </span>
                </span>
              )}
            </p>
          </div>

          {/* Close Button */}
          <div className="shrink-0">
            <button
              onClick={handleClose}
              className="p-1.5 rounded-full transition-colors text-gray-700 hover:text-gray-900 hover:bg-black/5 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-white/10"
              aria-label="Stäng notis / Close notification"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
