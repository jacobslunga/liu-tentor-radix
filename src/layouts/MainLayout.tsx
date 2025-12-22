import { Outlet, useLocation } from "react-router-dom";
import React, { useEffect } from "react";
import { useTextSize } from "@/context/TextSizeContext";
import Footer from "@/components/Footer";

const MainLayout: React.FC = () => {
  const { pathname } = useLocation();
  const { textSize } = useTextSize();

  const isExamPage = /^\/search\/[A-Z0-9]+\/[0-9]+$/.test(pathname);

  useEffect(() => {
    const root = document.documentElement;

    if (textSize === "stor") {
      root.style.fontSize = "115%";
    } else if (textSize === "liten") {
      root.style.fontSize = "87.5%";
    } else {
      root.style.removeProperty("font-size");
    }
  }, [textSize]);

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
