import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRightIcon } from "@primer/octicons-react";

interface RecentActivity {
  courseCode: string;
  courseName: string;
  path: string;
  timestamp: number;
}

const InlineRecentActivity = () => {
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
        setRecentActivities(sorted.slice(0, 3));
      } catch (e) {
        console.error("Failed to parse recent activity:", e);
      }
    }
  }, []);

  const visibleActivities = recentActivities.slice(0, maxVisible);

  if (visibleActivities.length === 0) return null;

  return (
    <div className="w-full max-w-md">
      {/* Simple background container */}
      <div className="bg-muted/10 rounded-2xl px-4 py-3">
        <div className="flex items-center justify-center w-full overflow-x-auto gap-3">
          {visibleActivities.map((activity, index) => (
            <div key={activity.path} className="flex items-center">
              <Link to={activity.path} className="group">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background/50 hover:bg-background transition-colors">
                  <span className="text-sm font-medium text-foreground/80 group-hover:text-foreground transition-colors">
                    {activity.courseCode}
                  </span>
                  <ArrowUpRightIcon className="w-3 h-3 opacity-60 group-hover:opacity-100 group-hover:-translate-y-[1px] group-hover:translate-x-[1px] transition-all duration-200" />
                </div>
              </Link>

              {index < visibleActivities.length - 1 && (
                <div className="w-1 h-1 rounded-full bg-muted-foreground/20 mx-2" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InlineRecentActivity;
