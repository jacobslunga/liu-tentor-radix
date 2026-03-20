import { FC, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Cog,
  Cpu,
  RefreshCw,
} from "lucide-react";
import "katex/dist/katex.min.css";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/context/LanguageContext";
import { useMetadata } from "@/hooks/useMetadata";
import { markdownComponents } from "@/components/AI/chat/components/MarkdownComponents";
import { cn, generateId } from "@/lib/utils";
import { useQuiz } from "@/hooks/useQuiz";
import type { MultipleChoiceQuizResponse } from "@/types/quiz";

type Stage = "generating" | "answering" | "results";

type StoredQuizItem = {
  id: string;
  createdAt: string;
  data: MultipleChoiceQuizResponse;
};

const QUIZ_HISTORY_STORAGE_KEY = "liutentor.quiz.history.v1";
const MAX_STORED_QUIZZES = 30;

const GENERATION_MESSAGES_SV = [
  "Quizmotorn värmer upp med gamla tentor.",
  "Plockar ut rimliga frågor från tidigare prov.",
  "Sorterar koncept, distraktorer och lagom mycket stress.",
  "Bygger svarsalternativ med misstänkt självförtroende.",
  "Läser igenom tentor snabbare än någon människa borde kunna.",
  "Kalibrerar svårighetsgrad för maximal tenta-känsla.",
];

const GENERATION_MESSAGES_EN = [
  "Quiz engine warming up with old exams.",
  "Picking out reasonable questions from past tests.",
  "Sorting concepts, distractors, and a healthy amount of stress.",
  "Building answer choices with suspicious confidence.",
  "Reading past exams faster than anyone reasonably should.",
  "Calibrating difficulty for peak exam vibes.",
];

const MarkdownMathBlock = ({ content }: { content: string }) => (
  <ReactMarkdown
    remarkPlugins={[remarkMath]}
    rehypePlugins={[[rehypeKatex, { strict: false, throwOnError: false }]]}
    components={markdownComponents}
  >
    {content}
  </ReactMarkdown>
);

const QuizPage: FC = () => {
  const { courseCode = "" } = useParams<{ courseCode: string }>();
  const { language } = useLanguage();

  const [stage, setStage] = useState<Stage>("generating");
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number | null>>({});
  const [quizHistory, setQuizHistory] = useState<StoredQuizItem[]>([]);
  const [selectedHistoryId, setSelectedHistoryId] = useState<string>("latest");
  const [activeQuizData, setActiveQuizData] =
    useState<MultipleChoiceQuizResponse | null>(null);
  const [hasHydratedHistory, setHasHydratedHistory] = useState(false);
  const [hasInitializedQuizState, setHasInitializedQuizState] = useState(false);

  const { quizData, isLoading, error, generateQuiz, resetQuiz } =
    useQuiz(courseCode);

  const loadingMessages =
    language === "sv" ? GENERATION_MESSAGES_SV : GENERATION_MESSAGES_EN;

  useMetadata({
    title: `${courseCode} Quiz | Tentor`,
    description:
      language === "sv"
        ? "Träna på ett AI-genererat quiz med tidigare tentor."
        : "Practice with an AI-generated quiz from past exams.",
    canonical: `${window.location.origin}/quiz/${courseCode}`,
  });

  useEffect(() => {
    setLoadingMessageIndex(Math.floor(Math.random() * loadingMessages.length));
  }, [loadingMessages.length]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(QUIZ_HISTORY_STORAGE_KEY);
      if (!raw) return;

      const parsed = JSON.parse(raw) as StoredQuizItem[];
      if (!Array.isArray(parsed)) return;

      setQuizHistory(parsed);
    } catch {
      setQuizHistory([]);
    } finally {
      setHasHydratedHistory(true);
    }
  }, []);

  useEffect(() => {
    setSelectedHistoryId("latest");
    setCurrentIndex(0);
    setAnswers({});

    setHasInitializedQuizState(false);
    setActiveQuizData(null);
    resetQuiz();
  }, [courseCode, resetQuiz]);

  const currentCourseHistory = useMemo(
    () =>
      quizHistory.filter(
        (item) =>
          item.data.meta.courseCode.toUpperCase() === courseCode.toUpperCase(),
      ),
    [courseCode, quizHistory],
  );

  useEffect(() => {
    if (!hasHydratedHistory || hasInitializedQuizState) return;

    setHasInitializedQuizState(true);

    if (currentCourseHistory.length > 0) {
      const latestStored = currentCourseHistory[0];
      setActiveQuizData(latestStored.data);
      setStage("answering");
      setCurrentIndex(0);
      setAnswers({});
      setSelectedHistoryId(latestStored.id);
      return;
    }

    if (quizHistory.length > 0) {
      setStage("answering");
      return;
    }

    const initializeFirstQuiz = async () => {
      resetQuiz();
      setActiveQuizData(null);
      setStage("generating");
      setCurrentIndex(0);
      setAnswers({});
      setSelectedHistoryId("latest");
      setLoadingMessageIndex(
        Math.floor(Math.random() * loadingMessages.length),
      );
      await generateQuiz();
    };

    void initializeFirstQuiz();
  }, [
    generateQuiz,
    hasHydratedHistory,
    hasInitializedQuizState,
    loadingMessages.length,
    currentCourseHistory,
    quizHistory,
    resetQuiz,
  ]);

  useEffect(() => {
    if (!quizData?.quiz?.questions?.length) return;

    setActiveQuizData(quizData);
    setCurrentIndex(0);
    setAnswers({});
    setSelectedHistoryId("latest");

    const entry: StoredQuizItem = {
      id: generateId(),
      createdAt: new Date().toISOString(),
      data: quizData,
    };

    setQuizHistory((prev) => {
      const next = [entry, ...prev].slice(0, MAX_STORED_QUIZZES);
      localStorage.setItem(QUIZ_HISTORY_STORAGE_KEY, JSON.stringify(next));
      return next;
    });

    if (!isLoading) {
      setStage("answering");
    }
  }, [isLoading, quizData]);

  useEffect(() => {
    if (stage !== "generating" || !isLoading) return;

    const interval = setInterval(() => {
      setLoadingMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 1800);

    return () => clearInterval(interval);
  }, [stage, isLoading, loadingMessages.length]);

  const displayQuizData = activeQuizData;

  const quiz = displayQuizData?.quiz ?? null;
  const questions = quiz?.questions ?? [];
  const questionCount = questions.length;
  const currentQuestion = questions[currentIndex] ?? null;
  const isLastQuestion = currentIndex === questionCount - 1;

  const answeredCount = useMemo(
    () => questions.filter((q) => answers[q.id] !== undefined).length,
    [answers, questions],
  );

  const score = useMemo(
    () =>
      questions.reduce((acc, question) => {
        if (answers[question.id] === question.answer) return acc + 1;
        return acc;
      }, 0),
    [answers, questions],
  );

  const onChooseOption = (questionId: number, optionIndex: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const nextQuestion = () =>
    setCurrentIndex((prev) => {
      if (!currentQuestion || answers[currentQuestion.id] === undefined) {
        return prev;
      }
      return Math.min(prev + 1, questionCount - 1);
    });

  const previousQuestion = () =>
    setCurrentIndex((prev) => Math.max(prev - 1, 0));

  const canSubmit = questionCount > 0 && answeredCount === questionCount;
  const hasAnsweredCurrent =
    currentQuestion !== null && answers[currentQuestion.id] !== undefined;

  const historyOptions = useMemo(
    () =>
      currentCourseHistory.map((item) => {
        const createdLabel = new Date(item.createdAt).toLocaleString(
          language === "sv" ? "sv-SE" : "en-GB",
          {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          },
        );

        return {
          id: item.id,
          label: `${item.data.meta.courseCode} - ${createdLabel}`,
          questionCount: item.data.quiz.questions.length,
        };
      }),
    [currentCourseHistory, language],
  );

  const loadStoredQuiz = (historyId: string) => {
    const selected = currentCourseHistory.find((item) => item.id === historyId);
    if (!selected) return;

    resetQuiz();
    setActiveQuizData(selected.data);
    setStage("answering");
    setCurrentIndex(0);
    setAnswers({});
    setSelectedHistoryId(historyId);
  };

  const generateNewQuiz = async () => {
    setCurrentIndex(0);
    setAnswers({});
    setSelectedHistoryId("latest");
    setLoadingMessageIndex(Math.floor(Math.random() * loadingMessages.length));

    resetQuiz();
    setActiveQuizData(null);
    setStage("generating");
    await generateQuiz();
  };

  const retakeCurrentQuiz = () => {
    setAnswers({});
    setCurrentIndex(0);
    setStage("answering");
  };

  const sidebar = (
    <aside className="flex w-full shrink-0 flex-col gap-6 border-r bg-secondary/40 p-5 md:sticky md:top-0 md:h-screen md:w-72 lg:w-80">
      <div className="flex flex-col gap-6">
        <Button
          variant="ghost"
          className="w-fit justify-start bg-transparent px-0 text-muted-foreground hover:bg-transparent hover:text-foreground"
          asChild
        >
          <Link to={`/search/${courseCode}`} viewTransition>
            <ArrowLeft className="h-4 w-4" />
            {language === "sv" ? "Tillbaka till tentor" : "Back to exams"}
          </Link>
        </Button>

        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {language === "sv" ? "Quizläge" : "Quiz mode"}
          </p>
          <p className="text-3xl font-semibold tracking-tight">{courseCode}</p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {language === "sv" ? "Historik" : "History"}
        </label>

        <Select
          value={selectedHistoryId}
          onValueChange={(value) => {
            if (value === "latest") return;
            loadStoredQuiz(value);
          }}
        >
          <SelectTrigger className="w-full bg-background">
            <SelectValue
              placeholder={language === "sv" ? "Tidigare quiz" : "Past quizzes"}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="latest">
              {language === "sv" ? "Senast genererade" : "Latest generated"}
            </SelectItem>
            {historyOptions.map((item) => (
              <SelectItem key={item.id} value={item.id}>
                {item.label} ({item.questionCount})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          onClick={generateNewQuiz}
          disabled={isLoading || stage === "generating"}
          className="mt-2 w-full bg-background shadow-xs"
        >
          <RefreshCw
            className={cn(
              "h-4 w-4",
              (isLoading || stage === "generating") && "animate-spin",
            )}
          />
          {isLoading || stage === "generating"
            ? language === "sv"
              ? "Genererar..."
              : "Generating..."
            : language === "sv"
              ? "Nytt quiz"
              : "New quiz"}
        </Button>
      </div>

      <div className="mt-auto space-y-3 pt-6">
        <div className="rounded-2xl border bg-background px-4 py-4 text-sm leading-relaxed text-foreground">
          {language === "sv"
            ? "Beta: Quizfunktionen är ny och kan innehålla en del buggar."
            : "Beta: The quiz feature is new and may contain some bugs."}
        </div>
      </div>
    </aside>
  );

  let mainContent: React.ReactNode = null;

  if (stage === "generating") {
    mainContent = (
      <div className="flex min-h-[60vh] flex-col items-center justify-center py-12 animate-in fade-in duration-500">
        <div className="w-full max-w-xl rounded-2xl border bg-card p-8 shadow-sm sm:p-10">
          <div className="flex items-center justify-center">
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-primary/30 bg-primary/5">
              <div className="absolute inset-0 animate-pulse rounded-full bg-primary/10" />
              <Cog className="absolute h-12 w-12 animate-spin text-primary" />
              <Cog
                className="absolute bottom-2 right-2 h-6 w-6 animate-spin text-primary/80"
                style={{
                  animationDuration: "1400ms",
                  animationDirection: "reverse",
                }}
              />
              <Cpu className="h-7 w-7 text-primary-foreground/90" />
            </div>
          </div>

          <h1 className="mt-6 text-center text-2xl font-semibold">
            {language === "sv"
              ? "Genererar ditt quiz..."
              : "Generating your quiz..."}
          </h1>

          <p className="mt-2 text-center text-xs uppercase tracking-wide text-muted-foreground">
            {language === "sv" ? "AI-motor igång" : "Engine online"}
          </p>

          <p className="mt-5 text-center text-sm italic text-foreground/90">
            {loadingMessages[loadingMessageIndex]}
          </p>

          <div className="mt-8 flex justify-center">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
              <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
              <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-primary" />
            </div>
          </div>

          {error && (
            <div className="mt-8 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-center">
              <p className="text-sm text-destructive">
                {language === "sv"
                  ? "Kunde inte generera quizet."
                  : "Could not generate the quiz."}
              </p>

              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <Button onClick={generateNewQuiz} variant="outline">
                  <RefreshCw className=" h-4 w-4" />
                  {language === "sv" ? "Försök igen" : "Try again"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  } else if (error && !displayQuizData) {
    mainContent = (
      <div className="flex min-h-[60vh] flex-col items-center justify-center py-12 animate-in fade-in duration-500">
        <div className="w-full max-w-xl rounded-2xl border bg-card p-8 text-center shadow-sm">
          <p className="text-destructive">
            {language === "sv"
              ? "Kunde inte generera quizet."
              : "Could not generate the quiz."}
          </p>

          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <Button onClick={generateNewQuiz} variant="outline">
              <RefreshCw className="h-4 w-4" />
              {language === "sv" ? "Generera igen" : "Generate again"}
            </Button>
          </div>
        </div>
      </div>
    );
  } else if (!quiz || !currentQuestion) {
    mainContent = (
      <div className="flex min-h-[60vh] flex-col items-center justify-center py-12 animate-in fade-in duration-500">
        <div className="w-full max-w-xl rounded-2xl border bg-card p-8 text-center shadow-sm">
          <h1 className="text-xl font-semibold">
            {language === "sv"
              ? "Inga sparade quiz för kursen ännu"
              : "No saved quizzes for this course yet"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {language === "sv"
              ? "Generera ett nytt quiz för att komma igång."
              : "Generate a new quiz to get started."}
          </p>

          <div className="mt-6 flex justify-center">
            <Button onClick={generateNewQuiz}>
              <RefreshCw className="h-4 w-4" />
              {language === "sv" ? "Generera quiz" : "Generate quiz"}
            </Button>
          </div>
        </div>
      </div>
    );
  } else if (stage === "results") {
    const pct = Math.round((score / questionCount) * 100);

    mainContent = (
      <div className="animate-in fade-in duration-500">
        <div className="mb-8 rounded-3xl border bg-card p-6 shadow-sm sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="mb-1 text-sm font-medium uppercase tracking-wider text-muted-foreground">
                {language === "sv" ? "Resultat" : "Result"}
              </p>
              <h1 className="text-4xl font-medium">
                {score}{" "}
                <span className="text-2xl font-normal text-muted-foreground">
                  / {questionCount}
                </span>
              </h1>
            </div>

            <Badge className="px-4 py-1.5 text-lg font-medium shadow-sm">
              {pct}%
            </Badge>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button onClick={retakeCurrentQuiz} size="lg">
              <CheckCircle2 className="h-5 w-5" />
              {language === "sv" ? "Gör om quizet" : "Retake quiz"}
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          {questions.map((question, questionIndex) => {
            const selected = answers[question.id];
            const isCorrect = selected === question.answer;

            return (
              <div key={question.id} className="rounded-3xl p-6">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant="secondary" className="px-3 py-1">
                    {language === "sv" ? "Fråga" : "Question"}{" "}
                    {questionIndex + 1}
                  </Badge>

                  <Badge
                    className={cn(
                      "px-3 py-1",
                      isCorrect
                        ? "border border-emerald-500/40 bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/20 dark:text-emerald-300"
                        : "border border-rose-500/40 bg-rose-500/15 text-rose-700 hover:bg-rose-500/20 dark:text-rose-300",
                    )}
                  >
                    {isCorrect
                      ? language === "sv"
                        ? "Rätt"
                        : "Correct"
                      : language === "sv"
                        ? "Fel"
                        : "Incorrect"}
                  </Badge>
                </div>

                <div className="mt-4 text-lg leading-relaxed">
                  <MarkdownMathBlock content={question.question} />
                </div>

                <div className="mt-5 space-y-3">
                  {question.options.map((option, optionIndex) => {
                    const isAnswer = optionIndex === question.answer;
                    const isSelected = optionIndex === selected;

                    return (
                      <div
                        key={`${question.id}-${optionIndex}`}
                        className={cn(
                          "rounded-2xl border px-4 py-3 text-base",
                          isAnswer &&
                            "border-emerald-500/50 bg-emerald-500/10 font-medium",
                          isSelected &&
                            !isAnswer &&
                            "border-rose-500/50 bg-rose-500/10 font-medium",
                          !isAnswer && !isSelected && "bg-muted/30",
                        )}
                      >
                        <MarkdownMathBlock content={option} />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  } else {
    mainContent = (
      <div className="animate-in fade-in duration-500">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              {language === "sv" ? "Testa vad du kan" : "Test what you know"}
            </h1>
          </div>

          <Badge variant="secondary" className="px-3 py-1.5 text-sm">
            {language === "sv" ? "Källor" : "Sources"}:{" "}
            {displayQuizData?.meta.sourceCount}
          </Badge>
        </div>

        <div className="mb-5 h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300 ease-in-out"
            style={{
              width: `${((currentIndex + 1) / questionCount) * 100}%`,
            }}
          />
        </div>

        <div className="pb-10 sm:pb-12">
          <div className="mb-5 flex items-center justify-between">
            <Badge variant="outline" className="px-3 py-1 font-semibold">
              {language === "sv" ? "Fråga" : "Question"} {currentIndex + 1} /{" "}
              {questionCount}
            </Badge>

            <span className="text-sm font-medium text-muted-foreground">
              {answeredCount}/{questionCount}{" "}
              {language === "sv" ? "besvarade" : "answered"}
            </span>
          </div>

          <div className="rounded-3xl p-5 sm:p-7">
            <div className="mb-6 text-lg leading-relaxed text-foreground/90 sm:text-xl">
              <MarkdownMathBlock content={currentQuestion.question} />
            </div>

            <div className="space-y-3">
              {currentQuestion.options.map((option, optionIndex) => {
                const selected = answers[currentQuestion.id] === optionIndex;

                return (
                  <button
                    key={`${currentQuestion.id}-${optionIndex}`}
                    type="button"
                    onClick={() =>
                      onChooseOption(currentQuestion.id, optionIndex)
                    }
                    className={cn(
                      "group flex w-full cursor-pointer items-center gap-3 rounded-2xl border p-3 text-left transition-all duration-200 sm:p-4",
                      selected
                        ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                        : "border-border hover:border-primary/40 hover:bg-muted/50 hover:shadow-xs",
                    )}
                  >
                    <span
                      className={cn(
                        "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-sm font-medium transition-colors sm:h-8 sm:w-8",
                        selected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-muted-foreground/30 bg-background group-hover:border-primary/40",
                      )}
                    >
                      {String.fromCharCode(65 + optionIndex)}
                    </span>

                    <div className="min-w-0 text-sm leading-relaxed sm:text-base">
                      <MarkdownMathBlock content={option} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="sticky bottom-0 z-20 mt-6 border-t bg-background/95 py-4 backdrop-blur">
            <div className="flex justify-end">
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={previousQuestion}
                  disabled={currentIndex === 0}
                >
                  <ArrowLeft className="h-4 w-4" />
                  {language === "sv" ? "Förra" : "Previous"}
                </Button>

                {!isLastQuestion ? (
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={nextQuestion}
                    disabled={!hasAnsweredCurrent}
                  >
                    {language === "sv" ? "Nästa" : "Next"}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    size="lg"
                    onClick={() => setStage("results")}
                    disabled={!canSubmit}
                    className="min-w-40 shadow-sm"
                  >
                    <CheckCircle2 className="h-5 w-5" />
                    {language === "sv" ? "Rätta quiz" : "Grade quiz"}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background md:h-screen md:flex-row md:overflow-hidden">
      {sidebar}
      <main className="flex-1 overflow-y-auto px-4 py-8 sm:px-6 md:px-8 md:pt-8 md:pb-0 lg:px-12 lg:pt-12 lg:pb-0">
        <div className="mx-auto w-full max-w-4xl">{mainContent}</div>
      </main>
    </div>
  );
};

export default QuizPage;
