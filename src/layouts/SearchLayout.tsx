import Header from "@/components/Header";
import { Outlet, useLocation } from "react-router-dom";

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
      <main className="flex-grow flex flex-col max-w-full">
        <Outlet />
      </main>
    </div>
  );
};

export default SearchLayout;
