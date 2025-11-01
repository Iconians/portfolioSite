export const dynamic = "force-dynamic";
import { getAllPosts, getPostBySlug } from "@/app/lib/mdx";
import BlogPostClient from "@/app/Components/BlogPostClient/BlogPostClient";
import { Navigation } from "@/app/Components/Nav/Navigation";
import ClientWrapper from "@/app/Components/ClientWrapper/ClientWrapper";
import Link from "next/link";

interface BlogPageProps {
  params: { slug: string };
}

export const dynamicParams = true;

export default async function BlogPost({ params }: BlogPageProps) {
  const resolvedParams = await params;
  try {
    const { frontMatter, mdxSource } = await getPostBySlug(resolvedParams.slug);

    return (
      <div className="min-h-screen w-full bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-16 max-w-7xl w-full">
          <ClientWrapper>
            <BlogPostClient frontMatter={frontMatter} mdxSource={mdxSource} />
          </ClientWrapper>
        </main>
      </div>
    );
  } catch (error) {
    console.error(
      `Error loading blog post with slug "${resolvedParams.slug}":`,
      error
    );
    return (
      <div className="min-h-screen w-full bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-16 max-w-7xl w-full">
          <div className="p-8 text-center">
            <h1 className="text-3xl font-bold mb-4">Post Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The blog post you&apos;re looking for doesn&apos;t exist.
            </p>
            <Link href="/blogs" className="text-primary hover:underline">
              ← Back to Blog
            </Link>
          </div>
        </main>
      </div>
    );
  }
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug })) as { slug: string }[];
}
