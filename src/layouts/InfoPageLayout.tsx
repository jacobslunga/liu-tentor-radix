import InfoHeader from "@/components/InfoHeader";
import { Outlet } from "react-router-dom";
import React from "react";

const InfoPageLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <InfoHeader />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default InfoPageLayout;
