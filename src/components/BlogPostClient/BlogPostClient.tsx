"use client";
import dynamic from "next/dynamic";
import { MDXRemote , type MDXRemoteSerializeResult } from "next-mdx-remote";

const BLOG_ARTICLE_CLASS =
  "mx-auto max-w-[900px] px-4 py-6 leading-relaxed sm:px-6 [&_a]:text-primary [&_a]:no-underline hover:[&_a]:underline [&_p]:mb-4 [&_p]:text-[1.1rem] sm:[&_p]:text-base max-sm:[&_*]:max-w-full max-sm:[&_p]:text-[clamp(0.9rem,4vw,1rem)]";

// Dynamically import animated components to prevent SSR issues
const AnimatedHeading = dynamic(
  () =>
    import("@/components/Animations/AnimateHeading").then(
      (mod) => mod.default
    ),
  { ssr: false }
);

const AnimatedList = dynamic(
  () =>
    import("@/components/Animations/AnimatedList").then(
      (mod) => mod.default
    ),
  { ssr: false }
);

const AnimatedListItem = dynamic(
  () =>
    import("@/components/Animations/AnimatedList").then(
      (mod) => mod.AnimatedListItem
    ),
  { ssr: false }
);

const AnimatedParagraph = dynamic(
  () =>
    import("@/components/Animations/AnimatedParagraphs").then(
      (mod) => mod.default
    ),
  { ssr: false }
);

const AnimatedWrapper = dynamic(
  () =>
    import("@/components/Animations/AnimatedWrapper").then(
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
      function MotionArticleWrapperInner({
        children,
      }: {
        children: React.ReactNode;
      }) {
        return (
          <mod.motion.article
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className={BLOG_ARTICLE_CLASS}
          >
            {children}
          </mod.motion.article>
        );
      }
      MotionArticleWrapperInner.displayName = "MotionArticleWrapper";
      return MotionArticleWrapperInner;
    }),
  { ssr: false }
);

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

  // During SSR/static generation, render a simple placeholder
  // Everything loads on the client after hydration
  if (typeof window === "undefined") {
    return (
      <article className={BLOG_ARTICLE_CLASS}>
        {coverHeader}
        <div>Loading content...</div>
      </article>
    );
  }

  // On client, render with all animations
  const content = (
    <>
      {coverHeader}
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
    </>
  );

  return <MotionArticleWrapper>{content}</MotionArticleWrapper>;
}
