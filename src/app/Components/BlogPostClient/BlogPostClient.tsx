"use client";
import { MDXRemote } from "next-mdx-remote";
import dynamic from "next/dynamic";
import styles from "./blogPostClient.module.css";
import { MDXRemoteSerializeResult } from "next-mdx-remote";

// Dynamically import animated components to prevent SSR issues
const AnimatedHeading = dynamic(
  () =>
    import("@/app/Components/Animations/AnimateHeading").then(
      (mod) => mod.default
    ),
  { ssr: false }
);

const AnimatedList = dynamic(
  () =>
    import("@/app/Components/Animations/AnimatedList").then(
      (mod) => mod.default
    ),
  { ssr: false }
);

const AnimatedListItem = dynamic(
  () =>
    import("@/app/Components/Animations/AnimatedList").then(
      (mod) => mod.AnimatedListItem
    ),
  { ssr: false }
);

const AnimatedParagraph = dynamic(
  () =>
    import("@/app/Components/Animations/AnimatedParagraphs").then(
      (mod) => mod.default
    ),
  { ssr: false }
);

const AnimatedWrapper = dynamic(
  () =>
    import("@/app/Components/Animations/AnimatedWrapper").then(
      (mod) => mod.default
    ),
  { ssr: false }
);

const AnimatedCode = dynamic(
  () => import("../Animations/AnimatedCode").then((mod) => mod.AnimatedCode),
  { ssr: false }
);

// Dynamically import motion wrapper
const MotionArticleWrapper = dynamic(
  () =>
    import("framer-motion").then((mod) => {
      return ({ children }: { children: React.ReactNode }) => (
        <mod.motion.article
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className={styles.blogArticle}
        >
          {children}
        </mod.motion.article>
      );
    }),
  { ssr: false }
);

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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  frontMatter: _frontMatter,
  mdxSource,
}: BlogPostClientProps) {
  // During SSR/static generation, render a simple placeholder
  // Everything loads on the client after hydration
  if (typeof window === "undefined") {
    return (
      <article className={styles.blogArticle}>
        <div>Loading content...</div>
      </article>
    );
  }

  // On client, render with all animations
  const content = (
    <MDXRemote
      {...mdxSource}
      components={{
        AnimatedHeading,
        AnimatedList,
        AnimatedListItem,
        AnimatedWrapper,
        AnimatedParagraph,
        AnimatedCode,
      }}
    />
  );

  return <MotionArticleWrapper>{content}</MotionArticleWrapper>;
}
