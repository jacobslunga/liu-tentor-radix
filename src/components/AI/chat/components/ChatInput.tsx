import { FC, useRef, useEffect, memo } from "react";
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
  SquareIcon,
  ArrowDownIcon,
} from "@phosphor-icons/react";
import { QuotedContext } from "./QuotedContext";

interface ChatInputProps {
  language: string;
  input: string;
  isLoading: boolean;
  giveDirectAnswer: boolean;
  showScrollButton: boolean;
  placeholder: string;
  sendButtonLabel: string;
  quotedContext?: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  onCancel: () => void;
  onScrollToBottom: () => void;
  onToggleAnswerMode: (direct: boolean) => void;
  onClearQuotedContext?: () => void;
}

const ScrollToBottomButton = memo(
  ({ show, onClick }: { show: boolean; onClick: () => void }) => (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ ease: "easeInOut", duration: 0.2 }}
          className="absolute -top-14 left-1/2 -translate-x-1/2 z-20"
        >
          <Button variant="outline" size="icon" onClick={onClick}>
            <ArrowDownIcon weight="bold" size={20} />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  )
);

export const ChatInput: FC<ChatInputProps> = ({
  language,
  input,
  isLoading,
  giveDirectAnswer,
  showScrollButton,
  placeholder,
  sendButtonLabel,
  quotedContext,
  onInputChange,
  onSend,
  onCancel,
  onScrollToBottom,
  onToggleAnswerMode,
  onClearQuotedContext,
}) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      const val = inputRef.current.value;
      inputRef.current.setSelectionRange(val.length, val.length);
    }
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="px-4 space-y-2 relative w-full">
      <div className="max-w-3xl mx-auto w-full relative">
        <ScrollToBottomButton
          show={showScrollButton}
          onClick={onScrollToBottom}
        />

        <AnimatePresence>
          {quotedContext && onClearQuotedContext && (
            <QuotedContext
              text={quotedContext}
              language={language}
              onClear={onClearQuotedContext}
            />
          )}
        </AnimatePresence>

        <InputGroup className="z-40 rounded-t-3xl rounded-b-none p-1.5 bg-background border border-border">
          <InputGroupTextarea
            placeholder={placeholder}
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
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

        {/* <div className="flex flex-row items-center justify-between px-2 w-full mb-2 mt-2">
          <p className="text-[10px] text-muted-foreground text-center">
            {poweredByText}
          </p>
          <p className="text-[10px] text-muted-foreground text-center">
            Shift + Enter för ny rad
          </p>
        </div> */}
      </div>
    </div>
  );
};
