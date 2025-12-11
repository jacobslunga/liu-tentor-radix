import { FC } from "react";
import { Link } from "react-router-dom";
import { LogoIcon } from "./LogoIcon";
import SettingsDialog from "@/components/SettingsDialog";
import { useLanguage } from "@/context/LanguageContext";
import useTranslation from "@/hooks/useTranslation";

const Footer: FC = () => {
  const { language } = useLanguage();
  const { t } = useTranslation();

  const groupedLinks = [
    {
      title: language === "sv" ? "Sidor" : "Pages",
      links: [
        { name: t("homeLink"), href: "/" },
        { name: "Om oss", href: "/om-oss" },
      ],
    },
    {
      title: language === "sv" ? "Juridiskt" : "Legal",
      links: [{ name: t("privacyPolicyTitle"), href: "/privacy-policy" }],
    },
    {
      title: language === "sv" ? "Support" : "Support",
      links: [
        { name: "Feedback", href: "/feedback" },
        { name: language === "sv" ? "Vanliga frågor" : "FAQ", href: "/faq" },
      ],
    },
  ];

  return (
    <footer className="w-full bg-background mt-24 relative z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description Section */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <LogoIcon className="w-8 h-8 text-primary" />
              <span className="text-xl font-logo font-semibold tracking-tight">
                {t("homeTitle")}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              {language === "sv"
                ? "Din resurs för tentamensarkiv vid Linköpings Universitet."
                : "Your resource for the Linköping University exam archive."}
            </p>
          </div>

          {/* Links Section */}
          <div className="md:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {groupedLinks.map((section) => (
              <div key={section.title}>
                <h4 className="text-sm font-medium text-foreground/80 mb-3">
                  {section.title}
                </h4>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        to={link.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} {t("homeTitle")}.{" "}
            {t("allRightsReserved")}
          </p>
          <div className="flex items-center gap-4">
            <a
              href="mailto:liutentor@gmail.com"
              className="text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              liutentor@gmail.com
            </a>
            <SettingsDialog />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
