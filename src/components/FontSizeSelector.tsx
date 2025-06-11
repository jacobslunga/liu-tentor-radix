import { FC } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useFontSize, FontSize } from "@/context/FontSizeContext";
import { useLanguage } from "@/context/LanguageContext";
import { Type } from "lucide-react";

const FontSizeSelector: FC = () => {
  const { fontSize, setFontSize } = useFontSize();
  const { language } = useLanguage();

  const fontSizeOptions: {
    value: FontSize;
    label: string;
    icon: string;
    description: string;
  }[] = [
    {
      value: "compact",
      label: "S",
      icon: "A",
      description:
        language === "sv"
          ? "Kompakt - Mindre text och avstånd"
          : "Compact - Smaller text and spacing",
    },
    {
      value: "regular",
      label: "M",
      icon: "A",
      description:
        language === "sv"
          ? "Normal - Standard textstorlek"
          : "Regular - Default text size",
    },
    {
      value: "sparse",
      label: "L",
      icon: "A",
      description:
        language === "sv"
          ? "Luftig - Större text och avstånd"
          : "Sparse - Larger text and spacing",
    },
  ];

  return (
    <div className="flex items-center bg-muted/30 rounded-lg p-1 border border-border/50">
      <div className="flex items-center gap-1 mr-2 px-2">
        <Type className="w-4 h-4 text-muted-foreground" />
        <span className="text-xs font-medium text-muted-foreground">
          {language === "sv" ? "Text" : "Size"}
        </span>
      </div>

      <div className="flex items-center gap-1">
        {fontSizeOptions.map((option) => (
          <TooltipProvider key={option.value} delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={fontSize === option.value ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setFontSize(option.value)}
                  className={`h-8 w-8 p-0 font-bold transition-all duration-200 ${
                    fontSize === option.value
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                  }`}
                  aria-label={option.description}
                >
                  <span
                    className={`font-bold ${
                      option.value === "compact"
                        ? "text-xs"
                        : option.value === "regular"
                        ? "text-sm"
                        : "text-base"
                    }`}
                  >
                    {option.label}
                  </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{option.description}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </div>
  );
};

export default FontSizeSelector;
