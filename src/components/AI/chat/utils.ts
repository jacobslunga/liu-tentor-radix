/**
 * Normalizes math expressions from LaTeX delimiters to standard markdown math format
 */
export const normalizeMath = (content: string): string => {
  let result = content;

  // Convert \[...\] to $$...$$
  result = result.replace(/\\\[([\s\S]*?)\\\]/g, (_match, inner) => {
    return `\n$$${inner.trim()}$$\n`;
  });

  // Convert \(...\) to $...$
  result = result.replace(/\\\(([\s\S]*?)\\\)/g, (_match, inner) => {
    return `$${inner.trim()}$`;
  });

  return result;
};
