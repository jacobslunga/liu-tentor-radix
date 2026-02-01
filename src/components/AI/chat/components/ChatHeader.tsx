import { FC, memo } from "react";
import {
  TooltipTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import {
  CaretRightIcon,
  CaretLeftIcon,
  CheckCircleIcon,
  ChatCircleDotsIcon,
  XCircleIcon,
} from "@phosphor-icons/react";

interface ChatHeaderProps {
  language: string;
  hasSolution: boolean;
  onClose: () => void;
  side: "left" | "right";
}

export const ChatHeader: FC<ChatHeaderProps> = memo(
  ({ language, hasSolution, onClose, side }) => {
    return (
      <div className="shrink-0 flex items-center justify-between p-3 z-40">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-accent/50"
          >
            {side === "right" ? (
              <CaretRightIcon weight="bold" className="h-5 w-5" />
            ) : (
              <CaretLeftIcon weight="bold" className="h-5 w-5" />
            )}
          </Button>

          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium cursor-default transition-colors ${
                    hasSolution
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : "bg-muted/50 text-muted-foreground"
                  }`}
                >
                  {hasSolution ? (
                    <CheckCircleIcon weight="fill" className="h-3.5 w-3.5" />
                  ) : (
                    <XCircleIcon weight="bold" className="h-3.5 w-3.5" />
                  )}
                  <span>{language === "sv" ? "Lösning" : "Solution"}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" align="start">
                <p>
                  {hasSolution
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

        <div className="flex items-center gap-1">
          {/* <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggleSide}
                  className="h-8 w-8 px-0 rounded-full text-muted-foreground hover:text-foreground hover:bg-accent/50"
                >
                  <SidebarSimpleIcon
                    weight="bold"
                    className={`h-5 w-5 transform transition-transform ${side === "left" ? "scale-x-[-1]" : ""}`}
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" align="end">
                <p>
                  {language === "sv"
                    ? `Fäst på ${side === "right" ? "vänster" : "höger"} sida`
                    : `Dock to ${side === "right" ? "left" : "right"}`}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider> */}

          {/* Feedback Button */}
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
              <TooltipContent side="bottom" align="end">
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
  },
);

ChatHeader.displayName = "ChatHeader";
