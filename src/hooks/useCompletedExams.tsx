import { useLanguage } from "@/context/LanguageContext";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import translations from "@/util/translations";
import { toast } from "sonner";
import { Check, X } from "lucide-react";

export const useCompletedExams = () => {
  const { language } = useLanguage();

  const [completedExams, setCompletedExamsState] = useState<
    Record<number, boolean>
  >(() => {
    const cookieConsent = Cookies.get("cookieConsent");
    if (cookieConsent === "true") {
      const stored = Cookies.get("completedExams");
      return stored ? JSON.parse(stored) : {};
    }
    return {};
  });

  useEffect(() => {
    const cookieConsent = Cookies.get("cookieConsent");
    if (cookieConsent === "true") {
      Cookies.set("completedExams", JSON.stringify(completedExams), {
        secure: true,
        domain:
          window.location.hostname === "liutentor.se"
            ? ".liutentor.se"
            : undefined,
        sameSite: "Lax",
        expires: 365 * 100,
      });
    }
  }, [completedExams]);

  const toggleCompleted = (id: number) => {
    setCompletedExamsState((prev) => {
      const newCompletedState = !prev[id];

      const message = newCompletedState
        ? translations[language]["markedAsCompleted"]
        : translations[language]["unMarkedAsCompleted"];
      toast(message, {
        description: newCompletedState ? translations[language]["goodJob"] : "",
        icon: newCompletedState ? (
          <Check className="w-5 h-5 text-primary" />
        ) : (
          <X className="w-5 h-5 text-red-500" />
        ),
      });

      return {
        ...prev,
        [id]: newCompletedState,
      };
    });
  };

  return { completedExams, toggleCompleted };
};
