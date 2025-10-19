import usePdf from "@/hooks/usePdf";

export function getResponsiveScale(panelWidth: number): number {
  // More intelligent scaling based on actual panel width
  // These values are tuned for comfortable reading on different screen sizes
  if (panelWidth >= 1200) return 1.4; // Large desktop panels
  if (panelWidth >= 900) return 1.3; // Medium desktop panels
  if (panelWidth >= 700) return 1.2; // Smaller desktop/large laptop
  if (panelWidth >= 500) return 1.1; // Laptop panels
  return 1.0; // Small panels/mobile fallback
}

export function usePanelScaling(key: "exam" | "solution") {
  const { setScale } = usePdf(key);

  const updateScale = (size: number) => {
    const screenWidth = window.innerWidth;
    // size is a percentage (0-100), convert to actual pixel width
    const fraction = size / 100;
    const panelWidth = screenWidth * fraction;

    const newScale = getResponsiveScale(panelWidth);
    setScale(newScale);
  };

  return updateScale;
}
