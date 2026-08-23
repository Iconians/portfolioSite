import { motion } from "framer-motion";
import React from "react";

import { useReducedMotion } from "@/lib/motion/use-reduced-motion";

type AnimatedWrapperType = {
  children: React.ReactNode;
  className?: string;
};

export default function AnimatedWrapper({
  children,
  className,
}: AnimatedWrapperType) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.35 }}
    >
      {children}
    </motion.div>
  );
}
