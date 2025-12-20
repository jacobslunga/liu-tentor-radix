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
  FileTextIcon,
  CheckCircleIcon,
  ChatCircleDotsIcon,
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

          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-secondary border border-border rounded-md">
              <FileTextIcon
                weight="duotone"
                className="h-3.5 w-3.5 text-muted-foreground"
              />
              <span className="text-xs font-medium text-muted-foreground">
                {language === "sv" ? "Tenta" : "Exam"}
              </span>
            </div>
            {hasSolutions && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-secondary border border-border rounded-md">
                <CheckCircleIcon
                  weight="duotone"
                  className="h-3.5 w-3.5 text-muted-foreground"
                />
                <span className="text-xs font-medium text-muted-foreground">
                  {language === "sv" ? "Lösning" : "Solution"}
                </span>
              </div>
            )}
          </div>
        </div>

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
