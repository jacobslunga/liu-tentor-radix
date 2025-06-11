import { useLanguage } from "@/context/LanguageContext";
import translations from "@/util/translations";
import Cookies from "js-cookie";
import { ClockIcon, BookIcon, SearchIcon } from "@primer/octicons-react";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

interface RecentActivity {
  courseCode: string;
  courseName: string;
  path: string;
  timestamp: number;
}

interface GlobalCourseSearchProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const COOKIE_NAME = "recentActivities_v3";
const COOKIE_VERSION = "1.2";
const CACHE_KEY = "cachedCourseCodes";
const CACHE_EXPIRY_KEY = "cacheExpiry";
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// Debounce hook
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const GlobalCourseSearch: React.FC<GlobalCourseSearchProps> = ({
  open,
  setOpen,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [courseCodes, setCourseCodes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { language } = useLanguage();

  // Debounce search term for better performance
  const debouncedSearchTerm = useDebounce(searchTerm, 150);

  const getTranslation = (key: keyof (typeof translations)[typeof language]) =>
    translations[language][key];

  // Enhanced cache checking with expiry
  const isCacheValid = useCallback(() => {
    const cached = localStorage.getItem(CACHE_KEY);
    const expiry = localStorage.getItem(CACHE_EXPIRY_KEY);

    if (!cached || !expiry) return false;

    const now = Date.now();
    const expiryTime = parseInt(expiry);

    return now < expiryTime;
  }, []);

  // Load course codes with better error handling and caching
  const loadCourseCodes = useCallback(async () => {
    if (isCacheValid()) {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        setCourseCodes(JSON.parse(cached));
        return;
      }
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/courseCodes.json");
      if (!res.ok) throw new Error("Failed to fetch course codes");

      const data: string[] = await res.json();
      setCourseCodes(data);

      // Cache with expiry
      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
      localStorage.setItem(
        CACHE_EXPIRY_KEY,
        (Date.now() + CACHE_DURATION).toString()
      );
    } catch (err) {
      console.error("Error fetching course codes:", err);
      setError("Failed to load course codes");
    } finally {
      setIsLoading(false);
    }
  }, [isCacheValid]);

  // Load course codes when dialog opens
  useEffect(() => {
    if (open && courseCodes.length === 0) {
      loadCourseCodes();
    }
  }, [open, loadCourseCodes, courseCodes.length]);

  useEffect(() => {
    if (open) {
      const cookieConsent = Cookies.get("cookieConsent");
      if (cookieConsent !== "true") return;

      const storedVersion = Cookies.get("cookieVersion");
      if (storedVersion !== COOKIE_VERSION) {
        Cookies.remove("popularSearches");
        Cookies.remove("recentActivities");
        Cookies.remove(COOKIE_NAME);
        Cookies.set("cookieVersion", COOKIE_VERSION, { expires: 365 });
      }

      const searches = Cookies.get(COOKIE_NAME);
      if (searches) {
        try {
          const parsedSearches = JSON.parse(decodeURIComponent(searches));
          const uniqueCourses = Array.from(
            new Set(
              parsedSearches.map((item: { courseCode: string }) =>
                item.courseCode.toUpperCase()
              )
            )
          ).slice(0, 8); // Increased from 4 to 8 for better UX
          setRecentSearches(uniqueCourses as string[]);
        } catch (error) {
          console.error("Failed to parse recent searches:", error);
        }
      }
    }
  }, [open]);

  // Keyboard shortcut (Cmd+K/Ctrl+K)
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchTerm("");
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [setOpen]);

  const updateSearchCount = (course: string) => {
    const cookieConsent = Cookies.get("cookieConsent");
    if (cookieConsent !== "true") return;

    const searches = Cookies.get(COOKIE_NAME);
    let searchesArray: RecentActivity[] = [];

    try {
      searchesArray = searches ? JSON.parse(decodeURIComponent(searches)) : [];
    } catch (error) {
      console.error("Failed to parse recent activities cookie", error);
    }

    const existingIndex = searchesArray.findIndex(
      (item) => item.courseCode === course
    );

    if (existingIndex !== -1) {
      searchesArray[existingIndex].timestamp = Date.now();
    } else {
      searchesArray.push({
        courseCode: course,
        courseName: course,
        path: `/search/${course}`,
        timestamp: Date.now(),
      });
    }

    searchesArray.sort((a, b) => b.timestamp - a.timestamp);

    Cookies.set(COOKIE_NAME, JSON.stringify(searchesArray), {
      expires: 365,
      domain:
        window.location.hostname === "liutentor.se"
          ? ".liutentor.se"
          : undefined,
      sameSite: "Lax",
    });
  };

  const handleSelect = useCallback(
    (course: string) => {
      updateSearchCount(course);
      setOpen(false);
      setSearchTerm(""); // Clear search term when closing
      navigate(`/search/${course}`);
    },
    [navigate, setOpen]
  );

  // Optimized filtering with debounced search
  const filteredRecentSearches = useMemo(() => {
    if (!debouncedSearchTerm) return recentSearches;
    return recentSearches.filter((course) =>
      course.toUpperCase().includes(debouncedSearchTerm.toUpperCase())
    );
  }, [debouncedSearchTerm, recentSearches]);

  const filteredCourses = useMemo(() => {
    if (!debouncedSearchTerm) return courseCodes.slice(0, 50); // Show first 50 when no search

    return courseCodes
      .filter((course) =>
        course.toUpperCase().includes(debouncedSearchTerm.toUpperCase())
      )
      .filter((course) => !recentSearches.includes(course))
      .slice(0, 50); // Reduced from 100 to 50 for better performance
  }, [debouncedSearchTerm, recentSearches, courseCodes]);

  return (
    <CommandDialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) {
          setSearchTerm("");
        }
      }}
    >
      <div className="relative">
        <CommandInput
          placeholder={getTranslation("courseCodePlaceholder")}
          value={searchTerm}
          onValueChange={setSearchTerm}
        />
      </div>

      <CommandList className="max-h-[300px]">
        {/* Loading state */}
        {isLoading && (
          <div className="flex items-center justify-center py-6">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span className="ml-2 text-sm text-muted-foreground">
              {language === "sv"
                ? "Laddar kurskoder..."
                : "Loading course codes..."}
            </span>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="flex items-center justify-center py-6">
            <div className="text-center">
              <p className="text-sm text-destructive mb-2">{error}</p>
              <button
                onClick={loadCourseCodes}
                className="text-xs text-primary hover:underline"
              >
                {language === "sv" ? "Försök igen" : "Try again"}
              </button>
            </div>
          </div>
        )}

        {/* Empty state with better messaging */}
        {!isLoading && !error && (
          <CommandEmpty>
            <div className="text-center py-6">
              <SearchIcon className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                {debouncedSearchTerm
                  ? getTranslation("noResultsFound")
                  : language === "sv"
                  ? "Börja skriva för att söka kurser"
                  : "Start typing to search courses"}
              </p>
            </div>
          </CommandEmpty>
        )}

        {/* Recent searches with enhanced design */}
        {!isLoading && !error && filteredRecentSearches.length > 0 && (
          <>
            <CommandGroup
              heading={
                <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <ClockIcon className="h-3 w-3" />
                  {getTranslation("recentSearches")}
                </div>
              }
            >
              {filteredRecentSearches.map((course) => (
                <CommandItem
                  key={course}
                  value={course}
                  onSelect={() => handleSelect(course)}
                  className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-primary/10 rounded-lg mx-2 my-1 transition-colors"
                >
                  <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full">
                    <ClockIcon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <span className="font-semibold text-foreground">
                      {course}
                    </span>
                    <p className="text-xs text-muted-foreground">
                      {language === "sv" ? "Senast besökt" : "Recently visited"}
                    </p>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator className="mx-4" />
          </>
        )}

        {/* All courses with enhanced design */}
        {!isLoading && !error && filteredCourses.length > 0 && (
          <CommandGroup
            heading={
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <BookIcon className="h-3 w-3" />
                {getTranslation("allCourses")}
                {debouncedSearchTerm && (
                  <span className="text-primary">
                    ({filteredCourses.length}{" "}
                    {language === "sv" ? "träffar" : "matches"})
                  </span>
                )}
              </div>
            }
          >
            {filteredCourses.map((course) => (
              <CommandItem
                key={course}
                value={course}
                onSelect={() => handleSelect(course)}
                className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-muted/50 rounded-lg mx-2 my-1 transition-colors"
              >
                <div className="flex items-center justify-center w-8 h-8 bg-muted/30 rounded-full">
                  <BookIcon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <span className="font-medium text-foreground">{course}</span>
                  <p className="text-xs text-muted-foreground">
                    {language === "sv" ? "Kurskod" : "Course code"}
                  </p>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
};

export default GlobalCourseSearch;
