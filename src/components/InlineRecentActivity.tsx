import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowTopRightIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";

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
      <div className="flex items-center justify-center w-full overflow-x-auto space-x-3 text-sm">
        {visibleActivities.map((activity, index) => (
          <Link key={activity.path} to={activity.path}>
            <Button variant="ghost" size="sm" className="group">
              <span className="text-foreground/80 hover:text-foreground transition-colors">
                {activity.courseCode}
              </span>
              <ArrowTopRightIcon className="w-3 h-3 opacity-60 group-hover:opacity-100 group-hover:-translate-y-[2px] group-hover:translate-x-1 transition-all duration-200" />
            </Button>
            {index < visibleActivities.length - 1 && (
              <span className="mx-2 text-foreground/40">|</span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default InlineRecentActivity;
