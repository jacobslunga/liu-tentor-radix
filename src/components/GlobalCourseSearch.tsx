import { useLanguage } from '@/context/LanguageContext';
import { kurskodArray } from '@/data/kurskoder';
import translations from '@/util/translations';
import Cookies from 'js-cookie';
import { Book, Clock } from 'lucide-react';
import * as React from 'react';
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

  React.useEffect(() => {
    if (open) {
      const cookieConsent = Cookies.get('cookieConsent');
      if (cookieConsent === 'true') {
        const searches = Cookies.get('popularSearches');
        if (searches) {
          try {
            const decodedSearches = decodeURIComponent(searches);
            const parsedSearches = JSON.parse(
              decodedSearches
            ) as RecentActivity[];
            const uniqueCourses = Array.from(
              new Set(
                parsedSearches.map((item) => item.courseCode.toUpperCase())
              )
            ).slice(0, 4);
            setRecentSearches(uniqueCourses);
          } catch (error) {
            console.error('Failed to parse recent searches:', error);
          }
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
    if (cookieConsent === 'true') {
      const searches = Cookies.get('popularSearches');
      let searchesArray: RecentActivity[] = [];

      try {
        // Decode the URL-encoded cookie value
        const decodedSearches = searches ? decodeURIComponent(searches) : '[]';
        searchesArray = JSON.parse(decodedSearches);
      } catch (error) {
        console.error('Failed to parse popular searches cookie', error);
      }

      const existingCourseIndex = searchesArray.findIndex(
        (item) => item.courseCode === course
      );

      if (existingCourseIndex !== -1) {
        searchesArray[existingCourseIndex].timestamp = Date.now();
      } else {
        searchesArray.push({
          courseCode: course,
          courseName: course, // You might want to fetch the actual course name here
          path: `/search/${course}`,
          timestamp: Date.now(),
        });
      }

      searchesArray.sort((a, b) => b.timestamp - a.timestamp);

      // Encode the JSON string before storing it in the cookie
      const encodedSearches = encodeURIComponent(JSON.stringify(searchesArray));
      Cookies.set('popularSearches', encodedSearches, {
        expires: 365,
        domain:
          window.location.hostname === 'liutentor.se'
            ? '.liutentor.se'
            : undefined,
        sameSite: 'Lax',
      });
    }
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
