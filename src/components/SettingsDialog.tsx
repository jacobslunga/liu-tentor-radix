import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import translations from "@/util/translations";
import { FC, JSX, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  MoonIcon,
  SunIcon,
  GearIcon,
  DeviceDesktopIcon,
} from "@primer/octicons-react";

const SettingsDialog: FC = () => {
  const { setTheme, theme } = useTheme();
  const { changeLanguage, languages, language } = useLanguage();
  const [_, setSystemPrefersDark] = useState(false);
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    const platform = window.navigator.platform.toLowerCase();
    setIsMac(platform.includes("mac"));
  }, []);

  const modifierKey = isMac ? "⌘" : "Ctrl";

  useEffect(() => {
    const isDarkMode = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setSystemPrefersDark(isDarkMode);

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) =>
      setSystemPrefersDark(e.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const getTranslation = (
    key: keyof (typeof translations)[typeof language]
  ) => {
    return translations[language][key];
  };

  const themeOptions: {
    id: "light" | "dark" | "system";
    label: string;
    icon: JSX.Element;
  }[] = [
    {
      id: "light",
      label: "Light",
      icon: <SunIcon className="w-5 h-5" />,
    },
    {
      id: "dark",
      label: "Dark",
      icon: <MoonIcon className="w-5 h-5" />,
    },
    {
      id: "system",
      label: "System",
      icon: <DeviceDesktopIcon className="w-5 h-5" />,
    },
  ];

  const shortcuts = [
    { action: "globalSearch", key: `${modifierKey} + K`, category: "search" },
    { action: "moveFacitRight", key: "→", category: "navigation" },
    { action: "moveFacitLeft", key: "←", category: "navigation" },
    { action: "toggleShowFacit", key: "T", category: "visibility" },
    { action: "zoomIn", key: "+", category: "zoom" },
    { action: "zoomOut", key: "-", category: "zoom" },
    { action: "rotateLeft", key: "R", category: "rotation" },
    { action: "rotateRight", key: "L", category: "rotation" },
    { action: "toggleExamToolbar", key: "A", category: "visibility" },
    { action: "toggleExam", key: "E", category: "visibility" },
    { action: "toggleFacitToolbar", key: "P", category: "visibility" },
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
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-muted/50 transition-colors"
        >
          <GearIcon className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto border-border/50 bg-background/95 backdrop-blur-sm">
        <DialogHeader className="space-y-4 pb-6 border-b border-border/50">
          <DialogTitle className="text-2xl font-semibold flex items-center gap-3">
            <div className="bg-primary/10 rounded-lg p-2">
              <GearIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-foreground">{getTranslation("settings")}</h2>
              <p className="text-sm text-muted-foreground font-normal">
                {getTranslation("settingsDescription")}
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* Theme Selector */}
        <div className="space-y-4 bg-muted/20 rounded-xl p-6">
          <div className="space-y-2">
            <h3 className="font-semibold text-foreground">
              {getTranslation("theme")}
            </h3>
            <p className="text-sm text-muted-foreground">
              {getTranslation("themeDescription")}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {themeOptions.map(({ id, label, icon }) => (
              <div
                key={id}
                onClick={() => setTheme(id)}
                className={cn(
                  "cursor-pointer rounded-lg border transition-all duration-200",
                  "flex flex-col items-center justify-center gap-3 py-4 px-3",
                  theme === id
                    ? "bg-primary/10 border-primary text-primary"
                    : "bg-background border-border/50 hover:bg-muted/30 hover:border-border"
                )}
              >
                {icon}
                <span className="text-sm font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Language Selector */}
        <div className="space-y-4 bg-muted/20 rounded-xl p-6">
          <div className="space-y-2">
            <h3 className="font-semibold text-foreground">
              {getTranslation("settingsLanguage")}
            </h3>
            <p className="text-sm text-muted-foreground">
              {language === "sv"
                ? "Välj ditt föredragna språk"
                : "Choose your preferred language"}
            </p>
          </div>
          <Select onValueChange={changeLanguage} value={language}>
            <SelectTrigger className="w-full bg-background border-border/50 h-12">
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
        <div className="space-y-4 bg-muted/20 rounded-xl p-6">
          <div className="space-y-2">
            <h3 className="font-semibold text-foreground">
              {getTranslation("settingsKeyboardShortcuts")}
            </h3>
            <p className="text-sm text-muted-foreground">
              {language === "sv"
                ? "Tangentbordskombinationer för snabbare navigation"
                : "Keyboard combinations for faster navigation"}
            </p>
          </div>
          <div className="space-y-6">
            {Object.keys(categoryTranslations).map((category) => {
              const categoryShortcuts = shortcuts.filter(
                (s) => s.category === category
              );
              if (categoryShortcuts.length === 0) return null;

              return (
                <div key={category} className="space-y-3">
                  <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <div className="h-1 w-4 bg-primary/30 rounded-full"></div>
                    {
                      categoryTranslations[
                        category as keyof typeof categoryTranslations
                      ][language as "en" | "sv"]
                    }
                  </h4>
                  <div className="rounded-lg border border-border/50 bg-background overflow-hidden">
                    <table className="w-full">
                      <tbody className="divide-y divide-border/30">
                        {categoryShortcuts.map((shortcut) => (
                          <tr
                            key={shortcut.action}
                            className="text-sm hover:bg-muted/20 transition-colors"
                          >
                            <td className="px-4 py-3 font-medium text-foreground">
                              {getTranslation(
                                shortcut.action as keyof (typeof translations)[typeof language]
                              )}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <kbd className="inline-flex h-8 select-none items-center gap-1 rounded-lg border border-border/50 bg-muted/50 px-3 font-mono text-xs font-medium text-muted-foreground">
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
