import { FC, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LogoIcon } from "../LogoIcon";
import { useLanguage } from "@/context/LanguageContext";

const AI_INTRO_SEEN_KEY = "liu-tentor-ai-intro-seen";

interface AIIntroDialogProps {
  onGetStarted?: () => void;
}

export const AIIntroDialog: FC<AIIntroDialogProps> = ({ onGetStarted }) => {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [typed, setTyped] = useState("");
  const [charIndex, setCharIndex] = useState(0);
  const [exampleIndex, setExampleIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

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

  useEffect(() => {
    // Check if user has seen the intro
    const hasSeen = localStorage.getItem(AI_INTRO_SEEN_KEY);
    if (!hasSeen) {
      // Show dialog after a short delay for better UX
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Typing effect for examples
  useEffect(() => {
    if (!isOpen) return;

    const currentExample = examples[exampleIndex];
    const isTypingComplete = charIndex === currentExample.length && !deleting;
    const isDeletingComplete = charIndex === 0 && deleting;

    if (isTypingComplete) {
      const timer = setTimeout(() => setDeleting(true), 1000);
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
  }, [isOpen, charIndex, deleting, exampleIndex, examples]);

  const handleGetStarted = () => {
    localStorage.setItem(AI_INTRO_SEEN_KEY, "true");
    setIsOpen(false);
    onGetStarted?.();
  };

  const handleSkip = () => {
    localStorage.setItem(AI_INTRO_SEEN_KEY, "true");
    setIsOpen(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      localStorage.setItem(AI_INTRO_SEEN_KEY, "true");
    }
    setIsOpen(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-5xl overflow-hidden p-0">
        <div className="absolute inset-0 mesh opacity-80 dark:opacity-20" />

        <div className="relative p-8">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-4">
              <LogoIcon className="w-12 h-12" />
              <div className="flex flex-col">
                <DialogTitle className="text-xl font-semibold font-logo leading-tight">
                  LiU Tentor
                </DialogTitle>
                <span className="text-lg font-semibold text-muted-foreground leading-tight">
                  Chat
                </span>
              </div>
            </div>
            <DialogDescription className="sr-only">
              AI Assistant Introduction
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center justify-center min-h-[250px] py-12">
            <h2 className="text-3xl font-semibold text-center">
              {typed}
              <span className="inline-block w-5 h-5 rounded-full bg-black dark:bg-white ml-2" />
            </h2>
          </div>

          {/* Description */}
          <div className="max-w-2xl mx-auto space-y-4 mb-8">
            <p className="text-base text-center leading-relaxed">
              {language === "sv" ? (
                <>
                  Vi har introducerat <strong>Chatten</strong> som hjälper dig
                  att förstå och lära dig från tentor. Ställ frågor, få
                  förklaringar och förbättra din förståelse direkt i tentavyn.
                </>
              ) : (
                <>
                  We've introduced <strong>Chat</strong> to help you understand
                  and learn from exams. Ask questions, get explanations, and
                  improve your understanding directly in the exam view.
                </>
              )}
            </p>

            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <span>{language === "sv" ? "Tryck" : "Press"}</span>
              <kbd className="px-2 py-1.5 text-xs font-semibold border rounded-md bg-muted">
                C
              </kbd>
              <span>
                {language === "sv"
                  ? "för att öppna Chatten när som helst"
                  : "to open the Chat anytime"}
              </span>
            </div>
          </div>

          <div className="flex gap-2 w-full items-center justify-center">
            <Button variant="ghost" onClick={handleSkip} size="lg">
              {language === "sv" ? "Hoppa över" : "Skip"}
            </Button>
            <Button onClick={handleGetStarted} size="lg">
              {language === "sv" ? "Kom igång" : "Get Started"}
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground/60 text-center mt-10">
            {language === "sv"
              ? "Powered by OpenAI. AI kan göra misstag, kontrollera alltid viktiga svar."
              : "Powered by OpenAI. AI can make mistakes, always verify important answers."}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
