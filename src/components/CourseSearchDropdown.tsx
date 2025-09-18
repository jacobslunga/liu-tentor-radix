import { ClockFillIcon, SearchIcon, XIcon } from "@primer/octicons-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Cookies from "js-cookie";
import { CornerUpRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import useSWR from "swr";
import useTranslation from "@/hooks/useTranslation";

interface RecentActivity {
  courseCode: string;
  courseName: string;
  path: string;
  timestamp: number;
}

interface CourseSearchDropdownProps {
  placeholder?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const COOKIE_VERSION = "1.2";
const COOKIE_NAME = "recentActivities_v3";

const fetchCourseCodes = async (): Promise<string[]> => {
  const res = await fetch("/courseCodes.json");
  if (!res.ok) throw new Error("Failed to load course codes");
  return res.json();
};

const CourseSearchDropdown: React.FC<CourseSearchDropdownProps> = ({
  placeholder,
  className = "",
  size = "md",
}) => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { t } = useTranslation();

  const [courseCode, setCourseCode] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: courseCodes = [], isLoading } = useSWR(
    "courseCodes",
    fetchCourseCodes,
    {
      dedupingInterval: 1000 * 60 * 60 * 24,
      revalidateOnFocus: false,
    }
  );

  const loadRecentSearches = useCallback(() => {
    const cookieConsent = Cookies.get("cookieConsent");
    if (cookieConsent !== "true") return;

    const storedVersion = Cookies.get("cookieVersion");
    const searches = Cookies.get("popularSearches");

    if (!searches || storedVersion !== COOKIE_VERSION) {
      Cookies.remove("popularSearches");
      Cookies.set("cookieVersion", COOKIE_VERSION, { expires: 365 });
      return;
    }

    try {
      const parsedSearches = JSON.parse(decodeURIComponent(searches));
      const uniqueCourses = Array.from(
        new Set(
          parsedSearches.map((item: { courseCode: string }) =>
            item.courseCode.toUpperCase()
          )
        )
      ).slice(0, 4);
      setRecentSearches(uniqueCourses as string[]);
    } catch (error) {
      console.error("Error processing popular searches:", error);
    }
  }, []);

  useEffect(() => {
    loadRecentSearches();
  }, [loadRecentSearches]);

  const updateSearchCount = (course: string) => {
    const cookieConsent = Cookies.get("cookieConsent");
    if (cookieConsent !== "true") return;

    let searchesArray: RecentActivity[] = [];
    try {
      searchesArray = Cookies.get(COOKIE_NAME)
        ? JSON.parse(decodeURIComponent(Cookies.get(COOKIE_NAME)!))
        : [];
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
      domain: window.location.hostname.includes("liutentor.se")
        ? ".liutentor.se"
        : undefined,
      sameSite: window.location.hostname === "localhost" ? "Strict" : "Lax",
      secure: window.location.protocol === "https:",
    });
  };

  useEffect(() => {
    if (courseCode.trim()) {
      setSuggestions(
        courseCodes.filter((code) =>
          code.toUpperCase().includes(courseCode.toUpperCase())
        )
      );
      setShowSuggestions(true);
      setSelectedIndex(-1);
    } else {
      setShowSuggestions(false);
    }
  }, [courseCode, courseCodes]);

  const scrollToSuggestion = (index: number) => {
    if (suggestionsRef.current) {
      const suggestionElements = suggestionsRef.current.children;
      if (suggestionElements && suggestionElements[index]) {
        const selectedElement = suggestionElements[index] as HTMLElement;
        selectedElement.scrollIntoView({
          behavior: "instant",
          block: "nearest",
        });
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (selectedIndex >= 0 && suggestions.length > 0) {
        handleSelectCourse(suggestions[selectedIndex]);
      } else {
        handleSelectCourse(courseCode);
      }
      setShowSuggestions(false);
    } else if (e.key === "ArrowDown") {
      const newIndex = Math.min(
        selectedIndex + 1,
        recentSearches.length + suggestions.length - 1
      );
      setSelectedIndex(newIndex);
      scrollToSuggestion(newIndex);
    } else if (e.key === "ArrowUp") {
      const newIndex = Math.max(selectedIndex - 1, 0);
      setSelectedIndex(newIndex);
      scrollToSuggestion(newIndex);
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      setSelectedIndex(-1);
      inputRef.current?.blur();
    }
  };

  const handleSelectCourse = (course: string) => {
    const searchCode = course.toUpperCase();
    if (!searchCode) return;

    updateSearchCount(searchCode);
    setCourseCode("");
    setShowSuggestions(false);
    setIsFocused(false);
    inputRef.current?.blur();
    if (pathname.includes("stats")) {
      navigate(`/search/${searchCode}/stats`);
    } else {
      navigate(`/search/${searchCode}`);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (recentSearches.length > 0 && !courseCode.trim()) {
      setShowSuggestions(true);
    }
  };

  const handleBlur = () => {
    setTimeout(() => {
      setIsFocused(false);
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }, 150);
  };

  const sizeClasses = {
    sm: "text-xs p-2",
    md: "text-sm p-2.5",
    lg: "text-base p-3",
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative flex items-center">
        <SearchIcon
          className={`${iconSizes[size]} text-muted-foreground absolute left-3 pointer-events-none`}
        />
        <input
          ref={inputRef}
          placeholder={placeholder || t("searchCoursePlaceholder")}
          value={courseCode.toUpperCase()}
          onChange={(e) => setCourseCode(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={`w-full ${sizeClasses[size]} pl-10 pr-10 bg-input text-foreground outline-none ring-offset-background rounded-full transition-all duration-200`}
        />
        {courseCode && (
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2"
            onClick={() => setCourseCode("")}
            aria-label="Clear search"
          >
            <XIcon
              className={`${iconSizes[size]} text-muted-foreground hover:text-foreground transition-colors`}
            />
          </button>
        )}
      </div>

      {showSuggestions &&
        (isFocused || courseCode.trim()) &&
        (recentSearches.length > 0 || suggestions.length > 0) && (
          <div
            ref={suggestionsRef}
            className="absolute w-full left-0 mt-2 bg-background border border-border shadow-lg z-60 max-h-72 rounded-md overflow-y-auto text-sm"
          >
            {isLoading && (
              <div className="px-3 py-2 text-sm text-muted-foreground">
                {language === "sv" ? "Laddar kurser..." : "Loading courses..."}
              </div>
            )}
            {recentSearches.length > 0 && !courseCode.trim() && (
              <>
                <div className="px-3 pt-3 pb-1 text-muted-foreground font-medium text-xs">
                  {t("recentSearches")}
                </div>
                {recentSearches.map((suggestion, index) => (
                  <div
                    key={`recent-${suggestion}`}
                    className={`flex items-center px-3 py-2 cursor-pointer transition-colors duration-150 ${
                      index === selectedIndex
                        ? "bg-muted text-foreground"
                        : "hover:bg-muted/50"
                    }`}
                    onMouseDown={() => handleSelectCourse(suggestion)}
                  >
                    <ClockFillIcon className="w-4 h-4 mr-2 opacity-70" />
                    <span className="flex-1">{suggestion}</span>
                    <CornerUpRight className="w-4 h-4 opacity-50" />
                  </div>
                ))}
              </>
            )}
            {suggestions.length > 0 && courseCode.trim() && (
              <>
                {recentSearches.length > 0 && !courseCode.trim() && (
                  <div className="border-t mx-2 my-1" />
                )}
                <div className="px-3 pt-3 pb-1 text-muted-foreground font-medium text-xs">
                  {t("allCourses")}
                </div>
                {suggestions.slice(0, 10).map((suggestion, index) => (
                  <div
                    key={suggestion}
                    className={`flex items-center px-3 py-2 cursor-pointer transition-colors duration-150 ${
                      index +
                        (courseCode.trim() ? 0 : recentSearches.length) ===
                      selectedIndex
                        ? "bg-muted text-foreground"
                        : "hover:bg-muted/50"
                    }`}
                    onMouseDown={() => handleSelectCourse(suggestion)}
                  >
                    <span className="flex-1 font-normal">{suggestion}</span>
                    <CornerUpRight className="w-4 h-4 opacity-50" />
                  </div>
                ))}
              </>
            )}
          </div>
        )}
    </div>
  );
};

export default CourseSearchDropdown;
