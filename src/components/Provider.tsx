import { AuthProvider } from '@/context/AuthContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { ShowGlobalSearchProvider } from '@/context/ShowGlobalSearchContext';
import { TextSizeProvider } from '@/context/TextSizeContext';
import { ThemeProvider } from '@/context/ThemeContext';

export default function Provider({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <TextSizeProvider>
          <LanguageProvider>
            <ShowGlobalSearchProvider>{children}</ShowGlobalSearchProvider>
          </LanguageProvider>
        </TextSizeProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
