import ChatWindowProvider from "@/context/ChatWindowContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { TextSizeProvider } from "@/context/TextSizeContext";
import { ThemeProvider } from "@/context/ThemeContext";

export default function Provider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <TextSizeProvider>
        <ChatWindowProvider>
          <LanguageProvider>{children}</LanguageProvider>
        </ChatWindowProvider>
      </TextSizeProvider>
    </ThemeProvider>
  );
}
