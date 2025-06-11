import CookieBanner from "@/components/CookieBanner";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

const MainLayout: React.FC = () => {
  const { pathname } = useLocation();
  const [isExam, setIsExam] = useState(false);

  useEffect(() => {
    const examPattern = /^\/search\/[A-Z0-9]+\/[0-9]+$/;
    setIsExam(examPattern.test(pathname));
  }, [pathname]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer alltid synlig */}
      {!isExam && (
        <div className="mt-auto">
          <Footer />
        </div>
      )}

      {/* Cookie Banner */}
      <CookieBanner />
    </div>
  );
};

export default MainLayout;
