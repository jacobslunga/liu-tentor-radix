import { useLanguage } from "@/context/LanguageContext";
import translations from "@/util/translations";
import { Search, Clock, ChevronDown } from "lucide-react";
import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface CourseSearchDropdownProps {
  className?: string;
  placeholder?: string;
}

const CourseSearchDropdown: React.FC<CourseSearchDropdownProps> = ({
  className,
  placeholder,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [courseCodes, setCourseCodes] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { language } = useLanguage();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const getTranslation = (key: keyof (typeof translations)[typeof language]) =>
    translations[language][key];

  // Load course codes
  const loadCourseCodes = useCallback(async () => {
    if (courseCodes.length > 0) return;

    setIsLoading(true);
    try {
      const res = await fetch("/courseCodes.json");
      if (!res.ok) throw new Error("Failed to fetch course codes");
      const data: string[] = await res.json();
      setCourseCodes(data);
    } catch (err) {
      console.error("Error fetching course codes:", err);
    } finally {
      setIsLoading(false);
    }
  }, [courseCodes.length]);

  // Load recent searches from localStorage
  const loadRecentSearches = useCallback(() => {
    try {
      const recent = localStorage.getItem("recentCourseSearches");
      if (recent) {
        setRecentSearches(JSON.parse(recent).slice(0, 5));
      }
    } catch (error) {
      console.error("Failed to load recent searches:", error);
    }
  }, []);

  // Save to recent searches
  const saveToRecent = useCallback((courseCode: string) => {
    try {
      const recent = JSON.parse(
        localStorage.getItem("recentCourseSearches") || "[]"
      );
      const filtered = recent.filter((code: string) => code !== courseCode);
      const updated = [courseCode, ...filtered].slice(0, 5);
      localStorage.setItem("recentCourseSearches", JSON.stringify(updated));
      setRecentSearches(updated);
    } catch (error) {
      console.error("Failed to save recent search:", error);
    }
  }, []);

  // Filter course codes based on search term
  const filteredCourses = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const term = searchTerm.toLowerCase();
    return courseCodes
      .filter((code) => code.toLowerCase().includes(term))
      .slice(0, 10);
  }, [courseCodes, searchTerm]);

  // Handle course selection
  const handleSelectCourse = (courseCode: string) => {
    saveToRecent(courseCode);
    navigate(`/search/${courseCode}`);
    setIsOpen(false);
    setSearchTerm("");
  };

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Load data when dropdown opens
  useEffect(() => {
    if (isOpen) {
      loadCourseCodes();
      loadRecentSearches();
    }
  }, [isOpen, loadCourseCodes, loadRecentSearches]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className={cn("relative", className)}>
      {/* Search Input */}
      <div
        className="group w-full cursor-text transition-all duration-300 bg-muted/30 hover:bg-muted/50 border border-border/50 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 rounded-lg backdrop-blur-sm overflow-hidden"
        onClick={() => setIsOpen(true)}
      >
        <div className="flex items-center gap-3 p-3">
          <Search className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
          {isOpen ? (
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={
                placeholder || getTranslation("searchCoursePlaceholder")
              }
              className="flex-1 bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground"
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setIsOpen(false);
                  setSearchTerm("");
                }
                if (e.key === "Enter" && filteredCourses.length > 0) {
                  handleSelectCourse(filteredCourses[0]);
                }
              }}
            />
          ) : (
            <span className="flex-1 text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-200 font-medium">
              {placeholder || getTranslation("searchCoursePlaceholder")}
            </span>
          )}
          <ChevronDown
            className={cn(
              "h-4 w-4 text-muted-foreground transition-transform duration-200",
              isOpen && "rotate-180"
            )}
          />
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border/50 rounded-lg shadow-lg backdrop-blur-sm z-50 max-h-64 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-muted-foreground text-sm">
              {language === "sv" ? "Laddar..." : "Loading..."}
            </div>
          ) : (
            <>
              {/* Recent searches */}
              {!searchTerm.trim() && recentSearches.length > 0 && (
                <div className="p-2">
                  <div className="flex items-center gap-2 px-2 py-1 text-xs font-medium text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {language === "sv"
                      ? "Senaste sökningar"
                      : "Recent searches"}
                  </div>
                  {recentSearches.map((courseCode) => (
                    <button
                      key={courseCode}
                      onClick={() => handleSelectCourse(courseCode)}
                      className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-muted/50 rounded-md transition-colors text-sm"
                    >
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="font-mono font-medium">
                        {courseCode}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* Search results */}
              {searchTerm.trim() && (
                <div className="p-2">
                  {filteredCourses.length > 0 ? (
                    <>
                      <div className="flex items-center gap-2 px-2 py-1 text-xs font-medium text-muted-foreground">
                        <Search className="h-3 w-3" />
                        {language === "sv" ? "Sökresultat" : "Search results"}
                      </div>
                      {filteredCourses.map((courseCode) => (
                        <button
                          key={courseCode}
                          onClick={() => handleSelectCourse(courseCode)}
                          className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-primary/10 hover:border-primary/20 rounded-md transition-colors text-sm border border-transparent"
                        >
                          <Search className="h-4 w-4 text-muted-foreground" />
                          <span className="font-mono font-medium">
                            {courseCode}
                          </span>
                        </button>
                      ))}
                    </>
                  ) : (
                    <div className="p-4 text-center text-muted-foreground text-sm">
                      {language === "sv"
                        ? "Inga kurser hittades"
                        : "No courses found"}
                    </div>
                  )}
                </div>
              )}

              {/* Empty state */}
              {!searchTerm.trim() && recentSearches.length === 0 && (
                <div className="p-4 text-center text-muted-foreground text-sm">
                  {language === "sv"
                    ? "Börja skriv för att söka kurser"
                    : "Start typing to search courses"}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CourseSearchDropdown;
