import { useLanguage } from '@/context/LanguageContext';
import translations from '@/util/translations';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Separator } from './ui/separator';
import { ArrowRight, ClockIcon } from 'lucide-react';

interface RecentActivity {
  courseCode: string;
  courseName: string;
  path: string;
  timestamp: number;
}

const ContinueWhereYouLeftOff: React.FC = () => {
  const { language } = useLanguage();
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>(
    []
  );

  const COOKIE_NAME = 'recentActivities_v3'; // Standardized cookie name
  const COOKIE_VERSION = '1.2'; // Increment version if structure changes

  useEffect(() => {
    const cookieConsent = Cookies.get('cookieConsent');
    if (cookieConsent !== 'true') return;

    const storedVersion = Cookies.get('cookieVersion');
    if (storedVersion !== COOKIE_VERSION) {
      console.log('Old cookie format detected. Clearing outdated cookies...');
      Cookies.remove('popularSearches');
      Cookies.remove('recentActivities');
      Cookies.remove(COOKIE_NAME);
      Cookies.set('cookieVersion', COOKIE_VERSION, { expires: 365 });
    }

    const fetchRecentActivities = () => {
      const activities = Cookies.get(COOKIE_NAME);
      if (activities) {
        try {
          const parsedActivities = JSON.parse(
            decodeURIComponent(activities)
          ) as RecentActivity[];
          const sortedActivities = parsedActivities
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, 3);
          setRecentActivities(sortedActivities);
        } catch (error) {
          console.error('Error parsing recent activities:', error);
        }
      }
    };

    fetchRecentActivities();
  }, []);

  const getTranslation = (
    key: keyof (typeof translations)[typeof language]
  ) => {
    return translations[language][key];
  };

  const getTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return getTranslation('justNow');
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} ${getTranslation('minutesAgo')}`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} ${getTranslation('hoursAgo')}`;
    const days = Math.floor(hours / 24);
    return `${days} ${getTranslation('daysAgo')}`;
  };

  return (
    <div className='flex flex-col max-w-full w-full self-center mt-10 items-center justify-center p-5 bg-foreground/[3%] border rounded-md'>
      <div className='flex flex-col items-start justify-start w-full'>
        <p className='text-sm font-medium text-foreground/70'>
          {getTranslation('continueWhereYouLeftOff')}
        </p>
        <p className='text-xs text-foreground/50'>
          {getTranslation('recentActivityDescription')}
        </p>
      </div>
      <Separator className='my-4' />
      <div className='flex flex-col w-full space-y-3'>
        {recentActivities.length === 0 ? (
          <p className='text-sm text-foreground/60'>
            {getTranslation('noRecentActivity')}
          </p>
        ) : (
          recentActivities.map((activity) => (
            <Link
              key={`${activity.courseCode}-${activity.timestamp}`}
              to={activity.path}
              className='flex items-center justify-between p-2 rounded-md hover:bg-background/80 transition-colors group'
            >
              <div className='flex flex-col'>
                <span className='text-xs font-medium'>
                  {activity.courseCode}
                </span>
              </div>
              <div className='flex items-center'>
                <span className='text-xs text-muted-foreground flex items-center mr-2'>
                  <ClockIcon className='w-3 h-3 mr-1' />
                  {getTimeAgo(activity.timestamp)}
                </span>
                <ArrowRight className='w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-transform duration-200' />
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default ContinueWhereYouLeftOff;
