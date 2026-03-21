import ChatWindowProvider from "@/context/ChatWindowContext";
import { FontProvider } from "@/context/FontContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { TextSizeProvider } from "@/context/TextSizeContext";
import { ThemeProvider } from "@/context/ThemeContext";

export default function Provider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <TextSizeProvider>
        <FontProvider>
          <ChatWindowProvider>
            <LanguageProvider>{children}</LanguageProvider>
          </ChatWindowProvider>
        </FontProvider>
      </TextSizeProvider>
    </ThemeProvider>
  );
}
