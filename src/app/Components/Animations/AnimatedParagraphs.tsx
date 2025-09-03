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
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{
        duration: 0.5,
        ease: "easeOut",
        delay,
      }}
      className={styles.animationP}
    >
      {children}
    </motion.div>
  );
}
