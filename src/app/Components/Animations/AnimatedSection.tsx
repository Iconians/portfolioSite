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
  return (
    <motion.section
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: staggerChildren
          ? { opacity: 1, y: 0, transition: { staggerChildren, delay } }
          : { opacity: 1, y: 0, transition: { delay, duration: 0.5 } },
      }}
    >
      {children}
    </motion.section>
  );
};
