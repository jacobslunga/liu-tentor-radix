import {
  GearSixIcon,
  SunIcon,
  MoonIcon,
  MonitorIcon,
  TextTIcon,
} from "@phosphor-icons/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FC, useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { useTextSize } from "@/context/TextSizeContext";
import { useTranslation } from "@/hooks/useTranslation";

type ShortcutAction =
  | "moveFacitRight"
  | "moveFacitLeft"
  | "zoomIn"
  | "zoomOut"
  | "rotateLeft"
  | "rotateRight"
  | "toggleAIChat";

const SettingsDialog: FC = () => {
  const { t } = useTranslation();
  const { setTheme, theme } = useTheme();
  const { textSize, setTextSize } = useTextSize();
  const { changeLanguage, languages, language } = useLanguage();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setSystemPrefersDark] = useState(false);

  useEffect(() => {
    const isDarkMode = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    setSystemPrefersDark(isDarkMode);

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) =>
      setSystemPrefersDark(e.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const themeOptions = [
    {
      id: "light",
      label: "Light",
      icon: <SunIcon weight="bold" className="w-5 h-5" />,
    },
    {
      id: "dark",
      label: "Dark",
      icon: <MoonIcon weight="bold" className="w-5 h-5" />,
    },
    {
      id: "system",
      label: "System",
      icon: <MonitorIcon weight="bold" className="w-5 h-5" />,
    },
  ];

  const textSizeOptions = [
    {
      id: "liten",
      label: language === "sv" ? "Liten" : "Small",
      icon: <TextTIcon weight="bold" className="w-4 h-4" />,
    },
    {
      id: "standard",
      label: "Standard",
      icon: <TextTIcon weight="bold" className="w-5 h-5" />,
    },
    {
      id: "stor",
      label: language === "sv" ? "Stor" : "Large",
      icon: <TextTIcon weight="bold" className="w-7 h-7" />,
    },
  ];

  const shortcuts: Array<{
    action: ShortcutAction;
    key: string;
    category: string;
  }> = [
    { action: "moveFacitRight", key: "→", category: "navigation" },
    { action: "moveFacitLeft", key: "←", category: "navigation" },
    { action: "toggleAIChat", key: "C", category: "navigation" },
    { action: "zoomIn", key: "+", category: "zoom" },
    { action: "zoomOut", key: "-", category: "zoom" },
    { action: "rotateLeft", key: "R", category: "rotation" },
    { action: "rotateRight", key: "L", category: "rotation" },
  ];

  const categoryTranslations = {
    search: { en: "Search", sv: "Sök" },
    navigation: { en: "Navigation", sv: "Navigering" },
    visibility: { en: "Visibility", sv: "Synlighet" },
    zoom: { en: "Zoom", sv: "Zoom" },
    rotation: { en: "Rotation", sv: "Rotation" },
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <GearSixIcon weight="bold" />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-[500px] max-h-[90%] overflow-y-auto rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl">{t("settings")}</DialogTitle>
          <DialogDescription>{t("settingsDescription")}</DialogDescription>
        </DialogHeader>

        {/* Theme Selector */}
        <div className="space-y-3">
          <h3 className="font-medium">{t("theme")}</h3>
          <div className="flex gap-2">
            {themeOptions.map(({ id, label, icon }) => (
              <div
                key={id}
                onClick={() => setTheme(id as any)}
                className={cn(
                  "flex-1 cursor-pointer rounded-md border border-border transition-all select-none",
                  "flex flex-col items-center justify-center gap-2 py-4 hover:bg-primary/5 hover:border-primary",
                  theme === id
                    ? "bg-primary/5 border-primary hover:bg-primary/10"
                    : "bg-card",
                )}
              >
                {icon}
                <span className="text-sm font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-medium">
            {language === "sv" ? "Textstorlek" : "Text Size"}
          </h3>{" "}
          <div className="flex gap-2">
            {textSizeOptions.map(({ id, label, icon }) => (
              <div
                key={id}
                onClick={() => setTextSize(id as any)}
                className={cn(
                  "flex-1 cursor-pointer rounded-md border border-border transition-all select-none",
                  "flex flex-col items-center justify-center gap-2 py-4 hover:bg-primary/5 hover:border-primary",
                  textSize === id
                    ? "bg-primary/10 border-primary hover:bg-primary/10"
                    : "bg-card",
                )}
              >
                {icon}
                <span className="text-sm font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Language Selector */}
        <div className="space-y-4">
          <h3 className="font-medium">{t("settingsLanguage")}</h3>
          <Select onValueChange={changeLanguage} value={language}>
            <SelectTrigger className="w-full">
              <SelectValue>{languages[language]}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {Object.entries(languages).map(([lang, label]) => (
                <SelectItem key={lang} value={lang}>
                  {label as string}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Keyboard Shortcuts */}
        <div className="space-y-4">
          <h3 className="font-medium">{t("settingsKeyboardShortcuts")}</h3>
          <div className="space-y-4">
            {Object.keys(categoryTranslations).map((category) => {
              const categoryShortcuts = shortcuts.filter(
                (s) => s.category === category,
              );
              if (categoryShortcuts.length === 0) return null;

              return (
                <div key={category} className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground first-letter:uppercase">
                    {
                      categoryTranslations[
                        category as keyof typeof categoryTranslations
                      ][language as "en" | "sv"]
                    }
                  </h4>
                  <div className="rounded-lg border bg-card">
                    <table className="w-full">
                      <tbody className="divide-y">
                        {categoryShortcuts.map((shortcut) => (
                          <tr key={shortcut.action} className="text-sm">
                            <td className="px-4 py-3">{t(shortcut.action)}</td>
                            <td className="px-4 py-3 text-right">
                              <kbd className="pointer-events-none inline-flex h-7 select-none items-center gap-1 rounded border bg-muted px-2 font-mono text-sm font-medium">
                                {shortcut.key}
                              </kbd>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
