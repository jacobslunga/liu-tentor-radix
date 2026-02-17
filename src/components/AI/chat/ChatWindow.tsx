import { FC, useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslation";
import { useLanguage } from "@/context/LanguageContext";
import { ExamDetailPayload } from "@/api";
import { useTextSelection, useScrollManager } from "./hooks";
import { ChatHeader } from "./components/ChatHeader";
import { SelectionPopover } from "./components/SelectionPopover";
import { EmptyState } from "./components/EmptyState";
import { MessageList } from "./components/MessageList";
import { ChatInput, ChatInputHandle } from "./components/ChatInput";
import { Loader2 } from "lucide-react";
import { useChatState } from "@/hooks/useChatState";

interface ChatWindowProps {
  examDetail: ExamDetailPayload;
  isOpen: boolean;
  onClose: () => void;
}

const STORAGE_KEY = "chat_input_draft";
const MODEL_STORAGE_KEY = "chat_model_id_preference";

const modalVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", damping: 25, stiffness: 300 },
  },
  exit: {
    opacity: 0,
    y: 20,
    transition: { duration: 0.2 },
  },
};

const ChatWindow: FC<ChatWindowProps> = ({ examDetail, isOpen, onClose }) => {
  const { t } = useTranslation();
  const { language } = useLanguage();

  const chatInputRef = useRef<ChatInputHandle>(null);

  const {
    messagesEndRef,
    messagesContainerRef,
    showScrollButton,
    scrollToBottom,
    isUserScrollingRef,
  } = useScrollManager({ isOpen });

  const [shouldRenderMessages, setShouldRenderMessages] = useState(false);
  const { messages, isLoading, sendMessage, cancelGeneration } = useChatState();

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

  const handleSend = useCallback(() => {
    if (!input.trim() || isLoading) return;

    const messageToSend = quotedContext
      ? `Regarding this: "${quotedContext}"\n\n${input}`
      : input;

    sendMessage(messageToSend, giveDirectAnswer, selectedModelId);

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

  const handleAnimationComplete = (definition: string) => {
    if (definition === "visible") {
      setShouldRenderMessages(true);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onAnimationComplete={handleAnimationComplete}
          className="fixed inset-0 z-50 bg-background flex flex-col overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 z-40 bg-transparent">
            <ChatHeader
              language={language}
              hasSolution={hasSolutions}
              onClose={handleClose}
            />
          </div>

          {messages.length === 0 && <EmptyState language={language} />}

          <div className="flex-1 relative min-h-0">
            <div
              ref={messagesContainerRef}
              className="absolute inset-0 overflow-y-auto"
            >
              <div className="p-4 pt-16 pb-48 space-y-4 relative min-h-full">
                {shouldRenderMessages ? (
                  <MessageList
                    messages={messages}
                    isLoading={isLoading}
                    language={language}
                    messagesEndRef={messagesEndRef}
                    messagesContainerRef={messagesContainerRef}
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                  </div>
                )}
              </div>
            </div>

            <SelectionPopover
              show={!!selectedText}
              position={selectionPosition}
              language={language}
              onAskAbout={handleAskAboutSelection}
            />

            <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-background via-background to-transparent pt-8 z-10 px-4 pb-4">
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
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatWindow;
