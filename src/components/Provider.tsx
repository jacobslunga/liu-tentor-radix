import { AuthProvider } from '@/context/AuthContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { ShowAiDialogProvider } from '@/context/ShowAiDialogContext';
import { ShowGlobalSearchProvider } from '@/context/ShowGlobalSearchContext';
import { TextSizeProvider } from '@/context/TextSizeContext';
import { ThemeProvider } from '@/context/ThemeContext';

export default function Provider({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <TextSizeProvider>
          <ShowAiDialogProvider>
            <LanguageProvider>
              <ShowGlobalSearchProvider>{children}</ShowGlobalSearchProvider>
            </LanguageProvider>
          </ShowAiDialogProvider>
        </TextSizeProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
