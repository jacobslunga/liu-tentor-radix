import { FC } from "react";
import { Badge } from "@/components/ui/badge";

interface EmptyStateProps {
  language: string;
  hasSolutions: boolean;
}

export const EmptyState: FC<EmptyStateProps> = ({ language, hasSolutions }) => {
  const isSv = language === "sv";

  return (
    <div className="h-full mb-40 flex flex-col items-center justify-center px-4 relative overflow-hidden">
      <div className="max-w-md w-full text-center relative z-10">
        {/* Title */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <h2 className="text-2xl font-medium tracking-tight">
            {isSv ? "Ställ en fråga" : "Ask a question"}
          </h2>
          <Badge
            variant="secondary"
            className="text-[10px] font-semibold uppercase tracking-wide"
          >
            Beta
          </Badge>
        </div>

        {/* Beta disclaimer */}
        <p className="text-xs text-muted-foreground/70 mb-4">
          {isSv
            ? "Detta är en ny funktion och kan innehålla fel. Dubbelkolla alltid svaren."
            : "This is a new feature and may contain errors. Always double-check answers."}
        </p>

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-sm mx-auto">
          {isSv ? (
            <>
              Få hjälp med uppgifter, förklaringar eller lösningar. AI:n har
              tillgång till tentan
              {hasSolutions && (
                <span className="text-foreground font-medium"> och facit</span>
              )}
              .
            </>
          ) : (
            <>
              Get help with problems, explanations, or solutions. The AI has
              access to the exam
              {hasSolutions && (
                <span className="text-foreground font-medium">
                  {" "}
                  and solution
                </span>
              )}
              .
            </>
          )}
        </p>

        {/* Policy link */}
        <div className="flex justify-center">
          <a
            href="/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-secondary text-[10px] text-muted-foreground hover:text-foreground transition-all duration-200"
          >
            <span>
              {isSv ? "Läs om vår AI-policy" : "Read about our AI policy"}
            </span>
            <span className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
              →
            </span>
          </a>
        </div>
      </div>
    </div>
  );
};
