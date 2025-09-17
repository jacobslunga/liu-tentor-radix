import { motion } from "framer-motion";
import { Columns2, PanelRight } from "lucide-react";
import useLayoutMode from "@/stores/LayoutModeStore";
import { useLanguage } from "@/context/LanguageContext";
import { useEffect, useMemo, useRef, useState } from "react";
import translations from "@/util/translations";

export default function LayoutSwitcher() {
  const { language } = useLanguage();

  const getTranslation = useMemo(() => {
    return (key: keyof (typeof translations)[typeof language]) => {
      return translations[language][key];
    };
  }, [language]);

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
      label: getTranslation("examAndFacit"),
      icon: <Columns2 className="w-4 h-4" />,
    },
    {
      value: "exam-only",
      label: getTranslation("examOnly"),
      icon: <PanelRight className="w-4 h-4" />,
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
      className="fixed bottom-10 left-5 z-40 hidden md:flex bg-background/70 backdrop-blur-md rounded-xl border p-1 space-x-1"
    >
      {modes.map((mode) => {
        const isActive = layoutMode === mode.value;
        return (
          <button
            key={mode.value}
            onClick={() => setLayoutMode(mode.value)}
            className="relative px-3 py-2 text-xs flex items-center gap-1 rounded-lg cursor-pointer"
          >
            {isActive && (
              <motion.div
                layoutId="active-pill"
                className="absolute inset-0 bg-primary rounded-lg z-0"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span
              className={`relative z-10 flex items-center gap-1 ${
                isActive ? "text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              {mode.icon}
              {mode.label}
            </span>
          </button>
        );
      })}
    </motion.div>
  );
}
