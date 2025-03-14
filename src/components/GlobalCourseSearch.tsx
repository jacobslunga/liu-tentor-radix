import { useLanguage } from '@/context/LanguageContext';
import { kurskodArray } from '@/data/kurskoder';
import translations from '@/util/translations';
import Cookies from 'js-cookie';
import { Book, Clock } from 'lucide-react';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';

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

const GlobalCourseSearch: React.FC<GlobalCourseSearchProps> = ({
  open,
  setOpen,
}) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [recentSearches, setRecentSearches] = React.useState<string[]>([]);
  const navigate = useNavigate();
  const { language } = useLanguage();

  const getTranslation = (
    key: keyof (typeof translations)[typeof language]
  ) => {
    return translations[language][key];
  };

  const COOKIE_NAME = 'recentActivities_v3'; // Standardized cookie name
  const COOKIE_VERSION = '1.2'; // Increment version if structure changes

  useEffect(() => {
    if (open) {
      const cookieConsent = Cookies.get('cookieConsent');
      if (cookieConsent !== 'true') return;

      const storedVersion = Cookies.get('cookieVersion');

      if (storedVersion !== COOKIE_VERSION) {
        console.log('Old cookies detected. Clearing outdated cookies...');
        Cookies.remove('popularSearches');
        Cookies.remove('recentActivities');
        Cookies.remove(COOKIE_NAME);
        Cookies.set('cookieVersion', COOKIE_VERSION, { expires: 365 });
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
          console.error('Failed to parse recent searches:', error);
        }
      }
    }
  }, [open]);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'j' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchTerm('');
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const updateSearchCount = (course: string) => {
    const cookieConsent = Cookies.get('cookieConsent');
    if (cookieConsent !== 'true') return;

    const searches = Cookies.get(COOKIE_NAME);
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

  const handleSelect = React.useCallback(
    (course: string) => {
      updateSearchCount(course);
      setOpen(false);
      navigate(`/search/${course}`);
    },
    [navigate, setOpen]
  );

  const filteredCourses = React.useMemo(() => {
    return kurskodArray.filter(
      (course) =>
        course.toUpperCase().includes(searchTerm.toUpperCase()) &&
        !recentSearches.includes(course)
    );
  }, [searchTerm, recentSearches]);

  const filteredRecentSearches = React.useMemo(() => {
    return recentSearches.filter((course) =>
      course.toUpperCase().includes(searchTerm.toUpperCase())
    );
  }, [searchTerm, recentSearches]);

  return (
    <CommandDialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) {
          setSearchTerm('');
        }
      }}
    >
      <CommandInput
        placeholder={getTranslation('courseCodePlaceholder')}
        value={searchTerm}
        onValueChange={setSearchTerm}
      />
      <CommandList>
        <CommandEmpty>{getTranslation('noResultsFound')}</CommandEmpty>

        {filteredRecentSearches.length > 0 && (
          <>
            <CommandGroup heading={getTranslation('recentSearches')}>
              {filteredRecentSearches.map((course) => (
                <CommandItem
                  key={course}
                  value={course}
                  onSelect={() => handleSelect(course)}
                >
                  <Clock className='mr-2 h-4 w-4' />
                  <span>{course}</span>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
          </>
        )}

        <CommandGroup heading={getTranslation('allCourses')}>
          {filteredCourses.map((course) => (
            <CommandItem
              key={course}
              value={course}
              onSelect={() => handleSelect(course)}
            >
              <Book className='mr-2 h-4 w-4' />
              <span>{course}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};

export default GlobalCourseSearch;
