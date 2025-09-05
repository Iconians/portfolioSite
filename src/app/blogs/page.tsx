import Link from "next/link";
import { getAllPosts } from "@/app/lib/mdx";
import styles from "./blogPage.module.css";
import BlogCard from "@/app/Components/BlogCard.tsx/BlogCard";
import Nav from "@/app/Components/Nav/Nav";
import BlogGrid from "../Components/blogWrapper/blogWrapper";

export default async function BlogIndex() {
  const posts = await getAllPosts();
  return (
    <div className={styles.blogPage}>
      <Nav />
      <div>
        <h2>Here are some of my Articles</h2>
      </div>
      <BlogGrid posts={posts} />
    </div>
  );
}
