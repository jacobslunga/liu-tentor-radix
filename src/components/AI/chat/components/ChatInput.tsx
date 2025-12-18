import { FC, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  InputGroup,
  InputGroupTextarea,
  InputGroupAddon,
  InputGroupButton,
} from "@/components/ui/input-group";
import {
  TooltipTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import {
  BookOpenIcon,
  LightbulbFilamentIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  SquareIcon,
} from "@phosphor-icons/react";
import { NavigationButtons } from "./NavigationButtons";

interface ChatInputProps {
  language: string;
  input: string;
  isLoading: boolean;
  giveDirectAnswer: boolean;
  showScrollButton: boolean;
  hasAssistantMessages: boolean;
  currentAssistantIndex: number;
  totalAssistantMessages: number;
  placeholder: string;
  poweredByText: string;
  sendButtonLabel: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  onCancel: () => void;
  onScrollToBottom: () => void;
  onNavigate: (direction: "up" | "down") => void;
  onToggleAnswerMode: (direct: boolean) => void;
}

const STORAGE_KEY = "chat_input_draft"; // Key used for localStorage

export const ChatInput: FC<ChatInputProps> = ({
  language,
  input,
  isLoading,
  giveDirectAnswer,
  showScrollButton,
  hasAssistantMessages,
  currentAssistantIndex,
  totalAssistantMessages,
  placeholder,
  poweredByText,
  sendButtonLabel,
  onInputChange,
  onSend,
  onCancel,
  onScrollToBottom,
  onNavigate,
  onToggleAnswerMode,
}) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // --- NEW LOGIC: Load draft on mount ---
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedDraft = localStorage.getItem(STORAGE_KEY);
      // Only restore if we have a draft and the current input is empty
      if (savedDraft && input === "") {
        onInputChange(savedDraft);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  // --- NEW LOGIC: Save draft on every keystroke ---
  useEffect(() => {
    if (typeof window !== "undefined") {
      // If input is empty (e.g. after sending), this effectively clears the storage
      localStorage.setItem(STORAGE_KEY, input);
    }
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="px-2 space-y-2 relative pb-2 max-w-3xl mx-auto w-full">
      {/* Navigation buttons for assistant messages - partially hidden under input */}
      {hasAssistantMessages && (
        <NavigationButtons
          language={language}
          currentIndex={currentAssistantIndex}
          totalCount={totalAssistantMessages}
          onNavigate={onNavigate}
        />
      )}

      {/* Scroll to bottom button */}
      <AnimatePresence>
        {showScrollButton && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute -top-14 left-1/2 -translate-x-1/2 z-20"
          >
            <Button variant="outline" size="icon" onClick={onScrollToBottom}>
              <ArrowDownIcon weight="bold" className="h-4 w-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <InputGroup className="z-40">
        <InputGroupTextarea
          placeholder={placeholder}
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          rows={1}
          ref={inputRef}
          className="text-base resize-none max-h-[200px] overflow-y-auto"
        />
        <InputGroupAddon align="block-end">
          <div className="flex items-center gap-0 min-w-0 flex-1">
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => {
                      onToggleAnswerMode(true);
                      inputRef.current?.focus();
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors border-y border-l rounded-l-md cursor-pointer ${
                      giveDirectAnswer
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background text-muted-foreground border-border hover:bg-accent hover:text-foreground"
                    }`}
                  >
                    <BookOpenIcon weight="bold" className="h-3.5 w-3.5" />
                    {language === "sv" ? "Svar" : "Answer"}
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {language === "sv"
                      ? "Få fullständiga svar och lösningar"
                      : "Get complete answers and solutions"}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => {
                      onToggleAnswerMode(false);
                      inputRef.current?.focus();
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors border-y border-r rounded-r-md cursor-pointer ${
                      !giveDirectAnswer
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background text-muted-foreground border-border hover:bg-accent hover:text-foreground"
                    }`}
                  >
                    <LightbulbFilamentIcon
                      weight="bold"
                      className="h-3.5 w-3.5"
                    />
                    {language === "sv" ? "Hints" : "Hints"}
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {language === "sv"
                      ? "Få ledtrådar och vägledning"
                      : "Get hints and guidance"}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <InputGroupButton
            variant="default"
            size="icon-sm"
            disabled={!input.trim() && !isLoading}
            onClick={isLoading ? onCancel : onSend}
          >
            {isLoading ? (
              <SquareIcon weight="fill" className="h-4 w-4" />
            ) : (
              <ArrowUpIcon weight="bold" className="h-10 w-10" />
            )}
            <span className="sr-only">
              {isLoading ? "Cancel" : sendButtonLabel}
            </span>
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      <div className="flex flex-row items-center justify-between px-2 w-full mb-2">
        <p className="text-[10px] text-muted-foreground text-center">
          {poweredByText}
        </p>
        <p className="text-[10px] text-muted-foreground text-center">
          Shift + Enter för ny rad
        </p>
      </div>
    </div>
  );
};
