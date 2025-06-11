import { useEffect, useCallback, useRef } from "react";

interface UseMouseInteractionsProps {
  zoomIn: () => void;
  zoomOut: () => void;
  zoomInFacit: () => void;
  zoomOutFacit: () => void;
  setIsMouseActive: React.Dispatch<React.SetStateAction<boolean>>;
  setIsMiddleMouseDown: React.Dispatch<React.SetStateAction<boolean>>;
  isHoveringFacitPanel: boolean;
  isHoveringTabs: boolean;
  timeoutRef: React.RefObject<NodeJS.Timeout | null>;
}

export const useMouseInteractions = ({
  zoomIn,
  zoomOut,
  zoomInFacit,
  zoomOutFacit,
  setIsMouseActive,
  setIsMiddleMouseDown,
  isHoveringFacitPanel,
  isHoveringTabs,
  timeoutRef,
}: UseMouseInteractionsProps) => {
  const isHoveringFacitPanelRef = useRef(isHoveringFacitPanel);
  const isHoveringTabsRef = useRef(isHoveringTabs);

  // Update refs when state changes
  useEffect(() => {
    isHoveringFacitPanelRef.current = isHoveringFacitPanel;
  }, [isHoveringFacitPanel]);

  useEffect(() => {
    isHoveringTabsRef.current = isHoveringTabs;
  }, [isHoveringTabs]);

  // Mouse activity tracking
  const handleMouseMove = useCallback(() => {
    setIsMouseActive(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      if (!isHoveringFacitPanelRef.current && !isHoveringTabsRef.current) {
        setIsMouseActive(false);
      }
    }, 1000);
  }, [setIsMouseActive, timeoutRef]);

  // Middle mouse wheel zoom
  const handleMouseDown = useCallback(
    (e: MouseEvent) => {
      if (e.button === 1) {
        // Middle mouse button
        e.preventDefault();
        setIsMiddleMouseDown(true);
      }
    },
    [setIsMiddleMouseDown]
  );

  const handleMouseUp = useCallback(
    (e: MouseEvent) => {
      if (e.button === 1) {
        // Middle mouse button
        e.preventDefault();
        setIsMiddleMouseDown(false);
      }
    },
    [setIsMiddleMouseDown]
  );

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      // Only handle wheel events when middle mouse is down
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        if (e.deltaY < 0) {
          zoomIn();
          zoomInFacit();
        } else {
          zoomOut();
          zoomOutFacit();
        }
      }
    },
    [zoomIn, zoomOut, zoomInFacit, zoomOutFacit]
  );

  // Context menu prevention for middle mouse
  const handleContextMenu = useCallback((e: MouseEvent) => {
    if (e.button === 1) {
      e.preventDefault();
    }
  }, []);

  // Set up mouse event listeners
  useEffect(() => {
    // Mouse activity tracking
    window.addEventListener("mousemove", handleMouseMove);

    // Middle mouse interactions
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("wheel", handleWheel, { passive: false });

    // Initial mouse activity setup
    handleMouseMove();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("wheel", handleWheel);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [
    handleMouseMove,
    handleMouseDown,
    handleMouseUp,
    handleContextMenu,
    handleWheel,
    timeoutRef,
  ]);

  return {
    // Expose mouse activity handlers for external use
    handleMouseMove,
  };
};
