import { notFound } from "next/navigation";
import { Navigation } from "@/components/Nav/Navigation";
import BlogPostClient from "@/components/BlogPostClient/BlogPostClient";
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
    <div className="min-h-screen w-full bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-16 max-w-7xl w-full">
        <BlogPostClient frontMatter={post.frontMatter} mdxSource={post.mdxSource} />
      </main>
    </div>
  );
}
