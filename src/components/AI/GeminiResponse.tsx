import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";

interface Props {
  text: string;
}

const GeminiResponse: React.FC<Props> = ({ text }) => {
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none break-words prose-pre:whitespace-pre-wrap prose-pre:text-sm prose-code:text-[0.9em] prose-headings:mt-4 prose-headings:mb-2">
      <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
        {text}
      </ReactMarkdown>
    </div>
  );
};

export default GeminiResponse;
