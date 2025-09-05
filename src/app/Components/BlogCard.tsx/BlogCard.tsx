"use client";
import React from "react";
import { motion } from "framer-motion";
import styles from "./BlogCard.module.css";

interface BlogCardProps {
  title: string;
  description?: string;
  date?: string;
}

const item = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0 },
};

export default function BlogCard({ title, description, date }: BlogCardProps) {
  return (
    <motion.div
      className={styles.blogCard}
      variants={item}
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.3 }}
      // className={styles.blogCard}
      // whileHover={{ scale: 1.03, y: -2 }}
      // whileTap={{ scale: 0.97 }}
      // initial={{ opacity: 0, y: 10 }}
      // animate={{ opacity: 1, y: 0 }}
      // transition={{ duration: 0.3 }}
    >
      <h3 className={styles.h3}>{title}</h3>
      {description && <p className={styles.p}>{description}</p>}
      {date && <small className={styles.small}>{date}</small>}
    </motion.div>
  );
}
