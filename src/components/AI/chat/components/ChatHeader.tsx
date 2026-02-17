import { FC, memo } from "react";
import {
  TooltipTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import {
  CheckCircleIcon,
  ChatCircleDotsIcon,
  XCircleIcon,
} from "@phosphor-icons/react";
import { X } from "lucide-react";

interface ChatHeaderProps {
  language: string;
  hasSolution: boolean;
  onClose: () => void;
}

export const ChatHeader: FC<ChatHeaderProps> = memo(
  ({ language, hasSolution, onClose }) => {
    return (
      <div className="shrink-0 flex items-center justify-between p-4 z-40 bg-transparent">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <ChatCircleDotsIcon
              weight="fill"
              className="h-6 w-6 text-primary"
            />
            <h2 className="font-bold text-lg tracking-tight">
              {language === "sv" ? "LiU Tentor AI" : "LiU Exams AI"}
            </h2>
          </div>

          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold cursor-default transition-colors ${
                    hasSolution
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : "bg-muted/50 text-muted-foreground"
                  }`}
                >
                  {hasSolution ? (
                    <CheckCircleIcon weight="fill" className="h-3 w-3" />
                  ) : (
                    <XCircleIcon weight="bold" className="h-3 w-3" />
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

        <div className="flex items-center gap-2">
          {/* Feedback Button */}
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open("/feedback", "_blank")}
                  className="h-9 gap-2 px-4 rounded-full text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50"
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

          <div className="w-px h-4 bg-border mx-1" />

          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-accent group"
          >
            <X className="h-5 w-5 group-hover:scale-110 transition-transform" />
          </Button>
        </div>
      </div>
    );
  },
);

ChatHeader.displayName = "ChatHeader";
