import { useContext } from "react";
import { ChatStateContext } from "@/context/chatStateContext";

export const useChatState = () => {
  const context = useContext(ChatStateContext);
  if (!context) {
    throw new Error("useChatState must be used within a ChatProvider");
  }
  return context;
};
