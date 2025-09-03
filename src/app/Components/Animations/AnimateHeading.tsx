"use client";
import React from "react";
import { motion } from "framer-motion";

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
  const motionTags = {
    h1: motion.h1,
    h2: motion.h2,
    h3: motion.h3,
    h4: motion.h4,
    h5: motion.h5,
    h6: motion.h6,
  };
  const tag = `h${level}` as keyof typeof motionTags;
  const MotionTag = motionTags[tag] || motion.h2;

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      style={{ marginTop: "1.5em", marginBottom: "0.5em", textAlign: "center" }}
    >
      {children}
    </MotionTag>
  );
}
