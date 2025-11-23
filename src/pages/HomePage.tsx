import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import InlineRecentActivity from "@/components/InlineRecentActivity";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { LogoIcon } from "@/components/LogoIcon";
import MainInput from "@/components/MainInput";
import { UploadIcon } from "@primer/octicons-react";
import { useMetadata } from "@/hooks/useMetadata";
import useTranslation from "@/hooks/useTranslation";
import { useLanguage } from "@/context/LanguageContext";

export default function HomePage() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [focusInput, setFocusInput] = useState(false);

  useMetadata({
    title: `${t("homeTitle")}`,
    description: t("homeDescription"),
    keywords:
      "tentaarkiv, tenta, tentamen, facit, Linköpings Universitet, LiU, gamla tentor, exam archive",
    ogTitle: `LiU Tentor | ${t("homeTitle")}`,
    ogDescription: t("homeDescription"),
    ogType: "website",
    twitterCard: "summary",
    twitterTitle: `LiU Tentor | ${t("homeTitle")}`,
    twitterDescription: t("homeDescription"),
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
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-2" />
        </div>
      ) : (
        <>
          <div className="absolute top-5 right-5 flex flex-row items-center justify-center gap-2">
            <Link to="/updates">
              <Button size="sm" variant="link">
                {language === "sv" ? "Updateringar" : "Updates"}
              </Button>
            </Link>
            <Link
              to="https://github.com/jacobslunga/liu-tentor-radix/blob/main/README.md"
              target="_blank"
            >
              <Button size="sm" variant="link">
                {language === "sv"
                  ? "Bidra till LiU Tentor"
                  : "Contribute to LiU Exams"}
              </Button>
            </Link>
          </div>

          <div className="flex flex-col items-center space-y-2 mb-10">
            <div className="flex flex-row items-center justify-center space-x-2">
              <LogoIcon className="w-12 h-12 md:w-14 md:h-14 lg:w-20 lg:h-20" />
              <h1 className="text-4xl lg:text-5xl font-semibold font-logo text-foreground/80 tracking-tight">
                {t("homeTitle")}
              </h1>
            </div>
          </div>

          <div className="w-full max-w-[600px] flex flex-col items-center space-y-6 mb-20">
            <div
              className={`w-full shadow-md dark:shadow-lg border border-foreground/20 ${
                focusInput
                  ? "border-primary ring-1 ring-primary"
                  : "hover:border-foreground/40"
              } bg-background/5 corner-squircle flex flex-row items-center justify-center dark:bg-foreground/5 rounded-full transition-all duration-200 text-sm text-foreground/80 outline-none`}
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
                    {t("uploadTitle")}
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
