import { FC, memo } from "react";
import {
  TooltipTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, X, MessageSquare } from "lucide-react";

interface ChatHeaderProps {
  language: string;
  hasSolution: boolean;
  onClose: () => void;
  side: "left" | "right";
}

export const ChatHeader: FC<ChatHeaderProps> = memo(
  ({ language, hasSolution, onClose }) => {
    return (
      <div className="shrink-0 flex items-center justify-between px-3 py-2 z-40">
        <div className="flex items-center gap-2">
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="h-7 w-7 rounded-full text-muted-foreground hover:text-foreground hover:bg-accent/50"
                >
                  <X className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{language === "sv" ? "Stäng (C)" : "Close (C)"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium cursor-default transition-colors border ${
                    hasSolution
                      ? "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800"
                      : "bg-muted/50 text-muted-foreground border-transparent"
                  }`}
                >
                  {hasSolution ? (
                    <CheckCircle className="h-3 w-3" />
                  ) : (
                    <XCircle className="h-3 w-3" />
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
          {/* Feedback Button */}
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open("/feedback", "_blank")}
                  className="h-7 gap-1.5 px-2.5 rounded-full text-[10px] text-muted-foreground hover:text-foreground hover:bg-accent/50"
                >
                  <MessageSquare className="h-3.5 w-3.5" />
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
