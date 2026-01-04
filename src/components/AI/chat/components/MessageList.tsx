import { FC, memo, useEffect, useState, Suspense } from "react";
import { Message } from "../types";
import { MessageBubble } from "./MessageBubble";

const BATCH = 20;
const INITIAL_BATCH = 8;
const TOP_THRESHOLD = 120;

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  language: string;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  messagesContainerRef: React.RefObject<HTMLDivElement | null>;
  onMount?: () => void;
}

export const MessageList: FC<MessageListProps> = memo(
  ({
    messages,
    isLoading,
    language,
    messagesEndRef,
    messagesContainerRef,
    onMount,
  }) => {
    const [startIndex, setStartIndex] = useState(
      Math.max(0, messages.length - INITIAL_BATCH)
    );

    // Notify parent when first batch mounts
    useEffect(() => {
      onMount?.();
    }, []);

    // Expand batch when new messages arrive
    useEffect(() => {
      if (messages.length > startIndex + INITIAL_BATCH) {
        const timeout = setTimeout(() => {
          setStartIndex(Math.max(0, messages.length - BATCH));
        }, 0);
        return () => clearTimeout(timeout);
      }
    }, [messages.length]);

    // Scroll to top load more
    useEffect(() => {
      const container = messagesContainerRef.current;
      if (!container) return;
      const onScroll = () => {
        if (container.scrollTop <= TOP_THRESHOLD) {
          setStartIndex((prev) => Math.max(0, prev - BATCH));
        }
      };
      container.addEventListener("scroll", onScroll, { passive: true });
      return () => container.removeEventListener("scroll", onScroll);
    }, [messagesContainerRef]);

    const visibleMessages = messages.slice(startIndex);

    return (
      <div className="w-full flex flex-col gap-8">
        {visibleMessages.map((message, index) => {
          const realIndex = startIndex + index;
          return (
            <Suspense
              key={realIndex}
              fallback={<div className="h-16 bg-secondary/30 animate-pulse" />}
            >
              <MessageBubble
                index={realIndex}
                message={message}
                isLoading={isLoading && realIndex === messages.length - 1}
                language={language}
              />
            </Suspense>
          );
        })}
        <div ref={messagesEndRef} className="h-4" />
      </div>
    );
  }
);

MessageList.displayName = "MessageList";
