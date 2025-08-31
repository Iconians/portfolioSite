"use client";
import React from "react";
import { motion } from "framer-motion";

type animatedLists = {
  children: React.ReactNode;
};

export default function AnimatedList({ children }: animatedLists) {
  return (
    <motion.ul
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
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

export function AnimatedListItem({ children }: animatedLists) {
  return (
    <motion.li
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
