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

interface NavLink {
  to: string;
  label: string;
}

interface NavGroup {
  label: string;
  links: NavLink[];
}

export default function InfoSidebar() {
  const { language } = useLanguage();
  const location = useLocation();

  const navGroups: NavGroup[] = [
    {
      label: language === "sv" ? "Innehåll" : "Content",
      links: [
        {
          to: "/updates",
          label: language === "sv" ? "Uppdateringar" : "Updates",
        },
        {
          to: "/faq",
          label: language === "sv" ? "Vanliga frågor" : "FAQ",
        },
        {
          to: "/om-oss",
          label: language === "sv" ? "Om oss" : "About Us",
        },
      ],
    },
    {
      label: language === "sv" ? "Bidra" : "Contribute",
      links: [
        {
          to: "/upload-exams",
          label: language === "sv" ? "Ladda upp tenta" : "Upload Exam",
        },
        {
          to: "/feedback",
          label: "Feedback",
        },
      ],
    },
    {
      label: language === "sv" ? "Juridiskt" : "Legal",
      links: [
        {
          to: "/privacy-policy",
          label: language === "sv" ? "Integritetspolicy" : "Privacy Policy",
        },
      ],
    },
  ];

  const isCurrentPath = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const NavigationContent = ({ onLinkClick }: { onLinkClick?: () => void }) => (
    <nav className="space-y-5">
      {navGroups.map((group) => (
        <div key={group.label}>
          {/* Group Label */}
          <h3 className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-2">
            {group.label}
          </h3>

          {/* Links - indented tree structure */}
          <div className="ml-2 pl-2 space-y-0.5">
            {group.links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={onLinkClick}
                className={cn(
                  "block px-2 py-1.5 text-sm rounded-md transition-colors",
                  isCurrentPath(link.to)
                    ? "bg-secondary text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </nav>
  );

  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="fixed top-6 left-6 z-40 hidden md:block">
        <div className="bg-background/95 backdrop-blur-sm border border-border rounded-lg p-4 w-56">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 mb-6 hover:opacity-80 transition-opacity"
          >
            <LogoIcon className="w-7 h-7" />
            <span className="font-black text-lg font-logo tracking-tight">
              LiU Tentor
            </span>
          </Link>

          <NavigationContent />
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="fixed top-0 left-0 right-0 z-40 md:hidden bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between px-4 h-14">
          <Link to="/" className="flex items-center gap-2">
            <LogoIcon className="w-7 h-7" />
            <span className="font-semibold text-lg font-logo text-foreground/80 tracking-tight">
              LiU Tentor
            </span>
          </Link>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <ListIcon weight="bold" className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px]">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <LogoIcon className="w-7 h-7" />
                  <span className="font-semibold text-lg font-logo text-foreground/80 tracking-tight">
                    LiU Tentor
                  </span>
                </SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <NavigationContent onLinkClick={() => setOpen(false)} />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>
    </>
  );
}
