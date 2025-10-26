import path from "path";
import fs from "fs";
import matter from "gray-matter";
import { serialize } from "next-mdx-remote/serialize";

export interface FrontMatter {
  title: string;
  description: string;
  date: string;
}

const POSTS_PATH = path.join(process.cwd(), "src/app/lib/content/posts");

export const getPostBySlug = async (slug: string) => {
  // Get all files and find the one that matches the slug
  const fileNames = fs
    .readdirSync(POSTS_PATH)
    .filter((name) => name.endsWith(".mdx"));

  const targetFile = fileNames.find((fileName) => {
    const fileSlug = fileName
      .replace(".mdx", "")
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
    return fileSlug === slug;
  });

  if (!targetFile) {
    throw new Error(`Post with slug "${slug}" not found`);
  }

  const fullPath = path.join(POSTS_PATH, targetFile);
  const source = fs.readFileSync(fullPath, "utf8");
  const { content, data } = matter(source);
  const mdxSource = await serialize(content);

  return {
    frontMatter: data as FrontMatter,
    mdxSource,
  };
};

export const getAllPosts = async () => {
  const fileNames = fs
    .readdirSync(POSTS_PATH)
    .filter((name) => name.endsWith(".mdx"));
  return fileNames.map((fileName) => {
    // Create a URL-friendly slug by removing .mdx and converting special characters
    const slug = fileName
      .replace(".mdx", "")
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-") // Replace any non-alphanumeric characters with hyphens
      .replace(/-+/g, "-") // Replace multiple consecutive hyphens with single hyphen
      .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens

    const fullPath = path.join(POSTS_PATH, fileName);
    const source = fs.readFileSync(fullPath, "utf8");
    const { data } = matter(source);
    return { slug, frontMatter: data as FrontMatter };
  });
};
