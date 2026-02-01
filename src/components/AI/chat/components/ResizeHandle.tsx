import { FC } from "react";
import { GripVertical } from "lucide-react";

interface ResizeHandleProps {
  onStartResize: () => void;
  isResizing?: boolean;
  side: "left" | "right";
}

export const ResizeHandle: FC<ResizeHandleProps> = ({
  onStartResize,
  isResizing = false,
  side,
}) => {
  return (
    <div
      className={`absolute top-0 bottom-0 w-5 z-60 cursor-col-resize flex items-center justify-center group touch-none select-none outline-none
        ${side === "right" ? "left-0 -translate-x-1/2" : "right-0 translate-x-1/2"}
      `}
      onMouseDown={(e) => {
        e.preventDefault();
        onStartResize();
      }}
    >
      {/* The visual line */}
      <div
        className={`absolute inset-y-0 w-px transition-colors duration-200 ${
          isResizing ? "bg-primary" : "bg-transparent group-hover:bg-primary/50"
        }`}
      />

      {/* The Grip Icon Box */}
      <div
        className={`
          relative flex h-8 w-4 items-center justify-center rounded-sm border shadow-sm transition-all duration-200
          bg-background
          ${
            isResizing
              ? "border-primary ring-2 ring-primary/20 scale-110"
              : "border-border group-hover:border-primary/50"
          }
        `}
      >
        <GripVertical
          className={`h-4 w-4 transition-colors ${
            isResizing ? "text-primary" : "text-muted-foreground"
          }`}
        />
      </div>
    </div>
  );
};
