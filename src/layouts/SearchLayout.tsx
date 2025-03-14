import Header from '@/components/Header';
import { Outlet, useLocation } from 'react-router-dom';
import { useRef } from 'react';

const isSearchUrl = (url: string) => {
  const pattern = /^\/search\/[A-Z0-9]+\/\d+$/;
  return pattern.test(url);
};

const SearchLayout = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const location = useLocation();
  const shouldShowHeader = !isSearchUrl(location.pathname);

  return (
    <div className='flex flex-col items-center min-h-screen max-w-full'>
      {shouldShowHeader && <Header inputRef={inputRef} />}
      <main className='flex-grow flex flex-col overflow-x-hidden max-w-full'>
        <Outlet />
      </main>
    </div>
  );
};

export default SearchLayout;
