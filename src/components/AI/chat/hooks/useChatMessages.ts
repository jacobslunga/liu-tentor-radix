import { useState, useRef, useCallback, useEffect } from "react";
import { Message } from "../types";
import { CHAT_API_URL, STREAM_UPDATE_INTERVAL } from "../constants";

interface UseChatMessagesProps {
  examId: string | number;
  initialMessages?: Message[];
}

interface UseChatMessagesReturn {
  messages: Message[];
  isLoading: boolean;
  sendMessage: (content: string, giveDirectAnswer: boolean) => Promise<void>;
  cancelGeneration: () => void;
  assistantMessageRefs: React.RefObject<(HTMLDivElement | null)[]>;
  currentAssistantIndex: number;
  setCurrentAssistantIndex: React.Dispatch<React.SetStateAction<number>>;
  navigateToAssistantMessage: (
    direction: "up" | "down",
    targetIndex?: number
  ) => void;
}

export const useChatMessages = ({
  examId,
  initialMessages = [],
}: UseChatMessagesProps): UseChatMessagesReturn => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [currentAssistantIndex, setCurrentAssistantIndex] = useState(-1);

  const abortControllerRef = useRef<AbortController | null>(null);
  const assistantMessageRefs = useRef<(HTMLDivElement | null)[]>(
    []
  ) as React.RefObject<(HTMLDivElement | null)[]>;

  const messagesRef = useRef<Message[]>(initialMessages);
  const isLoadingRef = useRef<boolean>(false);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    isLoadingRef.current = isLoading;
  }, [isLoading]);

  const cancelGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setMessages((prev) => {
      const last = prev[prev.length - 1];
      if (last?.role === "assistant" && !last.content.trim()) {
        return prev.slice(0, -1);
      }
      return prev;
    });
    setIsLoading(false);
  }, []);

  const sendMessage = useCallback(
    async (content: string, giveDirectAnswer: boolean) => {
      if (!content.trim() || isLoadingRef.current) return;

      const userMessage: Message = { role: "user", content };

      const optimistic: Message[] = [
        ...messagesRef.current,
        userMessage,
        { role: "assistant" as "assistant", content: "" },
      ];
      setMessages(optimistic);
      messagesRef.current = optimistic;

      setIsLoading(true);
      isLoadingRef.current = true;

      abortControllerRef.current = new AbortController();

      try {
        const conversationHistory = [
          ...messagesRef.current.slice(0, -1),
          userMessage,
        ];

        const response = await fetch(`${CHAT_API_URL}/${examId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: conversationHistory.map((m) => ({
              role: m.role,
              content: m.content,
            })),
            giveDirectAnswer,
          }),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) throw new Error("Failed to get response");

        const reader = response.body?.getReader();
        if (!reader)
          throw new Error("Streaming not supported by server response");

        const decoder = new TextDecoder("utf-8");
        let assistantMessage = "";
        let lastUpdate = 0;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          assistantMessage += decoder.decode(value, { stream: true });

          const now = Date.now();
          if (now - lastUpdate >= STREAM_UPDATE_INTERVAL) {
            lastUpdate = now;
            const updated = [...messagesRef.current];
            updated[updated.length - 1] = {
              role: "assistant",
              content: assistantMessage,
            };
            setMessages(updated);
            messagesRef.current = updated;
          }
        }

        const finalText =
          assistantMessage.trim() === ""
            ? "Jag kunde inte generera ett svar. Försök igen."
            : assistantMessage;

        const finalUpdated = [...messagesRef.current];
        finalUpdated[finalUpdated.length - 1] = {
          role: "assistant",
          content: finalText,
        };
        setMessages(finalUpdated);
        messagesRef.current = finalUpdated;
      } catch (err: unknown) {
        const errorIsAbort = err instanceof Error && err.name === "AbortError";
        if (errorIsAbort) {
          return;
        }
        const updated = [...messagesRef.current];
        if (
          updated.length > 0 &&
          updated[updated.length - 1].role === "assistant"
        ) {
          updated[updated.length - 1] = {
            role: "assistant",
            content: "Något gick fel. Försök igen senare.",
          };
        }
        setMessages(updated);
        messagesRef.current = updated;
      } finally {
        abortControllerRef.current = null;
        setIsLoading(false);
        isLoadingRef.current = false;
      }
    },
    [examId]
  );

  const navigateToAssistantMessage = useCallback(
    (direction: "up" | "down", targetIndex?: number) => {
      const assistantIndices = messagesRef.current
        .map((m, i) => (m.role === "assistant" ? i : -1))
        .filter((i) => i !== -1);

      if (assistantIndices.length === 0) return;

      let newIndex: number;
      let messageIndex: number;

      if (typeof targetIndex === "number") {
        const pos = assistantIndices.indexOf(targetIndex);
        if (pos === -1) return;
        newIndex = pos;
        messageIndex = targetIndex;
      } else {
        if (direction === "up") {
          newIndex = currentAssistantIndex <= 0 ? 0 : currentAssistantIndex - 1;
        } else {
          newIndex =
            currentAssistantIndex >= assistantIndices.length - 1
              ? assistantIndices.length - 1
              : currentAssistantIndex + 1;
        }
        messageIndex = assistantIndices[newIndex];
      }

      setCurrentAssistantIndex(newIndex);

      const element = assistantMessageRefs.current[messageIndex];
      if (!element) return;

      const container = element.closest(".overflow-y-auto");
      if (container) {
        const headerOffset = 70;
        const offset = element.offsetTop - headerOffset;
        container.scrollTo({ top: offset, behavior: "smooth" });
      } else {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    },
    [currentAssistantIndex]
  );

  return {
    messages,
    isLoading,
    sendMessage,
    cancelGeneration,
    assistantMessageRefs,
    currentAssistantIndex,
    setCurrentAssistantIndex,
    navigateToAssistantMessage,
  };
};
