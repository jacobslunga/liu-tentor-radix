import { useLanguage } from '@/context/LanguageContext';
import { kurskodArray } from '@/data/kurskoder';
import translations from '@/util/translations';
import Cookies from 'js-cookie';
import {
  CornerUpRight,
  LoaderCircle,
  SquareLibrary,
  X,
  Clock,
  Book,
} from 'lucide-react';
import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import SettingsDialog from '@/components/SettingsDialog';

interface HeaderProps {
  inputRef: React.RefObject<HTMLInputElement | null>;
}

const Header: FC<HeaderProps> = ({ inputRef }) => {
  const [courseCode, setCourseCode] = useState<string>('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] =
    useState<number>(-1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [transparentBg, setTransparentBg] = useState<boolean>(true);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setTransparentBg(false);
      } else {
        setTransparentBg(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });

  const suggestionsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { language } = useLanguage();

  const getTranslation = (
    key: keyof (typeof translations)[typeof language]
  ) => {
    return translations[language][key];
  };

  const COOKIE_NAME = 'recentActivities_v3'; // Standardized cookie name
  const COOKIE_VERSION = '1.2'; // Increment version if structure changes

  const loadRecentSearches = () => {
    const cookieConsent = Cookies.get('cookieConsent');
    if (cookieConsent !== 'true') return;

    const storedVersion = Cookies.get('cookieVersion');
    const searches = Cookies.get(COOKIE_NAME);

    let isInvalidFormat = false;

    if (searches) {
      try {
        const parsedSearches = JSON.parse(decodeURIComponent(searches));

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
        console.error('Error parsing search cookie:', error);
        isInvalidFormat = true;
      }
    }

    if (storedVersion !== COOKIE_VERSION || isInvalidFormat) {
      console.log('Invalid or outdated cookies detected. Clearing...');
      Cookies.remove('popularSearches');
      Cookies.remove('recentActivities');
      Cookies.remove(COOKIE_NAME);
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
        console.error('Error processing recent searches:', error);
      }
    }
  };

  useEffect(() => {
    loadRecentSearches();
  }, []);

  const updateSearchCount = (course: string) => {
    const cookieConsent = Cookies.get('cookieConsent');
    if (cookieConsent !== 'true') return;

    const searches = Cookies.get(COOKIE_NAME);
    interface RecentActivity {
      courseCode: string;
      courseName: string;
      path: string;
      timestamp: number;
    }

    let searchesArray: RecentActivity[] = [];

    try {
      searchesArray = searches ? JSON.parse(decodeURIComponent(searches)) : [];
    } catch (error) {
      console.error('Failed to parse recent activities cookie', error);
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

    // Store in the correct cookie (only encode once)
    Cookies.set(COOKIE_NAME, JSON.stringify(searchesArray), {
      expires: 365,
      domain:
        window.location.hostname === 'liutentor.se'
          ? '.liutentor.se'
          : undefined,
      sameSite: 'Lax',
    });
  };

  const fetchMatchingKurskoder = useCallback(
    (input: string) => {
      const matchingKurskoder = kurskodArray.filter(
        (code) =>
          code.toUpperCase().includes(input.toUpperCase()) &&
          !recentSearches.includes(code.toUpperCase())
      );
      return matchingKurskoder;
    },
    [recentSearches]
  );

  const onSubmit = useCallback(
    async (code?: string) => {
      const searchCode = code?.toUpperCase() || courseCode.toUpperCase();
      if (searchCode) {
        setIsLoading(true);
        setShowSuggestions(false);
        setCourseCode('');

        if (kurskodArray.includes(searchCode)) {
          updateSearchCount(searchCode);
          loadRecentSearches();
        }

        navigate(`/search/${searchCode}`);
        setIsLoading(false);
      }
    },
    [courseCode, navigate, loadRecentSearches]
  );

  const handleSuggestionSelect = (suggestion: string) => {
    setCourseCode(suggestion);
    setShowSuggestions(false);
    onSubmit(suggestion);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && courseCode) {
        if (selectedSuggestionIndex >= 0 && suggestions.length > 0) {
          const totalSuggestions = [...recentSearches, ...suggestions];
          handleSuggestionSelect(totalSuggestions[selectedSuggestionIndex]);
        } else {
          onSubmit();
        }
        inputRef.current?.blur();
      } else if (e.key === 'ArrowDown') {
        setSelectedSuggestionIndex((prevIndex) => {
          const totalLength = recentSearches.length + suggestions.length;
          const newIndex =
            prevIndex < totalLength - 1 ? prevIndex + 1 : prevIndex;
          scrollToSuggestion(newIndex);
          return newIndex;
        });
      } else if (e.key === 'ArrowUp') {
        setSelectedSuggestionIndex((prevIndex) => {
          if (prevIndex === 0) {
            inputRef.current?.focus();
            setSelectedSuggestionIndex(-1);
            return -1;
          }
          const newIndex = prevIndex > 0 ? prevIndex - 1 : prevIndex;
          scrollToSuggestion(newIndex);
          return newIndex;
        });
      } else if (e.key === 'Escape') {
        handleClearInput();
        inputRef.current?.blur();
        setShowSuggestions(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    onSubmit,
    courseCode,
    suggestions,
    selectedSuggestionIndex,
    recentSearches,
  ]);

  const scrollToSuggestion = (index: number) => {
    const suggestionElements = suggestionsRef.current?.children;
    if (suggestionElements && suggestionElements[index]) {
      (suggestionElements[index] as HTMLElement).scrollIntoView({
        behavior: 'instant',
        block: 'nearest',
      });
    }
  };

  useEffect(() => {
    const fetchSuggestions = () => {
      if (courseCode) {
        const matchingKurskoder = fetchMatchingKurskoder(courseCode);
        setSuggestions(matchingKurskoder || []);
        setShowSuggestions(true);
        setSelectedSuggestionIndex(-1);
      }
    };

    fetchSuggestions();
  }, [courseCode, fetchMatchingKurskoder, recentSearches]);

  useEffect(() => {
    loadRecentSearches();
  }, [loadRecentSearches]);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      suggestionsRef.current &&
      !suggestionsRef.current.contains(event.target as Node)
    ) {
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputFocus = () => {
    setShowSuggestions(true);
    if (courseCode) {
      const matchingKurskoder = fetchMatchingKurskoder(courseCode);
      setSuggestions(matchingKurskoder || []);
      setShowSuggestions(true);
    }
  };

  const handleSuggestionMouseDown = (suggestion: string) => {
    setCourseCode(suggestion);
    setShowSuggestions(false);
    setSuggestions([]);
    onSubmit(suggestion);
  };

  const handleClearInput = () => {
    setCourseCode('');
    setSuggestions([]);
    setSelectedSuggestionIndex(-1);
  };

  const filteredRecentSearches = recentSearches.filter((code) =>
    code.toUpperCase().includes(courseCode.toUpperCase())
  );

  return (
    <header
      className={`sticky ${
        transparentBg ? 'border-b-transparent' : 'border-b shadow-sm'
      } transition-all bg-background duration-200 top-0 backdrop-blur-sm z-50 h-16 w-screen flex flex-row items-center justify-between md:justify-center px-5 md:px-10`}
      role='banner'
      style={{
        maxWidth: '100vw',
      }}
    >
      <Link
        to='/'
        className='text-xl space-x-2 static md:absolute md:left-20 lg:left-32 lg:text-2xl tracking-tight font-logo flex flex-row items-center justify-center'
        aria-label={getTranslation('homeTitle')}
      >
        <SquareLibrary className='text-primary w-8 h-8 hover:scale-110 transition-transform duration-200' />
        <h1 className='font-logo text-md'>LiU Tentor</h1>
      </Link>

      <div className='relative hidden sm:flex items-center' role='search'>
        <Input
          placeholder={getTranslation('searchCoursePlaceholder')}
          className='w-auto sm:min-w-[300px] md:w-60 pr-10 md:min-w-[350px] lg:min-w-[500px]'
          value={courseCode}
          onChange={(e) => setCourseCode(e.target.value)}
          onFocus={() => {
            handleInputFocus();
          }}
          onBlur={() => {
            setShowSuggestions(false);
          }}
          ref={inputRef}
          disabled={isLoading}
          aria-label={getTranslation('searchCoursePlaceholder')}
        />
        {courseCode && (
          <button
            className='absolute right-0 mr-2'
            onClick={handleClearInput}
            aria-label={getTranslation('clearSearch')}
          >
            <X className='w-5 h-5' />
          </button>
        )}
        {showSuggestions &&
          (filteredRecentSearches.length > 0 || suggestions.length > 0) && (
            <div
              ref={suggestionsRef}
              className='absolute z-50 w-full top-full border rounded-md mt-2 bg-background max-h-80 overflow-y-auto'
              role='listbox'
              aria-label={getTranslation('suggestions')}
            >
              {filteredRecentSearches.length > 0 && (
                <>
                  <div className='px-2 py-1.5 text-sm text-muted-foreground font-normal'>
                    {getTranslation('recentSearches')}
                  </div>
                  {filteredRecentSearches.map((suggestion, index) => (
                    <div
                      key={`recent-${suggestion}`}
                      className={`p-2 cursor-pointer z-50 flex flex-row items-center justify-start space-x-3 text-sm hover:bg-foreground/5 ${
                        index === selectedSuggestionIndex
                          ? 'bg-foreground/10'
                          : ''
                      }`}
                      onMouseDown={() => {
                        handleSuggestionMouseDown(suggestion);
                      }}
                      role='option'
                      aria-selected={index === selectedSuggestionIndex}
                    >
                      <Clock className='w-4 h-4' />
                      <p className='font-medium'>{suggestion}</p>
                      <CornerUpRight className='inline-block w-4 h-4 text-card-foreground' />
                    </div>
                  ))}
                  {suggestions.length > 0 && <div className='border-t' />}
                </>
              )}
              {suggestions.length > 0 && (
                <>
                  <div className='px-2 py-1.5 text-sm text-muted-foreground font-normal'>
                    {getTranslation('allCourses')}
                  </div>
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={suggestion}
                      className={`p-2 cursor-pointer z-50 flex flex-row items-center justify-start space-x-3 text-sm hover:bg-foreground/5 ${
                        index + filteredRecentSearches.length ===
                        selectedSuggestionIndex
                          ? 'bg-foreground/10'
                          : ''
                      }`}
                      onMouseDown={() => {
                        handleSuggestionMouseDown(suggestion);
                      }}
                      role='option'
                      aria-selected={
                        index + filteredRecentSearches.length ===
                        selectedSuggestionIndex
                      }
                    >
                      <Book className='w-4 h-4' />
                      <p className='font-medium'>{suggestion}</p>
                      <CornerUpRight className='inline-block w-4 h-4 text-card-foreground' />
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
      </div>

      <div
        className='flex flex-row items-center justify-center static md:absolute md:right-20 lg:right-32 space-x-2'
        role='navigation'
        aria-label='secondary'
      >
        <SettingsDialog />
      </div>

      {isLoading && (
        <div className='absolute right-0 mr-4' role='status'>
          <LoaderCircle className='animate-spin w-5 h-5 text-blue-500' />
        </div>
      )}

      {isLoading && (
        <div className='fixed inset-0 bg-gray-100 bg-opacity-75 flex items-center justify-center z-50'>
          <LoaderCircle className='animate-spin h-16 w-16 text-gray-500' />
          <p className='ml-4 text-xl text-gray-500'>
            {getTranslation('loadingMessage')}
          </p>
        </div>
      )}
    </header>
  );
};

export default Header;
