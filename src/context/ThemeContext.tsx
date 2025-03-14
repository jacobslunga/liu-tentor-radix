import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Helmet } from 'react-helmet';

type BaseTheme = 'light' | 'dark' | 'paper' | 'system';
type EffectiveTheme = 'light' | 'dark' | 'paper-light' | 'paper-dark';

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
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<BaseTheme>(() => {
    const storedTheme = localStorage.getItem('theme');
    return storedTheme ? (storedTheme as BaseTheme) : 'system';
  });

  const [effectiveTheme, setEffectiveTheme] = useState<EffectiveTheme>('light');
  const themes: BaseTheme[] = ['light', 'dark', 'system', 'paper'];

  const getSystemTheme = () =>
    window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';

  useEffect(() => {
    const root = window.document.documentElement;
    const body = document.body;

    const applyTheme = (baseTheme: BaseTheme) => {
      let appliedTheme: EffectiveTheme;
      root.className = '';
      body.className = '';

      if (baseTheme === 'system') {
        appliedTheme = getSystemTheme();
        root.className = appliedTheme;
        body.className = appliedTheme;
      } else if (baseTheme === 'paper') {
        root.classList.add('paper');
        if (getSystemTheme() === 'dark') {
          root.classList.add('dark');
          appliedTheme = 'paper-dark';
        } else {
          appliedTheme = 'paper-light';
        }
      } else {
        appliedTheme = baseTheme;
        root.className = baseTheme;
        body.className = baseTheme;
      }

      setEffectiveTheme(appliedTheme);
    };

    applyTheme(theme);

    const handleSystemThemeChange = (_: MediaQueryListEvent) => {
      if (theme === 'system' || theme === 'paper') {
        applyTheme(theme);
      }
    };

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', handleSystemThemeChange);

    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, [theme]);

  const changeTheme = (newTheme: BaseTheme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const getFaviconUrl = (theme: EffectiveTheme) => {
    switch (theme) {
      case 'light':
        return '/light-favicon.svg';
      case 'dark':
        return '/dark-favicon.svg';
      case 'paper-dark':
        return '/paper-dark-favicon.svg';
      case 'paper-light':
        return '/paper-light-favicon.svg';
      default:
        return '/light-favicon.svg';
    }
  };

  return (
    <ThemeContext.Provider
      value={{ theme, effectiveTheme, setTheme: changeTheme, themes }}
    >
      <Helmet>
        <link rel='icon' href={getFaviconUrl(effectiveTheme)} />
      </Helmet>
      <div
        className={
          theme === 'paper'
            ? `paper ${effectiveTheme.includes('dark') ? 'dark' : ''}`
            : theme === 'system'
            ? getSystemTheme()
            : theme
        }
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
};
