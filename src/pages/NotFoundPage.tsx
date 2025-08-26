import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import translations from "@/util/translations";
import { Button } from "@/components/ui/button";

const NotFoundPage: React.FC = () => {
  const { language } = useLanguage();
  const getTranslation = (key: keyof (typeof translations)[typeof language]) =>
    translations[language][key];

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
