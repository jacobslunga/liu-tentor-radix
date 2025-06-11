import { useLanguage } from "@/context/LanguageContext";
import translations from "@/util/translations";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SettingsDialog from "@/components/SettingsDialog";
import CourseSearchDropdown from "@/components/CourseSearchDropdown";
import { LogoIcon } from "./LogoIcon";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  const { language } = useLanguage();

  const getTranslation = (
    key: keyof (typeof translations)[typeof language]
  ) => {
    return translations[language][key];
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky ${
        isScrolled
          ? "border-border/50 bg-background/80 backdrop-blur-md shadow-sm"
          : "border-transparent bg-background"
      } border-b transition-all duration-300 top-0 z-50 h-20 w-full flex flex-row items-center justify-between md:justify-center px-6 md:px-12`}
      role="banner"
      style={{
        maxWidth: "100vw",
      }}
    >
      <Link
        to="/"
        className="static md:absolute md:left-12 lg:left-16 flex flex-row items-center gap-1"
        aria-label={getTranslation("homeTitle")}
      >
        <LogoIcon className="w-10 h-10" />
        <h1 className="font-logo text-xl text-foreground">
          {getTranslation("homeTitle")}
        </h1>
      </Link>

      <div className="relative hidden sm:flex items-center" role="search">
        <CourseSearchDropdown
          className="sm:min-w-[320px] md:w-72 lg:min-w-[420px]"
          placeholder={getTranslation("searchCoursePlaceholder")}
        />
      </div>

      <div
        className="flex flex-row items-center justify-center static md:absolute md:right-12 lg:right-16"
        role="navigation"
        aria-label="secondary"
      >
        <SettingsDialog />
      </div>
    </header>
  );
};

export default Header;
