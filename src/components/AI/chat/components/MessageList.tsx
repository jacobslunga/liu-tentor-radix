import { FC, memo, useMemo } from "react";
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";
import { Message } from "../types";
import { MessageBubble } from "./MessageBubble";

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  language: string;
  virtuosoRef: React.RefObject<VirtuosoHandle | null>;
  onScroll?: (isAtBottom: boolean) => void;
}

export const MessageList: FC<MessageListProps> = memo(
  ({ messages, isLoading, language, virtuosoRef, onScroll }) => {
    const components = useMemo(
      () => ({
        Footer: () => <div className="h-48" />,
      }),
      [],
    );

    return (
      <Virtuoso
        ref={virtuosoRef}
        style={{ height: "100%" }}
        data={messages}
        initialTopMostItemIndex={messages.length - 1}
        alignToBottom={false}
        followOutput={false}
        atBottomThreshold={60}
        increaseViewportBy={{ top: 500, bottom: 500 }}
        atBottomStateChange={(isAtBottom) => {
          onScroll?.(isAtBottom);
        }}
        components={components}
        computeItemKey={(index) => `msg-${index}`}
        itemContent={(index, message) => (
          <div className="mb-8 px-4" style={{ contain: "layout style" }}>
            <MessageBubble
              index={index}
              message={message}
              isLoading={isLoading && index === messages.length - 1}
              language={language}
            />
          </div>
        )}
      />
    );
  },
);

MessageList.displayName = "MessageList";
