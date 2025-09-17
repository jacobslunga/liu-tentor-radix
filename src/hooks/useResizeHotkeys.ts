import { useHotkeys } from "react-hotkeys-hook";
import { ImperativePanelHandle } from "react-resizable-panels";
import { RefObject } from "react";

export function useResizeHotkeys(ref: RefObject<ImperativePanelHandle | null>) {
  useHotkeys("left", () => {
    const size = ref.current?.getSize() ?? 55;
    ref.current?.resize(Math.max(size - 5, 20));
  });

  useHotkeys("right", () => {
    const size = ref.current?.getSize() ?? 55;
    ref.current?.resize(Math.min(size + 5, 80));
  });
}
