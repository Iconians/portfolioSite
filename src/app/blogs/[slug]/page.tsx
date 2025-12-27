import { getAllPosts, getPostBySlug } from "@/app/lib/mdx";
import dynamicImport from "next/dynamic";
import { Navigation } from "@/app/Components/Nav/Navigation";
import ClientWrapper from "@/app/Components/ClientWrapper/ClientWrapper";
import Link from "next/link";
import { notFound } from "next/navigation";

// Dynamically import BlogPostClient to prevent any hook evaluation during static generation
// Note: Can't use ssr: false in Server Components, but dynamic import still helps
const BlogPostClient = dynamicImport(
  () =>
    import("@/app/Components/BlogPostClient/BlogPostClient").then(
      (mod) => mod.default
    ),
  {
    loading: () => (
      <article className="min-h-[400px] flex items-center justify-center">
        <div>Loading blog post...</div>
      </article>
    ),
  }
);

interface BlogPageProps {
  params: Promise<{ slug: string }>;
}

// Disable static generation for blog posts - they're client-heavy with animations
// This prevents framer-motion evaluation during build
export const dynamic = "force-dynamic";
export const dynamicParams = true;

export default async function BlogPost({ params }: BlogPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const { frontMatter, mdxSource } = post;

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
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug })) as { slug: string }[];
}
