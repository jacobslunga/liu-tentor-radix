import { FC } from "react";
import { ChatCircleDotsIcon } from "@phosphor-icons/react";

interface EmptyStateProps {
  language: string;
  hasSolutions: boolean;
}

export const EmptyState: FC<EmptyStateProps> = ({ language, hasSolutions }) => {
  return (
    <div className="h-full flex flex-col items-center justify-center px-8">
      <div className="max-w-md w-full space-y-6 text-center">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center">
            <ChatCircleDotsIcon
              weight="duotone"
              className="h-6 w-6 text-muted-foreground"
            />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-lg font-medium text-foreground">
          {language === "sv" ? "Ställ en fråga" : "Ask a question"}
        </h2>

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed">
          {language === "sv" ? (
            <>
              Få hjälp med uppgifter, förklaringar eller lösningar. AI:n har
              tillgång till tentan{hasSolutions && " och lösningsförslaget"}.
            </>
          ) : (
            <>
              Get help with problems, explanations, or solutions. The AI has
              access to the exam{hasSolutions && " and solution"}.
            </>
          )}
        </p>

        {/* Policy link */}
        <a
          href="/privacy-policy"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
        >
          {language === "sv"
            ? "Läs om vår AI-policy"
            : "Read about our AI policy"}
        </a>
      </div>
    </div>
  );
};
