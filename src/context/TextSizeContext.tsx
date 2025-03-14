import Cookies from 'js-cookie';
import React, { createContext, useContext, useEffect, useState } from 'react';

type TextSize = 'stor' | 'standard' | 'liten';

interface TextSizeContextProps {
  textSize: TextSize;
  setTextSize: (size: TextSize) => void;
}

const TextSizeContext = createContext<TextSizeContextProps>({
  textSize: 'liten',
  setTextSize: () => {},
});

export const TextSizeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [textSize, setTextSize] = useState<TextSize>('standard');

  useEffect(() => {
    const savedTextSize = Cookies.get('textSize') as TextSize;
    if (savedTextSize) {
      setTextSize(savedTextSize);
    }
  }, []);

  const updateTextSize = (size: TextSize) => {
    const cookieConsent = Cookies.get('cookieConsent');
    if (cookieConsent === 'true') {
      Cookies.set('textSize', size, {
        expires: 365,
        domain:
          window.location.hostname === 'liutentor.se'
            ? '.liutentor.se'
            : undefined,
        sameSite: 'Lax',
      });
    }
    setTextSize(size);
  };

  return (
    <TextSizeContext.Provider value={{ textSize, setTextSize: updateTextSize }}>
      {children}
    </TextSizeContext.Provider>
  );
};

export const useTextSize = (): TextSizeContextProps => {
  const context = useContext(TextSizeContext);
  if (!context) {
    throw new Error('useTextSize must be used within a TextSizeProvider');
  }
  return context;
};
