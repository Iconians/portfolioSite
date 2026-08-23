"use client";

import { motion } from "framer-motion";
import React from "react";

import { useReducedMotion } from "@/lib/motion/use-reduced-motion";

type AnimatedSectionProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  staggerChildren?: number;
};

export const AnimatedSection = ({
  children,
  className,
  delay = 0,
  staggerChildren,
}: AnimatedSectionProps) => {
  const reducedMotion = useReducedMotion();
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  let optimizedDuration = 0.45;
  if (reducedMotion) {
    optimizedDuration = 0;
  } else if (isMobile) {
    optimizedDuration = 0.3;
  }

  let optimizedStagger: number | undefined;
  if (!reducedMotion && staggerChildren) {
    optimizedStagger = isMobile ? staggerChildren * 0.7 : staggerChildren;
  }

  const optimizedDelay = isMobile ? delay * 0.5 : delay;

  if (reducedMotion) {
    return <section className={className}>{children}</section>;
  }

  return (
    <motion.section
      className={className}
      initial="hidden"
      animate="visible"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={{
        hidden: { opacity: 0, y: isMobile ? 10 : 16 },
        visible: optimizedStagger
          ? {
              opacity: 1,
              y: 0,
              transition: {
                staggerChildren: optimizedStagger,
                delay: optimizedDelay,
                duration: optimizedDuration,
              },
            }
          : {
              opacity: 1,
              y: 0,
              transition: {
                delay: optimizedDelay,
                duration: optimizedDuration,
              },
            },
      }}
    >
      {children}
    </motion.section>
  );
};
