import { useTheme } from "@/context/ThemeContext";

interface LogoIconProps {
  className?: string;
  width?: number;
  height?: number;
  isBlackAndWhite?: boolean;
}

export function LogoIcon({
  className,
  width,
  height,
  isBlackAndWhite,
}: LogoIconProps) {
  const { effectiveTheme } = useTheme();

  const isDark = effectiveTheme === "dark";

  const src = isBlackAndWhite
    ? isDark
      ? "/liutentorwhiterounded.svg"
      : "/liutentorblackrounded.svg"
    : isDark
    ? "/liutentorroundeddark.svg"
    : "/liutentorroundedlight.svg";

  return (
    <img
      src={src}
      alt="Logo"
      className={className}
      style={{
        width: width ? `${width}px` : undefined,
        height: height ? `${height}px` : undefined,
      }}
    />
  );
}
