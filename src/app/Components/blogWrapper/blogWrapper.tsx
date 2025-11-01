"use client";

import { motion } from "framer-motion";
import Link from "next/link";
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
      className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      initial="hidden"
      animate="visible"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={container}
    >
      {posts.map((post) => (
        <Link key={post.slug} href={`/blogs/${post.slug}`}>
          <BlogCard
            title={post.frontMatter.title}
            description={post.frontMatter.description}
            date={post.frontMatter.date}
          />
        </Link>
      ))}
    </motion.div>
  );
}
