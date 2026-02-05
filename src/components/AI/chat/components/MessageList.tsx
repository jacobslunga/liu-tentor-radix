import { FC, memo, useEffect, useState, useLayoutEffect, useRef } from "react";
import { Message } from "../types";
import { MessageBubble } from "./MessageBubble";

const BATCH = 20;
const INITIAL_BATCH = 15;
const TOP_THRESHOLD = 200;

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  language: string;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  messagesContainerRef: React.RefObject<HTMLDivElement | null>;
}

export const MessageList: FC<MessageListProps> = memo(
  ({ messages, isLoading, language, messagesEndRef, messagesContainerRef }) => {
    const [startIndex, setStartIndex] = useState(() =>
      Math.max(0, messages.length - INITIAL_BATCH),
    );

    const prevScrollHeightRef = useRef<number>(0);
    const isPrependingRef = useRef(false);

    useEffect(() => {
      if (messages.length < INITIAL_BATCH) {
        setStartIndex(0);
      }
    }, [messages.length]);

    useEffect(() => {
      const container = messagesContainerRef.current;
      if (!container) return;

      const onScroll = () => {
        if (container.scrollTop <= TOP_THRESHOLD && startIndex > 0) {
          isPrependingRef.current = true;
          prevScrollHeightRef.current = container.scrollHeight;

          setStartIndex((prev) => Math.max(0, prev - BATCH));
        }
      };

      container.addEventListener("scroll", onScroll, { passive: true });
      return () => container.removeEventListener("scroll", onScroll);
    }, [messagesContainerRef, startIndex]);

    useLayoutEffect(() => {
      const container = messagesContainerRef.current;
      if (!container || !isPrependingRef.current) return;

      const newScrollHeight = container.scrollHeight;
      const scrollDiff = newScrollHeight - prevScrollHeightRef.current;

      if (scrollDiff > 0) {
        container.scrollTop += scrollDiff;
      }

      isPrependingRef.current = false;
    }, [startIndex, messagesContainerRef]);

    const visibleMessages = messages.slice(startIndex);

    return (
      <div className="w-full flex flex-col gap-8 pb-4">
        {startIndex > 0 && (
          <div className="h-8 flex items-center justify-center opacity-50 text-xs">
            ...
          </div>
        )}

        {visibleMessages.map((message, index) => {
          const realIndex = startIndex + index;
          return (
            <MessageBubble
              key={realIndex}
              index={realIndex}
              message={message}
              isLoading={isLoading && realIndex === messages.length - 1}
              language={language}
            />
          );
        })}
        <div ref={messagesEndRef} className="h-px w-full" />
      </div>
    );
  },
);

MessageList.displayName = "MessageList";
