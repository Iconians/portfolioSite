"use client";
import { motion } from "framer-motion";

export function AnimatedContainer({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration:
          typeof window !== "undefined" && window.innerWidth < 768 ? 0.3 : 0.6,
      }}
    >
      {children}
    </motion.div>
  );
}
