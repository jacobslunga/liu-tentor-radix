import { FC, memo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { Message } from '../types';
import { motion } from 'framer-motion';
import { markdownComponents } from './MarkdownComponents';
import { useThrottle } from '../hooks/useThrottle';
import { QuotesIcon } from '@phosphor-icons/react';

interface MessageBubbleProps {
  message: Message;
  isLoading: boolean;
  language: string;
  index: number;
}

const GridLoader = () => {
  const delays = [0, 0.2, 0.6, 0.4];

  return (
    <div className='grid grid-cols-2 gap-0.5'>
      {[0, 1, 2, 3].map((index) => (
        <motion.div
          key={index}
          className='h-1 w-1 rounded-full bg-foreground'
          initial={{ opacity: 0.4 }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: delays[index],
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

const AssistantMessage: FC<{ content: string }> = memo(
  ({ content }) => {
    return (
      <div className='prose prose-base dark:prose-invert max-w-none w-full leading-7'>
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

AssistantMessage.displayName = 'AssistantMessage';

export const MessageBubble: FC<MessageBubbleProps> = memo(
  ({ message, isLoading, language }) => {
    const isUser = message.role === 'user';
    const isThinking =
      message.role === 'assistant' && message.content === '' && isLoading;

    const throttledContent = useThrottle(message.content, isLoading ? 150 : 0);

    return (
      <div
        className={`max-w-2xl mx-auto w-full ${isUser ? 'flex justify-end' : ''}`}
      >
        <div
          className={`${
            isUser
              ? 'bg-[#5478FF]/20 text-black dark:text-white px-3 py-2.5 rounded-xl max-w-[85%] w-fit'
              : 'w-full px-1 py-2'
          }`}
          data-message-content
        >
          {message.role === 'assistant' ? (
            isThinking ? (
              <div className='flex items-center gap-3 py-1'>
                <GridLoader />
                <span className='text-sm font-normal text-muted-foreground animate-pulse'>
                  {language === 'sv' ? 'Tänker...' : 'Thinking...'}
                </span>
              </div>
            ) : (
              <AssistantMessage content={throttledContent} />
            )
          ) : (
            <div>
              {message.context && (
                <div className='flex items-center gap-1.5 mb-1.5 text-xs text-foreground/50'>
                  <QuotesIcon weight='fill' className='size-3 shrink-0' />
                  <span className='truncate max-w-[200px]'>
                    {message.context.length > 60
                      ? message.context.slice(0, 60) + '...'
                      : message.context}
                  </span>
                </div>
              )}
              <p className='text-[15px] leading-relaxed whitespace-pre-wrap'>
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

MessageBubble.displayName = 'MessageBubble';
