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
    <div className="shrink-0 bg-background border-b border-border h-14 z-40">
      <div className="px-3 py-2 flex items-center justify-between h-full">
        <div className="flex items-center gap-2">
          {/* Close Button Group */}
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="h-9 w-9 hover:bg-accent"
                >
                  <CaretRightIcon weight="bold" className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{language === "sv" ? "Stäng" : "Close"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Solution Badge - Now the star of the show */}
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className={`flex items-center gap-1.5 px-2.5 py-1 border rounded-md cursor-default transition-colors ${
                    hasSolutions
                      ? "bg-emerald-500/15 border-emerald-500/20 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400"
                      : "bg-muted/30 border-dashed border-border text-muted-foreground/60"
                  }`}
                >
                  {hasSolutions ? (
                    <CheckCircleIcon weight="fill" className="h-3.5 w-3.5" />
                  ) : (
                    <XCircleIcon weight="bold" className="h-3.5 w-3.5" />
                  )}
                  <span className="text-xs font-medium">
                    {language === "sv" ? "Lösning" : "Solution"}
                  </span>
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

        {/* Feedback Button */}
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open("/feedback", "_blank")}
                className="text-xs gap-1.5 h-8 px-2"
              >
                <ChatCircleDotsIcon weight="bold" className="h-3.5 w-3.5" />
                {language === "sv" ? "Feedback" : "Feedback"}
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
    </div>
  );
};
