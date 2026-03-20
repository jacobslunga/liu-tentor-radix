import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

type BaseTheme = "light" | "dark" | "system";
type EffectiveTheme = "light" | "dark";

interface ThemeContextProps {
  theme: BaseTheme;
  effectiveTheme: EffectiveTheme;
  setTheme: (theme: BaseTheme) => void;
  themes: BaseTheme[];
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<BaseTheme>(() => {
    const stored = localStorage.getItem("theme");
    if (!stored || stored === "dim") {
      localStorage.setItem("theme", "system");
      return "system";
    }
    return stored as BaseTheme;
  });

  const [effectiveTheme, setEffectiveTheme] = useState<EffectiveTheme>("light");
  const themes: BaseTheme[] = ["light", "dark", "system"];

  const getSystemTheme = (): EffectiveTheme =>
    window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";

  useEffect(() => {
    const root = window.document.documentElement;
    const body = document.body;

    const applyTheme = (baseTheme: BaseTheme) => {
      const applied: EffectiveTheme =
        baseTheme === "system" ? getSystemTheme() : baseTheme;
      root.className = applied;
      body.className = applied;
      setEffectiveTheme(applied);
    };

    applyTheme(theme);

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (theme === "system") applyTheme(theme);
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  const changeTheme = (newTheme: BaseTheme) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <ThemeContext.Provider
      value={{ theme, effectiveTheme, setTheme: changeTheme, themes }}
    >
      <div className={`theme-${effectiveTheme}`}>{children}</div>
    </ThemeContext.Provider>
  );
};
