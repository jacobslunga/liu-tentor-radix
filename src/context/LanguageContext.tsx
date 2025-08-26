import Cookies from 'js-cookie';
import { createContext, FC, useContext, useEffect, useState } from 'react';

const LanguageContext = createContext<any>(null);

export const useLanguage = () => useContext(LanguageContext);

const languages = {
  sv: 'Svenska',
  en: 'English',
};

export const LanguageProvider: FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguage] = useState<string>('sv');

  useEffect(() => {
    const storedLanguage = Cookies.get('language');
    if (storedLanguage) {
      setLanguage(storedLanguage);
    } else {
      setLanguage('sv');
    }
  }, []);

  const changeLanguage = (lang: string) => {
    setLanguage(lang);
    Cookies.set('language', lang, {
      expires: 365,
      domain:
        window.location.hostname === 'liutentor.se'
          ? '.liutentor.se'
          : undefined,
      sameSite: 'Lax',
    });
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, languages }}>
      {children}
    </LanguageContext.Provider>
  );
};
