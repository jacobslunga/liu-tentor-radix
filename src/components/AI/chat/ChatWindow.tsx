import {
  FC,
  useState,
  useEffect,
  useCallback,
  useRef,
  startTransition,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslation";
import { useLanguage } from "@/context/LanguageContext";
import { VirtuosoHandle } from "react-virtuoso";
import type { ExamDetailPayload } from "@/api";
import { useResizablePanel, useTextSelection } from "./hooks";
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
  variant?: "overlay" | "push";
}

const STORAGE_KEY = "chat_input_draft";
const MODEL_STORAGE_KEY = "chat_model_id_preference";
const SIDE_STORAGE_KEY = "chat_window_side_preference";

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
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const virtuosoRef = useRef<VirtuosoHandle>(null);

  const [side, setSide] = useState<"left" | "right">("right");
  const [isSideLoaded, setIsSideLoaded] = useState(false);

  // keep-alive states
  const [hasBeenOpened, setHasBeenOpened] = useState(false);
  const [isReadyToRender, setIsReadyToRender] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const { messages, isLoading, sendMessage, cancelGeneration } = useChatState();
  const { width, isResizing, startResizing } = useResizablePanel();

  const { selectedText, selectionPosition, clearSelection } = useTextSelection({
    containerRef: messagesContainerRef,
    minLength: 10,
  });

  const [input, setInput] = useState("");
  const [giveDirectAnswer, setGiveDirectAnswer] = useState(true);
  const [selectedModelId, setSelectedModelId] =
    useState<string>("gemini-2.5-flash");
  const [isDraftLoaded, setIsDraftLoaded] = useState(false);
  const [quotedContext, setQuotedContext] = useState("");

  useEffect(() => {
    if (isOpen && !hasBeenOpened) {
      setHasBeenOpened(true);
    }
  }, [isOpen, hasBeenOpened]);

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

  const toggleSide = useCallback(() => {
    const newSide = side === "right" ? "left" : "right";
    setSide(newSide);
    localStorage.setItem(SIDE_STORAGE_KEY, newSide);
  }, [side]);

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

  const handleScrollToBottom = useCallback(() => {
    virtuosoRef.current?.scrollTo({
      top: Number.MAX_SAFE_INTEGER,
      behavior: "smooth",
    });
  }, []);

  const handleSend = useCallback(() => {
    if (!input.trim() || isLoading) return;
    const messageToSend = quotedContext
      ? `Regarding this: "${quotedContext}"\n\n${input}`
      : input;
    sendMessage(messageToSend, giveDirectAnswer, selectedModelId);
    setInput("");
    setQuotedContext("");
    localStorage.removeItem(STORAGE_KEY);
    requestAnimationFrame(() => handleScrollToBottom());
  }, [
    input,
    isLoading,
    giveDirectAnswer,
    selectedModelId,
    quotedContext,
    sendMessage,
    handleScrollToBottom,
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

  const hasSolution = examDetail.solution !== null;
  const isOverlay = variant === "overlay";

  const handleScrollChange = useCallback((isAtBottom: boolean) => {
    setShowScrollButton(!isAtBottom);
  }, []);

  const handleTransitionEnd = useCallback(
    (e: React.TransitionEvent) => {
      if (e.propertyName !== "transform" || e.target !== chatWindowRef.current)
        return;

      if (isOpen) {
        if (!isReadyToRender) {
          startTransition(() => {
            setIsReadyToRender(true);
          });
        }
        chatInputRef.current?.focus();
      }
    },
    [isOpen, isReadyToRender],
  );

  if (!isSideLoaded) return null;

  const transform = isOpen
    ? "translateX(0%)"
    : side === "right"
      ? "translateX(100%)"
      : "translateX(-100%)";
  const positionClasses = isOverlay
    ? side === "right"
      ? "fixed right-0 top-0 h-full shadow-xl"
      : "fixed left-0 top-0 h-full shadow-xl"
    : `relative h-full ${side === "left" ? "order-first border-r border-l-0" : "border-l"}`;

  return (
    <div
      ref={chatWindowRef}
      onTransitionEnd={handleTransitionEnd}
      className={`bg-transparent flex flex-col z-50 transition-transform duration-250 cubic-bezier(0.16, 1, 0.3, 1) ${positionClasses}`}
      style={{
        width: `${width}%`,
        transform,
        willChange: "transform, width",
        visibility: isOpen || hasBeenOpened ? "visible" : "hidden",
        pointerEvents: isOpen ? "auto" : "none",
      }}
    >
      <ResizeHandle
        onStartResize={startResizing}
        isResizing={isResizing}
        side={side}
      />

      <div
        className={`flex-1 flex flex-col overflow-hidden bg-background h-full w-full ${!isOverlay ? "" : "border-l"}`}
      >
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex-1 flex flex-col min-h-0 relative"
            >
              <ChatHeader
                language={language}
                hasSolution={hasSolution}
                onClose={handleClose}
                side={side}
                onToggleSide={toggleSide}
              />

              <div className="flex-1 relative min-h-0 flex flex-col">
                <div
                  ref={messagesContainerRef}
                  className="absolute inset-0"
                  style={{ contain: "strict" }}
                >
                  {isReadyToRender ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="h-full w-full"
                    >
                      {messages.length === 0 ? (
                        <EmptyState language={language} />
                      ) : (
                        <MessageList
                          messages={messages}
                          isLoading={isLoading}
                          language={language}
                          virtuosoRef={virtuosoRef}
                          onScroll={handleScrollChange}
                        />
                      )}
                    </motion.div>
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                    </div>
                  )}
                </div>

                <SelectionPopover
                  show={!!selectedText}
                  position={selectionPosition}
                  language={language}
                  onAskAbout={handleAskAboutSelection}
                />

                <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-background via-background to-transparent pt-8 z-10">
                  {isDraftLoaded && isReadyToRender && (
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
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ChatWindow;
