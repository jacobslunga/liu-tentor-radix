import { useState, useRef, useCallback, useEffect } from "react";
import { Message } from "../types";
import { CHAT_API_URL, STREAM_UPDATE_INTERVAL } from "../constants";

interface UseChatMessagesProps {
  examId: string | number;
  initialMessages?: Message[];
  examUrl: string;
  courseCode: string;
  solutionUrl?: string | null;
}

export interface UseChatMessagesReturn {
  messages: Message[];
  isLoading: boolean;
  sendMessage: (content: string, giveDirectAnswer: boolean) => Promise<void>;
  cancelGeneration: () => void;
  resetConversation: () => void;
}

export const useChatMessages = ({
  examId,
  examUrl,
  courseCode,
  solutionUrl,
  initialMessages = [],
}: UseChatMessagesProps): UseChatMessagesReturn => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);
  const messagesRef = useRef<Message[]>(initialMessages);
  const isLoadingRef = useRef(false);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    isLoadingRef.current = isLoading;
  }, [isLoading]);

  const cancelGeneration = useCallback(() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;

    setMessages((prev) => {
      const last = prev[prev.length - 1];
      if (last?.role === "assistant" && !last.content.trim()) {
        return prev.slice(0, -1);
      }
      return prev;
    });

    setIsLoading(false);
  }, []);

  const resetConversation = useCallback(() => {
    cancelGeneration();
    setMessages(initialMessages);
    messagesRef.current = initialMessages;
  }, [cancelGeneration, initialMessages]);

  const sendMessage = useCallback(
    async (content: string, giveDirectAnswer: boolean) => {
      if (!content.trim() || isLoadingRef.current) return;

      const userMessage: Message = { role: "user", content };

      const optimistic: Message[] = [
        ...messagesRef.current,
        userMessage,
        { role: "assistant", content: "" } as Message,
      ];

      setMessages(optimistic);
      messagesRef.current = optimistic;

      setIsLoading(true);
      isLoadingRef.current = true;

      abortControllerRef.current = new AbortController();

      try {
        const response = await fetch(`${CHAT_API_URL}/${examId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-anonymous-user-id":
              localStorage.getItem("liutentor_anonymous_id") || "unknown",
          },
          body: JSON.stringify({
            messages: optimistic.slice(0, -1),
            giveDirectAnswer,
            examUrl,
            courseCode,
            solutionUrl: solutionUrl || undefined,
          }),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) throw new Error();

        const reader = response.body?.getReader();
        if (!reader) throw new Error();

        const decoder = new TextDecoder("utf-8");
        let text = "";
        let lastUpdate = 0;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          text += decoder.decode(value, { stream: true });
          const now = Date.now();

          if (now - lastUpdate >= STREAM_UPDATE_INTERVAL) {
            lastUpdate = now;
            const updated = [...messagesRef.current];
            updated[updated.length - 1] = {
              role: "assistant",
              content: text,
            };
            setMessages(updated);
            messagesRef.current = updated;
          }
        }

        const final = [...messagesRef.current];
        final[final.length - 1] = {
          role: "assistant",
          content: text.trim() || "Jag kunde inte generera ett svar.",
        };

        setMessages(final);
        messagesRef.current = final;
      } catch {
        const updated = [...messagesRef.current];
        updated[updated.length - 1] = {
          role: "assistant",
          content: "Något gick fel. Försök igen senare.",
        };
        setMessages(updated);
        messagesRef.current = updated;
      } finally {
        abortControllerRef.current = null;
        setIsLoading(false);
        isLoadingRef.current = false;
      }
    },
    [examId, examUrl, courseCode, solutionUrl]
  );

  return {
    messages,
    isLoading,
    sendMessage,
    cancelGeneration,
    resetConversation,
  };
};
