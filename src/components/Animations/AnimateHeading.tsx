import { motion } from "framer-motion";
import React from "react";

import { useReducedMotion } from "@/lib/motion/use-reduced-motion";

interface AnimatedHeadingProps {
  level?: number;
  children: React.ReactNode;
  className?: string;
}

export default function AnimatedHeading({
  level = 2,
  children,
  className,
}: AnimatedHeadingProps) {
  const reducedMotion = useReducedMotion();
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const tag = `h${level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

  if (reducedMotion) {
    return React.createElement(
      tag,
      {
        className,
        style: {
          marginTop: "1.5em",
          marginBottom: "0.5em",
          textAlign: "center",
        },
      },
      children,
    );
  }

  const motionTags = {
    h1: motion.h1,
    h2: motion.h2,
    h3: motion.h3,
    h4: motion.h4,
    h5: motion.h5,
    h6: motion.h6,
  };
  const MotionTag = motionTags[tag] || motion.h2;

  return (
    <MotionTag
      className={className}
      initial={{
        opacity: 0,
        y: isMobile ? 10 : 16,
      }}
      animate={{ opacity: 1, y: 0 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{
        duration: isMobile ? 0.25 : 0.35,
      }}
      style={{ marginTop: "1.5em", marginBottom: "0.5em", textAlign: "center" }}
    >
      {children}
    </MotionTag>
  );
}
