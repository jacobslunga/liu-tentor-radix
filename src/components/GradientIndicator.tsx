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
  const springOpacity = useSpring(0, {
    stiffness: 200,
    damping: 20,
    restDelta: 0.001,
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent): void => {
      const windowWidth = window.innerWidth;
      const triggerPoint = windowWidth * 0.7;
      if (e.clientX > triggerPoint) {
        const ratio = (e.clientX - triggerPoint) / (windowWidth - triggerPoint);
        springOpacity.set(ratio);
      } else {
        springOpacity.set(0);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [springOpacity]);

  const gradientOpacity = useTransform(springOpacity, (value) => value * 0.2);
  const iconOpacity = useTransform(springOpacity, [0, 0.3, 1], [0, 0.3, 1]);

  return (
    <motion.div
      className="absolute right-0 top-0 h-full w-40 flex items-center justify-end pointer-events-none"
      style={{
        background: useTransform(
          gradientOpacity,
          (opacity) =>
            `linear-gradient(to right, transparent, hsl(var(--primary) / ${opacity}))`
        ),
      }}
    >
      <motion.div
        className="absolute right-0 flex items-center h-full pr-2"
        style={{ opacity: iconOpacity }}
      >
        <div className="flex items-center space-x-2">
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
        </div>
      </motion.div>
    </motion.div>
  );
};

export default GradientIndicator;
