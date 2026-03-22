import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useMetadata } from "@/hooks/useMetadata";
import { useTranslation } from "@/hooks/useTranslation";
import ReactMarkdown from "react-markdown";

const contentSv = `
# Plugga med Claude

Vi har integrerat Claude från Anthropic direkt i tentaarkivet. Det betyder att du kan ställa frågor om gamla tentor och få förklaringar utan att lämna sidan.

---

## Varför Claude?

Claude är bra på matematik. Den hanterar derivator, integraler, linjär algebra och andra beräkningar som dyker upp på LiU:s tentor med hög precision. Den visar också sina steg, så du kan följa med i lösningen.

Svar kommer snabbt. Du slipper vänta eller söka runt — ställ en fråga och få ett genomarbetat svar på några sekunder.

Claude är också ärlig när den inte vet. Istället för att hitta på ett svar säger den ifrån, vilket gör den mer pålitlig än många alternativ.

## Hints-läge

Om du vill öva utan att få hela svaret direkt kan du slå på hints. Då ger Claude dig ledtrådar och vägledning istället, så du tvingas tänka själv. Bra inför tentan.

## Så funkar det

1. Sök efter en kurs och öppna en tenta.
2. Skriv din fråga i chatten.
3. Välj modell — Claude Haiku för snabba svar, eller en Gemini-modell om du vill jämföra.
4. Slå på hints om du vill ha pedagogisk vägledning istället för raka svar.

## Språk

Du kan skriva på svenska eller engelska. Claude svarar på samma språk som du frågar på.

## Integritet

Dina frågor skickas till Anthropic eller Google för att generera svar. Vi lagrar inte konversationer längre än nödvändigt. Läs mer i vår [integritetspolicy](/privacy-policy).
`;

const contentEn = `
# Study with Claude

We've integrated Claude by Anthropic directly into the exam archive. You can ask questions about past exams and get explanations without leaving the page.

---

## Why Claude?

Claude is good at math. It handles derivatives, integrals, linear algebra, and other calculations that show up on LiU exams with high accuracy. It also shows its steps so you can follow the solution.

Responses are fast. No waiting around or searching elsewhere — ask a question and get a thorough answer in a few seconds.

Claude is also honest when it doesn't know something. Instead of making up an answer, it tells you, which makes it more reliable than many alternatives.

## Hints mode

If you want to practice without getting the full answer right away, you can enable hints. Claude will give you clues and guidance instead, forcing you to think for yourself. Great for exam prep.

## How it works

1. Search for a course and open an exam.
2. Type your question in the chat.
3. Pick a model — Claude Haiku for fast answers, or a Gemini model if you want to compare.
4. Turn on hints if you want pedagogical guidance instead of direct answers.

## Language

You can write in Swedish or English. Claude responds in the same language you ask in.

## Privacy

Your questions are sent to Anthropic or Google to generate answers. We don't store conversations longer than necessary. Read more in our [privacy policy](/privacy-policy).
`;

export default function StudyWithClaudePage() {
  const { t } = useTranslation();

  const isSv = (t("homeTitle") || "").toLowerCase().includes("tentor");

  useMetadata({
    title: isSv
      ? "Plugga med Claude | LiU Tentor"
      : "Study with Claude | LiU Tentor",
    description: isSv
      ? "Lär dig hur Claude AI hjälper dig plugga smartare."
      : "Learn how Claude AI helps you study smarter.",
    robots: "index, follow",
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto w-full max-w-2xl px-4 py-12 md:py-16">
        <div className="mb-8">
          <Link to="/" viewTransition>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground -ml-2"
            >
              ← {isSv ? "Tillbaka" : "Back"}
            </Button>
          </Link>
        </div>

        <article className="prose prose-neutral dark:prose-invert max-w-none prose-headings:tracking-tight prose-h1:text-2xl prose-h1:font-semibold prose-h2:text-lg prose-h2:font-medium prose-p:text-[15px] prose-p:leading-relaxed prose-li:text-[15px] prose-a:text-primary prose-hr:my-6">
          <ReactMarkdown>{isSv ? contentSv : contentEn}</ReactMarkdown>
        </article>
      </main>
    </div>
  );
}
