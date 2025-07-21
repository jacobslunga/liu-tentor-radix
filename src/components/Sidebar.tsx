import { LogoIcon } from "@/components/LogoIcon";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/context/LanguageContext";
import translations, { Language } from "@/util/translations";
import {
  HelpCircle,
  MessageSquare,
  Shield,
  Upload,
  Home,
  Users,
  History,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const { language } = useLanguage();
  const location = useLocation();
  const getTranslation = (key: keyof (typeof translations)[Language]) =>
    translations[language][key] || key;

  const navigationLinks = [
    {
      to: "/",
      label: language === "sv" ? "Hem" : "Home",
      icon: Home,
    },
    {
      to: "/exam-history",
      label: language === "sv" ? "Tentahistorik" : "Exam History",
      icon: History,
    },
    {
      to: "/faq",
      label: language === "sv" ? "Vanliga frågor" : "FAQ",
      icon: HelpCircle,
    },
    {
      to: "/om-oss",
      label: language === "sv" ? "Om oss" : "About Us",
      icon: Users,
    },
    {
      to: "/feedback",
      label: language === "sv" ? "Feedback" : "Feedback",
      icon: MessageSquare,
    },
    {
      to: "/privacy-policy",
      label: language === "sv" ? "Integritetspolicy" : "Privacy Policy",
      icon: Shield,
    },
    {
      to: "/upload-info",
      label: language === "sv" ? "Ladda upp" : "Upload Info",
      icon: Upload,
    },
  ];

  const isCurrentPath = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:z-50 lg:bg-background lg:border-r lg:border-border">
      <div className="flex flex-col flex-1 overflow-y-auto">
        {/* Logo Section */}
        <div className="flex items-center px-6 py-6">
          <Link to="/" className="flex items-center space-x-3">
            <LogoIcon className="w-8 h-8" />
            <h1 className="text-xl font-logo text-foreground/80 tracking-tight">
              {getTranslation("homeTitle")}
            </h1>
          </Link>
        </div>

        <Separator />

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigationLinks.map((link) => {
            const Icon = link.icon;
            const isActive = isCurrentPath(link.to);

            return (
              <Link
                key={link.to}
                to={link.to}
                className={`
                  flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                  ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/70 hover:text-foreground hover:bg-accent"
                  }
                `}
              >
                <Icon className="w-4 h-4 mr-3" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer Section */}
        <div className="p-4 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            Av studenter för studenter
          </p>
        </div>
      </div>
    </div>
  );
}
