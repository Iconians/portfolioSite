"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Navigation } from "@/app/Components/Nav/Navigation";
import ClientWrapper from "@/app/Components/ClientWrapper/ClientWrapper";
import BlogPostClient from "@/app/Components/BlogPostClient/BlogPostClient";
import type { MDXRemoteSerializeResult } from "next-mdx-remote";
import type { FrontMatter } from "@/app/lib/mdx";

export default function BlogPost() {
  const params = useParams();
  const slug = params?.slug as string;
  const [post, setPost] = useState<{
    frontMatter: FrontMatter;
    mdxSource: MDXRemoteSerializeResult;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/articles/${slug}`);
        if (!response.ok) {
          if (response.status === 404) {
            setError("Article not found");
          } else {
            setError("Failed to load article");
          }
          return;
        }
        const data = await response.json();
        setPost(data.article);
      } catch (err) {
        console.error("Failed to load article:", err);
        setError("Failed to load article");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-16 max-w-7xl w-full">
          <div className="text-center py-8">Loading article...</div>
        </main>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen w-full bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-16 max-w-7xl w-full">
          <div className="text-center py-8">
            <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
            <p className="text-muted-foreground mb-4">
              {error || "The article you're looking for doesn't exist."}
            </p>
            <a href="/blogs" className="text-primary hover:underline">
              ← Back to Blog
            </a>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-16 max-w-7xl w-full">
        <ClientWrapper>
          <BlogPostClient
            frontMatter={post.frontMatter}
            mdxSource={post.mdxSource}
          />
        </ClientWrapper>
      </main>
    </div>
  );
}
