import { Link, useLocation } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";
import { LogoIcon } from "./LogoIcon";
import { Menu } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/context/LanguageContext";
import { useState } from "react";

export default function InfoHeader() {
  const { language } = useLanguage();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const mainLinks = [
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

  const renderDesktopLink = (link: { to: string; label: string }) => {
    const isActive = isCurrentPath(link.to);
    return (
      <Link key={link.to} to={link.to}>
        <Button variant={isActive ? "secondary" : "ghost"}>{link.label}</Button>
      </Link>
    );
  };

  const renderMobileLink = (link: { to: string; label: string }) => {
    const isActive = isCurrentPath(link.to);
    return (
      <Button
        key={link.to}
        asChild
        variant={isActive ? "secondary" : "ghost"}
        className="w-full justify-start"
        onClick={() => setOpen(false)}
      >
        <Link to={link.to}>{link.label}</Link>
      </Button>
    );
  };

  return (
    <header className="top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 max-w-7xl mx-auto">
        <Link to="/" className="flex items-center gap-2">
          <LogoIcon className="w-8 h-8" />
          <span className="font-semibold text-xl font-logo text-foreground/80 tracking-tight hidden sm:inline-block">
            LiU Tentor
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-2">
          {mainLinks.map(renderDesktopLink)}
          <div className="h-4 w-[1px] bg-foreground/10 mx-2" />
          {secondaryLinks.map(renderDesktopLink)}
        </nav>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <LogoIcon className="w-8 h-8" />
                <span className="font-semibold text-xl font-logo text-foreground/80 tracking-tight">
                  LiU Tentor
                </span>
              </SheetTitle>
            </SheetHeader>
            <div className="mt-8 flex flex-col space-y-4 px-2">
              <div className="flex flex-col space-y-2">
                {mainLinks.map(renderMobileLink)}
              </div>

              <Separator />

              <div className="flex flex-col space-y-2">
                {secondaryLinks.map(renderMobileLink)}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
