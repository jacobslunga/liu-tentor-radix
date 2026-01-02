import { FC } from "react";
import { ArrowRightIcon } from "@phosphor-icons/react";

interface EmptyStateProps {
  language: string;
  hasSolutions: boolean;
  onQuestionClick: (question: string) => void;
}

export const EmptyState: FC<EmptyStateProps> = ({
  language,
  hasSolutions,
  onQuestionClick,
}) => {
  const isSv = language === "sv";

  const suggestions = isSv
    ? ["Sammanfatta tentan", "Viktiga begrepp", "Lös uppgift 1"]
    : ["Summarize exam", "Key concepts", "Solve problem 1"];

  return (
    <div className="h-full flex flex-col items-center justify-center px-4 relative overflow-hidden">
      <div className="max-w-md w-full text-center relative z-10">
        {/* Title */}
        <h2 className="text-2xl font-medium tracking-tight mb-3">
          {isSv ? "Ställ en fråga" : "Ask a question"}
        </h2>

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

        {/* Suggested Questions - Small Pills Row */}
        <div className="flex flex-row flex-wrap justify-center gap-2 mb-8">
          {suggestions.map((question, index) => (
            <button
              key={index}
              onClick={() => onQuestionClick(question)}
              className="group cursor-pointer flex items-center px-3 py-1.5 text-xs font-medium bg-background border rounded-full hover:bg-secondary/50 hover:border-primary/30 transition-colors duration-200"
            >
              <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                {question}
              </span>

              <span className="overflow-hidden max-w-0 opacity-0 group-hover:max-w-5 group-hover:opacity-100 transition-all duration-300 ease-in-out">
                <ArrowRightIcon
                  weight="bold"
                  className="w-3 h-3 ml-1.5 text-muted-foreground group-hover:text-foreground -translate-x-2 group-hover:translate-x-0 transition-transform duration-300"
                />
              </span>
            </button>
          ))}
        </div>

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
