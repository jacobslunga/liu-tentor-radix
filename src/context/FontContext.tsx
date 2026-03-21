import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

type FontOption = "default" | "system" | "serif";

interface FontContextType {
  font: FontOption;
  setFont: (font: FontOption) => void;
}

const FontContext = createContext<FontContextType | undefined>(undefined);

export function FontProvider({ children }: { children: ReactNode }) {
  const [font, setFontState] = useState<FontOption>(() => {
    return (localStorage.getItem("font-preference") as FontOption) ?? "default";
  });

  const setFont = (f: FontOption) => {
    setFontState(f);
    localStorage.setItem("font-preference", f);
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-font", font);
  }, [font]);

  return (
    <FontContext.Provider value={{ font, setFont }}>
      {children}
    </FontContext.Provider>
  );
}

export function useFont() {
  const ctx = useContext(FontContext);
  if (!ctx) throw new Error("useFont must be used within FontProvider");
  return ctx;
}
