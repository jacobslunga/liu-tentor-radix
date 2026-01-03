import { FC, useState, useEffect, useCallback, useRef, useMemo } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslation";
import { useLanguage } from "@/context/LanguageContext";
import { ExamWithSolutions } from "@/types/exam";
import { useChatMessages, useResizablePanel, useScrollManager } from "./hooks";
import { ChatHeader, EmptyState, ResizeHandle, ChatInput } from "./components";
import { Loader2 } from "lucide-react";
import { MessageList } from "./components/MessageList";

interface ChatWindowProps {
  examDetail: ExamWithSolutions;
  isOpen: boolean;
  onClose: () => void;
  variant?: "overlay" | "push";
}

const STORAGE_KEY = "chat_input_draft";

const contentVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.1 },
  },
};

const ChatWindow: FC<ChatWindowProps> = ({
  examDetail,
  isOpen,
  onClose,
  variant = "overlay",
}) => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const chatWindowRef = useRef<HTMLDivElement>(null);

  const { width, isResizing, startResizing } = useResizablePanel();
  const { messages, isLoading, sendMessage, cancelGeneration } =
    useChatMessages({
      examId: examDetail.exam.id,
      courseCode: examDetail.exam.course_code,
      examUrl: examDetail.exam.pdf_url,
      solutionUrl:
        examDetail.solutions.length > 0
          ? examDetail.solutions[0].pdf_url
          : null,
    });

  const {
    messagesEndRef,
    messagesContainerRef,
    showScrollButton,
    scrollToBottom,
    isUserScrollingRef,
  } = useScrollManager({ isOpen });

  const [input, setInput] = useState("");
  const [giveDirectAnswer, setGiveDirectAnswer] = useState(true);
  const [isDraftLoaded, setIsDraftLoaded] = useState(false);
  const [isMessageListReady, setIsMessageListReady] = useState(false);

  const lastScrollPosition = useRef<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setInput(saved);
    setIsDraftLoaded(true);
  }, []);

  useEffect(() => {
    if (isDraftLoaded) localStorage.setItem(STORAGE_KEY, input);
  }, [input, isDraftLoaded]);

  const handleClose = useCallback(() => {
    if (messagesContainerRef.current) {
      lastScrollPosition.current = messagesContainerRef.current.scrollTop;
    }
    onClose();
  }, [onClose, messagesContainerRef]);

  useEffect(() => {
    if (
      isOpen &&
      messagesContainerRef.current &&
      lastScrollPosition.current !== null
    ) {
      requestAnimationFrame(() => {
        if (
          messagesContainerRef.current &&
          lastScrollPosition.current !== null
        ) {
          messagesContainerRef.current.scrollTop = lastScrollPosition.current;
        }
      });
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) handleClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, handleClose]);

  const handleSend = useCallback(() => {
    if (!input.trim() || isLoading) return;
    isUserScrollingRef.current = false;
    scrollToBottom();
    sendMessage(input, giveDirectAnswer);
    setInput("");
    localStorage.removeItem(STORAGE_KEY);
  }, [
    input,
    isLoading,
    giveDirectAnswer,
    sendMessage,
    scrollToBottom,
    isUserScrollingRef,
  ]);

  const handleScrollToBottom = useCallback(() => {
    isUserScrollingRef.current = false;
    scrollToBottom("smooth");
  }, [scrollToBottom, isUserScrollingRef]);

  const hasSolutions = examDetail.solutions.length > 0;
  const isOverlay = variant === "overlay";

  const parentVariants = useMemo((): Variants => {
    const enterSettings = isResizing
      ? { duration: 0 }
      : {
          type: "spring" as const,
          bounce: 0,
          duration: 0.2,
          delayChildren: 0.1,
          staggerChildren: 0.05,
        };

    const exitSettings = {
      type: "spring" as const,
      bounce: 0,
      duration: 0.2,
    };

    if (isOverlay) {
      return {
        hidden: { x: "100%" },
        visible: { x: "0%", transition: enterSettings },
        exit: { x: "100%", transition: exitSettings },
      };
    } else {
      return {
        hidden: { width: 0, opacity: 0 },
        visible: {
          width: `${width}%`,
          opacity: 1,
          transition: enterSettings,
        },
        exit: {
          width: 0,
          opacity: 0,
          transition: exitSettings,
        },
      };
    }
  }, [isOverlay, width, isResizing]);

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          ref={chatWindowRef}
          variants={parentVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className={`
            bg-transparent flex flex-col z-50
            ${isOverlay ? "fixed right-0 top-0 h-full shadow-xl" : "relative h-full"}
          `}
          style={{
            width: isOverlay ? `${width}%` : undefined,
            willChange: isResizing ? "width" : "auto",
            contain: isResizing ? "layout style" : "none",
          }}
        >
          <ResizeHandle onStartResize={startResizing} isResizing={isResizing} />

          <div className="flex-1 flex flex-col overflow-hidden bg-background border-l h-full w-full">
            <motion.div variants={contentVariants}>
              <ChatHeader
                language={language}
                hasSolutions={hasSolutions}
                onClose={handleClose}
              />
            </motion.div>

            {messages.length === 0 && (
              <EmptyState language={language} hasSolutions={hasSolutions} />
            )}

            {/* Messages area - takes full remaining height */}
            <div className="flex-1 relative min-h-0">
              <motion.div
                variants={contentVariants}
                ref={messagesContainerRef}
                className="absolute inset-0 overflow-y-auto"
              >
                <div className="p-4 pb-48 space-y-4">
                  {!isMessageListReady && (
                    <div className="flex items-center justify-center py-20">
                      <Loader2 className="w-8 h-8 animate-spin" />
                    </div>
                  )}

                  <MessageList
                    messages={messages}
                    isLoading={isLoading}
                    language={language}
                    messagesEndRef={messagesEndRef}
                    messagesContainerRef={messagesContainerRef}
                    onMount={() => setIsMessageListReady(true)}
                  />
                </div>
              </motion.div>

              <motion.div
                variants={contentVariants}
                className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-background via-background to-transparent pt-8"
              >
                {isDraftLoaded && (
                  <ChatInput
                    language={language}
                    input={input}
                    isLoading={isLoading}
                    giveDirectAnswer={giveDirectAnswer}
                    showScrollButton={showScrollButton && messages.length > 0}
                    placeholder={t("aiChatPlaceholder")}
                    poweredByText={t("aiChatPoweredBy")}
                    sendButtonLabel={t("aiChatSend")}
                    onInputChange={setInput}
                    onSend={handleSend}
                    onCancel={cancelGeneration}
                    onScrollToBottom={handleScrollToBottom}
                    onToggleAnswerMode={setGiveDirectAnswer}
                  />
                )}
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatWindow;
