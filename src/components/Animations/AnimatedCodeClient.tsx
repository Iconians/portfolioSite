import { motion } from "framer-motion";
import React from "react";
import { Prism } from "react-syntax-highlighter";
import { okaidia } from "react-syntax-highlighter/dist/cjs/styles/prism";

import { useReducedMotion } from "@/lib/motion/use-reduced-motion";

interface AnimatedCodeClientProps {
  children: string;
  language: string;
  delay: number;
}

const codeBlockStyle: React.CSSProperties = {
  borderRadius: "0.5rem",
  overflow: "hidden",
};

const prismCustomStyle: React.CSSProperties = {
  margin: 0,
  padding: "1rem",
  fontSize: "clamp(12px, 2.5vw, 14px)",
  lineHeight: "1.5em",
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
  overflowX: "hidden",
  maxWidth: "100%",
  width: "100%",
  boxSizing: "border-box",
};

export function AnimatedCodeClient({
  children,
  language,
  delay,
}: AnimatedCodeClientProps) {
  const reducedMotion = useReducedMotion();

  const prismBlock = (
    <Prism
      language={language}
      style={okaidia}
      customStyle={prismCustomStyle}
      wrapLines={true}
      wrapLongLines={true}
      codeTagProps={{
        style: {
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          overflowWrap: "break-word",
          fontSize: "inherit",
          maxWidth: "100%",
          width: "100%",
        } as React.CSSProperties,
      }}
    >
      {children}
    </Prism>
  );

  if (reducedMotion) {
    return <div style={codeBlockStyle}>{prismBlock}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.45,
        delay: delay / 1000,
        ease: "easeOut",
      }}
      style={codeBlockStyle}
    >
      {prismBlock}
    </motion.div>
  );
}
