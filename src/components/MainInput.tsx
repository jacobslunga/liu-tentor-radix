import React, {
  startTransition,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Cookies from "js-cookie";
import { ArrowUpIcon } from "@phosphor-icons/react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useNavigate } from "react-router-dom";
import useSWR from "swr";

import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "@/hooks/useTranslation";
import { kurskodArray } from "@/data/kurskoder";

import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MainInputProps {
  focusInput: boolean;
  setFocusInput: React.Dispatch<React.SetStateAction<boolean>>;
}

const fetchCourseCodes = async (): Promise<string[]> => {
  const res = await fetch("/courseCodes.json");
  if (!res.ok) throw new Error("Failed to load course codes");
  return res.json();
};

const MainInput: React.FC<MainInputProps> = ({ focusInput, setFocusInput }) => {
  const { language } = useLanguage();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [courseCode, setCourseCode] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [searchMethod, setSearchMethod] = useState("tentor");

  const inputRef = useRef<HTMLInputElement>(null);
  const listParentRef = useRef<HTMLDivElement>(null);

  const { data: courseCodes = [], isLoading } = useSWR(
    "courseCodes",
    fetchCourseCodes,
    {
      dedupingInterval: 1000 * 60 * 60 * 24,
      revalidateOnFocus: false,
    }
  );

  const upperCourseCodes = useMemo(
    () => courseCodes.map((c) => c.toUpperCase()),
    [courseCodes]
  );

  useEffect(() => {
    const q = courseCode.toUpperCase().trim();
    if (!q) {
      setShowSuggestions(false);
      return;
    }

    if (focusInput) setShowSuggestions(true);

    startTransition(() => {
      const next = upperCourseCodes
        .filter((code) => code.includes(q))
        .slice(0, 60);
      setSuggestions(next);
      setSelectedIndex(-1);
    });
  }, [courseCode, focusInput, upperCourseCodes]);

  const rowVirtualizer = useVirtualizer({
    count: suggestions.length,
    getScrollElement: () => listParentRef.current,
    estimateSize: () => 36,
    overscan: 5,
  });

  // Save selected course to recent activity cookie
  const saveRecentActivity = (courseCode: string) => {
    const COOKIE_NAME = "recentActivities_v3";
    const COOKIE_VERSION = "1.2";
    // Remove old cookie if version changed
    const storedVersion = Cookies.get("cookieVersion");
    if (storedVersion !== COOKIE_VERSION) {
      Cookies.remove(COOKIE_NAME);
      Cookies.set("cookieVersion", COOKIE_VERSION, { expires: 365 });
    }
    let activities: any[] = [];
    const cookie = Cookies.get(COOKIE_NAME);
    if (cookie) {
      try {
        activities = JSON.parse(decodeURIComponent(cookie));
      } catch (e) {
        activities = [];
      }
    }
    // Remove any previous entry for this course
    activities = activities.filter((a) => a.courseCode !== courseCode);
    // Add new activity to the front
    activities.unshift({
      courseCode,
      courseName: courseCode, // No name available here
      path:
        searchMethod === "stats"
          ? `/search/${courseCode}/stats`
          : `/search/${courseCode}`,
      timestamp: Date.now(),
    });
    // Limit to 10 recent
    activities = activities.slice(0, 10);
    Cookies.set(COOKIE_NAME, encodeURIComponent(JSON.stringify(activities)), {
      expires: 365,
    });
  };

  const handleSelectCourse = (course: string) => {
    const searchCode = course.toUpperCase();
    if (!searchCode) return;
    saveRecentActivity(searchCode);
    setCourseCode("");
    setShowSuggestions(false);
    navigate(
      searchMethod === "stats"
        ? `/search/${searchCode}/stats`
        : `/search/${searchCode}`
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        handleSelectCourse(suggestions[selectedIndex]);
      } else {
        handleSelectCourse(courseCode);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const newIndex = Math.min(selectedIndex + 1, suggestions.length - 1);
      setSelectedIndex(newIndex);
      rowVirtualizer.scrollToIndex(newIndex, { align: "auto" });
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const newIndex = Math.max(selectedIndex - 1, 0);
      setSelectedIndex(newIndex);
      rowVirtualizer.scrollToIndex(newIndex, { align: "auto" });
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      setSelectedIndex(-1);
      inputRef.current?.blur();
    }
  };

  const [typed, setTyped] = useState("");
  const [exIndex, setExIndex] = useState(() =>
    Math.floor(Math.random() * kurskodArray.length)
  );
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  const shuffledExamples = useMemo(
    () => [...kurskodArray].sort(() => Math.random() - 0.5),
    []
  );

  useEffect(() => {
    if (courseCode) return;
    const current = shuffledExamples[exIndex % shuffledExamples.length] || "";
    const doneTyping = charIndex === current.length && !deleting;
    const doneDeleting = charIndex === 0 && deleting;
    const speed = deleting ? 30 : 55;
    const pause = doneTyping ? 1200 : doneDeleting ? 500 : 0;

    const timer = setTimeout(() => {
      if (doneTyping) {
        setDeleting(true);
      } else if (doneDeleting) {
        setDeleting(false);
        setExIndex((prev) => (prev + 1) % shuffledExamples.length);
      } else {
        setCharIndex((c) => c + (deleting ? -1 : 1));
        setTyped(current.slice(0, deleting ? charIndex - 1 : charIndex + 1));
      }
    }, pause || speed);

    return () => clearTimeout(timer);
  }, [courseCode, charIndex, deleting, exIndex, shuffledExamples]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        listParentRef.current &&
        !listParentRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full">
      <div className="w-full relative flex flex-row items-center justify-center px-2">
        {/* Search Method Selector */}
        <Select
          defaultValue="tentor"
          onOpenChange={(open) => {
            if (!open) setTimeout(() => inputRef.current?.focus(), 0);
          }}
          onValueChange={(value) => {
            setSearchMethod(value);
            setFocusInput(true);
            setTimeout(() => inputRef.current?.focus(), 0);
          }}
        >
          <SelectTrigger className="shrink-0 w-[120px] transition-colors duration-200 ring-0 focus-visible:ring-0 shadow-none rounded-full text-foreground/60 hover:text-foreground">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tentor">{t("exams")}</SelectItem>
            <SelectItem value="stats">{t("statistics")}</SelectItem>
          </SelectContent>
        </Select>

        <div className="shrink-0 h-[25px] w-px bg-foreground/10 ml-4" />

        {/* Input Field */}
        <input
          ref={inputRef}
          value={courseCode.toUpperCase()}
          onChange={(e) => setCourseCode(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocusInput(true)}
          onBlur={() => setFocusInput(false)}
          autoFocus
          className="min-w-0 w-full font-normal p-4 border-none bg-transparent text-md text-foreground/80 outline-none"
          placeholder={
            language === "sv" ? `Sök efter ${typed}` : `Search for ${typed}`
          }
        />

        <Button
          className="absolute right-3 top-1/2 -translate-y-1/2"
          onClick={() => handleSelectCourse(courseCode)}
          aria-label="Search"
          size="icon"
          disabled={!courseCode}
          variant="outline"
        >
          <ArrowUpIcon className="w-5 h-5" weight="bold" />
        </Button>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute w-full left-0 mt-2 bg-background rounded-2xl border shadow-md z-40 max-h-72 overflow-hidden text-sm will-change-transform">
          {isLoading && (
            <div className="p-3 text-sm text-muted-foreground">
              {t("loadingMessage") || "Loading..."}
            </div>
          )}

          <div className="px-3 pt-3 pb-1 text-muted-foreground font-medium">
            {t("allCourses")}
          </div>
          <div
            ref={listParentRef}
            className="overflow-y-auto max-h-64 scrollbar-hide"
          >
            <div
              style={{
                height: rowVirtualizer.getTotalSize(),
                position: "relative",
                width: "100%",
              }}
            >
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const suggestion = suggestions[virtualRow.index];
                const isSelected = virtualRow.index === selectedIndex;

                return (
                  <div
                    key={suggestion}
                    className={`flex items-center px-4 py-2 cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-muted text-foreground"
                        : "hover:bg-muted/50"
                    }`}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: virtualRow.size,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                    onMouseDown={(e) => {
                      // Prevent input blur before click processes
                      e.preventDefault();
                      handleSelectCourse(suggestion);
                    }}
                  >
                    <span className="flex-1 font-normal">{suggestion}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainInput;
