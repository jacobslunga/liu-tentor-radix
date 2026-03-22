import InfoHeader from "@/components/InfoHeader";
import { Outlet, useLocation } from "react-router-dom";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const InfoPageLayout: React.FC = () => {
  const location = useLocation();
  return (
    <div className="min-h-screen bg-background">
      <InfoHeader />
      <main className="px-4 py-10 flex justify-center">
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
