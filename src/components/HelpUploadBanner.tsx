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
                  rounded-bl-xl rounded-br-xl shadow-lg
                  ${
                    animateExit // If exit animation is active, slide up and fade out
                      ? "-translate-y-full opacity-0"
                      : animateEnter // If enter animation is active, slide down and fade in
                      ? "translate-y-0 opacity-100"
                      : "-translate-y-full opacity-0" // Initial state before enter animation
                  }`}
    >
      <div className="relative py-3 px-4 bg-primary text-primary-foreground">
        {/* Subtle background circles for visual interest */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div
            className="absolute top-0 right-0 w-24 h-24 rounded-full transform translate-x-1/2 -translate-y-1/2"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
          ></div>
          <div
            className="absolute bottom-0 left-0 w-20 h-20 rounded-full transform -translate-x-1/2 translate-y-1/2"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.08)" }}
          ></div>
        </div>

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
                🤓 Har du tentor som saknas?
              </span>
              <br className="sm:hidden" /> Varje bidrag hjälper andra studenter!
              ✨
            </p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {/* CTA: Upload Now */}
            <Link to="/upload-exams">
              <Button
                variant="outline"
                size="sm"
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 transition-all duration-200"
              >
                Ladda upp nu
                <UploadIcon className="w-3 h-3" />
              </Button>
            </Link>

            {/* CTA: Read More */}
            <Link to="/upload-info">
              <Button
                variant="ghost"
                size="sm"
                className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground transition-colors duration-200"
              >
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
