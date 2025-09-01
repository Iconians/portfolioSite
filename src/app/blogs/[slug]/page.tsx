import { getPostBySlug } from "@/app/lib/mdx";
import BlogPostClient from "@/app/Components/BlogPostClient/BlogPostClient";
import styles from "../blogPage.module.css";
import Nav from "@/app/Components/Nav/Nav";

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
