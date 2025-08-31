"use client";
import React from "react";
import { motion } from "framer-motion";

interface AnimatedHeadingProps {
  level?: number;
  children: React.ReactNode;
}

export default function AnimatedHeading({
  level = 2,
  children,
}: AnimatedHeadingProps) {
  // Use motion components for each heading level to avoid dynamic tag issues
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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      style={{ marginTop: "1.5em", marginBottom: "0.5em" }}
    >
      {children}
    </MotionTag>
  );
}
