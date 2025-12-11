import { FC, useMemo } from "react";
import {
  TooltipTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChatCenteredIcon,
  CaretRightIcon,
  FileTextIcon,
  CheckCircleIcon,
  CaretDownIcon,
  ChatCircleDotsIcon,
} from "@phosphor-icons/react";
import { Message } from "../types";

const getMessagePreview = (content: string, maxLength: number = 40): string => {
  const firstLine = content
    .split("\n")[0]
    .replace(/^#+\s*/, "")
    .trim();
  if (firstLine.length <= maxLength) return firstLine;
  return firstLine.slice(0, maxLength).trim() + "...";
};

interface ChatHeaderProps {
  language: string;
  hasSolutions: boolean;
  messages: Message[];
  currentAssistantIndex: number;
  onClose: () => void;
  onNavigateToMessage: (direction: "up" | "down", targetIndex?: number) => void;
}

export const ChatHeader: FC<ChatHeaderProps> = ({
  language,
  hasSolutions,
  messages,
  currentAssistantIndex,
  onClose,
  onNavigateToMessage,
}) => {
  const assistantMessages = useMemo(() => {
    return messages
      .map((msg, idx) => ({ message: msg, originalIndex: idx }))
      .filter((item) => item.message.role === "assistant");
  }, [messages]);

  const totalAssistantMessages = assistantMessages.length;
  const showNavigation = totalAssistantMessages > 1;

  return (
    <div className="shrink-0 bg-background border-b border-border h-14 z-40">
      <div className="px-3 py-2 flex items-center justify-between h-full">
        {/* Left section: Close button + Context badges + Chat history dropdown */}
        <div className="flex items-center gap-2">
          {/* Close button */}
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

          {/* Context badges */}
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

          {/* Chat history dropdown - only show when more than 1 assistant message */}
          {showNavigation && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-2.5 gap-1.5 text-xs font-medium"
                >
                  <ChatCircleDotsIcon
                    weight="duotone"
                    className="h-3.5 w-3.5"
                  />
                  <span className="tabular-nums">
                    {currentAssistantIndex + 1}/{totalAssistantMessages}
                  </span>
                  <CaretDownIcon weight="bold" className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="max-w-[280px]">
                {assistantMessages.map((item, idx) => (
                  <DropdownMenuItem
                    key={item.originalIndex}
                    onClick={() =>
                      onNavigateToMessage("down", item.originalIndex)
                    }
                    className={`cursor-pointer ${
                      idx === currentAssistantIndex
                        ? "bg-accent text-accent-foreground"
                        : ""
                    }`}
                  >
                    <span className="tabular-nums text-muted-foreground mr-2">
                      {idx + 1}.
                    </span>
                    <span className="truncate">
                      {getMessagePreview(item.message.content)}
                    </span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Feedback button */}
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open("/feedback", "_blank")}
                className="text-xs gap-1.5 h-8 px-2"
              >
                <ChatCenteredIcon weight="duotone" className="h-3.5 w-3.5" />
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
