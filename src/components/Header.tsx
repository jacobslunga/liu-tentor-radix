import { useLanguage } from "@/context/LanguageContext";
import translations from "@/util/translations";
import { SquareLibrary } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SettingsDialog from "@/components/SettingsDialog";
import { ShowGlobalSearchContext } from "@/context/ShowGlobalSearchContext";

const Header = () => {
  const [transparentBg, setTransparentBg] = useState<boolean>(true);
  const { setShowGlobalSearch } = useContext(ShowGlobalSearchContext);
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    const platform = window.navigator.platform.toLowerCase();
    setIsMac(platform.includes("mac"));
  }, []);

  const modifierKey = isMac ? "⌘" : "Ctrl";

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setTransparentBg(false);
      } else {
        setTransparentBg(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });

  const { language } = useLanguage();

  const getTranslation = (
    key: keyof (typeof translations)[typeof language]
  ) => {
    return translations[language][key];
  };

  return (
    <header
      className={`sticky ${
        transparentBg
          ? "border-b-transparent"
          : "border-b shadow-sm backdrop-blur-sm"
      } transition-all bg-background/90 duration-200 top-0 z-50 h-16 w-full flex flex-row items-center justify-between md:justify-center px-5 md:px-10`}
      role="banner"
      style={{
        maxWidth: "100vw",
      }}
    >
      <Link
        to="/"
        className="text-xl space-x-2 static md:absolute md:left-20 lg:left-32 lg:text-2xl tracking-tight font-logo flex flex-row items-center justify-center"
        aria-label={getTranslation("homeTitle")}
      >
        <SquareLibrary className="text-primary w-8 h-8 hover:scale-110 transition-transform duration-200" />
        <h1 className="font-logo text-md text-foreground/80">LiU Tentor</h1>
      </Link>

      <div className="relative hidden sm:flex items-center" role="search">
        <div
          className="w-auto hover:cursor-text hover:border-primary/70 transition-all duration-200 sm:min-w-[300px] md:w-60 pr-10 md:min-w-[350px] lg:min-w-[500px] bg-foreground/5 border-2 p-2.5 rounded-md"
          onClick={() => {
            setShowGlobalSearch(true);
          }}
          aria-label={getTranslation("searchCoursePlaceholder")}
        >
          <p className="text-sm text-foreground/50">
            {getTranslation("searchCoursePlaceholder")}
          </p>
        </div>
        <kbd className="text-xs bg-foreground/10 px-2 py-1 rounded-sm text-foreground/50 absolute right-5">
          {modifierKey} + K
        </kbd>
      </div>

      <div
        className="flex flex-row items-center justify-center static md:absolute md:right-20 lg:right-32 space-x-2"
        role="navigation"
        aria-label="secondary"
      >
        <SettingsDialog />
      </div>
    </header>
  );
};

export default Header;
