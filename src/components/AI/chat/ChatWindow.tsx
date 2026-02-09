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
  variant?: "overlay" | "push" | "fullscreen";
}

const STORAGE_KEY = "chat_input_draft";
const MODEL_STORAGE_KEY = "chat_model_id_preference";
const SIDE_STORAGE_KEY = "chat_window_side_preference";

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
  const chatInputRef = useRef<ChatInputHandle>(null);

  // Use the new scroll manager
  const {
    messagesEndRef,
    messagesContainerRef,
    messagesContainer,
    showScrollButton,
    scrollToBottom,
    isUserScrollingRef,
  } = useScrollManager({ isOpen });

  const [side, setSide] = useState<"left" | "right">("right");
  const [isSideLoaded, setIsSideLoaded] = useState(false);
  const [shouldRenderMessages, setShouldRenderMessages] = useState(false);

  const { messages, isLoading, sendMessage, cancelGeneration } = useChatState();

  const { width, isResizing, startResizing } = useResizablePanel();

  const { selectedText, selectionPosition, clearSelection } = useTextSelection({
    container: messagesContainer,
    minLength: 10,
  });

  const [input, setInput] = useState("");
  const [giveDirectAnswer, setGiveDirectAnswer] = useState(true);
  const [selectedModelId, setSelectedModelId] =
    useState<string>("gemini-2.5-flash");
  const [isDraftLoaded, setIsDraftLoaded] = useState(false);
  const [quotedContext, setQuotedContext] = useState("");

  useEffect(() => {
    const savedSide = localStorage.getItem(SIDE_STORAGE_KEY) as
      | "left"
      | "right"
      | null;
    if (savedSide) setSide(savedSide);
    setIsSideLoaded(true);
  }, []);

  useEffect(() => {
    const savedInput = localStorage.getItem(STORAGE_KEY);
    const savedModelId = localStorage.getItem(MODEL_STORAGE_KEY);
    if (savedInput) setInput(savedInput);
    if (savedModelId) setSelectedModelId(savedModelId);
    setIsDraftLoaded(true);
  }, []);

  useEffect(() => {
    if (isDraftLoaded) localStorage.setItem(STORAGE_KEY, input);
  }, [input, isDraftLoaded]);

  useEffect(() => {
    if (isDraftLoaded) localStorage.setItem(MODEL_STORAGE_KEY, selectedModelId);
  }, [selectedModelId, isDraftLoaded]);

  // Handle auto-scroll on new messages
  const prevMessagesLength = useRef(messages.length);
  useEffect(() => {
    // Only scroll if we added messages and user wasn't scrolling up
    if (messages.length > prevMessagesLength.current) {
      const lastMessage = messages[messages.length - 1];
      const isUserMessage = lastMessage?.role === "user";

      // If it's a user message, always scroll to bottom
      // If it's AI message, scroll only if not manually scrolled up (handled by useScrollManager/isUserScrollingRef)
      if (isUserMessage || !isUserScrollingRef.current) {
        // Small timeout to ensure DOM is updated
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

  const handleSend = useCallback(() => {
    if (!input.trim() || isLoading) return;

    const messageToSend = quotedContext
      ? `Regarding this: "${quotedContext}"\n\n${input}`
      : input;

    sendMessage(messageToSend, giveDirectAnswer, selectedModelId);

    setInput("");
    setQuotedContext("");
    localStorage.removeItem(STORAGE_KEY);

    // Reset user scrolling state so we stick to bottom
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
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, handleClose]);

  const hasSolutions = examDetail.solution !== null;
  const isOverlay = variant === "overlay";
  const isFullscreen = variant === "fullscreen";

  const parentVariants = useMemo((): Variants => {
    const enterSettings = isResizing
      ? { duration: 0 }
      : {
          type: "spring" as const,
          bounce: 0,
          duration: 0.2,
          delayChildren: 0.1,
        };

    const exitSettings = { type: "spring" as const, bounce: 0, duration: 0.2 };

    if (isFullscreen) {
      return {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.2 } },
        exit: { opacity: 0, transition: { duration: 0.1 } },
      };
    }

    if (isOverlay) {
      const xHidden = side === "right" ? "100%" : "-100%";
      return {
        hidden: { x: xHidden },
        visible: { x: "0%", transition: enterSettings },
        exit: { x: xHidden, transition: exitSettings },
      };
    } else {
      return {
        hidden: { width: 0, opacity: 0 },
        visible: { width: `${width}%`, opacity: 1, transition: enterSettings },
        exit: { width: 0, opacity: 0, transition: exitSettings },
      };
    }
  }, [isOverlay, width, isResizing, side, isFullscreen]);

  const positionClasses = isFullscreen
    ? "relative w-full h-full"
    : isOverlay
      ? side === "right"
        ? "fixed right-0 top-0 h-full shadow-xl"
        : "fixed left-0 top-0 h-full shadow-xl"
      : `relative h-full ${side === "left" ? "order-first border-r border-l-0" : "border-l"}`;

  const handleAnimationComplete = (definition: string) => {
    if (definition === "visible") {
      setShouldRenderMessages(true);
    }
  };

  if (!isSideLoaded) return null;

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          ref={chatWindowRef}
          key={`chat-window-${side}`}
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
          {!isFullscreen && (
            <ResizeHandle
              onStartResize={startResizing}
              isResizing={isResizing}
              side={side}
            />
          )}

          <div
            className={`flex-1 flex flex-col overflow-hidden bg-background h-full w-full ${!isOverlay && !isFullscreen ? "border-l" : ""}`}
          >
            {messages.length === 0 && <EmptyState language={language} />}

            <div className="flex-1 relative min-h-0 flex flex-col">
              <motion.div variants={contentVariants} className="z-50">
                <ChatHeader
                  language={language}
                  hasSolution={hasSolutions}
                  onClose={handleClose}
                  side={side}
                />
              </motion.div>
              <motion.div
                variants={contentVariants}
                ref={messagesContainerRef}
                className="absolute inset-0 overflow-y-auto"
              >
                <div className="pb-48 relative min-h-full">
                  {shouldRenderMessages ? (
                    <>
                      <MessageList
                        messages={messages}
                        isLoading={isLoading}
                        language={language}
                        messagesEndRef={messagesEndRef}
                        messagesContainer={messagesContainer}
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
