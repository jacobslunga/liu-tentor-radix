import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { LogoIcon } from "./LogoIcon";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ListIcon } from "@phosphor-icons/react";

export default function InfoHeader() {
  const { language } = useLanguage();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const navLinks = [
    { to: "/updates", label: language === "sv" ? "Uppdateringar" : "Updates" },
    { to: "/faq", label: language === "sv" ? "Vanliga frågor" : "FAQ" },
    { to: "/om-oss", label: language === "sv" ? "Om oss" : "About Us" },
    { to: "/upload-exams", label: language === "sv" ? "Ladda upp" : "Upload" },
    { to: "/feedback", label: "Feedback" },
    {
      to: "/privacy-policy",
      label: language === "sv" ? "Integritet" : "Privacy",
    },
  ];

  const isCurrentPath = (path: string) =>
    path === "/"
      ? location.pathname === "/"
      : location.pathname.startsWith(path);

  return (
    <header className="sticky top-0 z-40 w-full bg-linear-to-b from-background to-transparent">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity shrink-0"
          viewTransition
        >
          <LogoIcon className="w-7 h-7" />
          <span className="font-light text-lg font-logo tracking-tighter">
            LiU Tentor
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              viewTransition
              className={cn(
                "px-3 py-1.5 font-light text-sm rounded-md transition-colors",
                isCurrentPath(link.to)
                  ? "bg-secondary text-foreground font-light"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <ListIcon weight="bold" className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px]">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <LogoIcon className="w-7 h-7" />
                <span className="font-light text-lg font-logo text-foreground/80 tracking-tighter">
                  LiU Tentor
                </span>
              </SheetTitle>
            </SheetHeader>
            <div className="mt-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  viewTransition
                  className={cn(
                    "block px-3 py-2 text-sm rounded-md transition-colors",
                    isCurrentPath(link.to)
                      ? "bg-secondary text-foreground font-light"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50",
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
