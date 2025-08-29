import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

interface Props {
  text: string;
}

const GeminiResponse: React.FC<Props> = ({ text }) => {
  return (
    <div className="prose prose-base md:prose-lg dark:prose-invert max-w-none break-words leading-relaxed prose-pre:whitespace-pre-wrap prose-pre:text-sm prose-code:text-[0.95em] prose-p:my-3 prose-ul:my-3 prose-ol:my-3">
      <ReactMarkdown
        // remark-breaks has been completely removed from this array.
        remarkPlugins={[remarkMath, remarkGfm]}
        rehypePlugins={[rehypeKatex]}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
};

export default GeminiResponse;
