"use client";

import { motion } from "framer-motion";
import { useState } from "react";

import { Inline } from "@/components/layout/Stack";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/ui/link";
import {
  BLOG_TAG_FILTERS,
  articleMatchesTagFilter,
  type BlogTagFilter,
} from "@/lib/articles/blog-tags";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";

import BlogCard from "../blog-card/BlogCard";

import type { FrontMatter } from "@/lib/mdx";
import type { ReactNode } from "react";

type Post = {
  slug: string;
  frontMatter: FrontMatter;
};

const container = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

export default function BlogGrid({ posts }: { posts: Post[] }) {
  const [activeFilter, setActiveFilter] = useState<BlogTagFilter>("All");
  const reducedMotion = useReducedMotion();

  const filteredPosts = posts.filter((post) =>
    articleMatchesTagFilter(post.frontMatter.tags, activeFilter)
  );

  const gridClassName =
    "grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3";

  const articleGrid = filteredPosts.map((post) => (
    <Link
      key={post.slug}
      href={`/blogs/${post.slug}`}
      className="rounded-xl no-underline hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <BlogCard
        title={post.frontMatter.title}
        description={post.frontMatter.description}
        date={post.frontMatter.date}
        primaryTag={post.frontMatter.primaryTag}
        readTimeMinutes={post.frontMatter.readTimeMinutes}
        coverImageUrl={post.frontMatter.coverImageUrl}
        coverImageAlt={post.frontMatter.coverImageAlt}
      />
    </Link>
  ));

  let postsGrid: ReactNode;
  if (filteredPosts.length === 0) {
    postsGrid = (
      <p className="text-sm text-muted-foreground">
        No articles match this filter.
      </p>
    );
  } else if (reducedMotion) {
    postsGrid = <div className={gridClassName}>{articleGrid}</div>;
  } else {
    postsGrid = (
      <motion.div
        className={gridClassName}
        initial="hidden"
        animate="visible"
        variants={container}
      >
        {articleGrid}
      </motion.div>
    );
  }

  return (
    <div className="space-y-8">
      <Inline gap="sm" className="flex-wrap">
        {BLOG_TAG_FILTERS.map((filter) => (
          <Button
            key={filter}
            type="button"
            size="sm"
            variant={activeFilter === filter ? "default" : "outline"}
            aria-pressed={activeFilter === filter}
            className="max-[768px]:min-h-11"
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </Button>
        ))}
      </Inline>

      {postsGrid}
    </div>
  );
}
