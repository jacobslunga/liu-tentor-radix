import CourseSearchDropdown from "@/components/CourseSearchDropdown";
import { Link } from "react-router-dom";
import { LogoIcon } from "./LogoIcon";
import SettingsDialog from "@/components/SettingsDialog";
import useTranslation from "@/hooks/useTranslation";

const Header = () => {
  const { t } = useTranslation();

  return (
    <header
      className="sticky top-0 z-50 h-14 bg-background w-full flex flex-row items-center justify-between md:justify-center transition-colors duration-200 px-5 md:px-10"
      role="banner"
      style={{
        maxWidth: "100%",
      }}
    >
      <Link
        to="/"
        className="text-xl space-x-1 static md:absolute md:left-20 lg:left-32 lg:text-2xl tracking-tight font-logo flex flex-row items-center justify-center"
        aria-label={t("homeTitle")}
      >
        <LogoIcon className="w-10 h-10" />
      </Link>

      <div
        className="relative hidden sm:flex items-center flex-1 max-w-md mx-4 min-w-0"
        role="search"
      >
        <CourseSearchDropdown
          placeholder={t("searchCoursePlaceholder")}
          className="w-full"
          size="md"
        />
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
