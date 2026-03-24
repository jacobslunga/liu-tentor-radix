import { useState, useRef, useCallback, useEffect } from "react";
import { STREAM_UPDATE_INTERVAL } from "../constants";
import { CHAT_API_URL } from "@/constants/urls";
import { Message } from "../types";

const CHAT_STORAGE_KEY = "chat_history_by_exam_v1";
const MAX_HISTORY_ITEMS = 20;

interface UseChatMessagesProps {
  examId: string | number;
  initialMessages?: Message[];
  examUrl: string;
  courseCode: string;
  solutionUrl?: string | null;
}

interface StoredChatSession {
  id: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  messages: Message[];
}

interface StoredChatMap {
  [examId: string]: StoredChatSession[];
}

export interface ChatHistoryItem {
  id: string;
  createdAt: string;
  updatedAt: string;
  title: string;
}

export interface UseChatMessagesReturn {
  messages: Message[];
  isLoading: boolean;
  chatHistory: ChatHistoryItem[];
  activeChatId: string | null;
  sendMessage: (
    content: string,
    giveDirectAnswer: boolean,
    selectedModelId: string,
    context?: string,
  ) => Promise<void>;
  cancelGeneration: () => string | null;
  loadChat: (chatId: string) => void;
  startNewChat: () => void;
}

const normalizeMessages = (messages: unknown): Message[] => {
  if (!Array.isArray(messages)) {
    return [];
  }

  return messages
    .map((message) => {
      if (
        !message ||
        typeof message !== "object" ||
        !("role" in message) ||
        !("content" in message)
      ) {
        return null;
      }

      const role = (message as { role: unknown }).role;
      const content = (message as { content: unknown }).content;
      const context = (message as { context?: unknown }).context;

      if (
        (role !== "user" && role !== "assistant") ||
        typeof content !== "string"
      ) {
        return null;
      }

      if (typeof context === "string") {
        return { role, content, context };
      }

      return { role, content };
    })
    .filter((message): message is Message => message !== null);
};

const getSessionTitle = (messages: Message[], fallback?: string): string => {
  const firstUserMessage = messages.find((message) => message.role === "user");
  const titleSource = firstUserMessage?.content || fallback || "";
  const compactTitle = titleSource.replace(/\s+/g, " ").trim();

  if (!compactTitle) {
    return "New chat";
  }

  return compactTitle.slice(0, 60);
};

const getHistoryMapFromStorage = (): StoredChatMap => {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const raw = localStorage.getItem(CHAT_STORAGE_KEY);
    if (!raw) {
      return {};
    }

    const parsed = JSON.parse(raw);

    if (!parsed || typeof parsed !== "object") {
      return {};
    }

    const result: StoredChatMap = {};

    Object.entries(parsed as Record<string, unknown>).forEach(
      ([examKey, sessions]) => {
        if (!Array.isArray(sessions)) {
          return;
        }

        result[examKey] = sessions
          .map((session) => {
            if (!session || typeof session !== "object") {
              return null;
            }

            const sessionId = (session as { id?: unknown }).id;
            const createdAt = (session as { createdAt?: unknown }).createdAt;
            const updatedAt = (session as { updatedAt?: unknown }).updatedAt;
            const title = (session as { title?: unknown }).title;
            const storedMessages = (session as { messages?: unknown }).messages;

            if (
              typeof sessionId !== "string" ||
              typeof createdAt !== "string" ||
              typeof updatedAt !== "string"
            ) {
              return null;
            }

            const normalizedMessages = normalizeMessages(storedMessages);
            if (normalizedMessages.length === 0) {
              return null;
            }

            return {
              id: sessionId,
              createdAt,
              updatedAt,
              title:
                typeof title === "string" && title.trim()
                  ? title
                  : getSessionTitle(normalizedMessages),
              messages: normalizedMessages,
            } satisfies StoredChatSession;
          })
          .filter((session): session is StoredChatSession => session !== null)
          .sort(
            (a, b) =>
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
          )
          .slice(0, MAX_HISTORY_ITEMS);
      },
    );

    return result;
  } catch {
    return {};
  }
};

const saveHistoryMapToStorage = (historyMap: StoredChatMap) => {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(historyMap));
};

const toHistoryItems = (sessions: StoredChatSession[]): ChatHistoryItem[] => {
  return sessions.map((session) => ({
    id: session.id,
    title: session.title,
    createdAt: session.createdAt,
    updatedAt: session.updatedAt,
  }));
};

export const useChatMessages = ({
  examId,
  examUrl,
  courseCode,
  solutionUrl,
  initialMessages = [],
}: UseChatMessagesProps): UseChatMessagesReturn => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const messagesRef = useRef<Message[]>(initialMessages);
  const isLoadingRef = useRef(false);
  const activeChatIdRef = useRef<string | null>(null);
  const initialMessagesRef = useRef(initialMessages);

  const examStorageId = String(examId);

  const persistSession = useCallback(
    (sessionId: string, nextMessages: Message[], titleFallback?: string) => {
      const historyMap = getHistoryMapFromStorage();
      const currentSessions = historyMap[examStorageId] || [];

      if (nextMessages.length === 0) {
        historyMap[examStorageId] = currentSessions.filter(
          (session) => session.id !== sessionId,
        );
        saveHistoryMapToStorage(historyMap);
        setChatHistory(toHistoryItems(historyMap[examStorageId] || []));
        return;
      }

      const existingSession = currentSessions.find(
        (session) => session.id === sessionId,
      );
      const nowIso = new Date().toISOString();

      const updatedSession: StoredChatSession = {
        id: sessionId,
        createdAt: existingSession?.createdAt || nowIso,
        updatedAt: nowIso,
        title: getSessionTitle(nextMessages, titleFallback),
        messages: nextMessages,
      };

      const merged = [
        updatedSession,
        ...currentSessions.filter((session) => session.id !== sessionId),
      ].slice(0, MAX_HISTORY_ITEMS);

      historyMap[examStorageId] = merged;
      saveHistoryMapToStorage(historyMap);
      setChatHistory(toHistoryItems(merged));
    },
    [examStorageId],
  );

  const setActiveSession = useCallback((nextSessionId: string | null) => {
    activeChatIdRef.current = nextSessionId;
    setActiveChatId(nextSessionId);
  }, []);

  useEffect(() => {
    const historyMap = getHistoryMapFromStorage();
    const sessions = historyMap[examStorageId] || [];

    setChatHistory(toHistoryItems(sessions));
    setActiveSession(null);
    setMessages(initialMessagesRef.current);
    messagesRef.current = initialMessagesRef.current;
  }, [examStorageId, setActiveSession]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    isLoadingRef.current = isLoading;
  }, [isLoading]);

  const cancelGeneration = useCallback((): string | null => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;

    let cancelledUserMessage: string | null = null;
    let updatedMessages: Message[] | null = null;

    setMessages((prev) => {
      const last = prev[prev.length - 1];
      if (last?.role === "assistant") {
        if (!last.content.trim()) {
          const userMsg = prev[prev.length - 2];
          if (userMsg?.role === "user") {
            cancelledUserMessage = userMsg.content;
          }
          if (prev.length === 2) {
            const updated = [...prev];
            updated[updated.length - 1] = {
              role: "assistant",
              content: "> *Avbruten av användaren*",
            };
            updatedMessages = updated;
            return updated;
          }
          updatedMessages = prev.slice(0, -2);
          return updatedMessages;
        } else {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: last.content.trim() + "\n\n> *Avbruten av användaren*",
          };
          updatedMessages = updated;
          return updated;
        }
      }
      updatedMessages = prev;
      return prev;
    });

    if (updatedMessages) {
      messagesRef.current = updatedMessages;

      if (activeChatIdRef.current) {
        persistSession(activeChatIdRef.current, updatedMessages);
      }
    }

    setIsLoading(false);
    return cancelledUserMessage;
  }, [persistSession]);

  const startNewChat = useCallback(() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    setIsLoading(false);
    isLoadingRef.current = false;
    setMessages([]);
    messagesRef.current = [];
    setActiveSession(null);
  }, [setActiveSession]);

  const loadChat = useCallback(
    (chatId: string) => {
      abortControllerRef.current?.abort();
      abortControllerRef.current = null;
      setIsLoading(false);
      isLoadingRef.current = false;

      const historyMap = getHistoryMapFromStorage();
      const session = (historyMap[examStorageId] || []).find(
        (item) => item.id === chatId,
      );

      if (!session) {
        return;
      }

      setActiveSession(chatId);
      setMessages(session.messages);
      messagesRef.current = session.messages;
    },
    [examStorageId, setActiveSession],
  );

  const sendMessage = useCallback(
    async (
      content: string,
      giveDirectAnswer: boolean,
      selectedModelId: string,
      context?: string,
    ) => {
      if (!content.trim() || isLoadingRef.current) return;

      const targetSessionId =
        activeChatIdRef.current ||
        `chat_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

      if (!activeChatIdRef.current) {
        setActiveSession(targetSessionId);
      }

      const userMessage: Message = {
        role: "user",
        content,
        ...(context ? { context } : {}),
      };

      const optimistic: Message[] = [
        ...messagesRef.current,
        userMessage,
        { role: "assistant", content: "" } as Message,
      ];

      setMessages(optimistic);
      messagesRef.current = optimistic;
      persistSession(targetSessionId, optimistic, content);

      setIsLoading(true);
      isLoadingRef.current = true;

      abortControllerRef.current = new AbortController();

      try {
        const recentMessages = optimistic
          .slice(0, -1)
          .slice(-10)
          .map((m) => {
            if (m.context) {
              return { role: m.role, content: m.content, context: m.context };
            }
            return { role: m.role, content: m.content };
          });

        const response = await fetch(`${CHAT_API_URL}/${examId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-anonymous-user-id":
              localStorage.getItem("liutentor_anonymous_id") || "unknown",
          },
          body: JSON.stringify({
            messages: recentMessages,
            giveDirectAnswer,
            examUrl,
            courseCode,
            solutionUrl: solutionUrl || undefined,
            modelId: selectedModelId,
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
        persistSession(targetSessionId, final, content);
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }
        const updated = [...messagesRef.current];
        updated[updated.length - 1] = {
          role: "assistant",
          content: "Något gick fel. Försök igen senare.",
        };
        setMessages(updated);
        messagesRef.current = updated;
        persistSession(targetSessionId, updated, content);
      } finally {
        abortControllerRef.current = null;
        setIsLoading(false);
        isLoadingRef.current = false;
      }
    },
    [
      examId,
      examUrl,
      courseCode,
      solutionUrl,
      setActiveSession,
      persistSession,
    ],
  );

  return {
    messages,
    isLoading,
    chatHistory,
    activeChatId,
    sendMessage,
    cancelGeneration,
    loadChat,
    startNewChat,
  };
};
