import { getPostBySlug } from "@/app/lib/mdx";
import { motion } from "framer-motion";
import styles from "../blogPage.module.css";
import { MDXRemote } from "next-mdx-remote";

export default async function BlogPost({
  params,
}: {
  params: { slug: string };
}) {
  const { frontMatter, mdxSource } = await getPostBySlug(params.slug);

  return (
    <motion.article
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={styles.blogArticle}
    >
      <h1>{frontMatter.title}</h1>
      <MDXRemote {...mdxSource} />
    </motion.article>
  );
}
