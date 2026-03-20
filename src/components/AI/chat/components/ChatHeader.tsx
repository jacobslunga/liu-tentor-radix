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
  ClockCounterClockwiseIcon,
  PlusIcon,
} from "@phosphor-icons/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChatHistoryItem } from "../hooks/useChatMessages";

interface ChatHeaderProps {
  language: string;
  hasSolution: boolean;
  onClose: () => void;
  side: "left" | "right";
  chatHistory: ChatHistoryItem[];
  activeChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onStartNewChat: () => void;
}

const formatHistoryDate = (isoDate: string, language: string) => {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleString(language === "sv" ? "sv-SE" : "en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const ChatHeader: FC<ChatHeaderProps> = memo(
  ({
    language,
    hasSolution,
    onClose,
    side,
    chatHistory,
    activeChatId,
    onSelectChat,
    onStartNewChat,
  }) => {
    return (
      <div className="shrink-0 flex items-center justify-between p-3 z-40">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onClose}>
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <ClockCounterClockwiseIcon weight="bold" className="h-4 w-4" />
                <span>{language === "sv" ? "Tidigare" : "History"}</span>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-72 max-h-80 overflow-y-auto p-0"
            >
              <div className="sticky top-0 z-20 bg-popover border-b">
                <DropdownMenuLabel>
                  {language === "sv" ? "Tidigare chattar" : "Past chats"}
                </DropdownMenuLabel>
                <DropdownMenuItem onClick={onStartNewChat}>
                  <PlusIcon weight="bold" className="h-4 w-4" />
                  {language === "sv" ? "Ny chatt" : "New chat"}
                </DropdownMenuItem>
              </div>

              {chatHistory.length === 0 ? (
                <DropdownMenuItem disabled>
                  {language === "sv"
                    ? "Inga tidigare chattar"
                    : "No previous chats"}
                </DropdownMenuItem>
              ) : (
                chatHistory.map((chat) => (
                  <DropdownMenuItem
                    key={chat.id}
                    onClick={() => onSelectChat(chat.id)}
                    className="flex items-start justify-between gap-2"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm">
                        {chat.title ||
                          (language === "sv"
                            ? "Namnlös chatt"
                            : "Untitled chat")}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatHistoryDate(chat.updatedAt, language)}
                      </div>
                    </div>
                    {activeChatId === chat.id && (
                      <CheckCircleIcon
                        weight="fill"
                        className="h-4 w-4 text-primary shrink-0"
                      />
                    )}
                  </DropdownMenuItem>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>

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
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.open("/feedback", "_blank")}
          >
            <ChatCircleDotsIcon weight="bold" className="h-4 w-4" />
            <span>Feedback</span>
          </Button>
        </div>
      </div>
    );
  },
);

ChatHeader.displayName = "ChatHeader";
