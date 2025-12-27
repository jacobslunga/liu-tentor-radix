import { FC, useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
}

const STORAGE_KEY = "chat_input_draft";

const ChatWindow: FC<ChatWindowProps> = ({ examDetail, isOpen, onClose }) => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const chatWindowRef = useRef<HTMLDivElement>(null);

  const { width, isResizing, startResizing } = useResizablePanel();
  const {
    messages,
    isLoading,
    sendMessage,
    cancelGeneration,
    resetConversation,
  } = useChatMessages({
    examId: examDetail.exam.id,
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

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          ref={chatWindowRef}
          initial={{ x: "100%" }}
          animate={{ x: "0%" }}
          exit={{ x: "100%" }}
          transition={{ x: { duration: 0.2, ease: [0.4, 0, 0.2, 1] } }}
          className="fixed right-0 top-0 h-full bg-background border-l flex flex-col overflow-hidden z-50"
          style={{
            width: `${width}%`,
            willChange: isResizing ? "width" : "auto",
            contain: isResizing ? "layout style" : "none",
          }}
        >
          <ResizeHandle onStartResize={startResizing} isResizing={isResizing} />
          <ChatHeader
            language={language}
            hasSolutions={hasSolutions}
            onClose={handleClose}
          />

          <div
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto p-4 pb-20 space-y-4 relative min-h-0"
          >
            {!isMessageListReady && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            )}

            {messages.length === 0 && (
              <EmptyState language={language} hasSolutions={hasSolutions} />
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

          {isDraftLoaded && (
            <ChatInput
              language={language}
              input={input}
              isLoading={isLoading}
              giveDirectAnswer={giveDirectAnswer}
              showScrollButton={showScrollButton}
              placeholder={t("aiChatPlaceholder")}
              poweredByText={t("aiChatPoweredBy")}
              sendButtonLabel={t("aiChatSend")}
              onInputChange={setInput}
              onSend={handleSend}
              onCancel={cancelGeneration}
              onScrollToBottom={handleScrollToBottom}
              onToggleAnswerMode={setGiveDirectAnswer}
              messagesCount={messages.length}
              onResetConversation={resetConversation}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatWindow;
