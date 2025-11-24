import { ExternalLink } from "lucide-react";
import { FC, useMemo } from "react";
import { Link } from "react-router-dom";
import { Sponsor } from "@/types/sponsor";

interface Props {
  sponsor: Sponsor;
  description: string;
  variant?: "default" | "table";
}

const SponsorBanner: FC<Props> = ({
  sponsor: { logo, name, to },
  description,
  variant = "default",
}) => {
  const animationTimings = useMemo(() => {
    const randomBetween = (min: number, max: number) =>
      Math.random() * (max - min) + min;

    return {
      gradient: randomBetween(4, 7),
      shimmer: randomBetween(2.5, 4),
      wave: randomBetween(3, 5),
      gradientHover: randomBetween(1, 2),
      shimmerHover: randomBetween(1, 1.5),
    };
  }, []);
  if (variant === "table") {
    return (
      <Link
        to={to}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-between px-6 py-3 bg-linear-120 from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/15 border-l-4 border-primary/30 transition-all duration-300 group"
      >
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded bg-background/80 p-1 flex items-center justify-center">
            {logo ? (
              <img
                src={logo}
                alt={name}
                className="w-full h-full object-contain"
              />
            ) : (
              <span className="text-primary text-xs font-bold">
                {name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-primary font-medium">Sponsor</span>
            <span className="text-sm font-medium text-foreground">
              {description}
            </span>
          </div>
        </div>
        <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
      </Link>
    );
  }

  return (
    <Link
      to={to}
      target="_blank"
      className="relative flex items-center w-full justify-between px-6 py-4 text-white duration-300 group rounded-3xl corner-squircle overflow-hidden"
      style={
        {
          "--gradient-duration": `${animationTimings.gradient}s`,
          "--shimmer-duration": `${animationTimings.shimmer}s`,
          "--wave-duration": `${animationTimings.wave}s`,
          "--gradient-hover-duration": `${animationTimings.gradientHover}s`,
          "--shimmer-hover-duration": `${animationTimings.shimmerHover}s`,
        } as React.CSSProperties
      }
    >
      {/* Base animated gradient background */}
      <div className="absolute inset-0 bg-linear-to-r from-[#7556C6] via-[#5a3fb5] to-[#362795] bg-size-[200%_100%] animate-[gradient_var(--gradient-duration)_ease-in-out_infinite]" />

      {/* Flowing shimmer overlay - always visible */}
      <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/15 to-transparent bg-size-[200%_100%] animate-[shimmer_var(--shimmer-duration)_linear_infinite]" />

      {/* Additional wave effect for more chaos */}
      <div className="absolute inset-0 bg-linear-135 from-transparent via-purple-300/10 to-transparent bg-size-[150%_150%] animate-[wave_var(--wave-duration)_ease-in-out_infinite] opacity-70 group-hover:opacity-100" />

      <div className="relative flex items-center gap-4 z-10">
        <div className="w-24 h-10 rounded p-1 flex items-center justify-center">
          {logo ? (
            <img
              src={logo}
              alt={name}
              className="w-full h-full object-contain"
            />
          ) : (
            <span className="text-sm font-bold">
              {name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-medium opacity-90 group-hover:opacity-100">
            Sponsor
          </span>
          <span className="text-sm font-medium">{description}</span>
        </div>
      </div>
      <ExternalLink className="relative z-10 w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />

      <style>{`
        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        
        @keyframes shimmer {
          0% {
            background-position: -200% 0%;
          }
          100% {
            background-position: 200% 0%;
          }
        }
        
        @keyframes wave {
          0% {
            background-position: 0% 0%;
            transform: translateY(0) scale(1);
          }
          33% {
            background-position: 100% 50%;
            transform: translateY(-2px) scale(1.02);
          }
          66% {
            background-position: 50% 100%;
            transform: translateY(2px) scale(0.98);
          }
          100% {
            background-position: 0% 0%;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </Link>
  );
};

export default SponsorBanner;
