"use client";

import { motion } from "framer-motion";
import styles from "@/app/blogs/blogPage.module.css";
import BlogCard from "../BlogCard.tsx/BlogCard";
import { FrontMatter } from "@/app/lib/mdx";

type Post = {
  slug: string;
  frontMatter: FrontMatter;
};

const container = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15, // controls the delay between cards
    },
  },
};

export default function BlogGrid({ posts }: { posts: Post[] }) {
  return (
    <motion.div
      className={styles.blogGrid}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={container}
    >
      {posts.map((post) => (
        <BlogCard
          key={post.slug}
          title={post.frontMatter.title}
          description={post.frontMatter.description}
          date={post.frontMatter.date}
        />
      ))}
    </motion.div>
  );
}
