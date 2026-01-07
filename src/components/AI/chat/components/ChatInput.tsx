import {
  useRef,
  useEffect,
  memo,
  forwardRef,
  useImperativeHandle,
} from "react";
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
  poweredByText: string;
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

export interface ChatInputHandle {
  focus: () => void;
}

export const ChatInput = forwardRef<ChatInputHandle, ChatInputProps>(
  (
    {
      language,
      input,
      isLoading,
      giveDirectAnswer,
      showScrollButton,
      placeholder,
      poweredByText,
      sendButtonLabel,
      quotedContext,
      onInputChange,
      onSend,
      onCancel,
      onScrollToBottom,
      onToggleAnswerMode,
      onClearQuotedContext,
    },
    ref
  ) => {
    const inputRef = useRef<HTMLTextAreaElement>(null);

    useImperativeHandle(ref, () => ({
      focus: () => {
        inputRef.current?.focus();
      },
    }));

    useEffect(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        const val = inputRef.current.value;
        inputRef.current.setSelectionRange(val.length, val.length);
      }
    }, []);

    const MAX_INPUT_LENGTH = 4000;
    const isInputTooLong = input.length >= MAX_INPUT_LENGTH;

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (!isInputTooLong) {
          onSend();
        }
      }
    };

    return (
      <div className="px-4 pb-4 relative w-full">
        <div className="max-w-2xl mx-auto w-full relative">
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

          <InputGroup className="rounded-3xl bg-background p-1.5 dark:bg-secondary border border-border">
            <InputGroupTextarea
              ref={inputRef}
              placeholder={placeholder}
              value={input}
              onChange={(e) => {
                if (e.target.value.length <= MAX_INPUT_LENGTH) {
                  onInputChange(e.target.value);
                } else {
                  // Optionally, we could show a toast or other feedback here
                }
              }}
              onKeyDown={handleKeyDown}
              rows={1}
              className="text-base resize-none max-h-[200px] overflow-y-auto"
            />
            <InputGroupAddon align="block-end">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <TooltipProvider delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => {
                          onToggleAnswerMode(!giveDirectAnswer);
                          inputRef.current?.focus();
                        }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-all rounded-full cursor-pointer border ${
                          !giveDirectAnswer
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-transparent text-muted-foreground border-dashed border-muted-foreground/50 hover:border-muted-foreground hover:bg-accent/50"
                        }`}
                      >
                        <LightbulbFilamentIcon
                          weight={!giveDirectAnswer ? "fill" : "bold"}
                          className="h-3.5 w-3.5"
                        />
                        {language === "sv" ? "Hints" : "Hints"}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent
                      side="top"
                      align="start"
                      className="flex flex-col gap-0.5"
                    >
                      <p className="font-medium">
                        {!giveDirectAnswer
                          ? language === "sv"
                            ? "Hints är på"
                            : "Hints enabled"
                          : language === "sv"
                            ? "Hints är av"
                            : "Hints disabled"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {!giveDirectAnswer
                          ? language === "sv"
                            ? "Du får pedagogiska ledtrådar istället för svar."
                            : "You'll get pedagogical guidance instead of answers."
                          : language === "sv"
                            ? "Klicka för att få vägledning steg-för-steg."
                            : "Click to get step-by-step guidance."}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <InputGroupButton
                variant="default"
                size="icon-sm"
                disabled={(!input.trim() && !isLoading) || isInputTooLong}
                onClick={isLoading ? onCancel : onSend}
              >
                {isLoading ? (
                  <SquareIcon weight="fill" className="h-4 w-4" />
                ) : (
                  <ArrowUpIcon weight="bold" className="h-5 w-5" />
                )}
                <span className="sr-only">
                  {isLoading ? "Cancel" : sendButtonLabel}
                </span>
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>

          {isInputTooLong && (
            <div className="text-xs text-red-500 mt-2 text-center">
              {language === "sv"
                ? `Maximal längd är ${MAX_INPUT_LENGTH} tecken. Ditt meddelande är för långt.`
                : `Maximum length is ${MAX_INPUT_LENGTH} characters. Your message is too long.`}
            </div>
          )}

          <div className="flex flex-row items-center justify-between px-2 w-full mt-2">
            <p className="text-[10px] text-muted-foreground text-center">
              {poweredByText}
            </p>
            <p className="text-[10px] text-muted-foreground text-center">
              Shift + Enter för ny rad
            </p>
          </div>
        </div>
      </div>
    );
  }
);
