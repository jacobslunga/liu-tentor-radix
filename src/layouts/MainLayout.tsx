import CookieBanner from '@/components/CookieBanner';
import Footer from '@/components/Footer';
import GlobalCourseSearch from '@/components/GlobalCourseSearch';
import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { ShowGlobalSearchContext } from '@/context/ShowGlobalSearchContext';
import Cookies from 'js-cookie';

const MainLayout: React.FC = () => {
  const { pathname } = useLocation();
  const [isExam, setIsExam] = useState(false);
  const { setShowGlobalSearch, showGlobalSearch } = useContext(
    ShowGlobalSearchContext
  );

  useEffect(() => {
    const examPattern = /^\/search\/[A-Z0-9]+\/[0-9]+$/;
    setIsExam(examPattern.test(pathname));
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isExam ? 'hidden' : 'auto';
  }, [isExam]);

  useEffect(() => {
    const hasReset = Cookies.get('resetDone');

    if (!hasReset) {
      console.log('Resetting all cookies...');
      Object.keys(Cookies.get()).forEach((cookie) => Cookies.remove(cookie));

      Cookies.set('resetDone', 'true', { expires: 365, sameSite: 'Lax' });
    }
  }, []);

  return (
    <div className='flex flex-col min-h-screen bg-background'>
      <main className='flex-grow'>
        <Outlet />
      </main>
      <CookieBanner />
      {!isExam && <Footer />}

      <GlobalCourseSearch
        open={showGlobalSearch}
        setOpen={setShowGlobalSearch}
      />
    </div>
  );
};

export default MainLayout;
