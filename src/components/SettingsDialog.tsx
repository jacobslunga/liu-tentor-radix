import {
  GearSixIcon,
  SunIcon,
  MoonIcon,
  MonitorIcon,
  DropHalfIcon,
} from "@phosphor-icons/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FC } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { useTextSize } from "@/context/TextSizeContext";
import { useTranslation } from "@/hooks/useTranslation";

type ShortcutAction =
  | "moveFacitRight"
  | "moveFacitLeft"
  | "toggleShowFacit"
  | "zoomIn"
  | "zoomOut"
  | "rotateLeft"
  | "rotateRight"
  | "toggleAIChat";

const Divider = () => <div className="h-px bg-border" />;

const SectionLabel: FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
    {children}
  </p>
);

const SettingsDialog: FC = () => {
  const { t } = useTranslation();
  const { setTheme, theme } = useTheme();
  const { textSize, setTextSize } = useTextSize();
  const { changeLanguage, languages, language } = useLanguage();

  const sv = language === "sv";

  const themeOptions = [
    {
      id: "light",
      label: sv ? "Ljust" : "Light",
      icon: <SunIcon weight="bold" className="w-3.5 h-3.5 shrink-0" />,
    },
    {
      id: "dim",
      label: "Dim",
      icon: <DropHalfIcon weight="bold" className="w-3.5 h-3.5 shrink-0" />,
    },
    {
      id: "dark",
      label: sv ? "Mörkt" : "Dark",
      icon: <MoonIcon weight="bold" className="w-3.5 h-3.5 shrink-0" />,
    },
    {
      id: "system",
      label: sv ? "System" : "System",
      icon: <MonitorIcon weight="bold" className="w-3.5 h-3.5 shrink-0" />,
    },
  ];

  const textSizeOptions = [
    { id: "liten", label: sv ? "Liten" : "Small" },
    { id: "standard", label: sv ? "Standard" : "Default" },
    { id: "stor", label: sv ? "Stor" : "Large" },
  ];

  const shortcuts: Array<{
    action: ShortcutAction;
    key: string;
    category: string;
  }> = [
    { action: "moveFacitRight", key: "→", category: "navigation" },
    { action: "moveFacitLeft", key: "←", category: "navigation" },
    { action: "toggleShowFacit", key: "E", category: "visibility" },
    { action: "toggleAIChat", key: "C", category: "visibility" },
  ];

  const categoryLabels: Record<string, Record<"en" | "sv", string>> = {
    navigation: { en: "Navigation", sv: "Navigering" },
    visibility: { en: "Visibility", sv: "Synlighet" },
  };

  const chipClass = (active: boolean) =>
    cn(
      "flex items-center justify-center gap-1.5 py-1.5 rounded-md border text-[11px] font-medium transition-colors select-none cursor-pointer",
      active
        ? "bg-primary/10 border-primary text-primary"
        : "border-border text-foreground hover:bg-muted",
    );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <GearSixIcon weight="bold" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={6}
        className="w-56 p-3 flex flex-col gap-3"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <p className="text-xs font-semibold">{t("settings")}</p>

        <Divider />

        <div className="flex flex-col gap-1.5">
          <SectionLabel>{t("theme")}</SectionLabel>
          <div className="grid grid-cols-2 gap-1">
            {themeOptions.map(({ id, label, icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setTheme(id as any)}
                className={chipClass(theme === id)}
              >
                {icon}
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        <Divider />

        <div className="flex flex-col gap-1.5">
          <SectionLabel>{sv ? "Textstorlek" : "Text size"}</SectionLabel>
          <div className="grid grid-cols-3 gap-1">
            {textSizeOptions.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => setTextSize(id as any)}
                className={chipClass(textSize === id)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <Divider />

        <div className="flex flex-col gap-1.5">
          <SectionLabel>{t("settingsLanguage")}</SectionLabel>
          <Select onValueChange={changeLanguage} value={language}>
            <SelectTrigger className="h-7 text-xs">
              <SelectValue>{languages[language]}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {Object.entries(languages).map(([lang, label]) => (
                <SelectItem key={lang} value={lang} className="text-xs">
                  {label as string}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Divider />

        <div className="flex flex-col gap-2">
          <SectionLabel>{t("settingsKeyboardShortcuts")}</SectionLabel>
          {Object.keys(categoryLabels).map((category) => {
            const items = shortcuts.filter((s) => s.category === category);
            if (!items.length) return null;
            return (
              <div key={category} className="flex flex-col gap-0.5">
                <p className="text-[10px] text-muted-foreground/50 mb-0.5">
                  {categoryLabels[category][language as "en" | "sv"]}
                </p>
                <div className="rounded-md border border-border divide-y divide-border overflow-hidden">
                  {items.map((s) => (
                    <div
                      key={s.action}
                      className="flex items-center justify-between px-2.5 py-1.5"
                    >
                      <span className="text-[11px]">{t(s.action)}</span>
                      <kbd className="inline-flex h-5 items-center rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium">
                        {s.key}
                      </kbd>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SettingsDialog;
