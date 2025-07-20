import MobileHeader from "@/components/MobileHeader";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import { ReactNode } from "react";

interface CustomPagesLayoutProps {
  children: ReactNode;
}

export default function CustomPagesLayout({ children }: CustomPagesLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Sidebar for desktop */}
      <Sidebar />
      
      {/* Mobile header */}
      <MobileHeader />
      
      {/* Main content */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        <main className="flex-1">
          {children}
        </main>
        
        {/* Footer aligned with sidebar */}
        <div className="mt-auto">
          <Footer />
        </div>
      </div>
    </div>
  );
}
