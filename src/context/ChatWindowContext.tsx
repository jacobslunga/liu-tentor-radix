import React, { createContext, useContext, useState } from "react";

interface IChatWindowContext {
  showChatWindow: boolean;
  setShowChatWindow: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChatWindowContext = createContext<IChatWindowContext>({
  showChatWindow: false,
  setShowChatWindow: () => {},
});

interface ChatWindowProps {
  children: React.ReactNode;
}

const ChatWindowProvider = ({ children }: ChatWindowProps) => {
  const [showChatWindow, setShowChatWindow] = useState<boolean>(false);

  return (
    <ChatWindowContext.Provider value={{ showChatWindow, setShowChatWindow }}>
      {children}
    </ChatWindowContext.Provider>
  );
};

export const useChatWindow = (): IChatWindowContext => {
  const context = useContext(ChatWindowContext);
  if (!context) {
    throw new Error("useTextSize must be used within a TextSizeProvider");
  }
  return context;
};

export default ChatWindowProvider;
