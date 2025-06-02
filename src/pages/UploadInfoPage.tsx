import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Upload, Heart, FileText, CheckCircle, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import PageHeader from "@/components/PageHeader";
import { useLanguage } from "@/context/LanguageContext";
import CustomPagesHeader from "./CustomPagesHeader";

const UploadInfoPage = () => {
  const { language } = useLanguage();

  const translations = {
    sv: {
      homeTitle: "Hem",
      mainTitle: "Hjälp oss göra tentaarkivet komplett",
      subtitle: "Ett arkiv av studenter, för studenter",
      whyTitle: "Varför behöver vi din hjälp?",
      whyText:
        "Universitetet kan inte tillhandahålla alla gamla tentor. Genom att dela med dig av dina tentor och lösningar hjälper du tusentals LiU-studenter att förbereda sig bättre. Tillsammans skapar vi en ovärderlig resurs.",
      whatTitle: "Vad kan du bidra med?",
      whatText:
        "Vi välkomnar alla typer av material som kan hjälpa andra studenter:",
      oldExams: "Gamla tentor från dina kurser",
      solutions: "Lösningar och facit",
      studyMaterial: "Sammanfattningar och anteckningar",
      howTitle: "Hur går det till?",
      howText:
        "Det är enkelt! Ladda upp dina tentor och facit genom att klicka på knappen nedan. Vi granskar materialet och lägger upp det på sidan så att alla studenter kan ta del av det.",
      specialNeedTitle: "Särskilt behov av tentor från:",
      specialNeedText:
        "Vi har främst tentor från Tekniska fakulteten, men vill göra sidan användbar för alla studenter på LiU:",
      filfak: "Filosofiska fakulteten (FilFak)",
      medfak: "Medicinska fakulteten (MedFak)",
      uv: "Utbildningsvetenskap (UV)",
      uploadButton: "Ladda upp tenta eller facit",
      byStudents: "Drivet av studenter, för studenter",
      back: "Tillbaka",
    },
    en: {
      homeTitle: "Home",
      mainTitle: "Help us complete the exam archive",
      subtitle: "An archive by students, for students",
      whyTitle: "Why do we need your help?",
      whyText:
        "The university cannot provide all past exams. By sharing your exams and solutions, you help thousands of LiU students prepare more effectively. Together we build an invaluable resource.",
      whatTitle: "What can you contribute?",
      whatText:
        "We welcome all types of material that can help other students:",
      oldExams: "Old exams from your courses",
      solutions: "Solutions and answer keys",
      studyMaterial: "Summaries and notes",
      howTitle: "How does it work?",
      howText:
        "It's easy! Upload your exams and solutions by clicking the button below. We review the material and add it to the site so all students can benefit from it.",
      specialNeedTitle: "Especially need exams from:",
      specialNeedText:
        "We mainly have exams from the Faculty of Science and Engineering, but want to make the site useful for all LiU students:",
      filfak: "Faculty of Arts and Sciences (FilFak)",
      medfak: "Faculty of Medicine (MedFak)",
      uv: "Faculty of Educational Sciences (UV)",
      uploadButton: "Upload exam or solution",
      byStudents: "Run by students, for students",
      back: "Back",
    },
  };

  const getTranslation = (key: keyof (typeof translations)["sv"]) =>
    translations[language as keyof typeof translations][key];

  const Section: React.FC<{
    title: string;
    content: string;
    items?: string[];
    icons?: React.ReactNode[];
  }> = ({ title, content, items, icons }) => (
    <div className="space-y-4">
      <h2 className="text-lg font-medium">{title}</h2>
      <p className="text-sm text-foreground/80 leading-relaxed">{content}</p>
      {items && (
        <ul className="mt-3 space-y-2 text-sm text-foreground/70">
          {items.map((item, i) => (
            <li key={i} className="flex items-center gap-2">
              {icons && icons[i] ? (
                icons[i]
              ) : (
                <span className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0 mt-2"></span>
              )}
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Helmet>
        <title>LiU Tentor | {getTranslation("mainTitle")}</title>
      </Helmet>

      <CustomPagesHeader />

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <PageHeader />
          <div className="mb-6 text-center">
            <Upload className="h-12 w-12 text-primary mx-auto mb-4" />
            <h1 className="text-4xl font-medium">
              {getTranslation("mainTitle")}
            </h1>
            <p className="text-sm text-muted-foreground mt-2">
              {getTranslation("subtitle")}
            </p>
          </div>

          <div className="mb-8 text-sm leading-relaxed text-center">
            <p>
              {language === "sv"
                ? "LiU Tentor drivs av studenter för studenter. Vi behöver din hjälp för att göra arkivet komplett."
                : "LiU Exams is run by students for students. We need your help to make the archive complete."}
            </p>
          </div>

          <Separator />

          <div className="space-y-6 mt-8">
            <Section
              title={getTranslation("whyTitle")}
              content={getTranslation("whyText")}
            />

            <Section
              title={getTranslation("whatTitle")}
              content={getTranslation("whatText")}
              items={[
                getTranslation("oldExams"),
                getTranslation("solutions"),
                getTranslation("studyMaterial"),
              ]}
              icons={[
                <FileText className="text-primary w-4 h-4 flex-shrink-0 mt-0.5" />,
                <CheckCircle className="text-primary w-4 h-4 flex-shrink-0 mt-0.5" />,
                <BookOpen className="text-primary w-4 h-4 flex-shrink-0 mt-0.5" />,
              ]}
            />

            <Section
              title={getTranslation("howTitle")}
              content={getTranslation("howText")}
            />

            <Section
              title={getTranslation("specialNeedTitle")}
              content={getTranslation("specialNeedText")}
              items={[
                getTranslation("filfak"),
                getTranslation("medfak"),
                getTranslation("uv"),
              ]}
            />
          </div>

          <div className="mt-10 pt-6 border-t flex flex-col items-center text-center space-y-3">
            <Link to="/upload-exams">
              <Button size="lg" className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                {getTranslation("uploadButton")}
              </Button>
            </Link>
            <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
              <Heart className="h-4 w-4 text-primary" />
              <span>{getTranslation("byStudents")}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UploadInfoPage;
