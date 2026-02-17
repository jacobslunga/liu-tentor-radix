import {
  SquareHalfIcon,
  SquareSplitHorizontalIcon,
} from "@phosphor-icons/react";

import useLayoutMode from "@/stores/LayoutModeStore";
import { useTranslation } from "@/hooks/useTranslation";

export default function LayoutSwitcher() {
  const { t } = useTranslation();

  const { layoutMode, setLayoutMode } = useLayoutMode();

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
    <div className="fixed bottom-10 left-5 z-40 hidden md:flex rounded-lg p-1 bg-transparent">
      <div className="flex items-center gap-0">
        {modes.map((mode) => {
          const isActive = layoutMode === mode.value;
          return (
            <button
              onClick={() => setLayoutMode(mode.value)}
              className={`flex items-center border gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors ${
                mode.value === "exam-with-facit"
                  ? "rounded-l-lg"
                  : "rounded-r-lg"
              } cursor-pointer ${
                isActive
                  ? "bg-primary text-primary-foreground border-transparent"
                  : "bg-background text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              {mode.icon}
            </button>
          );
        })}
      </div>
    </div>
  );
}
