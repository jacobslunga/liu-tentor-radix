import { Outlet, useLocation } from "react-router-dom";
import React from "react";

import Footer from "@/components/Footer";

const MainLayout: React.FC = () => {
  const { pathname } = useLocation();

  const isExamPage = /^\/search\/[A-Z0-9]+\/[0-9]+$/.test(pathname);

  return (
    <div className="flex flex-col max-w-full min-h-screen">
      <main className="grow">
        <Outlet />
      </main>

      {!isExamPage && <Footer />}
    </div>
  );
};

export default MainLayout;
