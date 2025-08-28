import { Clock, CornerUpRight, X } from "lucide-react";
import React, {
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import Cookies from "js-cookie";
import { kurskodArray } from "@/data/kurskoder";
import translations from "@/util/translations";
import { useLanguage } from "@/context/LanguageContext";
import { useNavigate } from "react-router-dom";
import useSWR from "swr";
import { useVirtualizer } from "@tanstack/react-virtual";

interface RecentActivity {
  courseCode: string;
  courseName: string;
  path: string;
  timestamp: number;
}

interface MainInputProps {
  setFocusInput: React.Dispatch<React.SetStateAction<boolean>>;
}

const COOKIE_VERSION = "1.2";
const COOKIE_NAME = "recentActivities_v3";

const fetchCourseCodes = async (): Promise<string[]> => {
  const res = await fetch("/courseCodes.json");
  if (!res.ok) throw new Error("Failed to load course codes");
  return res.json();
};

const MainInput: React.FC<MainInputProps> = ({ setFocusInput }) => {
  const { language } = useLanguage();
  const navigate = useNavigate();

  const [courseCode, setCourseCode] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [searchMethod, setSearchMethod] = useState("tentor");

  const [typed, setTyped] = useState("");
  const [exIndex, setExIndex] = useState(() =>
    Math.floor(Math.random() * kurskodArray.length)
  );
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const listParentRef = useRef<HTMLDivElement>(null);

  const { data: courseCodes = [], isLoading } = useSWR(
    "courseCodes",
    fetchCourseCodes,
    {
      dedupingInterval: 1000 * 60 * 60 * 24,
      revalidateOnFocus: false,
    }
  );

  const getTranslation = (key: keyof (typeof translations)[typeof language]) =>
    translations[language][key];

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
    } catch {
      return;
    }
  }, []);

  const shuffledExamples = useMemo(() => {
    return [...kurskodArray].sort(() => Math.random() - 0.5);
  }, []);

  useEffect(() => {
    loadRecentSearches();
  }, [loadRecentSearches]);

  useEffect(() => {
    const showTypewriter = !courseCode;
    if (!showTypewriter) return;
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
        setExIndex((prev) => {
          let next = prev;
          while (next === prev) {
            next = Math.floor(Math.random() * shuffledExamples.length);
          }
          return next;
        });
      } else {
        setCharIndex((c) => c + (deleting ? -1 : 1));
        setTyped(current.slice(0, deleting ? charIndex - 1 : charIndex + 1));
      }
    }, pause || speed);
    return () => clearTimeout(timer);
  }, [courseCode, shuffledExamples, exIndex, charIndex, deleting]);

  useEffect(() => {
    if (!courseCode) {
      const current = shuffledExamples[exIndex % shuffledExamples.length] || "";
      setTyped(current.slice(0, charIndex));
    }
  }, [courseCode, exIndex, charIndex, shuffledExamples]);

  const updateSearchCount = (course: string) => {
    const cookieConsent = Cookies.get("cookieConsent");
    if (cookieConsent !== "true") return;
    let searchesArray: RecentActivity[] = [];
    try {
      searchesArray = Cookies.get(COOKIE_NAME)
        ? JSON.parse(decodeURIComponent(Cookies.get(COOKIE_NAME)!))
        : [];
    } catch {
      searchesArray = [];
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
    setShowSuggestions(true);
    startTransition(() => {
      const next = upperCourseCodes
        .filter((code) => code.includes(q))
        .slice(0, 60);
      setSuggestions(next);
      setSelectedIndex(-1);
    });
  }, [courseCode, upperCourseCodes]);

  const scrollToSuggestion = (index: number) => {
    if (!suggestionsRef.current) return;
    const els = suggestionsRef.current.children;
    if (!els || !els[index]) return;
    (els[index] as HTMLElement).scrollIntoView({
      behavior: "instant",
      block: "nearest",
    });
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
    }
  };

  const handleSelectCourse = (course: string) => {
    const searchCode = course.toUpperCase();
    if (!searchCode) return;
    updateSearchCount(searchCode);
    setCourseCode("");
    setShowSuggestions(false);
    navigate(
      searchMethod === "stats"
        ? `/search/${searchCode}/stats`
        : `/search/${searchCode}`
    );
  };

  const rowVirtualizer = useVirtualizer({
    count: suggestions.length,
    getScrollElement: () => listParentRef.current,
    estimateSize: () => 36,
    overscan: 6,
  });

  return (
    <div className="relative w-full">
      <div className="w-full relative flex flex-row items-center justify-center px-2">
        <Select
          defaultValue="tentor"
          onOpenChange={(open) => {
            if (!open) requestAnimationFrame(() => inputRef.current?.focus());
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
            <SelectItem value="tentor">Tentor</SelectItem>
            <SelectItem value="stats">Statistik</SelectItem>
          </SelectContent>
        </Select>

        <div className="shrink-0 h-[25px] w-[1px] bg-foreground/10 ml-4" />

        <input
          placeholder={
            language === "sv" ? `Sök efter ${typed}` : `Search for ${typed}`
          }
          ref={inputRef}
          value={courseCode.toUpperCase()}
          onChange={(e) => setCourseCode(e.target.value)}
          onKeyDown={handleKeyDown}
          className="min-w-0 w-full font-normal p-4 border-none bg-transparent text-sm text-foreground/80 outline-none"
          autoFocus
          onFocus={() => setFocusInput(true)}
          onBlur={() => setFocusInput(false)}
        />
        {courseCode && (
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2"
            onClick={() => setCourseCode("")}
            aria-label="Clear search"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        )}
      </div>

      {showSuggestions &&
        (recentSearches.length > 0 || suggestions.length > 0) && (
          <div className="absolute w-full left-0 mt-3 bg-background border shadow-md z-40 max-h-72 rounded-md overflow-hidden text-sm will-change-transform">
            <div
              className="relative"
              style={{ paddingTop: recentSearches.length > 0 ? 0 : 0 }}
            >
              {isLoading && (
                <div className="mt-2 absolute left-3 text-sm text-muted-foreground">
                  Laddar kurser...
                </div>
              )}

              {recentSearches.length > 0 && (
                <div ref={suggestionsRef}>
                  <div className="px-3 pt-3 pb-1 text-muted-foreground font-medium">
                    {getTranslation("recentSearches")}
                  </div>
                  {recentSearches.map((suggestion, index) => (
                    <div
                      key={`recent-${suggestion}`}
                      className={`flex items-center px-3 py-2 cursor-pointer ${
                        index === selectedIndex
                          ? "bg-muted text-foreground"
                          : "hover:bg-muted/50"
                      } transition-colors`}
                      onMouseDown={() => handleSelectCourse(suggestion)}
                    >
                      <Clock className="w-4 h-4 mr-2 opacity-70" />
                      <span className="flex-1">{suggestion}</span>
                      <CornerUpRight className="w-4 h-4 opacity-50" />
                    </div>
                  ))}
                </div>
              )}

              {suggestions.length > 0 && (
                <>
                  {recentSearches.length > 0 && (
                    <div className="border-t mx-2 my-1" />
                  )}
                  <div className="px-3 pt-3 pb-1 text-muted-foreground font-medium">
                    {getTranslation("allCourses")}
                  </div>
                  <div ref={listParentRef} className="overflow-y-auto max-h-56">
                    <div
                      style={{
                        height: rowVirtualizer.getTotalSize(),
                        position: "relative",
                      }}
                    >
                      {rowVirtualizer.getVirtualItems().map((v) => {
                        const suggestion = suggestions[v.index];
                        const isSelected =
                          v.index + recentSearches.length === selectedIndex;
                        return (
                          <div
                            key={suggestion}
                            className={`flex items-center px-3 py-2 cursor-pointer ${
                              isSelected
                                ? "bg-muted text-foreground"
                                : "hover:bg-muted/50"
                            } transition-colors`}
                            onMouseDown={() => handleSelectCourse(suggestion)}
                            style={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              width: "100%",
                              height: v.size,
                              transform: `translateY(${v.start}px)`,
                            }}
                          >
                            <span className="flex-1 font-normal">
                              {suggestion}
                            </span>
                            <CornerUpRight className="w-4 h-4 opacity-50" />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
    </div>
  );
};

export default MainInput;
