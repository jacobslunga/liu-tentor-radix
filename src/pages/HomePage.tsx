import MainInput from "@/components/MainInput";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import translations, { Language } from "@/util/translations";
import { UploadIcon } from "@primer/octicons-react";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import SettingsDialog from "@/components/SettingsDialog";
import InlineRecentActivity from "@/components/InlineRecentActivity";
import LoadingSpinner from "@/components/LoadingSpinnger";
import { LogoIcon } from "@/components/LogoIcon";

export default function HomePage() {
  const { language } = useLanguage();
  const getTranslation = (key: keyof (typeof translations)[Language]) =>
    translations[language][key] || key;
  const [isLoading, setIsLoading] = useState(true);
  const [focusInput, setFocusInput] = useState(false);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const quickLinks = [
    {
      text: getTranslation("feedbackLink"),
      to: "/feedback",
    },
    {
      text: getTranslation("privacyPolicyTitle"),
      to: "/privacy-policy",
    },
  ];

  return (
    <div className="relative flex flex-col items-center justify-center w-full min-h-screen p-4 bg-background overflow-x-hidden">
      <Helmet>
        <title>LiU Tentor</title>
      </Helmet>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          {/* Large Centered Logo */}
          <div className="flex flex-col items-center space-y-2 mb-10">
            <div className="flex flex-row items-center justify-center space-x-2">
              <LogoIcon className="w-12 h-12 md:w-14 md:h-14 lg:w-20 lg:h-20" />
              <h1 className="text-4xl lg:text-5xl font-logo text-foreground/80 tracking-tight">
                {getTranslation("homeTitle")}
              </h1>
            </div>
            {/* <p className="text-xs text-foreground/70 max-w-[350px] text-center mb-4">
              {getTranslation("homeDescription")}
            </p> */}
          </div>

          {/* Main Content */}
          <div className="w-full max-w-[600px] flex flex-col items-center space-y-6 mb-20">
            {/* Search Section */}
            <div
              className={`w-full shadow-md dark:shadow-lg border border-foreground/20 ${
                focusInput
                  ? "border-primary ring-1 ring-primary"
                  : "hover:border-foreground/40"
              } bg-background/5 flex flex-row items-center justify-center dark:bg-foreground/5 rounded-full transition-all duration-200 text-sm text-foreground/80 outline-none`}
            >
              <MainInput setFocusInput={setFocusInput} />
            </div>

            <InlineRecentActivity />

            <div className="flex flex-col items-center justify-center w-full space-y-6">
              {/* CTA Button */}
              <div className="flex flex-col md:flex-row items-center justify-center w-full">
                <Link to="/upload-exams">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="hidden md:flex flex-row items-center justify-center"
                  >
                    <UploadIcon className="w-5 h-5" />
                    {getTranslation("uploadTitle")}
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="fixed bg-gradient-to-b from-background to-background/0 space-x-5 w-full top-0 h-20 items-center justify-end px-5 flex">
            <div className="flex flex-row items-center justify-center space-x-2">
              {quickLinks.map(({ text, to }) => (
                <Link key={text} to={to} className="hidden md:flex">
                  <Button variant="link" className="text-[12px]">
                    {text}
                  </Button>
                </Link>
              ))}
            </div>

            <SettingsDialog />
          </div>
        </>
      )}
    </div>
  );
}
