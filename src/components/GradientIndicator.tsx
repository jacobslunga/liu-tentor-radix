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
      const xTrigger = w * 0.7;

      const topSafeZone = 150;

      if (e.clientX > xTrigger) {
        const xRatio = (e.clientX - xTrigger) / (w - xTrigger);
        const clampedX = Math.min(Math.max(xRatio, 0), 1);

        const yRatio = e.clientY / topSafeZone;
        const clampedY = Math.min(Math.max(yRatio, 0), 1);

        spring.set(clampedX * clampedY);
      } else {
        spring.set(0);
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, [spring]);

  const gradientOpacity = useTransform(spring, (v) => 0.1 + v * 0.25);
  const iconOpacity = useTransform(spring, (v) => 0.5 + v * 0.5);
  const arrowX = useTransform(spring, (v) => `${-10 + v * -20}px`);

  const backgroundImage = useTransform(
    gradientOpacity,
    (o) =>
      `linear-gradient(to right, transparent, oklch(0.6193 0.1154 172.06 / ${o}))`
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
            <span className="text-xs font-medium text-primary hidden md:block">
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
