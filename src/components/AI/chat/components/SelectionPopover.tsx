import { FC, memo, useEffect, useState } from "react";
import { createPortal } from "react-dom"; // <--- IMPORT THIS
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChatCircleDotsIcon } from "@phosphor-icons/react";

interface SelectionPopoverProps {
  show: boolean;
  position: { x: number; y: number } | null;
  language: string;
  onAskAbout: () => void;
}

export const SelectionPopover: FC<SelectionPopoverProps> = memo(
  ({ show, position, language, onAskAbout }) => {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    if (!mounted || !position) return null;

    return createPortal(
      <AnimatePresence>
        {show && (
          <motion.div
            data-selection-popover
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1, ease: "easeOut" }}
            className="fixed z-9999 pointer-events-auto"
            style={{
              left: position.x,
              top: Math.max(0, position.y - 20),
              transform: "translate(-50%, -100%)",
            }}
          >
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onAskAbout();
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <ChatCircleDotsIcon weight="bold" className="h-3.5 w-3.5" />
              {language === "sv" ? "Fråga om detta" : "Ask about this"}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body,
    );
  },
);

SelectionPopover.displayName = "SelectionPopover";
