import { LanguageProvider } from "@/context/LanguageContext";
import { TextSizeProvider } from "@/context/TextSizeContext";
import { ThemeProvider } from "@/context/ThemeContext";

export default function Provider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <TextSizeProvider>
        <LanguageProvider>{children}</LanguageProvider>
      </TextSizeProvider>
    </ThemeProvider>
  );
}
