import { Outlet, useLocation } from "react-router-dom";
import React from "react";

import CookieBanner from "@/components/banners/CookieBanner";
import Footer from "@/components/Footer";

const MainLayout: React.FC = () => {
  const { pathname } = useLocation();

  const isExamPage = /^\/search\/[A-Z0-9]+\/[0-9]+$/.test(pathname);

  return (
    <div className="flex flex-col w-full max-w-full min-h-screen bg-yellow overflow-x-hidden">
      <main className="grow">
        <Outlet />
      </main>

      {!isExamPage && <Footer />}
      <CookieBanner />
    </div>
  );
};

export default MainLayout;
