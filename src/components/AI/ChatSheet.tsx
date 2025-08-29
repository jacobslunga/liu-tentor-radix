import { ArrowUp, Loader2, Sparkles, X } from "lucide-react";
import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "../ui/sheet";

import { Button } from "@/components/ui/button";
import { ExamWithSolutions } from "@/types/exam";
import GeminiResponse from "@/components/AI/GeminiResponse";
import { LogoIcon } from "../LogoIcon";
import { cn } from "@/lib/utils";
import { streamChatResponse } from "@/api/chatService";
import { useLanguage } from "@/context/LanguageContext";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Props {
  exam: ExamWithSolutions | null;
  open: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChatSheet: FC<Props> = ({ exam, open, onOpenChange }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [value, setValue] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const { language } = useLanguage();

  const placeholder =
    language === "sv"
      ? "Fråga vad som helst om tentan"
      : "Ask anything about the exam";

  const examplesSv = [
    "Förklara vad de gjorde i uppgift 2",
    "Hur löser man uppgift 3 med egenvärden och egenvektorer?",
    "Kan du visa en metod för att hitta en ON-bas i tre dimensioner?",
    "Hur använder man Lagrange-metoden i optimeringsproblem som uppgift 5?",
    "Ge en steg-för-steg lösning på integralen i uppgift 4",
  ];

  const examplesEn = [
    "Explain what they did in question 2",
    "How do you solve question 3 using eigenvalues and eigenvectors?",
    "Can you show a method for finding an orthonormal basis in 3D?",
    "How is the Lagrange multiplier method used in optimization problems like question 5?",
    "Give a step-by-step solution to the integral in question 4",
  ];
  const examples = language === "sv" ? examplesSv : examplesEn;

  const [typed, setTyped] = useState("");
  const [exIndex, setExIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  const showHero = messages.length === 0 && value.length === 0;

  useEffect(() => {
    if (!showHero) return;
    const current = examples[exIndex % examples.length] || "";
    const doneTyping = charIndex === current.length && !deleting;
    const doneDeleting = charIndex === 0 && deleting;
    const speed = deleting ? 30 : 55;
    const pause = doneTyping ? 1200 : doneDeleting ? 500 : 0;
    const timer = setTimeout(() => {
      if (doneTyping) {
        setDeleting(true);
      } else if (doneDeleting) {
        setDeleting(false);
        setExIndex((i) => (i + 1) % examples.length);
      } else {
        setCharIndex((c) => c + (deleting ? -1 : 1));
        setTyped(current.slice(0, deleting ? charIndex - 1 : charIndex + 1));
      }
    }, pause || speed);
    return () => clearTimeout(timer);
  }, [showHero, examples, exIndex, charIndex, deleting]);

  useEffect(() => {
    if (!showHero) return;
    const current = examples[exIndex % examples.length] || "";
    setTyped(current.slice(0, charIndex));
  }, [showHero, exIndex, charIndex, examples]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "0px";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 320) + "px";
    }
  }, [value]);

  const basePrompt = useMemo(
    () =>
      language === "sv"
        ? "Svara på samma språk som frågan. Svara ALLTID med Latex matematisk notering om det behövs."
        : "Answer in the same language as the question. ALWAYS answer with Latex mathematical notation if necessary.",
    [language]
  );

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight;
    });
  }, [messages, submitting]);

  const sendMessage = useCallback(
    async (val: string) => {
      if (!val.trim() || submitting || !exam) return;
      const userMessage: Message = { role: "user", content: val };
      setMessages((prev) => [
        ...prev,
        userMessage,
        { role: "assistant", content: "" },
      ]);
      setValue("");
      setSubmitting(true);
      try {
        const stream = streamChatResponse(
          `${basePrompt}\n\n${val}`,
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
        setSubmitting(false);
      }
    },
    [exam, submitting, language, basePrompt]
  );

  const handleSubmit = () => sendMessage(value);

  const handleKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (
    e
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const contextLine =
    language === "sv"
      ? "Denna chatt har redan sammanhang: aktuell tenta och första facit om det finns."
      : "This chat already has context: the current exam and the first solution if available.";

  const cautionLine =
    language === "sv"
      ? "Svar kan vara felaktiga. Kontrollera alltid mot facit eller examinator."
      : "Answers may be incorrect. Always verify with the solution or the examiner.";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button size="sm" variant="ghost" aria-label="AI">
          <Sparkles className="w-8 h-8" />
          Fråga AI
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className={cn("p-0 border-r min-w-[60vw]")}>
        <div className="flex h-full w-full flex-col">
          {/* slim header with only control */}
          <SheetHeader className="sticky top-0 z-10 bg-background px-2 py-1 flex justify-start">
            <Button
              size="icon"
              variant="ghost"
              className="self-end"
              onClick={() => onOpenChange(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </SheetHeader>

          <div className="flex-1 overflow-hidden">
            <div ref={scrollRef} className="h-full w-full overflow-y-auto">
              <div className="px-10 py-6 space-y-6">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center text-center gap-2 pt-6">
                    <LogoIcon className="w-14 h-14 mb-4" />
                    <div className="text-lg text-foreground/90 font-medium">
                      {typed}
                      <span className="animate-pulse">▍</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {contextLine}
                    </div>
                    <a
                      href="https://gemini.google.com/app"
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-foreground/60 underline"
                    >
                      Powered by Gemini
                    </a>
                  </div>
                ) : (
                  messages.map((msg, index) => (
                    <div
                      key={index}
                      className={cn(
                        "w-full flex",
                        msg.role === "user" ? "justify-end" : "justify-start"
                      )}
                    >
                      <div
                        className={cn(
                          "px-4 py-3",
                          msg.role === "user"
                            ? "w-auto rounded-2xl border bg-secondary"
                            : "w-full"
                        )}
                      >
                        {msg.content ? (
                          <GeminiResponse text={msg.content} />
                        ) : (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* input */}
          <div className="w-full sticky bottom-0 bg-background px-3 pb-3">
            <div className="rounded-2xl border shadow-lg bg-background/70 backdrop-blur p-3">
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={placeholder}
                  className="w-full resize-none bg-transparent outline-none font-normal text-base leading-7 px-3 pt-2 pb-10 min-h-[80px]"
                  rows={1}
                  spellCheck
                  aria-label="AI query input"
                  autoFocus
                />
                <div className="absolute right-3 bottom-3">
                  <Button
                    onClick={handleSubmit}
                    disabled={submitting || !value.trim() || !exam}
                    variant={
                      submitting || !value.trim() || !exam
                        ? "outline"
                        : "default"
                    }
                    size="icon"
                  >
                    {submitting ? (
                      <Loader2 className="animate-spin text-foreground/70" />
                    ) : (
                      <ArrowUp className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
            <div className="text-[11px] leading-snug text-muted-foreground mt-2 px-2 flex flex-row w-full items-center justify-between gap-1">
              <div>
                {language === "sv"
                  ? "Skift+Enter för ny rad"
                  : "Shift+Enter for a new line"}
              </div>
              <div>{cautionLine}</div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ChatSheet;
