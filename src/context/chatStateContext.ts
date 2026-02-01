import { createContext } from "react";
import type { UseChatMessagesReturn } from "@/components/AI/chat/hooks/useChatMessages";

export const ChatStateContext = createContext<UseChatMessagesReturn | null>(null);
