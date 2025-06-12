/**
 * Calculate responsive zoom scale based on screen size and PDF content
 */
export const calculateResponsiveZoom = (
  layoutMode: string = "exam-with-facit",
  screenWidth: number = window.innerWidth,
  screenHeight: number = window.innerHeight,
  isMobile: boolean = false
): { examScale: number; facitScale: number } => {
  // Balanced base scales - improved but not overwhelming
  let baseScale = 1.3;

  if (isMobile) {
    // Mobile devices: fit to screen width with good readability
    baseScale = Math.min(screenWidth / 550, 1.5);
  } else {
    // Desktop scaling based on screen width - moderately improved
    if (screenWidth >= 2560) baseScale = 1.9; // 4K displays
    else if (screenWidth >= 1920) baseScale = 1.7; // 1440p+
    else if (screenWidth >= 1600) baseScale = 1.5; // Large laptops
    else if (screenWidth >= 1440) baseScale = 1.4; // Standard laptops
    else if (screenWidth >= 1280) baseScale = 1.3; // Small laptops
    else baseScale = 1.2; // Very small screens
  }

  // Adjust for layout mode
  let examScale = baseScale;
  let facitScale = baseScale;

  switch (layoutMode) {
    case "exam-only":
      // Single panel - moderate increase since more space available
      examScale = baseScale + 0.4;
      facitScale = baseScale + 0.2;
      break;

    case "exam-with-facit":
      // Split view - small reduction for better fit
      examScale = baseScale - 0.05;
      facitScale = baseScale - 0.05;
      break;

    default:
      examScale = baseScale;
      facitScale = baseScale;
  }

  // Consider screen height
  if (screenHeight < 800) {
    examScale *= 0.9;
    facitScale *= 0.9;
  } else if (screenHeight >= 1200) {
    // Tall screens can handle slightly more zoom
    examScale *= 1.05;
    facitScale *= 1.05;
  }

  // Ensure reasonable bounds
  examScale = Math.max(0.7, Math.min(3.5, examScale));
  facitScale = Math.max(0.7, Math.min(3.5, facitScale));

  return { examScale, facitScale };
};

/**
 * Get optimal scale based on PDF page dimensions and container size
 */
export const calculateFitToWidthScale = (
  pageWidth: number,
  containerWidth: number,
  maxScale: number = 2.0,
  minScale: number = 0.5
): number => {
  const padding = 40; // Account for padding
  const availableWidth = containerWidth - padding;
  const scale = availableWidth / pageWidth;

  return Math.max(minScale, Math.min(maxScale, scale));
};

/**
 * Debounce function for resize events
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};
