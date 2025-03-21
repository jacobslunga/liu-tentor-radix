import { useLanguage } from '@/context/LanguageContext';
import translations from '@/util/translations';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Separator } from './ui/separator';
import {
  Clock,
  CaretLineLeft,
  CaretLineRight,
  ArrowRight,
} from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import { Badge } from './ui/badge';

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userToggled, setUserToggled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkScreenSize = () => {
      const isDesktop = window.matchMedia('(min-width: 1200px)').matches;
      if (!userToggled) setIsSidebarOpen(isDesktop);
    };
    checkScreenSize();
    const resizeHandler = () => {
      checkScreenSize();
      if (window.innerWidth < 768 && isSidebarOpen) setIsSidebarOpen(false);
    };
    window.addEventListener('resize', resizeHandler);
    return () => window.removeEventListener('resize', resizeHandler);
  }, [userToggled, isSidebarOpen]);

  const handleToggle = (open: boolean) => {
    setUserToggled(true);
    setIsSidebarOpen(open);
  };

  const COOKIE_NAME = 'recentActivities_v3';
  const COOKIE_VERSION = '1.2';

  useEffect(() => {
    const cookieConsent = Cookies.get('cookieConsent');
    if (cookieConsent !== 'true') return;
    const storedVersion = Cookies.get('cookieVersion');
    if (storedVersion !== COOKIE_VERSION) {
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
          const sortedActivities = parsedActivities.sort(
            (a, b) => b.timestamp - a.timestamp
          );
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

  if (location.pathname !== '/') return null;

  const sidebarVariants = {
    hidden: { x: '-100%', opacity: 0 },
    visible: {
      x: '0%',
      opacity: 1,
      transition: { duration: 0.3, ease: 'easeOut' },
    },
    exit: {
      x: '-10%',
      opacity: 0,
      transition: { duration: 0.1, ease: 'easeOut' },
    },
  };

  return (
    <AnimatePresence>
      {isSidebarOpen && (
        <motion.div
          key='sidebar'
          className='fixed left-0 top-0 h-screen w-[300px] bg-background/90 backdrop-blur-sm border-r border-foreground/10 z-50 shadow-lg'
          variants={sidebarVariants}
          initial='hidden'
          animate='visible'
          exit='exit'
        >
          <div className='flex flex-col h-full p-4'>
            <div className='flex items-center justify-between'>
              <h2 className='text-base font-semibold flex flex-col items-start'>
                {getTranslation('continueWhereYouLeftOff')} (
                {recentActivities.length})
              </h2>
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild className='z-40'>
                    <Button
                      onClick={() => handleToggle(false)}
                      variant='outline'
                      size='icon'
                    >
                      <CaretLineLeft className='w-5 h-5' weight='bold' />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent autoFocus={false} side='right'>
                    <p>{getTranslation('hideContinueWhereYouLeftOff')}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Separator className='my-4' />
            <div className='flex flex-col space-y-3 overflow-auto w-full not-scroll'>
              {recentActivities.length === 0 ? (
                <p className='text-sm text-foreground/60'>
                  {getTranslation('noRecentActivity')}
                </p>
              ) : (
                recentActivities.map((activity, i) => {
                  const isNew = Date.now() - activity.timestamp < 86400000;
                  return (
                    <Link
                      key={`${activity.courseCode}-${activity.timestamp}`}
                      to={activity.path}
                      className='flex flex-col p-2 rounded-md hover:bg-foreground/5 transition-colors group'
                      style={{
                        marginBottom:
                          i === recentActivities.length - 1 ? 50 : 0,
                      }}
                    >
                      <div className='flex flex-col items-start justify-between'>
                        <div className='flex items-center space-x-2'>
                          <span className='text-lg font-medium'>
                            {activity.courseCode}
                          </span>

                          {isNew && (
                            <Badge variant='outline'>
                              {getTranslation('new')}
                            </Badge>
                          )}
                        </div>

                        <span className='text-xs text-muted-foreground flex items-center'>
                          <Clock className='w-3 h-3 mr-1' />
                          {getTimeAgo(activity.timestamp)}
                        </span>
                      </div>
                      <div className='flex items-center justify-end mt-1'>
                        <ArrowRight className='w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-transform duration-200' />
                      </div>
                    </Link>
                  );
                })
              )}
            </div>
          </div>
        </motion.div>
      )}
      {!isSidebarOpen && (
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild className='z-40'>
              <Button
                onClick={() => handleToggle(true)}
                className='fixed left-5 top-5'
                size='icon'
                variant='outline'
              >
                <CaretLineRight className='w-5 h-5' weight='bold' />
              </Button>
            </TooltipTrigger>
            <TooltipContent autoFocus={false} side='right'>
              <p>{getTranslation('showContinueWhereYouLeftOff')}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </AnimatePresence>
  );
};

export default ContinueWhereYouLeftOff;
