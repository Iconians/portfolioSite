"use client";

import { motion } from "framer-motion";
import { MDXRemote, type MDXRemoteSerializeResult } from "next-mdx-remote";

import AnimatedList, {
  AnimatedListItem,
} from "@/components/Animations/AnimatedList";
import AnimatedParagraph from "@/components/Animations/AnimatedParagraphs";
import AnimatedWrapper from "@/components/Animations/AnimatedWrapper";
import AnimatedHeading from "@/components/Animations/AnimateHeading";
import { BLOG_PROSE_CLASS } from "@/lib/articles/blog-prose";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";

import {
  AnimatedCode,
  MdxCodeBlock,
  MdxPre,
} from "./MdxCodeBlock";

const mdxComponents = {
  AnimatedHeading,
  AnimatedList,
  AnimatedListItem,
  AnimatedWrapper,
  AnimatedParagraph,
  AnimatedCode,
  code: MdxCodeBlock,
  pre: MdxPre,
};

function ArticleProseWrapper({ children }: { children: React.ReactNode }) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <div className={BLOG_PROSE_CLASS}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={BLOG_PROSE_CLASS}
    >
      {children}
    </motion.div>
  );
}

interface FrontMatter {
  title: string;
  description?: string;
  date?: string;
  tags?: string[];
  coverImageUrl?: string;
  coverImageAlt?: string;
}

interface BlogPostClientProps {
  frontMatter: FrontMatter;
  mdxSource: MDXRemoteSerializeResult;
}

export default function BlogPostClient({
  frontMatter,
  mdxSource,
}: BlogPostClientProps) {
  const coverImageUrl = frontMatter.coverImageUrl;
  const coverImageAlt = frontMatter.coverImageAlt || frontMatter.title;

  const coverHeader = coverImageUrl ? (
    <div className="relative mb-8 aspect-[21/9] overflow-hidden rounded-xl bg-muted">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={coverImageUrl}
        alt={coverImageAlt}
        className="h-full w-full object-cover"
      />
    </div>
  ) : null;

  return (
    <ArticleProseWrapper>
      {coverHeader}
      <MDXRemote {...mdxSource} components={mdxComponents} />
    </ArticleProseWrapper>
  );
}
