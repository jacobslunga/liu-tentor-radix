import translations, { Language } from "@/util/translations";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import InlineRecentActivity from "@/components/InlineRecentActivity";
import { Link } from "react-router-dom";
import LoadingSpinner from "@/components/LoadingSpinnger";
import { LogoIcon } from "@/components/LogoIcon";
import MainInput from "@/components/MainInput";
import { UploadIcon } from "@primer/octicons-react";
import { useLanguage } from "@/context/LanguageContext";
import { useMetadata } from "@/hooks/useMetadata";

export default function HomePage() {
  const { language } = useLanguage();
  const getTranslation = (key: keyof (typeof translations)[Language]) =>
    translations[language][key] || key;
  const [isLoading, setIsLoading] = useState(true);
  const [focusInput, setFocusInput] = useState(false);

  useMetadata({
    title: `${getTranslation("homeTitle")}`,
    description: getTranslation("homeDescription"),
    keywords:
      "tentaarkiv, tenta, tentamen, facit, Linköpings Universitet, LiU, gamla tentor, exam archive",
    ogTitle: `LiU Tentor | ${getTranslation("homeTitle")}`,
    ogDescription: getTranslation("homeDescription"),
    ogType: "website",
    twitterCard: "summary",
    twitterTitle: `LiU Tentor | ${getTranslation("homeTitle")}`,
    twitterDescription: getTranslation("homeDescription"),
    robots: "index, follow",
  });

  useEffect(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center w-full min-h-screen p-4 bg-background overflow-x-hidden">
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="flex flex-col items-center space-y-2 mb-10">
            <div className="flex flex-row items-center justify-center space-x-2">
              <LogoIcon className="w-12 h-12 md:w-14 md:h-14 lg:w-20 lg:h-20" />
              <h1 className="text-4xl lg:text-5xl font-semibold font-logo text-foreground/80 tracking-tight">
                {getTranslation("homeTitle")}
              </h1>
            </div>
          </div>

          <div className="w-full max-w-[600px] flex flex-col items-center space-y-6 mb-20">
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
        </>
      )}
    </div>
  );
}
