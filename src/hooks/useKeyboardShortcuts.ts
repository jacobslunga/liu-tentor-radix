import { useEffect, useCallback } from "react";

interface UseKeyboardShortcutsProps {
  showAIDrawer: boolean;
  showGlobalSearch: boolean;
  layoutMode: string;
  isHoveringFacitPanel: boolean;

  // Handlers
  handleToggleBlur: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  zoomInFacit: () => void;
  zoomOutFacit: () => void;
  rotateClockwise: () => void;
  rotateCounterClockwise: () => void;
  rotateFacitClockwise: () => void;
  rotateFacitCounterClockwise: () => void;
  setIsToggled: React.Dispatch<React.SetStateAction<boolean>>;
  setIsHoveringFacitPanel: React.Dispatch<React.SetStateAction<boolean>>;

  // Panel refs
  leftPanelRef: React.RefObject<any>;
  rightPanelRef: React.RefObject<any>;
}

export const useKeyboardShortcuts = ({
  showAIDrawer,
  showGlobalSearch,
  layoutMode,
  isHoveringFacitPanel,
  handleToggleBlur,
  zoomIn,
  zoomOut,
  zoomInFacit,
  zoomOutFacit,
  rotateClockwise,
  rotateCounterClockwise,
  rotateFacitClockwise,
  rotateFacitCounterClockwise,
  setIsToggled,
  setIsHoveringFacitPanel,
  leftPanelRef,
  rightPanelRef,
}: UseKeyboardShortcutsProps) => {
  // Arrow key handler for panel resizing
  const handleArrowKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (showGlobalSearch) return;
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        const leftPanel = leftPanelRef.current;
        const rightPanel = rightPanelRef.current;
        if (leftPanel && rightPanel) {
          const leftSize = leftPanel.getSize();
          const increment = e.key === "ArrowLeft" ? -5 : 5;
          const newLeftSize = Math.max(0, Math.min(100, leftSize + increment));
          leftPanel.resize(newLeftSize);
          rightPanel.resize(100 - newLeftSize);
        }
      }
    },
    [showGlobalSearch, leftPanelRef, rightPanelRef]
  );

  // General shortcuts handler
  const handleGeneralShortcuts = useCallback(
    (e: KeyboardEvent) => {
      if (showAIDrawer || showGlobalSearch) return;

      switch (e.key) {
        case "t":
          handleToggleBlur();
          break;
        case "+":
        case "=": // Also handle = key without shift for convenience
          zoomIn();
          zoomInFacit();
          break;
        case "-":
          zoomOut();
          zoomOutFacit();
          break;
        case "l":
          rotateClockwise();
          rotateFacitClockwise();
          break;
        case "r":
          rotateCounterClockwise();
          rotateFacitCounterClockwise();
          break;
      }
    },
    [
      handleToggleBlur,
      zoomIn,
      zoomOut,
      zoomInFacit,
      zoomOutFacit,
      rotateClockwise,
      rotateCounterClockwise,
      rotateFacitClockwise,
      rotateFacitCounterClockwise,
      showAIDrawer,
      showGlobalSearch,
    ]
  );

  // Exam-only mode specific shortcuts
  const handleExamOnlyShortcuts = useCallback(
    (e: KeyboardEvent) => {
      if (showAIDrawer || layoutMode !== "exam-only" || showGlobalSearch)
        return;

      if (e.key === "e") {
        setIsToggled((prev) => {
          if (prev && isHoveringFacitPanel) setIsHoveringFacitPanel(false);
          return !prev;
        });
      }
    },
    [
      showAIDrawer,
      setIsToggled,
      layoutMode,
      showGlobalSearch,
      isHoveringFacitPanel,
      setIsHoveringFacitPanel,
    ]
  );

  // Set up keyboard event listeners
  useEffect(() => {
    window.addEventListener("keydown", handleArrowKeyPress);
    return () => window.removeEventListener("keydown", handleArrowKeyPress);
  }, [handleArrowKeyPress]);

  useEffect(() => {
    window.addEventListener("keydown", handleGeneralShortcuts);
    return () => window.removeEventListener("keydown", handleGeneralShortcuts);
  }, [handleGeneralShortcuts]);

  useEffect(() => {
    window.addEventListener("keydown", handleExamOnlyShortcuts);
    return () => window.removeEventListener("keydown", handleExamOnlyShortcuts);
  }, [handleExamOnlyShortcuts]);

  // Return shortcuts info for documentation/help
  return {
    shortcuts: {
      general: [
        { key: "t", description: "Toggle facit blur" },
        { key: "+/=", description: "Zoom in both panels" },
        { key: "-", description: "Zoom out both panels" },
        { key: "l", description: "Rotate clockwise" },
        { key: "r", description: "Rotate counter-clockwise" },
        { key: "←/→", description: "Resize panels" },
      ],
      examOnly: [{ key: "e", description: "Toggle facit panel" }],
    },
  };
};
