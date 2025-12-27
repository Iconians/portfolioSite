"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import BlogCard from "../BlogCard.tsx/BlogCard";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import type { FrontMatter } from "@/app/lib/mdx";

interface Post {
  slug: string;
  frontMatter: FrontMatter;
}

export default function FeaturedArticles() {
  const [featuredPosts, setFeaturedPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch("/api/articles");
        if (!response.ok) {
          throw new Error("Failed to fetch articles");
        }
        const data = await response.json();
        const articles = data.articles || [];

        // Convert articles to posts format and filter featured
        const posts: Post[] = articles
          .filter((article: { featured: boolean }) => article.featured === true)
          .slice(0, 3)
          .map(
            (article: {
              slug: string;
              title: string;
              description?: string;
              date: Date;
            }) => ({
              slug: article.slug,
              frontMatter: {
                title: article.title,
                description: article.description || "",
                date:
                  article.date instanceof Date
                    ? article.date.toISOString().split("T")[0]
                    : article.date,
                featured: true,
              } as FrontMatter,
            })
          );

        setFeaturedPosts(posts);
      } catch (error) {
        console.error("Failed to load featured articles:", error);
        setFeaturedPosts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (isLoading) {
    return (
      <section className="py-16">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Featured Articles
          </h2>
          <p className="text-muted-foreground text-lg">
            Latest articles on algorithms, data structures, and web development
          </p>
        </div>
        <div className="text-center py-8">Loading articles...</div>
      </section>
    );
  }

  if (featuredPosts.length === 0) {
    return null;
  }

  return (
    <section className="py-16">
      <div className="mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Featured Articles
        </h2>
        <p className="text-muted-foreground text-lg">
          Latest articles on algorithms, data structures, and web development
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {featuredPosts.map((post) => (
          <Link key={post.slug} href={`/blogs/${post.slug}`}>
            <BlogCard
              title={post.frontMatter.title}
              description={post.frontMatter.description}
              date={post.frontMatter.date}
            />
          </Link>
        ))}
      </div>
      <div className="text-center">
        <Button variant="outline" asChild>
          <Link href="/blogs">
            View All Articles
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
