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

    if (!ancestorElement) {
      setSelection({ text: "", position: null });
      return;
    }

    // Must be inside the container
    if (!container.contains(ancestorElement)) {
      setSelection({ text: "", position: null });
      return;
    }

    // Check if selection is within an assistant message (prose class)
    const proseElement = ancestorElement.closest(".prose");
    if (!proseElement) {
      setSelection({ text: "", position: null });
      return;
    }

    // Get position in viewport coordinates
    const rect = range.getBoundingClientRect();

    // Position the button slightly above the selection, centered horizontally
    setSelection({
      text: selectedText,
      position: {
        x: rect.left + rect.width / 2,
        y: rect.top - 8,
      },
    });
  }, [containerRef, minLength]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseUp = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = window.setTimeout(() => {
        checkSelection();
      }, 10);
    };

    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("[data-selection-popover]")) {
        return;
      }
      setSelection({ text: "", position: null });
    };

    container.addEventListener("mouseup", handleMouseUp);
    container.addEventListener("mousedown", handleMouseDown);

    const handleSelectionChange = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = window.setTimeout(() => {
        checkSelection();
      }, 50);
    };
    document.addEventListener("selectionchange", handleSelectionChange);

    return () => {
      container.removeEventListener("mouseup", handleMouseUp);
      container.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("selectionchange", handleSelectionChange);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [containerRef, checkSelection]);

  return {
    selectedText: selection.text,
    selectionPosition: selection.position,
    clearSelection,
  };
};
