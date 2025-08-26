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
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<BaseTheme>(() => {
    const storedTheme = localStorage.getItem("theme");
    return storedTheme ? (storedTheme as BaseTheme) : "system";
  });

  const [effectiveTheme, setEffectiveTheme] = useState<EffectiveTheme>("light");
  const themes: BaseTheme[] = ["light", "dark", "system"];

  const getSystemTheme = () =>
    window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";

  useEffect(() => {
    const root = window.document.documentElement;
    const body = document.body;

    const applyTheme = (baseTheme: BaseTheme) => {
      let appliedTheme: EffectiveTheme;
      root.className = "";
      body.className = "";

      if (baseTheme === "system") {
        appliedTheme = getSystemTheme();
        root.className = appliedTheme;
        body.className = appliedTheme;
      } else {
        appliedTheme = baseTheme;
        root.className = baseTheme;
        body.className = baseTheme;
      }

      setEffectiveTheme(appliedTheme);
    };

    applyTheme(theme);

    const handleSystemThemeChange = (_: MediaQueryListEvent) => {
      if (theme === "system") {
        applyTheme(theme);
      }
    };

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", handleSystemThemeChange);

    return () => {
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
    };
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
