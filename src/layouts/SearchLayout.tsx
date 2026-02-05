import { Outlet, useLocation } from "react-router-dom";
import Header from "@/components/Header";
import { LayoutProvider } from "@/context/LayoutContext";

const isSearchUrl = (url: string) => {
  const pattern = /^\/search\/[A-Z0-9]+\/\d+$/;
  return pattern.test(url);
};

const SearchLayout = () => {
  const location = useLocation();
  const shouldShowHeader = !isSearchUrl(location.pathname);

  return (
    <LayoutProvider>
      <div className="flex flex-col min-h-screen w-full">
        {shouldShowHeader && <Header />}{" "}
        <main className="flex grow flex-col max-w-full w-full">
          <Outlet />
        </main>
      </div>
    </LayoutProvider>
  );
};

export default SearchLayout;
