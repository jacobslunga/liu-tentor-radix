import { FC } from "react";
import { GripVertical } from "lucide-react";

interface ResizeHandleProps {
  onStartResize: () => void;
  isResizing?: boolean;
}

export const ResizeHandle: FC<ResizeHandleProps> = ({
  onStartResize,
  isResizing = false,
}) => {
  return (
    <div
      className="absolute left-0 top-0 bottom-0 w-5 -translate-x-1/2 z-50 cursor-col-resize flex items-center justify-center group touch-none select-none outline-none"
      onMouseDown={(e) => {
        e.preventDefault();
        onStartResize();
      }}
    >
      <div
        className={`absolute inset-y-0 w-px transition-colors duration-200 ${
          isResizing ? "bg-primary" : "bg-transparent group-hover:bg-primary/50"
        }`}
      />

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
