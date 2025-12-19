import {
  SquareHalfIcon,
  SquareSplitHorizontalIcon,
} from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";

import { motion } from "framer-motion";
import useLayoutMode from "@/stores/LayoutModeStore";
import useTranslation from "@/hooks/useTranslation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
      icon: <SquareSplitHorizontalIcon weight="bold" className="w-5 h-5" />,
    },
    {
      value: "exam-only",
      label: t("examOnly"),
      icon: <SquareHalfIcon weight="bold" className="w-5 h-5" />,
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
      className="fixed bottom-10 left-5 z-40 hidden md:flex rounded-lg p-1"
    >
      <div className="flex items-center gap-0">
        {modes.map((mode) => {
          const isActive = layoutMode === mode.value;
          return (
            <TooltipProvider key={mode.value} delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setLayoutMode(mode.value)}
                    className={`flex border items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors ${
                      mode.value === "exam-with-facit"
                        ? "rounded-l-md"
                        : "rounded-r-md"
                    } cursor-pointer ${
                      isActive
                        ? "bg-primary text-primary-foreground border-transparent"
                        : "bg-background text-muted-foreground border-border hover:bg-accent hover:text-foreground"
                    }`}
                  >
                    {mode.icon}
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{mode.label}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </div>
    </motion.div>
  );
}
