import { FC, memo, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneDark,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { Button } from "@/components/ui/button";
import { CheckIcon, CopyIcon } from "@phosphor-icons/react";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

interface CodeBlockProps {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const CodeBlock: FC<CodeBlockProps> = memo(
  ({ inline, className, children, ...props }) => {
    const [copied, setCopied] = useState(false);
    const { effectiveTheme } = useTheme();
    const match = /language-(\w+)/.exec(className || "");
    const language = match ? match[1] : "";
    const { language: l } = useLanguage();

    const codeString = String(children).replace(/\n$/, "");

    const handleCopy = () => {
      navigator.clipboard.writeText(codeString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    if (inline) {
      return (
        <code
          className="bg-muted/50 text-foreground px-1 py-0.5 rounded text-base"
          {...props}
        >
          {children}
        </code>
      );
    }

    return (
      <div className="relative group my-4 w-full">
        {/* Header with language and copy button */}
        <div className="flex items-center justify-between bg-muted/30 border border-border rounded-t-lg px-4 py-2">
          <span className="text-xs font-medium text-muted-foreground">
            {language || "text"}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-7 px-2 text-xs"
          >
            {copied ? (
              <>
                <CheckIcon weight="bold" className="h-3 w-3 mr-1" />
                {l === "sv" ? "Kopierat" : "Copied"}
              </>
            ) : (
              <>
                <CopyIcon weight="bold" className="h-3 w-3 mr-1" />
                {l === "sv" ? "Kopiera" : "Copy"}
              </>
            )}
          </Button>
        </div>
        {/* Code content */}
        <div className="relative overflow-hidden rounded-b-lg border border-t-0 border-border">
          <SyntaxHighlighter
            language={language}
            style={effectiveTheme === "dark" ? oneDark : oneLight}
            customStyle={{
              margin: 0,
              padding: "1.25rem",
              fontSize: "0.85rem",
              lineHeight: "1.6",
              borderRadius: 0,
              fontFamily: "Jetbrains Mono",
            }}
            showLineNumbers={false}
            wrapLines={false}
            wrapLongLines={true}
            codeTagProps={{
              style: {
                fontSize: "0.85rem",
                lineHeight: "1.6",
                tabSize: 2,
              },
            }}
            {...props}
          >
            {codeString}
          </SyntaxHighlighter>
        </div>
      </div>
    );
  }
);

CodeBlock.displayName = "CodeBlock";
