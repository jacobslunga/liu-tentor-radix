// src/components/AiChatDialog.tsx
import { FC, useState, useEffect, useRef, useContext } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Sparkles,
  Loader2,
  AlertTriangle,
  SquareLibrary,
  ArrowUp,
  User,
  Copy,
  Check,
  ArrowDown,
} from "lucide-react";
import { supabase } from "@/supabase/supabaseClient";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { ShowAiDialogContext } from "@/context/ShowAiDialogContext";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface AiChatDialogProps {
  examId: number | undefined;
  facitId: number | undefined;
  triggerButton?: React.ReactNode;
}

interface ChatMessage {
  role: "user" | "model";
  text: string;
}

const AiChatDialog: FC<AiChatDialogProps> = ({
  examId,
  facitId,
  triggerButton,
}) => {
  const { showAiDialog: open, setShowAiDialog: setOpen } =
    useContext(ShowAiDialogContext);
  const [promptInput, setPromptInput] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isSendingPrompt, setIsSendingPrompt] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const [hoveredMessageIndex, setHoveredMessageIndex] = useState<number | null>(
    null
  );

  const [examDocId, setExamDocId] = useState<number | null>(null);
  const [facitDocId, setFacitDocId] = useState<number | null>(null);
  const [isFetchingDocIds, setIsFetchingDocIds] = useState(false);
  const [fetchDocIdsError, setFetchDocIdsError] = useState<string | null>(null);

  const [aiResponseLoading, setAiResponseLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  const [isAtBottom, setIsAtBottom] = useState(true); // Ny state

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const fetchDocumentIds = async () => {
      if (!examId || !facitId) {
        setFetchDocIdsError("Saknar ID för tenta eller facit.");
        setExamDocId(null);
        setFacitDocId(null);
        return;
      }

      setIsFetchingDocIds(true);
      setFetchDocIdsError(null);

      try {
        const [examRes, facitRes] = await Promise.all([
          supabase
            .from("tentor")
            .select("document_id")
            .eq("id", examId)
            .single(),
          supabase
            .from("tentor")
            .select("document_id")
            .eq("id", facitId)
            .single(),
        ]);

        if (examRes.error) throw new Error(`Tenta: ${examRes.error.message}`);
        if (!examRes.data?.document_id)
          throw new Error(
            `Kunde inte hitta dokument-ID för tentan (ID: ${examId})`
          );
        setExamDocId(examRes.data.document_id);

        if (facitRes.error) throw new Error(`Facit: ${facitRes.error.message}`);
        if (!facitRes.data?.document_id)
          throw new Error(
            `Kunde inte hitta dokument-ID för facit (ID: ${facitId})`
          );
        setFacitDocId(facitRes.data.document_id);
      } catch (error: any) {
        console.error("Error fetching document IDs:", error);
        setFetchDocIdsError(error.message || "Kunde inte hämta dokument-IDn.");
      } finally {
        setIsFetchingDocIds(false);
      }
    };

    fetchDocumentIds();
  }, [examId, facitId]);

  useEffect(() => {
    // Scrolla ner när dialogen öppnas och när 'open' ändras
    if (open && chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [open]);

  useEffect(() => {
    // Scrolla ner när chatthistoriken eller AI-svaret ändras
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory, aiResponseLoading]);

  useEffect(() => {
    const chatContainer = chatContainerRef.current;

    if (chatContainer) {
      const handleScroll = () => {
        const isBottom =
          Math.abs(
            chatContainer.scrollHeight -
              chatContainer.scrollTop -
              chatContainer.clientHeight
          ) <= 1;
        setIsAtBottom(isBottom);
      };

      chatContainer.addEventListener("scroll", handleScroll);

      // Initial kolla vid mount
      handleScroll();

      return () => {
        chatContainer.removeEventListener("scroll", handleScroll);
      };
    }
  }, []);

  const canChat =
    examDocId !== null &&
    facitDocId !== null &&
    !isFetchingDocIds &&
    !fetchDocIdsError;

  const suggestedPrompts = [
    `Förklara uppgift 1`,
    `Sammanfatta lösningen för uppgift 3`,
    `Ge mig nyckelkoncepten från tentan`,
  ];

  const handleSuggestionClick = (suggestion: string) => {
    setPromptInput(suggestion);
    handleSendPrompt(suggestion); // Skicka prompt direkt
  };

  const handleSendPrompt = async (promptOverride?: string) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    const promptToSend = promptOverride || promptInput;

    if (!promptToSend.trim() || !canChat) return;

    const currentPrompt = promptToSend;
    setPromptInput("");
    setIsSendingPrompt(true);
    setAiResponseLoading(true);
    setAiResponse("");

    const userMessage: ChatMessage = { role: "user", text: currentPrompt };
    const updatedHistory = [...chatHistory, userMessage];
    setChatHistory(updatedHistory);

    try {
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          exam_id: examDocId,
          facit_id: facitDocId,
          question: `${currentPrompt}.`,
          chat_history: updatedHistory,
        }),
        signal,
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(
          `Network response was not ok: ${response.status} ${response.statusText} - ${errorBody}`
        );
      }
      if (!response.body) throw new Error("Response body is missing");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let partialResponse = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        partialResponse += chunk;
        setAiResponse(() => {
          if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop =
              chatContainerRef.current.scrollHeight;
          }
          return partialResponse;
        });
      }

      const modelMessage: ChatMessage = {
        role: "model",
        text: partialResponse,
      };
      const finalHistory = [...updatedHistory, modelMessage];
      setChatHistory(finalHistory);
    } catch (err: any) {
      if (err.name !== "AbortError") {
        console.error("Chat fetch error:", err);
        setChatError(err.message || "Failed to fetch response.");
      }
    } finally {
      setIsSendingPrompt(false);
      setAiResponseLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendPrompt();
    }
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast("Kopierat till urklipp!", {
      description: "Meddelandet är nu redo att klistras in.",
      icon: <Check className="w-5 h-5 text-primary" />,
    });
  };

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild disabled={isFetchingDocIds || !!fetchDocIdsError}>
        {triggerButton ? (
          triggerButton
        ) : (
          <Button
            variant="ai-outline"
            disabled={isFetchingDocIds || !!fetchDocIdsError}
            size="sm"
          >
            {isFetchingDocIds ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : fetchDocIdsError ? (
              <AlertTriangle className="h-4 w-4 text-destructive" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            AI Assistent
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-5xl h-[95vh] p-0 flex flex-col overflow-hidden">
        <div
          className="flex-grow overflow-y-auto relative bg-gradient-to-b from-background to-background/0"
          ref={chatContainerRef}
        >
          <div className="relative h-full">
            {isFetchingDocIds && (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            )}
            {fetchDocIdsError && !isFetchingDocIds && (
              <div className="flex flex-col items-center justify-center h-full text-center text-destructive">
                <AlertTriangle className="w-12 h-12 mb-4" />
                <p className="font-semibold">Kunde inte ladda AI Assistenten</p>
                <p className="text-sm">{fetchDocIdsError}</p>
              </div>
            )}
            {canChat && chatHistory.length === 0 && !isSendingPrompt && (
              <div className="flex flex-col items-center justify-center h-full">
                {/* Logotyp */}
                <div className="mb-4 flex flex-row items-center justify-center space-x-2 absolute top-10">
                  {/* Ersätt med din faktiska logotyp och sökväg */}
                  <SquareLibrary className="w-7 h-7 text-primary" />
                  <span className="font-mono font-bold text-lg text-foreground">
                    AI Assistenten
                  </span>
                </div>
                <div className="text-center">
                  <h1 className="font-medium text-lg sm:text-xl mb-4">
                    Hej! Hur kan jag hjälpa dig idag?
                  </h1>
                  <p className="text-muted-foreground mb-6">
                    Välj ett förslag eller ställ en egen fråga nedan.
                  </p>
                  <div className="flex flex-row items-center justify-center space-x-2">
                    {suggestedPrompts.map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => handleSuggestionClick(suggestion)}
                        disabled={!canChat || isSendingPrompt}
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {canChat && chatHistory.length > 0 && (
              <div className="bg-background pb-20">
                {chatHistory.map((message, index) => (
                  <div
                    key={index}
                    className={`chat-message ${
                      message.role === "user"
                        ? "from-user bg-secondary"
                        : `from-model bg-background border-t border-t-foreground/15 ${
                            index === chatHistory.length - 1
                              ? "border-b-transparent"
                              : "border-b-foreground/15"
                          } border-b`
                    } flex items-start p-2 sm:p-6`}
                    onMouseEnter={() => setHoveredMessageIndex(index)}
                    onMouseLeave={() => setHoveredMessageIndex(null)}
                  >
                    <div className="mr-3 bg-foreground/5 rounded-full p-2 sticky top-2">
                      {message.role === "user" ? (
                        <User className="w-5 h-5 text-foreground/60" />
                      ) : (
                        <SquareLibrary className="w-5 h-5 text-primary" />
                      )}
                    </div>

                    <div className="flex-1 relative">
                      <div
                        className={`rounded-lg bg-transparent text-sm p-3 ${
                          message.role === "user"
                            ? "text-foreground"
                            : "text-secondary-foreground"
                        }`}
                        style={{ whiteSpace: "pre-wrap" }}
                      >
                        <ReactMarkdown
                          remarkPlugins={[remarkMath]}
                          rehypePlugins={[rehypeKatex]}
                          components={{
                            p: ({ children }) => (
                              <p style={{ margin: "0.2em 0" }}>{children}</p>
                            ),
                            ul: ({ children }) => (
                              <ul style={{ paddingLeft: "1em" }}>{children}</ul>
                            ),
                            li: ({ children }) => (
                              <li style={{ margin: "0.1em 0" }}>{children}</li>
                            ),
                          }}
                        >
                          {message.text}
                        </ReactMarkdown>
                        {message.role === "model" &&
                          isSendingPrompt &&
                          index === chatHistory.length - 1 && (
                            <span className="inline-block w-2 h-4 bg-foreground animate-pulse ml-1"></span>
                          )}

                        <motion.button
                          className={cn(
                            "absolute top-2 right-2 bg-foreground/10 rounded-full p-1 transition-opacity duration-200",
                            hoveredMessageIndex === index
                              ? "opacity-70 hover:opacity-100"
                              : "opacity-0"
                          )}
                          onClick={() => handleCopyToClipboard(message.text)}
                          initial={{ x: 20 }}
                          animate={{ x: 0 }}
                          exit={{ x: 20 }}
                        >
                          <Copy className="h-5 w-5" />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                ))}
                {aiResponseLoading && (
                  <div className="chat-message from-model bg-background flex items-start p-2 sm:p-6">
                    <div className="mr-3 bg-foreground/5 rounded-full p-2 sticky top-2">
                      <SquareLibrary className="w-5 h-5 text-primary" />
                    </div>

                    <div className="flex-1 relative">
                      <div
                        className="rounded-lg p-3 bg-background text-sm text-secondary-foreground"
                        style={{ whiteSpace: "pre-wrap" }}
                      >
                        <ReactMarkdown
                          remarkPlugins={[remarkMath]}
                          rehypePlugins={[rehypeKatex]}
                          components={{
                            p: ({ children }) => (
                              <p style={{ margin: "0.2em 0" }}>{children}</p>
                            ),
                            ul: ({ children }) => (
                              <ul style={{ paddingLeft: "1em" }}>{children}</ul>
                            ),
                            li: ({ children }) => (
                              <li style={{ margin: "0.1em 0" }}>{children}</li>
                            ),
                          }}
                        >
                          {aiResponse}
                        </ReactMarkdown>
                        <span className="inline-block w-2 h-4 bg-foreground ml-1"></span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} className="mb-20" />
              </div>
            )}
            {chatError && (
              <p className="text-red-600 text-sm">Chat Error: {chatError}</p>
            )}
          </div>
        </div>

        {/* Scroll to Bottom Button with Animation */}
        <AnimatePresence>
          {!isAtBottom && (
            <motion.div
              className="absolute bottom-28 left-0 w-full flex justify-center"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.2, ease: "easeInOut" },
                },
                hover: { transition: { duration: 0.1, ease: "easeInOut" } },
              }}
              initial="hidden"
              animate="visible"
              exit="hidden"
              key="scrollToBottomContainer"
            >
              <motion.button
                onClick={scrollToBottom}
                className="bg-background hover:bg-secondary border transition-colors duration-200 text-secondary-foreground rounded-full p-2 shadow"
              >
                <ArrowDown className="h-4 w-4" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col space-y-2 w-full p-4 absolute bottom-5">
          <div className="flex items-center justify-center gap-2 w-full">
            <p className="text-[10px] text-muted-foreground text-center absolute bottom-[-10px] rounded-xl bg-background/90 backdrop-blur-sm">
              Observera: AI-assistenten kan ge felaktiga eller missvisande svar.
              Dubbelkolla alltid informationen.
            </p>
            <Textarea
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                canChat ? "Ställ din fråga här..." : "AI ej tillgänglig..."
              }
              className="flex-grow max-w-2xl resize-none text-sm sm:text-base bg-background/90 backdrop-blur-sm"
              rows={2}
              disabled={!canChat || isSendingPrompt}
            />
            <Button
              onClick={() => handleSendPrompt()}
              disabled={!promptInput.trim() || isSendingPrompt || !canChat}
              variant="ai-outline"
              size="icon"
            >
              {isSendingPrompt ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ArrowUp className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AiChatDialog;
