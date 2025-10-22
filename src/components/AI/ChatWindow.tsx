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
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyMedia,
} from "@/components/ui/empty";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowUpIcon,
  ArrowDown,
  ChevronRight,
  Loader2,
  Check,
  Copy,
} from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { ExamWithSolutions } from "@/types/exam";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { LogoIcon } from "../LogoIcon";

const normalizeMath = (s: string) =>
  s
    .replace(/\\\[/g, "$$")
    .replace(/\\\]/g, "$$")
    .replace(/\\\(/g, "$")
    .replace(/\\\)/g, "$");

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
              fontSize: "0.95rem",
              lineHeight: "1.6",
              borderRadius: 0,
              fontFamily: "Jetbrains Mono",
            }}
            showLineNumbers={false}
            wrapLines={false}
            wrapLongLines={true}
            codeTagProps={{
              style: {
                fontSize: "0.95rem",
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
  const [width, setWidth] = useState(50); // Width as percentage
  const [isResizing, setIsResizing] = useState(false);
  const chatWindowRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>(codeMsgs);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const isUserScrollingRef = useRef(false);

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  const handleClose = useCallback(() => {
    setInput("");
    onClose();
  }, [onClose]);

  // Scroll to bottom when new messages arrive (only if auto-scroll is enabled)
  useEffect(() => {
    if (
      messages.length > 0 &&
      autoScrollEnabled &&
      !isUserScrollingRef.current
    ) {
      requestAnimationFrame(() => {
        scrollToBottom("smooth");
      });
    }
  }, [messages, autoScrollEnabled]);

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
        setAutoScrollEnabled(false);
      } else if (isNearBottom) {
        isUserScrollingRef.current = false;
        setAutoScrollEnabled(true);
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

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        isOpen &&
        chatWindowRef.current &&
        !chatWindowRef.current.contains(e.target as Node)
      ) {
        handleClose();
      }
    };

    if (isOpen) {
      setTimeout(() => {
        document.addEventListener("mousedown", handleClickOutside);
      }, 100);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, handleClose]);

  // Handle resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      const windowWidth = window.innerWidth;
      const newWidth = ((windowWidth - e.clientX) / windowWidth) * 100;

      // Constrain between 25% and 75%
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

    // Re-enable auto-scroll when sending a new message
    setAutoScrollEnabled(true);
    isUserScrollingRef.current = false;

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
            className="absolute left-0 top-0 bottom-0 w-2 cursor-col-resize hover:bg-primary/20 transition-colors group z-50"
            onMouseDown={() => setIsResizing(true)}
          >
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-16 bg-border group-hover:bg-primary/50 transition-colors rounded-r flex items-center justify-center" />
          </div>
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
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setAutoScrollEnabled(true);
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
                rows={2}
                className="text-base! resize-none"
                style={{ fontSize: "16px" }}
              />
              <InputGroupAddon align="block-end">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <Badge className="text-xs truncate" variant="outline">
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

// const codeMsgs: Message[] = [
//   {
//     role: "user",
//     content:
//       "Can you help me understand how to solve dynamic programming problems? I'm working on a fibonacci problem.",
//   },
//   {
//     role: "assistant",
//     content: `Of course! Dynamic programming is all about breaking down problems into smaller subproblems and storing their results. Let me show you a few approaches to the Fibonacci problem in different languages.

// First, here's a classic recursive approach with memoization in Python:

// \`\`\`python
// def fibonacci(n, memo={}):
//     if n in memo:
//         return memo[n]
//     if n <= 1:
//         return n
//     memo[n] = fibonacci(n-1, memo) + fibonacci(n-2, memo)
//     return memo[n]

// # Example usage
// print(fibonacci(10))  # Output: 55
// \`\`\`

// Here's the same concept in JavaScript using an iterative approach:

// \`\`\`javascript
// function fibonacci(n) {
//     if (n <= 1) return n;

//     let prev = 0, curr = 1;
//     for (let i = 2; i <= n; i++) {
//         let next = prev + curr;
//         prev = curr;
//         curr = next;
//     }
//     return curr;
// }

// console.log(fibonacci(10)); // Output: 55
// \`\`\`

// And finally, here's a TypeScript version with proper typing:

// \`\`\`typescript
// function fibonacci(n: number): number {
//     const dp: number[] = new Array(n + 1);
//     dp[0] = 0;
//     dp[1] = 1;

//     for (let i = 2; i <= n; i++) {
//         dp[i] = dp[i - 1] + dp[i - 2];
//     }

//     return dp[n];
// }

// const result: number = fibonacci(10);
// console.log(result); // Output: 55
// \`\`\`

// The key insight is that we avoid recalculating the same values multiple times. Each approach has O(n) time complexity instead of the exponential O(2^n) of naive recursion.`,
//   },
//   {
//     role: "user",
//     content:
//       "That's really helpful! Can you also show me a C++ example with optimization?",
//   },
//   {
//     role: "assistant",
//     content: `Absolutely! Here's an optimized C++ version that uses constant space:

// \`\`\`cpp
// #include <iostream>
// using namespace std;

// long long fibonacci(int n) {
//     if (n <= 1) return n;

//     long long prev = 0, curr = 1;
//     for (int i = 2; i <= n; i++) {
//         long long next = prev + curr;
//         prev = curr;
//         curr = next;
//     }
//     return curr;
// }

// int main() {
//     int n = 10;
//     cout << "Fibonacci(" << n << ") = " << fibonacci(n) << endl;
//     return 0;
// }
// \`\`\`

// This version only uses O(1) space instead of O(n), making it more memory-efficient for large values of n.

// You can also use matrix exponentiation for even faster computation when dealing with very large numbers, but that's a more advanced technique!`,
//   },
// ];
