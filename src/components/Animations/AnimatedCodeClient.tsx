"use client";
// This file is only loaded on the client - never during SSR/static generation
import { motion } from "framer-motion";
import { Prism } from "react-syntax-highlighter";
import { okaidia } from "react-syntax-highlighter/dist/cjs/styles/prism";
import React from "react";

interface AnimatedCodeClientProps {
  children: string;
  language: string;
  delay: number;
}

export function AnimatedCodeClient({
  children,
  language,
  delay,
}: AnimatedCodeClientProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay: delay / 1000,
        ease: "easeOut",
      }}
      style={{
        borderRadius: "0.5rem",
        overflow: "hidden",
      }}
    >
      <Prism
        language={language}
        style={okaidia}
        customStyle={{
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
        }}
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
    </motion.div>
  );
}
