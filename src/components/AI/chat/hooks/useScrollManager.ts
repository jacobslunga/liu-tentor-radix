import { useState, useEffect, useRef, useCallback } from "react";

interface UseScrollManagerProps {
  isOpen: boolean;
}

interface UseScrollManagerReturn {
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  messagesContainerRef: React.RefObject<HTMLDivElement | null>;
  showScrollButton: boolean;
  scrollToBottom: (behavior?: ScrollBehavior) => void;
  isUserScrollingRef: React.RefObject<boolean>;
}

export const useScrollManager = ({
  isOpen,
}: UseScrollManagerProps): UseScrollManagerReturn => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const isUserScrollingRef = useRef(false);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    setShowScrollButton(false);
    messagesEndRef.current?.scrollIntoView({ behavior });
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const container = messagesContainerRef.current;
    if (!container) return;

    let lastScrollTop = container.scrollTop;

    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
      const nearBottom = distanceFromBottom < 100;

      if (scrollTop < lastScrollTop) {
        isUserScrollingRef.current = true;
      } else if (nearBottom) {
        isUserScrollingRef.current = false;
      }

      lastScrollTop = scrollTop;
      setShowScrollButton(!nearBottom);
    };

    onScroll();
    container.addEventListener("scroll", onScroll, { passive: true });

    return () => container.removeEventListener("scroll", onScroll);
  }, [isOpen]);

  return {
    messagesEndRef,
    messagesContainerRef,
    showScrollButton,
    scrollToBottom,
    isUserScrollingRef,
  };
};
