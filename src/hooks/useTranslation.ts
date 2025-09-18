import { useLanguage } from "@/context/LanguageContext";
import translations, { Language, Translations } from "@/util/translations";

/**
 * Custom hook for getting translations
 * Provides a clean API for accessing translations throughout the app
 */
export const useTranslation = () => {
  const { language } = useLanguage();

  /**
   * Get a translation for a specific key
   * @param key - The translation key
   * @returns The translated string
   */
  const t = (key: keyof Translations): string => {
    return translations[language as Language][key] || key;
  };

  /**
   * Get a translation with fallback
   * @param key - The translation key
   * @param fallback - Fallback text if translation is missing
   * @returns The translated string or fallback
   */
  const tWithFallback = (key: keyof Translations, fallback: string): string => {
    return translations[language as Language][key] || fallback;
  };

  /**
   * Check if current language is Swedish
   */
  const isSwedish = language === "sv";

  /**
   * Check if current language is English
   */
  const isEnglish = language === "en";

  return {
    t,
    tWithFallback,
    language: language as Language,
    isSwedish,
    isEnglish,
  };
};

export default useTranslation;
