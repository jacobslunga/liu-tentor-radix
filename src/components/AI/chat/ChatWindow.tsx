import { FC, useState, useEffect, useCallback, useRef, useMemo } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslation";
import { useLanguage } from "@/context/LanguageContext";
import { ExamDetailPayload } from "@/api";
import { useResizablePanel, useTextSelection, useScrollManager } from "./hooks";
import { ChatHeader } from "./components/ChatHeader";
import { SelectionPopover } from "./components/SelectionPopover";
import { EmptyState } from "./components/EmptyState";
import { MessageList } from "./components/MessageList";
import { ChatInput, ChatInputHandle } from "./components/ChatInput";
import { ResizeHandle } from "./components/ResizeHandle";
import { Loader2 } from "lucide-react";
import { useChatState } from "@/hooks/useChatState";

interface ChatWindowProps {
  examDetail: ExamDetailPayload;
  isOpen: boolean;
  onClose: () => void;
  variant?: "overlay";
}

const STORAGE_KEY = "chat_input_draft";
const MODEL_STORAGE_KEY = "chat_model_id_preference_v2";

const contentVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.12, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.04, ease: "easeIn" },
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
  const chatInputRef = useRef<ChatInputHandle>(null);

  const {
    messagesEndRef,
    messagesContainerRef,
    showScrollButton,
    scrollToBottom,
    isUserScrollingRef,
  } = useScrollManager({ isOpen });

  const [shouldRenderMessages, setShouldRenderMessages] = useState(false);

  const {
    messages,
    isLoading,
    sendMessage,
    cancelGeneration,
    chatHistory,
    activeChatId,
    loadChat,
    startNewChat,
  } = useChatState();

  const { width, isResizing, startResizing } = useResizablePanel();

  const { selectedText, selectionPosition, clearSelection } = useTextSelection({
    containerRef: messagesContainerRef,
    minLength: 10,
  });

  const [input, setInput] = useState("");
  const [giveDirectAnswer, setGiveDirectAnswer] = useState(true);
  const [selectedModelId, setSelectedModelId] =
    useState<string>("claude-haiku");
  const [isDraftLoaded, setIsDraftLoaded] = useState(false);
  const [quotedContext, setQuotedContext] = useState("");

  useEffect(() => {
    const savedInput = localStorage.getItem(STORAGE_KEY);
    const savedModelId = localStorage.getItem(MODEL_STORAGE_KEY);
    if (savedInput) setInput(savedInput);
    const deprecated = ["gemini-2.5-flash", "gemini-3-pro-preview"];
    if (savedModelId && !deprecated.includes(savedModelId)) {
      setSelectedModelId(savedModelId);
    } else if (savedModelId && deprecated.includes(savedModelId)) {
      localStorage.setItem(MODEL_STORAGE_KEY, "gemini-3.1-pro-preview");
    }
    setIsDraftLoaded(true);
  }, []);

  useEffect(() => {
    if (isDraftLoaded) localStorage.setItem(STORAGE_KEY, input);
  }, [input, isDraftLoaded]);

  useEffect(() => {
    if (isDraftLoaded) localStorage.setItem(MODEL_STORAGE_KEY, selectedModelId);
  }, [selectedModelId, isDraftLoaded]);

  const prevMessagesLength = useRef(messages.length);
  useEffect(() => {
    if (messages.length > prevMessagesLength.current) {
      const lastMessage = messages[messages.length - 1];
      const isUserMessage = lastMessage?.role === "user";

      if (isUserMessage || !isUserScrollingRef.current) {
        setTimeout(() => {
          scrollToBottom("smooth");
        }, 100);
      }
    }
    prevMessagesLength.current = messages.length;
  }, [messages, scrollToBottom, isUserScrollingRef]);

  const handleAskAboutSelection = useCallback(() => {
    setQuotedContext(selectedText);
    clearSelection();
    window.getSelection()?.removeAllRanges();
  }, [selectedText, clearSelection]);

  const handleClearQuotedContext = useCallback(() => {
    setQuotedContext("");
  }, []);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleSelectPastChat = useCallback(
    (chatId: string) => {
      loadChat(chatId);
      setQuotedContext("");
      requestAnimationFrame(() => scrollToBottom("auto"));
    },
    [loadChat, scrollToBottom],
  );

  const handleStartNewChat = useCallback(() => {
    startNewChat();
    setInput("");
    setQuotedContext("");
    localStorage.removeItem(STORAGE_KEY);
    isUserScrollingRef.current = false;
    requestAnimationFrame(() => scrollToBottom("auto"));
  }, [startNewChat, scrollToBottom, isUserScrollingRef]);

  const handleSend = useCallback(() => {
    if (!input.trim() || isLoading) return;

    sendMessage(
      input,
      giveDirectAnswer,
      selectedModelId,
      quotedContext || undefined,
    );

    setInput("");
    setQuotedContext("");
    localStorage.removeItem(STORAGE_KEY);

    isUserScrollingRef.current = false;
    requestAnimationFrame(() => scrollToBottom("smooth"));
  }, [
    input,
    isLoading,
    giveDirectAnswer,
    selectedModelId,
    quotedContext,
    sendMessage,
    scrollToBottom,
    isUserScrollingRef,
  ]);

  const handleCancel = useCallback(() => {
    const cancelledMessage = cancelGeneration();
    if (cancelledMessage) {
      setInput(cancelledMessage);
      chatInputRef.current?.focus();
    }
  }, [cancelGeneration]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) handleClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, handleClose]);

  const hasSolutions = examDetail.solution !== null;
  const isOverlay = variant === "overlay";

  const parentVariants = useMemo((): Variants => {
    const enterSettings = isResizing
      ? { duration: 0 }
      : {
          type: "spring" as const,
          bounce: 0,
          duration: 0.22,
          delayChildren: 0.08,
        };

    const exitSettings = { type: "spring" as const, bounce: 0, duration: 0.14 };

    return {
      hidden: { width: 0 },
      visible: { width: `${width}%`, transition: enterSettings },
      exit: { width: 0, transition: exitSettings },
    };
  }, [isOverlay, width, isResizing]);

  const positionClasses = "fixed right-0 top-0 h-full shadow-xl";

  const handleAnimationComplete = (definition: string) => {
    if (definition === "visible") {
      setShouldRenderMessages(true);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          ref={chatWindowRef}
          variants={parentVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onAnimationComplete={handleAnimationComplete}
          className={`bg-transparent flex flex-col z-50 ${positionClasses}`}
          style={{
            width: isOverlay ? `${width}%` : undefined,
            willChange: isResizing ? "width" : "auto",
            contain: isResizing ? "layout style" : "none",
          }}
        >
          <ResizeHandle onStartResize={startResizing} isResizing={isResizing} />

          <div
            className={`flex-1 flex flex-col overflow-hidden bg-background h-full w-full ${!isOverlay ? "" : "border-l"}`}
          >
            <motion.div
              variants={contentVariants}
              className="absolute top-0 left-0 right-0 z-20 pt-2 pb-8"
            >
              <div className="absolute inset-0 z-0 bg-linear-to-b from-background via-background/90 to-transparent pointer-events-none" />

              <div className="relative z-10">
                <ChatHeader
                  language={language}
                  hasSolution={hasSolutions}
                  onClose={handleClose}
                  chatHistory={chatHistory}
                  activeChatId={activeChatId}
                  onSelectChat={handleSelectPastChat}
                  onStartNewChat={handleStartNewChat}
                />
              </div>
            </motion.div>

            {messages.length === 0 && (
              <motion.div variants={contentVariants} className="w-full h-full">
                <EmptyState language={language} />
              </motion.div>
            )}

            <div className="flex-1 relative min-h-0 flex flex-col">
              <motion.div
                variants={contentVariants}
                ref={messagesContainerRef}
                className="absolute inset-0 overflow-y-auto"
              >
                <div className="px-4 pt-24 pb-48 space-y-4 relative min-h-full">
                  {shouldRenderMessages ? (
                    <>
                      <MessageList
                        messages={messages}
                        isLoading={isLoading}
                        language={language}
                        messagesEndRef={messagesEndRef}
                        messagesContainerRef={messagesContainerRef}
                      />
                    </>
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                    </div>
                  )}
                </div>
              </motion.div>

              <SelectionPopover
                show={!!selectedText}
                position={selectionPosition}
                language={language}
                onAskAbout={handleAskAboutSelection}
              />

              <motion.div
                variants={contentVariants}
                className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-background via-background to-transparent pt-8 z-10"
              >
                {isDraftLoaded && (
                  <ChatInput
                    ref={chatInputRef}
                    language={language}
                    input={input}
                    isLoading={isLoading}
                    giveDirectAnswer={giveDirectAnswer}
                    showScrollButton={showScrollButton && messages.length > 0}
                    placeholder={t("aiChatPlaceholder")}
                    sendButtonLabel={t("aiChatSend")}
                    poweredByText={t("aiChatPoweredBy")}
                    quotedContext={quotedContext}
                    selectedModelId={selectedModelId}
                    onModelChange={setSelectedModelId}
                    onInputChange={setInput}
                    onSend={handleSend}
                    onCancel={handleCancel}
                    onScrollToBottom={() => {
                      isUserScrollingRef.current = false;
                      scrollToBottom("smooth");
                    }}
                    onToggleAnswerMode={setGiveDirectAnswer}
                    onClearQuotedContext={handleClearQuotedContext}
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
