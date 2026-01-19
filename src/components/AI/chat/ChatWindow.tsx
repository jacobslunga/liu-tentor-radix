import { FC, useState, useEffect, useCallback, useRef, useMemo } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslation";
import { useLanguage } from "@/context/LanguageContext";
import { ExamWithSolutions } from "@/types/exam";
import {
  useChatMessages,
  useResizablePanel,
  useScrollManager,
  useTextSelection,
} from "./hooks";
import { ChatHeader } from "./components/ChatHeader";
import { SelectionPopover } from "./components/SelectionPopover";
import { EmptyState } from "./components/EmptyState";
import { MessageList } from "./components/MessageList";
import { ChatInput, ChatInputHandle } from "./components/ChatInput";
import { ResizeHandle } from "./components/ResizeHandle";
import { Loader2 } from "lucide-react";

interface ChatWindowProps {
  examDetail: ExamWithSolutions;
  isOpen: boolean;
  onClose: () => void;
  variant?: "overlay" | "push";
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

  const [side, setSide] = useState<"left" | "right">("right");
  const [isSideLoaded, setIsSideLoaded] = useState(false);

  useEffect(() => {
    const savedSide = localStorage.getItem(SIDE_STORAGE_KEY) as
      | "left"
      | "right"
      | null;
    if (savedSide) setSide(savedSide);
    setIsSideLoaded(true);
  }, []);

  const toggleSide = useCallback(() => {
    const newSide = side === "right" ? "left" : "right";
    setSide(newSide);
    localStorage.setItem(SIDE_STORAGE_KEY, newSide);
  }, [side]);

  const { width, isResizing, startResizing } = useResizablePanel(35, side);

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

  const [selectedModelId, setSelectedModelId] =
    useState<string>("gemini-2.5-flash");

  const [isDraftLoaded, setIsDraftLoaded] = useState(false);
  const [isMessageListReady, setIsMessageListReady] = useState(false);
  const [quotedContext, setQuotedContext] = useState("");

  const lastScrollPosition = useRef<number | null>(null);

  const { selectedText, selectionPosition, clearSelection } = useTextSelection({
    containerRef: messagesContainerRef,
    minLength: 10,
  });

  const handleAskAboutSelection = useCallback(() => {
    setQuotedContext(selectedText);
    clearSelection();
    window.getSelection()?.removeAllRanges();
  }, [selectedText, clearSelection]);

  const handleClearQuotedContext = useCallback(() => {
    setQuotedContext("");
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

    const messageToSend = quotedContext
      ? `Regarding this: "${quotedContext}"\n\n${input}`
      : input;

    sendMessage(messageToSend, giveDirectAnswer, selectedModelId);

    setInput("");
    setQuotedContext("");
    localStorage.removeItem(STORAGE_KEY);
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

  const handleScrollToBottom = useCallback(() => {
    isUserScrollingRef.current = false;
    scrollToBottom("smooth");
  }, [scrollToBottom, isUserScrollingRef]);

  const handleCancel = useCallback(() => {
    const cancelledMessage = cancelGeneration();
    if (cancelledMessage) {
      setInput(cancelledMessage);
      chatInputRef.current?.focus();
    }
  }, [cancelGeneration]);

  const hasSolutions = examDetail.solutions.length > 0;
  const isOverlay = variant === "overlay";

  // --- Adjusted Parent Variants for Direction ---
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
      // Logic for sliding in/out based on side
      const xHidden = side === "right" ? "100%" : "-100%";
      return {
        hidden: { x: xHidden },
        visible: { x: "0%", transition: enterSettings },
        exit: { x: xHidden, transition: exitSettings },
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
  }, [isOverlay, width, isResizing, side]); // Added side dependency

  if (!isSideLoaded) return null; // Avoid hydration mismatch or jumping

  // Calculate CSS classes based on side
  const positionClasses = isOverlay
    ? side === "right"
      ? "fixed right-0 top-0 h-full shadow-xl"
      : "fixed left-0 top-0 h-full shadow-xl"
    : `relative h-full ${side === "left" ? "order-first border-r border-l-0" : "border-l"}`;
  // ^ Important: In 'push' mode, we use order-first to move it to the visual left

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          ref={chatWindowRef}
          key={`chat-window-${side}`} // Key change triggers clean animation when side switches
          variants={parentVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className={`
            bg-transparent flex flex-col z-50
            ${positionClasses}
          `}
          style={{
            width: isOverlay ? `${width}%` : undefined,
            willChange: isResizing ? "width" : "auto",
            contain: isResizing ? "layout style" : "none",
          }}
        >
          <ResizeHandle
            onStartResize={startResizing}
            isResizing={isResizing}
            side={side} // Pass side
          />

          <div
            className={`flex-1 flex flex-col overflow-hidden bg-background h-full w-full ${!isOverlay ? "" : "border-l"}`}
          >
            <motion.div variants={contentVariants}>
              <ChatHeader
                language={language}
                hasSolutions={hasSolutions}
                onClose={handleClose}
                side={side} // Pass side
                onToggleSide={toggleSide} // Pass toggle
              />
            </motion.div>

            {messages.length === 0 && (
              <EmptyState language={language} hasSolutions={hasSolutions} />
            )}

            {/* Rest of the component remains exactly the same */}
            <div className="flex-1 relative min-h-0">
              <motion.div
                variants={contentVariants}
                ref={messagesContainerRef}
                className="absolute inset-0 overflow-y-auto"
              >
                <div className="p-4 pb-48 space-y-4 relative">
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

                  <SelectionPopover
                    show={!!selectedText}
                    position={selectionPosition}
                    language={language}
                    onAskAbout={handleAskAboutSelection}
                  />
                </div>
              </motion.div>

              <motion.div
                variants={contentVariants}
                className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-background via-background to-transparent pt-8"
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
                    onScrollToBottom={handleScrollToBottom}
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
