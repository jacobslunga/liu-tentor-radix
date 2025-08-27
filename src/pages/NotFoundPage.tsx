import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import React from "react";
import translations from "@/util/translations";
import { useLanguage } from "@/context/LanguageContext";
import { useMetadata } from "@/hooks/useMetadata";

const NotFoundPage: React.FC = () => {
  const { language } = useLanguage();
  const getTranslation = (key: keyof (typeof translations)[typeof language]) =>
    translations[language][key];

  useMetadata({
    title: `LiU Tentor | 404 - ${
      language === "sv" ? "Sidan hittades inte" : "Page Not Found"
    }`,
    description:
      language === "sv"
        ? "Den här sidan kunde inte hittas. Gå tillbaka till startsidan för att fortsätta använda LiU Tentor."
        : "This page could not be found. Return to the homepage to continue using LiU Tentor.",
    keywords:
      "404, page not found, sidan hittades inte, fel, error, Linköpings Universitet, LiU",
    ogTitle: `LiU Tentor | 404 - ${
      language === "sv" ? "Sidan hittades inte" : "Page Not Found"
    }`,
    ogDescription:
      language === "sv"
        ? "Den här sidan kunde inte hittas. Gå tillbaka till startsidan för att fortsätta använda LiU Tentor."
        : "This page could not be found. Return to the homepage to continue using LiU Tentor.",
    ogType: "website",
    twitterCard: "summary",
    twitterTitle: `LiU Tentor | 404 - ${
      language === "sv" ? "Sidan hittades inte" : "Page Not Found"
    }`,
    twitterDescription:
      language === "sv"
        ? "Den här sidan kunde inte hittas. Gå tillbaka till startsidan för att fortsätta använda LiU Tentor."
        : "This page could not be found. Return to the homepage to continue using LiU Tentor.",
    robots: "noindex, nofollow",
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
      <h1 className="text-6xl font-medium mb-4">404</h1>
      <p className="text-lg mb-8 text-foreground">
        {getTranslation("lostMessage") ||
          "It looks like you're lost in the academic void..."}
      </p>
      <Link to="/" className="mb-32">
        <Button
          size="lg"
          className="bg-primary text-white font-medium shadow-md hover:bg-primary/90 transition-all"
        >
          {getTranslation("goHome") || "Take me home"}
        </Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;
