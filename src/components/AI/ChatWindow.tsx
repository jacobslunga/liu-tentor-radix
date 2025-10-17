import { FC, useState, useRef, useEffect, useCallback } from "react";
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
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyMedia,
} from "@/components/ui/empty";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUpIcon, X, ArrowDown, Loader2 } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { LogoIcon } from "../LogoIcon";
import { ExamWithSolutions } from "@/types/exam";
import { useLanguage } from "@/context/LanguageContext";

const markdownString = `
  "För att kunna förklara Uppgift 1, låt oss gå igenom vad som efterfrågas och hur man kan lösa den.

**Uppgift 1:**
"Ange en ekvation på normalform för det plan som innehåller punkterna (3, 0, −1), (−1, 1, 0) och (4, 1, −2)."

---

### Steg för att lösa Uppgift 1:

1. **Identifiera punkterna:**
   Vi har tre punkter:
   - \( P_1 = (3, 0, -1) \)
   - \( P_2 = (-1, 1, 0) \)
   - \( P_3 = (4, 1, -2) \)

2. **Hitta två vektorer i planet:**
   Välj en punkt, till exempel \( P_1 \), och bilda två vektorer i planet:
   \[
   \vec{v}_1 = P_2 - P_1 = (-1 - 3, 1 - 0, 0 - (-1)) = (-4, 1, 1)
   \]
   \[
   \vec{v}_2 = P_3 - P_1 = (4 - 3, 1 - 0, -2 - (-1)) = (1, 1, -1)
   \]

3. **Beräkna normalvektorn till planet:**
   Normalvektorn \(\vec{n}\) är vektorn som är korsprodukt av \(\vec{v}_1\) och \(\vec{v}_2\):
   \[
   \vec{n} = \vec{v}_1 \times \vec{v}_2
   \]

   Korsprodukten:
   \[
   \vec{n} =
   \begin{vmatrix}
   \mathbf{i} & \mathbf{j} & \mathbf{k} \\
   -4 & 1 & 1 \\
   1 & 1 & -1
   \end{vmatrix}
   \]

   Beräkning:
   \[
   \vec{n} = \mathbf{i} \cdot (1 \cdot (-1) - 1 \cdot 1) - \mathbf{j} \cdot (-4 \cdot (-1) - 1 \cdot 1) + \mathbf{k} \cdot (-4 \cdot 1 - 1 \cdot 1)
   \]

   \[
   = \mathbf{i} \cdot (-1 - 1) - \mathbf{j} \cdot (4 - 1) + \mathbf{k} \cdot (-4 - 1)
   \]

   \[
   = \mathbf{i} \cdot (-2) - \mathbf{j} \cdot 3 + \mathbf{k} \cdot (-5)
   \]

   \[
   \Rightarrow \vec{n} = (-2, -3, -5)
   \]

   Vi kan multiplicera vektorn med -1 för enklare tecken, men det är inte nödvändigt.

   **Normalvektorn kan alltså vara:**
   \[
   \boxed{\vec{n} = (2, 3, 5)}
   \]

4. **Ekvation för planet i normalform:**
   Ekvationen för en plan i normalform är:
   \[
   \vec{n} \cdot (x, y, z) = d
   \]
   där \( d = \vec{n} \cdot P_1 \).

   Beräkna:
   \[
   d = 2 \times 3 + 3 \times 0 + 5 \times (-1) = 6 + 0 - 5 = 1
   \]

5. **Svar:**
   **Ekvationen på normalform för planet är:**
   \[
   2x + 3y + 5z = 1
   \]

---

### **Sammanfattning:**
- Härledde två vektorer i planet genom att subtrahera punkter.
- Beräknade deras korsprodukt till normalvektorn.
- Satt in normalvektorn och en punkt i planet i ekvationsformen.

---

Jag hoppas att detta hjälper dig att förstå hur man löser Uppgift 1! Om du vill ha ytterligare förklaring eller exempel, säg bara till!
`;

const mathEx = `
    $$
    \displaystyle\sum_{k=3}^5 k^2=3^2 + 4^2 + 5^2 =50
    $$
`;

const normalizeMath = (s: string) =>
  s
    .replace(/\\\[/g, "$$")
    .replace(/\\\]/g, "$$")
    .replace(/\\\(/g, "$")
    .replace(/\\\)/g, "$");

const stripIndent = (s: string) =>
  s.replace(/^\n/, "").replace(/^[ \t]+/gm, "");

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
      role: "assistant",
      content: mathEx,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  const handleClose = useCallback(() => {
    setInput("");
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (autoScroll) {
      scrollToBottom("smooth");
    }
  }, [messages, autoScroll]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;

      setShowScrollButton(!isNearBottom);
      setAutoScroll(isNearBottom);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

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
    setIsStreaming(true);
    setAutoScroll(true);

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
        },
      );

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = "";
      let isFirstChunk = true;

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          assistantMessage += chunk;

          // Remove loading state after first chunk
          if (isFirstChunk) {
            setIsStreaming(false);
            isFirstChunk = false;
          }

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
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Något gick fel. Försök igen senare.",
        },
      ]);
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
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
          {/* Close button - floating */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="absolute top-2 right-2 z-10"
          >
            <X className="h-4 w-4" />
          </Button>

          <div
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto p-4 pt-12 space-y-4 relative"
          >
            {messages.length === 0 && (
              <Empty className="h-full border-0">
                <EmptyHeader>
                  <EmptyMedia variant="default">
                    <LogoIcon className="w-12 h-12" />
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
                <div
                  className={`max-w-[100%] rounded-lg p-3 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-background"
                  }`}
                >
                  {message.role === "assistant" ? (
                    message.content === "" && isStreaming ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm text-muted-foreground">
                          {language === "sv" ? "Tänker..." : "Thinking..."}
                        </span>
                      </div>
                    ) : (
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <ReactMarkdown
                          remarkPlugins={[remarkMath, remarkGfm]}
                          rehypePlugins={[rehypeKatex]}
                          components={{
                            a: (props) => (
                              <a
                                {...props}
                                rel="noopener noreferrer"
                                className="underline"
                              />
                            ),
                            pre: (props) => (
                              <pre
                                {...props}
                                className="overflow-x-auto my-3 bg-muted/50 rounded p-2"
                              />
                            ),
                            code: ({ inline, ...props }: any) =>
                              inline ? (
                                <code
                                  {...props}
                                  className="bg-muted/50 px-1 py-0.5 rounded text-sm"
                                />
                              ) : (
                                <code {...props} className="break-words" />
                              ),
                            p: (props) => <p {...props} className="my-2" />,
                            ul: (props) => (
                              <ul {...props} className="my-2 ml-4 list-disc" />
                            ),
                            ol: (props) => (
                              <ol
                                {...props}
                                className="my-2 ml-4 list-decimal"
                              />
                            ),
                            li: (props) => <li {...props} className="my-1" />,
                            h1: (props) => (
                              <h1
                                {...props}
                                className="text-lg font-bold mt-4 mb-2"
                              />
                            ),
                            h2: (props) => (
                              <h2
                                {...props}
                                className="text-base font-bold mt-3 mb-2"
                              />
                            ),
                            h3: (props) => (
                              <h3
                                {...props}
                                className="text-sm font-bold mt-2 mb-1"
                              />
                            ),
                          }}
                        >
                          {stripIndent(normalizeMath(message.content))}
                        </ReactMarkdown>
                      </div>
                    )
                  ) : (
                    <p className="text-sm whitespace-pre-wrap">
                      {message.content}
                    </p>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="px-2 space-y-2 relative">
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
                className="!text-sm resize-none"
                style={{ fontSize: "14px" }}
              />
              <InputGroupAddon align="block-end">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <Badge className="text-xs truncate" variant="secondary">
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
              <p className="text-[9px] text-muted-foreground text-center">
                {t("aiChatPoweredBy")}
              </p>

              <p className="text-[9px] text-muted-foreground text-center">
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
