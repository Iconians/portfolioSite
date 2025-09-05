export const dynamic = "force-dynamic";
import { getAllPosts, getPostBySlug } from "@/app/lib/mdx";
import BlogPostClient from "@/app/Components/BlogPostClient/BlogPostClient";
import styles from "../blogPage.module.css";
import Nav from "@/app/Components/Nav/Nav";
import ClientWrapper from "@/app/Components/ClientWrapper/ClientWrapper";
import Link from "next/link";

interface BlogPageProps {
  params: { slug: string };
}

export const dynamicParams = true;

export default async function BlogPost({ params }: BlogPageProps) {
  try {
    const { frontMatter, mdxSource } = await getPostBySlug(params.slug);

    return (
      <div className={styles.slugPage}>
        <Nav />
        {/* mark BlogPostClient as client component */}
        <ClientWrapper>
          <BlogPostClient frontMatter={frontMatter} mdxSource={mdxSource} />
        </ClientWrapper>
      </div>
    );
  } catch (error) {
    console.error(`Error loading blog post with slug "${params.slug}":`, error);
    return (
      <div className={styles.slugPage}>
        <Nav />
        <div style={{ padding: "2rem", textAlign: "center" }}>
          <h1>Post Not Found</h1>
          <p>The blog post you&apos;re looking for doesn&apos;t exist.</p>
          <Link
            href="/blogs"
            style={{ color: "#0070f3", textDecoration: "none" }}
          >
            ← Back to Blog
          </Link>
        </div>
      </div>
    );
  }
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}
