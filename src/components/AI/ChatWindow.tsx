import { FC, useState, useRef, useEffect, memo } from "react";
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
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUpIcon, X } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { LogoIcon } from "../LogoIcon";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatWindowProps {
  examId: string;
  examName: string;
  hasSolution: boolean;
  isOpen: boolean;
  onClose: () => void;
}

const ChatWindow: FC<ChatWindowProps> = ({
  examId,
  examName,
  hasSolution,
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  console.log(examId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(
        `http://localhost:8787/exams/${examId}/chat`,
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

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          assistantMessage += chunk;

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
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleClose = () => {
    setInput("");
    onClose();
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
          {/* Header */}
          <div className="flex items-center justify-between h-14 px-5 border-b">
            <h2 className="text-lg font-semibold">{t("aiChatTitle")}</h2>
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  {message.role === "assistant" ? (
                    <div className="prose prose-sm dark:prose-invert">
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
                            <pre {...props} className="overflow-x-auto my-3" />
                          ),
                          code: (props) => (
                            <code {...props} className="break-words" />
                          ),
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>
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
          <div className="p-3 border-t space-y-3 relative before:absolute before:top-0 before:left-0 before:right-0 before:h-4 before:bg-gradient-to-b before:from-background before:to-transparent before:pointer-events-none before:-translate-y-full">
            <InputGroup>
              <InputGroupTextarea
                placeholder={t("aiChatPlaceholder")}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
                rows={4}
                className="!text-base xl:!text-lg resize-none !min-h-[120px]"
                style={{ fontSize: "16px" }}
              />
              <InputGroupAddon align="block-end">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <span className="text-xs text-muted-foreground truncate">
                    {examName || "Loading..."}
                  </span>
                  {hasSolution && (
                    <Badge
                      variant="outline"
                      className="text-xs shrink-0 whitespace-nowrap"
                    >
                      + {t("facit")}
                    </Badge>
                  )}
                </div>
                <Separator orientation="vertical" className="!h-6 ml-2" />
                <InputGroupButton
                  variant="default"
                  className="rounded-full ml-2 !h-12 !w-12"
                  size="icon-sm"
                  disabled={!input.trim() || isLoading}
                  onClick={sendMessage}
                >
                  <ArrowUpIcon className="h-6 w-6" />
                  <span className="sr-only">{t("aiChatSend")}</span>
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
            <p className="text-xs text-muted-foreground text-center">
              {t("aiChatPoweredBy")}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default memo(ChatWindow);
