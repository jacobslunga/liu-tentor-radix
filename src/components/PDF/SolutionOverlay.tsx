import { AnimatePresence, motion } from "framer-motion";

import { CursorClickIcon } from "@phosphor-icons/react";
import { useTranslation } from "@/hooks/useTranslation";

interface Props {
  isBlurred: boolean;
}

const SolutionOverlay = ({ isBlurred }: Props) => {
  const { t } = useTranslation();

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
          <p className="font-semibold text-center">
            {t("mouseOverDescription")}
          </p>
          <CursorClickIcon weight="regular" className="w-7 h-7 mt-2" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SolutionOverlay;
