import { FC, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  RefreshCw,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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

type Stage = "idle" | "generating" | "answering" | "results";

type StoredQuizItem = {
  id: string;
  createdAt: string;
  data: MultipleChoiceQuizResponse;
};

const QUIZ_HISTORY_STORAGE_KEY = "liutentor.quiz.history.v1";
const MAX_STORED_QUIZZES = 30;

const STEP_ORDER = [
  "fetching_exams",
  "downloading_pdfs",
  "generating",
  "finalizing",
];

const ShimmeringText = ({ text }: { text: string }) => (
  <AnimatePresence mode="popLayout">
    <motion.div
      key={text}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
      className="flex items-center justify-center"
    >
      <motion.span
        className="inline-block bg-linear-to-r from-muted-foreground/40 via-foreground to-muted-foreground/40 bg-size-[200%_auto] bg-clip-text text-transparent text-sm font-medium"
        animate={{
          backgroundPosition: ["200% center", "-200% center"],
        }}
        transition={{
          repeat: Infinity,
          duration: 2.5,
          ease: "linear",
        }}
      >
        {text}
      </motion.span>
    </motion.div>
  </AnimatePresence>
);

const GeneratingView = ({
  statusMessage,
  statusStep,
  error,
  language,
  onRetry,
}: {
  statusMessage: string;
  statusStep: string | null;
  error: string | null;
  language: string;
  onRetry: () => void;
}) => {
  const currentStepIndex = statusStep ? STEP_ORDER.indexOf(statusStep) : -1;

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center py-12 animate-in fade-in duration-500">
      <div className="flex flex-col items-center gap-8">
        <div className="flex items-center gap-2.5">
          {STEP_ORDER.map((step, i) => {
            const isActive = i === currentStepIndex;
            const isCompleted = i < currentStepIndex;

            return (
              <motion.div
                key={step}
                className={cn(
                  "rounded-full transition-colors duration-500",
                  isCompleted
                    ? "h-2 w-2 bg-primary"
                    : isActive
                      ? "h-2.5 w-2.5 bg-primary"
                      : "h-2 w-2 bg-muted-foreground/20",
                )}
                animate={
                  isActive ? { scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] } : {}
                }
                transition={
                  isActive
                    ? { duration: 1.2, repeat: Infinity, ease: "easeInOut" }
                    : {}
                }
              />
            );
          })}
        </div>

        <ShimmeringText text={statusMessage} />

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="text-center"
            >
              <p className="text-sm text-destructive">
                {language === "sv"
                  ? "Kunde inte generera quizet."
                  : "Could not generate the quiz."}
              </p>
              <Button
                onClick={onRetry}
                variant="outline"
                size="sm"
                className="mt-3"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                {language === "sv" ? "Försök igen" : "Try again"}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const MarkdownMathBlock = ({ content }: { content: string }) => (
  <ReactMarkdown
    remarkPlugins={[remarkMath]}
    rehypePlugins={[[rehypeKatex, { strict: false, throwOnError: false }]]}
    components={markdownComponents}
  >
    {content}
  </ReactMarkdown>
);

const blurFadeStyle: React.CSSProperties = {
  background:
    "linear-gradient(to top, hsl(var(--background)) 60%, transparent 100%)",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
  maskImage: "linear-gradient(to top, black 60%, transparent 100%)",
  WebkitMaskImage: "linear-gradient(to top, black 60%, transparent 100%)",
};

const QuizPage: FC = () => {
  const { courseCode = "" } = useParams<{ courseCode: string }>();
  const { language } = useLanguage();

  const [stage, setStage] = useState<Stage>("idle");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number | null>>({});
  const [quizHistory, setQuizHistory] = useState<StoredQuizItem[]>([]);
  const [selectedHistoryId, setSelectedHistoryId] = useState<string>("latest");
  const [activeQuizData, setActiveQuizData] =
    useState<MultipleChoiceQuizResponse | null>(null);
  const [hasHydratedHistory, setHasHydratedHistory] = useState(false);

  const { quizData, isLoading, error, status, generateQuiz, resetQuiz } =
    useQuiz(courseCode);

  const defaultStatusMessage =
    language === "sv" ? "Förbereder quiz..." : "Preparing quiz...";

  useMetadata({
    title: `${courseCode} Quiz | Tentor`,
    description:
      language === "sv"
        ? "Träna på ett AI-genererat quiz med tidigare tentor."
        : "Practice with an AI-generated quiz from past exams.",
    canonical: `${window.location.origin}/quiz/${courseCode}`,
  });

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
    setActiveQuizData(null);
    setStage("idle");
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
    if (!hasHydratedHistory) return;

    if (
      currentCourseHistory.length > 0 &&
      !activeQuizData &&
      stage === "idle"
    ) {
      const latestStored = currentCourseHistory[0];
      setActiveQuizData(latestStored.data);
      setStage("answering");
      setCurrentIndex(0);
      setAnswers({});
      setSelectedHistoryId(latestStored.id);
    }
  }, [hasHydratedHistory, currentCourseHistory, activeQuizData, stage]);

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

    if (!isLoading) setStage("answering");
  }, [isLoading, quizData]);

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
      if (!currentQuestion || answers[currentQuestion.id] === undefined)
        return prev;
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
          label: `${item.data.meta.courseCode} – ${createdLabel}`,
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
    <aside className="flex w-full shrink-0 flex-col border-r border-border/50 bg-muted/30 md:sticky md:top-0 md:h-screen md:w-72 md:overflow-y-auto lg:w-80">
      <div className="flex flex-col gap-5 p-5">
        <Button
          variant="ghost"
          size="sm"
          className="w-fit justify-start gap-2 px-0 text-xs text-muted-foreground hover:bg-transparent hover:text-foreground"
          asChild
        >
          <Link to={`/search/${courseCode}`} viewTransition>
            <ArrowLeft className="h-3.5 w-3.5" />
            {language === "sv" ? "Tillbaka till tentor" : "Back to exams"}
          </Link>
        </Button>

        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/70">
            {language === "sv" ? "Quizläge" : "Quiz mode"}
          </p>
          <p className="mt-1 text-2xl font-bold tracking-tight">{courseCode}</p>
        </div>
      </div>

      <div className="border-t border-border/40" />

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="space-y-2.5">
          <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/70">
            {language === "sv" ? "Historik" : "History"}
          </label>

          {historyOptions.length > 0 ? (
            <Select
              value={selectedHistoryId}
              onValueChange={(value) => {
                if (value === "latest") return;
                loadStoredQuiz(value);
              }}
            >
              <SelectTrigger className="h-9 w-full border-border/50 bg-background text-sm shadow-none">
                <SelectValue
                  placeholder={
                    language === "sv" ? "Tidigare quiz" : "Past quizzes"
                  }
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
          ) : (
            <p className="text-xs text-muted-foreground/60">
              {language === "sv"
                ? "Inga quiz genererade ännu."
                : "No quizzes generated yet."}
            </p>
          )}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={generateNewQuiz}
          disabled={isLoading || stage === "generating"}
          className="w-full border-border/50 bg-background shadow-none"
        >
          <RefreshCw
            className={cn(
              "h-3.5 w-3.5",
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

      <div className="mt-auto border-t border-border/40 p-5">
        <p className="text-[11px] leading-relaxed text-muted-foreground/50">
          {language === "sv"
            ? "Beta — AI-genererade frågor kan innehålla fel."
            : "Beta — AI-generated questions may contain errors."}
        </p>
      </div>
    </aside>
  );

  let mainContent: React.ReactNode = null;

  if (stage === "idle" && !activeQuizData) {
    mainContent = (
      <div className="flex min-h-[60vh] flex-col items-center justify-center py-12 animate-in fade-in duration-500">
        <div className="w-full max-w-lg text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            {language === "sv" ? "Skapa ett quiz" : "Create a quiz"}
          </h1>

          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
            {language === "sv"
              ? "Generera ett quiz baserat på tidigare tentor för att testa dina kunskaper."
              : "Generate a quiz based on past exams to test your knowledge."}
          </p>

          <div className="mt-8">
            <Button
              size="lg"
              onClick={generateNewQuiz}
              disabled={isLoading}
              className="min-w-52 gap-2 shadow-sm"
            >
              <Zap className="h-4 w-4" />
              {language === "sv" ? "Generera quiz" : "Generate quiz"}
            </Button>
          </div>
        </div>
      </div>
    );
  } else if (stage === "generating") {
    mainContent = (
      <GeneratingView
        statusMessage={status?.message ?? defaultStatusMessage}
        statusStep={status?.step ?? null}
        error={error}
        language={language}
        onRetry={generateNewQuiz}
      />
    );
  } else if (error && !displayQuizData) {
    mainContent = (
      <div className="flex min-h-[60vh] flex-col items-center justify-center py-12 animate-in fade-in duration-500">
        <p className="text-sm text-destructive">
          {language === "sv"
            ? "Kunde inte generera quizet."
            : "Could not generate the quiz."}
        </p>
        <Button
          onClick={generateNewQuiz}
          variant="outline"
          size="sm"
          className="mt-3"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          {language === "sv" ? "Försök igen" : "Try again"}
        </Button>
      </div>
    );
  } else if (!quiz || !currentQuestion) {
    mainContent = (
      <div className="flex min-h-[60vh] flex-col items-center justify-center py-12 animate-in fade-in duration-500">
        <div className="text-center">
          <p className="text-lg font-semibold">
            {language === "sv"
              ? "Inga sparade quiz för kursen ännu"
              : "No saved quizzes for this course yet"}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {language === "sv"
              ? "Generera ett nytt quiz för att komma igång."
              : "Generate a new quiz to get started."}
          </p>
          <Button onClick={generateNewQuiz} className="mt-6">
            <Zap className="h-4 w-4" />
            {language === "sv" ? "Generera quiz" : "Generate quiz"}
          </Button>
        </div>
      </div>
    );
  } else if (stage === "results") {
    const pct = Math.round((score / questionCount) * 100);

    mainContent = (
      <div className="animate-in fade-in duration-500 pb-12">
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
            style={{ width: `${((currentIndex + 1) / questionCount) * 100}%` }}
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

          <div
            className="sticky bottom-0 z-20 mt-6 border-t py-4"
            style={blurFadeStyle}
          >
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
    <div className="flex min-h-screen flex-col bg-background md:flex-row">
      {sidebar}
      <main className="flex-1 px-4 py-8 sm:px-6 md:px-8 md:pt-8 lg:px-12 lg:pt-12">
        <div className="mx-auto w-full max-w-4xl">{mainContent}</div>
      </main>
    </div>
  );
};

export default QuizPage;
