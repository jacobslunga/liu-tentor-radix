import { Columns2, PanelRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { motion } from "framer-motion";
import useLayoutMode from "@/stores/LayoutModeStore";
import useTranslation from "@/hooks/useTranslation";

export default function LayoutSwitcher() {
  const { t } = useTranslation();

  const { layoutMode, setLayoutMode } = useLayoutMode();

  const [isMouseActive, setIsMouseActive] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isHoveringRef = useRef(isHovering);

  useEffect(() => {
    isHoveringRef.current = isHovering;
  }, [isHovering]);

  useEffect(() => {
    const handleMouseMove = () => {
      setIsMouseActive(true);

      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(() => {
        if (!isHoveringRef.current) setIsMouseActive(false);
      }, 1000);
    };

    handleMouseMove();

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const modes: {
    value: "exam-with-facit" | "exam-only";
    label: string;
    icon: React.ReactNode;
  }[] = [
    {
      value: "exam-with-facit",
      label: t("examAndFacit"),
      icon: <Columns2 className="w-5 h-5" />,
    },
    {
      value: "exam-only",
      label: t("examOnly"),
      icon: <PanelRight className="w-5 h-5" />,
    },
  ];

  return (
    <motion.div
      onMouseEnter={() => {
        setIsHovering(true);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      }}
      onMouseLeave={() => setIsHovering(false)}
      initial={{ opacity: 1 }}
      animate={{ opacity: isMouseActive || isHovering ? 1 : 0 }}
      transition={{ duration: 0.1 }}
      style={{
        pointerEvents: isMouseActive || isHovering ? "auto" : "none",
      }}
      className="fixed bottom-10 left-5 z-40 hidden md:flex bg-background rounded-full corner-squircle border p-1 space-x-1"
    >
      {modes.map((mode) => {
        const isActive = layoutMode === mode.value;
        return (
          <button
            key={mode.value}
            onClick={() => setLayoutMode(mode.value)}
            className="relative px-3 py-1 text-xs flex items-center gap-1 rounded-full corner-squircle cursor-pointer"
          >
            {isActive && (
              <motion.div
                layoutId="active-pill"
                className="absolute inset-0 bg-primary rounded-full corner-squircle z-0"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span
              className={`relative z-10 flex items-center gap-1 ${
                isActive ? "text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              {mode.icon}
            </span>
          </button>
        );
      })}
    </motion.div>
  );
}
