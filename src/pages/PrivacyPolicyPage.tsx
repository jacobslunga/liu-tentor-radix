import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import translations, { Language } from "@/util/translations";
import { FC, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Separator } from "@/components/ui/separator";
import { Mailbox } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import CustomPagesHeader from "./CustomPagesHeader";

const PrivacyPolicy: FC = () => {
  const { language } = useLanguage();
  const getTranslation = (key: keyof (typeof translations)[Language]) =>
    translations[language][key] || key;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const Section: FC<{ title: string; content: string; items?: string[] }> = ({
    title,
    content,
    items,
  }) => (
    <div className="mb-6 md:mb-8">
      <h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-3 text-foreground">
        {title}
      </h2>
      <p className="text-sm md:text-base text-foreground/80 leading-relaxed mb-3 md:mb-4">
        {content}
      </p>
      {items && (
        <ul className="mt-3 md:mt-4 list-disc pl-4 md:pl-6 space-y-1 md:space-y-2 text-sm md:text-base text-foreground/70">
          {items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Helmet>
        <title>LiU Tentor | {getTranslation("privacyPolicyTitle")}</title>
      </Helmet>

      <CustomPagesHeader />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-3xl mx-auto">
          <PageHeader />

          {/* Professional Header */}
          <div className="mb-6 md:mb-8 mt-8 md:mt-12 text-center">
            <h1 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 text-foreground px-4">
              {getTranslation("privacyPolicyTitle")}
            </h1>
            <p className="text-base md:text-lg text-foreground/70 mb-3 md:mb-4 px-4">
              {language === "sv"
                ? "Vi värnar om din integritet och är engagerade i att skydda dina personuppgifter"
                : "We care about your privacy and are committed to protecting your personal data"}
            </p>
            <p className="text-xs md:text-sm text-muted-foreground">
              {getTranslation("privacyPolicyLastUpdated")} 2025/03/18
            </p>
          </div>

          {/* Professional Introduction */}
          <div className="mb-6 md:mb-10 p-4 md:p-6 bg-muted/20 rounded-xl border border-border/30">
            <p className="text-sm md:text-base text-foreground/80 leading-relaxed">
              {language === "sv"
                ? "LiU Tentor respekterar din integritet och följer gällande dataskyddslagstiftning. Denna integritetspolicy förklarar hur vi samlar in, använder och skyddar information när du använder vår tjänst."
                : "LiU Tentor respects your privacy and complies with applicable data protection legislation. This privacy policy explains how we collect, use, and protect information when you use our service."}
            </p>
          </div>

          <Separator className="mb-8" />

          {/* Enhanced Sections */}
          <div className="space-y-6 md:space-y-8">
            <Section
              title={getTranslation("privacyPolicySection1Title")}
              content={getTranslation("privacyPolicySection1Content")}
              items={[
                getTranslation("privacyPolicySection1Item1"),
                getTranslation("privacyPolicySection1Item2"),
                getTranslation("privacyPolicySection1Item3"),
                getTranslation("privacyPolicySection1Item4"),
              ]}
            />

            <Section
              title={getTranslation("privacyPolicySection2Title")}
              content={getTranslation("privacyPolicySection2Content")}
            />

            <Section
              title={getTranslation("privacyPolicySection3Title")}
              content={getTranslation("privacyPolicySection3Content")}
            />

            <Section
              title={getTranslation("privacyPolicySection4Title")}
              content={getTranslation("privacyPolicySection4Content")}
            />

            <Section
              title={getTranslation("privacyPolicySection5Title")}
              content={getTranslation("privacyPolicySection5Content")}
              items={[
                getTranslation("privacyPolicySection5Item1"),
                getTranslation("privacyPolicySection5Item2"),
                getTranslation("privacyPolicySection5Item3"),
              ]}
            />

            <Section
              title={getTranslation("privacyPolicySection6Title")}
              content={getTranslation("privacyPolicySection6Content")}
            />

            <Separator />

            {/* GDPR Section */}
            <Section
              title={
                getTranslation("privacyPolicyGDPRTitle") ||
                (language === "sv"
                  ? "GDPR och personuppgifter"
                  : "GDPR and Personal Data")
              }
              content={
                getTranslation("privacyPolicyGDPRContent") ||
                (language === "sv"
                  ? "Vi följer GDPR-regleringen och respekterar dina rättigheter gällande personuppgifter. Vi publicerar endast offentligt tillgängliga tentamina från universitetet."
                  : "We comply with GDPR regulations and respect your rights regarding personal data. We only publish publicly available exams from the university.")
              }
              items={[
                getTranslation("privacyPolicyGDPRItem1") ||
                  (language === "sv"
                    ? "Vi publicerar endast offentligt tillgängliga dokument"
                    : "We only publish publicly available documents"),
                getTranslation("privacyPolicyGDPRItem2") ||
                  (language === "sv"
                    ? "Personuppgifter visas endast om de ingår i originalhandlingen"
                    : "Personal data is only shown if included in the original document"),
                getTranslation("privacyPolicyGDPRItem3") ||
                  (language === "sv"
                    ? "Kontakta oss för att begära borttagning av data"
                    : "Contact us to request data removal"),
              ]}
            />
          </div>

          {/* Professional Contact Section */}
          <div className="mt-8 md:mt-12 text-center bg-muted/10 rounded-xl p-6 md:p-8 border border-border/30">
            <Mailbox className="h-10 w-10 md:h-12 md:w-12 mx-auto mb-3 md:mb-4 text-primary" />
            <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3 text-foreground">
              {getTranslation("contactUs") ||
                (language === "sv" ? "Kontakta oss" : "Contact Us")}
            </h3>
            <p className="text-sm md:text-base text-foreground/70 mb-4 md:mb-6 max-w-lg mx-auto px-4">
              {getTranslation("privacyPolicyContactText") ||
                (language === "sv"
                  ? "Har du frågor om vår integritetspolicy? Vi hjälper dig gärna."
                  : "Do you have questions about our privacy policy? We're happy to help.")}
            </p>
            <Button
              size="lg"
              onClick={() =>
                (window.location.href = "mailto:liutentor@gmail.com")
              }
              className="font-medium"
            >
              {getTranslation("contactEmail") ||
                (language === "sv" ? "Kontakta oss" : "Contact Us")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
