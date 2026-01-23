import { FC } from "react";

interface EmptyStateProps {
  language: string;
  hasSolutions: boolean;
}

export const EmptyState: FC<EmptyStateProps> = ({ language }) => {
  const isSv = language === "sv";

  return (
    <div className="flex flex-col items-center justify-center h-full px-4 text-center duration-500 pb-20">
      <h2 className="text-2xl font-semibold tracking-tight mb-2">
        {isSv ? "Vad kan jag hjälpa till med?" : "How can I help you today?"}
      </h2>

      <p className="text-muted-foreground text-sm max-w-[280px] sm:max-w-md mb-6 leading-relaxed">
        {isSv
          ? "Ställ frågor om tentan, be om ledtrådar eller få hjälp att förstå lösningarna."
          : "Ask questions about the exam, get hints, or help understanding the solutions."}
      </p>

      <a
        href="/privacy-policy"
        target="_blank"
        rel="noopener noreferrer"
        className="text-[10px] text-muted-foreground/60 hover:text-foreground transition-colors border-b border-transparent hover:border-foreground/20"
      >
        {isSv ? "Läs vår AI-policy" : "Read our AI policy"}
      </a>
    </div>
  );
};
