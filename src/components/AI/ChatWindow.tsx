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
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "user",
      content:
        "Can you help me understand how to solve dynamic programming problems? I'm working on a fibonacci problem.",
    },
    {
      role: "assistant",
      content: `Of course! Dynamic programming is all about breaking down problems into smaller subproblems and storing their results. Let me show you a few approaches to the Fibonacci problem in different languages.

First, here's a classic recursive approach with memoization in Python:

\`\`\`python
def fibonacci(n, memo={}):
    if n in memo:
        return memo[n]
    if n <= 1:
        return n
    memo[n] = fibonacci(n-1, memo) + fibonacci(n-2, memo)
    return memo[n]

# Example usage
print(fibonacci(10))  # Output: 55
\`\`\`

Here's the same concept in JavaScript using an iterative approach:

\`\`\`javascript
function fibonacci(n) {
    if (n <= 1) return n;
    
    let prev = 0, curr = 1;
    for (let i = 2; i <= n; i++) {
        let next = prev + curr;
        prev = curr;
        curr = next;
    }
    return curr;
}

console.log(fibonacci(10)); // Output: 55
\`\`\`

And finally, here's a TypeScript version with proper typing:

\`\`\`typescript
function fibonacci(n: number): number {
    const dp: number[] = new Array(n + 1);
    dp[0] = 0;
    dp[1] = 1;
    
    for (let i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    
    return dp[n];
}

const result: number = fibonacci(10);
console.log(result); // Output: 55
\`\`\`

The key insight is that we avoid recalculating the same values multiple times. Each approach has O(n) time complexity instead of the exponential O(2^n) of naive recursion.`,
    },
    {
      role: "user",
      content:
        "That's really helpful! Can you also show me a C++ example with optimization?",
    },
    {
      role: "assistant",
      content: `Absolutely! Here's an optimized C++ version that uses constant space:

\`\`\`cpp
#include <iostream>
using namespace std;

long long fibonacci(int n) {
    if (n <= 1) return n;
    
    long long prev = 0, curr = 1;
    for (int i = 2; i <= n; i++) {
        long long next = prev + curr;
        prev = curr;
        curr = next;
    }
    return curr;
}

int main() {
    int n = 10;
    cout << "Fibonacci(" << n << ") = " << fibonacci(n) << endl;
    return 0;
}
\`\`\`

This version only uses O(1) space instead of O(n), making it more memory-efficient for large values of n.

You can also use matrix exponentiation for even faster computation when dealing with very large numbers, but that's a more advanced technique!`,
    },
  ]);
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
                    <img
                      src="/aibutton.svg"
                      alt="AI"
                      className="h-20 w-20 object-cover"
                    />
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
