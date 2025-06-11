import { useLanguage } from "@/context/LanguageContext";
import translations from "@/util/translations";
import { Search, Clock, ChevronDown, X } from "lucide-react";
import { SearchIcon } from "@primer/octicons-react";
import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface CourseSearchDropdownProps {
  className?: string;
  placeholder?: string;
  variant?: "default" | "main-input";
  onFocus?: () => void;
  onBlur?: () => void;
}

const CourseSearchDropdown: React.FC<CourseSearchDropdownProps> = ({
  className,
  placeholder,
  variant = "default",
  onFocus,
  onBlur,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [courseCodes, setCourseCodes] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const navigate = useNavigate();
  const { language } = useLanguage();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

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

  // Get all available options for keyboard navigation
  const getAllOptions = () => {
    const options: string[] = [];
    if (!searchTerm.trim() && recentSearches.length > 0) {
      options.push(...recentSearches);
    }
    if (searchTerm.trim() && filteredCourses.length > 0) {
      options.push(...filteredCourses);
    }
    return options;
  };

  // Scroll selected item into view
  const scrollToSelectedItem = (index: number) => {
    if (listRef.current) {
      const items = listRef.current.querySelectorAll(
        '[data-keyboard-nav="true"]'
      );
      if (items[index]) {
        items[index].scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allOptions = getAllOptions();

    if (e.key === "ArrowDown") {
      e.preventDefault();
      const nextIndex =
        selectedIndex < allOptions.length - 1 ? selectedIndex + 1 : 0;
      setSelectedIndex(nextIndex);
      scrollToSelectedItem(nextIndex);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prevIndex =
        selectedIndex > 0 ? selectedIndex - 1 : allOptions.length - 1;
      setSelectedIndex(prevIndex);
      scrollToSelectedItem(prevIndex);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && allOptions[selectedIndex]) {
        handleSelectCourse(allOptions[selectedIndex]);
      } else if (searchTerm.trim()) {
        handleSelectCourse(searchTerm.trim());
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setSearchTerm("");
      setSelectedIndex(-1);
    }
  };

  // Handle course selection
  const handleSelectCourse = (courseCode: string) => {
    saveToRecent(courseCode.toUpperCase());
    navigate(`/search/${courseCode.toUpperCase()}`);
    setIsOpen(false);
    setSearchTerm("");
    setSelectedIndex(-1);
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

  // Reset selected index when search term changes
  useEffect(() => {
    setSelectedIndex(-1);
  }, [searchTerm]);

  const inputContainerClass =
    variant === "main-input"
      ? "w-full relative flex flex-row items-center justify-center bg-transparent border-none"
      : "group w-full cursor-text transition-all duration-300 bg-muted/30 hover:bg-muted/50 border border-border/50 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 rounded-lg backdrop-blur-sm overflow-hidden";

  const inputWrapperClass =
    variant === "main-input"
      ? "w-full relative flex flex-row items-center justify-center"
      : "flex items-center gap-3 p-3";

  const inputClass =
    variant === "main-input"
      ? "w-full font-normal p-4 border-none bg-transparent text-sm text-foreground/80 outline-none"
      : "flex-1 bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground";

  const iconClass =
    variant === "main-input"
      ? "w-4 h-4 text-muted-foreground ml-5"
      : "h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors duration-200";

  return (
    <div ref={dropdownRef} className={cn("relative", className)}>
      {/* Search Input */}
      <div className={inputContainerClass} onClick={() => setIsOpen(true)}>
        <div className={inputWrapperClass}>
          {variant === "main-input" ? (
            <SearchIcon className={iconClass} />
          ) : (
            <Search className={iconClass} />
          )}
          {isOpen || variant === "main-input" ? (
            <input
              ref={inputRef}
              type="text"
              value={searchTerm.toUpperCase()}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={
                placeholder || getTranslation("searchCoursePlaceholder")
              }
              className={inputClass}
              autoFocus={variant === "main-input"}
              onFocus={onFocus}
              onBlur={onBlur}
              onKeyDown={handleKeyDown}
            />
          ) : (
            <span className="flex-1 text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-200 font-medium">
              {placeholder || getTranslation("searchCoursePlaceholder")}
            </span>
          )}
          {variant === "main-input" && searchTerm && (
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2"
              onClick={() => setSearchTerm("")}
              aria-label="Clear search"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          )}
          {variant === "default" && (
            <ChevronDown
              className={cn(
                "h-4 w-4 text-muted-foreground transition-transform duration-200",
                isOpen && "rotate-180"
              )}
            />
          )}
        </div>
      </div>

      {/* Dropdown */}
      {(isOpen || (variant === "main-input" && searchTerm.trim())) && (
        <div
          ref={listRef}
          className={cn(
            "absolute top-full left-0 right-0 bg-background border z-50 max-h-64 overflow-y-auto text-sm",
            variant === "main-input"
              ? "mt-3 border shadow-xl z-[60] max-h-72 rounded-md"
              : "mt-2 border-border/50 rounded-lg shadow-lg backdrop-blur-sm z-50"
          )}
        >
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
                      ? "SENASTA SÖKNINGAR"
                      : "RECENT SEARCHES"}
                  </div>
                  {recentSearches.map((courseCode, index) => (
                    <button
                      key={courseCode}
                      data-keyboard-nav="true"
                      onClick={() => handleSelectCourse(courseCode)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 text-left rounded-md transition-colors text-sm",
                        selectedIndex === index
                          ? "bg-primary/10 border-primary/20 text-primary"
                          : "hover:bg-muted/50"
                      )}
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
                        {language === "sv" ? "SÖKRESULTAT" : "SEARCH RESULTS"}
                      </div>
                      {filteredCourses.map((courseCode, index) => (
                        <button
                          key={courseCode}
                          data-keyboard-nav="true"
                          onClick={() => handleSelectCourse(courseCode)}
                          className={cn(
                            "w-full flex items-center gap-3 px-3 py-2 text-left rounded-md transition-colors text-sm border border-transparent",
                            selectedIndex === index
                              ? "bg-primary/15 border-primary/30 text-primary"
                              : "hover:bg-primary/10 hover:border-primary/20"
                          )}
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
