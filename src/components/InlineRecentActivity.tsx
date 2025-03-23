import { useLanguage } from '@/context/LanguageContext';
import translations from '@/util/translations';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock } from 'lucide-react';

interface RecentActivity {
  courseCode: string;
  courseName: string;
  path: string;
  timestamp: number;
}

const InlineRecentActivity = () => {
  const { language } = useLanguage();
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>(
    []
  );

  const COOKIE_NAME = 'recentActivities_v3';
  const COOKIE_VERSION = '1.2';

  useEffect(() => {
    const cookieConsent = Cookies.get('cookieConsent');
    if (cookieConsent !== 'true') return;

    const storedVersion = Cookies.get('cookieVersion');
    if (storedVersion !== COOKIE_VERSION) {
      Cookies.remove(COOKIE_NAME);
      Cookies.set('cookieVersion', COOKIE_VERSION, { expires: 365 });
    }

    const cookie = Cookies.get(COOKIE_NAME);
    if (cookie) {
      try {
        const parsed = JSON.parse(
          decodeURIComponent(cookie)
        ) as RecentActivity[];
        const sorted = parsed.sort((a, b) => b.timestamp - a.timestamp);
        setRecentActivities(sorted.slice(0, 3));
      } catch (e) {
        console.error('Failed to parse recent activity:', e);
      }
    }
  }, []);

  const getTranslation = (key: keyof (typeof translations)[typeof language]) =>
    translations[language][key];

  const getTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return getTranslation('justNow');
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}${getTranslation('minShort')}`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}${getTranslation('hShort')}`;
    const days = Math.floor(hours / 24);
    return `${days}${getTranslation('dShort')}`;
  };

  if (recentActivities.length === 0) return null;

  return (
    <div className='w-full pt-2 bg-foreground/5 p-5 rounded-xl'>
      <p className='text-sm text-muted-foreground mt-2'>
        {getTranslation('continueWhereYouLeftOff')}
      </p>
      <div className='flex gap-2 overflow-x-auto mt-2'>
        {recentActivities.map((activity) => (
          <Link
            key={activity.path}
            to={activity.path}
            className='flex items-center gap-2 group text-sm px-3 py-2 bg-white dark:bg-black/40 text-black dark:text-white hover:opacity-80 transition-opacity duration-200 rounded-xl whitespace-nowrap'
          >
            <span className='font-normal text-xs'>{activity.courseCode}</span>
            <Clock className='w-3 h-3 text-black/60 dark:text-white/60' />
            <span className='text-xs text-black/60 dark:text-white/60'>
              {getTimeAgo(activity.timestamp)}
            </span>
            <ArrowRight className='w-4 h-4 opacity-50 group-hover:translate-x-1 transition-all duration-200 group-hover:opacity-100' />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default InlineRecentActivity;
