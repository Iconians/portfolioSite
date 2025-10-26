"use client";
import React from "react";
import { motion } from "framer-motion";

type animatedLists = {
  children: React.ReactNode;
  className?: string;
};

export default function AnimatedList({ children, className }: animatedLists) {
  return (
    <motion.ul
      className={className}
      initial="hidden"
      animate="visible"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
    >
      {children}
    </motion.ul>
  );
}

export function AnimatedListItem({ children, className }: animatedLists) {
  return (
    <motion.li
      className={className}
      // style={{ listStyle: "none" }}
      variants={{
        hidden: { opacity: 0, x: -10 },
        visible: { opacity: 1, x: 0 },
      }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.li>
  );
}
