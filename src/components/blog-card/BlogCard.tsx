"use client";

import { motion } from "framer-motion";

import { ArticleCard } from "@/components/patterns/ArticleCard";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";

interface BlogCardProps {
  title: string;
  description?: string;
  date?: string;
  primaryTag?: string;
  readTimeMinutes?: number;
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
  primaryTag,
  readTimeMinutes,
  coverImageUrl,
  coverImageAlt,
}: BlogCardProps) {
  const reducedMotion = useReducedMotion();

  const card = (
    <ArticleCard
      title={title}
      description={description}
      date={date}
      primaryTag={primaryTag}
      readTimeMinutes={readTimeMinutes}
      coverImageUrl={coverImageUrl}
      coverImageAlt={coverImageAlt}
    />
  );

  if (reducedMotion) {
    return <div>{card}</div>;
  }

  return (
    <motion.div
      variants={item}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
    >
      {card}
    </motion.div>
  );
}
