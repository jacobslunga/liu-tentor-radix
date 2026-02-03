import { useRef, useCallback, useState, useEffect } from "react";

interface UseScrollManagerProps {
  isOpen: boolean;
}

export const useScrollManager = ({ isOpen }: UseScrollManagerProps) => {
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const isUserScrollingRef = useRef(false);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "auto") => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: Number.MAX_SAFE_INTEGER, // Ensure we hit the absolute bottom
        behavior,
      });
    }
  }, []);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

      // If user is reasonably close to bottom (e.g., 100px), we consider them "at bottom"
      // and not scrolling manually for history.
      const isAtBottom = distanceFromBottom < 100;

      setShowScrollButton(!isAtBottom);
      isUserScrollingRef.current = !isAtBottom;
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [isOpen]);

  // Reset scroll when opening
  useEffect(() => {
    if (isOpen) {
      // Small delay to ensure content is rendered
      requestAnimationFrame(() => {
        scrollToBottom("auto");
      });
    }
  }, [isOpen, scrollToBottom]);

  return {
    messagesEndRef,
    messagesContainerRef,
    showScrollButton,
    scrollToBottom,
    isUserScrollingRef,
  };
};
