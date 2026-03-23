import Cookies from "js-cookie";

export interface RecentActivity {
  courseCode: string;
  courseName: string;
  path: string;
  timestamp: number;
}

const DEFAULT_COOKIE_KEY = "recentActivities_v3";

const safeDecode = (value: string): string => {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

const parseRecentActivities = (raw: string): RecentActivity[] => {
  const candidates = [raw, safeDecode(raw)];

  for (const candidate of candidates) {
    try {
      const parsed = JSON.parse(candidate);
      if (Array.isArray(parsed)) return parsed as RecentActivity[];
    } catch {
      // Keep trying fallbacks.
    }

    try {
      const wrapped = candidate.trim();
      if (wrapped.startsWith("{") && wrapped.includes("},{")) {
        const parsed = JSON.parse(`[${wrapped}]`);
        if (Array.isArray(parsed)) return parsed as RecentActivity[];
      }
    } catch {
      // Ignore malformed fallback format.
    }
  }

  return [];
};

const normalizeRecentActivities = (
  activities: RecentActivity[],
  maxEntries: number,
): RecentActivity[] => {
  const seen = new Set<string>();

  return activities
    .filter((item) => typeof item?.courseCode === "string")
    .map((item) => {
      const normalizedCode = item.courseCode.toUpperCase().trim();
      const normalizedPath =
        typeof item.path === "string" && item.path.length > 0
          ? item.path
          : `/search/${normalizedCode}`;
      return {
        courseCode: normalizedCode,
        courseName: item.courseName || normalizedCode,
        path: normalizedPath,
        timestamp:
          typeof item.timestamp === "number" && Number.isFinite(item.timestamp)
            ? item.timestamp
            : Date.now(),
      };
    })
    .sort((a, b) => b.timestamp - a.timestamp)
    .filter((item) => {
      if (!item.courseCode || seen.has(item.courseCode)) return false;
      seen.add(item.courseCode);
      return true;
    })
    .slice(0, maxEntries);
};

export const readRecentActivities = (
  cookieKey = DEFAULT_COOKIE_KEY,
  maxEntries = 4,
): RecentActivity[] => {
  const cookieRaw = Cookies.get(cookieKey);
  const parsedFromCookie = cookieRaw ? parseRecentActivities(cookieRaw) : [];
  const normalizedFromCookie = normalizeRecentActivities(
    parsedFromCookie,
    maxEntries,
  );

  if (cookieRaw && normalizedFromCookie.length > 0) {
    Cookies.set(
      cookieKey,
      encodeURIComponent(JSON.stringify(normalizedFromCookie)),
      {
        expires: 365,
      },
    );
  } else if (cookieRaw) {
    Cookies.remove(cookieKey);
  }

  if (typeof window !== "undefined") {
    const localRaw = window.localStorage.getItem(cookieKey);
    if (localRaw) {
      const parsedFromLocal = parseRecentActivities(localRaw);
      const normalizedFromLocal = normalizeRecentActivities(
        parsedFromLocal,
        maxEntries,
      );

      if (normalizedFromLocal.length > 0) {
        window.localStorage.setItem(
          cookieKey,
          JSON.stringify(normalizedFromLocal),
        );
      } else {
        window.localStorage.removeItem(cookieKey);
      }
    }
  }

  return normalizedFromCookie;
};

export const writeRecentActivities = (
  activities: RecentActivity[],
  {
    cookieKey = DEFAULT_COOKIE_KEY,
    maxEntries = 4,
    cookieOptions,
  }: {
    cookieKey?: string;
    maxEntries?: number;
    cookieOptions?: Cookies.CookieAttributes;
  } = {},
): RecentActivity[] => {
  const normalized = normalizeRecentActivities(activities, maxEntries);

  Cookies.set(cookieKey, encodeURIComponent(JSON.stringify(normalized)), {
    expires: 365,
    ...cookieOptions,
  });

  if (typeof window !== "undefined") {
    window.localStorage.setItem(cookieKey, JSON.stringify(normalized));
  }

  return normalized;
};
