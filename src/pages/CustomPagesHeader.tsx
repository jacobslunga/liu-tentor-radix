import { LogoIcon } from "@/components/LogoIcon";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import translations, { Language } from "@/util/translations";
import { Link } from "react-router-dom";

export default function CustomPagesHeader() {
  const { language } = useLanguage();
  const getTranslation = (key: keyof (typeof translations)[Language]) =>
    translations[language][key] || key;

  const links = [
    { to: "/faq", label: language === "sv" ? "Vanliga frågor" : "FAQ" },
    { to: "/om-oss", label: language === "sv" ? "Om oss" : "About Us" },
    { to: "/feedback", label: language === "sv" ? "Feedback" : "Feedback" },
    {
      to: "/privacy-policy",
      label: language === "sv" ? "Integritetspolicy" : "Privacy Policy",
    },
  ];

  return (
    <div className="sticky container max-w-2xl mx-auto top-0 z-50 bg-background border-b border-border">
      <div className="max-w-2xl mx-auto flex flex-col items-start py-3">
        <Link to="/" className="flex flex-row items-center space-x-2 mb-2">
          <LogoIcon className="w-8 h-8 sm:w-10 sm:h-10" />
          <h1 className="text-xl sm:text-2xl font-logo text-foreground/80 tracking-tight">
            {getTranslation("homeTitle")}
          </h1>
        </Link>

        <div className="flex flex-wrap lg:flex-nowrap items-start gap-2">
          {links.map((link, index) => (
            <div key={link.to} className="flex flex-row items-center">
              <Link to={link.to}>
                <Button variant="link" size="sm">
                  {link.label}
                </Button>
              </Link>
              {index < links.length - 1 && (
                <div className="hidden lg:block w-px h-4 bg-foreground/30 mx-2" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
