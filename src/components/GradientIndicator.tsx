import { useEffect } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { ArrowLeftToLine } from "lucide-react";

interface GradientIndicatorProps {
  facitPdfUrl: string | null;
  label?: string;
}

const GradientIndicator: React.FC<GradientIndicatorProps> = ({
  facitPdfUrl,
  label = "Facit",
}) => {
  const spring = useSpring(0, {
    stiffness: 200,
    damping: 25,
    restDelta: 0.001,
  });

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const xTrigger = w * 0.7;

      const safeZoneY = h * 0.2;
      const isInVerticalSafeZone =
        e.clientY < safeZoneY || e.clientY > h - safeZoneY;

      if (e.clientX > xTrigger && !isInVerticalSafeZone) {
        const xRatio = (e.clientX - xTrigger) / (w - xTrigger);
        const clampedX = Math.min(Math.max(xRatio, 0), 1);

        spring.set(clampedX);
      } else {
        spring.set(0);
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, [spring]);

  const gradientOpacity = useTransform(spring, (v) =>
    document.documentElement.classList.contains("dark")
      ? 0.08 + v * 0.3
      : 0.16 + v * 0.45,
  );
  const iconOpacity = useTransform(spring, (v) => 0.5 + v * 0.5);
  const arrowX = useTransform(spring, (v) => `${-10 + v * -20}px`);

  const backgroundImage = useTransform(
    gradientOpacity,
    (o) =>
      `radial-gradient(
        ellipse 90px 42% at 100% 50%,
        oklch(0.6193 0.1154 172.06 / ${o}) 0%,
        oklch(0.6193 0.1154 172.06 / ${o * 0.7}) 22%,
        oklch(0.6193 0.1154 172.06 / ${o * 0.28}) 48%,
        transparent 72%
      )`,
  );

  return (
    <motion.div
      className="absolute right-0 top-0 h-full w-28 pointer-events-none"
      style={{ backgroundImage }}
    >
      <motion.div
        className="absolute right-0 flex items-center h-full pr-2"
        style={{ opacity: iconOpacity, x: arrowX }}
      >
        {facitPdfUrl ? (
          <div className="flex items-center gap-2">
            <ArrowLeftToLine className="w-5 h-5 text-primary" />
            <span className="text-xs font-normal text-primary hidden md:block">
              {label}
            </span>
          </div>
        ) : (
          <p className="text-xs hidden md:flex text-muted-foreground">
            Not available
          </p>
        )}
      </motion.div>
    </motion.div>
  );
};

export default GradientIndicator;
