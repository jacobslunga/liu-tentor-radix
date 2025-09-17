import usePdf from "@/hooks/usePdf";

export function getResponsiveScale(panelWidth: number): number {
  if (panelWidth >= 1600) return 1.8; // very wide screens
  if (panelWidth >= 1280) return 1.5; // typical 1080p
  if (panelWidth >= 1024) return 1.8; // laptops
  if (panelWidth >= 768) return 1.3; // small laptops/tablets
  return 1.0; // fallback for narrow
}

export function usePanelScaling(key: "exam" | "solution") {
  const { setScale } = usePdf(key);

  const updateScale = (size: number) => {
    const screenWidth = window.innerWidth;
    const fraction = size / 100;
    const panelWidth = screenWidth * fraction;

    const newScale = getResponsiveScale(panelWidth);
    setScale(newScale);
  };

  return updateScale;
}
