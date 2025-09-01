import Link from "next/link";
import { getAllPosts } from "../lib/mdx";
import styles from "./blogPage.module.css";
import BlogCard from "../Components/BlogCard.tsx/BlogCard";
import Nav from "../Components/Nav/Nav";

export default async function BlogIndex() {
  const posts = getAllPosts();

  return (
    <div>
      <Nav />
      <div className={styles.blogGrid}>
        {posts.map((post) => (
          <Link key={post.slug} href={`/Blogs/${post.slug}`}>
            <BlogCard
              title={post.frontMatter.title}
              description={post.frontMatter.description}
              date={post.frontMatter.date}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
