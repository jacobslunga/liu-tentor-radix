import { useLanguage } from "@/context/LanguageContext";
import translations from "@/util/translations";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import PageHeader from "@/components/PageHeader";

const ContactPage = () => {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Helmet>
        <title>LiU Tentor | {t.contactLink}</title>
      </Helmet>

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-md mx-auto flex flex-col space-y-8 mt-4">
          <PageHeader />

          {/* Stor rubrik med låg opacity */}
          <h1 className="text-6xl sm:text-7xl font-bold text-primary/80 mb-4">
            {t.contactLink}
          </h1>

          {/* Kontakttext */}
          <div className="flex flex-col items-start text-left space-y-6">
            <p className="text-sm text-muted-foreground">
              {language === "sv"
                ? "Har du frågor eller feedback? Kontakta oss på mejl så svarar vi så fort vi kan!"
                : "Have questions or feedback? Reach out via email and we'll respond as soon as possible!"}
            </p>

            <Button
              variant="link"
              size="lg"
              className="pl-0"
              onClick={() =>
                (window.location.href = "mailto:liutentor@gmail.com")
              }
            >
              liutentor@gmail.com
            </Button>

            <div className="pt-6 border-t border-border/30">
              <p className="text-xs text-muted-foreground mb-3">
                {language === "sv"
                  ? "Ge oss feedback direkt på webbplatsen."
                  : "Leave feedback directly on the website."}
              </p>
              <Link to="/feedback">
                <Button variant="outline">
                  {language === "sv" ? "Ge feedback" : "Give feedback"}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
