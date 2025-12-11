import { useState, useRef, useCallback } from "react";
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
  assistantMessageRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
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
  const assistantMessageRefs = useRef<(HTMLDivElement | null)[]>([]);

  const cancelGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setMessages((prev) => {
      const lastMessage = prev[prev.length - 1];
      if (lastMessage?.role === "assistant" && !lastMessage.content.trim()) {
        return prev.slice(0, -1);
      }
      return prev;
    });
    setIsLoading(false);
  }, []);

  const sendMessage = useCallback(
    async (content: string, giveDirectAnswer: boolean) => {
      if (!content.trim() || isLoading) return;

      const userMessage: Message = { role: "user", content };
      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      abortControllerRef.current = new AbortController();
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      try {
        const response = await fetch(`${CHAT_API_URL}/${examId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [...messages, userMessage].map((msg) => ({
              role: msg.role,
              content: msg.content,
            })),
            giveDirectAnswer,
          }),
          signal: abortControllerRef.current?.signal,
        });

        if (!response.ok) {
          throw new Error("Failed to get response");
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let assistantMessage = "";
        let lastUpdateTime = 0;

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              setMessages((prev) => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = {
                  role: "assistant",
                  content: assistantMessage,
                };
                return newMessages;
              });
              break;
            }

            const chunk = decoder.decode(value);
            assistantMessage += chunk;

            const now = Date.now();
            if (now - lastUpdateTime >= STREAM_UPDATE_INTERVAL) {
              lastUpdateTime = now;
              setMessages((prev) => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = {
                  role: "assistant",
                  content: assistantMessage,
                };
                return newMessages;
              });
            }
          }
        }
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }
        console.error("Error sending message:", error);
        setMessages((prev) => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = {
            role: "assistant",
            content: "Något gick fel. Försök igen senare.",
          };
          return newMessages;
        });
      } finally {
        setIsLoading(false);
        abortControllerRef.current = null;
      }
    },
    [examId, isLoading, messages]
  );

  const navigateToAssistantMessage = useCallback(
    (direction: "up" | "down", targetIndex?: number) => {
      const assistantIndices = messages
        .map((msg, idx) => (msg.role === "assistant" ? idx : -1))
        .filter((idx) => idx !== -1);

      if (assistantIndices.length === 0) return;

      let newIndex: number;
      let messageIndex: number;

      // If targetIndex is provided (from dropdown), use it directly
      if (targetIndex !== undefined) {
        // Find which assistant message this corresponds to
        const assistantPosition = assistantIndices.indexOf(targetIndex);
        if (assistantPosition !== -1) {
          newIndex = assistantPosition;
          messageIndex = targetIndex;
        } else {
          return;
        }
      } else {
        // Normal up/down navigation
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

      if (element) {
        // Get the container and calculate scroll position with header offset
        const container = element.closest(".overflow-y-auto");
        if (container) {
          const headerOffset = 70; // Account for fixed header
          const elementPosition = element.offsetTop;
          const offsetPosition = elementPosition - headerOffset;

          container.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        } else {
          // Fallback to scrollIntoView
          element.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }
    },
    [messages, currentAssistantIndex]
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
