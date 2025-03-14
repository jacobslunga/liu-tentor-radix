import { useLanguage } from '@/context/LanguageContext';
import { kurskodArray } from '@/data/kurskoder';
import translations from '@/util/translations';
import Cookies from 'js-cookie';
import { CornerUpRight, X, Clock } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';

interface RecentActivity {
  courseCode: string;
  courseName: string;
  path: string;
  timestamp: number;
}

const MainInput: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [courseCode, setCourseCode] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const getTranslation = (key: keyof (typeof translations)[typeof language]) =>
    translations[language][key];

  const COOKIE_VERSION = '1.1';

  const loadRecentSearches = () => {
    const cookieConsent = Cookies.get('cookieConsent');
    if (cookieConsent !== 'true') return;

    const storedVersion = Cookies.get('cookieVersion');

    const searches = Cookies.get('popularSearches');

    let isInvalidFormat = false;

    if (searches) {
      try {
        const decodedSearches = decodeURIComponent(searches);
        const parsedSearches = JSON.parse(decodedSearches);

        if (
          !Array.isArray(parsedSearches) ||
          parsedSearches.some(
            (item) =>
              typeof item !== 'object' ||
              !('courseCode' in item) ||
              !('timestamp' in item)
          )
        ) {
          isInvalidFormat = true;
        }
      } catch (error) {
        console.error('Error parsing popular searches cookie:', error);
        isInvalidFormat = true;
      }
    }

    if (storedVersion !== COOKIE_VERSION || isInvalidFormat) {
      console.log('Invalid or old cookies detected. Clearing...');
      Cookies.remove('popularSearches');
      Cookies.set('cookieVersion', COOKIE_VERSION, { expires: 365 });
      return;
    }

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
        console.error('Error processing popular searches:', error);
      }
    }
  };

  useEffect(() => {
    loadRecentSearches();
  }, []);

  useEffect(() => {
    loadRecentSearches();
  }, []);

  const updateSearchCount = (course: string) => {
    const cookieConsent = Cookies.get('cookieConsent');
    if (cookieConsent !== 'true') return;

    const searches = Cookies.get('popularSearches');

    let searchesArray: RecentActivity[] = [];

    try {
      searchesArray = searches ? JSON.parse(decodeURIComponent(searches)) : [];
    } catch (error) {
      console.error('Failed to parse popular searches:', error);
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
    Cookies.set(
      'popularSearches',
      encodeURIComponent(JSON.stringify(searchesArray)),
      {
        expires: 365,
        domain:
          window.location.hostname === 'liutentor.se'
            ? '.liutentor.se'
            : undefined,
        sameSite: 'Lax',
      }
    );

    loadRecentSearches();
  };

  useEffect(() => {
    if (courseCode.trim()) {
      setSuggestions(
        kurskodArray.filter((code) =>
          code.toUpperCase().includes(courseCode.toUpperCase())
        )
      );
      setShowSuggestions(true);
      setSelectedIndex(-1);
    } else {
      setShowSuggestions(false);
    }
  }, [courseCode]);

  const scrollToSuggestion = (index: number) => {
    if (suggestionsRef.current) {
      const suggestionElements = suggestionsRef.current.children;
      if (suggestionElements && suggestionElements[index]) {
        const selectedElement = suggestionElements[index] as HTMLElement;
        selectedElement.scrollIntoView({
          behavior: 'instant',
          block: 'nearest',
        });
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (selectedIndex >= 0 && suggestions.length > 0) {
        handleSelectCourse(suggestions[selectedIndex]);
      } else {
        handleSelectCourse(courseCode);
      }
      setShowSuggestions(false);
    } else if (e.key === 'ArrowDown') {
      const newIndex = Math.min(
        selectedIndex + 1,
        recentSearches.length + suggestions.length - 1
      );
      setSelectedIndex(newIndex);
      scrollToSuggestion(newIndex);
    } else if (e.key === 'ArrowUp') {
      const newIndex = Math.max(selectedIndex - 1, 0);
      setSelectedIndex(newIndex);
      scrollToSuggestion(newIndex);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  };

  const handleSelectCourse = (course: string) => {
    const searchCode = course.toUpperCase();
    if (!searchCode) return;

    updateSearchCount(searchCode);
    setCourseCode('');
    setShowSuggestions(false);
    navigate(`/search/${searchCode}`);
  };

  return (
    <div className='relative w-full'>
      <div className='relative'>
        <Input
          placeholder={getTranslation('searchCoursePlaceholder')}
          value={courseCode}
          onChange={(e) => setCourseCode(e.target.value)}
          onKeyDown={handleKeyDown}
          className='w-full'
        />
        {courseCode && (
          <button
            className='absolute right-2 top-1/2 -translate-y-1/2'
            onClick={() => setCourseCode('')}
            aria-label='Clear search'
          >
            <X className='w-5 h-5 text-muted-foreground' />
          </button>
        )}
      </div>

      {showSuggestions &&
        (recentSearches.length > 0 || suggestions.length > 0) && (
          <div
            ref={suggestionsRef}
            className='absolute w-full mt-1 bg-background border rounded-md shadow-lg z-[100] max-h-60 overflow-y-auto'
          >
            {recentSearches.length > 0 && (
              <>
                <div className='px-3 py-2 text-sm text-muted-foreground font-normal'>
                  {getTranslation('recentSearches')}
                </div>
                {recentSearches.map((suggestion, index) => (
                  <div
                    key={`recent-${suggestion}`}
                    className={`p-2 flex items-center cursor-pointer hover:bg-foreground/5 ${
                      index === selectedIndex ? 'bg-foreground/10' : ''
                    }`}
                    onMouseDown={() => handleSelectCourse(suggestion)}
                  >
                    <Clock className='w-4 h-4 mr-2 text-muted-foreground' />
                    <span className='flex-1'>{suggestion}</span>
                    <CornerUpRight className='w-4 h-4 text-muted-foreground' />
                  </div>
                ))}
              </>
            )}
            {suggestions.length > 0 && (
              <>
                {recentSearches.length > 0 && <div className='border-t' />}
                <div className='px-3 py-2 text-sm text-muted-foreground font-normal'>
                  {getTranslation('allCourses')}
                </div>
                {suggestions.map((suggestion, index) => (
                  <div
                    key={suggestion}
                    className={`p-2 z-50 flex items-center cursor-pointer hover:bg-foreground/5 ${
                      index + recentSearches.length === selectedIndex
                        ? 'bg-foreground/10'
                        : ''
                    }`}
                    onMouseDown={() => handleSelectCourse(suggestion)}
                  >
                    <span className='flex-1'>{suggestion}</span>
                    <CornerUpRight className='w-4 h-4 text-muted-foreground' />
                  </div>
                ))}
              </>
            )}
          </div>
        )}
    </div>
  );
};

export default MainInput;
