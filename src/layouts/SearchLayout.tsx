import { Outlet, useLocation } from "react-router-dom";

import Header from "@/components/Header";

const isSearchUrl = (url: string) => {
  // Only hide header on individual exam pages (with exam ID), not on course search pages
  const pattern = /^\/search\/[A-Z0-9]+\/\d+$/;
  return pattern.test(url);
};

const SearchLayout = () => {
  const location = useLocation();
  const shouldShowHeader = !isSearchUrl(location.pathname);

  return (
    <div className="flex flex-col items-center min-h-screen w-full overflow-x-hidden">
      {shouldShowHeader && <Header />}
      <main className="flex grow flex-col overflow-x-hidden max-w-full w-full">
        <Outlet />
      </main>
    </div>
  );
};

export default SearchLayout;
