import usePdf from "@/hooks/usePdf";

export function usePanelScaling(
  key: "exam" | "solution",
  basePanelWidth: number
) {
  const { setScale } = usePdf(key);

  const updateScale = (size: number) => {
    const panelWidth = (window.innerWidth * size) / 100;
    const newScale = Math.min(Math.max(panelWidth / basePanelWidth, 0.5), 3);
    setScale(newScale);
  };

  return updateScale;
}
