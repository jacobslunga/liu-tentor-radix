import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Loader2, SendHorizonal } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";

import { Button } from "@/components/ui/button";
import { ExamWithSolutions } from "@/types/exam";
import GeminiResponse from "@/components/AI/GeminiResponse";
import { LogoIcon } from "../LogoIcon";
import { Textarea } from "../ui/textarea";
import { cn } from "@/lib/utils";
import { streamChatResponse } from "@/api/chatService";
import { useLanguage } from "@/context/LanguageContext";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Props {
  exam: ExamWithSolutions | null;
}

const ChatSheet: FC<Props> = ({ exam }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();

  const placeholder = useMemo(
    () =>
      language === "sv"
        ? "Ställ en fråga om uppgift 1…"
        : "Ask about question 1…",
    [language]
  );

  const basePrompt = useMemo(
    () =>
      language === "sv"
        ? "Svara på samma språk som frågan. Använd LaTeX för matematik när det är hjälpsamt."
        : "Answer in the same language as the question. Use LaTeX for math when helpful.",
    [language]
  );

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight;
    });
  }, [messages, isLoading]);

  const sendMessage = useCallback(
    async (value: string) => {
      if (!value.trim() || isLoading || !exam) return;
      const userMessage: Message = { role: "user", content: value };
      setMessages((prev) => [
        ...prev,
        userMessage,
        { role: "assistant", content: "" },
      ]);
      setInput("");
      setIsLoading(true);
      try {
        const stream = streamChatResponse(
          `${basePrompt}\n\n${value}`,
          exam.exam.pdf_url,
          exam.solutions.length > 0 ? exam.solutions[0].pdf_url : null
        );
        for await (const chunk of stream) {
          setMessages((prev) => {
            const next = [...prev];
            next[next.length - 1] = {
              role: "assistant",
              content: next[next.length - 1].content + chunk,
            };
            return next;
          });
        }
      } catch {
        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = {
            role: "assistant",
            content:
              language === "sv"
                ? "Något gick fel. Försök igen."
                : "An error occurred. Please try again.",
          };
          return next;
        });
      } finally {
        setIsLoading(false);
      }
    },
    [exam, isLoading, language, basePrompt]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendMessage(input);
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (
    e
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void sendMessage(input);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="sm">Fråga AI</Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className={cn("p-0 border-l w-screen min-w-[50vw]")}
      >
        <div className="flex h-full w-full flex-col">
          <SheetHeader className="sticky top-0 z-10 border-b bg-background px-6 pt-6 pb-3">
            <SheetTitle className="text-2xl">LiU Tentor AI</SheetTitle>
          </SheetHeader>

          <div className="flex-1 overflow-hidden">
            <div ref={scrollRef} className="h-full w-full overflow-y-auto">
              <div className="px-6 py-6 space-y-6">
                {messages.length === 0 && (
                  <div className="text-center flex items-center justify-center flex-col text-lg text-muted-foreground pt-10">
                    <LogoIcon className="w-10 h-10 self-center mb-2" />
                    <p>
                      {language === "sv"
                        ? "Vad behöver du hjälp med?"
                        : "What do you need help with?"}
                    </p>
                    <p className="text-[10px] text-foreground/60 mt-1">
                      Powered by{" "}
                      <a href="https://gemini.google.com/app">Gemini</a>
                    </p>
                  </div>
                )}
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex items-start gap-3",
                      msg.role === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "rounded-2xl px-4 py-3 text-sm max-w-[85%] border",
                        msg.role === "user"
                          ? "bg-muted/50 text-foreground border-border"
                          : "bg-card text-foreground border-border"
                      )}
                    >
                      {msg.content ? (
                        <GeminiResponse text={msg.content} />
                      ) : (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="sticky bottom-0 z-10 border-t bg-background p-4">
            <form onSubmit={handleSubmit} className="flex items-end gap-3">
              <div className="flex w-full items-end gap-2 rounded-full border bg-background shadow-sm ring-1 ring-border px-3 py-2">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={placeholder}
                  disabled={isLoading || !exam}
                  autoComplete="off"
                  className="min-h-[52px] w-full resize-none border-0 bg-transparent px-3 py-2 leading-6 focus-visible:ring-0 focus-visible:outline-none"
                />
              </div>
              <Button
                type="submit"
                size="icon"
                disabled={isLoading || !input.trim() || !exam}
                className="h-[52px] w-[52px] rounded-xl"
              >
                <SendHorizonal className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ChatSheet;
