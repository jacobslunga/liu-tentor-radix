import { useState, useEffect, useRef, useCallback } from "react";
import {
  PANEL_MIN_WIDTH,
  PANEL_MAX_WIDTH,
  PANEL_DEFAULT_WIDTH,
} from "../constants";

interface UseResizablePanelReturn {
  width: number;
  isResizing: boolean;
  startResizing: () => void;
}

export const useResizablePanel = (
  initialWidth = PANEL_DEFAULT_WIDTH,
  side: "left" | "right" = "right",
): UseResizablePanelReturn => {
  const [width, setWidth] = useState(initialWidth);
  const [isResizing, setIsResizing] = useState(false);

  const widthRef = useRef(initialWidth);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }

      rafRef.current = requestAnimationFrame(() => {
        const windowWidth = window.innerWidth;
        let newWidthPercentage = 0;

        if (side === "right") {
          newWidthPercentage = ((windowWidth - e.clientX) / windowWidth) * 100;
        } else {
          newWidthPercentage = (e.clientX / windowWidth) * 100;
        }

        const constrainedWidth = Math.min(
          Math.max(newWidthPercentage, PANEL_MIN_WIDTH),
          PANEL_MAX_WIDTH,
        );

        widthRef.current = constrainedWidth;
        setWidth(constrainedWidth);
      });
    };

    const handleMouseUp = () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      setIsResizing(false);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    if (isResizing) {
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
      document.addEventListener("mousemove", handleMouseMove, {
        passive: true,
      });
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing, side]);

  const startResizing = useCallback(() => setIsResizing(true), []);

  return { width, isResizing, startResizing };
};
