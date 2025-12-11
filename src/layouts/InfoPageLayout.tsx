import InfoSidebar from "@/components/InfoSidebar";
import { Outlet, useLocation } from "react-router-dom";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const InfoPageLayout: React.FC = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <InfoSidebar />
      {/* Mobile: pt-20 for fixed header, Desktop: pl-72 for sidebar */}
      <main className="px-4 py-8 pt-20 md:pt-12 md:pl-72 md:pr-8 flex justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, filter: "blur(8px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="w-full max-w-3xl"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default InfoPageLayout;
