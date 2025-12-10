import { FC, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { MailboxIcon } from "@phosphor-icons/react";
import { Separator } from "@/components/ui/separator";
import { useMetadata } from "@/hooks/useMetadata";
import useTranslation from "@/hooks/useTranslation";

const PrivacyPolicy: FC = () => {
  const { t } = useTranslation();

  useMetadata({
    title: `LiU Tentor | ${t("privacyPolicyTitle")}`,
    description: t("privacyPolicyIntro"),
    keywords:
      "integritetspolicy, privacy policy, GDPR, personuppgifter, data, Linköpings Universitet, LiU",
    ogTitle: `LiU Tentor | ${t("privacyPolicyTitle")}`,
    ogDescription: t("privacyPolicyIntro"),
    ogType: "website",
    twitterCard: "summary",
    twitterTitle: `LiU Tentor | ${t("privacyPolicyTitle")}`,
    twitterDescription: t("privacyPolicyIntro"),
    robots: "index, follow",
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  const Section: FC<{ title: string; content: string; items?: string[] }> = ({
    title,
    content,
    items,
  }) => (
    <div className="mb-6">
      <h2 className="text-lg font-medium text-foreground mb-2 flex items-center gap-2">
        {title}
      </h2>
      <p className="text-sm text-foreground/80 leading-relaxed">{content}</p>
      {items && (
        <ul className="mt-3 list-disc pl-5 space-y-1 text-sm text-foreground/70">
          {items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl text-foreground font-medium flex items-center gap-2">
            {t("privacyPolicyTitle")}
          </h1>
          <p className="text-xs text-muted-foreground mt-2">
            {t("privacyPolicyLastUpdated")} 2025/12/10
          </p>
        </div>
        {/* Intro */}
        <div className="mb-8 text-sm leading-relaxed">
          <p>{t("privacyPolicyIntro")}</p>
        </div>
        <Separator />
        {/* Sections */}
        <div className="space-y-6 mt-8">
          <Section
            title={t("privacyPolicySection1Title")}
            content={t("privacyPolicySection1Content")}
            items={[
              t("privacyPolicySection1Item1"),
              t("privacyPolicySection1Item2"),
              t("privacyPolicySection1Item3"),
              t("privacyPolicySection1Item4"),
            ]}
          />

          <Section
            title={t("privacyPolicySection2Title")}
            content={t("privacyPolicySection2Content")}
          />

          <Section
            title={t("privacyPolicySection3Title")}
            content={t("privacyPolicySection3Content")}
          />

          <Section
            title={t("privacyPolicySection4Title")}
            content={t("privacyPolicySection4Content")}
          />

          <Section
            title={t("privacyPolicySection5Title")}
            content={t("privacyPolicySection5Content")}
            items={[
              t("privacyPolicySection5Item1"),
              t("privacyPolicySection5Item2"),
              t("privacyPolicySection5Item3"),
            ]}
          />

          <Section
            title={t("privacyPolicySection6Title")}
            content={t("privacyPolicySection6Content")}
          />

          <Section
            title={t("privacyPolicySection7Title")}
            content={t("privacyPolicySection7Content")}
            items={[
              t("privacyPolicySection7Item1"),
              t("privacyPolicySection7Item2"),
              t("privacyPolicySection7Item3"),
            ]}
          />

          <Section
            title={t("privacyPolicySection8Title")}
            content={t("privacyPolicySection8Content")}
          />

          <Separator />

          {/* GDPR Section */}
          <Section
            title={
              t("privacyPolicyGDPRTitle") ||
              "Hantering av personuppgifter och GDPR"
            }
            content={
              t("privacyPolicyGDPRContent") ||
              "Vi visar offentligt tillgängliga tentor som publicerats av universitetet, inklusive namn på examinatorer som en del av dokumentets originalinnehåll. Vi respekterar rätten till integritet och följer GDPR-regleringen. Om du är en examinator och vill begära borttagning av ditt namn från en tenta, vänligen kontakta oss."
            }
            items={[
              t("privacyPolicyGDPRItem1") ||
                "Vi publicerar endast tentor som är offentligt tillgängliga.",
              t("privacyPolicyGDPRItem2") ||
                "Examinatorers namn ingår endast om de finns med i den ursprungliga tentan.",
              t("privacyPolicyGDPRItem3") ||
                "Om du vill begära borttagning av en tenta eller ett namn, vänligen kontakta oss via e-post.",
            ]}
          />
        </div>{" "}
        {/* Contact Section */}
        <div className="mt-10 pt-6 border-t flex flex-col items-center text-center space-y-3">
          <MailboxIcon weight="duotone" className="h-10 w-10 text-primary" />
          <h3 className="text-md font-medium">
            {t("contactUs") || "Contact Us"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {t("privacyPolicyContactText") ||
              "If you have any questions about our privacy policy, please contact us."}
          </p>
          <Button
            size="sm"
            className="mt-2"
            onClick={() =>
              (window.location.href = "mailto:liutentor@gmail.com")
            }
          >
            {t("contactEmail") || "Contact Email"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
