"use client";
import { motion } from "framer-motion";
import { ReactNode } from "react";
import styles from "./animations.module.css";

type AnimatedParagraphsProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
};

export default function AnimatedParagraph({
  children,
  delay,
  className,
}: AnimatedParagraphsProps) {
  // Optimize for mobile
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <motion.div
      initial={{ opacity: 0, y: isMobile ? 8 : 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{
        duration: isMobile ? 0.3 : 0.5,
        ease: "easeOut",
        delay: isMobile ? (delay || 0) * 0.5 : delay,
      }}
      className={className ? `${styles.animationP} ${className}` : styles.animationP}
    >
      {children}
    </motion.div>
  );
}
