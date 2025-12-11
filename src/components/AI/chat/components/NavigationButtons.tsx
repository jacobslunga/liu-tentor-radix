import { FC } from "react";
import {
  TooltipTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { ArrowUpIcon, ArrowDownIcon } from "@phosphor-icons/react";

interface NavigationButtonsProps {
  language: string;
  currentIndex: number;
  totalCount: number;
  onNavigate: (direction: "up" | "down") => void;
}

export const NavigationButtons: FC<NavigationButtonsProps> = ({
  language,
  currentIndex,
  totalCount,
  onNavigate,
}) => {
  // Display 1-indexed for user-friendly display
  const displayIndex = currentIndex + 1;

  return (
    <div className="absolute -top-5 right-4 flex items-center gap-1.5 z-50">
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onNavigate("up")}
              disabled={currentIndex <= 0}
              className="h-8 w-8 shadow-lg"
            >
              <ArrowUpIcon weight="bold" className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{language === "sv" ? "Föregående svar" : "Previous response"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Counter indicator */}
      <div className="px-2 py-1 bg-background border border-border rounded-md shadow-lg">
        <span className="text-xs font-medium text-muted-foreground tabular-nums">
          {displayIndex}/{totalCount}
        </span>
      </div>

      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onNavigate("down")}
              disabled={currentIndex >= totalCount - 1}
              className="h-8 w-8 shadow-lg"
            >
              <ArrowDownIcon weight="bold" className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{language === "sv" ? "Nästa svar" : "Next response"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
