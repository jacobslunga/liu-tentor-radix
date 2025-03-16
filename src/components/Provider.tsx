import { AuthProvider } from '@/context/AuthContext';
import { FontProvider } from '@/context/FontContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { ShowGlobalSearchProvider } from '@/context/ShowGlobalSearchContext';
import { TextSizeProvider } from '@/context/TextSizeContext';
import { ThemeProvider } from '@/context/ThemeContext';

export default function Provider({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <TextSizeProvider>
          <FontProvider>
            <LanguageProvider>
              <ShowGlobalSearchProvider>{children}</ShowGlobalSearchProvider>
            </LanguageProvider>
          </FontProvider>
        </TextSizeProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
