import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import InlineRecentActivity from "@/components/InlineRecentActivity";
import { Link } from "react-router-dom";
import { CircleNotchIcon } from "@phosphor-icons/react";
import { LogoIcon } from "@/components/LogoIcon";
import MainInput from "@/components/MainInput";
import { UploadIcon } from "@phosphor-icons/react";
import { useMetadata } from "@/hooks/useMetadata";
import useTranslation from "@/hooks/useTranslation";

export default function HomePage() {
  const { t } = useTranslation();
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
    <div className="relative flex flex-col items-center justify-start w-full min-h-screen p-4 pt-[20vh] bg-background overflow-x-hidden">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <CircleNotchIcon className="h-8 w-8 animate-spin text-muted-foreground mb-2" />
        </div>
      ) : (
        <>
          <div className="flex flex-col items-center space-y-2 mb-10">
            <div className="flex flex-row items-center justify-center space-x-2">
              <LogoIcon className="w-12 h-12 md:w-14 md:h-14 lg:w-24 lg:h-24" />
              <h1 className="text-4xl lg:text-5xl font-black font-logo tracking-tight">
                {t("homeTitle")}
              </h1>
            </div>
          </div>

          <div className="w-full max-w-[600px] flex flex-col items-center space-y-6 mb-20">
            <div
              className={`w-full border border-foreground/20 ${
                focusInput
                  ? "border-primary ring-1 ring-primary"
                  : "hover:border-foreground/40"
              } bg-background flex flex-row items-center justify-center rounded-full transition-all duration-200 text-sm text-foreground/80 outline-none`}
            >
              <MainInput
                focusInput={focusInput}
                setFocusInput={setFocusInput}
              />
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
                    <UploadIcon className="w-5 h-5" weight="bold" />
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
