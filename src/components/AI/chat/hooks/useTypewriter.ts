import { useState, useEffect } from "react";
import { TYPEWRITER_EXAMPLES } from "../constants";

interface UseTypewriterProps {
  isActive: boolean;
  examples?: string[];
}

interface UseTypewriterReturn {
  typed: string;
}

export const useTypewriter = ({
  isActive,
  examples = TYPEWRITER_EXAMPLES,
}: UseTypewriterProps): UseTypewriterReturn => {
  const [typed, setTyped] = useState("");
  const [charIndex, setCharIndex] = useState(0);
  const [exampleIndex, setExampleIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!isActive) return;

    const currentExample = examples[exampleIndex];
    const isTypingComplete = charIndex === currentExample.length && !deleting;
    const isDeletingComplete = charIndex === 0 && deleting;

    if (isTypingComplete) {
      const timer = setTimeout(() => setDeleting(true), 1500);
      return () => clearTimeout(timer);
    }

    if (isDeletingComplete) {
      setDeleting(false);
      setExampleIndex((prev) => (prev + 1) % examples.length);
      return;
    }

    const speed = deleting ? 30 : 50;
    const timer = setTimeout(() => {
      setCharIndex((prev) => prev + (deleting ? -1 : 1));
      setTyped(
        currentExample.slice(0, deleting ? charIndex - 1 : charIndex + 1)
      );
    }, speed);

    return () => clearTimeout(timer);
  }, [isActive, charIndex, deleting, exampleIndex, examples]);

  return { typed };
};
