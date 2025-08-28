import { Outlet, useLocation } from "react-router-dom";

import Header from "@/components/Header";

const isSearchUrl = (url: string) => {
  const pattern = /^\/search\/[A-Z0-9]+\/\d+$/;
  return pattern.test(url);
};

const SearchLayout = () => {
  const location = useLocation();
  const shouldShowHeader = !isSearchUrl(location.pathname);

  return (
    <div className="flex flex-col items-center min-h-screen max-w-full">
      {shouldShowHeader && <Header />}
      <main className="grow flex flex-col overflow-x-hidden max-w-full">
        <Outlet />
      </main>
    </div>
  );
};

export default SearchLayout;
