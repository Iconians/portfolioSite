"use client";
import { motion } from "framer-motion";
import { MDXRemote } from "next-mdx-remote";
import styles from "./blogPostClient.module.css";

import AnimatedHeading from "../Animations/AnimateHeading";
import AnimatedList, { AnimatedListItem } from "../Animations/AnimatedList";
import AnimatedWrapper from "../Animations/AnimatedWrapper";
import { MDXRemoteSerializeResult } from "next-mdx-remote/rsc";

interface FrontMatter {
  title: string;
  description?: string;
  date?: string;
  tags?: string[];
}

interface BlogPostClientProps {
  frontMatter: FrontMatter;
  mdxSource: MDXRemoteSerializeResult;
}

export default function BlogPostClient({
  frontMatter,
  mdxSource,
}: BlogPostClientProps) {
  return (
    <motion.article
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={styles.blogArticle}
    >
      <MDXRemote
        {...mdxSource}
        components={{
          AnimatedHeading,
          AnimatedList,
          AnimatedListItem,
          AnimatedWrapper,
        }}
      />
    </motion.article>
  );
}
