import { FC } from "react";

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
      className="absolute left-0 top-0 bottom-0 w-4 transition-all cursor-col-resize group z-50"
      onMouseDown={onStartResize}
    >
      <div
        className={`absolute left-2 top-1/2 -translate-y-1/2 ${isResizing ? "w-2 bg-black dark:bg-white" : "w-1 group-hover:w-2 bg-black/40 dark:bg-white/40"} h-10  dark:group-hover:bg-white group-hover:bg-black transition-all rounded flex items-center justify-center`}
      />
    </div>
  );
};
