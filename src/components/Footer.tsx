import { useLanguage } from "@/context/LanguageContext";
import translations from "@/util/translations";
import { FC } from "react";
import { Link } from "react-router-dom";
import SettingsDialog from "@/components/SettingsDialog";
import { SquareLibrary } from "lucide-react";

const Footer: FC = () => {
  const { language } = useLanguage();
  const getTranslation = (key: keyof (typeof translations)[typeof language]) =>
    translations[language][key];

  const groupedLinks = [
    {
      title: language === "sv" ? "Sidor" : "Pages",
      links: [
        { name: getTranslation("homeLink"), href: "/" },
        { name: "Om oss", href: "/om-oss" },
      ],
    },
    {
      title: language === "sv" ? "Juridiskt" : "Legal",
      links: [
        { name: getTranslation("privacyPolicyTitle"), href: "/privacy-policy" },
      ],
    },
    {
      title: language === "sv" ? "Support" : "Support",
      links: [
        { name: getTranslation("contactLink"), href: "/kontakt" },
        { name: "Feedback", href: "/feedback" },
        { name: language === "sv" ? "Vanliga frågor" : "FAQ", href: "/faq" },
      ],
    },
  ];

  return (
    <footer className="w-full bg-secondary/30 py-10 border-border mt-auto flex flex-col items-center justify-center relative z-10">
      {/* Länkar */}
      <div className="flex flex-col sm:flex-row justify-center items-center md:items-start gap-12 sm:gap-24 text-sm text-foreground/70">
        {groupedLinks.map((section) => (
          <div key={section.title} className="text-center sm:text-left">
            <h4 className="text-foreground/80 font-medium mb-2">
              {section.title}
            </h4>
            <ul className="space-y-1">
              {section.links.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="hover:underline transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="h-[1px] w-1/3 self-center bg-foreground/10 my-8" />

      {/* Underdel */}
      <div className="container mx-auto flex flex-col items-center space-y-4">
        <SettingsDialog />

        <p className="text-xs text-muted-foreground text-center">
          &copy; {new Date().getFullYear()}{" "}
          {getTranslation("allRightsReserved")}
        </p>

        <p className="text-lg text-foreground/50 font-logo select-none tracking-tight flex items-center space-x-2">
          <SquareLibrary className="text-primary w-6 h-6" />
          <span>{getTranslation("homeTitle")}</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
