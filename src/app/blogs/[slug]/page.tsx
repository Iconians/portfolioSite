import { getAllPosts, getPostBySlug } from "@/app/lib/mdx";
import BlogPostClient from "@/app/Components/BlogPostClient/BlogPostClient";
import styles from "../blogPage.module.css";
import Nav from "@/app/Components/Nav/Nav";

interface BlogPageProps {
  params: { slug: string };
}

export const dynamicParams = true;

export default async function BlogPost({ params }: BlogPageProps) {
  const { frontMatter, mdxSource } = await getPostBySlug(params.slug);

  return (
    <div className={styles.page}>
      <Nav />
      {/* mark BlogPostClient as client component */}
      <BlogPostClient frontMatter={frontMatter} mdxSource={mdxSource} />
    </div>
  );
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}
