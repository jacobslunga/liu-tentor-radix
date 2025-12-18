import { useState, useRef, useCallback, useEffect } from "react";
import { Message } from "../types";
import { CHAT_API_URL, STREAM_UPDATE_INTERVAL } from "../constants";

interface UseChatMessagesProps {
  examId: string | number;
  initialMessages?: Message[];
}

interface UseChatMessagesReturn {
  messages: Message[];
  isLoading: boolean;
  sendMessage: (content: string, giveDirectAnswer: boolean) => Promise<void>;
  cancelGeneration: () => void;
  assistantMessageRefs: React.RefObject<(HTMLDivElement | null)[]>;
  currentAssistantIndex: number;
  setCurrentAssistantIndex: React.Dispatch<React.SetStateAction<number>>;
  navigateToAssistantMessage: (
    direction: "up" | "down",
    targetIndex?: number
  ) => void;
}

// Demo messages for linear algebra (extended, markdown answers)
// const DEMO_MESSAGES: Message[] = [
//   {
//     role: "user",
//     content: "What is a vector space?",
//   },
//   {
//     role: "assistant",
//     content: `
// ### Vector Space

// A **vector space** is a set \\(V\\) together with two operations:

// - **Vector addition**: \\(V \\times V \\to V\\)
// - **Scalar multiplication**: \\(\\mathbb{F} \\times V \\to V\\), where \\(\\mathbb{F}\\) is a field (usually \\(\\mathbb{R}\\) or \\(\\mathbb{C}\\))

// These operations must satisfy **eight axioms**, including:

// 1. Closure under addition and scalar multiplication
// 2. Associativity and commutativity of addition
// 3. Existence of a zero vector \\(\\mathbf{0}\\)
// 4. Existence of additive inverses
// 5. Distributive properties

// #### Examples
// - \\(\\mathbb{R}^n\\) with usual addition and scalar multiplication
// - The set of all polynomials of degree \\(\\le n\\)
// - The set of all continuous functions on an interval

// Vector spaces provide the foundational language for linear algebra and many applied fields such as physics, machine learning, and engineering.
// `,
//   },
//   {
//     role: "user",
//     content: "Explain linear independence with an example.",
//   },
//   {
//     role: "assistant",
//     content: `
// ### Linear Independence

// A set of vectors \\(\\{v_1, v_2, \\dots, v_k\\}\\) is **linearly independent** if the equation

// \\[
// a_1 v_1 + a_2 v_2 + \\dots + a_k v_k = 0
// \\]

// has **only the trivial solution**:

// \\[
// a_1 = a_2 = \\dots = a_k = 0
// \\]

// #### Example (Independent)
// The vectors
// \\[
// (1,0), (0,1)
// \\]
// in \\(\\mathbb{R}^2\\) are linearly independent because neither vector can be written as a multiple of the other.

// #### Example (Dependent)
// The vectors
// \\[
// (1,2), (2,4)
// \\]
// are linearly dependent since:
// \\[
// (2,4) = 2(1,2)
// \\]

// Linear independence is crucial for defining **bases** and **dimension**.
// `,
//   },
//   {
//     role: "user",
//     content: "What is a basis and how is it related to dimension?",
//   },
//   {
//     role: "assistant",
//     content: `
// ### Basis and Dimension

// A **basis** of a vector space \\(V\\) is a set of vectors that:

// 1. **Spans** the space (every vector in \\(V\\) can be written as a linear combination of them)
// 2. Is **linearly independent**

// #### Example
// A basis for \\(\\mathbb{R}^3\\) is:
// \\[
// \\{(1,0,0), (0,1,0), (0,0,1)\\}
// \\]

// #### Dimension
// The **dimension** of a vector space is the **number of vectors in any basis** of that space.

// - \\(\\dim(\\mathbb{R}^2) = 2\\)
// - \\(\\dim(P_3) = 4\\), where \\(P_3\\) is the space of polynomials of degree \\(\\le 3\\)

// > All bases of a vector space have the same number of vectors — this is a fundamental theorem of linear algebra.
// `,
//   },
//   {
//     role: "user",
//     content: "Explain matrix rank and its significance.",
//   },
//   {
//     role: "assistant",
//     content: `
// ### Rank of a Matrix

// The **rank** of a matrix is the dimension of its **column space** (or equivalently, its row space).

// #### Ways to Interpret Rank
// - Number of **linearly independent columns**
// - Number of **leading pivots** after row reduction
// - Dimension of the image of the linear transformation

// #### Example
// For the matrix:
// \\[
// A =
// \\begin{pmatrix}
// 1 & 2 \\\\
// 2 & 4
// \\end{pmatrix}
// \\]

// Row-reduction gives:
// \\[
// \\begin{pmatrix}
// 1 & 2 \\\\
// 0 & 0
// \\end{pmatrix}
// \\]

// So:
// \\[
// \\text{rank}(A) = 1
// \\]

// #### Why Rank Matters
// - Determines whether a system has **unique**, **infinitely many**, or **no solutions**
// - Used in the **Rank–Nullity Theorem**
// - Indicates whether a matrix is invertible
// `,
//   },
//   {
//     role: "user",
//     content: "State and explain the Rank–Nullity Theorem.",
//   },
//   {
//     role: "assistant",
//     content: `
// ### Rank–Nullity Theorem

// Let \\(T: V \\to W\\) be a linear transformation between finite-dimensional vector spaces. Then:

// \\[
// \\dim(V) = \\text{rank}(T) + \\text{nullity}(T)
// \\]

// Where:
// - **Rank** = dimension of the image (output space)
// - **Nullity** = dimension of the kernel (solutions to \\(T(v)=0\\))

// #### Interpretation
// Every vector in \\(V\\) either:
// - Contributes to the output (rank), or
// - Gets mapped to zero (nullity)

// #### Example
// If:
// - \\(\\dim(V) = 5\\)
// - \\(\\text{rank}(T) = 3\\)

// Then:
// \\[
// \\text{nullity}(T) = 2
// \\]

// This theorem is fundamental for understanding solution spaces of linear systems.
// `,
//   },
//   {
//     role: "user",
//     content: "What are eigenvalues and eigenvectors?",
//   },
//   {
//     role: "assistant",
//     content: `
// ### Eigenvalues and Eigenvectors

// For a square matrix \\(A\\), a nonzero vector \\(v\\) is an **eigenvector** if:

// \\[
// Av = \\lambda v
// \\]

// where \\(\\lambda\\) is a scalar called the **eigenvalue**.

// #### How to Find Eigenvalues
// Solve the **characteristic equation**:
// \\[
// \\det(A - \\lambda I) = 0
// \\]

// #### Example
// For:
// \\[
// A =
// \\begin{pmatrix}
// 2 & 0 \\\\
// 0 & 3
// \\end{pmatrix}
// \\]

// Eigenvalues are:
// - \\(\\lambda = 2\\)
// - \\(\\lambda = 3\\)

// Eigenvectors corresponding to \\(\\lambda = 2\\) lie along the x-axis, and those for \\(\\lambda = 3\\) along the y-axis.

// #### Why They Matter
// - Describe invariant directions of a transformation
// - Used in differential equations, PCA, quantum mechanics
// - Key to matrix diagonalization
// `,
//   },
// ];

export const useChatMessages = ({
  examId,
  initialMessages = [],
}: UseChatMessagesProps): UseChatMessagesReturn => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [currentAssistantIndex, setCurrentAssistantIndex] = useState(-1);

  const abortControllerRef = useRef<AbortController | null>(null);
  const assistantMessageRefs = useRef<(HTMLDivElement | null)[]>(
    []
  ) as React.RefObject<(HTMLDivElement | null)[]>;

  const messagesRef = useRef<Message[]>(initialMessages);
  const isLoadingRef = useRef<boolean>(false);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    isLoadingRef.current = isLoading;
  }, [isLoading]);

  const cancelGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setMessages((prev) => {
      const last = prev[prev.length - 1];
      if (last?.role === "assistant" && !last.content.trim()) {
        return prev.slice(0, -1);
      }
      return prev;
    });
    setIsLoading(false);
  }, []);

  const sendMessage = useCallback(
    async (content: string, giveDirectAnswer: boolean) => {
      if (!content.trim() || isLoadingRef.current) return;

      const userMessage: Message = { role: "user", content };

      const optimistic: Message[] = [
        ...messagesRef.current,
        userMessage,
        { role: "assistant" as "assistant", content: "" },
      ];
      setMessages(optimistic);
      messagesRef.current = optimistic;

      setIsLoading(true);
      isLoadingRef.current = true;

      abortControllerRef.current = new AbortController();

      try {
        const conversationHistory = [
          ...messagesRef.current.slice(0, -1),
          userMessage,
        ];

        const response = await fetch(`${CHAT_API_URL}/${examId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: conversationHistory.map((m) => ({
              role: m.role,
              content: m.content,
            })),
            giveDirectAnswer,
          }),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) throw new Error("Failed to get response");

        const reader = response.body?.getReader();
        if (!reader)
          throw new Error("Streaming not supported by server response");

        const decoder = new TextDecoder("utf-8");
        let assistantMessage = "";
        let lastUpdate = 0;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          assistantMessage += decoder.decode(value, { stream: true });

          const now = Date.now();
          if (now - lastUpdate >= STREAM_UPDATE_INTERVAL) {
            lastUpdate = now;
            const updated = [...messagesRef.current];
            updated[updated.length - 1] = {
              role: "assistant",
              content: assistantMessage,
            };
            setMessages(updated);
            messagesRef.current = updated;
          }
        }

        const finalText =
          assistantMessage.trim() === ""
            ? "Jag kunde inte generera ett svar. Försök igen."
            : assistantMessage;

        const finalUpdated = [...messagesRef.current];
        finalUpdated[finalUpdated.length - 1] = {
          role: "assistant",
          content: finalText,
        };
        setMessages(finalUpdated);
        messagesRef.current = finalUpdated;
      } catch (err: unknown) {
        const errorIsAbort = err instanceof Error && err.name === "AbortError";
        if (errorIsAbort) {
          return;
        }
        const updated = [...messagesRef.current];
        if (
          updated.length > 0 &&
          updated[updated.length - 1].role === "assistant"
        ) {
          updated[updated.length - 1] = {
            role: "assistant",
            content: "Något gick fel. Försök igen senare.",
          };
        }
        setMessages(updated);
        messagesRef.current = updated;
      } finally {
        abortControllerRef.current = null;
        setIsLoading(false);
        isLoadingRef.current = false;
      }
    },
    [examId]
  );

  const navigateToAssistantMessage = useCallback(
    (direction: "up" | "down", targetIndex?: number) => {
      const assistantIndices = messagesRef.current
        .map((m, i) => (m.role === "assistant" ? i : -1))
        .filter((i) => i !== -1);

      if (assistantIndices.length === 0) return;

      let newIndex: number;
      let messageIndex: number;

      if (typeof targetIndex === "number") {
        const pos = assistantIndices.indexOf(targetIndex);
        if (pos === -1) return;
        newIndex = pos;
        messageIndex = targetIndex;
      } else {
        if (direction === "up") {
          newIndex = currentAssistantIndex <= 0 ? 0 : currentAssistantIndex - 1;
        } else {
          newIndex =
            currentAssistantIndex >= assistantIndices.length - 1
              ? assistantIndices.length - 1
              : currentAssistantIndex + 1;
        }
        messageIndex = assistantIndices[newIndex];
      }

      setCurrentAssistantIndex(newIndex);

      const element = assistantMessageRefs.current[messageIndex];
      if (!element) return;

      const container = element.closest(".overflow-y-auto");
      if (container) {
        const headerOffset = 70;
        const offset = element.offsetTop - headerOffset;
        container.scrollTo({ top: offset, behavior: "smooth" });
      } else {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    },
    [currentAssistantIndex]
  );

  return {
    messages,
    isLoading,
    sendMessage,
    cancelGeneration,
    assistantMessageRefs,
    currentAssistantIndex,
    setCurrentAssistantIndex,
    navigateToAssistantMessage,
  };
};
