import { FC } from "react";

interface ResizeHandleProps {
  onStartResize: () => void;
}

export const ResizeHandle: FC<ResizeHandleProps> = ({ onStartResize }) => {
  return (
    <div
      className="absolute left-0 top-0 bottom-0 w-4 transition-all cursor-col-resize group z-50"
      onMouseDown={onStartResize}
    >
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 group-hover:w-2 h-16 bg-black/70 dark:bg-white/80 group-hover:bg-primary transition-all rounded-r flex items-center justify-center" />
    </div>
  );
};
