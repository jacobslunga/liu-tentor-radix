import { useState, useEffect } from "react";
import Cookies from "js-cookie";

export const useCompletedExams = () => {
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
      return {
        ...prev,
        [id]: newCompletedState,
      };
    });
  };

  return { completedExams, toggleCompleted };
};
