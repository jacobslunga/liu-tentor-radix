import { FC, memo, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { CircleNotchIcon } from "@phosphor-icons/react";
import { Message } from "../types";
import { normalizeMath } from "../utils";
import { markdownComponents } from "./MarkdownComponents";

interface MessageBubbleProps {
  message: Message;
  isLoading: boolean;
  language: string;
  index: number;
}

// Separate component for assistant messages to isolate markdown rendering
const AssistantMessage: FC<{ content: string }> = memo(
  ({ content }) => {
    const processedContent = useMemo(() => normalizeMath(content), [content]);

    return (
      <div className="prose prose-base dark:prose-invert max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkMath, remarkGfm]}
          rehypePlugins={[
            [rehypeKatex, { strict: false, throwOnError: false }],
          ]}
          components={markdownComponents}
        >
          {processedContent}
        </ReactMarkdown>
      </div>
    );
  },
  (prevProps, nextProps) => prevProps.content === nextProps.content
);

AssistantMessage.displayName = "AssistantMessage";

export const MessageBubble: FC<MessageBubbleProps> = memo(
  ({ message, isLoading, language }) => {
    return (
      <div>
        <div className="max-w-3xl mx-auto py-6 px-4">
          {message.role === "assistant" ? (
            message.content === "" && isLoading ? (
              <div className="flex items-center gap-2">
                <CircleNotchIcon
                  weight="bold"
                  className="h-5 w-5 animate-spin"
                />
                <span className="text-sm text-muted-foreground">
                  {language === "sv" ? "Tänker..." : "Thinking..."}
                </span>
              </div>
            ) : (
              <AssistantMessage content={message.content} />
            )
          ) : (
            <p className="text-base whitespace-pre-wrap">{message.content}</p>
          )}
        </div>
      </div>
    );
  },
  (prevProps, nextProps) =>
    prevProps.message.content === nextProps.message.content &&
    prevProps.message.role === nextProps.message.role &&
    prevProps.isLoading === nextProps.isLoading &&
    prevProps.language === nextProps.language
);

MessageBubble.displayName = "MessageBubble";
