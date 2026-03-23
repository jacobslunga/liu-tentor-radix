import { useEffect, useState } from "react";

import { ArrowUpRightIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import {
  readRecentActivities,
  type RecentActivity,
} from "@/lib/recentActivities";

const MAX_RECENT_ACTIVITIES = 4;
const INLINE_VISIBLE_ACTIVITIES = 3;

const InlineRecentActivity = () => {
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>(
    [],
  );

  const COOKIE_NAME = "recentActivities_v3";
  const COOKIE_VERSION = "1.3";

  useEffect(() => {
    const storedVersion = Cookies.get("cookieVersion");
    if (storedVersion !== COOKIE_VERSION) {
      Cookies.remove(COOKIE_NAME);
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(COOKIE_NAME);
      }
      Cookies.set("cookieVersion", COOKIE_VERSION, { expires: 365 });
    }

    const parsed = readRecentActivities(COOKIE_NAME, MAX_RECENT_ACTIVITIES);
    setRecentActivities(parsed.slice(0, MAX_RECENT_ACTIVITIES));
  }, []);

  const visibleActivities = recentActivities.slice(
    0,
    INLINE_VISIBLE_ACTIVITIES,
  );

  if (visibleActivities.length === 0) return null;

  return (
    <div className="w-full max-w-md">
      <div className="flex items-center justify-center w-full overflow-x-auto space-x-3 text-sm">
        {visibleActivities.map((activity, index) => (
          <Link key={activity.path} to={activity.path} viewTransition>
            <Button variant="ghost" size="sm" className="group">
              {activity.courseCode}
              <ArrowUpRightIcon
                weight="bold"
                className="opacity-60 group-hover:opacity-100 group-hover:-translate-y-0.5 group-hover:translate-x-1 transition-all duration-200"
              />
            </Button>
            {index < visibleActivities.length - 1 && (
              <span className="mx-2 text-foreground/20">|</span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default InlineRecentActivity;
