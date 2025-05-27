import React, { useEffect } from "react";
import { SquareLibrary } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { Link, useNavigate } from "react-router-dom";
import translations, { Language } from "@/util/translations";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet-async";
import { Separator } from "@/components/ui/separator";
import { Upload, ArrowLeft, Heart } from "lucide-react";

const UploadInfoPage: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const getTranslation = (key: keyof (typeof translations)[Language]) =>
    translations[language][key];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Helmet>
        <title>
          {language === "sv" ? "Vi behöver din hjälp" : "We need your help"} |
          LiU Tentor
        </title>
      </Helmet>

      {/* Header */}
      <div className="bg-background py-4 mx-auto container max-w-2xl flex flex-row items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <SquareLibrary className="text-primary h-7 w-7" />
          <h1 className="text-xl text-foreground/80 font-logo">
            {getTranslation("homeTitle")}
          </h1>
        </Link>

        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
          {language === "sv" ? "Tillbaka" : "Back"}
        </Button>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto flex flex-col space-y-8">
          <div className="flex flex-col items-center text-center space-y-4">
            <Upload className="text-primary h-12 w-12" />

            <h1 className="text-3xl text-foreground/80 font-medium">
              {language === "sv"
                ? "Hjälp oss göra tentaarkivet komplett"
                : "Help us complete the exam archive"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {language === "sv"
                ? "Ett arkiv av studenter, för studenter"
                : "An archive by students, for students"}
            </p>
          </div>

          {/* Simple text sections */}
          <div className="space-y-6 text-foreground/80">
            <div>
              <h2 className="text-lg font-medium mb-2">
                {language === "sv"
                  ? "Varför behöver vi din hjälp?"
                  : "Why do we need your help?"}
              </h2>
              <p className="text-sm leading-relaxed">
                {language === "sv"
                  ? "Vi kan inte köpa ut alla tentor. Dela med dig för att hjälpa andra studenter!"
                  : "We cannot afford to buy all exams. Share yours to help fellow students!"}
              </p>
            </div>

            <Separator />

            <div>
              <h2 className="text-lg font-medium mb-2">
                {language === "sv"
                  ? "Vad kan du bidra med?"
                  : "What can you contribute?"}
              </h2>
              <ul className="text-sm space-y-1 list-disc pl-5">
                <li>{language === "sv" ? "Gamla tentor" : "Old exams"}</li>
                <li>
                  {language === "sv"
                    ? "Lösningar och facit"
                    : "Solutions and answer keys"}
                </li>
                <li>
                  {language === "sv"
                    ? "Tentor från andra program"
                    : "Exams from other programs"}
                </li>
              </ul>
            </div>

            <Separator />

            <div>
              <h2 className="text-lg font-medium mb-2">
                {language === "sv" ? "Hur går det till?" : "How does it work?"}
              </h2>
              <p className="text-sm leading-relaxed">
                {language === "sv"
                  ? "Ladda upp dina tentor och facit med knappen nedan. Vi granskar och lägger upp dem."
                  : "Upload your exams and solutions below. We review and add them to the archive."}
              </p>
            </div>
          </div>

          {/* Upload button */}
          <div className="flex justify-center pt-4">
            <Link to="/upload-exams">
              <Button size="lg" className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                <span>
                  {language === "sv" ? "Ladda upp tenta" : "Upload exam"}
                </span>
              </Button>
            </Link>
          </div>

          {/* Footer */}
          <div className="mt-4 flex flex-col items-center justify-center text-center">
            <Heart className="h-5 w-5 text-primary mb-2" />
            <p className="text-xs text-muted-foreground">
              {language === "sv"
                ? "Drivet av studenter, för studenter"
                : "Run by students, for students"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadInfoPage;
