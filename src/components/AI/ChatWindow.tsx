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
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneDark,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";
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
  ArrowUpIcon,
  ArrowDown,
  ChevronRight,
  Loader2,
  Check,
  Copy,
  Lightbulb,
  BookOpen,
  MessageSquare,
} from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { ExamWithSolutions } from "@/types/exam";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

const normalizeMath = (s: string) => {
  let result = s.replace(/\\\[([\s\S]*?)\\\]/g, (_match, content) => {
    return `\n$$${content}$$\n`;
  });

  result = result.replace(/\\\((.*?)\\\)/g, "$$$1$$");

  return result;
};

const CodeBlock = memo(
  ({
    inline,
    className,
    children,
    ...props
  }: {
    inline?: boolean;
    className?: string;
    children?: React.ReactNode;
  }) => {
    const [copied, setCopied] = useState(false);
    const { effectiveTheme } = useTheme();
    const match = /language-(\w+)/.exec(className || "");
    const language = match ? match[1] : "";
    const { language: l } = useLanguage();

    const codeString = String(children).replace(/\n$/, "");

    const handleCopy = () => {
      navigator.clipboard.writeText(codeString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    if (inline) {
      return (
        <code
          className="bg-muted/50 text-foreground px-1 py-0.5 rounded text-base"
          {...props}
        >
          {children}
        </code>
      );
    }

    return (
      <div className="relative group my-4 w-full">
        {/* Header with language and copy button */}
        <div className="flex items-center justify-between bg-muted/30 border border-border rounded-t-lg px-4 py-2">
          <span className="text-xs font-medium text-muted-foreground">
            {language || "text"}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-7 px-2 text-xs"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 mr-1" />
                {l === "sv" ? "Kopierat" : "Copied"}
              </>
            ) : (
              <>
                <Copy className="h-3 w-3 mr-1" />
                {l === "sv" ? "Kopiera" : "Copy"}
              </>
            )}
          </Button>
        </div>
        {/* Code content */}
        <div className="relative overflow-hidden rounded-b-lg border border-t-0 border-border">
          <SyntaxHighlighter
            language={language}
            style={effectiveTheme === "dark" ? oneDark : oneLight}
            customStyle={{
              margin: 0,
              padding: "1.25rem",
              fontSize: "0.85rem",
              lineHeight: "1.6",
              borderRadius: 0,
              fontFamily: "Jetbrains Mono",
            }}
            showLineNumbers={false}
            wrapLines={false}
            wrapLongLines={true}
            codeTagProps={{
              style: {
                fontSize: "0.85rem",
                lineHeight: "1.6",
                tabSize: 2,
              },
            }}
            {...props}
          >
            {codeString}
          </SyntaxHighlighter>
        </div>
      </div>
    );
  }
);

CodeBlock.displayName = "CodeBlock";

// Memoized markdown components to prevent re-renders
const markdownComponents = {
  a: (props: any) => (
    <a {...props} rel="noopener noreferrer" className="underline" />
  ),
  pre: ({ children }: any) => <>{children}</>,
  code: CodeBlock,
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
      () => normalizeMath(message.content),
      [message.content]
    );

    return (
      <div
        className={`rounded-2xl p-3 ${
          message.role === "user"
            ? "bg-secondary text-foreground max-w-[85%]"
            : "bg-background w-full"
        }`}
      >
        {message.role === "assistant" ? (
          message.content === "" && isLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="text-sm text-muted-foreground">
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
  const [width, setWidth] = useState(50);
  const [isResizing, setIsResizing] = useState(false);
  const chatWindowRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [giveDirectAnswer, setGiveDirectAnswer] = useState(true);
  const [typed, setTyped] = useState("");
  const [charIndex, setCharIndex] = useState(0);
  const [exampleIndex, setExampleIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const isUserScrollingRef = useRef(false);

  const examples = [
    "Förklara uppgift 7",
    "Summera tentans område",
    "Skapa ett fuskpapper i LaTeX",
    "Vad är skillnaden mellan X och Y?",
    "Hur löser jag denna uppgiften?",
    "Ge tips på hur jag kan plugga bättre",
    "Vilka formler behöver jag kunna?",
    "Beskriv det här diagrammet",
    "Förklara denna formel steg för steg",
    "Vad är det viktigaste att komma ihåg?",
    "Kan du göra ett övningsexempel?",
    "Hitta fel i min lösning",
    "Gör om denna text till punkter",
    "Förklara med ett vardagsexempel",
    "Vad är typiska fällor på denna tenta?",
    "Sammanfatta kapitel 4",
    "Vad betyder denna term?",
    "Ge mig en minnesregel för detta",
    "Jämför metod A med metod B",
    "Vilken lösningsmetod är enklast?",
  ];
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  const handleClose = useCallback(() => {
    setInput("");
    onClose();
  }, [onClose]);

  // Typewriter effect for empty state
  useEffect(() => {
    if (!isOpen || messages.length > 0) return;

    const currentExample = examples[exampleIndex];
    const isTypingComplete = charIndex === currentExample.length && !deleting;
    const isDeletingComplete = charIndex === 0 && deleting;

    if (isTypingComplete) {
      const timer = setTimeout(() => setDeleting(true), 1500);
      return () => clearTimeout(timer);
    }

    if (isDeletingComplete) {
      setDeleting(false);
      setExampleIndex((prev) => (prev + 1) % examples.length);
      return;
    }

    const speed = deleting ? 30 : 50;
    const timer = setTimeout(() => {
      setCharIndex((prev) => prev + (deleting ? -1 : 1));
      setTyped(
        currentExample.slice(0, deleting ? charIndex - 1 : charIndex + 1)
      );
    }, speed);

    return () => clearTimeout(timer);
  }, [isOpen, charIndex, deleting, exampleIndex, examples, messages.length]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        scrollToBottom("instant");
      }, 100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const container = messagesContainerRef.current;
    if (!container) return;

    let lastScrollTop = container.scrollTop;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
      const isNearBottom = distanceFromBottom < 100;

      if (scrollTop < lastScrollTop) {
        isUserScrollingRef.current = true;
      } else if (isNearBottom) {
        isUserScrollingRef.current = false;
      }

      lastScrollTop = scrollTop;
      setShowScrollButton(!isNearBottom);
    };

    handleScroll();

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, handleClose]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      const windowWidth = window.innerWidth;
      const newWidth = ((windowWidth - e.clientX) / windowWidth) * 100;

      const constrainedWidth = Math.min(Math.max(newWidth, 25), 75);
      setWidth(constrainedWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    if (isResizing) {
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    isUserScrollingRef.current = false;
    scrollToBottom();

    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
    try {
      const response = await fetch(
        `https://hono-liutentor.onrender.com/chat/completion/${examDetail.exam.id}`,
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
            giveDirectAnswer,
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
      const UPDATE_INTERVAL = 50;

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
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
          ref={chatWindowRef}
          initial={{ x: "100%" }}
          animate={{ x: "0%" }}
          exit={{ x: "100%" }}
          transition={{
            x: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
          }}
          className="fixed right-0 top-0 h-full bg-background border-l flex flex-col overflow-hidden z-50"
          style={{ width: `${width}%` }}
        >
          {/* Resize handle */}
          <div
            className="absolute left-0 top-0 bottom-0 w-4 hover:bg-primary/10 transition-all cursor-col-resize group z-50"
            onMouseDown={() => setIsResizing(true)}
          >
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 group-hover:w-2 h-16 bg-black/70 dark:bg-white/80 group-hover:bg-primary transition-all rounded-r flex items-center justify-center" />
          </div>

          {/* Header with gradient fade */}
          <div className="absolute top-0 left-0 right-0 bg-linear-to-b from-background via-background to-transparent h-14 z-40 pointer-events-none">
            <div className="px-4 py-2 flex items-center justify-between pointer-events-auto">
              <p className="text-sm font-medium text-muted-foreground">
                {language === "sv" ? "Tenta" : "Exam"}
                {examDetail.solutions.length > 0 &&
                  ` + ${language === "sv" ? "Lösning" : "Solution"}`}
              </p>
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open("/feedback", "_blank")}
                      className="text-xs gap-1.5 h-8 px-2"
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
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

          <div
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto p-4 pt-20 pb-20 space-y-4 relative"
          >
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center px-8">
                <div className="max-w-2xl w-full space-y-8">
                  {/* Typewriter effect */}
                  <div className="min-h-[100px] flex items-center justify-center">
                    <h2 className="text-2xl font-semibold text-center">
                      {typed}
                      <span className="inline-block w-4 h-4 bg-foreground ml-2 rounded-full" />
                    </h2>
                  </div>

                  {/* Description */}
                  <div className="space-y-4 flex items-center justify-center flex-col">
                    <p className="text-sm text-muted-foreground max-w-lg text-center leading-relaxed">
                      {language === "sv" ? (
                        <>
                          Ställ frågor om tentan, få förklaringar eller be om
                          hjälp med specifika uppgifter. AI:n har tillgång till
                          både tentan
                          {examDetail.solutions.length > 0 && " och lösningen"}.
                        </>
                      ) : (
                        <>
                          Ask questions about the exam, get explanations, or
                          request help with specific problems. The AI has access
                          to the exam
                          {examDetail.solutions.length > 0 && " and solution"}.
                        </>
                      )}
                    </p>

                    <div className="flex items-center justify-center">
                      <a
                        href="/privacy-policy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
                      >
                        {language === "sv"
                          ? "Läs om vår AI-policy"
                          : "Read about our AI policy"}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
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
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      isUserScrollingRef.current = false;
                      scrollToBottom("smooth");
                    }}
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
                rows={1}
                ref={inputRef}
                className="text-base! resize-none max-h-[200px] overflow-y-auto"
                style={{ fontSize: "16px" }}
              />
              <InputGroupAddon align="block-end">
                <div className="flex items-center gap-0 min-w-0 flex-1">
                  <TooltipProvider delayDuration={0}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => {
                            setGiveDirectAnswer(true);
                            if (inputRef.current) {
                              inputRef.current.focus();
                            }
                          }}
                          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors border-y border-l rounded-l-md cursor-pointer ${
                            giveDirectAnswer
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-background text-muted-foreground border-border hover:bg-accent hover:text-foreground"
                          }`}
                        >
                          <BookOpen className="h-3.5 w-3.5" />
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
                            setGiveDirectAnswer(false);
                            if (inputRef.current) {
                              inputRef.current.focus();
                            }
                          }}
                          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors border-y border-r rounded-r-md cursor-pointer ${
                            !giveDirectAnswer
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-background text-muted-foreground border-border hover:bg-accent hover:text-foreground"
                          }`}
                        >
                          <Lightbulb className="h-3.5 w-3.5" />
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
