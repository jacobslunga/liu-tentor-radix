import { FC, useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslation";
import { useLanguage } from "@/context/LanguageContext";
import { ExamWithSolutions } from "@/types/exam";
import { useChatMessages, useResizablePanel, useScrollManager } from "./hooks";
import {
  ChatHeader,
  EmptyState,
  MessageList,
  ChatInput,
  ResizeHandle,
} from "./components";

interface ChatWindowProps {
  examDetail: ExamWithSolutions;
  isOpen: boolean;
  onClose: () => void;
}

const ChatWindow: FC<ChatWindowProps> = ({ examDetail, isOpen, onClose }) => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const chatWindowRef = useRef<HTMLDivElement>(null);

  // Custom hooks
  const { width, isResizing, startResizing } = useResizablePanel();
  const {
    messages,
    isLoading,
    sendMessage,
    cancelGeneration,
    assistantMessageRefs,
    currentAssistantIndex,
    setCurrentAssistantIndex,
    navigateToAssistantMessage,
  } = useChatMessages({
    examId: examDetail.exam.id,
  });
  const {
    messagesEndRef,
    messagesContainerRef,
    showScrollButton,
    scrollToBottom,
    isUserScrollingRef,
    visibleAssistantIndex,
  } = useScrollManager({
    isOpen,
    assistantMessageRefs,
    onVisibleIndexChange: setCurrentAssistantIndex,
  });

  // Local state
  const [input, setInput] = useState("");
  const [giveDirectAnswer, setGiveDirectAnswer] = useState(true);

  // Computed values
  const hasSolutions = examDetail.solutions.length > 0;
  const totalAssistantMessages = messages.filter(
    (m) => m.role === "assistant"
  ).length;
  // Only show navigation when there's more than 1 assistant message
  const hasMultipleAssistantMessages = totalAssistantMessages > 1;

  // Use the scroll-detected index, falling back to navigation index
  const displayIndex =
    visibleAssistantIndex >= 0 ? visibleAssistantIndex : currentAssistantIndex;

  // Handle close
  const handleClose = useCallback(() => {
    setInput("");
    onClose();
  }, [onClose]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, handleClose]);

  // Handle send message
  const handleSend = useCallback(() => {
    if (!input.trim() || isLoading) return;
    isUserScrollingRef.current = false;
    scrollToBottom();
    sendMessage(input, giveDirectAnswer);
    setInput("");
  }, [
    input,
    isLoading,
    giveDirectAnswer,
    sendMessage,
    scrollToBottom,
    isUserScrollingRef,
  ]);

  // Handle scroll to bottom
  const handleScrollToBottom = useCallback(() => {
    isUserScrollingRef.current = false;
    scrollToBottom("smooth");
  }, [scrollToBottom, isUserScrollingRef]);

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          ref={chatWindowRef}
          initial={{ x: "100%" }}
          animate={{ x: "0%" }}
          exit={{ x: "100%" }}
          transition={{
            x: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
          }}
          className="fixed right-0 top-0 h-full bg-background border-l flex flex-col overflow-hidden z-50"
          style={{
            width: `${width}%`,
            // GPU acceleration during resize for smoother performance
            willChange: isResizing ? "width" : "auto",
            contain: isResizing ? "layout style" : "none",
          }}
        >
          <ResizeHandle onStartResize={startResizing} />
          <ChatHeader
            language={language}
            hasSolutions={hasSolutions}
            messages={messages}
            currentAssistantIndex={displayIndex}
            onClose={handleClose}
            onNavigateToMessage={navigateToAssistantMessage}
          />

          <div
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto p-4 pb-20 space-y-4 relative min-h-0"
          >
            {messages.length === 0 && (
              <EmptyState language={language} hasSolutions={hasSolutions} />
            )}

            <MessageList
              messages={messages}
              isLoading={isLoading}
              language={language}
              messagesEndRef={messagesEndRef}
              onAssistantRefsReady={(refs) => {
                assistantMessageRefs.current = refs;
              }}
            />
          </div>

          <ChatInput
            language={language}
            input={input}
            isLoading={isLoading}
            giveDirectAnswer={giveDirectAnswer}
            showScrollButton={showScrollButton}
            hasAssistantMessages={hasMultipleAssistantMessages}
            currentAssistantIndex={displayIndex}
            totalAssistantMessages={totalAssistantMessages}
            placeholder={t("aiChatPlaceholder")}
            poweredByText={t("aiChatPoweredBy")}
            sendButtonLabel={t("aiChatSend")}
            onInputChange={setInput}
            onSend={handleSend}
            onCancel={cancelGeneration}
            onScrollToBottom={handleScrollToBottom}
            onNavigate={navigateToAssistantMessage}
            onToggleAnswerMode={setGiveDirectAnswer}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatWindow;
