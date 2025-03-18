import CookieBanner from '@/components/CookieBanner';
import Footer from '@/components/Footer';
import GlobalCourseSearch from '@/components/GlobalCourseSearch';
import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { ShowGlobalSearchContext } from '@/context/ShowGlobalSearchContext';

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

  return (
    <div className='flex flex-col min-h-screen bg-background'>
      {/* Main Content */}
      <main className='flex-grow'>
        <Outlet />
      </main>

      {/* Footer alltid synlig */}
      {!isExam && (
        <div className='mt-auto'>
          <Footer />
        </div>
      )}

      {/* Cookie Banner */}
      <CookieBanner />

      {/* Global Search Overlay */}
      <GlobalCourseSearch
        open={showGlobalSearch}
        setOpen={setShowGlobalSearch}
      />
    </div>
  );
};

export default MainLayout;
