import { useLanguage } from "@/context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { useMemo } from "react";
import translations from "@/util/translations";
import { MousePointerClick } from "lucide-react";

interface Props {
  isBlurred: boolean;
}

const SolutionOverlay = ({ isBlurred }: Props) => {
  const { language } = useLanguage();

  const getTranslation = useMemo(() => {
    return (key: keyof (typeof translations)[typeof language]) => {
      return translations[language][key];
    };
  }, [language]);

  return (
    <AnimatePresence>
      {isBlurred && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
          exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
          transition={{ duration: 0.1 }}
          className="absolute inset-0 flex flex-col items-center justify-center bg-background/30 z-30"
        >
          <p className="font-medium text-center">
            {getTranslation("mouseOverDescription")}
          </p>
          <MousePointerClick className="w-7 h-7 mt-2" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SolutionOverlay;
