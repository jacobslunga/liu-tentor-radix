import React, { useEffect } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { ArrowLeftToLine, LoaderCircle } from "lucide-react";
import { Exam } from "./data-table/columns";

interface GradientIndicatorProps {
  detectedFacit: Exam | null;
  facitPdfUrl: string | null;
  getTranslation: any;
}

const GradientIndicator: React.FC<GradientIndicatorProps> = ({
  detectedFacit,
  facitPdfUrl,
  getTranslation,
}) => {
  // en vår-springa som tar värden 0→1
  const spring = useSpring(0, {
    stiffness: 200,
    damping: 20,
    restDelta: 0.001,
  });

  // trigga vår-springan baserat på musens X-position
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      const w = window.innerWidth;
      const trigger = w * 0.7;
      if (e.clientX > trigger) {
        // ratio ∈ [0,1]
        const ratio = (e.clientX - trigger) / (w - trigger);
        spring.set(Math.min(Math.max(ratio, 0), 1));
      } else {
        spring.set(0);
      }
    };
    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, [spring]);

  // gradient-opacity: 0→0.2
  const gradientOpacity = useTransform(spring, (v) => v * 0.2);
  // ikon-opacity med keyframes
  const iconOpacity = useTransform(spring, [0, 0.3, 1], [0, 0.3, 1]);

  // skapa en MotionValue för CSS-gradienten
  const backgroundImage = useTransform(
    gradientOpacity,
    (o) =>
      // OBS: använder backgroundImage för att undvika vissa CSS-policies
      `linear-gradient(to right, transparent, hsl(var(--primary)/${o}))`
  );

  return (
    <motion.div
      className="absolute right-0 top-0 h-full w-40 pointer-events-none"
      style={{
        // applicera den dynamiska gradienten
        backgroundImage,
      }}
    >
      <motion.div
        className="absolute right-0 flex items-center h-full pr-2"
        style={{ opacity: iconOpacity }}
      >
        {detectedFacit && !facitPdfUrl ? (
          <LoaderCircle className="w-10 h-10 animate-spin text-primary" />
        ) : facitPdfUrl ? (
          <div className="h-20 flex items-center justify-center">
            <div className="bg-primary/10 px-3 py-2 rounded-l-xl">
              <ArrowLeftToLine className="w-5 h-5 text-primary" />
            </div>
          </div>
        ) : (
          <p className="text-xs hidden md:flex text-muted-foreground">
            {getTranslation("facitNotAvailable")}
          </p>
        )}
      </motion.div>
    </motion.div>
  );
};

export default GradientIndicator;
