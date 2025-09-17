import { create } from "zustand";

type PdfKey = "exam" | "solution";

type PdfState = {
  scale: number;
  numPages: number;
  rotation: number;
};

type PdfStore = {
  pdfs: Record<PdfKey, PdfState>;
  setNumPages: (key: PdfKey, numPages: number) => void;
  setScale: (key: PdfKey, scale: number) => void;
  zoomIn: (key: PdfKey) => void;
  zoomOut: (key: PdfKey) => void;
  rotateLeft: (key: PdfKey) => void;
  rotateRight: (key: PdfKey) => void;
};

const getInitialScale = (key: PdfKey) => {
  const screenWidth = window.innerWidth;
  const fraction = key === "solution" ? 0.5 : 1;
  const panelWidth = screenWidth * fraction;

  return Math.min(Math.max(panelWidth / 800, 0.8), 2);
};

const initialExamState: PdfState = {
  scale: getInitialScale("exam"),
  numPages: 0,
  rotation: 0,
};

const initialSolutionState: PdfState = {
  scale: getInitialScale("solution"),
  numPages: 0,
  rotation: 0,
};

const usePdfStore = create<PdfStore>((set) => ({
  pdfs: {
    exam: initialExamState,
    solution: initialSolutionState,
  },
  setScale: (key, scale) =>
    set((s) => ({
      pdfs: {
        ...s.pdfs,
        [key]: { ...s.pdfs[key], scale },
      },
    })),
  setNumPages: (key, numPages) =>
    set((s) => ({
      pdfs: { ...s.pdfs, [key]: { ...s.pdfs[key], numPages } },
    })),
  zoomIn: (key) =>
    set((s) => {
      const current = s.pdfs[key].scale;
      const next = Math.min(current + 0.2, 3);
      return { pdfs: { ...s.pdfs, [key]: { ...s.pdfs[key], scale: next } } };
    }),
  zoomOut: (key) =>
    set((s) => {
      const current = s.pdfs[key].scale;
      const next = Math.max(current - 0.2, 0.5);
      return { pdfs: { ...s.pdfs, [key]: { ...s.pdfs[key], scale: next } } };
    }),
  rotateLeft: (key) =>
    set((s) => {
      const current = s.pdfs[key].rotation;
      const next = (current - 90 + 360) % 360;
      return { pdfs: { ...s.pdfs, [key]: { ...s.pdfs[key], rotation: next } } };
    }),
  rotateRight: (key) =>
    set((s) => {
      const current = s.pdfs[key].rotation;
      const next = (current + 90) % 360;
      return { pdfs: { ...s.pdfs, [key]: { ...s.pdfs[key], rotation: next } } };
    }),
}));

export default usePdfStore;
