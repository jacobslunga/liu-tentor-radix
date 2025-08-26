import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLanguage } from "@/context/LanguageContext";
import translations from "@/util/translations";
import { motion } from "framer-motion";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const CookieBanner = () => {
  const { language } = useLanguage();

  const getTranslation = (
    key: keyof (typeof translations)[typeof language]
  ) => {
    return translations[language][key];
  };

  const [isBannerVisible, setBannerVisible] = useState<boolean>(true);

  useEffect(() => {
    const cookieConsent = Cookies.get("cookieConsent");
    if (cookieConsent === "true") {
      setBannerVisible(false);
    }
  }, []);

  const handleAccept = () => {
    Cookies.set("cookieConsent", "true", { expires: 365 });
    setBannerVisible(false);
  };

  const handleReject = () => {
    Cookies.set("cookieConsent", "false", { expires: 365 });
    setBannerVisible(false);
  };

  if (!isBannerVisible) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.5 }}
      className="fixed bottom-0 left-0 w-full bg-background shadow-lg z-50"
      role="dialog"
      aria-labelledby="cookie-banner-title"
      aria-describedby="cookie-banner-description"
    >
      <Card className="p-4 w-full max-w-3xl mx-auto mb-4">
        <CardHeader>
          <CardTitle id="cookie-banner-title">
            {getTranslation("cookieBannerText")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription id="cookie-banner-description">
            {getTranslation("cookieBannerDescription")}
          </CardDescription>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button
            onClick={handleAccept}
            aria-label={getTranslation("acceptCookie")}
          >
            {getTranslation("acceptCookie")}
          </Button>
          <Button
            variant="secondary"
            onClick={handleReject}
            aria-label={getTranslation("rejectCookie")}
          >
            {getTranslation("rejectCookie")}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default CookieBanner;
