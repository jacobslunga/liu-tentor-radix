import { AuthProvider } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { ShowGlobalSearchProvider } from "@/context/ShowGlobalSearchContext";
import { FontSizeProvider } from "@/context/FontSizeContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";

export default function Provider({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <AuthProvider>
          <ThemeProvider>
            <FontSizeProvider>
              <LanguageProvider>
                <ShowGlobalSearchProvider>{children}</ShowGlobalSearchProvider>
              </LanguageProvider>
            </FontSizeProvider>
          </ThemeProvider>
        </AuthProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
}
