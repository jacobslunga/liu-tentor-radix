import { FC, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useLanguage } from "@/context/LanguageContext";
import PageHeader from "@/components/PageHeader";
import CustomPagesHeader from "./CustomPagesHeader";

const OmOss: FC = () => {
  const { language } = useLanguage();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Helmet>
        <title>LiU Tentor | Om oss</title>
      </Helmet>

      <CustomPagesHeader />

      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <PageHeader />

        <h1 className="text-2xl font-medium text-foreground/90 mb-4 mt-12">
          {language === "sv" ? "Om oss" : "About Us"}
        </h1>
        <div className="text-sm text-foreground/80 leading-relaxed space-y-4">
          {language === "sv" ? (
            <>
              <p>
                LiU Tentor är ett ideellt initiativ som startades av några
                studenter vid Linköpings universitet som tröttnade på att klicka
                runt i evigheter för att hitta rätt tenta. Det började som ett
                sidoprojekt en sen kväll under tentaveckan, och har sedan dess
                vuxit till något större än vi trodde.
              </p>
              <p>
                Vårt mål är enkelt: att göra det så smidigt som möjligt att
                hitta gamla tentor, lösningar och material för att kunna plugga
                smartare. Vi vet hur det känns att sitta dagen innan tenta och
                desperat leta efter en lösningsfil som kanske eller kanske inte
                finns någonstans på kurshemsidan.
              </p>
              <p>
                Vi bygger LiU Tentor för att vi själva använder det – och
                förbättrar det ständigt utifrån våra behov, era förslag och små
                idéer som dyker upp mitt i natten. Det är ett passion project,
                men också något vi verkligen tror gör studentlivet lite enklare.
              </p>
              <p>
                Har du idéer, hittat en bugg eller vill bara säga hej? Hör av
                dig! Vi älskar feedback – särskilt sån som kommer med emojis
                🧠✨
              </p>
            </>
          ) : (
            <>
              <p>
                LiU Tentor is a non-profit project started by students at
                Linköping University who were tired of clicking around endlessly
                to find the right exam. It began as a side project late one exam
                week and has since grown into something bigger than we imagined.
              </p>
              <p>
                Our goal is simple: to make it as smooth as possible to find old
                exams, solutions, and materials to help you study smarter. We
                know how it feels to sit the night before an exam desperately
                looking for a solution PDF that may or may not be buried
                somewhere on the course site.
              </p>
              <p>
                We’re building LiU Tentor because we use it ourselves – and
                we’re constantly improving it based on our needs, your
                suggestions, and random 2 a.m. ideas. It’s a passion project,
                but also something we truly believe makes student life a bit
                easier.
              </p>
              <p>
                Got ideas, found a bug, or just want to say hi? Reach out! We
                love feedback – especially the kind that comes with emojis 🧠✨
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OmOss;
