"use client";
import React from "react";
import { motion } from "framer-motion";

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
  // Optimize animations for mobile
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const optimizedDelay = isMobile ? delay * 0.5 : delay;
  const optimizedDuration = isMobile ? 0.3 : 0.5;
  const optimizedStagger =
    isMobile && staggerChildren ? staggerChildren * 0.7 : staggerChildren;

  return (
    <motion.section
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={{
        hidden: { opacity: 0, y: isMobile ? 10 : 20 },
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
