import { Button } from "@/components/ui/button";
import { ArrowRightIcon, UploadIcon, X } from "lucide-react";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { Link } from "react-router-dom"; // Import Link for navigation

export default function HelpUploadBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const [animateEnter, setAnimateEnter] = useState(false);
  const [animateExit, setAnimateExit] = useState(false); // New state for exit animation

  useEffect(() => {
    // Check if the banner has been hidden by the user
    const bannerHidden = Cookies.get("hideHelpUploadBanner");
    if (bannerHidden === "true") {
      setIsVisible(false);
      return; // Exit early if already hidden
    }

    // Trigger enter animation after a short delay
    const enterTimer = setTimeout(() => setAnimateEnter(true), 100);
    return () => clearTimeout(enterTimer);
  }, []);

  const handleClose = () => {
    setAnimateExit(true); // Trigger exit animation
    // After the animation duration, hide the component and set the cookie
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
      Cookies.set("hideHelpUploadBanner", "true", { expires: 365 });
    }, 500); // Duration matches the transition-all duration (500ms)
    return () => clearTimeout(hideTimer);
  };

  if (!isVisible) return null;

  return (
    <div
      className={`absolute top-0 left-0 right-0 z-30
                  overflow-hidden transition-all duration-500
                  shadow-lg dark:shadow-2xl
                  ${
                    animateExit // If exit animation is active, slide up and fade out
                      ? "-translate-y-full opacity-0"
                      : animateEnter // If enter animation is active, slide down and fade in
                      ? "translate-y-0 opacity-100"
                      : "-translate-y-full opacity-0" // Initial state before enter animation
                  }`}
    >
      <div className="relative py-3 px-4 bg-secondary text-secondary-foreground">
        <div className="relative max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
          <div className="flex items-center gap-3 flex-1">
            <div
              className="p-1.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: "rgba(255, 255, 255, 0.15)" }}
            >
              <UploadIcon className="w-4 h-4" />
            </div>

            <p className="text-center sm:text-left leading-tight">
              <span className="font-semibold">
                📚 Har du tentor som saknas?
              </span>
              <br className="sm:hidden" /> Varje bidrag hjälper andra studenter!
              ✨
            </p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {/* CTA: Upload Now */}
            <Link to="/upload-exams">
              <Button size="sm">
                Ladda upp nu
                <UploadIcon className="w-3 h-3" />
              </Button>
            </Link>

            {/* CTA: Read More */}
            <Link to="/upload-info">
              <Button variant="outline" size="sm">
                Läs mer
                <ArrowRightIcon className="w-3 h-3" />
              </Button>
            </Link>

            {/* Close button */}
            <button
              onClick={handleClose}
              className="p-1 rounded-full transition-colors opacity-80 hover:opacity-100 hover:bg-primary-foreground/10"
              aria-label="Stäng banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
