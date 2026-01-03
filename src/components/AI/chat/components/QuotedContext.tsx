import { FC, memo } from "react";
import { motion } from "framer-motion";
import { XIcon } from "@phosphor-icons/react";

interface QuotedContextProps {
  text: string;
  language: string;
  onClear: () => void;
}

export const QuotedContext: FC<QuotedContextProps> = memo(
  ({ text, language, onClear }) => {
    const displayText = text.length > 150 ? text.slice(0, 150) + "..." : text;

    return (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        className="mb-2"
      >
        <div className="bg-secondary/50 border border-border rounded-lg p-3 relative group">
          <div className="flex items-start gap-2">
            <div className="w-1 h-full min-h-5 bg-primary rounded-full shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground mb-1 font-medium">
                {language === "sv" ? "Frågar om:" : "Asking about:"}
              </p>
              <p className="text-sm text-foreground leading-relaxed line-clamp-3">
                {displayText}
              </p>
            </div>
            <button
              onClick={onClear}
              className="shrink-0 p-1 rounded-md hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
              aria-label={
                language === "sv" ? "Ta bort kontext" : "Remove context"
              }
            >
              <XIcon weight="bold" className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </motion.div>
    );
  }
);

QuotedContext.displayName = "QuotedContext";
