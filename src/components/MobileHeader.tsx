import { LogoIcon } from "@/components/LogoIcon";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useLanguage } from "@/context/LanguageContext";
import translations, { Language } from "@/util/translations";
import {
  Menu,
  HelpCircle,
  MessageSquare,
  Shield,
  Upload,
  Home,
  Users,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

export default function MobileHeader() {
  const { language } = useLanguage();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const getTranslation = (key: keyof (typeof translations)[Language]) =>
    translations[language][key] || key;

  const navigationLinks = [
    {
      to: "/",
      label: language === "sv" ? "Hem" : "Home",
      icon: Home,
    },
    {
      to: "/faq",
      label: language === "sv" ? "Vanliga frågor" : "FAQ",
      icon: HelpCircle,
    },
    {
      to: "/om-oss",
      label: language === "sv" ? "Om oss" : "About Us",
      icon: Users,
    },
    {
      to: "/feedback",
      label: language === "sv" ? "Feedback" : "Feedback",
      icon: MessageSquare,
    },
    {
      to: "/privacy-policy",
      label: language === "sv" ? "Integritetspolicy" : "Privacy Policy",
      icon: Shield,
    },
    {
      to: "/upload-info",
      label: language === "sv" ? "Ladda upp" : "Upload Info",
      icon: Upload,
    },
  ];

  const isCurrentPath = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className="lg:hidden sticky top-0 z-50 bg-background border-b border-border">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <LogoIcon className="w-8 h-8" />
          <h1 className="text-xl font-logo text-foreground/80 tracking-tight">
            {getTranslation("homeTitle")}
          </h1>
        </Link>

        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-64">
            <div className="flex flex-col h-full">
              {/* Logo in sheet */}
              <div className="flex items-center space-x-3 mb-6">
                <LogoIcon className="w-6 h-6" />
                <h2 className="text-lg font-logo text-foreground/80">
                  {getTranslation("homeTitle")}
                </h2>
              </div>

              {/* Navigation */}
              <nav className="flex-1 space-y-2">
                {navigationLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = isCurrentPath(link.to);

                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => setIsOpen(false)}
                      className={`
                        flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                        ${
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "text-foreground/70 hover:text-foreground hover:bg-accent"
                        }
                      `}
                    >
                      <Icon className="w-4 h-4 mr-3" />
                      {link.label}
                    </Link>
                  );
                })}
              </nav>

              {/* Footer */}
              <div className="pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground text-center">
                  Made with ❤️ for LiU students
                </p>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
