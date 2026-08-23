// "use client";

import { motion } from "framer-motion";
import { type ReactNode } from "react";

import { useReducedMotion } from "@/lib/motion/use-reduced-motion";
import { cn } from "@/lib/utils";

type AnimatedParagraphsProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
};

const paragraphClassName =
  "mb-4 text-[1.1rem] leading-relaxed text-foreground max-md:text-base max-[480px]:text-[clamp(0.9rem,4vw,1rem)] max-[480px]:leading-relaxed [&_p]:m-0";

export default function AnimatedParagraph({
  children,
  delay,
  className,
}: AnimatedParagraphsProps) {
  const reducedMotion = useReducedMotion();
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const mergedClassName = cn(paragraphClassName, className);

  if (reducedMotion) {
    return <div className={mergedClassName}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: isMobile ? 8 : 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{
        duration: isMobile ? 0.3 : 0.45,
        ease: "easeOut",
        delay: isMobile ? (delay || 0) * 0.5 : delay,
      }}
      className={mergedClassName}
    >
      {children}
    </motion.div>
  );
}
