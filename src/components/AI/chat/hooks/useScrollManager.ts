import { useState, useEffect, useRef, useCallback } from "react";

interface UseScrollManagerProps {
  isOpen: boolean;
  assistantMessageRefs: React.RefObject<(HTMLDivElement | null)[]>;
  onVisibleIndexChange?: (index: number) => void;
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
  assistantMessageRefs,
  onVisibleIndexChange,
}: UseScrollManagerProps): UseScrollManagerReturn => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const isUserScrollingRef = useRef(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [visibleAssistantIndex, setVisibleAssistantIndex] = useState(-1);

  const lastUpdateTimeRef = useRef(0);
  const pendingUpdateRef = useRef<number | null>(null);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  }, []);

  const updateVisibleIndex = useCallback(() => {
    const now = Date.now();
    const timeSinceLastUpdate = now - lastUpdateTimeRef.current;

    if (timeSinceLastUpdate < 150) {
      if (pendingUpdateRef.current === null) {
        pendingUpdateRef.current = window.setTimeout(() => {
          pendingUpdateRef.current = null;
          updateVisibleIndex();
        }, 150 - timeSinceLastUpdate);
      }
      return;
    }

    lastUpdateTimeRef.current = now;

    if (!assistantMessageRefs.current || !messagesContainerRef.current) return;

    const container = messagesContainerRef.current;
    const containerRect = container.getBoundingClientRect();
    const headerOffset = 70;

    const assistantRefs = assistantMessageRefs.current
      .map((ref, idx) => ({ ref, idx }))
      .filter(({ ref }) => ref !== null);

    if (assistantRefs.length === 0) return;

    let bestIndex = 0;

    for (let i = 0; i < assistantRefs.length; i++) {
      const ref = assistantRefs[i].ref;
      if (!ref) continue;

      const rect = ref.getBoundingClientRect();
      if (rect.top <= containerRect.top + headerOffset + 50) {
        bestIndex = i;
      } else {
        break;
      }
    }

    if (bestIndex !== visibleAssistantIndex) {
      setVisibleAssistantIndex(bestIndex);
      onVisibleIndexChange?.(bestIndex);
    }
  }, [assistantMessageRefs, visibleAssistantIndex, onVisibleIndexChange]);

  useEffect(() => {
    if (!isOpen) return;

    const container = messagesContainerRef.current;
    if (!container) return;

    let lastScrollTop = container.scrollTop;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
      const isNearBottom = distanceFromBottom < 100;

      if (scrollTop < lastScrollTop) {
        isUserScrollingRef.current = true;
      } else if (isNearBottom) {
        isUserScrollingRef.current = false;
      }

      lastScrollTop = scrollTop;
      setShowScrollButton(!isNearBottom);

      updateVisibleIndex();
    };

    handleScroll();
    container.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      container.removeEventListener("scroll", handleScroll);
      if (pendingUpdateRef.current !== null) {
        clearTimeout(pendingUpdateRef.current);
      }
    };
  }, [isOpen, updateVisibleIndex]);

  return {
    messagesEndRef,
    messagesContainerRef,
    showScrollButton,
    scrollToBottom,
    isUserScrollingRef,
  };
};
