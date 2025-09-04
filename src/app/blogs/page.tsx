import Link from "next/link";
import { getAllPosts } from "@/app/lib/mdx";
import styles from "./blogPage.module.css";
import BlogCard from "@/app/Components/BlogCard.tsx/BlogCard";
import Nav from "@/app/Components/Nav/Nav";

export default async function BlogIndex() {
  const posts = await getAllPosts();
  console.log("Posts loaded:", posts);
  return (
    <div className={styles.blogPage}>
      <Nav />
      <div>
        <h2>Here are some of my Articles</h2>
      </div>
      <div className={styles.blogGrid}>
        {posts.map((post) => (
          <Link key={post.slug} href={`/blogs/${post.slug}`}>
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
