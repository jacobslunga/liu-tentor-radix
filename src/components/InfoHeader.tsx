import { Link, useLocation } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { LogoIcon } from "./LogoIcon";
import { Menu, ChevronDown } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/context/LanguageContext";
import { useState } from "react";

interface NavLink {
  to: string;
  label: string;
}

interface NavGroup {
  label: string;
  links: NavLink[];
}

export default function InfoHeader() {
  const { language } = useLanguage();
  const location = useLocation();
  const [open, setOpen] = useState(false);

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

  const isGroupActive = (group: NavGroup) => {
    return group.links.some((link) => isCurrentPath(link.to));
  };

  return (
    <header className="top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 max-w-7xl mx-auto">
        <Link to="/" className="flex items-center gap-2">
          <LogoIcon className="w-8 h-8" />
          <span className="font-semibold text-xl font-logo text-foreground/80 tracking-tight hidden sm:inline-block">
            LiU Tentor
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2">
          {navGroups.map((group) => (
            <DropdownMenu key={group.label}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant={isGroupActive(group) ? "secondary" : "ghost"}
                  className="gap-1"
                >
                  {group.label}
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel className="text-xs text-muted-foreground">
                  {group.label}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {group.links.map((link) => (
                  <DropdownMenuItem key={link.to} asChild>
                    <Link
                      to={link.to}
                      className={`w-full cursor-pointer ${
                        isCurrentPath(link.to)
                          ? "bg-secondary text-secondary-foreground"
                          : ""
                      }`}
                    >
                      {link.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ))}
        </nav>

        {/* Mobile Navigation */}
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
            <div className="mt-8 flex flex-col space-y-6 px-2">
              {navGroups.map((group, index) => (
                <div key={group.label} className="flex flex-col space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground px-3">
                    {group.label}
                  </h3>
                  <div className="flex flex-col space-y-1">
                    {group.links.map((link) => (
                      <Button
                        key={link.to}
                        asChild
                        variant={isCurrentPath(link.to) ? "secondary" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => setOpen(false)}
                      >
                        <Link to={link.to}>{link.label}</Link>
                      </Button>
                    ))}
                  </div>
                  {index < navGroups.length - 1 && <Separator />}
                </div>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
