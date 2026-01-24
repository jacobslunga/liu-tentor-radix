import {
  useRef,
  useEffect,
  memo,
  forwardRef,
  useImperativeHandle,
  useState,
  useMemo,
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  LightbulbFilamentIcon,
  ArrowUpIcon,
  SquareIcon,
  ArrowDownIcon,
  CheckIcon,
} from "@phosphor-icons/react";
import { QuotedContext } from "./QuotedContext";
import { cn } from "@/lib/utils";
import { ChevronDownIcon } from "@primer/octicons-react";

export type ModelProvider = "google";

export interface ModelBadge {
  sv: string;
  en: string;
}

export interface Model {
  id: string;
  name: string;
  provider: ModelProvider;
  description: string;
  icon?: React.ReactNode;
}

const getModels = (language: string): Model[] => {
  const isSv = language === "sv";

  return [
    {
      id: "gemini-3-pro-preview",
      name: "Gemini 3 Pro",
      provider: "google",
      description: isSv
        ? "Googles bästa multimodala modell"
        : "Google's best multimodal model",
    },
    {
      id: "gemini-2.5-pro",
      name: "Gemini 2.5 Pro",
      provider: "google",
      description: isSv
        ? "Googles bästa multimodala modell"
        : "Google's best multimodal model",
    },
    {
      id: "gemini-2.5-flash",
      name: "Gemini 2.5 Flash",
      provider: "google",
      description: isSv
        ? "Googles snabbaste multimodala modell"
        : "Google's fastest multimodal model",
    },
  ];
};

export interface ChatInputProps {
  language: string;
  input: string;
  isLoading: boolean;
  giveDirectAnswer: boolean;
  showScrollButton: boolean;
  placeholder: string;
  poweredByText: string;
  sendButtonLabel: string;
  quotedContext?: string;
  selectedModelId: string;
  onModelChange: (modelId: string) => void;
  onInputChange: (value: string) => void;
  onSend: () => void;
  onCancel: () => void;
  onScrollToBottom: () => void;
  onToggleAnswerMode: (direct: boolean) => void;
  onClearQuotedContext?: () => void;
}

const ProviderLogo = ({
  provider,
  className,
}: {
  provider: ModelProvider;
  className?: string;
}) => {
  const logos: Record<ModelProvider, string> = {
    google: "/llm-logos/gemini.png",
  };

  return (
    <div
      className={cn(
        "relative h-5 w-5 overflow-hidden rounded-sm shrink-0",
        className,
      )}
    >
      <img
        src={logos[provider]}
        alt={provider}
        className="h-full w-full object-contain"
      />
    </div>
  );
};

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
  ),
);

const ModelSelector = ({
  selectedModelId,
  language,
  onSelect,
}: {
  selectedModelId: string;
  language: string;
  onSelect: (id: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const selectedItemRef = useRef<HTMLDivElement>(null);

  const isSv = language === "sv";
  const models = useMemo(() => getModels(language), [language]);
  const selectedModel =
    models.find((m) => m.id === selectedModelId) || models[0];

  useEffect(() => {
    if (open && selectedItemRef.current) {
      setTimeout(() => {
        selectedItemRef.current?.scrollIntoView({ block: "center" });
      }, 100);
    }
  }, [open]);

  const groupedModels = useMemo(() => {
    const groups: Record<string, Model[]> = {};
    models.forEach((m) => {
      if (!groups[m.provider]) groups[m.provider] = [];
      groups[m.provider].push(m);
    });
    return groups;
  }, [models]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className="flex items-center gap-2 h-8 px-2 rounded-full border border-transparent hover:bg-accent/50 hover:border-border/50 transition-all outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
          aria-label={isSv ? "Välj modell" : "Select model"}
        >
          <ProviderLogo provider={selectedModel.provider} />
          <span className="text-xs font-medium text-muted-foreground truncate max-w-[100px] hidden sm:inline-block">
            {selectedModel.name}
          </span>
          <ChevronDownIcon className="w-3 h-3 text-muted-foreground opacity-50" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[340px] p-0"
        align="start"
        side="top"
        sideOffset={10}
      >
        <Command>
          <CommandList className="max-h-[300px] overflow-y-auto custom-scrollbar">
            <CommandEmpty>
              {isSv ? "Ingen modell hittades." : "No model found."}
            </CommandEmpty>
            {Object.entries(groupedModels).map(([provider, providerModels]) => (
              <CommandGroup
                key={provider}
                heading={provider.charAt(0).toUpperCase() + provider.slice(1)}
              >
                {providerModels.map((model) => (
                  <CommandItem
                    key={model.id}
                    ref={selectedModelId === model.id ? selectedItemRef : null}
                    value={`${model.name} ${model.provider}`}
                    onSelect={() => {
                      onSelect(model.id);
                      setOpen(false);
                    }}
                    className="flex items-start gap-3 py-3 cursor-pointer aria-selected:bg-accent"
                  >
                    <div className="mt-0.5 shrink-0">
                      <ProviderLogo
                        provider={model.provider}
                        className="h-5 w-5"
                      />
                    </div>
                    <div className="flex flex-col flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground">
                          {model.name}
                        </span>
                      </div>
                      <span className="text-[10px] text-muted-foreground line-clamp-1">
                        {model.description}
                      </span>
                    </div>
                    {selectedModelId === model.id && (
                      <CheckIcon className="h-4 w-4 text-primary shrink-0 mt-1" />
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

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
      selectedModelId,
      onModelChange,
      onInputChange,
      onSend,
      onCancel,
      onScrollToBottom,
      onToggleAnswerMode,
      onClearQuotedContext,
    },
    ref,
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

          <InputGroup className="rounded-3xl bg-background p-2 shadow-sm dark:bg-secondary border border-border transition-all">
            <InputGroupTextarea
              ref={inputRef}
              placeholder={placeholder}
              value={input}
              onChange={(e) => {
                if (e.target.value.length <= MAX_INPUT_LENGTH) {
                  onInputChange(e.target.value);
                }
              }}
              onKeyDown={handleKeyDown}
              rows={1}
              className="text-base resize-none max-h-[200px] overflow-y-auto py-2 px-1"
            />

            <InputGroupAddon align="block-end" className="w-full">
              <div className="flex items-center justify-between w-full gap-2">
                <div className="flex items-center gap-1.5">
                  <ModelSelector
                    selectedModelId={selectedModelId}
                    language={language}
                    onSelect={(id) => {
                      onModelChange(id);
                      setTimeout(() => inputRef.current?.focus(), 100);
                    }}
                  />

                  <TooltipProvider delayDuration={0}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => {
                            onToggleAnswerMode(!giveDirectAnswer);
                            inputRef.current?.focus();
                          }}
                          className={cn(
                            "flex items-center gap-1.5 px-2.5 h-7 text-xs font-medium transition-all rounded-full cursor-pointer border select-none",
                            !giveDirectAnswer
                              ? "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
                              : "bg-transparent text-muted-foreground border-transparent hover:bg-accent hover:text-foreground",
                          )}
                        >
                          <LightbulbFilamentIcon
                            weight={!giveDirectAnswer ? "fill" : "regular"}
                            className="h-4 w-4"
                          />
                          <span className="hidden sm:inline">
                            {language === "sv" ? "Hints" : "Hints"}
                          </span>
                        </button>
                      </TooltipTrigger>
                      <TooltipContent
                        side="top"
                        align="start"
                        className="flex flex-col gap-0.5"
                      >
                        <p className="font-semibold">
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
                              ? "Du får pedagogiska ledtrådar."
                              : "You'll get guidance."
                            : language === "sv"
                              ? "Klicka för vägledning."
                              : "Click to get guidance."}
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
                  className="rounded-full h-8 w-8 shrink-0"
                >
                  {isLoading ? (
                    <SquareIcon weight="fill" className="h-3.5 w-3.5" />
                  ) : (
                    <ArrowUpIcon weight="bold" className="h-4 w-4" />
                  )}
                  <span className="sr-only">
                    {isLoading ? "Cancel" : sendButtonLabel}
                  </span>
                </InputGroupButton>
              </div>
            </InputGroupAddon>
          </InputGroup>

          {isInputTooLong && (
            <div className="text-xs text-red-500 mt-2 text-center animate-pulse">
              {language === "sv"
                ? `Maximal längd är ${MAX_INPUT_LENGTH} tecken.`
                : `Maximum length is ${MAX_INPUT_LENGTH} characters.`}
            </div>
          )}

          <div className="flex flex-row items-center justify-center gap-4 w-full mt-2 opacity-60 hover:opacity-100 transition-opacity">
            <p className="text-[10px] text-muted-foreground">{poweredByText}</p>
          </div>
        </div>
      </div>
    );
  },
);
