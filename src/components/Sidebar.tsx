import { Link, useLocation } from "react-router-dom";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LogoIcon } from "./LogoIcon";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/context/LanguageContext";

export default function Sidebar() {
  const { language } = useLanguage();
  const location = useLocation();

  const mainLinks = [
    {
      to: "/",
      label: language === "sv" ? "Hem" : "Home",
    },
    {
      to: "/upload-exams",
      label: language === "sv" ? "Ladda upp" : "Upload",
    },
    {
      to: "/feedback",
      label: "Feedback",
    },
  ];

  const secondaryLinks = [
    {
      to: "/faq",
      label: language === "sv" ? "Vanliga frågor" : "FAQ",
    },
    {
      to: "/om-oss",
      label: language === "sv" ? "Om oss" : "About Us",
    },
    {
      to: "/privacy-policy",
      label: language === "sv" ? "Integritetspolicy" : "Privacy Policy",
    },
  ];

  const isCurrentPath = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const renderLink = (link: { to: string; label: string }) => {
    const isActive = isCurrentPath(link.to);
    return (
      <Button
        key={link.to}
        asChild
        variant={isActive ? "secondary" : "ghost"}
        className="w-full justify-start group"
      >
        <Link to={link.to}>
          {link.label}
          <ArrowRight className="ml-auto h-4 w-4 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1" />
        </Link>
      </Button>
    );
  };

  return (
    <div className="hidden min-h-screen items-center justify-center lg:flex lg:w-56 lg:fixed lg:inset-y-0 lg:z-50 lg:bg-background">
      <Link
        to="/"
        className="absolute top-5 left-4 flex flex-row items-center justify-center gap-1"
      >
        <LogoIcon className="w-12 h-12" />
        <h1 className="font-semibold text-2xl font-logo text-foreground/80 tracking-tight">
          LiU Tentor
        </h1>
      </Link>
      <div className="w-full px-4">
        <div className="flex flex-col space-y-1">
          {mainLinks.map(renderLink)}
        </div>

        <div className="py-4">
          <Separator />
        </div>

        <div className="flex flex-col space-y-1">
          {secondaryLinks.map(renderLink)}
        </div>
      </div>
    </div>
  );
}
