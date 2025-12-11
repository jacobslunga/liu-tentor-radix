import { FC, memo, useEffect, useRef } from "react";
import { Message } from "../types";
import { MessageBubble } from "./MessageBubble";

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  language: string;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  onAssistantRefsReady: (refs: (HTMLDivElement | null)[]) => void;
}

export const MessageList: FC<MessageListProps> = memo(
  ({ messages, isLoading, language, messagesEndRef, onAssistantRefsReady }) => {
    // Store refs in a stable array
    const refsArray = useRef<(HTMLDivElement | null)[]>([]);

    // Sync refs with parent after render
    useEffect(() => {
      onAssistantRefsReady(refsArray.current);
    }, [messages.length, onAssistantRefsReady]);

    return (
      <div className="w-full">
        {messages.map((message, index) => {
          const isAssistant = message.role === "assistant";

          return (
            <div
              key={index}
              ref={
                isAssistant
                  ? (el) => {
                      refsArray.current[index] = el;
                    }
                  : undefined
              }
            >
              <MessageBubble
                index={index}
                message={message}
                isLoading={isLoading && index === messages.length - 1}
                language={language}
              />
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
    );
  },
  (prevProps, nextProps) =>
    prevProps.messages === nextProps.messages &&
    prevProps.isLoading === nextProps.isLoading &&
    prevProps.language === nextProps.language
);

MessageList.displayName = "MessageList";
