import { FC } from "react";
import {
  TooltipTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import {
  CaretRightIcon,
  CheckCircleIcon,
  ChatCircleDotsIcon,
  XCircleIcon,
} from "@phosphor-icons/react";

interface ChatHeaderProps {
  language: string;
  hasSolutions: boolean;
  onClose: () => void;
}

export const ChatHeader: FC<ChatHeaderProps> = ({
  language,
  hasSolutions,
  onClose,
}) => {
  return (
    <div className="shrink-0 flex items-center justify-between p-3 z-40">
      <div className="flex items-center gap-2">
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-accent/50"
              >
                <CaretRightIcon weight="bold" className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{language === "sv" ? "Stäng" : "Close"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium cursor-default transition-colors ${
                  hasSolutions
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "bg-muted/50 text-muted-foreground"
                }`}
              >
                {hasSolutions ? (
                  <CheckCircleIcon weight="fill" className="h-3.5 w-3.5" />
                ) : (
                  <XCircleIcon weight="bold" className="h-3.5 w-3.5" />
                )}
                <span>{language === "sv" ? "Lösning" : "Solution"}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>
                {hasSolutions
                  ? language === "sv"
                    ? "Lösning tillgänglig"
                    : "Solution available"
                  : language === "sv"
                    ? "Ingen lösning uppladdad"
                    : "No solution uploaded"}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open("/feedback", "_blank")}
              className="h-8 gap-1.5 px-3 rounded-full text-xs text-muted-foreground hover:text-foreground hover:bg-accent/50"
            >
              <ChatCircleDotsIcon weight="bold" className="h-4 w-4" />
              <span>Feedback</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>
              {language === "sv"
                ? "Ge feedback om AI-chatten"
                : "Give feedback about the AI chat"}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
