import { useLanguage } from "@/context/LanguageContext";
import translations from "@/util/translations";
import Cookies from "js-cookie";
import { Clock, Book } from "lucide-react";
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

const GlobalCourseSearch: React.FC<GlobalCourseSearchProps> = ({
  open,
  setOpen,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [courseCodes, setCourseCodes] = useState<string[]>([]);
  const navigate = useNavigate();
  const { language } = useLanguage();

  const getTranslation = (key: keyof (typeof translations)[typeof language]) =>
    translations[language][key];

  // 🧠 Hämta från public/courseCodes.json och cacha lokalt
  const loadCourseCodes = useCallback(async () => {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      setCourseCodes(JSON.parse(cached));
      return;
    }

    try {
      const res = await fetch("/courseCodes.json");
      if (!res.ok) throw new Error("Kunde inte hämta kurskoder");

      const data: string[] = await res.json();
      setCourseCodes(data);
      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    } catch (err) {
      console.error("Fel vid hämtning av kurskoder:", err);
    }
  }, []);

  // 🧠 Ladda kurskoder när dialogen öppnas
  useEffect(() => {
    if (open) loadCourseCodes();
  }, [open, loadCourseCodes]);

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
          ).slice(0, 4);
          setRecentSearches(uniqueCourses as string[]);
        } catch (error) {
          console.error("Failed to parse recent searches:", error);
        }
      }
    }
  }, [open]);

  // ⌨️ Cmd+K/ctrl+K öppna/stäng dialog
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
  }, []);

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
      navigate(`/search/${course}`);
    },
    [navigate, setOpen]
  );

  const filteredRecentSearches = useMemo(() => {
    return recentSearches.filter((course) =>
      course.toUpperCase().includes(searchTerm.toUpperCase())
    );
  }, [searchTerm, recentSearches]);

  const filteredCourses = useMemo(() => {
    return courseCodes
      .filter((course) =>
        course.toUpperCase().includes(searchTerm.toUpperCase())
      )
      .filter((course) => !recentSearches.includes(course))
      .slice(0, 100);
  }, [searchTerm, recentSearches, courseCodes]);

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
      <CommandInput
        placeholder={getTranslation("courseCodePlaceholder")}
        value={searchTerm}
        onValueChange={setSearchTerm}
      />
      <CommandList>
        <CommandEmpty>{getTranslation("noResultsFound")}</CommandEmpty>

        {filteredRecentSearches.length > 0 && (
          <>
            <CommandGroup heading={getTranslation("recentSearches")}>
              {filteredRecentSearches.slice(0, 50).map((course) => (
                <CommandItem
                  key={course}
                  value={course}
                  onSelect={() => handleSelect(course)}
                >
                  <Clock className="mr-2 h-4 w-4" />
                  <span>{course}</span>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
          </>
        )}

        <CommandGroup heading={getTranslation("allCourses")}>
          {filteredCourses.map((course) => (
            <CommandItem
              key={course}
              value={course}
              onSelect={() => handleSelect(course)}
            >
              <Book className="mr-2 h-4 w-4" />
              <span>{course}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};

export default GlobalCourseSearch;
