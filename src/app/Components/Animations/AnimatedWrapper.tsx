"use client";
import React from "react";
import { motion } from "framer-motion";

type AnimatedWrapperType = {
  children: React.ReactNode;
};

export default function AnimatedWrapper({ children }: AnimatedWrapperType) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      {children}
    </motion.div>
  );
}
