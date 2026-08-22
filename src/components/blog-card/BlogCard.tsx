"use client";

import { motion } from "framer-motion";

import { ArticleCard } from "@/components/patterns/ArticleCard";

interface BlogCardProps {
  title: string;
  description?: string;
  date?: string;
  coverImageUrl?: string;
  coverImageAlt?: string;
}

const item = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0 },
};

export default function BlogCard({
  title,
  description,
  date,
  coverImageUrl,
  coverImageAlt,
}: BlogCardProps) {
  return (
    <motion.div
      variants={item}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <ArticleCard
        title={title}
        description={description}
        date={date}
        coverImageUrl={coverImageUrl}
        coverImageAlt={coverImageAlt}
      />
    </motion.div>
  );
}
