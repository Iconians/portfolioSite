import { notFound } from "next/navigation";

import BlogPostClient from "@/components/BlogPostClient/BlogPostClient";
import { Container } from "@/components/layout/Container";
import { Navigation } from "@/components/Nav/Navigation";
import { getPostBySlug } from "@/lib/mdx";

interface BlogPostProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPost({ params }: BlogPostProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      <Navigation />
      <Container as="main" className="py-16">
        <BlogPostClient frontMatter={post.frontMatter} mdxSource={post.mdxSource} />
      </Container>
    </div>
  );
}
