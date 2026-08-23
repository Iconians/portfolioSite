import { ArrowRight } from "lucide-react";

import { Section } from "@/components/layout/Section";
import { Inline , Stack } from "@/components/layout/Stack";
import { Heading } from "@/components/typography/Heading";
import { Text } from "@/components/typography/Text";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/ui/link";
import { getArticleCoverImage } from "@/lib/articles/article-cover";

import BlogCard from "../blog-card/BlogCard";

import type { FrontMatter } from "@/lib/mdx";
import type { Article } from "@/lib/types/articles";

interface Post {
  slug: string;
  frontMatter: FrontMatter;
}

interface FeaturedArticlesProps {
  initialArticles: Article[];
}

export default function FeaturedArticles({
  initialArticles,
}: FeaturedArticlesProps) {
  const featuredPosts: Post[] = initialArticles
    .filter((article) => article.featured === true)
    .slice(0, 3)
    .map((article) => {
      const cover = getArticleCoverImage(article);

      return {
        slug: article.slug,
        frontMatter: {
          title: article.title,
          description: article.description || "",
          date:
            article.date instanceof Date
              ? article.date.toISOString().split("T")[0]
              : String(article.date),
          featured: true,
          coverImageUrl: cover?.url,
          coverImageAlt: cover?.alt,
        } as FrontMatter,
      };
    });

  if (featuredPosts.length === 0) {
    return null;
  }

  return (
    <Section id="writing" className="py-16">
      <Stack gap="sm" className="mb-12">
        <Heading variant="eyebrow">WRITING</Heading>
        <Heading level={2}>Engineering articles</Heading>
        <Text variant="description">
          Technical writing on algorithms, data structures, migrations, and
          engineering practice.
        </Text>
      </Stack>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {featuredPosts.map((post) => (
          <Link
            key={post.slug}
            href={`/blogs/${post.slug}`}
            className="no-underline hover:no-underline"
          >
            <BlogCard
              title={post.frontMatter.title}
              description={post.frontMatter.description}
              date={post.frontMatter.date}
              coverImageUrl={post.frontMatter.coverImageUrl}
              coverImageAlt={post.frontMatter.coverImageAlt}
            />
          </Link>
        ))}
      </div>

      <Inline className="justify-center">
        <Button variant="outline" asChild>
          <Link href="/blogs" className="no-underline hover:no-underline">
            View All Articles
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </Inline>
    </Section>
  );
}
