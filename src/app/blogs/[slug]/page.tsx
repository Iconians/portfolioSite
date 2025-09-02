import { getAllPosts, getPostBySlug } from "@/app/lib/mdx";
import BlogPostClient from "@/app/Components/BlogPostClient/BlogPostClient";
import styles from "@/app/Blogs/blogPage.module.css";
import Nav from "@/app/Components/Nav/Nav";

export const dynamicParams = true;

export default async function BlogPost({
  params,
}: {
  params: { slug: string };
}) {
  const { frontMatter, mdxSource } = await getPostBySlug(params.slug);

  return (
    <div className={styles.page}>
      <Nav />
      <BlogPostClient frontMatter={frontMatter} mdxSource={mdxSource} />
    </div>
  );
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}
