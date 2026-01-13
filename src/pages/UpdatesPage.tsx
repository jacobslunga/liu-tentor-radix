import { useLanguage } from "@/context/LanguageContext";
import { useMetadata } from "@/hooks/useMetadata";
import { Link } from "react-router-dom";

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
}

const updates: Update[] = [
  {
    version: "2.1.0",
    date: "2025-10-26",
    title: {
      sv: "AI-chattfönster",
      en: "AI Chat Window",
    },
    description: {
      sv: "Få hjälp med tentorna direkt i gränssnittet med vår nya AI-chatt som drivs av Gemini och OpenAI.",
      en: "Get help with exams directly in the interface with our new AI chat powered by Gemini and OpenAI.",
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
      sv: "Fokusera helt på tentan med vår nya Lock In Mode - en dedikerad tentamiljö med timer och inga distraktioner.",
      en: "Focus completely on the exam with our new Lock In Mode - a dedicated exam environment with timer and no distractions.",
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
      sv: "Välj hur du vill visa lösningar med Split View eller Overlay View som anpassas efter ditt arbetssätt.",
      en: "Choose how you want to view solutions with Split View or Overlay View that adapts to your workflow.",
    },
  },
  {
    version: "1.0.0",
    date: "2024-10-01",
    title: {
      sv: "Lansering av LiU Tentor",
      en: "Launch of LiU Tentor",
    },
    description: {
      sv: "Första versionen med sökfunktion, PDF-visning, mörkt/ljust tema och flerspråksstöd.",
      en: "First version with search functionality, PDF viewing, dark/light theme and multi-language support.",
    },
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
    <div className="w-full max-w-3xl">
      {/* Header */}
      <h1 className="text-3xl font-semibold tracking-tight text-foreground mb-2">
        {language === "sv" ? "Uppdateringar" : "Updates"}
      </h1>
      <p className="text-sm text-muted-foreground mb-8">
        {language === "sv"
          ? "Följ med i utvecklingen av LiU Tentor"
          : "Follow the development of LiU Tentor"}
      </p>

      {/* Updates List - Blog style */}
      <div className="divide-y divide-border">
        {updates.map((update) => (
          <article key={update.version} className="py-6 first:pt-0">
            <time className="text-xs text-muted-foreground">
              {new Date(update.date).toLocaleDateString(
                language === "sv" ? "sv-SE" : "en-US",
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }
              )}
            </time>
            <h2 className="text-xl font-medium text-foreground mt-1 mb-2">
              {language === "sv" ? update.title.sv : update.title.en}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {language === "sv"
                ? update.description.sv
                : update.description.en}
            </p>
          </article>
        ))}
      </div>

      {/* Footer note */}
      <div className="mt-10 pt-6 border-t text-sm text-muted-foreground">
        <p>
          {language === "sv"
            ? "Har du förslag på nya funktioner? "
            : "Do you have suggestions for new features? "}
          <Link
            to="/feedback"
            className="text-primary hover:underline font-medium"
          >
            {language === "sv" ? "Skicka feedback" : "Send feedback"}
          </Link>
        </p>
      </div>
    </div>
  );
}
