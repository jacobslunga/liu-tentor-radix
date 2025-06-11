import { LogoIcon } from "@/components/LogoIcon";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useLanguage } from "@/context/LanguageContext";
import translations, { Language } from "@/util/translations";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu, Home } from "lucide-react";

export default function CustomPagesHeader() {
  const { language } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const getTranslation = (key: keyof (typeof translations)[Language]) =>
    translations[language][key] || key;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    {
      to: "/",
      label: language === "sv" ? "Hem" : "Home",
      icon: Home,
    },
    {
      to: "/faq",
      label: language === "sv" ? "Vanliga frågor" : "FAQ",
    },
    {
      to: "/om-oss",
      label: language === "sv" ? "Om oss" : "About Us",
    },
    {
      to: "/feedback",
      label: language === "sv" ? "Feedback" : "Feedback",
    },
    {
      to: "/privacy-policy",
      label: language === "sv" ? "Integritetspolicy" : "Privacy Policy",
    },
  ];

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "border-border/50 bg-background/95 backdrop-blur-md shadow-sm"
          : "border-transparent bg-background"
      } border-b`}
      role="banner"
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}

        <Link
          to="/"
          className="flex items-center gap-1 hover:opacity-80 transition-opacity"
          aria-label={getTranslation("homeTitle")}
        >
          <LogoIcon className="w-10 h-10" />
          <h1 className="font-logo text-xl text-foreground">
            {getTranslation("homeTitle")}
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1" role="navigation">
          {links.slice(1).map((link, index) => (
            <div key={link.to} className="flex items-center">
              <Link to={link.to}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-foreground/70 hover:text-foreground hover:bg-muted/50 transition-all duration-200 font-medium px-4"
                >
                  {link.label}
                </Button>
              </Link>
              {index < links.slice(1).length - 1 && (
                <div className="w-px h-4 bg-border/30 mx-2" />
              )}
            </div>
          ))}
        </nav>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="p-2"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[300px] p-0">
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border/20">
                  <Link
                    to="/"
                    onClick={handleLinkClick}
                    className="flex items-center gap-3"
                  >
                    <LogoIcon className="w-8 h-8" />
                    <span className="font-logo text-lg text-foreground/90">
                      {getTranslation("homeTitle")}
                    </span>
                  </Link>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 py-6">
                  <div className="space-y-1 px-3">
                    {links.map((link) => {
                      const Icon = link.icon;
                      return (
                        <Link
                          key={link.to}
                          to={link.to}
                          onClick={handleLinkClick}
                          className="flex items-center gap-3 px-3 py-3 rounded-lg text-foreground/70 hover:text-foreground hover:bg-muted/50 transition-all duration-200 group"
                        >
                          {Icon && (
                            <Icon className="h-5 w-5 text-foreground/50 group-hover:text-foreground/70 transition-colors" />
                          )}
                          <span className="font-medium">{link.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </nav>

                {/* Footer */}
                <div className="p-6 border-t border-border/20">
                  <p className="text-xs text-muted-foreground text-center">
                    {language === "sv"
                      ? "Skapad av studenter, för studenter"
                      : "Created by students, for students"}
                  </p>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
