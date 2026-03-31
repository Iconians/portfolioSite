"use client";
import React from "react";

interface AnimatedCodeProps {
  children: string;
  language?: string;
  delay?: number; // milliseconds before animation starts
}

// During static generation, render a simple code block without animation
// The animated version will be rendered on the client via dynamic import in BlogPostClient
export const AnimatedCode: React.FC<AnimatedCodeProps> = ({
  children,
  language = "javascript",
  delay = 0,
}) => {
  // Render a plain code block during SSR/static generation
  // This avoids any issues with framer-motion or react-syntax-highlighter
  return (
    <div
      style={{
        borderRadius: "0.5rem",
        overflow: "hidden",
        padding: "1rem",
        backgroundColor: "#272822",
        color: "#f8f8f2",
        margin: 0,
        fontSize: "clamp(12px, 2.5vw, 14px)",
        lineHeight: "1.5em",
      }}
    >
      <pre
        style={{
          margin: 0,
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          fontFamily: "monospace",
        }}
      >
        {children}
      </pre>
    </div>
  );
};
