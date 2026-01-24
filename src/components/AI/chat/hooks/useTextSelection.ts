import { useState, useEffect, useCallback, useRef } from "react";

interface SelectionState {
  text: string;
  position: { x: number; y: number } | null;
}

interface UseTextSelectionProps {
  containerRef: React.RefObject<HTMLElement | null>;
  minLength?: number;
}

export const useTextSelection = ({
  containerRef,
  minLength = 10,
}: UseTextSelectionProps) => {
  const [selection, setSelection] = useState<SelectionState>({
    text: "",
    position: null,
  });

  const isSelectingRef = useRef(false);
  const timeoutRef = useRef<number | null>(null);

  const clearSelection = useCallback(() => {
    setSelection({ text: "", position: null });
  }, []);

  const checkSelection = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const windowSelection = window.getSelection();
    if (
      !windowSelection ||
      windowSelection.rangeCount === 0 ||
      windowSelection.isCollapsed
    ) {
      setSelection({ text: "", position: null });
      return;
    }

    const selectedText = windowSelection.toString().trim();
    if (selectedText.length < minLength) {
      setSelection({ text: "", position: null });
      return;
    }

    const range = windowSelection.getRangeAt(0);
    const commonAncestor = range.commonAncestorContainer;
    const ancestorElement =
      commonAncestor.nodeType === Node.TEXT_NODE
        ? commonAncestor.parentElement
        : (commonAncestor as HTMLElement);

    if (!ancestorElement || !container.contains(ancestorElement)) {
      setSelection({ text: "", position: null });
      return;
    }

    const messageElement = ancestorElement.closest("[data-message-content]");
    if (!messageElement) {
      setSelection({ text: "", position: null });
      return;
    }

    const rect = range.getBoundingClientRect();

    if (rect.top < 0 || rect.bottom > window.innerHeight) {
      setSelection({ text: "", position: null });
      return;
    }

    setSelection({
      text: selectedText,
      position: {
        x: rect.left + rect.width / 2,
        y: rect.top - 8,
      },
    });
  }, [containerRef, minLength]);

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("[data-selection-popover]")) return;

      isSelectingRef.current = true;
      setSelection({ text: "", position: null });
    };

    const handleMouseUp = () => {
      isSelectingRef.current = false;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(checkSelection, 10);
    };

    const handleSelectionChange = () => {
      if (isSelectingRef.current) return;

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(checkSelection, 100);
    };

    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("selectionchange", handleSelectionChange);

    const handleScroll = () => {
      if (selection.text) clearSelection();
    };
    window.addEventListener("scroll", handleScroll, { capture: true });

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("selectionchange", handleSelectionChange);
      window.removeEventListener("scroll", handleScroll, { capture: true });
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [checkSelection, selection.text, clearSelection]);

  return {
    selectedText: selection.text,
    selectionPosition: selection.position,
    clearSelection,
  };
};
