import { useCallback, useEffect, useRef, useState } from 'react';
import type { MultipleChoiceQuizResponse } from '@/types/quiz';
import { QUIZ_API_URL } from '@/constants/urls';

type UseQuizReturn = {
  quizData: MultipleChoiceQuizResponse | null;
  isLoading: boolean;
  error: string | null;
  generateQuiz: () => Promise<void>;
  resetQuiz: () => void;
};

export const useQuiz = (courseCode: string): UseQuizReturn => {
  const [quizData, setQuizData] = useState<MultipleChoiceQuizResponse | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  const generateQuiz = useCallback(async () => {
    if (!courseCode) return;

    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${QUIZ_API_URL}/${encodeURIComponent(courseCode)}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-anonymous-user-id':
              localStorage.getItem('liutentor_anonymous_id') || 'unknown',
          },
          signal: abortControllerRef.current.signal,
        },
      );

      if (!response.ok) {
        throw new Error('Failed to generate quiz');
      }

      const json = await response.json();
      console.log(json);

      // Support all known API response envelopes.
      const data = json?.payload ?? json?.data ?? json;
      setQuizData(data);
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') return;
      setError('Något gick fel när quizet skulle genereras.');
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [courseCode]);

  const resetQuiz = useCallback(() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    setQuizData(null);
    setError(null);
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
    generateQuiz,
    resetQuiz,
  };
};
