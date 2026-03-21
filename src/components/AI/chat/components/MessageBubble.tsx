import { FC, memo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { Message } from "../types";
import { motion, AnimatePresence } from "framer-motion";
import { markdownComponents } from "./MarkdownComponents";
import { useThrottle } from "../hooks/useThrottle";
import { useLanguage } from "@/context/LanguageContext";

const GridLoader = () => {
  const delays = [0, 0.2, 0.6, 0.4];

  return (
    <div className="grid grid-cols-2 gap-0.5">
      {[0, 1, 2, 3].map((index) => (
        <motion.div
          key={index}
          className="h-1 w-1 rounded-full bg-foreground"
          initial={{ opacity: 0.4 }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: delays[index],
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

const ShimmeringThinking = () => {
  const { language } = useLanguage();

  return (
    <div className="flex items-center h-6 overflow-hidden select-none">
      <AnimatePresence mode="popLayout">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="text-sm font-medium"
        >
          <motion.span
            className="inline-block bg-linear-to-r from-muted-foreground/40 via-foreground to-muted-foreground/40 bg-size-[200%_auto] bg-clip-text text-transparent"
            animate={{
              backgroundPosition: ["200% center", "-200% center"],
            }}
            transition={{
              repeat: Infinity,
              duration: 2.5,
              ease: "linear",
            }}
          >
            {language === "sv" ? "Tänker..." : "Thinking..."}
          </motion.span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

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
              <div className="flex flex-row items-center justify-start gap-2">
                <GridLoader />
                <ShimmeringThinking />
              </div>
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
