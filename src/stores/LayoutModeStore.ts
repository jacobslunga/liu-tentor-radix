import { create } from "zustand";
import { persist } from "zustand/middleware";

type LayoutMode = "exam-only" | "exam-with-facit";

type LayoutModeStore = {
  layoutMode: LayoutMode;
  setLayoutMode: (mode: LayoutMode) => void;
  toggleMode: () => void;
};

const useLayoutMode = create<LayoutModeStore>()(
  persist(
    (set) => ({
      layoutMode: "exam-with-facit",
      setLayoutMode: (mode) => set({ layoutMode: mode }),
      toggleMode: () =>
        set((state) => ({
          layoutMode:
            state.layoutMode === "exam-only" ? "exam-with-facit" : "exam-only",
        })),
    }),
    {
      name: "layout-mode",
    }
  )
);

export default useLayoutMode;
