import { FC, memo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { Message } from "../types";
import { motion } from "framer-motion";
import { markdownComponents } from "./MarkdownComponents";
import { useThrottle } from "../hooks/useThrottle";

const ThinkingDot = () => (
  <motion.div
    className="h-2 w-2 rounded-full bg-foreground"
    animate={{
      scale: [1, 1.6, 1],
      opacity: [0.3, 0.9, 0.3],
    }}
    transition={{
      duration: 1.8,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
);

interface MessageBubbleProps {
  message: Message;
  isLoading: boolean;
  language: string;
  index: number;
}

const AssistantMessage: FC<{ content: string }> = memo(
  ({ content }) => {
    return (
      <div className="prose prose-base dark:prose-invert max-w-none w-full leading-7 text-pretty wrap-break-word prose-hr:border-foreground">
        <ReactMarkdown
          remarkPlugins={[remarkMath, remarkGfm]}
          rehypePlugins={[
            [rehypeKatex, { strict: false, throwOnError: false }],
          ]}
          components={markdownComponents}
        >
          {content}
        </ReactMarkdown>
      </div>
    );
  },
  (prev, next) => prev.content === next.content,
);

AssistantMessage.displayName = "AssistantMessage";

export const MessageBubble: FC<MessageBubbleProps> = memo(
  ({ message, isLoading }) => {
    const isUser = message.role === "user";
    const isThinking =
      message.role === "assistant" && message.content === "" && isLoading;

    const throttledContent = useThrottle(message.content, isLoading ? 150 : 0);

    return (
      <div
        className={`max-w-2xl mx-auto w-full ${isUser ? "flex justify-end" : ""}`}
      >
        <div
          className={`${
            isUser
              ? "bg-primary/10 text-[1px]! text-foreground px-3 py-2.5 rounded-2xl max-w-[85%] w-fit"
              : "w-full px-1 py-2"
          }`}
          data-message-content
        >
          {message.role === "assistant" ? (
            isThinking ? (
              <ThinkingDot />
            ) : (
              <AssistantMessage content={throttledContent} />
            )
          ) : (
            <div>
              {message.context && (
                <div className="flex items-center gap-1.5 mb-1.5 text-xs text-foreground/50">
                  <span className="truncate max-w-[200px]">
                    {message.context.length > 60
                      ? message.context.slice(0, 60) + "..."
                      : message.context}
                  </span>
                </div>
              )}
              <p className="text-[16px] leading-relaxed whitespace-pre-wrap">
                {message.content}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  },
  (prevProps, nextProps) =>
    prevProps.message.content === nextProps.message.content &&
    prevProps.message.role === nextProps.message.role &&
    prevProps.isLoading === nextProps.isLoading &&
    prevProps.language === nextProps.language,
);

MessageBubble.displayName = "MessageBubble";
