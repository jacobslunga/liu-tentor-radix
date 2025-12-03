import { ArrowSquareOutIcon } from "@phosphor-icons/react";
import { FC, useMemo } from "react";
import { Link } from "react-router-dom";
import { Sponsor } from "@/types/sponsor";
import { supabase } from "@/supabase/supabaseClient";

interface Props {
  sponsor: Sponsor;
  description: string;
  subtitle?: string;
  courseCode: string;
  variant?: "default" | "link";
}

const SponsorBanner: FC<Props> = ({
  sponsor: { logo, name, to },
  description,
  variant = "default",
  subtitle,
  courseCode,
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

  const handleClick = async () => {
    try {
      const browser = navigator.userAgent;

      let ipAddress = null;
      try {
        const ipResponse = await fetch("https://api.ipify.org?format=json");
        const ipData = await ipResponse.json();
        ipAddress = ipData.ip;
      } catch (error) {
        console.error("Failed to fetch IP address:", error);
      }

      const { error } = await supabase.from("company_clicks").insert({
        company_id: "b25f6b22-6a2e-4fbf-9a5b-8ee107f0fcee",
        browser,
        ip_address: ipAddress,
        link_name: "Exsitec traineeprogram 2025",
        course_code: courseCode,
      });

      if (error) {
        console.error("Failed to track click:", error);
      }
    } catch (error) {
      console.error("Error tracking click:", error);
    }
  };

  if (variant === "link") {
    return (
      <Link
        to={to}
        target="_blank"
        onClick={handleClick}
        className="relative flex items-center w-auto justify-between px-6 py-4 text-white duration-300 group rounded-3xl corner-squircle overflow-hidden"
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
          <div className="w-20 h-10 rounded p-1 flex items-center justify-center">
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
            <span className="text-xs font-medium">{description}</span>
          </div>
        </div>
        <ArrowSquareOutIcon
          weight="duotone"
          className="absolute right-2 top-2 z-10 w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200"
        />

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
  }

  return (
    <Link
      to={to}
      target="_blank"
      onClick={handleClick}
      className="relative flex items-center max-w-xl justify-between px-6 py-4 text-white duration-300 group rounded-3xl corner-squircle overflow-hidden"
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

      <div className="relative flex flex-col items-start gap-4 z-10">
        <div className="w-32 h-10 rounded p-1 flex items-center justify-center">
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
        <div className="flex flex-col items-start justify-center gap-1">
          <span className="text-sm font-medium">{description}</span>
          <span className="text-xs font-normal text-white/70 text-left">
            {subtitle}
          </span>
          <button className="rounded-xl corner-squircle mt-2 self-end flex flex-row items-center justify-center gap-1 py-2 px-5 cursor-pointer text-xs bg-white/10 hover:bg-white/20 transition-colors duration-200">
            Besök
            <ArrowSquareOutIcon
              weight="duotone"
              className="group-hover:-translate-y-0.5 w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200"
            />
          </button>
        </div>
      </div>

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
