"use client";
import React from "react";
import { motion } from "framer-motion";

type AnimatedWrapperType = {
  children: React.ReactNode;
  className?: string;
};

export default function AnimatedWrapper({
  children,
  className,
}: AnimatedWrapperType) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.4 }}
    >
      {children}
    </motion.div>
  );
}
