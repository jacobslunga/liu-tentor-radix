import usePdfStore from "@/stores/PdfStore";

const usePdf = (key: "exam" | "solution") => {
  const { scale, rotation, numPages } = usePdfStore((s) => s.pdfs[key]);
  const setScaleRaw = usePdfStore((s) => s.setScale);
  const setNumPagesRaw = usePdfStore((s) => s.setNumPages);
  const zoomInRaw = usePdfStore((s) => s.zoomIn);
  const zoomOutRaw = usePdfStore((s) => s.zoomOut);
  const rotateLeftRaw = usePdfStore((s) => s.rotateLeft);
  const rotateRightRaw = usePdfStore((s) => s.rotateRight);

  const setScale = (numPages: number) => setScaleRaw(key, numPages);
  const setNumPages = (numPages: number) => setNumPagesRaw(key, numPages);
  const zoomIn = () => zoomInRaw(key);
  const zoomOut = () => zoomOutRaw(key);
  const rotateLeft = () => rotateLeftRaw(key);
  const rotateRight = () => rotateRightRaw(key);

  return {
    scale,
    rotation,
    numPages,
    setScale,
    setNumPages,
    zoomIn,
    zoomOut,
    rotateLeft,
    rotateRight,
  };
};

export default usePdf;
