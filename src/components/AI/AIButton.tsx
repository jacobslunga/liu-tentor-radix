import { FC } from "react";
import { Button } from "@/components/ui/button";

type AiButtonProps = {
  onClick: () => void;
  className?: string;
  title?: string;
};

const AiButton: FC<AiButtonProps> = ({
  onClick,
  className = "",
  title = "Öppna AI-chatt",
}) => {
  return (
    <Button
      onClick={onClick}
      size="icon"
      className={`fixed hover:scale-105 transition-transform duration-200 bottom-10 right-6 h-14 w-14 rounded-full shadow-lg z-50 p-0 overflow-hidden ${className}`}
      aria-label={title}
      title={title}
    >
      <img
        src="/aibutton.svg"
        alt="AI"
        className="h-full w-full object-cover"
      />
    </Button>
  );
};

export default AiButton;
