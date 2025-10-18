import {
  FC,
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  memo,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
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
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyMedia,
} from "@/components/ui/empty";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUpIcon, ArrowDown, Loader2, ChevronRight } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { LogoIcon } from "../LogoIcon";
import { ExamWithSolutions } from "@/types/exam";
import { useLanguage } from "@/context/LanguageContext";

const normalizeMath = (s: string) =>
  s
    .replace(/\\\[/g, "$$")
    .replace(/\\\]/g, "$$")
    .replace(/\\\(/g, "$")
    .replace(/\\\)/g, "$");

const stripIndent = (s: string) =>
  s.replace(/^\n/, "").replace(/^[ \t]+/gm, "");

// Memoized markdown components to prevent re-renders
const markdownComponents = {
  a: (props: any) => (
    <a {...props} rel="noopener noreferrer" className="underline" />
  ),
  pre: (props: any) => (
    <pre
      {...props}
      className="overflow-x-auto my-3 bg-muted/50 rounded p-2 text-base"
    />
  ),
  code: ({ inline, ...props }: any) =>
    inline ? (
      <code {...props} className="bg-muted/50 px-1 py-0.5 rounded text-base" />
    ) : (
      <code {...props} className="break-words text-base" />
    ),
  p: (props: any) => <p {...props} className="my-2 text-base" />,
  ul: (props: any) => (
    <ul {...props} className="my-2 ml-4 list-disc text-base" />
  ),
  ol: (props: any) => (
    <ol {...props} className="my-2 ml-4 list-decimal text-base" />
  ),
  li: (props: any) => <li {...props} className="my-1 text-base" />,
  h1: (props: any) => <h1 {...props} className="text-xl font-bold mt-4 mb-2" />,
  h2: (props: any) => <h2 {...props} className="text-lg font-bold mt-3 mb-2" />,
  h3: (props: any) => (
    <h3 {...props} className="text-base font-bold mt-2 mb-1" />
  ),
};

// Memoized message component to prevent unnecessary re-renders
const MessageBubble = memo(
  ({
    message,
    isLoading,
    language,
  }: {
    message: Message;
    isLoading: boolean;
    language: string;
  }) => {
    const processedContent = useMemo(
      () => stripIndent(normalizeMath(message.content)),
      [message.content]
    );

    return (
      <div
        className={`max-w-[100%] rounded-lg p-3 ${
          message.role === "user"
            ? "bg-primary text-primary-foreground"
            : "bg-background"
        }`}
      >
        {message.role === "assistant" ? (
          message.content === "" && isLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="text-base text-muted-foreground">
                {language === "sv" ? "Tänker..." : "Thinking..."}
              </span>
            </div>
          ) : (
            <div className="prose prose-base dark:prose-invert max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkMath, remarkGfm]}
                rehypePlugins={[rehypeKatex]}
                components={markdownComponents}
              >
                {processedContent}
              </ReactMarkdown>
            </div>
          )
        ) : (
          <p className="text-base whitespace-pre-wrap">{message.content}</p>
        )}
      </div>
    );
  }
);

MessageBubble.displayName = "MessageBubble";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatWindowProps {
  examDetail: ExamWithSolutions;
  isOpen: boolean;
  onClose: () => void;
}
const ChatWindow: FC<ChatWindowProps> = ({ examDetail, isOpen, onClose }) => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const autoScrollRef = useRef(autoScroll);

  // Keep ref in sync with state
  useEffect(() => {
    autoScrollRef.current = autoScroll;
  }, [autoScroll]);

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  console.log(messages);

  const handleClose = useCallback(() => {
    setInput("");
    onClose();
  }, [onClose]);

  // Use requestAnimationFrame to batch scroll updates
  useEffect(() => {
    if (autoScroll && messages.length > 0) {
      requestAnimationFrame(() => {
        scrollToBottom("smooth");
      });
    }
  }, [messages.length, autoScroll]); // Only depend on length, not entire array

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        scrollToBottom("instant");
      }, 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;

      setShowScrollButton(!isNearBottom);

      if (!isNearBottom && autoScroll) {
        setAutoScroll(false);
      } else if (isNearBottom && !autoScroll) {
        setAutoScroll(true);
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [autoScroll]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, handleClose]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setAutoScroll(true);

    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
    try {
      const response = await fetch(
        `http://localhost:4330/exams/exam/${examDetail.exam.id}/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: [...messages, userMessage].map((msg) => ({
              role: msg.role,
              content: msg.content,
            })),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = "";
      let lastUpdateTime = 0;
      const UPDATE_INTERVAL = 50; // Update UI every 50ms instead of every chunk

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            // Final update with complete message
            setMessages((prev) => {
              const newMessages = [...prev];
              newMessages[newMessages.length - 1] = {
                role: "assistant",
                content: assistantMessage,
              };
              return newMessages;
            });
            break;
          }

          const chunk = decoder.decode(value);
          assistantMessage += chunk;

          // Throttle UI updates to reduce re-renders
          const now = Date.now();
          if (now - lastUpdateTime >= UPDATE_INTERVAL) {
            lastUpdateTime = now;
            setMessages((prev) => {
              const newMessages = [...prev];
              newMessages[newMessages.length - 1] = {
                role: "assistant",
                content: assistantMessage,
              };
              return newMessages;
            });
          }
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = {
          role: "assistant",
          content: "Något gick fel. Försök igen senare.",
        };
        return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          initial={{ x: "100%", opacity: 0, filter: "blur(8px)" }}
          animate={{ x: "0%", opacity: 1, filter: "blur(0px)" }}
          exit={{ x: "100%", opacity: 0, filter: "blur(8px)" }}
          transition={{
            x: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
            opacity: { duration: 0.3 },
            filter: { duration: 0.3 },
          }}
          className="fixed right-0 top-0 h-full w-1/2 bg-background border-l flex flex-col overflow-hidden z-50"
        >
          <div
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto p-4 pt-12 pb-20 space-y-4 relative"
          >
            {messages.length === 0 && (
              <Empty className="h-full border-0">
                <EmptyHeader>
                  <EmptyMedia variant="default">
                    <LogoIcon className="w-20 h-20" />
                  </EmptyMedia>
                  <EmptyTitle>{t("aiChatEmptyTitle")}</EmptyTitle>
                  <EmptyDescription>
                    {t("aiChatEmptyDescription")}
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            )}

            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <MessageBubble
                  message={message}
                  isLoading={isLoading && index === messages.length - 1}
                  language={language}
                />
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="px-2 space-y-2 relative pb-2">
            {/* Close button - absolutely positioned, floating above messages */}
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleClose}
                    className="absolute -top-16 left-2 z-30 hover:bg-accent shadow-md"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{language === "sv" ? "Stäng" : "Close"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Scroll to bottom button */}
            <AnimatePresence>
              {showScrollButton && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute -top-14 left-1/2 -translate-x-1/2 z-20"
                >
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={() => {
                      setAutoScroll(true);
                      scrollToBottom("smooth");
                    }}
                    className="shadow-lg rounded-full"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            <InputGroup className="z-50">
              <InputGroupTextarea
                placeholder={t("aiChatPlaceholder")}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
                rows={2}
                className="!text-base resize-none"
                style={{ fontSize: "16px" }}
              />
              <InputGroupAddon align="block-end">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <Badge className="text-sm truncate" variant="secondary">
                    {language === "sv" ? "Tenta " : "Exam "}{" "}
                    {examDetail.solutions.length > 0 && (
                      <span>
                        + {t("facit")}{" "}
                        {language === "sv" ? "inkluderat" : "included"}
                      </span>
                    )}
                  </Badge>
                </div>
                <InputGroupButton
                  variant="default"
                  size="icon-sm"
                  disabled={!input.trim() || isLoading}
                  onClick={sendMessage}
                >
                  <ArrowUpIcon className="h-10 w-10" />
                  <span className="sr-only">{t("aiChatSend")}</span>
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
            <div className="flex flex-row items-center justify-between px-2 w-full mb-2">
              <p className="text-[10px] text-muted-foreground text-center">
                {t("aiChatPoweredBy")}
              </p>

              <p className="text-[10px] text-muted-foreground text-center">
                Shift + Enter för ny rad
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatWindow;
