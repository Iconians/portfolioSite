"use client";
import { motion } from "framer-motion";
import Nav from "./Nav";

export const NavClient = () => {
  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Nav />
    </motion.div>
  );
};
