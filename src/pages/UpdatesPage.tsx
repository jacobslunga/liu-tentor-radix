import { useLanguage } from "@/context/LanguageContext";
import {
  Bot,
  Calendar,
  Lock,
  SplitSquareVertical,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useMetadata } from "@/hooks/useMetadata";

interface Update {
  version: string;
  date: string;
  title: {
    sv: string;
    en: string;
  };
  description: {
    sv: string;
    en: string;
  };
  features: {
    sv: string[];
    en: string[];
  };
  icon: React.ReactNode;
  badge?: {
    sv: string;
    en: string;
  };
}

const updates: Update[] = [
  {
    version: "2.1.0",
    date: "2025-01-15",
    title: {
      sv: "AI-chattfönster",
      en: "AI Chat Window",
    },
    description: {
      sv: "Få hjälp med tentorna direkt i gränssnittet av chatten som drivs av OpenAI",
      en: "Get help with exams directly in the interface from chat powered by OpenAI",
    },
    features: {
      sv: [
        "Chatta med AI om specifika tentauppgifter",
        "Få förklaringar och steg-för-steg-lösningar",
        "Välj mellan vägledning eller direkta svar",
        "Stöd för LaTeX och matematisk notation",
        "Syntax-highlighting för kodblock",
        "Resizable chattfönster för bättre arbetsflöde",
      ],
      en: [
        "Chat with AI about specific exam questions",
        "Get explanations and step-by-step solutions",
        "Choose between guidance or direct answers",
        "Support for LaTeX and mathematical notation",
        "Syntax highlighting for code blocks",
        "Resizable chat window for better workflow",
      ],
    },
    icon: <Bot className="w-6 h-6" />,
    badge: {
      sv: "Ny",
      en: "New",
    },
  },
  {
    version: "2.0.0",
    date: "2024-12-10",
    title: {
      sv: "Lock In Mode",
      en: "Lock In Mode",
    },
    description: {
      sv: "Fokusera helt på tentan med vår nya Lock In Mode - en dedikerad tentamiljö med timer och inga distraktioner",
      en: "Focus completely on the exam with our new Lock In Mode - a dedicated exam environment with timer and no distractions",
    },
    features: {
      sv: [
        "Välj tentlängd från 30 minuter upp till 5 timmar",
        "Nedräkningstimer i realtid",
        "Fullskärmsläge för maximal fokus",
        "Pausa och återuppta funktion",
        "Automatisk tidsgräns med notifikation",
        "Inga lösningar tillgängliga under tentamode",
      ],
      en: [
        "Choose exam duration from 30 minutes up to 5 hours",
        "Real-time countdown timer",
        "Fullscreen mode for maximum focus",
        "Pause and resume functionality",
        "Automatic time limit with notification",
        "No solutions available during exam mode",
      ],
    },
    icon: <Lock className="w-6 h-6" />,
    badge: {
      sv: "Populär",
      en: "Popular",
    },
  },
  {
    version: "1.5.0",
    date: "2024-11-20",
    title: {
      sv: "Flexibla lösningsvyer",
      en: "Flexible Solution Views",
    },
    description: {
      sv: "Välj hur du vill visa lösningar med två nya vyer som anpassas efter ditt arbetssätt",
      en: "Choose how you want to view solutions with two new views that adapt to your workflow",
    },
    features: {
      sv: [
        "Split View - Visa tenta och lösningar sida vid sida",
        "Overlay View - Hovra vid högerkanten för att se lösningen",
        "Individuell zoom och rotation för varje PDF",
        "Synkroniserad scrollning mellan vyer",
        "Snabbtangent 'E' för att växla lösningsvisning",
        "Smidiga animationer mellan vylägen",
      ],
      en: [
        "Split View - Display exam and solutions side by side",
        "Overlay View - Hover at the right edge to see the solution",
        "Individual zoom and rotation for each PDF",
        "Synchronized scrolling between views",
        "Hotkey 'E' to toggle solution display",
        "Smooth animations between view modes",
      ],
    },
    icon: <SplitSquareVertical className="w-6 h-6" />,
  },
  {
    version: "1.0.0",
    date: "2024-10-01",
    title: {
      sv: "Lansering av LiU Tentor",
      en: "Launch of LiU Tentor",
    },
    description: {
      sv: "Första versionen av LiU Tentor med grundläggande funktionalitet för att söka och visa tentamina",
      en: "First version of LiU Tentor with basic functionality for searching and viewing exams",
    },
    features: {
      sv: [
        "Sök efter kurser med kurskod eller namn",
        "Bläddra bland tillgängliga tentamina",
        "PDF-visning med zoom och rotation",
        "Responsiv design för mobil och desktop",
        "Mörkt/ljust tema",
        "Flerspråksstöd (Svenska/Engelska)",
      ],
      en: [
        "Search for courses by course code or name",
        "Browse available exams",
        "PDF viewing with zoom and rotation",
        "Responsive design for mobile and desktop",
        "Dark/light theme",
        "Multi-language support (Swedish/English)",
      ],
    },
    icon: <Sparkles className="w-6 h-6" />,
  },
];

export default function UpdatesPage() {
  const { language } = useLanguage();

  useMetadata({
    title: `LiU Tentor | ${language === "sv" ? "Uppdateringar" : "Updates"}`,
    description:
      language === "sv"
        ? "Se de senaste uppdateringarna och funktionerna på LiU Tentor"
        : "See the latest updates and features on LiU Tentor",
    keywords: "updates, changelog, new features, LiU Tentor",
    ogTitle: `LiU Tentor | ${language === "sv" ? "Uppdateringar" : "Updates"}`,
    ogDescription:
      language === "sv"
        ? "Se de senaste uppdateringarna och funktionerna på LiU Tentor"
        : "See the latest updates and features on LiU Tentor",
    ogType: "website",
    twitterCard: "summary",
    robots: "index, follow",
  });

  return (
    <div className="w-full min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            {language === "sv" ? "Uppdateringar" : "Updates"}
          </h1>
          <p className="text-base text-muted-foreground">
            {language === "sv"
              ? "Följ med i utvecklingen av LiU Tentor och se vilka nya funktioner vi har lagt till"
              : "Follow the development of LiU Tentor and see what new features we've added"}
          </p>
        </div>

        {/* Updates Timeline */}
        <div className="space-y-6">
          {updates.map((update) => (
            <div key={update.version}>
              <Card className="p-6 md:p-8 border-border/60">
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  {/* Icon */}
                  <div className="shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      {update.icon}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-4">
                    {/* Header */}
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-2xl font-semibold">
                        {language === "sv" ? update.title.sv : update.title.en}
                      </h2>
                      {update.badge && (
                        <Badge variant="secondary" className="font-medium">
                          {language === "sv"
                            ? update.badge.sv
                            : update.badge.en}
                        </Badge>
                      )}
                    </div>

                    {/* Date & Version */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(update.date).toLocaleDateString(
                            language === "sv" ? "sv-SE" : "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </span>
                      </div>
                      <div className="text-muted-foreground/70">
                        v{update.version}
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-foreground/80 leading-relaxed">
                      {language === "sv"
                        ? update.description.sv
                        : update.description.en}
                    </p>

                    {/* Features List */}
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                        {language === "sv" ? "Funktioner" : "Features"}
                      </h3>
                      <ul className="space-y-2">
                        {(language === "sv"
                          ? update.features.sv
                          : update.features.en
                        ).map((feature, featureIndex) => (
                          <li
                            key={featureIndex}
                            className="flex items-start gap-2 text-foreground/70"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                            <span className="leading-relaxed">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>
            {language === "sv"
              ? "Har du förslag på nya funktioner? "
              : "Do you have suggestions for new features? "}
            <a
              href="/feedback"
              className="text-primary hover:underline font-medium"
            >
              {language === "sv" ? "Skicka feedback" : "Send feedback"}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
