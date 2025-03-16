import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import Cookies from 'js-cookie';

type FontOption = 'custom' | 'system' | 'jetbrains';

interface FontContextProps {
  font: FontOption;
  setFont: (font: FontOption) => void;
}

const FontContext = createContext<FontContextProps | undefined>(undefined);

export const useFont = () => {
  const context = useContext(FontContext);
  if (!context) {
    throw new Error('useFont must be used within a FontProvider');
  }
  return context;
};

export const FontProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [font, setFont] = useState<FontOption>(() => {
    return (Cookies.get('font') as FontOption) || 'custom';
  });

  useEffect(() => {
    document.documentElement.classList.remove(
      'font-custom',
      'font-system',
      'font-jetbrains'
    );

    document.documentElement.classList.add(`font-${font}`);

    const fontMap = {
      custom: "'Space Grotesk', sans-serif",
      system:
        "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
      jetbrains: "'Roboto Mono', monospace",
    };

    document.documentElement.style.setProperty('--user-font', fontMap[font]);

    Cookies.set('font', font, { expires: 365 });
  }, [font]);

  return (
    <FontContext.Provider value={{ font, setFont }}>
      {children}
    </FontContext.Provider>
  );
};
