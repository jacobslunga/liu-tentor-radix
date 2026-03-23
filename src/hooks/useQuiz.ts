import { useCallback, useEffect, useRef, useState } from "react";
import type { MultipleChoiceQuizResponse } from "@/types/quiz";
import { QUIZ_API_URL } from "@/constants/urls";

type QuizStatus = {
  step: string;
  message: string;
};

type UseQuizReturn = {
  quizData: MultipleChoiceQuizResponse | null;
  isLoading: boolean;
  error: string | null;
  status: QuizStatus | null;
  generateQuiz: () => Promise<void>;
  resetQuiz: () => void;
};

export const useQuiz = (courseCode: string): UseQuizReturn => {
  const [quizData, setQuizData] = useState<MultipleChoiceQuizResponse | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<QuizStatus | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const generateQuiz = useCallback(async () => {
    if (!courseCode) return;

    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();

    setIsLoading(true);
    setError(null);
    setStatus(null);
    setQuizData(null);

    try {
      const response = await fetch(
        `${QUIZ_API_URL}/${encodeURIComponent(courseCode)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-anonymous-user-id":
              localStorage.getItem("liutentor_anonymous_id") || "unknown",
          },
          signal: abortControllerRef.current.signal,
        },
      );

      if (!response.ok) {
        throw new Error("Kunde inte generera quiz");
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("Ingen strömmande data tillgänglig");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        let currentEvent = "";

        for (const line of lines) {
          if (line.startsWith("event: ")) {
            currentEvent = line.slice(7).trim();
            continue;
          }

          if (!line.startsWith("data: ")) continue;

          const raw = line.slice(6).trim();
          if (!raw) continue;

          try {
            const parsed = JSON.parse(raw);

            if (currentEvent === "status") {
              setStatus({
                step: parsed.step,
                message: parsed.message,
              });
            } else if (currentEvent === "result") {
              setQuizData(parsed);
            } else if (currentEvent === "error") {
              throw new Error(
                parsed.message || "Quizgenereringen misslyckades",
              );
            }
          } catch (parseError) {
            if (
              parseError instanceof Error &&
              parseError.message !== "Quizgenereringen misslyckades"
            ) {
              continue;
            }
            throw parseError;
          }

          currentEvent = "";
        }
      }
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      setError(
        err instanceof Error
          ? err.message
          : "Något gick fel när quizet skulle genereras.",
      );
    } finally {
      setIsLoading(false);
      setStatus(null);
      abortControllerRef.current = null;
    }
  }, [courseCode]);

  const resetQuiz = useCallback(() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    setQuizData(null);
    setError(null);
    setStatus(null);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  return {
    quizData,
    isLoading,
    error,
    status,
    generateQuiz,
    resetQuiz,
  };
};
