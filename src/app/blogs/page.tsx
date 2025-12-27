"use client";

import { useEffect, useState } from "react";
import { Navigation } from "@/app/Components/Nav/Navigation";
import BlogGrid from "../Components/blogWrapper/blogWrapper";
import type { FrontMatter } from "@/app/lib/mdx";

interface Post {
  slug: string;
  frontMatter: FrontMatter;
}

export default function BlogIndex() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/articles");
        if (!response.ok) {
          throw new Error("Failed to fetch articles");
        }
        const data = await response.json();
        const articles = data.articles || [];

        // Convert articles to posts format
        const postsData: Post[] = articles.map(
          (article: {
            slug: string;
            title: string;
            description?: string;
            date: Date;
            tags?: string[];
            featured?: boolean;
          }) => ({
            slug: article.slug,
            frontMatter: {
              title: article.title,
              description: article.description || "",
              date:
                article.date instanceof Date
                  ? article.date.toISOString().split("T")[0]
                  : article.date,
              tags: article.tags || [],
              featured: article.featured || false,
            } as FrontMatter,
          })
        );

        setPosts(postsData);
      } catch (error) {
        console.error("Failed to load articles:", error);
        setPosts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen w-full bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-16 max-w-7xl w-full">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Here are some of my Articles
          </h2>
        </div>
        {isLoading ? (
          <div className="text-center py-8">Loading articles...</div>
        ) : (
          <BlogGrid posts={posts} />
        )}
      </main>
    </div>
  );
}
