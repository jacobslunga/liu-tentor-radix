import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import Cookies from 'js-cookie';

type FontOption = 'serif' | 'system' | 'custom';

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
  const validFonts: FontOption[] = ['serif', 'system', 'custom'];

  const [font, setFont] = useState<FontOption>(() => {
    const savedFont = Cookies.get('font') as FontOption;

    if (!savedFont || !validFonts.includes(savedFont)) {
      Cookies.remove('font');
      return 'custom';
    }

    return savedFont;
  });

  useEffect(() => {
    document.documentElement.classList.remove(
      'font-serif',
      'font-system',
      'font-custom'
    );

    document.documentElement.classList.add(`font-${font}`);

    const fontMap = {
      serif: "'IBM Plex Serif', sans-serif",
      system:
        "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
      custom: "'Outfit', monospace",
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
