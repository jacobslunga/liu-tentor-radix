import { useLanguage } from "@/context/LanguageContext";
import translations from "@/util/translations";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowTopRightIcon } from "@radix-ui/react-icons";
import { Separator } from "@/components/ui/separator";

interface RecentActivity {
  courseCode: string;
  courseName: string;
  path: string;
  timestamp: number;
}

const InlineRecentActivity = () => {
  const { language } = useLanguage();
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>(
    []
  );
  const [maxVisible, setMaxVisible] = useState(3);

  const COOKIE_NAME = "recentActivities_v3";
  const COOKIE_VERSION = "1.2";

  useEffect(() => {
    const updateVisible = () => {
      const width = window.innerWidth;
      if (width >= 1024) setMaxVisible(6); // lg
      else if (width >= 768) setMaxVisible(5); // md
      else setMaxVisible(4); // sm
    };

    updateVisible();
    window.addEventListener("resize", updateVisible);
    return () => window.removeEventListener("resize", updateVisible);
  }, []);

  useEffect(() => {
    const cookieConsent = Cookies.get("cookieConsent");
    if (cookieConsent !== "true") return;

    const storedVersion = Cookies.get("cookieVersion");
    if (storedVersion !== COOKIE_VERSION) {
      Cookies.remove(COOKIE_NAME);
      Cookies.set("cookieVersion", COOKIE_VERSION, { expires: 365 });
    }

    const cookie = Cookies.get(COOKIE_NAME);
    if (cookie) {
      try {
        const parsed = JSON.parse(
          decodeURIComponent(cookie)
        ) as RecentActivity[];
        const sorted = parsed.sort((a, b) => b.timestamp - a.timestamp);
        setRecentActivities(sorted.slice(0, 6));
      } catch (e) {
        console.error("Failed to parse recent activity:", e);
      }
    }
  }, []);

  const getTranslation = (key: keyof (typeof translations)[typeof language]) =>
    translations[language][key];

  const visibleActivities = recentActivities.slice(0, maxVisible);

  if (visibleActivities.length === 0) return null;

  return (
    <div className="flex flex-col w-full items-center justify-center p-5 bg-foreground/[3%] border rounded-md">
      <div className="flex flex-col items-start justify-start w-full">
        <p className="text-sm font-medium text-foreground/80">
          {getTranslation("continueWhereYouLeftOff")}
        </p>
        <p className="text-xs text-muted-foreground">
          {getTranslation("recentActivityDescription") ??
            "Snabb åtkomst till dina senaste sökningar."}
        </p>
      </div>

      <Separator className="my-4" />

      <div className="flex items-center justify-start w-full space-x-4 overflow-x-auto">
        {visibleActivities.map((activity, index) => (
          <div key={activity.path} className="flex items-center space-x-4">
            <Link
              to={activity.path}
              className="flex flex-col group rounded-md transition-colors text-xs"
            >
              <div className="flex items-center">
                <span className="font-medium text-foreground/70 group-hover:text-foreground transition-colors duration-200">
                  {activity.courseCode}
                </span>
                <ArrowTopRightIcon className="w-3 h-3 ml-1 opacity-50 group-hover:opacity-100 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all duration-200" />
              </div>
            </Link>

            {index < visibleActivities.length - 1 && (
              <Separator orientation="vertical" className="h-5" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default InlineRecentActivity;
